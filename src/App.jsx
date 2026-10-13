import { useEffect, useState, useRef} from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import { GameController } from "./game/gameController";
import { Paddle } from "./game/paddle";
import { Ball } from "./game/ball";

function App() {
  // canvasRef = { current: null};を作る
  const canvasRef = useRef(null);
  const gameControllerRef = useRef(null);
  const paddleRef = useRef(null);
  const ballRef = useRef(null);

  // Startみたいなもの
  useEffect(() => {
    const canvas = canvasRef.current;
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

    if(!ballRef.current)
    {
      const x = canvas.width / 2;
      const y = canvas.height - 60;
      const radius = 6;
      const speed = 1.5;
      const degree = Math.random() * (135 - 45) + 45;
      ballRef.current = new Ball(x, y, radius, speed, degree, canvas.width, canvas.height);
    }
    
    if(!gameControllerRef.current)
    {
      gameControllerRef.current = new GameController(canvas, paddleRef.current, ballRef.current, "black");
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
        height={500}/>
    </div>
  );
}

export default App
