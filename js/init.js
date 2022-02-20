//consts for players
const PL1_UP = "W".charCodeAt(0), PL1_LEFT = "A".charCodeAt(0), PL1_RIGHT = "D".charCodeAt(0), PL1_DOWN = "S".charCodeAt(0);
const PL2_UP = 38, PL2_LEFT = 37, PL2_RIGHT = 39, PL2_DOWN = 40;
const speed = 400, jumpSpeed = 700, grav = 1500; floorY = height - 128;
//for dt
var startTime, endTime;

//game elements
var pl1, pl2, ball, rect = { x : 0, y : 0, w : 0, h : 0 };
//score
var score1 = 0, score2 = 0;

//acdeilmnopt
var letters = [], digits = [];

function id(code) //software
{
	switch (code)
	{
		case "A".charCodeAt(0): return 0;
		case "C".charCodeAt(0): return 1;
		case "D".charCodeAt(0): return 2;
		case "E".charCodeAt(0): return 3;
		case "I".charCodeAt(0): return 4;
		case "L".charCodeAt(0): return 5;
		case "M".charCodeAt(0): return 6;
		case "N".charCodeAt(0): return 7;
		case "O".charCodeAt(0): return 8;
		case "P".charCodeAt(0): return 9;
		case "R".charCodeAt(0): return 10;
		case "S".charCodeAt(0): return 11;
		case "T".charCodeAt(0): return 12;
	}
	return -1;
}
function drawText(x, y, w, h, str)
{
	x -= w * str.length / 2;
	for (let i = 0; i < str.length; i++)
	{
		let l = id(str.charCodeAt(i));
		if (l >= 0) hdc.drawImage(letters[l], x + i * w, y, w, h);
	}
}
function drawInt(x, y, w, h, int)
{
	let len = 1, pow = 10;
	while (pow <= int)
	{
		pow *= 10;
		len++;
	}
	x += w * len / 2;
	
	do
	{
		let d = int % 10;
		hdc.drawImage(digits[d], x, y, w, h);
		x -= w;
		int = Math.floor(int / 10);
	}
	while (int > 0);
}

function gameover(x)
{
	var plF;
	
	if (x < rect.x) //fail pl1
	{
		score2++;
		plF = pl1;
	}
	else //fail pl2
	{
		score1++;
		plF = pl2;
	}
	plF.fail = true;
	plF.failSnd.play();
}