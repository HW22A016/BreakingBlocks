import { Ball } from "./ball";
export class GameController
{
    constructor(canvas, paddle, ball, blocks, items, color, ItemType, onGameOver, onGameClaer)
    {
        this.canvas = canvas;
        this.halfCanvas = canvas.width / 2;
        this.ctx = canvas.getContext("2d");
        this.paddle = paddle;
        this.paddleHitboxMargin = 10;
        this.ball = [ball];
        this.maxBallLength = 16;
        this.blocks = blocks;
        this.items = items;
        this.color = color;
        this.ItemType = ItemType;

        this.onGameOver = onGameOver;
        this.onGameClaer = onGameClaer;

        this.keys = {
            left: false,
            right: false
        };
    }

    handleKeyDown(e)
    {
      if(e.key === "ArrowLeft")
      {
        this.keys.left = true;
      }
      if(e.key === "ArrowRight")
      {
        this.keys.right = true;
      }
    }

    handleKeyUp(e)
    {
      if(e.key === "ArrowLeft")
      {
        this.keys.left = false;
      }
      if(e.key === "ArrowRight")
      {
        this.keys.right = false;
      }
    }

    handlePointerDown(e)
    {
      if(e.clientX < this.halfCanvas)
      {
        this.keys.left = true;
      }
      if(this.halfCanvas < e.clientX)
      {
        this.keys.right = true;
      }
    }

    handlePointerUp()
    {
      this.keys.left = false;
      this.keys.right = false;
    }

    // 背景
    drawBackground()
    {
        // キャンバスの背景
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw()
    {
        this.drawBackground();
        
        for(let i = this.blocks.length - 1; 0 <= i; i--)
        {
          this.blocks[i].draw(this.ctx);
        }

        for(let i = this.items.length - 1; 0 <= i; i--)
        {
          this.items[i].draw(this.ctx);
        }

        // paddleの描画
        this.paddle.draw(this.ctx);
        for(let i = 0; i < this.ball.length; i++)
        {
          this.ball[i].draw(this.ctx);
        }
    }

    calculationPaddleReflectionDegrees(ball)
    {
      // paddleの遊びを持たせたpaddleの長さ
      const paddleRightPos = this.paddle.x + this.paddle.width + this.paddleHitboxMargin;
      // paddleに遊びを持たせた時の長さ
      const paddleLength = this.paddle.width + this.paddleHitboxMargin * 2;
      // paddleのどのあたりに当たったかの割合
      const paddleRatio = (paddleRightPos - ball.x) / paddleLength;
      // ボールを返す角度(10度~170度)
      const degrees = paddleRatio * 160 + 10;

      return degrees;
    }

    hitBall(paddle, ball)
    {
      // paddleと高さが同じか
      if(paddle.y <= ball.y + ball.radius && ball.y - ball.radius <=  paddle.y + paddle.height)
      {
        // paddleの長さと同じx座標にballがあるか
        if(paddle.x - this.paddleHitboxMargin <= ball.x && ball.x <= paddle.x + paddle.width + this.paddleHitboxMargin)
        {
          return true;
        }
        return false;
      }
    }

    // ボールがパドルに当たった時の処理
    collectedBall(ball, hit)
    {
      if(hit)
      {
        ball.reflection(this.calculationPaddleReflectionDegrees(ball));
      }
    }

    // ブロックの反射角度を求める関数
    getBlockReflectionAngle(ball, block)
    {
      // ブロックから見た時のめりこみ量
      // 浅いほうがボールとの距離が近い
      let overlapLeft = (ball.x + ball.radius) - block.x;
      let overlapRight = (block.x + block.width) - (ball.x - ball.radius);
      let overlapTop = (ball.y + ball.radius) - block.y;
      let overlapBottom = (block.y + block.height) - (ball.y - ball.radius);

      let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
      switch(minOverlap)
      {
        case overlapTop:
        case overlapBottom:
          return 360;
        case overlapLeft:
        case overlapRight:
          return 180;
      }
    }

    // ブロックを削除する関数
    destroyBlock(block, index)
    {
      this.blocks.splice(index, 1);
      const item = this.items.find(item => item.id === block.id);
      if(item)
      {
        item.setActive(true);
      }
    }

    hitBlock(ball, blocks)
    {
      for(let i = blocks.length - 1; 0 <= i; i--)
      {
        let block = blocks[i];
        if(block.y - block.margin <= ball.y + ball.radius && ball.y - ball.radius <= block.y + block.height + block.margin && block.x - block.margin <= ball.x + ball.radius && ball.x - ball.radius <= block.x + block.width + block.margin)
        {
          block.takeDamage(ball.getATK());
          
          ball.reflection(this.getBlockReflectionAngle(ball, block) - ball.degrees);
          
          // ブロックの消去
          if(block.hp === 0)
          {
            this.destroyBlock(block, i);
          }
          break;
        }
      }
    }

    // paddleにitemが当たった時の処理
    collectedItems()
    {
      const collectedItems = this.hitItems(this.paddle, this.items);
      for(let i = 0; i < collectedItems.length; i++)
      {
        // paddleに当たったitemTypeの分岐
        switch(collectedItems[i].type)
        {
          case this.ItemType.EXPAND_PADDLE:
            this.paddle.setWidth(Math.min(this.canvas.width / 10, 30));
            break;
          case this.ItemType.SPLIT_BALL:
            const ballLength = this.ball.length;
            let count = ballLength;
            for(let j = 0; j < ballLength; j++)
            { 
              if(this.maxBallLength <= count)
              {
                break;
              }
              let ball = this.ball[j];
              let angle = Math.random() * 360;
              while(170 < angle && angle < 190)
              {
                angle = Math.random() * 360;
              }
              this.ball.push(new Ball(ball.x, ball.y, ball.radius, ball.speed, angle, ball.atk, this.canvas.width, this.canvas.height));
              count++;
            }
            break;
        }
      }
      this.items = this.items.filter(item => !collectedItems.includes(item));
    }
    
    // 当たったアイテムを配列で返す
    hitItems(paddle, items)
    {
      const hitItems = [];
      for(let i = items.length - 1; 0 <= i; i--)
      {
        const item = items[i];
        if(paddle.y <= item.y + item.radius && item.y - item.radius <= paddle.y + paddle.height && paddle.x <= item.x + item.radius && item.x - item.radius <= paddle.x + paddle.width)
        {
          hitItems.push(item);
        }
      }
      return hitItems
    }

    judgeBallOut(ball)
    {
      if(this.canvas.height <= ball.y)
      {
        return true;
      }
      return false;
    }

    destroyBall(index)
    {
      this.ball.splice(index, 1);
    }

    gameLoop()
    {
      // paddleの移動入力
      if(this.keys.left)
      {
        this.paddle.move("left");
      }
      if(this.keys.right)
      {
        this.paddle.move("right");
      }

      for(let i = 0; i < this.ball.length; i++)
      {
        let ball = this.ball[i];
        ball.move();
        if(this.judgeBallOut(ball))
        {
          this.destroyBall(i);
        }
        this.collectedBall(ball, this.hitBall(this.paddle, ball));
        this.hitBlock(ball, this.blocks);
      }
      for(let i = 0; i < this.items.length; i++)
      {
        this.items[i].move();
      }

      this.collectedItems();

      this.draw();

      if(this.blocks.length === 0)
      {
        this.onGameClaer();
        return;
      }
      if(this.ball.length === 0)
      {
        this.onGameOver();
        return;
      }
      requestAnimationFrame(() => this.gameLoop());
    }

    start()
    {
      // キーボード入力
      window.addEventListener("keydown", this.handleKeyDown.bind(this));
      window.addEventListener("keyup", this.handleKeyUp.bind(this));
      // タッチ入力
      window.addEventListener("pointerdown", this.handlePointerDown.bind(this));
      window.addEventListener("pointerup", this.handlePointerUp.bind(this));
      this.gameLoop();
    }

    stop()
    {
      // キーボード入力
      window.removeEventListener("keydown", this.handleKeyDown.bind(this));
      window.removeEventListener("keyup", this.handleKeyUp.bind(this));
      // タッチ入力
      window.removeEventListener("pointerdown", this.handlePointerDown.bind(this));
      window.removeEventListener("pointerup", this.handlePointerUp.bind(this));
    }
}