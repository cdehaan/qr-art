import { CorrectionLevelInformationType, CorrectionPatternType, QrVersionInformationType } from "../types";

//version, blocks, capacity (8-bit)
//1 26 17

//correctionLevel, repetitions, (total codewords, data codewords, error tollerance)
//L 7 1 (26,19,2)

export const rawQrCodeSpec = `
1 26 17
L 7 1 (26,19,2)
M 10 1 (26,16,4)
Q 13 1 (26,13,6)
H 17 1 (26, 9,8)

2 44 32
L 10 1 (44,34,4)
M 16 1 (44,28,8)
Q 22 1 (44,22,11)
H 28 1 (44,16,14)

3 70 53
L 15 1 (70,55,7)
M 26 1 (70,44,13)
Q 36 2 (35,17,9)
H 44 2 (35,13,11)

4 100 78
L 20 1 (100,80,10)
M 36 2 (50,32,9)
Q 52 2 (50,24,13)
H 64 4 (25,9,8)

5 134 106
L 26 1 (134,108,13)
M 48 2 (67,43,12)
Q 72 2 (33,15,9)
2 (34,16,9)
H 88 2 (33,11,11)
2 (34,12,11)

6 172 134
L 36 2 (86,68,9)
M 64 4 (43,27,8)
Q 96 4 (43,19,12)
H 112 4 (43,15,14)

7 196 154
L 40 2 (98,78,10)
M 72 4 (49,31,9)
Q 108 2 (32,14,9)
4 (33,15,9)
H 130 4 (39,13,13)
1 (40,14,13)

8 242 192
L 48 2 (121,97,12)
M 88 2 (60,38,11)
2 (61,39,11)
Q 132 4 (40,18,11)
2 (41,19,11)
H 156 4 (40,14,13)
2 (41,15,13)

9 292 230
L 60 2 (146,116,15)
M 110 3 (58,36,11)
2 (59,37,11)
Q 160 4 (36,16,10)
4 (37,17,10)
H 192 4 (36,12,12)
4 (37,13,12)

10 346 271
L 72 2 (86,68,9)
2 (87,69,9)
M 130 4 (69,43,13)
1 (70,44,13)
Q 192 6 (43,19,12)
2 (44,20,12)
H 224 6 (43,15,14)
2 (44,16,14)

11 404 321
L 80 4 (101,81,10)
M 150 1 (80,50,15)
4 (81,51,15)
Q 224 4 (50,22,14)
4 (51,23,14)
H 264 3 (36,12,12)
8 (37,13,12)

12 466 367
L 96 2 (116,92,12)
2 (117,93,12)
M 176 6 (58,36,11)
2 (59,37,11)
Q 260 4 (46,20,13)
6 (47,21,13)
H 308 7 (42,14,14)
4 (43,15,14)

13 532 425
L 104 4 (133,107,13)
M 198 8 (59,37,11)
1 (60,38,11)
Q 288 8 (44,20,12)
4 (45,21,12)
H 352 12 (33,11,11)
4 (34,12,11)

14 581 458
L 120 3 (145,115,15)
1 (146,116,15)
M 216 4 (64,40,12)
5 (65,44,12)
Q 320 11 (36,16,10)
5 (37,17,10)
H 384 11 (36,12,12)
5 (37,13,12)

15 655 520
L 132 5 (109,87,11)
1 (110,88,11)
M 240 5 (65,41,12)
5 (66,42,12)
Q 360 5 (54,24,15)
7 (55,25,15)
H 432 11 (36,12,12)
7 (37,13,12)

16 733 586
L 144 5 (122,98,12)
1 (123,99,12)
M 280 7 (73,45,14)
3 (74,46,14)
Q 408 15 (43,19,12)
2 (44,20,12)
H 480 3 (45,15,15)
13 (46,16,15)

17 815 644
L 168 1 (135,107,14)
5 (136,108,14)
M 308 10 (74,46,14)
1 (75,47,14)
Q 448 1 (50,22,14)
15 (51,23,14)
H 532 2 (42,14,14)
17 (43,15,14)

18 901 718
L 180 5 (150,120,15)
1 (151,121,15)
M 338 9 (69,43,13)
4 (70,44,13)
Q 504 17 (50,22,14)
1 (51,23,14)
H 588 2 (42,14,14)
19 (43,15,14)

19 991 792
L 196 3 (141,113,14)
4 (142,114,14)
M 364 3 (70,44,13)
11 (71,45,13)
Q 546 17 (47,21,13)
4 (48,22,13)
H 650 9 (39,13,13)
16 (40,14,13)

20 1085 858
L 224 3 (135,107,14)
5 (136,108,14)
M 416 3 (67,41,13)
13 (68,42,13)
Q 600 15 (54,24,15)
5 (55,25,15)
H 700 15 (43,15,14)
10 (44,16,14)

21 1156 929
L 224 4 (144,116,14)
4 (145,117,14)
M 442 17 (68,42,13)
Q 644 17 (50,22,14)
6 (51,23,14)
H 750 19 (46,16,15)
6 (47,17,15)

22 1258 1003
L 252 2 (139,111,14)
7 (140,112,14)
M 476 17 (74,46,14)
Q 690 7 (54,24,15)
16 (55,25,15)
H 816 34 (37,13,12)

23 1364 1091
L 270 4 (151,121,15)
5 (152,122,15)
M 504 4 (75,47,14)
14 (76,48,14)
Q 750 11 (54,24,15)
14 (55,25,15)
H 900 16 (45,15,15)
14 (46,16,15)

24 1474 1171
L 300 6 (147,117,15)
4 (148,118,15)
M 560 6 (73,45,14)
14 (74,46,14)
Q 810 11 (54,24,15)
16 (55,25,15)
H 960 30 (46,16,15)
2 (47,17,15)

25 1588 1273
L 312 8 (132,106,13)
4 (133,107,13)
M 588 8 (75,47,14)
13 (76,48,14)
Q 870 7 (54,24,15)
22 (55,25,15)
H 1050 22 (45,15,15)
13 (46,16,15)

26 1706 1367
L 336 10 (142,114,14)
2 (143,115,14)
M 644 19 (74,46,14)
4 (75,47,14)
Q 952 28 (50,22,14)
6 (51,23,14)
H 1110 33 (46,16,15)
4 (47,17,15)

27 1828 1465
L 360 8 (152,122,15)
4 (153,123,15)
M 700 22 (73,45,14)
3 (74,46,14)
Q 1020 8 (53,23,15)
26 (54,24,15)
H 1200 12 (45,15,15)
28 (46,16,15)

28 1921 1528
L 390 3 (147,117,15)
10 (148,118,15)
M 728 3 (73,45,14)
23 (74,46,14)
Q 1050 4 (54,24,15)
31 (55,25,15)
H 1260 11 (45,15,15)
31 (46,16,15)

29 2051 1628
L 420 7 (146,116,15)
7 (147,117,15)
M 784 21 (73,45,14)
7 (74,46,14)
Q 1140 1 (53,23,15)
37 (54,24,15)
H 1350 19 (45,15,15)
26 (46,16,15)

30 2185 1732
L 450 5 (145,115,15)
10 (146,116,15)
M 812 19 (75,47,14)
10 (76,48,14)
Q 1200 15 (54,24,15)
25 (55,25,15)
H 1440 23 (45,15,15)
25 (46,16,15)

31 2323 1840
L 480 13 (145,115,15)
3 (146,116,15)
M 868 2 (74,46,14)
29 (75,47,14)
Q 1290 42 (54,24,15)
1 (55,25,15)
H 1530 23 (45,15,15)
28 (46,16,15)

32 2465 1952
L 510 17 (145,115,15)
M 924 10 (74,46,14)
23 (75,47,14)
Q 1350 10 (54,24,15)
35 (55,25,15)
H 1620 19 (45,15,15)
35 (46,16,15)

33 2611 2068
L 540 17 (145,115,15)
1 (146,116,15)
M 980 14 (74,46,14)
21 (75,47,14)
Q 1440 29 (54,24,15)
19 (55,25,15)
H 1710 11 (45,15,15)
46 (46,16,15)

34 2761 2188
L 570 13 (145,115,15)
6 (146,116,15)
M 1036 14 (74,46,14)
23 (75,47,14)
Q 1530 44 (54,24,15)
7 (55,25,15)
H 1800 59 (46,16,15)
1 (47,17,15)

35 2876 2303
L 570 12 (151,121,15)
7 (152,122,15)
M 1064 12 (75,47,14)
26 (76,48,14)
Q 1590 39 (54,24,15)
14 (55,25,15)
H 1890 22 (45,15,15)
41 (46,16,15)

36 3034 2431
L 600 6 (151,121,15)
14 (152,122,15)
M 1120 6 (75,47,14)
34 (76,48,14)
Q 1680 46 (54,24,15)
10 (55,25,15)
H 1980 2 (45,15,15)
64 (46,16,15)

37 3196 2563
L 630 17 (152,122,15)
4 (153,123,15)
M 1204 29 (74,46,14)
14 (75,47,14)
Q 1770 49 (54,24,15)
10 (55,25,15)
H 2100 24 (45,15,15)
46 (46,16,15)

38 3362 2699
L 660 4 (152,122,15)
18 (153,123,15)
M 1260 13 (74,46,14)
32 (75,47,14)
Q 1860 48 (54,24,15)
14 (55,25,15)
H 2220 42 (45,15,15)
32 (46,16,15)

39 3532 2809
L 720 20 (147,117,15)
4 (148,118,15)
M 1316 40 (75,47,14)
7 (76,48,14)
Q 1950 43 (54,24,15)
22 (55,25,15)
H 2310 10 (45,15,15)
67 (46,16,15)

40 3706 2953
L 750 19 (148,118,15)
6 (149,119,15)
M 1372 18 (75,47,14)
31 (76,48,14)
Q 2040 34 (54,24,15)
34 (55,25,15)
H 2430 20 (45,15,15)
61 (46,16,15)
`;

export function parseQrCodeSpec(data: string): QrVersionInformationType[] {
  const lines = data.split('\n').map(line => line.trim()).filter((line) => line.length > 0);
  const qrData: QrVersionInformationType[] = [];
  let currentQrData: QrVersionInformationType | null = null;
  let currentCorrectionLevel: CorrectionLevelInformationType | null = null;

  lines.forEach(line => {

    // Match lines starting with version and blocks e.g. "1 26 17"
    const versionBlockMatch = line.match(/^(\d+)\s+(\d+)\s+(\d+)$/);
    if (versionBlockMatch) {

      // We've reached a new version, so push the data we've been building up (the previous version data)
      if (currentQrData) {
        currentQrData.correctionLevels.forEach(level => {
          level.blockSequence = generateDataBlockSequence(level.patterns);
        });
        qrData.push(currentQrData);
      }

      currentQrData = {
        version: parseInt(versionBlockMatch[1], 10),
        blocks: parseInt(versionBlockMatch[2], 10),
        capacity: parseInt(versionBlockMatch[3], 10),
        correctionLevels: [],
      };
      currentCorrectionLevel = null;
      return;
    }

    // Match lines starting with a correction level, correction blocks, and pattern, e.g.: "L 7 1 (26,19,2)"
    const correctionLevelMatch = line.match(/^([A-Z])\s+(\d+)\s+(\d+)\s+\((\d+),(\d+),(\d+)\)$/);
    if (correctionLevelMatch) {
      currentCorrectionLevel = {
        level: correctionLevelMatch[1] as "L" | "M" | "Q" | "H",
        dataBlocks: (currentQrData?.blocks || 0) - parseInt(correctionLevelMatch[2], 10),
        correctionBlocks: parseInt(correctionLevelMatch[2], 10),
        patterns: [{
          repetitions: parseInt(correctionLevelMatch[3], 10),
          totalBlocks: parseInt(correctionLevelMatch[4], 10),
          dataBlocks: parseInt(correctionLevelMatch[5], 10),
          correctionBlocks: (parseInt(correctionLevelMatch[4], 10) - parseInt(correctionLevelMatch[5], 10)),
          errorTollerance: parseInt(correctionLevelMatch[6], 10),
        }],
        blockSequence: [],
      };
      currentQrData?.correctionLevels.push(currentCorrectionLevel);
      return;
    }

    // Match lines with additional patterns for the current correction level, e.g.: "2 (34,16,9)"
    const additionalPatternMatch = line.match(/^(\d+)\s+\((\d+),(\d+),(\d+)\)$/);
    if (additionalPatternMatch && currentCorrectionLevel) {
      currentCorrectionLevel.patterns.push({
        repetitions: parseInt(additionalPatternMatch[1], 10),
        totalBlocks: parseInt(additionalPatternMatch[2], 10),
        dataBlocks: parseInt(additionalPatternMatch[3], 10),
        correctionBlocks: (parseInt(additionalPatternMatch[2], 10) - parseInt(additionalPatternMatch[3], 10)),
        errorTollerance: parseInt(additionalPatternMatch[4], 10),
      });
    }
  });

  if (currentQrData !== null) {
    (currentQrData as QrVersionInformationType).correctionLevels.forEach(level => {
      level.blockSequence = generateDataBlockSequence(level.patterns);
    });
    qrData.push(currentQrData);
  }

  console.log(qrData);
  return qrData;
}

function generateDataBlockSequence(patterns: CorrectionPatternType[]): number[] {
  const dataBlockValues: number[][] = [];
  const errorBlockValues: number[][] = [];
  let currentValue = 1;
  let currentErrorValue = 1;

  // Step 1: Populate each block with its respective data and error values
  for (const pattern of patterns) {
    for (let i = 0; i < pattern.repetitions; i++) {
      const blockDataValues: number[] = [];
      const blockErrorValues: number[] = [];

      // Assign data values
      for (let j = 0; j < pattern.dataBlocks; j++) {
        blockDataValues.push(currentValue++);
      }

      // Assign error values
      for (let j = 0; j < (pattern.totalBlocks - pattern.dataBlocks); j++) {
        blockErrorValues.push(currentErrorValue++);
      }

      dataBlockValues.push(blockDataValues);
      errorBlockValues.push(blockErrorValues);
    }
  }

  const interleavedData: number[] = [];
  const interleavedErrors: number[] = [];
  let maxDataBlockLength = Math.max(...dataBlockValues.map(block => block.length));
  let maxErrorBlockLength = Math.max(...errorBlockValues.map(block => block.length));

  // Step 2: Interleave the data values from each block
  for (let i = 0; i < maxDataBlockLength; i++) {
    for (const block of dataBlockValues) {
      if (block[i] !== undefined) {
        interleavedData.push(block[i]);
      }
    }
  }

  // Step 3: Interleave the error values from each block
  for (let i = 0; i < maxErrorBlockLength; i++) {
    for (const block of errorBlockValues) {
      if (block[i] !== undefined) {
        interleavedErrors.push(block[i]);
      }
    }
  }

  // Combine the data and error sequences
  return [...interleavedData, ...interleavedErrors];
}