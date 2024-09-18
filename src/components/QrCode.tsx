import React from "react"
import { QrCodeInformationType } from "../types";
import QrPixel from "./QrPixel";

type QrCodeProps = {
    qrInfo: QrCodeInformationType,
    content: Uint8Array,
    contentSetter: React.Dispatch<React.SetStateAction<Uint8Array>>,
};

export default function QrCode({ qrInfo, content, contentSetter }: QrCodeProps) {
  console.log('Received content in GenQr:', content);

  if(!content) return <p>Loading...</p>

  const qrGrid = qrInfo.pixels.map((row, rowIndex) => {
    const qrPixel = row.map((pixel, columnIndex) => {
      return <QrPixel key={columnIndex} qrInfo={qrInfo} pixelInfo={pixel} content={content} contentSetter={contentSetter} />
    })
    return <div key={rowIndex} style={{display:"flex", flexDirection:"column"}}>{qrPixel}</div>
  });

  return (
    <div style={{display: "flex"}}>
      {qrGrid}
    </div>
  )
}

