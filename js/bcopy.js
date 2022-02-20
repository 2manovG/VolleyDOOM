class BCopy
{
	constructor(b)
	{
		//pos, rad & speed
		this.x = b.x;
		this.y = b.y;
		this.r = b.r;
		this.vx = b.vx;
		this.vy = b.vy;

		//vars for physics and drawing
		this.play = true;
		this.maxSpeed = 1000;
	}
	
	bounceOf(px, py, spx, spy)
	{
		let prevX = this.x, prevY = this.y;
		
		let dx = px - this.x, dy = py - this.y;
		let dist = Math.sqrt(dx * dx + dy * dy);
		if (dist <= 0) dist = 1;
		
		if (dist <= this.r)
		{
			let nx = dx / dist, ny = dy / dist, tx = -ny, ty = nx;
			let dpTan = this.vx * tx + this.vy * ty;
			
			let dpNorm1 = this.vx * nx + this.vy * ny;
			let dpNorm2 = spx * nx + spy * ny;
			let m = 2 * dpNorm2 - dpNorm1;
			
			this.vx = tx * dpTan + nx * m;
			this.vy = ty * dpTan + ny * m;
			
			let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
			this.vx *= this.maxSpeed / speed;
			this.vy *= this.maxSpeed / speed;
			
			this.x += nx * (dist - this.r);
			this.y += ny * (dist - this.r);
			
			if (this.x != this.x || this.y != this.y)
			{
				this.x = prevX;
				this.y = prevY;
				this.vx = this.vy = 0;
			}
			return true;
		}
		return false;
	}
	
	update(dt)
	{
		if (this.play)
		{
			if (this.vx != this.vx) this.vx = 0;
			if (this.vy != this.vy) this.vy = 0;
			
			this.vy += grav * dt;
			this.x += this.vx * dt;
			this.y += this.vy * dt;
			
			this.angle += this.angleSpeed * this.vx * dt;
			
			//resolve borders
			let slow = 0.99;
			if (this.x < this.r) { this.x = this.r; this.vx *= -slow; this.vy *= slow; }
			if (this.y < this.r) { this.y = this.r; this.vx *= slow; this.vy *= -slow; }
			if (this.x > width - this.r) { this.x = width - this.r; this.vx *= -slow; this.vy *= slow; }
			
			//game over
			if (this.y > floorY - this.r)
			{
				this.play = false;
			}
			
			//resolve rect
			let closX = Math.min(Math.max(rect.x, this.x), rect.x + rect.w);
			let closY = Math.min(Math.max(rect.y, this.y), rect.y + rect.h);
			
			if (this.bounceOf(closX, closY, 0, 0))
			{
				this.vx *= slow;
				this.vy *= slow;
			}
		}
	}
};