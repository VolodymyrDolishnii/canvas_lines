import React, { useEffect, useRef } from "react";

export const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }

        canvas.addEventListener('click', (event) => {
            let x = event.offsetX;
            let y = event.offsetY;

            context.fillStyle = 'red';
            context.beginPath();
            context.arc(x, y, 5, 0, Math.PI * 2);
            context.fill();
            context.stroke()
        })

    }, [])

    return (
        <canvas ref={canvasRef} style={{border: '1px solid red'}}></canvas>
    )
};