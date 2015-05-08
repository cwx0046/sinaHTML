
var data = {
	t: "json",
	uids: [1737886622,1496814565],
	app_id: 159
};

function name() {
	$.JSONP("http://mblogv2.city.sina.com.cn/interface/tcommonv2/no_auth/user/json_get_user_info_by_uids.php?t="+data.t+"&uids="+data.uids.toString()+"&app_id="+ data.app_id,
		{},
		function(json){
			if (json.data.errno == 1) {
				var data = json.data.result;
				console.log(data);
				
				
			} else {
				alert(json.data.errmsg);
			}
		}
	);
}
