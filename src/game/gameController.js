export class GameController
{
    constructor(canvas, paddle, ball, color)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.paddle = paddle;
        this.paddleHitboxMargin = 10;
        this.ball = ball;
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

    hitPaddle(ball)
    {
      // paddleと高さが同じか
      if(this.paddle.y <= ball.y + ball.radius && ball.y + ball.radius <=  this.paddle.y + this.paddle.height)
      {
        // paddleの長さと同じx座標にballがあるか
        if(this.paddle.x - this.paddleHitboxMargin <= ball.x && ball.x <= this.paddle.x + this.paddle.width + this.paddleHitboxMargin)
        {
          // ball.reflection(360 - ball.degrees);
          ball.reflection(this.calculationPaddleReflectionDegrees(ball));
          ball.y = this.paddle.y - 10;
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

      this.hitPaddle(this.ball);

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