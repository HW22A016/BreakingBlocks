export class GameController
{
    constructor(canvas, paddle, color)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.paddle = paddle;
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
    }

    gameLoop()
    {
      if(this.keys.left)
      {
        this.paddle.move("left");
      }
      if(this.keys.right)
      {
        this.paddle.move("right");
      }

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