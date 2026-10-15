export class GameController
{
    constructor(canvas, paddle, ball, block, color)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.paddle = paddle;
        this.paddleHitboxMargin = 10;
        this.ball = ball;
        this.blocks = block;
        this.color = color;

        this.keys = {
            left: false,
            right: false
        };
    }

    handleKeyDown(event)
    {
      if(event.key === "ArrowLeft")
      {
        this.keys.left = true;
      }
      if(event.key === "ArrowRight")
      {
        this.keys.right = true;
      }
    }

    handleKeyUp(event)
    {
      if(event.key === "ArrowLeft")
      {
        this.keys.left = false;
      }
      if(event.key === "ArrowRight")
      {
        this.keys.right = false;
      }
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

        // paddleの描画
        this.paddle.draw(this.ctx);
        this.ball.draw(this.ctx);
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

    hitPaddle(paddle, ball)
    {
      // paddleと高さが同じか
      if(paddle.y <= ball.y + ball.radius && ball.y + ball.radius <=  paddle.y + paddle.height)
      {
        // paddleの長さと同じx座標にballがあるか
        if(paddle.x - this.paddleHitboxMargin <= ball.x && ball.x <= paddle.x + paddle.width + this.paddleHitboxMargin)
        {
          ball.reflection(this.calculationPaddleReflectionDegrees(ball));
          ball.y = paddle.y - 10;
        }
      }
    }

    hitBlocks(ball)
    {
      for(let i = this.blocks.length - 1; 0 <= i; i--)
      {
        let block = this.blocks[i];
        if(block.y <= ball.y + ball.radius && ball.y - ball.radius <= block.y + block.height && block.x <= ball.x + ball.radius && ball.x - ball.radius <= block.x + block.width)
        {
          block.takeDamage(1);
          
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
              ball.reflection(360 - ball.degrees);
              break;
            case overlapLeft:
            case overlapRight:
              ball.reflection(180 - ball.degrees);
              break;
          }
          // ブロックの消去
          if(block.hp === 0)
          {
            this.blocks.splice(i, 1);
          }
          break;
          
        }
      }
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

      this.ball.move();

      this.hitPaddle(this.paddle, this.ball);
      this.hitBlocks(this.ball);

      this.draw();

      requestAnimationFrame(() => this.gameLoop());
    }

    start()
    {
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
        this.gameLoop();
    }

    stop()
    {
        window.removeEventListener("keydown", this.handleKeyDown.bind(this));
        window.removeEventListener("keyup", this.handleKeyUp.bind(this));
    }
}