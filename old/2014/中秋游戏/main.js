//初始化题库
var q = [["2","你觉得中秋节放7天假有必要吗？", //q1
          "是","2",
          "否","3"
         ],
         ["2","你有和家人吃饭赏月的习惯吗？",//q2
          "是","4",
          "否","5"
         ],
         ["2","你中秋节会送朋友月饼吗？",//q3
          "是","5",
          "否","6"
         ],
         ["2","你认为月宫里住着嫦娥的传说美丽吗？",//q4
          "是","6",
          "否","7"
         ],
         ["2","你崇尚哪种过节方式？",//q5
          "一大家子人聚在一起","7",
          "和三两个好朋友一起","8"
         ],
         ["2","你比较多过东方的节日还是西方的？",//q6
          "西方","8",
          "东方","9"
         ],
         ["2","如果可以选择，你希望收到什么中秋礼物？",//q7
          "实用的生活用品","8",
          "传统型（如月饼、水果等）","9"
         ],
         ["2","你会借中秋的机会给自己和恋人制造浪漫的约会吗？",//q8
          "是","C",
          "否","D"
         ],
         ["2","你与异性约会喝咖啡时，都是怎样坐？",//q9
          "各坐一面","B",
          "并排坐一起","A"
         ],
           
         ];
var qArray = new Array();

for (var i = 0; i < q.length; i++) {
	var obj = q[i];
	var qobj =  {
			id : i+1,
			question : obj[1],
			select : {
			}
		};
	
	//填充题目
	qobj.select.o1 = {
			text     : obj[2],
			gotoquestion : obj[3]
		};
	qobj.select.o2 = {
			text     : obj[4],
			gotoquestion : obj[5]
		};
	
	if (obj[0] == 4) {
		qobj.select.o3 = {
				text     : obj[6],
				gotoquestion : obj[7]
			};
		qobj.select.o4 = {
				text     : obj[8],
				gotoquestion : obj[9]
			};
	}
	
	qArray.push(qobj);
}
// end 初始化题库

//用户题号
var userqnum = 0;
var tpic4;//pic4 timeout

function windowleave() {
	var a = confirm("亲，你真不想要五星级酒店的月饼了吗?轻松分享就有机会喔～");
	if (a) {
		return true;
	}else {
		return false;
	}
}


function question(num) {
	if (num == 'A'|num == 'B'|num == 'C'|num == 'D') {
		page(num);
	}else{
		userqnum++;
		page(++num);
	}
}

function page(num) {
	

	//页面切换
	if (num == 1) {
	//首页
		clearTimeout(tpic4);
		showBox('pic1');
		setTitleImg(1);
		dataForWeixin.TLTitle = dataForWeixin.desc = "玩心理测试，免费得五星级酒店月饼大礼包"; //微信分享内容重置
		userqnum = 0; //用户答题数目重置
	}else{
		if (num == 'A'|num == 'B'|num == 'C'|num == 'D') {
		//最终结果
			rank = num;
			setRank(rank);
			showBox('pic3');
			setTitleImg(3);
			
			tpic4 = setTimeout(function(){
				$("#pic4").height($(window).height());
				$("#pic4").fadeIn();
				
			}, 3000);
			
		}else {
		//题目页
			showBox('pic2');
			setTitleImg(2);
			var q = getQuestion(num - 2);
			//alert("题号"+q.id);
			//console.log(obj);
			if (num-2 == 0) {
				setQuestionIntoPage(q);
				questionLiInanimate();
				return;
			}
			$("#question").fadeOut('300');
			$("#choosebox").fadeOut('300',function(){
				
				setQuestionIntoPage(q);
				
				questionLiInanimate();
			});
			
			
		}
	}
}


function questionLiInanimate() {
	$("#question").fadeIn();
	$("#choosebox").fadeIn();
	//题目进入动画
	var lis = $("#choosebox").children("li");
	
	for (var i = 0; i < lis.size(); i++) {
		//console.log(lis.eq(i));
		lis.eq(i).hide().delay(i*100).fadeIn();
		
	}
	return;
}

function getQuestion(num) {
	return qArray[num];
}



function setQuestionIntoPage(obj){
	//设置题目
	//document.getElementById("qnum").innerHTML = obj.id+"、";//题号
	document.getElementById("qnum").innerHTML = userqnum+"、";//题号
	document.getElementById("qtext").innerHTML = obj.question;//题目
	//设置选项
	var html = "";
	//计算答案数量
	var count = 0;
	for ( var index in obj.select) {
		count++;
	}
	html += '<li class="choose" onclick="question(\''+obj.select.o1.gotoquestion+'\')"><img alt="" src="http://jiangsu.sinaimg.cn/2014/0903/U9263P1194DT20140903181656.png" width="12">'+obj.select.o1.text+'<div class="goto">-'+obj.select.o1.gotoquestion+'</div></li>';
	html += '<li class="choose" onclick="question(\''+obj.select.o2.gotoquestion+'\')"><img alt="" src="http://jiangsu.sinaimg.cn/2014/0903/U9263P1194DT20140903181656.png" width="12">'+obj.select.o2.text+'<div class="goto">-'+obj.select.o2.gotoquestion+'</div></li>';
	if (count == 4) {
		html += '<li class="choose" onclick="question('+obj.select.o3.gotoquestion+')"><img alt="" src="http://jiangsu.sinaimg.cn/2014/0903/U9263P1194DT20140903181656.png" width="12">'+obj.select.o3.text+'<div class="goto">-'+obj.select.o3.gotoquestion+'</div></li>';
		html += '<li class="choose" onclick="question('+obj.select.o4.gotoquestion+')"><img alt="" src="http://jiangsu.sinaimg.cn/2014/0903/U9263P1194DT20140903181656.png" width="12">'+obj.select.o4.text+'<div class="goto">-'+obj.select.o4.gotoquestion+'</div></li>';
	}
	
	document.getElementById("choosebox").innerHTML = html;
	
} 



//设置标题图片
function setTitleImg(num) {
	var titleImg = document.getElementById('titleImg');
	switch (num) {
	case 1:
		titleImg.src = "http://jiangsu.sinaimg.cn/2014/0903/U9263P1194DT20140903181658.png";
		break;
	case 2:
		titleImg.src = "http://jiangsu.sinaimg.cn/2014/0904/U9263P1194DT20140904183335.png";
		break;
	case 3:
		titleImg.src = "http://jiangsu.sinaimg.cn/2014/0903/U9263P1194DT20140903181659_1.png";
		break;
	default:
		titleImg.src = "http://jiangsu.sinaimg.cn/2014/0903/U9263P1194DT20140903181658.png";
		break;
	}
}

//显示区块
function showBox(boxname) {
	document.getElementById('pic1').style.display = "none";
	document.getElementById('pic2').style.display = "none";
	document.getElementById('pic3').style.display = "none";
	if (boxname=="pic1"|boxname=="pic3") {
		$("#"+boxname).fadeIn();
		return;
	}
	document.getElementById(boxname).style.display = "block";
}



function setRank(rank){
	var ranktitle = document.getElementById('ranktitle');
	var ranktext = document.getElementById('ranktext');
	var htmltitle = "";
	var htmltext = "";
	switch (rank) {
	case 'A':
		htmltitle = "A你适合吃：抹茶月饼";
		htmltext = "你淡泊名利、与世无争，在你心中，只要可以每天有饭吃有觉睡，下雨有地方躲，晚上不用睡马路，一切就够了，这样的性格会使朋友们觉得你是个很好相处的人。适合吃：抹茶月饼，清淡、平和。";
		dataForWeixin.TLTitle = dataForWeixin.desc = "我适合吃抹茶月饼，五星级酒店月饼快到碗里来！";
		break;
	case 'B':
		htmltitle = "B你适合吃：巧克力月饼";
		htmltext = "你给人感觉是个快乐阳光的人，每天笑口常开，烦恼和困扰都和你绝缘。你不愿去想那些麻烦事，你认为人生短暂，不想浪费大好青春和大把光阴去苦恼。适合吃：巧克力月饼，香醇浓郁，释放味蕾。";
		dataForWeixin.TLTitle = dataForWeixin.desc = "我适合吃巧克力月饼，五星级酒店月饼快到碗里来！";
		break;
	case 'C':
		htmltitle = "C你适合吃：冰皮月饼";
		htmltext = "你好奇心强，喜欢冒险，人缘好。善于发现有趣的事情，但耐心较差，敢于冒险。渴望浪漫的爱情，但对婚姻的要求比较现实。适合吃：冰皮月饼，月饼界的新品种，满足你猎奇的欲望。";
		dataForWeixin.TLTitle = dataForWeixin.desc = "我适合吃冰皮月饼，五星级酒店月饼快到碗里来！";
		break;
	case 'D':
		htmltitle = "D你适合吃：五仁月饼";
		htmltext = "你是冷静、稳重、沉着的人。凡事三思而后行，处事谨慎。即使因小小的疏忽而发生纰漏，你也愿意承担责任，而且内心比其他人更柔软一些。适合吃：五仁月饼，经典、清香，是月饼界的“常青树”。";
		dataForWeixin.TLTitle = dataForWeixin.desc = "我适合吃五仁月饼，五星级酒店月饼快到碗里来！";
		break;
	default:
		break;
	}
	ranktitle.innerHTML = htmltitle;
	ranktext.innerHTML = htmltext;
	
}

var dataForWeixin = {
		appId : "",
		title : "中秋吃啥月饼很重要",
		TLImg : "http://jiangsu.sinaimg.cn/2014/0903/U9263P1194DT20140903181653.jpg",
		desc : "玩心理测试，免费得五星级酒店月饼大礼包",
		url : "http://jiangsu.sina.com.cn/zt/s/2014MAFMooncake.html", //请填写分享出去的URL
		TLTitle: "玩心理测试，免费得五星级酒店月饼大礼包" //朋友圈文字

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
	


//未使用的数组
var q1 = {
		id : 1,
		question : "你买了一盒里面藏有字条的月饼，你猜里面会写着什么呢？",
		select : {
			o1 : {
				text : "恭喜你马上可以享受带薪假期一年。",
				gotoquestion : "2"
			},
			o2 : {
				text : "恭喜你即刻起拥有一个月的高智商。",
				gotoquestion : "3"
			},
			o3 : {
				text : "恭喜你未来一个月会结束单身。",
				gotoquestion : "4"
			},
			o4 : {
				text : "恭喜你可以拥有一座海边别墅。",
				gotoquestion : "5"
			},
		}
	};