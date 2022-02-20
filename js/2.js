//menu code
var game = null;
var sel = 0, skullTimer = 0; //select menu
var skullImg = [ new Image(), new Image()], menuImg = [new Image(), new Image(), new Image()], title = new Image();

skullImg[0].src = "gfx/menuskull1.png";
skullImg[1].src = "gfx/menuskull2.png";
menuImg[0].src = "gfx/menu1.png";
menuImg[1].src = "gfx/menu2.png";
menuImg[2].src = "gfx/menu3.png";
title.src = "gfx/title.png";

function tick()
{
	if (game) //game
	{
		game.update();
		game.draw();
	}
	else //menu
	{
		//update
		if ((keyPress(PL1_DOWN) || keyPress(PL2_DOWN)) && sel < 2) sel++;
		else if ((keyPress(PL1_UP) || keyPress(PL2_UP)) && sel > 0) sel--;
		else if (keyPress(13))
		{
			game = new Game();
			game.setup(sel);
			return;
		}
		else if (keyPress(101))
		{
			game = new Game();
			game.setup(3);
			return;
		}
		skullTimer += 0.1;
		if (skullTimer >= 2) skullTimer -= 2;
		
		//draw
		let x = width / 2, dx = 156, dy0 = 64, dy = 64, k = 2,
			y = [height / 2 + dy0, height / 2 + dy0 + dy, height / 2 + dy0 + 2 * dy];
			
		hdc.fillStyle = "black";
		hdc.beginPath();
		hdc.rect(0, 0, width, height);
		hdc.fill();
		
		//title
		let titleK = 3;
		if (title.width > 0)
			hdc.drawImage(title, x - title.width * titleK / 2, 80, title.width * titleK, title.height * titleK);
		
		//menus
		for (let i = 0; i < menuImg.length; i++)
			if (menuImg[i].width > 0)
				hdc.drawImage(menuImg[i], x - menuImg[i].width * k / 2, y[i], menuImg[i].width * k, menuImg[i].height * k);

		//skulls
		let skull = skullImg[Math.floor(skullTimer)];
		
		for (let i = -1; i < 2; i += 2)
			if (skull.width > 0)
				hdc.drawImage(skull, x + i * dx - skull.width * k / 2, y[sel] - 6, skull.width * k, skull.height * k);
		
		//bottom left
		hdc.fillStyle = "white";
		hdc.font = "14px Arial";
		hdc.textAlign = "right";
		hdc.textBaseline = "bottom";
		
		hdc.fillText("Sprites, sounds and music by id Software. Terrible physics by me", width - 2, height - 2);
	}
	
	for (let i = 0; i < keys.length; i++) pkeys[i] = keys[i];
}
setInterval(tick, 10);