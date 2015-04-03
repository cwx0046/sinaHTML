
/**
 * 服务器获取作品投票json
 */
var lists_by_vote = [];
/**
 * 当前页要显示的作品 数组
 */
var lists_page_by_vote = []; 
/**
 * 当前页码
 */
var page_num = 1;
/**
 * 每页6张作品
 */
var item_per_page = 6; 


/**
 * 获得json[["2825523","12"],["2825591","8"],["2825593","6"],["2825603","5"],["2825533","4"],["2825589","2"],["2825604","1"]]
 * @param callback
 */
function get_top_lists(page,callback) {
	
	if (lists_by_vote != "") { //已经获得所有作品排序
		cut_data_by_page_and_set_btn();
		return;
	}
	
	$.post("http://jiangsusina.com/2015wxh/getall.php",function(json){
		lists_by_vote = json;
		
		cut_data_by_page_and_set_btn();
	});
	
	
	function cut_data_by_page_and_set_btn() {
		lists_page_by_vote = [];
		
		var this_page_max = page_num*item_per_page;
		this_page_max = this_page_max > lists_by_vote.length ? lists_by_vote.length : this_page_max;
		
		for (var i = (page_num - 1)*item_per_page; i < this_page_max; i++) {
			lists_page_by_vote.push(lists_by_vote[i]);
		}
		page_num++;
		
		if ((page_num - 1)*item_per_page >= lists_by_vote.length) {
			//按钮：没有更多了
			alert("没有更多了，继续执行get_top_lists将会报错");
		}else{
			//按钮：加载更多
			alert("您可以执行get_top_lists来获取下一页");
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
function get_usework_by_ids(data) {
	
	var i = -1;
	var idLength = data.length;
	
	function check_next_id() {
		i++;
		if (i >= idLength) {
			return;
		}else{
			get_one_work_by_id(data[i], check_next_id);
		}
	}
	
	check_next_id();
}

/**
 * 
 * @param data
 * @param callback
 */
function get_one_work_by_id(data,callback) {
	var id = data[0];       //作品编号
	var vote_num = data[2]; //作品票数
	
	$.JSONP('http://act.city.sina.com.cn/interface/activity/json_get_one_user_work.php',{work_id:id},function(json){
		if(json.error == 0){
			var data = json.data;
			
			var html = "";
			html += "<span>uname:" + data.form_data.custom_1.value + "</span>";
			html += "<span>phone:" + data.form_data.custom_2.value + "</span>";
			html += "<span>title:" + data.form_data.custom_3.value + "</span>";
			html += "<span>msg:" + data.form_data.custom_4.value + "</span>";
			html += "<img src='" + data.form_data.custom_6.value + "'/>";
			html += "<span>票数:" + vote_num +"</span>";
			
			//调试输出
			$("body").append(html);
			
        }else{
            alert(json.errmsg);
        }
		
		if (typeof(callback) == "function") {
			callback();
		}
	});
}



/*
 * 
 * 本js调试语句
 * get_top_lists( page_num, function(){get_usework_by_ids(lists_page_by_vote)});
 * 
 */