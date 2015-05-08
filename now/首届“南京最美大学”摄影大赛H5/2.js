var item_per_page;
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