$(function() {
	$("#gameul").cardgame();
});


$.fn.cardgame = function () {
	$(this).each(function() {
		
		//对象
		var gameul = $(this);//
		var li = gameul.find("li");
		
		//定义已翻开卡牌
		var visibleCardList = [];
		var cardshow = [];
		
		//计数器
		var step = 0;
		
		//初始化图片列表
		li.find("img").hide();
		var imglist = getRandomImgList();
		for (var i = 0; i < li.length; i++) {
			li[i].innerHTML = '<img alt="" src="'+imglist[i]+'">';
			}
			
 
			li.bind("touchstart", function() {
			var cardIndex = li.index($(this));
			/* 已翻开的卡牌没有响应 */
			if (isExistInArray(cardIndex, visibleCardList)) {
				return;
			}
			/* 翻开卡牌 */
			$(this).find("img").stop(true,true).show();
			cardshow.push(cardIndex);
			visibleCardList.push(cardIndex);
			step++;
			$("#step").html(step);
			
			/* 如果已经有2张卡翻开，进行相同对比 */
			if(cardshow.length == 2){
				var card1src = li.slice(cardshow[0], cardshow[0]+1).find("img").attr("src");
				var card2src = $(this).find("img").attr("src");
				
				/* 相同 */
				if(card1src == card2src){
					/* 清空临时翻卡 */
					cardshow = [];
					
					/* 完成  */
					if (visibleCardList.length == li.length) {
						//alert("完成！ 您用了 "+step+" 步");
						$("#gameul").fadeOut(600); //游戏方块隐藏
						$("#gamehover").show(600); // 结束文字显示
						$("#steptext").html($("#step").html()); //取得步数
						$("#submitbtn").removeAttr("disabled"); //抽奖按钮启用
						
						// 清空初始化 重置游戏
						//resetGame();
					}
					
					/* 结束退出 */
					return;
				}else{
					//不相同
					/* 隐藏图片 */
					li.slice(cardshow[0], cardshow[0]+1).find("img").stop(true,true).delay(300).fadeOut(600);
					$(this).find("img").stop(true,true).delay(300).fadeOut(600);
					
					/* 清空临时翻卡 */
					cardshow = [];
					visibleCardList.splice(visibleCardList.length-2,2); //移除刚刚翻出的2张卡
				}					
			}
		});
		
		/*
		 * 游戏重置
		 */
		function resetGame(){
			visibleCardList=[]; //已翻开卡牌清空
			cardshow = []; //当前翻开的2张卡牌清空
			li.find("img").hide(); // 全部图片隐藏
			step = 0; //步数归零
			$("#step").html(step); //显示步数
			imglist = getRandomImgList(); //获取打乱后的图片地址
			for (var i = 0; i < li.length; i++) { //放入图片
				li[i].innerHTML = '<img alt="" src="'+imglist[i]+'">';
			}
		}
	});
}
/* 开始新的游戏 */
function onceagain() {
	$("#gameul").cardgame();
	$("#step").html(0); //显示步数
	$("#gameul").fadeIn(600);
	$("#gamehover").hide(600);
}

/* 数组中是否存在 */
function isExistInArray(obj, array){
	for (index in array) {
		if (array[index] == obj) {
			return true;
		}
	}
	return false;
}


/* 初始化并打乱图片列表 */
function getRandomImgList(){
	var imgList = [];
	imgList[0] = "http://s3img.city.sina.com.cn/activity/common/large/6cf3129210e24100bf216066578a390e.jpg";
	imgList[1] = "http://s3img.city.sina.com.cn/activity/common/large/e86aa779758532d62670931d3dde1d3d.jpg";
	imgList[2] = "http://s3img.city.sina.com.cn/activity/common/large/2dabd04a6fd07c56571ebbb9867d8502.jpg";
	imgList[3] = "http://s3img.city.sina.com.cn/activity/common/large/ea9b08b5a7b0a6b759c1fc9aa1b61837.jpg";
	imgList[4] = "http://s3img.city.sina.com.cn/activity/common/large/c790b87c74fdf8a3035719ff2cc341a1.jpg";
	imgList[5] = "http://s3img.city.sina.com.cn/activity/common/large/ca054c6f67b2082f139ae294aa82c0ad.jpg";
	var orginalLength = imgList.length;
	for(i = 0; i < orginalLength; i++){
		imgList.push(imgList[i]);
	}
	return  imgList.sort(function(){ return 0.5 - Math.random() });
}
	
	
/* 发微博并抽奖 */
function sendweibo(){
/* 禁用按钮 */
$("#submitbtn").attr("disabled","disabled");

/* 微博内容 */
var content = "#看见昆山看见台湾#【哇~！玩配对游戏赢免费昆山台湾游】昆山、台湾的美景美食、特色文化，我都想实地体验一番呢！还有特色礼包等你来拿！小伙伴们，快快跟我来一起加入新浪旅行家征集活动，嗨翻一夏！详戳http://t.cn/RPisnbX @玩转昆山";

	//open the login dialog
	function openLoginDialog(){DFZ.APP.DialogLogin.open();$("#ui-dialog-title-1").html("新浪微博登录");}
	var uinfo = sinaSSOManager.getSinaCookie();
	if (!uinfo) {
		/* alert("没有登录"); */
		$("#submitbtn").removeAttr("disabled");
		openLoginDialog();
		return false;
	} else {
		/* alert("登录成功"); */
		
		/* 抽奖 */
		var uid = uinfo.uid;
		var step = $("#step").html()+"";
		$.JSONP('http://act.city.sina.com.cn/interface/activity/json_add_signup.php',{act_id:6482,custom_1:content,custom_2:uid,custom_3:step},function(json){
			if(json.error==0){
				/*
				var contentWeibo = content;
				addWeiboByCookie( contentWeibo, '', '微博发布成功' );
				*/
				/* 抽奖结果提示 */
				alert(json.draw.tip.text);
				
			}else{
				alert(json.errmsg);
				return false;
			}
		});
		
	}

}
	