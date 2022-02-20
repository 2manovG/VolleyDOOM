class Ball
{
	constructor(x, y, r)
	{
		//pos, rad & speed
		this.x = this.startX = x;
		this.y = this.startY = y;
		this.r = r;
		this.vx = this.vy = 0;

		//vars for physics and drawing
		this.play = false;
		this.maxSpeed = 1000;
		this.angle = 0;
		this.angleSpeed = 0.01;
		this.impact = 0;
		this.impactMax = 0.2;
		
		//frames
		this.frames = [];
		for (let i = 0; i < 4; i++) 
		{
			this.frames.push(new Image());
			this.frames[i].src = "gfx/skull" + (i + 1) + ".png";
		}
		this.frame = 0;
		this.frameDelay = 0;
		this.frSpeed = 1.5;
		this.frSpeed2 = 7;
		
		this.scale = 1.5;
		this.shiftUp = 12;
		
		//snd
		this.impactSnd = new Audio("snd/skullHit.wav");
		this.impactSnd.volume = 0.3;
	}
	
	reset()
	{
		this.x = this.startX;
		this.y = this.startY;
		this.vx = this.vy = 0;
		this.angle = 0;
		this.impact = 0;
		
		this.play = false;
	}
	launch()
	{
		let minPow = 250, deltaPow = 150;
		
		this.vx = Math.random() * deltaPow + minPow;
		if (Math.random() < 0.5) this.vx = -this.vx;
		
		this.vy = -200;
		this.play = true;
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
			this.doImpact();
			
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
	doImpact()
	{
		if (this.impact <= 0) { this.impactSnd.currentTime = 0; this.impactSnd.play(); }
		this.impact = this.impactMax;
		this.frame = 1;
	}
	
	update(dt)
	{
		if (this.impact > 0) this.impact -= dt;
		if (this.frame > 0) this.frame -= this.frSpeed * dt;
		
		this.frameDelay += this.frSpeed2 * dt;
		if (this.frameDelay >= 2) this.frameDelay -= 2;
		
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
				gameover(this.x);
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
	
	draw()
	{
		hdc.save();
		hdc.translate(this.x, this.y);
		hdc.rotate(this.angle);
		
		let frame = 2 * Math.ceil(this.frame) + Math.floor(this.frameDelay);
		if (frame < 0) frame = 0;
		if (frame > 3) frame = 3;
		
		let img = this.frames[frame];
		let k = img.width / img.height;
		
		hdc.drawImage(img, -k * this.scale * this.r, -this.scale * this.r - this.shiftUp, 2 * k * this.scale * this.r, 2 * this.scale * this.r);
		
		hdc.restore();
	}
};