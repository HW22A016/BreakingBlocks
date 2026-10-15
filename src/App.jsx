import { useEffect, useState, useRef} from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import { GameController } from "./game/gameController";
import { Paddle } from "./game/paddle";
import { Ball } from "./game/ball";
import { Block } from './game/block';

function App() {
  // canvasRef = { current: null};を作る
  const canvasRef = useRef(null);
  const gameControllerRef = useRef(null);
  const paddleRef = useRef(null);
  const ballRef = useRef(null);
  const blocksRef = useRef([]);

  // Startみたいなもの
  useEffect(() => {
    const canvas = canvasRef.current;
    // paddleClass
    if(!paddleRef.current)
    {
      const x = Math.round(canvas.width / 2);
      const y = canvas.height - 40;
      const width = Math.round(canvas.width * 0.15);
      const height = 10;
      const speed = 5;
      const color = "white"
      paddleRef.current = new Paddle(x, y, width, height, speed, color, canvas.width);
    }

    // ballClass
    if(!ballRef.current)
    {
      const x = canvas.width / 2;
      const y = canvas.height - 60;
      const radius = 6;
      const speed = canvas.height / 200;
      const degree = Math.random() * (135 - 45) + 45;
      const atk = 1;
      ballRef.current = new Ball(x, y, radius, speed, degree, atk, canvas.width, canvas.height);
    }

    // blockClass
    if(blocksRef.current.length === 0)
    {
      const rows = Math.round(canvas.width / 80);
      const cols = Math.round(canvas.height / 30);
      const blockHeight = 10;
      // 間の空白
      const gap = 3;

      // 横の空白
      const margin = canvas.width / 10;
      // 横幅に余裕を持たせた時に使えるpx数 / 横に配置するブロックの数
      const blockWidth = (canvas.width - margin * 2  -  gap * rows) / rows;

      const startX = margin;
      const startY = 30;
      for(let i = 0; i < rows; i++)
      {
        const x = startX + i * (blockWidth + gap);
        for(let j = 0; j < cols; j++)
        {
          const y = startY + j * (blockHeight + gap);
          const hp = Math.floor(Math.random() * 2 + 1);
          blocksRef.current.push(new Block(x, y, blockWidth, blockHeight, hp));
        }
      }
    }
    
    // gameControllerClass
    if(!gameControllerRef.current)
    {
      gameControllerRef.current = new GameController(canvas, paddleRef.current, ballRef.current, blocksRef.current, "black");
    }

    gameControllerRef.current.start();

    return () => {
      gameControllerRef.current.stop();
    };

  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={600}/>
    </div>
  );
}

export default App
