var baoxiangUrl;
var work_id;
var priceName = '';
var workid;
var ztUrl = 'http://jiangsu.sina.com.cn/z/2014jslegou/index.shtml';
var seedId = 'BtX9rqGql'; 


function openLoginDialog(){DFZ.APP.DialogLogin.open();$("#ui-dialog-title-1").html("新浪微博登录");}
/*获取url参数*/
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
    }
	$(function(){
		var uid = getQueryString("uid");
		work_id = getQueryString("wid");
		if(uid && work_id){
			//block
                       get_vote_num(work_id);
                       $(".baoxiang_open").show();
			var topNum = $("#part_10").offset().top;
			$('body,html').animate({scrollTop:topNum},1000);

		}else{
			//none
		}
		//显示当前宝箱被打开次数
		
	})

/* 获取单个作品信息 */
function get_vote_num(work_id){
	$.JSONP('http://act.city.sina.com.cn/interface/activity/json_get_one_user_work.php',{work_id:work_id},function(json){
//console.log(json);
			//var id = json.data[0].id;
			var vote_count = json.data.vote_count;
			//var create_uid = json.data.create_uid;
			//var user_nick = json.data.user_nick;
			
			//$(".u_ico").attr('src','http://tp1.sinaimg.cn/'+create_uid+'/50/0');
			//$(".u_nick").text(user_nick);
			$(".friendNum").html(vote_count);
		}
	);
}

var custom_2;
var rotateFunc = function(awards,angle,text){  //awards:奖项，angle:奖项对应的角度
	$('#lotteryBtn').stopRotate();
	$("#lotteryBtn").rotate({
		angle:0, 
		duration: 5000, 
		animateTo: angle+1440, //angle是图片上各奖项对应的角度，1440是我要让指针旋转4圈。所以最后的结束的角度就是这样子^^
		callback:function(){
			if(awards==0)
			{
				//$.popBox({popid:'myCon',bgid:'myBg',ishtml:false,width:445,height:400});
                $(".result_no").show();
                
				var content = '差点就中了！！我刚刚在【畅游江苏】首届“乐购江苏”#旅游纪念品创意设计大赛#活动中为入围作品投了一票，与500元加油卡、100元电话充值卡失之交臂好心塞！那么，快来帮我开宝箱赢肾6吧→_→'+baoxiangUrl;
				repostWeiboByCookie ( content, seedId, 0, '' );
                
			}
			else{
				
				$(".priceName").html(priceName); //赋值
				$(".result_yes").show();
				
				var content = '天上掉馅儿饼啦！我刚刚在“江苏推荐旅游商品征集评选”活动中为入围作品 投了一票，一不小心就获得了'+priceName+'一份！这么好中？！你也来试试→_→'+baoxiangUrl;
				repostWeiboByCookie ( content, seedId, 0, '' );
				
				//custom_2 = text ;
			}

		}
	}); 
};
	
function getPrize(a)
{
	var data = a;
	if(data==4121){
		priceName = "500元加油卡";
		rotateFunc(1,30,'恭喜您获得：500元加油卡');
	}
	if(data==4122){
		priceName = "100元电话充值卡";
		rotateFunc(2,300,'恭喜您获得：100元电话充值卡');
	}
	if(data==4123){
		priceName = "50元电话充值卡";
		rotateFunc(3,120,'恭喜您获得：50元电话充值卡');
	}
	if(data==4124){
		priceName = "新浪吉祥物";
		var angle = [0,90,180,240];
			angle = angle[Math.floor(Math.random()*angle.length)]
		rotateFunc(4,angle,'恭喜您获得：新浪吉祥物')
	}
	if(data==0){
		var angle = [60,150,210,270,330];
			angle = angle[Math.floor(Math.random()*angle.length)]
		rotateFunc(0,angle,'很遗憾，您未抽中奖！')
	}
	
	
	
}


//抢宝箱

function qiangbaoxiang(){
	var uinfo = sinaSSOManager.getSinaCookie();
	if (!uinfo) {
		//alert("失败");
		openLoginDialog();
		return false;
	} else {
		var uid = uinfo.uid;
		$.JSONP('http://act.city.sina.com.cn/interface/activity/json_add_signup.php',{act_id:8012,custom_1:uid},function(bm){
			if(bm.error==0){
				// 获得了一个宝箱 work_id
				workid = bm.work_id;
				baoxiangUrl = ztUrl+ "?uid="+uid+"&wid="+workid;
				
				$(".baoxiang_get").show();
	                  
			}else{
				//已经获得宝箱
				//alert(bm.errmsg);
			}
		});
	}
}
	
/* 
$(".closeBtn").click(function()
{
$('.result_no').fadeOut();
qiangbaoxiang();
});
 */
$(function() {
	$("#lotteryBtn").rotate({ 
		   bind: 
			 { 
				click: function()
				{
					var uinfo = sinaSSOManager.getSinaCookie();
					if (!uinfo) {
						//alert("失败");
						openLoginDialog();
						return false;
					} else {
						
						$.JSONP('http://act.city.sina.com.cn/interface/activity/json_add_signup.php',{act_id:8092,custom_1:"PC"},function(bm){
						if(bm.error==0){
							if(typeof(bm.draw.is_win)=="undefined"){
								alert("您今天已经抽过1次了，明天再来吧！"); 
								return false;
							} else if(bm.draw.is_win==0){
								getPrize(0);
							} else{
								var pid = bm.draw.hit_prize.id;
								getPrize(pid);

							}						
							//alert("报名成功");
						}else{
							alert("您今天已经抽过1次了，明天再来吧！"); 
						}
					 });
					}
				}
			 } 
		   
		});
});

$(function() {
	
	//加载用户信息
	//登录
	function openLoginDialog(callback){DFZ.APP.DialogLogin.open(callback);$("#ui-dialog-title-1").html("新浪微博登录");}
	var uinfo = sinaSSOManager.getSinaCookie();
	if (!uinfo) { //判断登陆
		openLoginDialog(function(){
			window.location.reload();
		});

		$(".workCards").html('您还没有登录，请<a href="javascript:window.location.reload();">点击刷新</a>');
		return;
	}else{
		var nick = uinfo.nick;
		var uid = uinfo.uid;
		$(".u_ico").attr('src','http://tp1.sinaimg.cn/'+uid+'/50/0');
		$(".u_nick").text(nick);
		
		try{
		$.JSONP('http://act.city.sina.com.cn/interface/activity/json_get_user_works.php',{act_id:8012,pcount:99999},function(json)
		{	
			//我的票数
			for(var i=0; i<json.data.length; i++){

				var user_id = json.data[i].user_id;
				var vote_count = json.data[i].vote_count;
					
				if(uid == user_id){
					$(".u_voteNum").text(vote_count);		
				}
			}
			//已经得到所有宝箱
			for(var i=0; i<json.data.length; i++){
				var wid = json.data[i].id;
				var uid = json.data[i].form_data.custom_1.value;
				if( uinfo.uid == uid ){
					// 这个用户有宝箱了！
					workid = wid;
					//查找是否有宝箱 设置url
					baoxiangUrl = ztUrl+ "?uid="+uid+"&wid="+workid;
				}
			}
			
			//宝箱加载完毕后去加载
			fillWorks(); //填充作品列表
			fillTop10();
			
		});
		} catch (e) {
			$(".workCards").text("非常抱歉，网络状况不佳，加载作品列表失败");
		}
	}

});



$(".top10_chooser").click(function(){
	$(".top10_chooser").removeClass("cur");
	$(this).addClass("cur");
	
	$(".top10_t").hide();
	if ($(this).attr("id") == "top10_1") {
		$(".top10_t1").show();
	}else{
		$(".top10_t2").show();
	}
	
});

//填充top10
function fillTop10(){
	var dom = $(".top10_t2");
	var html = '';
	$.JSONP('http://act.city.sina.com.cn/interface/activity/json_get_user_works.php',{act_id:8012,pcount:10,order:'vote'},function(json)
	{

		for(var i=0; i<json.data.length; i++)
		{
			var nick = json.data[i].user_nick;
			var count = json.data[i].vote_count;
			html += "<li><span class='name'>";
			html += nick+"</span>"+count+"次";
			html += "</li>";
		}
		dom.html(html);
	});

}
	

//填充作品列表
function fillWorks(){
	//访问服务器
	//填充数据
	var dom = $(".workCards");
	var html = '';
	var imgNeedAdd = ["g9.jpg",
	                  "g16.jpg",
	                  "g20.jpg",
	                  "g41.jpg",
	                  "g131.jpg",
	                  "p219.jpg",
	                  "p223.jpg",
	                  "p225.jpg",
	                  "p226.jpg",
	                  "p227.jpg",
	                  "p231.jpg",
	                  "p232.jpg",
	                  "p233.jpg",
	                  "p234.jpg",
	                  "p235.jpg",
	                  "p236.jpg",
	                  "p238.jpg",
	                  "p239.jpg",
	                  "p243.jpg",
	                  "p244.jpg",
	                  "p246.jpg",
	                  "p247.jpg",
	                  "p249.jpg",
	                  "p258.jpg",
	                  "p292.jpg",
	                  "p293.jpg",
	                  "p294.jpg",
	                  "p295.jpg",
	                  "p296.jpg",
	                  "p298.jpg"
      				];
	var imgNeedAddSrc = ["g9.jpg,d10.jpg",
	                     "g16.jpg,d18.jpg",
	                     "g20.jpg,d22.jpg,d24.jpg",
	                     "g41.jpg,d54.jpg",
	                     "g131.jpg,d136.jpg,d138.jpg",
	                     "p219.jpg,d1.jpg,d3.jpg",
	                     "p223.jpg,d8.jpg",
	                     "p225.jpg,d11.jpg",
	                     "p226.jpg,d13.jpg",
	                     "p227.jpg,d14.jpg",
	                     "p231.jpg,d20.jpg",
	                     "p232.jpg,d21.jpg,d22s.jpg,d24s.jpg",
	                     "p233.jpg,d26.jpg,d27.jpg,d28.jpg,d29.jpg",
	                     "p234.jpg,d30.jpg",
	                     "p235.jpg,d32.jpg",
	                     "p236.jpg,d34.jpg,d35.jpg,d36.jpg,d37.jpg,d39.jpg,d40.jpg,d41.jpg,d42.jpg,d43.jpg,d44.jpg,d45.jpg,d46.jpg",
	                     "p238.jpg,d48.jpg,d50.jpg",
	                     "p239.jpg,d51.jpg",
	                     "p243.jpg,d3s.jpg",
	                     "p244.jpg,d5.jpg",
	                     "p246.jpg,d6.jpg",
	                     "p247.jpg,d10s.jpg,d12.jpg",
	                     "p249.jpg,d14s.jpg,d16.jpg",
	                     "p258.jpg,d26s.jpg,d27.jpg",
	                     "p292.jpg,d61.jpg",
	                     "p293.jpg,d64.jpg,d65.jpg",
	                     "p294.jpg,d66.jpg,d68.jpg",
	                     "p295.jpg,d69.jpg,d71.jpg",
	                     "p296.jpg,d72.jpg,d74.jpg",
	                     "p298.jpg,d76.jpg"
                 		];
	$.JSONP('http://act.city.sina.com.cn/interface/activity/json_get_user_works.php',{act_id:8206,pcount:300,order:'rand'},function(json)
	{

		$.JSONP('http://act.city.sina.com.cn/interface/activity/json_get_user_works.php',{act_id:8989,pcount:300},function(json2)
		{
			var work_top10 = [];
			
			for(var i=0; i<json.data.length; i++){

				var id = json.data[i].id;
				var mingcheng = json.data[i].form_data.custom_1.value;
				var leibie = ' ';
				var imgurl = 'http://jiangsu.sinaimg.cn/zt/s/lgjslyjnp/photo/'+json.data[i].form_data.custom_2.value;
				var img_lurl = 'http://jiangsu.sinaimg.cn/zt/s/lgjslyjnp/photo_l/'+json.data[i].form_data.custom_2.value;
				var limgName = json.data[i].form_data.custom_2.value;
				var count = json.data[i].vote_count;
				
				
				for (var j = 0; j < json2.data.length; j++) {
					var work_id = json2.data[j].form_data.custom_1.value;
					if (work_id == id) {
						
						
						var vote_count = json2.data[j].form_data.custom_2.value;
						var num = parseInt(vote_count);
						count = parseInt(count);
						count += num ;
						
					}
				}
				work_top10[i] = [];
				work_top10[i][0] = mingcheng;
				work_top10[i][1] = count;
				
				
				
				//大图显示
				for (var j = 0; j < imgNeedAdd.length; j++) {
					if( limgName == imgNeedAdd[j]){
						img_lurl = "http://jiangsu.sina.com.cn/zt/s/2014jslegou_photo.html?imgsrc="+imgNeedAddSrc[j];
					}
				}
				
				if( i%15 == 0 ){ html+='<ul class="workTab">';}

				html+= '<li>';
				html+= '<a target="_blank" href="'+img_lurl+'">';
				html+= '<img class="w_img" src="'+ imgurl +'">';
				html+= '</a>';
				html+= '<div class="w_author">'+leibie+'</div>';
				html+= '<div class="w_vote_count">'+count+'</div>';
				html+= '<label class="w_voteLabel">';
				html+= '<input class="w_voteCheckbox" type="checkbox" id="'+id+'" value="'+id+'"/>';
				html+= '</label>';
				html+= '<div class="w_name">'+mingcheng+'</div>';
				html+= '</li>';

				if( (i+1)%15 == 0 ){ html+='</ul>';}
				
				if ( (i+1)%15 == 0 | i == json.data.length-1) {
					if( i == 14 ){
						dom.html(html);
					}else{
						dom.append(html);
					}
					html="";
				}
			}
			
			//work_top10 排序
			for (var k = 0; k < work_top10.length; k++) {
				
			}
			
			
			
		});
	});
	// end json[]
}



/* 翻页 */
function changePage(){ 
	var p = parseInt(document.getElementById("jumpPage").value);
	if( isNaN(p) | p == "" | p ==undefined){ alert("页码不正确");return;}
	page(p);
}
function page(p) {
	p = (p < 1) ? 1 : p; 
	p = (p > 20) ? 20 : p; 
	
	// TODO 翻页
	$(".workCards").scrollTop(678*(p-1));
	
	// 修改翻页页码

	var orgp = p;
	p = (p < 3) ? 3 : p; 
	p = (p > 18) ? 18 : p; 
	var html = '';
	html += '<li onclick="page(1)">首页</li>';
	html += '<li onclick="page('+(orgp-1)+')">上一页</li>';
	if (p-2 == orgp) {
		html += '<li onclick="page('+(p-2)+')" class="current">'+(p-2)+'</li>';
	}else{
		html += '<li onclick="page('+(p-2)+')"">'+(p-2)+'</li>';
	}
	if (p-1 == orgp) {
		html += '<li onclick="page('+(p-1)+')" class="current">'+(p-1)+'</li>';
	}else{
		html += '<li onclick="page('+(p-1)+')"">'+(p-1)+'</li>';
	}
	if (p == orgp) {
		html += '<li onclick="page('+p+')" class="current">'+p+'</li>';
	}else{
		html += '<li onclick="page('+p+')">'+p+'</li>';
	}
	if (p+1 == orgp) {
		html += '<li onclick="page('+(p+1)+')" class="current">'+(p+1)+'</li>';
	}else{
		html += '<li onclick="page('+(p+1)+')"">'+(p+1)+'</li>';
	}
	if (p+2 == orgp) {
		html += '<li onclick="page('+(p+2)+')" class="current">'+(p+2)+'</li>';
	}else{
		html += '<li onclick="page('+(p+2)+')"">'+(p+2)+'</li>';
	}
	//html += '<li onclick="page('+(p-1)+')">'+(p-1)+'</li>';
	//html += '<li onclick="page('+p+')">'+p+'</li>';
	//html += '<li onclick="page('+(p+1)+')">'+(p+1)+'</li>';
	//html += '<li onclick="page('+(p+2)+')">'+(p+2)+'</li>';
	html += '<li onclick="page('+(orgp+1)+')">下一页</li>';
	html += '<li onclick="page(99999)">尾页</li>';
	
	$(".pageNums").html(html);
}


/* 投票 */
function voteFun() {
alert('活动已结束，感谢您的关注');
return;

	goodsIds = [];
	
	var selectedNum = $(".workCards input[type=checkbox]:checked").length;
	
	if(selectedNum<1 | selectedNum>10){
		alert("请勾选1~10个作品");
		return;
	}
	
	//登录
	function openLoginDialog(){DFZ.APP.DialogLogin.open();$("#ui-dialog-title-1").html("新浪微博登录");}
	var uinfo = sinaSSOManager.getSinaCookie();
	if (!uinfo) { //判断登陆
		openLoginDialog();
		return false;
	}
	//searchBaoxiang();//已经有宝箱链接了
	
	$(".workCards input[type=checkbox]:checked").each(
		function(){
			var id = $(this).val();
			goodsIds.push(id);
		}
	);
	
	qiangbaoxiang();
	
//今天可以投票么？？？
	var username = uinfo.uid + uinfo.nick;
	$.JSONP('http://act.city.sina.com.cn/interface/activity/json_add_signup.php',{
	    act_id:8256,
	    custom_1:username
	},function(bm){
		if(bm.error==0){
			
			//今天可以投票！
			$.JSONP('http://act.city.sina.com.cn/interface/activity/json_add_vote.php',{
					id : goodsIds[0]
			}, function(bm) { //返回结果
				if (bm.error == 0) {
					//   弹框“点击抽奖”！
					
					//2 给goodsIds[]剩余的投票
					for (var i = 1; i < goodsIds.length; i++) {
						$.JSONP('http://act.city.sina.com.cn/interface/activity/json_add_vote.php',{
							id : goodsIds[i]
						}, function(bm) {});
					}
					
					alert('投票成功！恭喜您获得一次大转盘机会');
					$(".bigWheel").show();
					fillWorks();
				}else{
					// 例如：已经透过票了
					alert(bm.errmsg);
				}
			});
			
        }else{
	        alert(bm.errmsg);
	        //alert('您今天已经参与过投票了！明天再来吧');
   		}
	});
}



//查找是否有宝箱 设置url
function searchBaoxiang() {
	var uinfo = sinaSSOManager.getSinaCookie();
	if( !uinfo.uid ){ return;}
	
	//获得全部作品
	$.JSONP('http://act.city.sina.com.cn/interface/activity/json_get_user_works.php',{act_id:8012,pcount:99999,order:'-time'},function(json)
	{
		for(var i=0; i<json.data.length; i++){
			var wid = json.data[i].id;
			var uid = json.data[i].form_data.custom_1.value;
			if( uinfo.uid == uid ){
				// 这个用户有宝箱了！
				workid = wid;
				baoxiangUrl = ztUrl+ "?uid="+uid+"&wid="+workid;
			}
		}
	});
	// end json[]
}




/* 中奖用户提交 姓名、手机号 */
function submit_userInfo() {
	var name = $("#u_name").val();
    var custom_0 = $("#u_phone").val();
    var partten = /^1[3,5,8]\d{9}$/;
    if((name=="") || (name=="请输入姓名")){alert("请输入姓名！");document.getElementById("u_name").focus(); return false;}
    if(!partten.test(custom_0)){alert("请填写正确的手机号！");document.getElementById("u_phone").focus(); return false;}


    
    $.JSONP('http://act.city.sina.com.cn/interface/activity/json_add_signup.php',{
	    act_id:8093,
	    custom_1:name,
	    custom_2:custom_0,
	    custom_3:priceName
	},function(bm){
        if(bm.error==0){
            	alert("提交成功");
            	$('.result_yes').fadeOut();
                //qiangbaoxiang();
            }else{
            alert(bm.errmsg);
        }
    }); 
}

/* 发微博召集小伙伴 */
function sendWeibo() {
	var content = '快来参加【畅游江苏】首届“乐购江苏”#旅游纪念品创意设计大赛#投票评选活动，赢取土豪奖品～戳这里为我开启宝箱→_→'+baoxiangUrl;
	repostWeiboByCookie( content, seedId, 0, '' );
	//alert("发出微博");
	$(".baoxiang_get").fadeOut();
}

/* 打开宝箱 */
function openBox() {
	//alert("打开宝箱");
var uinfo = sinaSSOManager.getSinaCookie();
	  if (!uinfo) {
			openLoginDialog();
			return false;
		}
	$.JSONP('http://act.city.sina.com.cn/interface/activity/json_add_vote.php',{id:work_id},function(json){
		if(json.error==0){
			//var contentWeibo = '';
			//var mid = '';
			//repostWeiboByCookie ( contentWeibo, mid, 3, '成功' );
			$(".u_voteNum").text(parseInt($(".u_voteNum").text())+1);
			alert('成功打开宝箱，快来为旅游纪念品投票，赢取属于你的iPhone吧！');
		}else{
			//alert(json.errmsg);
			//alert('每天只能为他打开一次');
			alert('活动已结束，感谢您的关注');

		}
		
	});

	$(".baoxiang_open").fadeOut();
} 
 
</script>




