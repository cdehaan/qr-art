import React, { useEffect, useState } from 'react';
import './App.css';
import QRCode, { QRCodeSegment, QRCodeToDataURLOptions } from 'qrcode';
import Grid from './components/Grid';
import PairInputs from './components/PairInputs';
import { ModulesProvider } from './contexts/ModulesContext';

export default function App() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrCodeData, setQrCodeData] = useState<string>('GITHUB.COM/CDEHAAN');  // longest possible in version 6: 195 characters

  const segs: QRCodeSegment[] = [
    { data: qrCodeData, mode: 'alphanumeric' },
  ]

  const options: QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'L',
    maskPattern: 0,
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
  }, [qrCodeData]);

  return (
    <ModulesProvider>
      <div className="App">
        <header className="App-header">
          <span>QR Code Generator</span>
          {qrCodeUrl ? <img style={{height: "70vh"}} src={qrCodeUrl} alt="QR Code" /> : <p>Loading...</p>}
          <input type='text' style={{width: "80vw"}} value={qrCodeData} onChange={(e) => setQrCodeData(e.target.value)} />
          <PairInputs setQrCodeData={setQrCodeData} />
        </header>
        <Grid />
      </div>
    </ModulesProvider>
  );
}
