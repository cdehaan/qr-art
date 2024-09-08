import { CorrectionLevelType, QrCodeInformationType } from "../types";
import { rawQrCodeSpec, parseQrCodeSpec } from "./qrVersionData";

const versionCapacity = [
  { version: 1, capacity: 17 },
  { version: 2, capacity: 32 },
  { version: 3, capacity: 53 },
  { version: 4, capacity: 78 },
  { version: 5, capacity: 106 },
  { version: 6, capacity: 134 },
  { version: 7, capacity: 154 },
  { version: 8, capacity: 192 },
  { version: 9, capacity: 230 },
  { version: 10, capacity: 271 },
  { version: 11, capacity: 321 },
  { version: 12, capacity: 367 },
  { version: 13, capacity: 425 },
  { version: 14, capacity: 458 },
  { version: 15, capacity: 520 },
  { version: 16, capacity: 586 },
  { version: 17, capacity: 644 },
  { version: 18, capacity: 718 },
  { version: 19, capacity: 792 },
  { version: 20, capacity: 858 },
  { version: 21, capacity: 929 },
  { version: 22, capacity: 1003 },
  { version: 23, capacity: 1091 },
  { version: 24, capacity: 1171 },
  { version: 25, capacity: 1273 },
  { version: 26, capacity: 1367 },
  { version: 27, capacity: 1465 },
  { version: 28, capacity: 1528 },
  { version: 29, capacity: 1628 },
  { version: 30, capacity: 1732 },
  { version: 31, capacity: 1840 },
  { version: 32, capacity: 1952 },
  { version: 33, capacity: 2068 },
  { version: 34, capacity: 2188 },
  { version: 35, capacity: 2303 },
  { version: 36, capacity: 2431 },
  { version: 37, capacity: 2563 },
  { version: 38, capacity: 2699 },
  { version: 39, capacity: 2809 },
  { version: 40, capacity: 2953 }
];

const alignmentPatterns = [
  {version: 2, coordinates: [6, 18]},
  {version: 3, coordinates: [6, 22]},
  {version: 4, coordinates: [6, 26]},
  {version: 5, coordinates: [6, 30]},
  {version: 6, coordinates: [6, 34]},
  {version: 7, coordinates: [6, 22, 38]},
  {version: 8, coordinates: [6, 24, 42]},
  {version: 9, coordinates: [6, 26, 46]},
  {version: 10, coordinates: [6, 28, 50]},
  {version: 11, coordinates: [6, 30, 54]},
  {version: 12, coordinates: [6, 32, 58]},
  {version: 13, coordinates: [6, 34, 62]},
  {version: 14, coordinates: [6, 26, 46, 66]},
  {version: 15, coordinates: [6, 26, 48, 70]},
  {version: 16, coordinates: [6, 26, 50, 74]},
  {version: 17, coordinates: [6, 30, 54, 78]},
  {version: 18, coordinates: [6, 30, 56, 82]},
  {version: 19, coordinates: [6, 30, 58, 86]},
  {version: 20, coordinates: [6, 34, 62, 90]},
  {version: 21, coordinates: [6, 28, 50, 72, 94]},
  {version: 22, coordinates: [6, 26, 50, 74, 98]},
  {version: 23, coordinates: [6, 30, 54, 78, 102]},
  {version: 24, coordinates: [6, 28, 54, 80, 106]},
  {version: 25, coordinates: [6, 32, 58, 84, 110]},
  {version: 26, coordinates: [6, 30, 58, 86, 114]},
  {version: 27, coordinates: [6, 34, 62, 90, 118]},
  {version: 28, coordinates: [6, 26, 50, 74, 98, 122]},
  {version: 29, coordinates: [6, 30, 54, 78, 102, 126]},
  {version: 30, coordinates: [6, 26, 52, 78, 104, 130]},
  {version: 31, coordinates: [6, 30, 56, 82, 108, 134]},
  {version: 32, coordinates: [6, 34, 60, 86, 112, 138]},
  {version: 33, coordinates: [6, 30, 58, 86, 114, 142]},
  {version: 34, coordinates: [6, 34, 62, 90, 118, 146]},
  {version: 35, coordinates: [6, 30, 54, 78, 102, 126, 150]},
  {version: 36, coordinates: [6, 24, 50, 76, 102, 128, 154]},
  {version: 37, coordinates: [6, 28, 54, 80, 106, 132, 158]},
  {version: 38, coordinates: [6, 32, 58, 84, 110, 136, 162]},
  {version: 39, coordinates: [6, 26, 54, 82, 110, 138, 166]},
  {version: 40, coordinates: [6, 30, 58, 86, 114, 142, 170]}
];


export function versionToBlocks(version: number, correctionLevel: CorrectionLevelType): QrCodeInformationType {
  const gridSize = version * 4 + 17; // e.g. Version 5 is 37x37

  const qrSpec = parseQrCodeSpec(rawQrCodeSpec);
  const versionInfo = qrSpec.find((v) => v.version === version);
  if(!versionInfo) {
    throw new Error(`Version ${version} not found in QR code specification`);
  }

  const qrCodeInformation: QrCodeInformationType = {
    version: version,
    gridSize: gridSize,
    maskPattern: null,
    blocks: [],
    pixels: Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({
        type: "data",
        block: null,
        bitIndex: null,
        dataBlock: null,
        correctionBlock: null,
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
  const alignmentPattern = alignmentPatterns.find((ap) => ap.version === version);
  if (alignmentPattern) {
    alignmentPattern.coordinates.forEach((coordX, indexX) => {
      alignmentPattern.coordinates.forEach((coordY, indexY) => {
        if(indexX === 0 && indexY === 0) return;
        if(indexX === alignmentPattern.coordinates.length - 1 && indexY === 0) return;
        if(indexX === 0 && indexY === alignmentPattern.coordinates.length - 1) return;
        for(let x = -2; x <= 2; x++) {
          for(let y = -2; y <= 2; y++) {
            qrCodeInformation.pixels[coordX + x][coordY + y].type = "alignment";
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
    qrCodeInformation.pixels[8][gridSize - 1 - i].type = "format";
  }
  //#endregion

  //#region Fill timing patterns
  for(let x = 8; x <= gridSize-9; x++) {
    qrCodeInformation.pixels[x][6].type = "timing";
  }
  for(let y = 8; y <= gridSize-9; y++) {
    qrCodeInformation.pixels[6][y].type = "timing";
  }
  //#endregion

  //#region Fill version information
  if(version >= 7) {
    for(let i = 0; i < 6; i++) {
      for(let j = 0; j < 3; j++) {
        qrCodeInformation.pixels[gridSize - 11 + j][i].type = "version";
        qrCodeInformation.pixels[i][gridSize - 11 + j].type = "version";
      }
    }
  }
  //#endregion

  //#region Assign blocks
  let movingUp = true;
  let blockNumber = 1;
  let bitIndex = 7;

  const dataBlocks = versionInfo.correctionLevels.find((cl) => cl.level === correctionLevel)?.dataBlocks;
  if(!dataBlocks) {
    throw new Error(`Correction level ${correctionLevel} not found in version ${version}`);
  }
  for(let x = gridSize-1; x >= 0; x-=2) {
    if(x === 6) { x--; } // vertical timing pattern is in the way

    for(let y = (movingUp ? gridSize-1 : 0); (movingUp ? y >= 0 : y <= gridSize-1); y = y + (movingUp ? -1 : 1)) {
      for(let step = 0; step < 2; step++) {
        if(qrCodeInformation.pixels[x-step][y].type === "data") {
          qrCodeInformation.pixels[x-step][y].block = blockNumber;
          qrCodeInformation.pixels[x-step][y].bitIndex = bitIndex;
          if(blockNumber <= dataBlocks) {
            qrCodeInformation.pixels[x-step][y].dataBlock = versionInfo.correctionLevels.find((cl) => cl.level === correctionLevel)?.blockSequence[blockNumber-1] || null;
          } else {
            qrCodeInformation.pixels[x-step][y].correctionBlock = versionInfo.correctionLevels.find((cl) => cl.level === correctionLevel)?.blockSequence[blockNumber-1] || null;
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
