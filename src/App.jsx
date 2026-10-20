// アイテムの設置個数を決めたい場合はブロックをランダムに選択して選ばれたブロックの設置座標を入れるほうが良いかも
// 列挙型を他のファイルに書くこともできるらしい
import { useEffect, useState, useRef} from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import { GameController } from "./game/gameController";
import { Paddle } from "./game/paddle";
import { Ball } from "./game/ball";
import { Block } from './game/block';
import { Item } from './game/item';

function App() {
  const [size, setSize] = useState({width: document.documentElement.clientWidth - 10, height:document.documentElement.clientHeight - 10,});
  // canvasRef = { current: null};を作る
  const canvasRef = useRef(null);
  const gameControllerRef = useRef(null);
  const paddleRef = useRef(null);
  const ballRef = useRef(null);
  const blocksRef = useRef([]);
  const itemsRef = useRef([]);
  const ItemType = Object.freeze({
    EXPAND_PADDLE: "expandPaddle",
    SPLIT_BALL: "splitBall",
  });

  // Startみたいなもの
  useEffect(() => {
    const canvas = canvasRef.current;
    // paddleClass
    if(!paddleRef.current)
    {
      const width = Math.min(Math.round(canvas.width * 0.15), 100);
      const height = 10;
      const x = Math.round(canvas.width / 2);
      // paddleの下が5 < yになるように計算
      const y = Math.min(Math.round(canvas.height * 0.93), canvas.height - height - 5);
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
      const speed = Math.min(Math.round(((canvas.width + canvas.height) / 2) / 200), 3);
      const degree = Math.random() * (135 - 45) + 45;
      const atk = 1;
      ballRef.current = new Ball(x, y, radius, speed, degree, atk, canvas.width, canvas.height);
    }

    // blockClass
    if(blocksRef.current.length === 0)
    {
      let id = 1;
      let rows = Math.round(canvas.width / 80);

      // 横の空白が20 < x < 40の大きさになるように計算
      const margin = Math.min(Math.max(canvas.width / 10, 20), 40);

      // 間の空白
      const gap = 3;

      // 横幅に余裕を持たせた時に使えるpx数 / 横に配置するブロックの数
      let blockWidth = (canvas.width - margin * 2  -  gap * rows) / rows;

      // ブロックの大きさが65未満になるように計算
      while(70 <= blockWidth)
      {
        const nextRows = rows + 1;
        const nextBlockWidth = (canvas.width - margin * 2 - gap * nextRows) / nextRows;

        if(nextBlockWidth < 60)
        {
          break;
        }

        rows = nextRows;
        blockWidth = nextBlockWidth;
      }

      // ブロックの上を20 < x < 50の空白を上に開ける
      const startY = Math.min(Math.max(canvas.height * 0.05, 20), 50);
      // ブロックの上の部分とplayerの下の部分の空白のpxを計算
      const topDownMargin = startY + (canvas.height - Math.min(Math.round(canvas.height * 0.93), canvas.height - 15));

      const cols = Math.round((canvas.height - topDownMargin) / 20);

      const blockHeight = 10;

      const startX = margin;
      for(let i = 0; i < rows; i++)
      {
        const x = startX + i * (blockWidth + gap);
        for(let j = 0; j < cols; j++)
        {
          const y = startY + j * (blockHeight + gap);
          const hp = Math.floor(Math.random() * 2 + 1);
          blocksRef.current.push(new Block(id, x, y, blockWidth, blockHeight, hp));
          id++;
        }
      }
    }

    if(itemsRef.current.length === 0)
    {
      const blocks = blocksRef.current;
      for(let i = 0; i < blocks.length; i++)
      {
        if(0.1 < Math.random())
        {
          continue;
        }
        const block = blocks[i];
        const id = block.id;
        const x = block.x + block.width / 2;
        const y = block.y + block.height / 2;
        const speed = Math.min((canvas.width + canvas.height) / 300, 2);
        const radius = block.height / 2;
        if(0.5 < Math.random())
        {
          itemsRef.current.push(new Item(id, x, y, radius, speed, "blue", ItemType.SPLIT_BALL))
        }
        else
        {
          itemsRef.current.push(new Item(id, x, y, radius, speed, "yellow", ItemType.EXPAND_PADDLE));
        }
      }
    }
    
    // gameControllerClass
    if(!gameControllerRef.current)
    {
      gameControllerRef.current = new GameController(canvas, paddleRef.current, ballRef.current, blocksRef.current, itemsRef.current, "black", ItemType);
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
        width={size.width}
        height={size.height}/>
    </div>
  );
}

export default App
