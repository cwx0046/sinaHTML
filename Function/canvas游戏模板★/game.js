var gameZone = document.getElementById("gameZone");
var canvas=gameZone.getContext("2d");


var continerDom = $("#page2");
var diskDom = $("#ui_disk");
var scoreDom = $(".ui_score");
var finalScoreDom = $("#ui_finalScore");
var timeDom = $("#ui_time");
var GAMEWIDTH = 320;
var GAMEHEIGHT = 480;
var FPS = 1000/60;
var fruitCount = 10000; //元素id
var frame = 0;
var score = 0;
var time = 30;
var pause = false;
var fruits = [];
var scores = [];
var iFrame; //帧循环器
var iTime;  //游戏时间计时器
var rate = 20;   //水果产生率


var img_p = new Image(); img_p.src = "http://jiangsu.sinaimg.cn/2014/1010/U9263P1194DT20141010170245.png";
var img_3 = new Image(); img_3.src = "http://jiangsu.sinaimg.cn/2014/1010/U9263P1194DT20141010170244_1.png";
var img_1 = new Image(); img_1.src = "http://jiangsu.sinaimg.cn/2014/1010/U9263P1194DT20141010170243.png";
var img_m1 = new Image(); img_m1.src = "http://jiangsu.sinaimg.cn/2014/1010/U9263P1194DT20141010170244.png";


var disk = {
	x: 30,
	y: 360,
	width: 60,
	height: 15,
	update: function (x,y){
				this.x = x;
				this.y = y-30;
			},
	draw : function(){
		canvas.drawImage(img_p, this.x -10 , this.y , img_p.width, img_p.height);
	}
};

var t_f = [{score : 3, className: "f_3"},
		   {score : 1, className: "f_1"},
		   {score : -10,className: "f_-10"}]; 

/* 游戏入口 */
function gameStart(rate){
	this.rate = rate;
	gameReset();
	timer();//计时器
	/* 帧播放 */
	iFrame = setInterval(function() {
		frame++;
		update();
	}, FPS);
}
gameStart(1);

/* 游戏重置 */
function gameReset(){
	fruitCount = 10000; //元素id
	frame = 0;
	score = 0;
	time = 30;
	pause = false;
	fruits = [];
	
	clearInterval(iFrame); //帧停止
	clearInterval(iTime);  //时间计时停止
	
	scoreDom.text(score);
	
	//移除所有 f_ 开头的类元素
	//$("div:[class^=abs f_]").remove();
}

/* 帧更新 */
function update() {
	if(pause){return;} //如果暂停，停止更新帧
	canvas.clearRect(0, 0, GAMEWIDTH, GAMEHEIGHT); //清屏
	handleFruitsAdd();
	handleFruitsUpdate(); //水果位置更新
	handleFruitsDraw(); //水果位置绘制
	handleDiskDraw(); 
	handleCollisions(); //碰撞检测
	handleScoreUpdate();
	handleScoreDraw();
	handleFPS(); // FPS帧率显示
}

function handleFPS() {
	var FPS = calculateFps().toFixed(2);
	canvas.font = '30px Consolas';
	canvas.fillStyle = '#FFFF00';
	canvas.fillText( FPS + ' fps', 0, 30);
	canvas.lineWidth = 0.5;
	canvas.strokeStyle = '#000000';
	canvas.strokeText( FPS + ' fps', 0, 30);
}
var lastTime;
function calculateFps() {
	var now = (+new Date),
	fps = 1000 / (now - lastTime);
	lastTime = now;
	return fps;
}

function handleScoreUpdate() {
	scores.forEach(function(S) {
		S.update();
	});
}

function handleScoreDraw() {
	scores.forEach(function(S) {
		S.draw();
	});
}
function handleFruitsAdd() {
	if(time<0){return;}
	if(frame % Math.round(rate*Math.random()+rate) == 0){ // 生成水果
		var r = Math.floor(Math.random()*3)//随机水果
		var f = t_f[r];
		fruits.push(fruit({
			x: (GAMEWIDTH - 25) * Math.random(),
			score : f.score,
			className: f.className
		}));
		//console.info("Fruit pushed!");
	}
}

function handleFruitsUpdate() {
	fruits.forEach(function(F) { //水果位置更新
		//F.isInited ? F.update() : F.init();
		F.update();
	});
}
function handleFruitsDraw() {
	fruits.forEach(function(F) { //水果位置绘制
		F.draw();
	});
}
function handleDiskDraw() {
	disk.draw();
}


function handleCollisions() {
	fruits.forEach(function(F) {
		if (collides(F, disk)) {
			F.catched();
		}
	});
}
function collides(a, b) {
	  return a.x < b.x + b.width &&
	         a.x + a.width > b.x &&
	         a.y < b.y + b.height &&
	         a.y + a.height > b.y;
}


/* 时间 */
function timer() {
	timeDom.text(time);
	iTime = setInterval(function() {
		if (pause) {
			return;
		}
		time -= 0.1;
		if(time <= 0){
			timeDom.text("0.0");
			//等待最后一波水果掉落完毕
			setTimeout(function() {
				//设置分数
				//finalScoreDom.text(score);
				page(3);
				
			},300);
			setTimeout(function() {
				//处理微信方法
				
			}, 1400);
			clearInterval(iTime);
			return;
		}
		timeDom.text(time.toFixed(1));
	}, 100);
}




//水果构造器
function fruit(F) {
	//F.x = 60;
	F.y = 60;
	F.width = 10;
	F.height = 30;
	//F.score = 3;
	F.v = -3.6;           //初速度
	F.a = 1;            //加速度
	F.frame = 34;       //起始帧
	F.id = "fruit_"+fruitCount;
	fruitCount++;
	//F.className = "f_3"; 
	
	F.update = function() {
		this.frame++;
		var t = this.frame/FPS;
		F.y += (F.v + F.a*t)*t;
		
		//var obj = $("#"+this.id);
		//obj.css("top",this.y);
		
		if(this.y >= GAMEHEIGHT){
			F.out();
		}
	};
	
	F.draw = function(){
		switch (this.score) {
		case 3:
			canvas.drawImage(img_3,this.x - 15,this.y, img_3.width, img_3.height);
			break;
		case 1:
			canvas.drawImage(img_1,this.x - 15,this.y, img_1.width, img_1.height);
			break;
		case -10:
			canvas.drawImage(img_m1,this.x - 15,this.y, img_m1.width, img_m1.height);
			break;
		default:
			break;
		}
		
	};
	F.destory = function() {
		fruits.forEach(function(o,i) {
			if(o.id === F.id){
				fruits.splice(i,1);
			}
		});
	}
	F.catched = function() { //被接住
		//console.log("Catched! " +this.score);
		//销毁div
		score += this.score; //分数计算
		scoreDom.text(score);
		
		scoreBubble(this.x,this.y,this.score); // 分数气泡
		 
		this.destory();
	};
	F.out = function() { //跌出屏幕
		//销毁div
		this.destory();
	};
	
	
	return F;
}



//分数构造器
function scoreChar(S) {
	//S.score = 1;
	//S.color = "#FF3300";

	
	S.id = "score_" + fruitCount;
	S.opacity = 1;
	S.update = function(){
		this.opacity -= 0.016;
		S.y -= 1;
		if( this.opacity <= 0 ){ this.destory(); return; }
	};
	S.draw = function(){
		canvas.font = "30px 'Comic Sans MS'";
		canvas.fillStyle = S.color;
		canvas.globalAlpha=this.opacity;
		canvas.fillText(S.score, S.x, S.y);
		canvas.globalAlpha=1;
	};
	S.destory = function() {
		scores.forEach(function(o,i) {
			if(o.id === S.id){
				scores.splice(i,1);
			}
		});
	};
	return S;
}

/* 分数气泡 */
function scoreBubble(x,y,score) {
	//var scoreText =  score>0 ? "+"+score : ""+score;
	//canvas绘制分数
	color = (score<0) ? "#000000" : "#FF3300";
	score = (score>0) ? ("+"+score) : score;
	
	
	scores.push(scoreChar({
		x: x,
		y: y,
		score : score,
		color: color
	}));
}


//disk随鼠标移动
$(function() {
	$(".swiper-container").bind("mousemove touchstart touchmove", function(e) {
		if( e.type === "mousemove"){
			var x = e.clientX / r;
			var y = e.clientY / r;
		}else{
			var touch = event.targetTouches[0];  
			var x = touch.pageX / r;
			var y = touch.pageY / r;
		}
		diskMove(x,y);
	});
});
	

function diskMove(x,y) {
	var x = x - disk.width/2;
	var y = y - disk.height/2;
	disk.update(x,y); //更新对象属性
}
	