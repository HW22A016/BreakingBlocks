export class Block
{
    constructor(id, x, y, width, height, margin, hp)
    {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.margin = margin / 2;
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