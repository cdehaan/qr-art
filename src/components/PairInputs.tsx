import { useState } from "react";

type PairInputsProps = {
    setQrCodeData: React.Dispatch<React.SetStateAction<string>>;
};

export default function PairInputs({ setQrCodeData }: PairInputsProps) {
    function initializeArray(rows: number, cols: number, value: string): string[][] {
        return Array.from({ length: rows }, () => Array(cols).fill(value));
    };

    const [inputValues, setInputValues] = useState<string[][]>(() => initializeArray(10, 10, "00"));
    // use setQrCodeData here to set the value of the input
    const inputsGrid = [];
    for (let i = 0; i < 10; i++) {
        const inputRow = [];
        for (let j = 0; j < 10; j++) {
            if(i === 9 && j >= 8) { continue; }
            inputRow.push(
                <div key={`${i}-${j}div`} style={{display: "flex", flexDirection: "column"}}>
                <span key={`${i}-${j}span`}>{i*10 + j}</span>
                <input
                    key={`${i}-${j}`}
                    type='text'
                    value={inputValues[i][j]}
                    style={{ width: '2rem', marginBottom: "1rem" }}
                    onChange={(e) => {
                        setInputValues((prev) => {
                            const copy = [...prev];
                            copy[i][j] = e.target.value;
                            setQrCodeData(copy.flat().join('').slice(0, 195));
                            return copy;
                        });
                    }}
                />
                </div>
            );
        }
        inputsGrid.push(inputRow);
    }
return(
    <div>
        <span>Pair Inputs</span>
        <div>
            {inputsGrid.map((row, i) => (
                <div key={i} style={{ display: 'flex' }}>
                    {row}
                </div>
            ))}
        </div>
    </div>
);
}