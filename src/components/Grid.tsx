import React, { useEffect, useState } from 'react';
import { useModules } from '../contexts/ModulesContext';

function Grid() {
    const gridSize = 41;
    const { modules, setModuleValue, pairValues, currentDomain, currentStringIndex } = useModules();


    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const [initialCellState, setInitialCellState] = useState<boolean | null>(null);
    const [lastRefresh, setLastRefresh] = useState<string>('');

    useEffect(() => {
        const updateLastRefresh = () => {
            const now = new Date();
            const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
            const formattedTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
            setLastRefresh(`${formattedDate} ${formattedTime}`);
        };

        updateLastRefresh();
    }, []);
    function toggleCell(row: number, col: number) {
        if(modules[row][col].isFixed || modules[row][col].isData || (modules[row][col].isCorrection && !modules[row][col].isDestroyable)) return;
        setModuleValue(row, col, !modules[row][col].value);
    }

    function handleMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, col: number) {
        event.preventDefault();
        setIsMouseDown(true);
        setInitialCellState(modules[row][col].value);
        toggleCell(row, col);
    }

    function handleMouseOver(event: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, col: number) {
        if (isMouseDown && initialCellState !== null) {
            if (modules[row][col].value === initialCellState) {
                toggleCell(row, col);
            }
        }
    }

    function handleMouseUp() {
        setIsMouseDown(false);
        setInitialCellState(null);
    }

    const currentDrawingValues = modules.map((row, rowIndex) => {
        return <div key={rowIndex}>[{row.map((module, moduleIndex) => {
            return (<span key={`${rowIndex}-${moduleIndex}`}>{module.value ? " false," : " true,"}</span>)
        })}],</div>
    });

    const pairValuesGrid = (!pairValues || !pairValues[0]) ? null : (
        <div>
            {pairValues[0].map((pair, pairIndex) => (
                <span key={pairIndex} style={{ border: '1px solid #ccc' }}>{pair}</span>
            ))}
        </div>
    );

    const blockValuesGrid = (!modules || modules.length === 0) ? null : (
        <div>
            {modules.map((row, rowIndex) => (
                <div key={rowIndex}>
                    {row.map((module, moduleIndex) => (
                        <span key={`${rowIndex}-${moduleIndex}`}>{module.blockBit} </span>
                    ))}
                </div>
            ))}
        </div>
    );

//    const numberOfBlocks = modules.reduce((max, subArray) => {
//        // Find the largest blockIndex in the current subArray
//        const maxInSubArray = subArray.reduce((subMax, obj) => {
//          return obj.blockIndex > subMax ? obj.blockIndex : subMax;
//        }, -Infinity);
//      
//        // Compare it with the current max
//        return maxInSubArray > max ? maxInSubArray : max;
//    }, -Infinity);
//
//    const blockValues = [];
//    for(let blockLooper = 0; blockLooper <= numberOfBlocks; blockLooper++) {
//        const blockBits = [];
//        for(let rowLooper = 0; rowLooper < modules.length; rowLooper++) {
//            for(let colLooper = 0; colLooper < modules[rowLooper].length; colLooper++) {
//                if(modules[rowLooper][colLooper].blockIndex === blockLooper) {
//                    const module = modules[rowLooper][colLooper];
//                    const postMaskValue = module.value === module.masks[1] ? 0 : 1;
//                    blockBits[modules[rowLooper][colLooper].blockBit] = postMaskValue;
//                }
//            }
//        }
//        blockValues[blockLooper] = blockBits;
//    }
//    console.log("blockValues");
//    console.log(blockValues);
//
//    const blockAscii = blockValues.map((block, blockIndex) => {
//        return block.reduce((accumulator, bit, bitIndex) => {
//            return accumulator + (bit ? Math.pow(2, bitIndex) : 0);
//        }, 0);
//    });
//    console.log("blockAscii");
//    console.log(blockAscii);
//
//    const blockAsciiString = blockAscii.map((ascii) => {
//        return String.fromCharCode(ascii);
//    });
//    console.log("blockAsciiString");
//    console.log(blockAsciiString);

    return (
        <>
            <div
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp} // To handle the case when the mouse leaves the grid
                style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${gridSize}, 1.5rem)`, border: '2px solid #444'}}
            >
                {modules.map((row, rowIndex) => 
                    row.map((module, colIndex) => {
                        const background =
                            module.isFixed ? (module.fixedValue ? "#ccc" : "#444") :
                            module.isData ? "#888" :
                            module.isMetaData ? 'repeating-linear-gradient(45deg, white, white 0.2rem, #ccc 0.2rem, #ccc 0.4rem)' :
                            module.isDestroyable ? (module.value ? '#200' : '#fee') :
                            module.isCorrection ? "#f00" :
                            module.isUnused ? "#66a" :
                            module.value ? 'black' : 'white';
                        //const borderWidth = module.masks[2] ? 2 : 1;
                        //const borderColor = (module.masks[2] && !module.isFixed && !module.isData) ? '#800' : '#ccc';
                        const borderColor = '#ccc';
                        const blockString = `${module.blockIndex === 0 ? "x" : module.blockIndex} - ${module.blockBit === -1 ? "x" : module.blockBit}`;
                        const pairString = `D${module.pairIndex === 0 ? "x" : module.pairIndex} - ${module.pairBit === -1 ? "x" : module.pairBit}`;
                        return(
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                                onMouseOver={(e) => handleMouseOver(e, rowIndex, colIndex)}
                                style={{
                                    height: '1.5rem',
                                    width: '1.5rem',
                                    border: `${"1"}px solid ${borderColor}`,
                                    color: "#080",
                                    //color: "transparent",
                                    fontSize: "0.5rem",
                                    background: background,
                                    lineHeight: "0.5rem",
                                }}
                            >
                                {blockString}
                                {false && <br />}
                                {false && pairString}
                            </div>
                        )
                    })
                )}
            </div>
            {false && <span>[{currentDrawingValues}]</span>}
            {false && pairValuesGrid}
            {false && <><span style={{display: "flex"}}>Current domain: {currentDomain}</span><br /><span  style={{display: "flex"}}>Current string location: {currentStringIndex} of {(!pairValues || !pairValues[0]) ? "?" : pairValues[0].reduce((total, str) => total + str.length, 0)}</span><br /><span style={{display: "flex"}}>started: {lastRefresh}</span></>}
            {blockValuesGrid}
        </>
    );
}

export default Grid;
