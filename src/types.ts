export type PixelCoordinateType = {
  x: number;
  y: number;
}

export type QrBlockType = {
  blockNumber: number;
  coordinates: PixelCoordinateType[];
  dataType: PixelDataType;
}

export type PixelDataType = {
  type: "data" | "correction" | "alignment" | "format" | "version" | "finder" | "timing" | "metadata";
  block: number | null;
  dataBlock: number | null;
  dataBitIndex: number | null;
  correctionBlock: number | null;
  correctionBitIndex: number | null;
  contentBlock: number | null;
  contentBitIndex: number | null;
  masks: number[];
}

export type QrCodeInformationType = {
  version: number;
  gridSize: number;
  maskPattern: number | null;
  blocks: QrBlockType[];
  pixels: PixelDataType[][];
}


export type CorrectionLevelType = "L" | "M" | "Q" | "H";

export type CorrectionPatternType = {
  repetitions: number;
  totalBlocks: number;
  dataBlocks: number;
  correctionBlocks: number;
  errorTollerance: number;
}

export type CorrectionLevelInformationType = {
  level: CorrectionLevelType;
  dataBlocks: number;
  correctionBlocks: number;
  patterns: CorrectionPatternType[];
  blockSequence: number[];
}

export type QrVersionInformationType = {
  version: number;
  blocks: number;
  capacity: number;
  metadataLength: number;
  alignmentPatterns: number[];
  correctionLevels: CorrectionLevelInformationType[];
}

/*
{
  version: 7,
  blocks: 196,
  correctionLevels: [
    {level: "L", correctionBlocks: 40,  patterns: [[2, 98, 78, 10]]},
    {level: "M", correctionBlocks: 72,  patterns: [[4, 49, 31,  9]]},
    {level: "Q", correctionBlocks: 108, patterns: [[2, 32, 14,  9], [4, 33, 15, 9]]},
    {level: "H", correctionBlocks: 130, patterns: [[4, 39, 13, 13], [1, 40, 14, 13]]},
  ]
}
*/