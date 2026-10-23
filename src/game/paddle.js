export class Paddle
{
    constructor(x, y, width, height, speed, color, canvasWidth)
    {
        this.x = x - Math.round(width / 2);
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
        this.canvasWidth = canvasWidth;
        this.maxWidth = canvasWidth / 4;
    }

    setWidth(addWidth)
    {
        let width = this.width + addWidth;
        if(this.maxWidth < width)
        {
            addWidth = this.maxWidth - this.width;
        }
        this.width += addWidth;
        this.x -= addWidth / 2;
    }

    draw(ctx)
    {
        ctx.fillStyle = this.color;

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    move(direction)
    {
        if(direction === "left")
        {
            this.x -= this.speed;
            if(this.x < 0)
            {
                this.x = 0;
            }
        }

        if(direction === "right")
        {
            this.x += this.speed;
            if(this.canvasWidth < this.x + this.width)
            {
                this.x = this.canvasWidth - this.width;
            }
        }
    }
}