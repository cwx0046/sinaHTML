var gamebox = document.getElementById("gamebox");


var badminton = function(B) {
	var def = {
		name: "Badminton",
		x: 320/2,   //x 位置
		y: 100,     //y 位置
		rotate: 0,  //旋转角度
		v: 0,       //速度
		a: 9.8,     //加速度
		xSpeed: 0,  //横向移动速度
		distance: 0,//击飞距离
		dom: null,  //DOM 
		isFlying: false, //是否在飞行
	};
	
	//B = $.extend({}, def, B) || def;
	B = def;
	
	B.init = function initB() {
		var item = document.createElement('div');
		item.id = item.className = this.name;
		item.style.position = "absolute";
		item.style.left = this.x + "px";
		item.style.top = this.y + "px";
		gamebox.appendChild(item);
		this.dom = item;
		console.info("[badminton]羽毛球已初始化");	
	};
	
	B.update = function updateB() {
		//更新B
		this.v = this.v + this.a;
		this.v = this.v > 800 ? 800 : this.v;
		this.y = this.y + this.v * 0.016 + 0.5 * this.a * Math.pow(0.016,2);

		
		//触底
		if ( this.y + this.dom.offsetHeight > gamebox.offsetHeight ) {
			this.y = gamebox.offsetHeight - this.dom.offsetHeight;
			//this.destory();
			this.isFlying = false;
			
		} else {
			
			
		}
		
		
		//飞行过程中旋转
		if (this.isFlying) {
			this.rotate = (this.v + 800) * (9/80);
			bgControl(-this.xSpeed);
			shooterControl(-this.xSpeed);
			
			//路程统计
			this.distance += this.xSpeed;
			
		}else{
			if (this.v <= 0) {
				this.rotate = 0;
			} else {
				this.rotate = 180;
			}
		}
	};
	
	B.draw = function drawB() {
		//垂直高度
		this.dom.style.top = this.y+"px";
		//旋转角度
		//this.dom.style.webkitTransform =  "rotateZ(" + this.rotate + "deg)";
		//插件实现旋转
		$(this.dom).rotate({angle:this.rotate});

		
		//击飞距离
		document.getElementById("distance").innerHTML = (this.distance / 210).toFixed(2);
		
		
	};
	
	B.destory = function destoryB() {
		
		this.dom.parentNode.removeChild(dom);
		console.info("[badminton]羽毛球已被移除");
	};
	
	return B;
}

/**
 * 重置羽毛球位置
 */
function resetB() {
	B.v = 0;
	B.y = 100;
}



function bgControl(offset) {
	var bgDom = document.getElementById("gameBG");
	//var bgLeft = parseInt(bgDom.style.left) || 0;
	//bgDom.style.left = bgLeft + offset + "px";
	
	var bgLeft = parseInt(bgDom.style.backgroundPosition.split(" ")[0]) || 0;
	bgDom.style.backgroundPosition = bgLeft + offset + "px 0px"; 
}
function shooterControl(offset) {
	var shooterDom = document.getElementById("shooter");
	var shooterLeft = parseInt(shooterDom.offsetLeft) || 0;
	shooterDom.style.left = shooterLeft + offset + "px";
	
}






/**
 * TEST
 */
var B = new badminton();
B.init();

setInterval(function() {
	B.update();
	B.draw();
}, 16);

document.body.addEventListener("mousedown", function() {
	var shooterDom = document.getElementById("shooter");
	
	//在击中范围内
	if ( B.y + B.dom.offsetHeight > shooterDom.offsetTop && shooterDom.offsetTop + shooterDom.offsetHeight > B.y) {
		
		var shooterRange = shooterDom.offsetHeight + B.dom.offsetHeight;
		
		B.v = -900 + (B.dom.offsetTop - (shooterDom.offsetTop - B.dom.offsetHeight)) * (800 /(shooterDom.offsetHeight + B.dom.offsetHeight)); 
		
		B.xSpeed = -B.v/50;
		
		B.isFlying = true;
		
		//缩小击球区域增加难度
		//shooterDom.style.height = shooterDom.offsetHeight * 0.65 + "px";	
		
		
		
		
	}
	//人物动作
	var actmanDom = document.getElementById("shooterImg");
	actmanDom.style.backgroundPosition = "0 -220px";
	setTimeout(function() {
		actmanDom.style.backgroundPosition = "0 -446px";
	},120);
	setTimeout(function() {
		actmanDom.style.backgroundPosition = "0 0";
	},900);
	
	
});













