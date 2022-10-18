import React, { useState, useEffect } from 'react';
import { Point } from './types/Point';
import './App.css';
import { Canvas } from './Canvas/Canvas';

const App: React.FC = () => {
  // const [point, setPoint] = useState<Point>({ x: 0, y: 0 });
  // const [pointList, setPointList] = useState<Point[]>([]);

  // const addPoint = (event: any) => {
  //   const newPoint: Point = {
  //     x: event.clientX,
  //     y: event.clientY
  //   };

  //   setPoint(newPoint);
  //   const newList = [...pointList, point];
  //   setPointList(newList);
  // }

  

  // console.log(point)

  return (
    // <canvas
    //   onClick={addPoint}
    //   style={{ border: '1px solid red' }}
    //   id='canvas'
    // >
    // </canvas>
    <Canvas />
  );
}

export default App;