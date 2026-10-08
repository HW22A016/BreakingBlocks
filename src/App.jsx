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
      paddleRef.current = new Paddle(300, 550, 100, 15, 5, "white");
    }
    if(gameControllerRef.current === null)
    {
      gameControllerRef.current = new GameController(canvas, paddleRef.current, "black");
    }

    gameControllerRef.current.draw();

    gameControllerRef.current.start();

    return () => {
      gameControllerRef.current.stop();
    };

  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}/>
    </div>
  );
}

export default App
