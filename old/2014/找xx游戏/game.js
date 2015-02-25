/* This js won't update since 20140819 18:00, All new code will be placed in html file.
 * URL: http://jiangsu.sina.com.cn/zt/s/gameFindLele_H5.html
 * */

/* 游戏元素 */

var imgsrc = ["2.png", "3.png", "4.jpg", "5.jpg", "6.jpg", "7.jpg",
		"8.jpg", "9.png", "10.jpg", "11.jpg", "12.jpg", "13.gif", "14.png",
		"15.jpg", "16.png", "17.png", "18.png", "19.png", "20.png", "21.jpg",
		"22.jpg", "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg", "28.jpg",
		"29.jpg", "30.jpg", "31.jpg", "32.jpg", "33.jpg", "34.jpg", "35.jpg",
		"36.jpg", "37.jpg", "38.jpg", "39.jpg", "40.jpg" ];		

var obj1 = { isdog : true,  imgsrc : "http://jiangsu.sinaimg.cn/zt/s/gamezhaolele/images/1.png"};

var objList = [];
var bigLevelList = []; 
var icoList = [];
var difficult = 4; //每4关增加难度
var level = 1;
var score = 0;
/* 
 *  点击ico
 *	@param 
 *		index 索引
 *	@return 
 *		true  是
 *		false 不是
 */
function icoClick(index){
	return icoList[index].isdog;
} 

/*
 *  第一个元素和随机元素交换位置
 *  @param
 *  	objs[]
 *  @return
 *  	objs[] 打乱后的数组
 */
function random(objs) {
	
	//此方法抛弃，两两交换效果不好。
	/*return objs.sort( function(){ return 0.5 - Math.random()} );*/

	var randomIndex = parseInt(Math.random()*objs.length);
	var temp = objs[0];
	objs[0] = objs[randomIndex];
	objs[randomIndex] = temp;
	return objs;
}

/*
 * 	 关卡初始化
 * 	@param
 * 		difficult 难度--展示几种图标 至少2种
 * 		gamesize 游戏区域ico数量
 *  @return
 *  	icoList 游戏区域ico对象数组
 */
/*function loadRound( difficult, gamesize) {
	//可点击图标
	icoList[0] = objList[0];
	//剩下干扰图标
	if (difficult > objList.length) {	difficult = objList.length;	}
	for (var i = 1; i < gamesize; i++) {
		 对象加载方式，随机 不考虑均匀分布 
		 除了正确的那个，额外加载几种不同的ico 
		icoList[i] = objList[Math.ceil( Math.random()*( difficult - 1 ) )];
	}
	
	return icoList;
}*/

//游戏关卡
function gameRound(level) {
	//difficult = level / difficult + 1;
	//putIntoHTML(random(loadRound(difficult,56)));
	putIntoHTML(random(getSmallLevel(level,56)));
	setCurrentLevel(level);
}

function getBigLevel(level){
	bigLevelList = [];
	//从总图标选取大关所需图标
	imgsrc.sort(function(){ return 0.5 - Math.random(); }); //打乱大数组
	var bigLevel = Math.floor((( level - 1 ) / difficult ) + 1 ); //得到大关
	if (bigLevel>4) {bigLevel = 4;} //限定最高大关4
	for (var i = 0; i < bigLevel*difficult; i++) {
		bigLevelList.push({isdog : false, imgsrc : "http://jiangsu.sinaimg.cn/zt/s/gamezhaolele/images/" + imgsrc[i]});
	}
	return bigLevelList;
}

function getSmallLevel(level, gamesize){
	if (level == 1 | level%difficult==1) {
		getBigLevel(level);
	}
	
	icoList = [];
	//从大关截取小关数据
	var bigLevel = Math.floor((( level - 1 ) / difficult ) + 1 ); //得到大关
	if (bigLevel>4) {bigLevel = 4;} //限定最高大关4
	var smallLevel = level % difficult;
	smallLevel = (smallLevel == 0) ? difficult : smallLevel; //保证小关为1,2,3...difficult
	//console.log("关卡:"+ level +" "+bigLevel +"大关"+smallLevel+"小关");
	//关卡内容设置
	icoList[0] = obj1; //乐乐
	for (var i = 1; i < gamesize; i++) {
		var fanweimin = bigLevel*(smallLevel-1)
		var fanweimax = bigLevel*smallLevel-1;
		icoList.push(bigLevelList[ Math.round(fanweimin +  Math.random()*(fanweimax - fanweimin))]);
	}
	console.log(bigLevelList+" "+fanweimax+" "+fanweimin);
	//console.log(icoList);
	//别忘了返回值要random
	return icoList;
}

function putIntoHTML(icoList){
	var html = '';
	for ( var i in icoList) {
		html +=	'<img src="' + icoList[i].imgsrc +'" />';
	}
	//$("#gameIcoBlock").html(html);
	document.getElementById("gameIcoBlock").innerHTML = html;
	
}

/* 显示关卡 */
function setCurrentLevel(level){
	document.getElementById("currentLevel").innerHTML = level - 1;
	document.getElementById("level").innerHTML = level - 1;
}

var t;
var pause = false; //暂停 boolean
/* 计时器 */
function timer() {
	var time = 60;
	document.getElementById("timer").innerHTML = time;
	
	t = setInterval(function() {
		if (pause) {
			return;
		}
		time -= 0.1;
		if(time <= 0){
			//切换到第三页
			page(3);
			//alert("厉害～您闯过了"+level+"关！");
			document.getElementById("timer").innerHTML = "0.0";
			document.title = '我找到了'+ level-1 +'只二胡卵子，不服来战！“砳”在其中，玩得根本停不下来~';
			dataForWeixin.desc = '我找到了'+ level-1 +'只二胡卵子，不服来战！“砳”在其中，玩得根本停不下来~';
			clearInterval(t);
			return;
		}
		document.getElementById("timer").innerHTML = time.toFixed(1);
	}, 100);
	
	/*function checkTime(time){
		if (time <= 0) {
			clearInterval(t);
			alert("厉害～您闯过了"+level+"关！");
			return true;
		}
	}*/
}

 

//暂停游戏
function gamepause() {
	pause = !pause;
	
	//图片隐藏
	$("#gameIcoBlock").toggleClass("none");
}



//点击 开始游戏～
function gamestart(){
	gameRound(1);
	timer();//开始计时！
	
	$("#gameIcoBlock img").live("click", function() {
		if (icoClick($(this).index())) {
			level++;
			gameRound(level);
		}
	});
}

function resetGame(){
	objList = [];
	bigLevelList = []; 
	icoList = [];
	level = 1;
	score = 0;
	clearInterval(t);
	page(1);
}

var dataForWeixin = {
	    appId: "",
	    TLImg: "http://jiangsu.sinaimg.cn/zt/s/gamezhaolele/e/e1.png",
	    url: "http://jiangsu.sina.com.cn/zt/s/gameFindLele_H5.html",
	    title: "找砳砳",
	    desc:"“砳”在其中，玩得根本停不下来~",

	 };

	 var onBridgeReady = function(){
	  WeixinJSBridge.on('menu:share:appmessage', function(argv){
	   WeixinJSBridge.invoke('sendAppMessage', {
	    "appid": dataForWeixin.appId,
	    "img_url": dataForWeixin.TLImg,
	    "img_width": "120",
	    "img_height": "120",
	    "link": dataForWeixin.url,
	    "title": dataForWeixin.title,
	    "desc": dataForWeixin.desc 
	   });
	  setTimeout(function () {location.href = "http://mp.weixin.qq.com/s?__biz=MjM5MDI4MTUwMA==&mid=200904964&idx=1&sn=e72a2a751162333b0cc16447d4d20ce4#rd";}, 1500); 
	  });

	 };

	 if(document.addEventListener){
	  document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	 }else if(document.attachEvent){
	  document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
	  document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	 } 