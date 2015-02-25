var gameCanvas = $("#gameCanvas"); /*document.getElementById("#gameCanvas");*/
var pause = false;
var GAMEBOUNDS = { WIDTH : gameCanvas.width(), HEIGHT : gameCanvas.height() };
var sourceNum = 50; //阳光资源
var lawn = [];
var zombies = [];
var sunflowers = [];
var peashooters = [];
var peas = [];
var suns = [];
var zombieCount = 1000;
var sunflowerCount = 2000;
var peashooterCount = 3000;
var peaCount = 4000;
var sunCount = 5000;

var FPS = 30;
setInterval(function() {
  update();
  draw();
}, 1000/FPS);

/* 帧更新 */
function update() {
	if(pause){return;} //如果暂停，停止更新帧
	//碰撞检测
	handlePeasZombiesCollides();
	handlePlantsZombiesCollides();
	
	handleZombiesUpdate();
	handleSunsUpdate();
	handleSunflowerUpdate();
	handlePeashooterUpdate();
	handlePeasUpdate();
	
	handleGameOver();
}

function draw() {
	if(pause){return;}
	handleZombiesDraw();
	handleSunsDraw();
	handleSunflowerDraw();
	handlePeashooterDraw();
	handlePeasDraw();
}


function handleZombiesUpdate() {
	zombies.forEach(function(zombie) {
		zombie.isInited ? zombie.update() : zombie.init();
	});
}
function handleZombiesDraw() {
	if (zombies.length <= 0 ) { return; }
	zombies.forEach(function(zombie) {
		zombie.draw();
	});
}

function handleSunsUpdate() {
	suns.forEach(function(sun) {
		sun.isInited ? sun.update() : sun.init();
	});
}
function handleSunsDraw() {
	if (suns.length <= 0 ) { return; }
	suns.forEach(function(sun) {
		sun.draw();
	});
}


function handleSunflowerUpdate() {
	sunflowers.forEach(function(sunflower) {
		sunflower.isInited ? sunflower.update() : sunflower.init();
	});
}
function handleSunflowerDraw() {
	if (sunflowers.length <= 0 ) { return; }
	sunflowers.forEach(function(sunflower) {
		sunflower.draw();
	});
}


function handlePeashooterUpdate() {
	peashooters.forEach(function(peashooter) {
		peashooter.isInited ? peashooter.update() : peashooter.init();
	});
}
function handlePeashooterDraw() {
	if (peashooters.length <= 0 ) { return; }
	peashooters.forEach(function(peashooter) {
		peashooter.draw();
	});
}

function handlePeasUpdate() {
	peas.forEach(function(pea) {
		pea.isInited ? pea.update() : pea.init();
	});
}
function handlePeasDraw() {
	if (peas.length <= 0 ) { return; }
	peas.forEach(function(pea) {
		pea.draw();
	});
}

function handlePeasZombiesCollides() {
	peas.forEach(function(P) {
		zombies.forEach(function(Z) {
			var c = collides(P, Z);
			if (c) {  // 发生碰撞
				Z.health -= P.harm;
				P.destory();
			}
		});
	});
}
function handlePlantsZombiesCollides() {
	
		
	zombies.forEach(function(Z) {
		//僵尸 和 植物 碰撞，当植物不存在时，僵尸行走
		Z.isStopped = false;
		sunflowers.forEach(function(P) {
			plantCollides(P);
		});
		peashooters.forEach(function(P) {
			plantCollides(P);
		});
		function plantCollides(P){
			var c = collides(P, Z);
			if (c) {  // 发生碰撞
				Z.isStopped = true;
				P.health -= Z.harm/(1000/FPS);
				if (P.health <= 0) {
					Z.isStopped = false;
				}
			}
		} 
	});
}
function handleGameOver() {
	zombies.forEach(function(Z) {
		if (Z.position.x < 0) {
			stopGame();
			console.log("游戏结束");
		} 
	});
}


function collides(a, b) {
	/*return a.x < b.x + b.width &&
	       a.x + a.width > b.x &&
	       a.y < b.y + b.height &&
	       a.y + a.height > b.y;*/
   return a.position.x < b.position.x + b.width &&
	      a.position.x + a.width > b.position.x &&
	      a.position.y < b.position.y + b.height &&
	      a.position.y + a.height > b.position.y;
}

function zombie(Z) {
	Z = Z || {};
	//Z.type = 0; // 1 2
	Z.id = "zombie_" + zombieCount; zombieCount++;
	Z.health = 7;
	Z.speed = 0.6;
	Z.harm = 1;
	//Z.position = { x : 800, y : 500 };
	Z.width = 24;
	Z.height = 100;
	Z.isInited = false;
	Z.isStopped = false;
	Z.init = function() { 
		// 放入HTML
		$("<div>",{
			"class": "zombies " + "type" + this.type,
	        "id": this.id,
	        css:{
	            "left": this.position.x,
	            "top": this.position.y,
	            "z-index": this.position.y
	        },
	        html: '<img class="u_ico" src="'+friend_ico_url[ parseInt(Math.random()*friend_ico_url.length) ] +'"/>'
	    }).appendTo(gameCanvas);
		this.isInited = true;
		console.info("[程序]生成僵尸");
	};
	Z.inBounds = function() {
		/*return I.x >= 0 && I.x <= GAMEBOUNDS.WIDTH &&
		I.y >= 0 && I.y <= GAMEBOUNDS.HEIGHT;*/
	};
	
	Z.draw = function() {
		if (this.health <= 0 | this.position.x < -60 ) {
			this.destory();
			return;
		}
		$("#"+this.id).css("left",this.position.x);//绘制
	};
	Z.update = function() {
		if (this.isStopped) {    //当僵尸处于停止状态时不移动 
			$("#"+this.id).addClass("Zstop");
			return;
		} else {
			$("#"+this.id).removeClass("Zstop");
		}
		this.position.x -= this.speed; //移动
	};
	Z.destory = function() {
		$("#"+this.id).remove(); //删除此元素
		var id = this.id;
		zombies.forEach(function(o,i) {
			if(o.id === id){
				zombies.splice(i,1);
			}
		});
	};
	return Z;
}


function sunflower(S) {
	S = S || {};
	S.id = "sunflower_" + sunflowerCount; sunflowerCount++;
	S.health = 6;
	S.cooldown = 20;
	//S.position = { x : 800, y : 500 };
	//S.lawnIndex = 1;
	S.width = 70;
	S.height = 100;
	S.isInited = false;
	S.isStopped = false;
	S.createSunInerval;
	S.init = function() { //绘制
		if(plantHandle("plant",this.lawnIndex)){
			// 放入HTML
			// 放入HTML
			$("<div>",{
				"class": "sunflower",
		        "id": this.id,
		        css:{
		            "left": this.position.x,
		            "top": this.position.y,
		            "z-index": this.position.y
		        }
		    }).appendTo(gameCanvas);
			this.isInited = true;
			console.log("[用户]种植太阳花"+ this.id);
			this.createSunInerval = setInterval(function() {
				suns.push(
						sun({
							type: "static", //
							position : { x : S.position.x -10 +Math.random()*50, y : S.position.y + 70+Math.random()*16 },
							timeout : 15
						})
					);
			}, this.cooldown * 1000);
		}else{
			this.destory();
		}
	};
	S.draw = function() {
		if (this.health <= 0 ) {
			this.destory();
			return;
		}
	};
	S.update = function() {
		
	};
	S.destory = function() {
		$("#"+this.id).remove(); //删除此元素
		var id = this.id;
		sunflowers.forEach(function(o,i) {
			if(o.id === id){
				sunflowers.splice(i,1);
			}
		});
		clearInterval(this.createSunInerval);
		console.info("[程序]！太阳花死亡");
		plantHandle("destory",this.lawnIndex);
	};
	return S;
}


function peashooter(P) {
	P = P || {};
	P.id = "peashooter_" + peashooterCount; peashooterCount++;
	P.health = 6;
	P.cooldown = 2.8; //2.4
	//P.position = { x : 800, y : 500 };
	//P.lawnIndex = 1;
	P.width = 70;
	P.height = 100;
	P.isInited = false;
	P.isStopped = false;
	P.init = function() { //绘制
		if(plantHandle("plant",this.lawnIndex)){
			// 放入HTML
			$("<div>",{
				"class": "peashooter",
		        "id": this.id,
		        css:{
		            "left": this.position.x,
		            "top": this.position.y,
		            "z-index": this.position.y
		        }
		    }).appendTo(gameCanvas);
			this.isInited = true;
			console.log("[用户]种植豌豆射手"+ this.id);
		}else{
			this.destory();
		}
	};
	P.draw = function() {
		if (this.health <= 0 ) {
			this.destory();
			return;
		}
	};
	P.shootInterval;
	P.timer = 0;
	P.update = function() {
		//放置豌豆射手功能
		//检测该线路是否有僵尸
		//检测该线路前方是否有僵尸
		var createPea = false;
		var thisx = this.position.x;
		var thisy = this.position.y;
		zombies.forEach(function(Z) {
			if (Z.position.y === thisy &&
				Z.position.x >= thisx) {
				createPea = true;
			}
		});
		//创建豌豆
		//有僵尸 没在冷却
		if ( createPea  && this.timer === 0) {
			console.info("[程序]发现僵尸");
			peas.push(
					pea({
						position : { x : thisx, y : thisy }
					})
			);
			setTimeout(function() {
				console.warn("豌豆射手已填装");
				P.timer = 0;
			}, this.cooldown*1000); 
			this.timer++;
		} else if (createPea) {
			this.timer++;
		}
		
		
	};
	P.destory = function() {
		$("#"+this.id).remove(); //删除此元素
		var id = this.id;
		peashooters.forEach(function(o,i) {
			if(o.id === id){
				peashooters.splice(i,1);
			}
		});
		clearInterval(this.shootInterval);
		console.info("[程序]！豌豆射手死亡");
		plantHandle("destory",this.lawnIndex);
	};
	return P;
}

function pea(P) {
	P = P || {};
	P.id = "pea_" + sunCount; sunCount++;
	P.speed = 7;
	//P.position = { x : 800, y : 500 };
	P.width = 80;
	P.height = 40;
	P.harm = 1;
	P.isInited = false;
	P.init = function() { //绘制
		// 放入HTML
		$("<div>",{
			"class": "pea",
	        "id": this.id,
	        css:{
	            "left": this.position.x,
	            "top": this.position.y,
	            "z-index": 1000
	        }
	    }).appendTo(gameCanvas);
		this.isInited = true;
		console.info("[程序]豌豆射手射出豌豆"+this.id);
	};
	P.draw = function() {
		if (this.position.x >= GAMEBOUNDS.WIDTH ) {
			this.destory();
			return;
		}
		$("#"+this.id).css("left",this.position.x);//绘制
	};
	P.update = function() {
		this.position.x += this.speed; // 弹道
	};
	P.destory = function() {
		$("#"+this.id).remove(); //删除此元素
		var id = this.id;
		peas.forEach(function(o,i) {
			if(o.id === id){
				peas.splice(i,1);
			}
		});
	};
	return P;
	
}

function sun(S) {
	S = S || {};
	S.id = "sun_" + sunCount; sunCount++;
	//S.type = "static"; // drop  自然掉落
	S.speed = 1.2;
	//S.distance = 300;
	//S.timeout = 6;
	S.sourceNum = 25;
	//S.position = { x : 800, y : 500 };
	S.isInited = false;
	S.isStopped = false;
	S.init = function() { //绘制
		// 放入HTML
		$("<div>",{
			"class": "sun",
	        "id": this.id,
	        css:{
	            "left": this.position.x,
	            "top": this.position.y
	        },
	        click: function(event) {
	        	event.preventDefault();
	        	sourceNum += S.sourceNum;
                S.destory();
                sourceBox("show");
                console.log("[用户]得了阳光资源"+ this.id);
            }
	    }).appendTo(gameCanvas);
		this.isInited = true;
		console.info("[程序]生成阳光资源"+ this.id);
	};
	S.timer = 0;
	S.draw = function() {
		if( this.timer >= (this.timeout * 1000) ) {
			this.destory();
			console.info("[程序]阳光消逝了"+ this.id);
			return;
		}
		$("#"+this.id).css("top",this.position.y);//绘制
	};
	S.update = function() {
		this.timer += 1000/FPS;
		//放置太阳功能
		if (this.type == "static") {
			// do nothing
		} else if ( this.type == "drop") {
			if (this.position.y >= this.distance) {
				return;
			}
			this.position.y += this.speed;	
		}
	};
	S.destory = function() {
		$("#"+this.id).remove(); //删除此元素
		var id = this.id;
		suns.forEach(function(o,i) {
			if(o.id === id){
				suns.splice(i,1);
			}
		});
	};
	return S;
}




///////////////  UI  //////////////////
function plantHandle(type, i) {
	if (type === "plant") {
		if (lawn[i] === undefined){
			lawn[i] = "1";
			$(".lawn").eq(i).addClass("planted");
		}else{ console.warn("[系统]已被种上植物"); return false; }
	}else{
		if (lawn[i] === "1"){
			lawn[i] = undefined;
			$(".lawn").eq(i).removeClass("planted");
		}else{ console.warn("[系统]没有植物供铲除"); return false;}
	}
	
	return true;
}

/**
 * 种子
 */
var seeds = [{ name : "sunflower", cost : 50 },
             { name : "peashooter", cost : 100 },
            ];
var sunflower_Event = function(param){
	
	var i = $(this).index();
	if (lawn[i] === undefined && sourceNum>= 50) { // 可以种植植物
		handelSunflowerAdd($(this).position().left + $(".plantBox").position().left, $(this).position().top + $(".plantBox").position().top, i);
		sourceBox("set", -50);
		$('.seed').removeClass("select");
		$(".lawn").unbind().css("cursor","default").removeClass("active");
	}
}
var peashooter_Event = function(){
	var i = $(this).index();
	if (lawn[i] === undefined && sourceNum>= 100) { // 可以种植植物
		handelPeashooterAdd($(this).position().left + $(".plantBox").position().left, $(this).position().top + $(".plantBox").position().top, i);
		sourceBox("set", -100);
		$('.seed').removeClass("select");
		$(".lawn").unbind().css("cursor","default").removeClass("active");
	}
}


function plantplant_Event(jdom, name) {
	var i = jdom.index();
	seeds.forEach(function(S) {
		if (S.name === name) {
			if (lawn[i] === undefined && sourceNum>= S.cost) { // 可以种植植物
				switch (name) {
				case "sunflower":
					handelSunflowerAdd(jdom.position().left + $(".plantBox").position().left, jdom.position().top + $(".plantBox").position().top, i);
					break;
				case "peashooter":
					handelPeashooterAdd(jdom.position().left + $(".plantBox").position().left, jdom.position().top + $(".plantBox").position().top, i);
					break;
				default:
					break;
				}
				sourceBox("set", -S.cost);
				$('.seed').removeClass("select");
				$(".lawn").unbind().css("cursor","default").removeClass("active");
			}
		}
	});
}

function checkAndPlant(dom, name, cost) {
	if(dom.hasClass("select")){ // (2) 用户想取消当前选中seed
		$('.seed').removeClass("select");
		$(".lawn").unbind().css("cursor","default").removeClass("active");
		return;
	} else {
		$('.seed').removeClass("select");
		$(".lawn").unbind().css("cursor","default");
		if( parseInt(cost) > sourceBox("get")){  // 资源不足
			return;
		}else{  //资源足够
			dom.addClass("select");
			$(".lawn").addClass("active");
			console.log("[用户]使用种子"+ name);
			$(".lawn").bind("click",function(e){ plantplant_Event($(this), name); }).css("cursor","pointer");
		}
	}
}



/* get/set阳光资源 */
function sourceBox(type) {
	if (type === "show") {
		$(".sourceBox").text(sourceNum);	
	}else if(type === "set"){
		var num = arguments[1];
		sourceNum += num;
		sourceBox("show");
	}
	
	//检测资源数量，对seed面板染色
	seeds.forEach(function(S) {
		if ( sourceNum < S.cost ) { //如果资源不足， 给seed加上灰色
			$("." + S.name + "Seed").addClass("gray");
		}else{
			$("." + S.name + "Seed").removeClass("gray");
		}
	});
	
	return sourceNum;
}

function resetGame() {
	zombies.forEach(function(Z) {
		Z.destory();
	});
	$(".zombies").remove();
	sunflowers.forEach(function(Z) {
		Z.destory();
	});
	$(".sunflower").remove();
	peashooters.forEach(function(Z) {
		Z.destory();
	});
	$(".peashooter").remove();
	peas.forEach(function(Z) {
		Z.destory();
	});
	$(".pea").remove();
	suns.forEach(function(Z) {
		Z.destory();
	});
	$(".sun").remove();
	
	clearInterval(i_auto_zobmies);
	clearInterval(i_auto_suns);
	
	pause = false;
	GAMEBOUNDS = { WIDTH : gameCanvas.width(), HEIGHT : gameCanvas.height() };
	sourceNum = 50; //阳光资源
	sourceBox("show");
	lawn = [];
	zombies = [];
	sunflowers = [];
	peashooters = [];
	peas = [];
	suns = [];
	zombieCount = 1000;
	sunflowerCount = 2000;
	peashooterCount = 3000;
	peaCount = 4000;
	sunCount = 5000;
	console.log("GAME RESETTED!");
}

function stopGame() {
	pause = true;
}

function initGame(){
	resetGame();
	sourceBox("show");
	setTimeout(function() {
		handelSunAdd();
	}, 2000);
	setTimeout(function() {
		handelZombiesAdd_AUTO();
	}, 8000);
	
	handelSunAdd_AUTO();
	console.log("GAME START!");
} 

// init game
sourceBox("show");
