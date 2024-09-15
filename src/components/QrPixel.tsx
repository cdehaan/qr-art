import React from "react"
import { PixelDataType, QrCodeInformationType } from "../types";

type QrPixelProps = {
    qrInfo: QrCodeInformationType;
    pixelInfo: PixelDataType;
    content: Uint8Array;
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

export default function QrPixel({ qrInfo, pixelInfo, content }: QrPixelProps) {
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

    //const dataBlockIndex = pixelInfo?.dataBlock || 0;
    //const dataBitIndex = pixelInfo?.dataBitIndex || 0;
    //const contentState = (dataBlockIndex && dataBitIndex && dataBlockIndex < content.length && dataBlockIndex > 0)
    //? parseInt(content[dataBlockIndex-1].toString(2).padStart(8, "0").substring(dataBitIndex, dataBitIndex+1) ,10)
    //: 0;

    const contentBlockIndex = pixelInfo.contentBlock;
    const contentBitIndex = pixelInfo.contentBitIndex;
    const contentState = (contentBlockIndex && contentBitIndex && contentBlockIndex < content.length && contentBlockIndex > 0)
    ? parseInt(content[contentBlockIndex-1].toString(2).padStart(8, "0").substring(contentBitIndex, contentBitIndex+1) ,10)
    : 0;
    console.log(`content: ${content[(contentBlockIndex||1)-1]}, contentState: ${contentState}, maskState: ${maskState}, contentBlockIndex: ${contentBlockIndex}, contentBitIndex: ${contentBitIndex}`);

    const pixelState = contentState === maskState ? 0 : 1;
    
    return (
      <div style={{
        display:"flex",
        height: "0.8rem",
        lineHeight:"0.8rem",
        width:"1.5rem",
        fontSize:"0.5rem",
        overflow:"hidden",
        border:`1px solid ${pixelInfo.fixed ? "#f00" : "#fff"}`,
        backgroundColor:`hsl(${colour?.hue}, ${colour?.saturation}%, ${(pixelState === 0 && (pixelInfo.type === "data" || pixelInfo.type === "metadata" || pixelInfo.type === "correction")) ? "80" : "40"}%)` }}
      >{pixelInfo.type === "data" ?
        `${contentBlockIndex}-${contentBitIndex}` :
        pixelInfo.type === "correction" ?
        `${pixelInfo.correctionBlock}-${pixelInfo.correctionBitIndex}` :
        pixelInfo.type.substring(0,3)}</div>
    )
  }