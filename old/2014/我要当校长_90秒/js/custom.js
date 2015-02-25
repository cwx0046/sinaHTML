var maxValueTile = 0;
var maxJobs = "学生";

// game end
function gameend() {
	showTopQuan();
	setQuanText();
	showEndWindow();
	
	stopTimer();
}

function showEndWindow() {
	var text = "你在《我要当校长》中成功当选了 "+getTileContainer(maxValueTile)+" ,快分享给小伙伴们吧～";
	$(".game-message").children("p").html(text);
	
	dataForWeixin.desc = '哇！我居然是 '+getTileContainer(maxValueTile)+' ！想要叱咤校园吗？快来看看你是什么级别！';
	dataForWeixin.TLTitle = '哇！我居然是 '+getTileContainer(maxValueTile)+' ！想要叱咤校园吗？快来看看你是什么级别！';
	
	$(".game-message").fadeIn(100);
}
function hideEndWindow() {
	$(".game-message").fadeOut(100);
}
function showTopQuan(){
	$(".fenxiang").fadeIn();
}
function hideTopQuan(){
	$(".fenxiang").fadeOut();
}
function setQuanText() {
	dataForWeixin.title = "我要当校长";
	dataForWeixin.TLTitle = "我要当校长";
	dataForWeixin.desc = "我在《我要当校长》中成功当选了<strong>"+maxJobs+"</strong>,不服来战～";
}
function resetQuanText() {
	dataForWeixin.title = "我要当校长";
	dataForWeixin.TLTitle = "我要当校长";
	dataForWeixin.desc = "在《我要当校长》中能当上实习生、教授还是校长?快来挑战吧！";
}


// game reset
function resetGame() {
	resetmaxValueTile();
	resetQuanText();
	stopTimer();
	hideEndWindow();
	hideTopQuan();
	timer();
}
function resetmaxValueTile() {
	maxValueTile = 0;
}

/* 计时器 */
var t;
var pause = false; //暂停 boolean
var time = 2.0;
timer();
function timer() {
	document.getElementById("timer").innerHTML = time;
	t = setInterval(function() {
		if (pause) {
			return;
		}
		if (getTime()<=0.1) {
			stopTimer();
			document.getElementById("timer").innerHTML = 0;
			gameend();
			return;
		}
		time -= 0.1;
		document.getElementById("timer").innerHTML = time.toFixed(0);
	}, 100);
}
function stopTimer() {
	clearInterval(t);
	time = 90;
}
function setTime(newtime){
	time = parseFloat(newtime);
}

function getTime(){
	return time.toFixed(1);
}

function getTileContainer(num) {
	
	var name = ["学生","实习生","助教","讲师"," 副教授","教授","所长","院长","校长助理","副校长","校长"];
	
	switch (num) {
	case 2:
		//return name[0];
		//return '<img src="http://jiangsu.sinaimg.cn/zt/s/gamezhaolele/images/1.png">';
		return name[0];
		break;
	case 4:
		return name[1];
		break;
	case 8:
		return name[2];
		break;
	case 16:
		return name[3];
		break;
	case 32:
		return name[4];
		break;
	case 64:
		return name[5];
		break;
	case 128:
		return name[6];
		break;
	case 256:
		return name[7];
		break;
	case 512:
		return name[8];
		break;
	case 1024:
		return name[9];
		break;
	case 2048:
		return name[10];
		break;
	default:
		return num;
		break;
	}
}


//发送给朋友   包含 1.标题 2.图片 3.描述文字
//分享到朋友圈 包含 1.文字 2.图片

//微信分享js
var dataForWeixin = {
		appId : "",
		title : "我要当校长",
		TLImg : "http://jiangsu.sinaimg.cn/2014/0806/U11392P1194DT20140806174931.jpg",
		desc : "分享内容",
		url : "http://www.sina.com.cn", //请填写分享出去的URL
		TLTitle: "朋友圈标题" //朋友圈文字

	};

	var onBridgeReady = function() {
		
		//发送给朋友、群组
		WeixinJSBridge.on('menu:share:appmessage', function(argv) {
			WeixinJSBridge.invoke('sendAppMessage', {
				"appid" : dataForWeixin.appId,
				"img_url" : dataForWeixin.TLImg, //图片
				"title" : dataForWeixin.title, //标题
				"desc" : dataForWeixin.desc, //分享内容
				"link" : dataForWeixin.url,
			},function(){
				//alert("发送给朋友回调()");
				//location.href = "http://www.baidu.com";
			});
		});
		
		//分享到朋友圈
		WeixinJSBridge.on('menu:share:timeline', function(argv) {
			WeixinJSBridge.invoke('shareTimeline', {
				"appid" : dataForWeixin.appId,
				"title" : dataForWeixin.TLTitle, //描述文字
				"img_url" : dataForWeixin.TLImg, //图片
				"link" : dataForWeixin.url,
				"desc" : dataForWeixin.desc, //无用！必须存在！分享内容
			}, function (){
				//alert("分享到朋友圈回调()");
				
			});
		});

	};

	if (document.addEventListener) {
		document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	} else if (document.attachEvent) {
		document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
		document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	}
