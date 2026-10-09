import { useEffect, useState, useRef} from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import { Paddle } from "./game/paddle";
import { GameController } from "./game/gameController";

function App() {
  // canvasRef = { current: null};を作る
  const canvasRef = useRef(null);
  const gameControllerRef = useRef(null);
  const paddleRef = useRef(null);

  // Startみたいなもの
  useEffect(() => {
    const canvas = canvasRef.current;
    if(paddleRef.current === null)
    {
      paddleRef.current = new Paddle(Math.round(canvas.width / 2), canvas.height - 40, Math.round(canvas.width * 0.15), 10, 5, "white", canvas.width);
    }
    if(gameControllerRef.current === null)
    {
      gameControllerRef.current = new GameController(canvas, paddleRef.current, "black");
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
