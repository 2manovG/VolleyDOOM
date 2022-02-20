class Cpu extends Player
{
	constructor(x, y, r, ku, kl, kr, lb, rb, str, scale, shiftUp)
	{
		super(x, y, r, ku, kl, kr, lb, rb, str, scale, shiftUp);
		this.targX = x;
		this.ai = true;
	}
	
	AI(dt)
	{
		let bcopy = new BCopy(ball);
		let dist = 100;
		for (let i = 0; i < dist; i++)
		{
			bcopy.update(dt);
			if (!bcopy.play) break;
		}
		this.targX = bcopy.x;
		
		if (Math.abs(ball.vx) < speed / 2)
		{
			let off = this.r / 4;
			if (this.targX < width / 2) this.targX += off;
			else this.targX -= off;
		}
	}
	jump()
	{
		return this.targX > this.x - this.r && this.targX < this.x + this.r && ball.y > this.y - 2 * this.r &&
			ball.vy > 0 && 1.5 * Math.abs(ball.vx) < ball.vy;
	}
	left()
	{
		return this.targX < this.x;
	}
	right()
	{
		return this.targX > this.x;
	}
	
	update(dt)
	{
		if (this.fail)
		{
			if (this.frameDeath < 7) this.frameDeath += this.frameDeathSpeed * dt;
			
			this.vy += grav * dt;
			this.y += this.vy * dt;
			if (this.y > floorY - this.r)this.y = floorY - this.r;
		}
		else
		{
			this.AI(dt);
			//ver
			this.vy += grav * dt;
			this.y += this.vy * dt;
			
			if (this.y > floorY - this.r)
			{
				this.y = floorY - this.r;
				if (this.jump()) this.vy = -jumpSpeed;
				else this.vy = 0;
			}
			
			//hor
			this.vx = 0;
			if (this.left()) this.vx -= speed;
			if (this.right()) this.vx += speed;
			
			this.x += this.vx * dt;
			if (this.x < this.leftBorder + this.r) { this.x = this.leftBorder + this.r; this.vx = 0; }
			else if (this.x > this.rightBorder - this.r) { this.x = this.rightBorder - this.r; this.vx = 0; }
			
			//animation
			if (this.vx != 0)
			{
				this.frameWalk += this.frameWalkSpeed * dt;
				if (this.frameWalk >= 2) this.frameWalk -= 2;
			}
			else this.frameWalk = 0;
		}
	}
};