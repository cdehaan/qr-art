import React, { useEffect, useState } from 'react';
import './App.css';
import QRCode, { QRCodeSegment, QRCodeToDataURLOptions } from 'qrcode';
import Grid from './components/Grid';
import PairInputs from './components/PairInputs';
import { ModulesProvider } from './contexts/ModulesContext';

export default function App() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // longest possible in version 6 alphanumeric: 195 characters
  const [qrCodeData, setQrCodeData] = useState<string>('GITHUB.COM/CDEHAAN');

  // longest possible in version 6 byte: 134 characters
  const [qrCode8BitData, setQrCode8BitData] = useState<Uint8Array>(new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]));

  const segs: QRCodeSegment[] = [
    { data: qrCode8BitData, mode: 'byte' }
  ]

  const options: QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'L',
    maskPattern: 2,
  }


  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const url = await QRCode.toDataURL(segs, options);
        setQrCodeUrl(url);
      } catch (err) {
        console.error(err);
      }
    };

    generateQrCode();
  }, [qrCode8BitData]);

  const dataToAscii = (data: Uint8Array) => {
    return data.reduce((acc, val) => acc + String.fromCharCode(val), '');
  }

  const asciiToData = (ascii: string) => {
    return new Uint8Array(ascii.split('').map((char) => char.charCodeAt(0)));
  }

  return (
    <ModulesProvider>
      <div className="App">
        <header className="App-header">
          <span>QR Code Generator</span>
          {qrCodeUrl ? <img style={{height: "70vh"}} src={qrCodeUrl} alt="QR Code" /> : <p>Loading...</p>}
          {false && <input type='text' style={{width: "80vw"}} value={qrCodeData} onChange={(e) => setQrCodeData(e.target.value)} />}
          <input type='text' style={{width: "80vw"}} value={dataToAscii(qrCode8BitData)} onChange={(e) => setQrCode8BitData(asciiToData(e.target.value))} />
          <PairInputs setQrCodeData={setQrCodeData} />
        </header>
        <Grid />
      </div>
    </ModulesProvider>
  );
}
