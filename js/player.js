class Player
{
	constructor(x, y, r, ku, kl, kr, lb, rb, str, scale, shiftUp)
	{
		//pos, rad, speed
		this.x = x;
		this.y = y;
		this.r = r;
		this.vx = this.vy = 0;
		this.ai = 0;
		
		//controls
		this.keyUp = ku;
		this.keyLeft = kl;
		this.keyRight = kr;
		//borders
		this.leftBorder = lb;
		this.rightBorder = rb;
		//fail?
		this.fail = false;
		
		//animation
		this.frames = [];
		for (let i = 0; i < 10; i++) this.frames.push(new Image());
		
		this.frames[0].src = "gfx/" + str + ".png";
		this.frames[1].src = "gfx/" + str + "2.png";
		this.frames[2].src = "gfx/" + str + "Jump.png";
		for (let i = 1; i <= 7; i++) this.frames[i + 2].src = "gfx/" + str + "Death" + i + ".png";
		
		//frames
		this.frameWalk = this.frameDeath = 0;
		this.frameWalkSpeed = 10;
		this.frameDeathSpeed = 7;
		//scaling image
		this.scale = scale;
		this.shiftUp = shiftUp;
		
		//sounds
		this.failSnd = new Audio("snd/" + str + "Fail.wav");
		this.failSnd.volume = 0.65;
	}
	unfail()
	{
		this.fail = false;
		this.y = floorY - this.r;
		this.vy = 0;
		this.frameDeath = 0;
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
			//ver
			this.vy += grav * dt;
			this.y += this.vy * dt;
			
			if (this.y > floorY - this.r)
			{
				this.y = floorY - this.r;
				if (keys[this.keyUp]) this.vy = -jumpSpeed;
				else this.vy = 0;
			}
			
			//hor
			this.vx = 0;
			if (keys[this.keyLeft]) this.vx -= speed;
			if (keys[this.keyRight]) this.vx += speed;
			
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
	
	draw()
	{
		let frame;
		if (this.fail) frame = this.frameDeath + 2;
		else 
		{
			if (this.y + this.r < floorY) frame = 2;
			else frame = this.frameWalk;
		}
		
		frame = Math.floor(frame);
		
		if (this.frames[frame].width > 0) //fit image
		{
			let img = this.frames[frame];
			let k = img.width / img.height;
			
			hdc.drawImage(img, this.x - k * this.scale * this.r, this.y - this.scale * this.r - this.shiftUp, 2 * k * this.scale * this.r, 2 * this.scale * this.r);
		}
	}
};