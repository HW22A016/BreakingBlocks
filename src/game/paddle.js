export class Paddle
{
    constructor(x, y, width, height, speed, color)
    {
        this.x = x - Math.round(width / 2);
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
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
        }

        if(direction === "right")
        {
            this.x += this.speed;
        }
    }
}