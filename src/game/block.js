export class Block
{
    constructor(x, y, width, height, hp)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hp = hp;

        this.type = null;
        this.item = null;
    }

    takeDamage(damage)
    {
        this.hp -= damage;
    }

    draw(ctx)
    {
        switch(this.hp)
        {
            case 1:
                ctx.fillStyle = "red";
                break;
            case 2:
                ctx.fillStyle = "green";
        }

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}