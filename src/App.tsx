import React, { useEffect, useState } from 'react';
import './App.css';
import QRCode, { QRCodeMaskPattern, QRCodeSegment, QRCodeToDataURLOptions } from 'qrcode';
import Grid from './components/Grid';
import PairInputs from './components/PairInputs';
import { ModulesProvider } from './contexts/ModulesContext';
import { versionToBlocks } from './utils/versionToBlocks';
import GenQr from './components/GenQr';
import { CorrectionLevelType } from './types';

const version: number = 13;
const errorCorrectionLevel: CorrectionLevelType = "L";
const maskPattern: QRCodeMaskPattern = 5;
const qrInfo = versionToBlocks(version, errorCorrectionLevel, maskPattern);

export default function App() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const [qrCodeData, setQrCodeData] = useState<string>('GITHUB.COM/CDEHAAN');

  // longest possible in version 6 byte: 134 characters
  // longest possible in version 13 byte: 425 characters
  // 3 = 00110011 = 51
  // U = 01010101 = 85
  // ª = 10101010 = 170
  // Ì = 11001100 = 204
  const ArraySize = 425;
  const [qrCode8BitContent, setQrCode8BitContent] = useState<Uint8Array>(new Uint8Array(ArraySize).fill(0));
  //const [qrCode8BitData, setQrCode8BitData] = useState<Uint8Array>(new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]));

  useEffect(() => {
    const segs: QRCodeSegment[] = [
      { data: qrCode8BitContent, mode: 'byte' }
    ]
  
    const options: QRCodeToDataURLOptions = {
      errorCorrectionLevel: errorCorrectionLevel,
      maskPattern: maskPattern,
    }
  
    const generateQrCode = async () => {
      try {
        const url = await QRCode.toDataURL(segs, options);
        setQrCodeUrl(url);
      } catch (err) {
        console.error(err);
      }
    };

    generateQrCode();
  }, [qrCode8BitContent]);

  const dataToAscii = (data: Uint8Array) => {
    return data.reduce((acc, val) => acc + String.fromCharCode(val), '');
  }

  const asciiToData = (ascii: string) => {
    return new Uint8Array(ascii.split('').map((char) => char.charCodeAt(0)));
  }

  return (
    <ModulesProvider>
      <div className="App">
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem", padding:"1rem 0", backgroundColor: "#369"}}>
          <span>QR Code Generator</span><br />
          {qrCodeUrl ? <img style={{height: "50vh", width:"50vh"}} src={qrCodeUrl} alt="QR Code" /> : <p>Loading...</p>}
          {false && <input type='text' style={{width: "80vw"}} value={qrCodeData} onChange={(e) => setQrCodeData(e.target.value)} />}
          <input type='text' style={{width: "80vw"}} value={dataToAscii(qrCode8BitContent)} onChange={(e) => setQrCode8BitContent(asciiToData(e.target.value))} />
          {false && <PairInputs setQrCodeData={setQrCodeData} />}
          {false && <Grid />}
          <GenQr qrData={qrInfo} content={qrCode8BitContent} />
        </div>
      </div>
    </ModulesProvider>
  );
}
