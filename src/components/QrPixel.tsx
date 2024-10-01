import React from "react"
import { PixelDataType, QrCodeInformationType } from "../types";

type QrPixelProps = {
    qrInfo: QrCodeInformationType;
    pixelInfo: PixelDataType;
    content: Uint8Array;
    contentSetter: React.Dispatch<React.SetStateAction<Uint8Array>>;
    isMouseDown: boolean;
    setIsMouseDown: React.Dispatch<React.SetStateAction<boolean>>;
    initialPixelState: number | null;
    setInitialPixelState: React.Dispatch<React.SetStateAction<number | null>>;
    paintbrushSize: number;
    row: number;
    col: number;
};

const colours = [
    {type: "finder", hue: 90, saturation: 50}, // green
    {type: "alignment", hue: 210, saturation: 50}, //  "#369"
    {type: "format", hue: 30, saturation: 50}, //  "#963"
    {type: "timing", hue: 150, saturation: 50}, //  "#396"
    {type: "version", hue: 270, saturation: 50}, //  "#639"
    {type: "metadata", hue: 180, saturation: 50}, // teal
    {type: "correction", hue: 3300, saturation: 22}, // yellow
    {type: "data", hue: 0, saturation: 0}, //  gray
]

export default function QrPixel({ qrInfo, pixelInfo, content, contentSetter, isMouseDown, setIsMouseDown, initialPixelState, setInitialPixelState, paintbrushSize, row, col }: QrPixelProps) {
    if(!pixelInfo) return null;
    if (!content) {
      console.log("no content");
      return null;
    }
    if (!(content instanceof Uint8Array)) {
      console.log("content is not a Uint8Array");
      return null;
    }
    if(content.length === 0) {
      console.log("content empty");
      return null;
    }

    const colour = colours.find(rule => rule.type === pixelInfo.type);
    const maskPattern = qrInfo?.maskPattern || 0;
    const maskState = pixelInfo?.masks?.[maskPattern] || 0;

    const contentBlockIndex = pixelInfo.contentBlock;
    const contentBitIndex = pixelInfo.contentBitIndex;
    const contentBinary = (contentBlockIndex && content[contentBlockIndex-1])
      ? content[contentBlockIndex-1].toString(2).padStart(8, "0")
      : "None";
    const contentState = (contentBlockIndex !== null && contentBitIndex !== null && contentBlockIndex < content.length && contentBlockIndex > 0)
      ? parseInt(content[contentBlockIndex-1].toString(2).padStart(8, "0").substring(7-contentBitIndex, 7-contentBitIndex+1) ,10)
      : 0;
    if(contentBlockIndex && contentBlockIndex < 10) {
      console.log(`content: ${content[(contentBlockIndex||1)-1]}, content binary: ${contentBinary}, contentState: ${contentState}, maskState: ${maskState}, contentBlockIndex: ${contentBlockIndex}, contentBitIndex: ${contentBitIndex}`);
    }

    const pixelState = contentState === maskState ? 0 : 1;

  const togglePixelAt = (rowIndex: number, columnIndex: number) => {
    const pixelToToggle = qrInfo.pixels?.[rowIndex]?.[columnIndex];
    if (!pixelToToggle) return;

    const blockIndex = pixelToToggle.contentBlock;
    const bitIndex = pixelToToggle.contentBitIndex;

    if (blockIndex === null || bitIndex === null || blockIndex > content.length || blockIndex <= 0) {
      return;
    }
    const maskPattern = qrInfo?.maskPattern || 0;
    const maskState = pixelToToggle?.masks?.[maskPattern] || 0;

    contentSetter((prevContent) => {
      // Retrieve the byte and toggle the corresponding bit
      const newContent = new Uint8Array(prevContent);

      const currentByte = newContent[blockIndex - 1]; // 00110011 for "3", -1 because contentBlockIndex is 1-based
      const bitMask = 1 << bitIndex; // 00001000 for bit 3
      const currentBit = (currentByte & bitMask) ? 1 : 0;

      const currentPixelState = currentBit === maskState ? 0 : 1;

      if (currentPixelState === initialPixelState) {
        const newByte = currentByte ^ bitMask; // XOR to flip the bit
        newContent[blockIndex - 1] = newByte;  
      }

      return newContent;
    });
  };

  const handleMouseEnter = () => {
    if(!isMouseDown) return;

    const halfSize = Math.floor(paintbrushSize / 2);

    for (let rowOffset = -halfSize; rowOffset <= halfSize; rowOffset++) {
      for (let colOffset = -halfSize; colOffset <= halfSize; colOffset++) {
        const targetRow = row + rowOffset;
        const targetCol = col + colOffset;

        // Ensure the pixel is within bounds
        if (
          targetRow >= 0 &&
          targetRow < qrInfo.pixels.length &&
          targetCol >= 0 &&
          targetCol < qrInfo.pixels[0].length
        ) {
          togglePixelAt(targetRow, targetCol);
        }
      }
    }
  };

  // Handle mouse down event
  const handleMouseDown = () => {
    setIsMouseDown(true);
    setInitialPixelState(pixelState); // Store the initial pixel state
    togglePixel(); // Execute the paintbrush logic on click      
  };

    const togglePixel = () => {
      if (contentBlockIndex === null || contentBitIndex === null || contentBlockIndex > content.length || contentBlockIndex <= 0) {
        return;
      }
  
      // Create a copy of the content to modify
      const newContent = new Uint8Array(content);
  
      // Retrieve the byte and toggle the corresponding bit
      const currentByte = newContent[contentBlockIndex - 1]; // -1 because contentBlockIndex is 1-based
      const bitMask = 1 << contentBitIndex; // Use updated bitMask logic
  
      // Toggle the bit
      const newByte = currentByte ^ bitMask; // XOR to flip the bit
  
      // Update the content array with the new byte
      newContent[contentBlockIndex - 1] = newByte;
  
      // Use the setter function to update the state
      contentSetter(newContent);
    };  

    return (
      <div style={{
        display:"flex",
        height: "1.2rem",
        width:"1.2rem",
        fontSize:"0.5rem",
        overflow:"hidden",
        userSelect: "none",
        border:`1px solid ${pixelInfo.isFixed ? "#f00" : "#fff"}`,
        backgroundColor:`hsl(${colour?.hue}, ${colour?.saturation}%, ${(pixelState === 0 && (pixelInfo.type === "data" || pixelInfo.type === "metadata" || pixelInfo.type === "correction")) ? "80" : "40"}%)`
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={() => setIsMouseDown(false)}
      >{pixelInfo.type === "data" ?
        `${contentBlockIndex}-${contentBitIndex}` :
        pixelInfo.type === "correction" ?
        `${pixelInfo.correctionBlock}-${pixelInfo.correctionBitIndex}` :
        pixelInfo.type.substring(0,3)}</div>
    )
  }