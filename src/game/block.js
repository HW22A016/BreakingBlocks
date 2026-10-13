export class Block
{
    constructor(x, y, width, height, color)
    {
        this.x = x - Math.round(width / 2);
        this.y = y;
        this.width = width;
        this.height = height;
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
}