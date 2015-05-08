
var ACTID_PC = 10643;
var ACTID_H5 = 6189;
/**
 * PCTop300数据
 */
var data_PC = {};
var data_H5 = {};

var PCnumCount = 0;
var H5numCount = 0;

var page_PC = 1;
var page_H5 = 1;

// PC
$.JSONP('http://act.city.sina.com.cn/interface/activity/json_get_user_works.php',{act_id:ACTID_PC, pcount:300, order:'vote'},function(json){
	data_PC = json;
	PCnumCount = json.data.length;
	setPCPage(1);
});

//H5
$.JSONP('http://act.city.sina.com.cn/interface/activity/json_get_user_works.php',{act_id:ACTID_H5, pcount:9999, order:'vote'},function(json){
	var data1 = json;
	//获取微信所有作品
	$.post("http://jiangsusina.com/2015wxh/getall.php",function(wxJson){
		//获取活动平台所有作品。
		$.JSONP('http://act.city.sina.com.cn/interface/activity/json_get_user_works.php',{act_id: 10761, order: "vote", pcount: 9999, p: 1},function(json){
			if(json.error == 0){
				var data = json.data;
				for (var j = 0; j < wxJson.length; j++) {
					for (var i = 0; i < data.length; i++) {
						if(data[i].id == wxJson[j][0]){
							data[i].vote_count = wxJson[j][1];
							data1.data.push(data[i]);
						}
					}
				}
				
				//console.log(data1);
				
				//排序
				for (var i = 0; i < data1.data.length; i++) {
					for (var j = 0; j < i; j++) {
						if ( parseInt(data1.data[i].vote_count) < parseInt(data1.data[j].vote_count) ) {
							var temp = data1.data[i];
							data1.data[i] = data1.data[j];
							data1.data[j] = temp;
						}
					}
				}
				
				//前100
				data1.data.splice(100);
				
				
				data_H5 = data1;
				H5numCount = data_H5.data.length;
				setH5Page(1);
	        }else{
	            alert(json.errmsg);
	        }
		});
	});
});




function setPCPage(p) {
	page_PC = p;
	setPage($('#voList'), $('#page'), getPage(p, 10, data_PC));
}
function setH5Page(p) {
	page_H5 = p;
	setPageH5($('#voList_H5'), $('#page_H5'), getPage(p, 10, data_H5));
}

function setPage($listDom, $pageDom, datas) {
	var html ="";
	for(var i=0; i<datas.length;i++){
            var data = datas[i];

             html += '   <li>';
             html += '   <a href="http://jiangsu.sina.com.cn/1/2015-03-30/470.html?cid='+data.id+'" target="_blank"><img src="'+data.form_data.custom_8.value+'" width="164" height="164"></a>';
             html += '   <div class="icon-area">';

             /* 如果作品指定了作者，则显示指定后的作者头像、昵称  @20150421 NorthWind */
             var imgurl = data.user_info.profile_image_url;
             var usernick = data.user_info.screen_name;
                  
             if( data.custom_user_info != "" ){
                imgurl = data.custom_user_info.profile_image_url;
                usernick = data.custom_user_info.screen_name; 
             }
        
             html += '   <img class="icon-pic" src="'+imgurl+'" width="50" height="50">';
             html += '   <p>'+usernick+'</p>';
             /* end 如果作品指定了作者，则显示指定后的作者头像、昵称  @20150421 NorthWind */

             html += '   </div>';
             html += '   <div class="work-votenumBox" id="votenum'+ data.id +'">'+data.vote_count+'</div>';
             //html += '   <div class="work-voteBtn" onclick="voteTo('+ data.id +',\''+ data.form_data.custom_8.value + '\')">投票</div>';

            var PCnumCount = 300;
            var pageCount = Math.ceil(parseInt(PCnumCount)/10);
            var htmlPage = '';
            var p = page_PC;
            if(pageCount>1){
                for(var k=1; k<=pageCount; k++){
                    if(k==p){
                        htmlPage += '<a href="javascript:;" onclick="setPCPage('+k+')" class="cur">'+k+'</a>';
                    }else{
                        if(k<3 || (k>(p-4) && k<(p+4) )|| k>pageCount-3)
                        {
                            if(k == (p-3) && p>6)
                            {   
                                  htmlPage += '...<a href="javascript:;" onclick="setPCPage('+k+')">'+k+'</a>';
                            }
                            else if(k == (p+3) && p< (pageCount-4))
                            {
                                htmlPage += '<a href="javascript:;" onclick="setPCPage('+k+')">'+k+'</a>...';
                            }
                            else
                            {
                                htmlPage += '<a href="javascript:;" onclick="setPCPage('+k+')">'+k+'</a>'; 
                            }
                        }
                    }
                }
            }
            $pageDom.html(htmlPage);
    }
    $listDom.html(html);
    
    return null;
}


function setPageH5($listDom, $pageDom, datas) {
	var html ="";
	for(var i=0; i<datas.length;i++){
		var data = datas[i];
		
		html += '   <li>';
		html += '   <a href="http://jiangsu.sina.com.cn/1/2015-03-30/470.html?cid='+data.id+'" target="_blank"><img src="'+data.form_data.custom_6.value+'" width="164" height="164"></a>';
		html += '   <div class="icon-area">';
		html += '   <p>'+data.form_data.custom_1.value+'</p>';
		html += '   </div>';
		html += '   <div class="work-votenumBox" id="votenum'+ data.id +'">'+data.vote_count+'</div>';
		
		var pageCount = Math.ceil(parseInt(H5numCount)/10);
		var htmlPage = '';
		var p = page_H5;
		if(pageCount>1){
			for(var k=1; k<=pageCount; k++){
				if(k==p){
					htmlPage += '<a href="javascript:;" onclick="setH5Page('+k+')" class="cur">'+k+'</a>';
				}else{
					if(k<3 || (k>(p-4) && k<(p+4) )|| k>pageCount-3)
					{
						if(k == (p-3) && p>6)
						{   
							htmlPage += '...<a href="javascript:;" onclick="setH5Page('+k+')">'+k+'</a>';
						}
						else if(k == (p+3) && p< (pageCount-4))
						{
							htmlPage += '<a href="javascript:;" onclick="setH5Page('+k+')">'+k+'</a>...';
						}
						else
						{
							htmlPage += '<a href="javascript:;" onclick="setH5Page('+k+')">'+k+'</a>'; 
						}
					}
				}
			}
		}
		$pageDom.html(htmlPage);
	}
	$listDom.html(html);
	
	return null;
}


/**
 * 返回活动后台JSON中第p页的pcount个作品
 * @param p		      页码
 * @param pcount      每页作品个数
 * @param data        JSON数据
 * @returns pageData  页面数据
 */
function getPage(p, pcount, data) {
	
	/**
	 * 分页数据
	 */
	var pageData = [];
	
	/**
	 * 起始索引
	 */
	var STARTINDEX = (p - 1) * pcount;
	
	/**
	 * 结束索引
	 */
	var ENDINDEX = p * pcount - 1;
	
	for (var i = STARTINDEX; i <= ENDINDEX; i++) {
		// 如果该页面有内容则生成分页数据
		if (data.data[i] != undefined) {
			pageData.push(clone(data.data[i]));
		}
	}
	
	return pageData;
}



/**
 * 克隆对象
 * @param obj
 * @returns {Clone}
 */
function clone(obj){  
    function Clone(){}  
    Clone.prototype = obj;  
    var o = new Clone();  
    for(var a in o){  
        if(typeof o[a] == "object") {  
            o[a] = clone(o[a]);  
        }  
    }  
    return o;  
}  