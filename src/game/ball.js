export class Ball
{
    constructor(x, y, radius, speed, degrees)
    {
        this.x = x;
        this. y = y;
        this.radius = radius;
        this. speed = speed;
        this.degrees = degrees
        this.radian = this.radian(degrees)
        this.dx = Math.cos(this.radian);
        this.dy = Math.sin(this.radian);
    }

    radian(degrees)
    {
        return degrees * (Math.PI / 180)
    }

    draw(ctx)
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }

    move()
    {
        console.log(this.degrees, this.dx, this.dy);
        this.x += this.dx * this.speed;
        this.y -= this.dy * this.speed;
    }
}