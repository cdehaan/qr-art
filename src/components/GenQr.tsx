import React from "react"
import { PixelDataType, QrCodeInformationType } from "../types";

type GenQrProps = {
    qrData: QrCodeInformationType;
};

export default function GenQr({ qrData }: GenQrProps) {

  function QrPixel({ pixelInfo: pixelInfo }: { pixelInfo: PixelDataType }) {
    const colours = [
      {type: "finder", colour: "#000"},
      {type: "alignment", colour: "#369"},
      {type: "format", colour: "#963"},
      {type: "timing", colour: "#396"},
      {type: "version", colour: "#639"},
      {type: "data", colour: "#888"},
    ]
    return (
      <div style={{display:"flex", height: "0.5rem", width:"0.5rem", fontSize:"0.2rem", backgroundColor: colours.find(rule => rule.type === pixelInfo.type)?.colour }}>{pixelInfo.type === "data" ? `${pixelInfo.dataBlock || 0}-${pixelInfo.bitIndex || 0}` : pixelInfo.type}</div>
    )
  }

  const qrGrid = qrData.pixels.map((row, rowIndex) => {
    const qrPixel = row.map((pixel, columnIndex) => {
      return <QrPixel pixelInfo={pixel} key={columnIndex} />
    })
    return <div key={rowIndex} style={{display:"flex", flexDirection:"column", height: "0.5rem", width:"0.5rem"}}>{qrPixel}</div>
  });

  return (
    <div style={{display: "flex"}}>
      {qrGrid}
    </div>
  )
}

