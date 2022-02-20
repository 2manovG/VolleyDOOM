var guiImg, guiHead, arrows, wasd, chipAI, bkg, rectImg, timer, timerSpeed, timerInt, sndT1, sndT2, gameStart, BGM;
	
class Game
{
	setup(sel)
	{
		let r = 50, x = 100;
		
		rect.w = 16;
		rect.h = 200;
		rect.x = (width - rect.w) / 2;
		rect.y = floorY - rect.h;
		
		switch (sel)
		{
			case 0: //pl vs ai
				pl1 = new Player(x, floorY - r, r, PL1_UP, PL1_LEFT, PL1_RIGHT, 0, rect.x, "caco", 1.25, 0);
				pl2 = new Cpu(width - x, floorY - r, r, PL2_UP, PL2_LEFT, PL2_RIGHT, rect.x + rect.w, width, "pain", 1.45, 15);
				break;
				
			case 1: //ai vs pl
				pl1 = new Cpu(x, floorY - r, r, PL1_UP, PL1_LEFT, PL1_RIGHT, 0, rect.x, "caco", 1.25, 0);
				pl2 = new Player(width - x, floorY - r, r, PL2_UP, PL2_LEFT, PL2_RIGHT, rect.x + rect.w, width, "pain", 1.45, 15);
				break;
				
			case 2: //pl vs pl
				pl1 = new Player(x, floorY - r, r, PL1_UP, PL1_LEFT, PL1_RIGHT, 0, rect.x, "caco", 1.25, 0);
				pl2 = new Player(width - x, floorY - r, r, PL2_UP, PL2_LEFT, PL2_RIGHT, rect.x + rect.w, width, "pain", 1.45, 15);
				break;
			
			case 3: //ai vs ai
				pl1 = new Cpu(x, floorY - r, r, PL1_UP, PL1_LEFT, PL1_RIGHT, 0, rect.x, "caco", 1.25, 0);
				pl2 = new Cpu(width - x, floorY - r, r, PL2_UP, PL2_LEFT, PL2_RIGHT, rect.x + rect.w, width, "pain", 1.45, 15);
				break;
		}
		ball = new Ball(width / 2, height / 4, r / 2);
		
		startTime = new Date();
		
		guiImg = new Image();
		guiImg.src = "gfx/gui.png";
		guiHead = [];
		for (let i = 0; i <= 4; i++) 
		{
			guiHead.push(new Image());
			guiHead[i].src = "gfx/guiH" + (i + 1) + ".png";
		}
		for (let i = 0; i <= 13; i++)
		{
			letters.push(new Image());
			letters[i].src = "letters/" + (i + 1) + ".png";
		}
		for (let i = 0; i < 10; i++)
		{
			digits.push(new Image());
			digits[i].src = "gfx/" + i + ".png";
		}
		
		arrows = new Image();
		arrows.src = "gfx/arrows.png";
		wasd = new Image();
		wasd.src = "gfx/wasd.png";
		chipAI = new Image();
		chipAI.src = "gfx/ai.png";
		bkg = new Image();
		bkg.src = "gfx/bkg.png";
		rectImg = new Image();
		rectImg.src = "gfx/rect.png";
		
		timer = 3.99;
		timerInt = 4;
		timerSpeed = 2;
		gameStart = true;
		
		sndT1 = new Audio("snd/timer1.wav");
		sndT1.volume = 0.5;
		sndT2 = new Audio("snd/timer2.wav");
		sndT2.volume = 0.5;
		
		BGM = new Audio("snd/game.ogg"); 
		if (typeof BGM.loop == 'boolean')
		{
			BGM.loop = true;
		}
		else
		{
			BGM.addEventListener('ended', function() {
				this.currentTime = 0;
				this.play();
			}, false);
		}
		BGM.volume = 0.5;
	}

	resolve(b, pl)
	{
		if (!pl.fail)
		{
			let dx = b.x - pl.x;
			let dy = b.y - pl.y;
			let dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
			if (dist < pl.r)
			{
				dx /= -dist;
				dy /= -dist;
			}
			else
			{
				dx *= pl.r / dist;
				dy *= pl.r / dist;
			}
			b.bounceOf(pl.x + dx, pl.y + dy, pl.vx, Math.min(0, pl.vy));
		}
	}

	update()
	{
		endTime = new Date();
		let dt = Math.min((endTime - startTime) / 1000, 0.05);
		startTime = endTime;
		
		if (timer >= 0 && !gameStart)
		{
			timer -= timerSpeed * dt;
			if (timer < timerInt)
			{
				timerInt--;
				if (timerInt > 0) {sndT1.currentTime = 0; sndT1.play();}
				else sndT2.play();
			}
			if (timer < 0) ball.launch();
		}
		else if (!ball.play && keyPress(13))
		{
			if (pl1.fail) pl1.unfail();
			if (pl2.fail) pl2.unfail();
			ball.reset();
			timer = 3.99;
			timerInt = 4;
			
			if (gameStart) BGM.play();
			gameStart = false;
		}
		
		if (!gameStart)
		{
			let n = 10;
			for (let i = 0; i < n; i++)
			{
				pl1.update(dt / n);
				pl2.update(dt / n);
				
				ball.update(dt / n);
				this.resolve(ball, pl1);
				this.resolve(ball, pl2);
			}
		}
			
		for (let i = 0; i < keys.length; i++)pkeys[i] = keys[i];
		for (let i = 0; i < mouse.length; i++)pmouse[i] = mouse[i];
	}
	draw()
	{
		hdc.clearRect(0, 0, width, height);
		
		//background
		hdc.drawImage(bkg, 0, 0, width, height);
		
		//controls
		if (pl1.ai) hdc.drawImage(chipAI, 16, 16);
		else hdc.drawImage(wasd, 16, 16);
		
		if (pl2.ai) hdc.drawImage(chipAI, width - chipAI.width - 16, 16);
		else hdc.drawImage(arrows, width - arrows.width - 16, 16);
		
		//game objects
		pl1.draw();
		pl2.draw();
		ball.draw();
		//rect
		hdc.drawImage(rectImg, rect.x, rect.y, rect.w, rect.h);
		
		//gui
		if (guiImg.width > 0)
		{
			let k = guiImg.height / guiImg.width;
			hdc.drawImage(guiImg, 0, height - width * k, width, width * k);
		}
		//head
		let offX = 64, frame = 0, sz = 32;
		if (pl1.fail || pl2.fail) frame = 3;
		else if (ball.x < width / 2 - offX) frame = 1;
		else if (ball.x > width / 2 + offX) frame = 2;
		hdc.drawImage(guiHead[frame], width / 2 - sz, height - 2 * sz - 8, 2 * sz, 2 * sz);
		
		//texts
		drawText(width / 4 - 24, height - 24, 16, 16, "CACODEMON");
		drawText(3 * width / 4 + 24, height - 24, 16, 16, "PAIN ELEMENTAL");
		
		//scores
		drawInt(width / 4 - 24 - 26, height - 70, 28, 32, score1);
		drawInt(3 * width / 4 + 24 - 26, height - 70, 28, 32, score2);
		
		//timer & pressstart
		if (gameStart)
		{
			drawText(width / 2, height / 2, 24, 24, "PRESS ENTER TO START");
		}
		else
		{
			let sz1 = 64, sz2 = sz1 * 16 / 14;
			if (timer >= 0) drawInt(width / 2 - 2 * sz1, height / 2 - sz2, 2 * sz1, 2 * sz2, Math.floor(timer));
		}
	}
};