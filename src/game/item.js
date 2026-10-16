export class Item
{
    constructor(id, x, y, radius, speed, color)
    {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.color = color;
        this.active = false;
    }

    setActive(bool)
    {
        this.active = bool;
    }

    move()
    {
        if(this.active)
        {
            this.y += this.speed;
        }
    }

    draw(ctx)
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}