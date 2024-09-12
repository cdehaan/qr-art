import { CorrectionLevelType, QrCodeInformationType } from "../types";
import { genQrCodeSpec } from "./qrVersionData";

export function versionToBlocks(version: number, correctionLevel: CorrectionLevelType, maskPattern: number): QrCodeInformationType {
  const gridSize = version * 4 + 17; // e.g. Version 5 is 37x37

  const qrSpec = genQrCodeSpec();
  const versionInfo = qrSpec.find((v) => v.version === version);
  if(!versionInfo) {
    throw new Error(`Version ${version} not found in QR code specification`);
  }

  const qrCodeInformation: QrCodeInformationType = {
    version: version,
    gridSize: gridSize,
    maskPattern: maskPattern,
    blocks: [],
    pixels: Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({
        type: "data",
        block: null,
        dataBlock: null,
        dataBitIndex: null,
        correctionBlock: null,
        correctionBitIndex: null,
        contentBitIndex: null,
        contentBlock: null,
        fixed: true,
        masks: [],
      }))
    ),
  };

  //#region Fill finder (position) patterns
  for(let x = 0; x < 8; x++) {
    for(let y = 0; y < 8; y++) {
      qrCodeInformation.pixels[x][y].type = "finder";
    }
  }

  for(let x = gridSize - 8; x < gridSize; x++) {
    for(let y = 0; y < 8; y++) {
      qrCodeInformation.pixels[x][y].type = "finder";
    }
  }

  for(let x = 0; x < 8; x++) {
    for(let y = gridSize - 8; y < gridSize; y++) {
      qrCodeInformation.pixels[x][y].type = "finder";
    }
  }
  //#endregion

  //#region Fill alignment patterns
  const alignmentPatterns = qrSpec.find((ap) => ap.version === version)?.alignmentPatterns;
  if (alignmentPatterns) {
    alignmentPatterns.forEach((coordX, indexX) => {
      alignmentPatterns.forEach((coordY, indexY) => {
        if(indexX === 0 && indexY === 0) return;
        if(indexX === alignmentPatterns.length - 1 && indexY === 0) return;
        if(indexX === 0 && indexY === alignmentPatterns.length - 1) return;
        for(let x = -2; x <= 2; x++) {
          for(let y = -2; y <= 2; y++) {
            qrCodeInformation.pixels[coordX + x][coordY + y].type = "alignment";
            if(indexX == 0) {
              qrCodeInformation.pixels[coordX + x][coordY + y].fixed = true; // fix the alignment patterns on the left of the QR code
            }
            else if(indexX === alignmentPatterns.length - 1 && indexY === alignmentPatterns.length - 1) {
              qrCodeInformation.pixels[coordX + x][coordY + y].fixed = true; // fix the alignment patterns on the bottom right of the QR code (visually important)
            }
            else {
              qrCodeInformation.pixels[coordX + x][coordY + y].fixed = false; // don't fix the other alignment patterns
            }
          }
        }
      });
    });
  }
  //#endregion

  //#region Fill format information
  for(let i = 0; i < 8; i++) {
    qrCodeInformation.pixels[8][i].type = "format";
    qrCodeInformation.pixels[i][8].type = "format";
    qrCodeInformation.pixels[8][8].type = "format";
    qrCodeInformation.pixels[gridSize - 1 - i][8].type = "format";
    qrCodeInformation.pixels[gridSize - 1 - i][8].fixed = false;
    qrCodeInformation.pixels[8][gridSize - 1 - i].type = "format";
  }
  //#endregion

  //#region Fill timing patterns
  // the top timing line can be altered, but not the left line
  for(let x = 8; x <= gridSize-9; x++) {
    qrCodeInformation.pixels[x][6].type = "timing";
    qrCodeInformation.pixels[x][6].fixed = false;
  }
  for(let y = 8; y <= gridSize-9; y++) {
    qrCodeInformation.pixels[6][y].type = "timing";
  }
  //#endregion

  //#region Fill version information
  // Top left version information can be altered, the bottom right information cannot
  if(version >= 7) {
    for(let i = 0; i < 6; i++) {
      for(let j = 0; j < 3; j++) {
        qrCodeInformation.pixels[gridSize - 11 + j][i].type = "version";
        qrCodeInformation.pixels[gridSize - 11 + j][i].fixed = false;

        qrCodeInformation.pixels[i][gridSize - 11 + j].type = "version";
      }
    }
  }
  //#endregion

  //#region Fill mask patterns
  for(let patternIndex = 0; patternIndex < 8; patternIndex++) {
    for(let x = 0; x < gridSize; x++) {
      for(let y = 0; y < gridSize; y++) {
        if((x + y) % 2 === 0) {
          qrCodeInformation.pixels[x][y].masks[0] = 1;
        }
        if(y % 2 === 0) {
          qrCodeInformation.pixels[x][y].masks[1] = 1;
        }
        if(x % 3 === 0) {
          qrCodeInformation.pixels[x][y].masks[2] = 1;
        }
        if((x + y) % 3 === 0) {
          qrCodeInformation.pixels[x][y].masks[3] = 1;
        }
        if((Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0) {
          qrCodeInformation.pixels[x][y].masks[4] = 1;
        }
        if((x * y) % 2 + (x * y) % 3 === 0) {
          qrCodeInformation.pixels[x][y].masks[5] = 1;
        }
        if(((x * y) % 2 + (x * y) % 3) % 2 === 0) {
          qrCodeInformation.pixels[x][y].masks[6] = 1;
        }
        if(((x + y) % 2 + (x * y) % 3) % 2 === 0) {
          qrCodeInformation.pixels[x][y].masks[7] = 1;
        }
      }
    }
  }

  //#endregion

  //#region Calculate blocks / datablocks / content blocks / error correction blocks / bit indexes
  let movingUp = true;
  let blockNumber = 1;
  let bitIndex = 7;

  const dataBlocks = versionInfo.correctionLevels.find((cl) => cl.level === correctionLevel)?.dataBlocks;
  const correctionBlocks = versionInfo.correctionLevels.find((cl) => cl.level === correctionLevel)?.correctionBlocks || 0;
  if(!dataBlocks) {
    throw new Error(`Correction level ${correctionLevel} not found in version ${version}`);
  }
  for(let x = gridSize-1; x >= 0; x-=2) {
    if(x === 6) { x--; } // vertical timing pattern is in the way

    for(let y = (movingUp ? gridSize-1 : 0); (movingUp ? y >= 0 : y <= gridSize-1); y = y + (movingUp ? -1 : 1)) {
      for(let step = 0; step < 2; step++) {
        if(qrCodeInformation.pixels[x-step][y].type === "data") {
          qrCodeInformation.pixels[x-step][y].block = blockNumber;
          qrCodeInformation.pixels[x-step][y].dataBitIndex = bitIndex;
          const sequencedBlock = versionInfo.correctionLevels.find((cl) => cl.level === correctionLevel)?.blockSequence[blockNumber-1] || 0;
          if(blockNumber <= dataBlocks) {
            qrCodeInformation.pixels[x-step][y].fixed = false;
            qrCodeInformation.pixels[x-step][y].dataBlock = sequencedBlock;
            if((sequencedBlock-1)*8 + (7 - bitIndex) >= versionInfo.metadataLength) {
              const totalContentBits = sequencedBlock ? (sequencedBlock * 8 + 7 - bitIndex) - versionInfo.metadataLength : 0;
              const contentBlock = Math.floor(totalContentBits / 8);
              const contentBitIndex = 7 - totalContentBits % 8;
              qrCodeInformation.pixels[x-step][y].contentBlock = contentBlock;
              qrCodeInformation.pixels[x-step][y].contentBitIndex = contentBitIndex;
            } else {
              qrCodeInformation.pixels[x-step][y].type = "metadata";
            }
          } else {
            const correctionBlock = blockNumber - dataBlocks;
            const fixedBlock = correctionBlock > (correctionBlocks/2 - 4); // the second half of correction blocks can't be changed
            qrCodeInformation.pixels[x-step][y].type = "correction";
            qrCodeInformation.pixels[x-step][y].correctionBlock = sequencedBlock;
            qrCodeInformation.pixels[x-step][y].correctionBitIndex = bitIndex;
            qrCodeInformation.pixels[x-step][y].fixed = fixedBlock;
          }

          bitIndex--;
          if(bitIndex < 0) {
            bitIndex = 7;
            blockNumber++;
          }
        }
      }
    }

    movingUp = !movingUp;
  }
  //#endregion

  return qrCodeInformation;
}
