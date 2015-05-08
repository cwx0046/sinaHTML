/* 获取参赛作品 */

/**
 * 服务器获取作品投票json
 */
var lists_by_vote = [];
var lists_by_vote_school = [];
/**
 * 当前页要显示的作品 数组
 */
var lists_page_by_vote = [];
var lists_page_by_vote_school = []; 
/**
 * 当前页码
 */
var page_num = 1;
var page_num_school = 1;

/**
 * 每页6张作品
 */
var item_per_page = 8; 


/**
 * 获得json[["2825523","12"],["2825591","8"],["2825593","6"],["2825603","5"],["2825533","4"],["2825589","2"],["2825604","1"]]
 * @param callback
 */
function get_top_lists(page,callback) {
	
	if (lists_by_vote_school != "") { //已经获得所有作品排序
		cut_data_by_page_and_set_btn();
		return;
	}
	
	//获取微信所有作品
	$.post("http://jiangsusina.com/2015wxh/getallnj.php",function(wxJson){
		//获取活动平台所有作品。
		$.JSONP('http://act.city.sina.com.cn/interface/activity/json_get_user_works.php',{act_id: 11148, order: "vote", pcount: 99999, p: 1},function(json){
			if(json.error == 0){
				var data = json.data;
				for (var j = 0; j < wxJson.length; j++) {
					var voteNum = -1;
					for (var i = 0; i < data.length; i++) {
						if(data[i].id == wxJson[j][0]){
							voteNum = wxJson[j][1];
							var work = [data[i].id, voteNum, data[i].form_data.custom_1.value, data[i].form_data.custom_3.value, data[i].form_data.custom_5.value];
							lists_by_vote_school.push(work);
						}
					}
				}
				cut_data_by_page_and_set_btn();
	        }else{
	            photoApp.alert(json.errmsg);
	        }
		});
	});
	
	
	function cut_data_by_page_and_set_btn() {
		lists_page_by_vote_school = [];
		
		var this_page_max = page_num_school*item_per_page;
		this_page_max = this_page_max > lists_by_vote_school.length ? lists_by_vote_school.length : this_page_max;
		
		for (var i = (page_num_school - 1)*item_per_page; i < this_page_max; i++) {
			lists_page_by_vote_school.push(lists_by_vote_school[i]);
		}
		page_num_school++;
		
		if ((page_num_school - 1)*item_per_page >= lists_by_vote_school.length) {
			//按钮：没有更多了
			//photoApp.alert("没有更多了，继续执行get_top_lists将会报错");
			$(".load-more").html("没有更多了").attr("href","javascript:;");

		}else{
			//按钮：加载更多
			//photoApp.alert("您可以执行get_top_lists来获取下一页");
		}
		
		if (typeof(callback) == "function") {
			callback();
		}
	}
	
}
function get_top_lists_school(page,callback) {
	
	if (lists_by_vote_school != "") { //已经获得所有作品排序
		cut_data_by_page_and_set_btn_school();
		return;
	}
	
	//获取微信所有作品
	$.post("http://jiangsusina.com/2015wxh/getallnj.php",function(wxJson){
		//获取活动平台所有作品。
		$.JSONP('http://act.city.sina.com.cn/interface/activity/json_get_user_works.php',{act_id: 11148, order: "vote", pcount: 99999, p: 1},function(json){
			if(json.error == 0){
				var data = json.data;
				for (var j = 0; j < wxJson.length; j++) {
					var voteNum = -1;
					for (var i = 0; i < data.length; i++) {
						if(data[i].id == wxJson[j][0]){
							voteNum = wxJson[j][1];
							var work = [data[i].id, voteNum, data[i].form_data.custom_1.value, data[i].form_data.custom_3.value, data[i].form_data.custom_5.value];
							lists_by_vote_school.push(work);
						}
					}
				}
				cut_data_by_page_and_set_btn_school();
	        }else{
	            photoApp.alert(json.errmsg);
	        }
		});
	});
	
	
	function cut_data_by_page_and_set_btn_school() {
		lists_page_by_vote_school = [];
		
		var this_page_max = page_num_school*item_per_page;
		this_page_max = this_page_max > lists_by_vote_school.length ? lists_by_vote_school.length : this_page_max;
		
		for (var i = (page_num_school - 1)*item_per_page; i < this_page_max; i++) {
			lists_page_by_vote_school.push(lists_by_vote_school[i]);
		}
		page_num_school++;
		
		if ((page_num_school - 1)*item_per_page >= lists_by_vote_school.length) {
			//按钮：没有更多了
			//photoApp.alert("没有更多了，继续执行get_top_lists将会报错");
			$(".load-more-school").html("没有更多了").attr("href","javascript:;");

		}else{
			//按钮：加载更多
			//photoApp.alert("您可以执行get_top_lists来获取下一页");
		}
		
		if (typeof(callback) == "function") {
			callback();
		}
	}
	
}


/**
 * 
 * @param data
 */
function get_usework_by_ids(data, $target) {
	
	var i = -1;
	var idLength = data.length;
	
	function check_next_id() {
		i++;
		if (i >= idLength) {
			return;
		}else{
			get_one_work_by_id(data[i], check_next_id, $target);
		}
	}
	
	check_next_id();
}

/**
 * 
 * @param data
 * @param callback
 */
var ranke_num = 0;
function get_one_work_by_id(data,callback,$target) {
	var id = data[0];       //作品编号
	var vote_num = data[1]; //作品票数
	var work_name = data[2];//摄影师姓名
	var work_address = data[3];//拍摄地点
	var work_img = data[4]; //作品图片
	
	ranke_num++;
	var t_fr = "";
	if(ranke_num%2==0){ t_fr = "fr";}
	var html = "";		
	
	html += '<li class="'+t_fr+'" onClick="go_details($(this))">';
	html += '<img src="'+ work_img +'" width="100%" />';
	html += '<p class="w-mes clearfix"><span class="fl">'+ (Number(id)-3360000) +'</span><span class="fr">'+ vote_num +'</span></p>';
	html += '<div href="javascript:;" class="w-name" wName="'+ work_name +'" wAddress="'+ work_address +'">'+ work_address +'</div>';
	html += '<span class="w-ranke">'+ ranke_num +'</span>';
	html += '</li>';
	
	//输出
	//$(".works-list").append(html);
	$target.append(html);
	if (typeof(callback) == "function") {
		callback();
	}
	
}

function get_more_lists(){
	get_top_lists( page_num, function(){get_usework_by_ids(lists_page_by_vote, $(".works-list"));});
}
function get_more_lists_school(){
	get_top_lists_school( page_num_school, function(){get_usework_by_ids(lists_page_by_vote_school, $(".works-list-school"));});
}

/*
 * 
 * 本js调试语句
 * get_top_lists( page_num, function(){get_usework_by_ids(lists_page_by_vote)});
 * 
 */