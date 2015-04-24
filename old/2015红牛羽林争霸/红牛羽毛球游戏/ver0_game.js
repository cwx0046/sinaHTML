var gamebox = document.getElementById("gamebox");


var badminton = function(B) {
	var def = {
		name: "Badminton",
		x: 320/2,   //x 位置
		y: 100,     //y 位置
		rotate: 0,  //旋转角度
		v: 0,       //速度
		a: 9.8,     //加速度
		dom: null,  //DOM 
		isFlying: false, //是否在飞行
	};
	
	B = $.extend({}, def, B) || def;
	
	B.init = function initB() {
		var item = document.createElement('div');
		item.id = item.className = this.name;
		item.style.position = "absolute";
		item.style.left = this.x + "px";
		item.style.top = this.y + "px";
		gamebox.appendChild(item);
		this.dom = item;
		console.info("[badminton]羽毛球已初始化");	
	}
	
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
			bgControl(-10);
		}else{
			if (this.v <= 0) {
				this.rotate = 0;
			} else {
				this.rotate = 180;
			}
		}
		
		
		
			
		
		
	}
	
	B.draw = function drawB() {
		this.dom.style.top = this.y+"px";
		this.dom.style.webkitTransform =  "rotateZ(" + this.rotate + "deg)";
		
	}
	
	B.destory = function destoryB() {
		
		this.dom.parentNode.removeChild(dom);
		console.info("[badminton]羽毛球已被移除");
	} 
		
	return B;
}


function bgControl(offset) {
	var bgDom = document.getElementById("gameBG");
	var bgLeft = parseInt(bgDom.style.left) || 0;
	
	bgDom.style.left = bgLeft + offset + "px";
	
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
		
		B.isFlying = true;
		shooterDom.style.height = shooterDom.offsetHeight * 0.65 + "px";	 
	}
	
	
});













