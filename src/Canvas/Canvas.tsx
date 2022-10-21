import React, { useEffect, useRef, useState, useCallback} from "react";
import { Line } from "../types/Line";
import { Point } from '../types/Point';

export const Canvas: React.FC = () => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D>();
    const [clicks, setClicks] = useState(-1);
    const [line, setLine] = useState<Line>({ startCoords: [0, 0], endCoords: [0, 0] });
    const [linesList, setLinesList] = useState<Line[]>([]);
    const [lastClick, setLastClick] = useState<[number, number]>([0, 0]);
    const [intersections, setIntersections] = useState<Point[]>([]);
    const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });

    const getCursorPosition = (e: MouseEvent) => {
        let x;
        let y;

        if (e.pageX !== undefined && e.pageY !== undefined) {
            x = e.pageX;
            y = e.pageY;
        } else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        return [x, y];
    }

    const memoizedCallback = useCallback(
        (event: any) => {
            const x = getCursorPosition(event)[0];
            const y = getCursorPosition(event)[1];
            if (context) {
                if (clicks !== 1) {
                    line.startCoords = [x, y];
                    setStartPoint({ x, y });

                    context.fillStyle = 'black';
                    context.beginPath();
                    context.arc(x, y, 5, 0, Math.PI * 2);
                    context.fill();
                    setClicks(1);

                } else {
                    setClicks(0);
                    line.endCoords = [x, y];
                    setLinesList((list) => [...list, line]);
                    setLine({ startCoords: [0, 0], endCoords: [0, 0] });
                    context.fillStyle = 'black';
                    context.beginPath();
                    context.arc(x, y, 5, 0, Math.PI * 2);
                    context.fill();

                    context.beginPath();
                    context.moveTo(lastClick[0], lastClick[1]);
                    context.lineTo(x, y);

                    context.strokeStyle = '#000000';
                    context.stroke();

                }
            }

            setLastClick([x, y]);
        },
        [clicks, context, lastClick, line],
    );

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        setContext(ctx);

    }, []);

    useEffect(() => {
        saveIntersection(linesList);
    }, [linesList]);

    useEffect(() => {
        if (context) {
            intersections.forEach(element => {
                context.fillStyle = 'red';
                context.beginPath();
                context.arc(element.x, element.y, 5, 0, Math.PI * 2);
                context.fill();
            });
        }
    }, [context, intersections]);

    const calculateIntersection = (p1: Point, p2: Point, p3: Point, p4: Point) => {

        const c2x = p3.x - p4.x;
        const c3x = p1.x - p2.x;
        const c2y = p3.y - p4.y;
        const c3y = p1.y - p2.y;


        const d = c3x * c2y - c3y * c2x;

        if (d === 0) {
            throw new Error('Number of intersection points is zero or infinity.');
        }


        const u1 = p1.x * p2.y - p1.y * p2.x;
        const u4 = p3.x * p4.y - p3.y * p4.x;



        const px = (u1 * c2x - c3x * u4) / d;
        const py = (u1 * c2y - c3y * u4) / d;

        const p = { x: Math.round(px), y: Math.round(py) };

        return p;
    }

    const saveIntersection = (lines: Line[]) => {
        if (lines.length >= 2) {
            for (let i = 0; i <= lines.length - 2; i++) {
                setIntersections((list) => [...list, calculateIntersection({ x: linesList[i].startCoords[0], y: linesList[i].startCoords[1] },
                    { x: linesList[i].endCoords[0], y: linesList[i].endCoords[1] },
                    { x: linesList[linesList.length - 1].startCoords[0], y: linesList[linesList.length - 1].startCoords[1] },
                    { x: linesList[linesList.length - 1].endCoords[0], y: linesList[linesList.length - 1].endCoords[1] }
                )]);

                console.log(calculateIntersection({ x: linesList[i].startCoords[0], y: linesList[i].startCoords[1] },
                    { x: linesList[i].endCoords[0], y: linesList[i].endCoords[1] },
                    { x: linesList[linesList.length - 1].startCoords[0], y: linesList[linesList.length - 1].startCoords[1] },
                    { x: linesList[linesList.length - 1].endCoords[0], y: linesList[linesList.length - 1].endCoords[1] }
                ));
            }
        }
    }

    const collapseLines = () => {
        setLinesList([]);
        setIntersections([]);

        if (context) {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }
    }

    return (
        <>
            <canvas
                className="canvas"
                ref={canvasRef}
                style={{ border: '1px solid red',
                margin: '5px'    
            }}
                width='1000px' height='700px'
                onClick={memoizedCallback}
                onContextMenu={(event) => {
                    event.preventDefault();
                    if (clicks === 1) {
                        setClicks(0);
                        setLine({ startCoords: [0, 0], endCoords: [0, 0] });
                        setLastClick([0, 0]);
                        if (context) {
                            context.fillStyle = 'white';
                            context.arc(startPoint.x, startPoint.y, 6, 0, Math.PI * 2);
                            context.fill();
                        }
                    }
                }}>

            </canvas>

            <button 
                className="collapseButton"
                onClick={() => collapseLines()}
            >
                Collapse lines
            </button>
        </>
    )
};