import React, { useState } from "react"
import { QrCodeInformationType } from "../types";
import QrPixel from "./QrPixel";

type QrCodeProps = {
    qrInfo: QrCodeInformationType,
    content: Uint8Array,
    contentSetter: React.Dispatch<React.SetStateAction<Uint8Array>>,
};

export default function QrCode({ qrInfo, content, contentSetter }: QrCodeProps) {
  console.log('Received content in GenQr:', content);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [initialPixelState, setInitialPixelState] = useState<number | null>(null); // Stores the initial pixel state on mouse down
  const [paintbrushSize, setPaintbrushSize] = useState<number>(1);

  if(!content) return <p>Loading...</p>

  const handlePaintbrushSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaintbrushSize(parseInt(event.target.value, 10));
  };

  const qrGrid = qrInfo.pixels.map((row, rowIndex) => {
    const qrPixel = row.map((pixel, columnIndex) => {
      return <QrPixel
        key={columnIndex}
        qrInfo={qrInfo}
        pixelInfo={pixel}
        content={content}
        contentSetter={contentSetter}
        isMouseDown={isMouseDown}
        setIsMouseDown={setIsMouseDown}
        initialPixelState={initialPixelState}
        setInitialPixelState={setInitialPixelState}
        paintbrushSize={paintbrushSize}
        row={rowIndex}
        col={columnIndex}
      />
    })
    return <div key={rowIndex} style={{display:"flex", flexDirection:"column"}}>{qrPixel}</div>
  });

  return (
    <div style={{display: "flex"}}>
      {qrGrid}
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="paintbrushSize">Paintbrush Size: </label>
        <select id="paintbrushSize" value={paintbrushSize} onChange={handlePaintbrushSizeChange}>
          <option value={1}>1</option>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={7}>7</option>
        </select>
      </div>
    </div>
  )
}

