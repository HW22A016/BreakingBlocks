export class GameController
{
    constructor(canvas, paddle, ball, blocks, items, color)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.paddle = paddle;
        this.paddleHitboxMargin = 10;
        this.ball = ball;
        this.blocks = blocks;
        this.items = items;
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

        for(let i = this.items.length - 1; 0 <= i; i--)
        {
          this.items[i].draw(this.ctx);
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

    // ボールがパドルに当たった時の処理
    collectedBall(paddle, ball, hit)
    {
      if(hit)
      {
        ball.reflection(this.calculationPaddleReflectionDegrees(ball));
        // ball.y = paddle.y - 10;
      }
    }

    hitBall(paddle, ball)
    {
      // paddleと高さが同じか
      if(paddle.y <= ball.y + ball.radius && ball.y + ball.radius <=  paddle.y + paddle.height)
      {
        // paddleの長さと同じx座標にballがあるか
        if(paddle.x - this.paddleHitboxMargin <= ball.x && ball.x <= paddle.x + paddle.width + this.paddleHitboxMargin)
        {
          return true;
        }
        return false;
      }
    }

    // ボールがブロックに当たった時の処理
    collectedBlock()
    {
      
    }

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
        if(block.y <= ball.y + ball.radius && ball.y - ball.radius <= block.y + block.height && block.x <= ball.x + ball.radius && ball.x - ball.radius <= block.x + block.width)
        {
          block.takeDamage(1);
          
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
        this.paddle.setWidth(this.canvas.width / 10);
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
      for(let i = 0; i < this.items.length; i++)
      {
        this.items[i].move();
      }

      this.collectedBall(this.paddle, this.ball, this.hitBall(this.paddle, this.ball));
      this.hitBlock(this.ball, this.blocks);
      this.collectedItems();

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