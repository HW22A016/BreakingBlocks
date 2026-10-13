export class Ball
{
    constructor(x, y, radius, speed, degrees, canvasWidth, canvasHeight)
    {
        this.x = x;
        this. y = y;
        this.radius = radius;
        this. speed = speed;
        this.degrees = degrees;
        this.radian = this.toRadian(degrees);
        // 移動量
        this.dx = Math.cos(this.radian);
        this.dy = Math.sin(this.radian);
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    toRadian(degrees)
    {
        return degrees * (Math.PI / 180)
    }

    reflection(degrees)
    {
        this.degrees = degrees;
        if(360 <= this.degrees)
        {
            this.degrees %= 360;
        }
        this.radian = this.toRadian(this.degrees);
        this.dx = Math.cos(this.radian);
        this.dy = Math.sin(this.radian);
    }

    move()
    {
        this.x += this.dx * this.speed;
        // 左壁との衝突判定
        if(this.x - this.radius < 0)
        {
            this.x = this.radius;

            this.reflection(180 - this.degrees)
        }
        // 右壁との衝突判定
        else if(this.canvasWidth < this.x + this.radius)
        {
            this.x = this.canvasWidth - this.radius;

            this.reflection(180 - this.degrees)
        }
        this.y -= this.dy * this.speed;
        // 天井の衝突判定
        if(this.y - this.radius < 0)
        {
            this.y = this.radius;

            this.reflection(360 - this.degrees)
        }
    }

    draw(ctx)
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }
}