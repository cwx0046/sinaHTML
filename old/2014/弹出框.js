(function($) {

	$.extend({
		/**
		 * 弹出框
		 * $.popBox({word:'要显示的消息',clbtn:'images/close.png',color:'brown',btn:'images/btn.png'});  
		 * 第一个参数是设置参数，参数说明见下面注释 ，第二个参数是弹出回调函数，第三个参数是关闭回调函数
		 */
		popBox: function(settings, popBack, closeBack) {
			popBack = popBack ||
			function() {}; //弹框回调函数
			$.closeBack = closeBack ||
			function() {}; //关闭弹框回调函数
			var _setting = {
				isFade: true,
				speed: 1000,
				sure: true,
				ishtml: true,
				isbg: true
			}; //默认值
			_setting = $.extend(_setting, settings);

			//参数配置部分
			_setting = _setting || {};
			var word = _setting.word || ""; //弹出框文字
			var popbox = _setting.popid || "popbox"; //默认弹框id
			var popbg = _setting.bgid || "popbg"; //默认背景id
			var w = _setting.width || 400; //默认宽度
			var h = _setting.height || 200; //默认高度
			var clbtn = _setting.clbtn || "http://act.ci123.com/global/images/close.png"; //关闭按钮图片
			var btn = _setting.btn || "http://act.ci123.com/global/images/btn.png"; //确定按钮图片
			var topcolor = _setting.color || "#ff727f"; //色彩风格
			var sure = _setting.sure //是否有确定按钮
			var isbg = _setting.isbg //是否有背景
			var ishtml = _setting.ishtml //是否只是弹出原有框子(可以弹出页面上已有的框子)
			var isFade = _setting.isFade; //是否采用fadeIn
			var speed = _setting.isFade; //fadeIn速度
			var bod = $(document.body);
			if (ishtml) {
				var html = "<div id=\"" + popbg + "\" style=\"display:none;\"></div><div id=\"" + popbox + "\"><div class=\"" + popbox + "\"><div class=\"" + popbox + "pop_t\" style=\"\"><a href=\"javascript:void(0);\" onclick=\"$.hidePop('" + popbox + "','" + popbg + "')\"><img src=\"" + clbtn + "\" width=\"9\" height=\"9\" border=\"0\" /></a></div><div class=\"" + popbox + "pop\" style=\"\"><p style=\"\">" + word + "</p>";
				if (sure) {
					html += "<a href=\"javascript:void(0)\" onclick=\"$.hidePop('" + popbox + "','" + popbg + "')\"><div class=\"" + popbox + "pop_btn\"><img src=\"" + btn + "\" width=\"70\" height=\"28\" boder=\"0\" /></div></a>";
				}
				html += "</div></div></div>";
				bod.append(html);

				$("#" + popbox).attr("style", "position:absolute;z-index:1000;display:none;");
				$("." + popbox).attr("style", "width:" + w + "px;");
				var pt_w = w - 27,
				ptp = w - 40;
				$("." + popbox + " ." + popbox + "pop_t").attr("style", "width:27px;height:20px; padding:10px 0 0 " + pt_w + "px;  background:" + topcolor + ";");
				$("." + popbox + " ." + popbox + "pop").attr("style", "width:" + ptp + "px; background:#fff; padding:15px 20px; text-align:center;border:0;");
				$("." + popbox + " ." + popbox + "pop p").attr("style", "font-size:14px; line-height:20px; color:" + topcolor + "; padding-bottom:20px;");
				$("." + popbox + "pop_btn").css({
					'background': topcolor,
					'width': '70px',
					'height': '28px',
					'margin': '0 auto'
				});
			}

			//设置css，不管原来存不存在pobbg都先用jquery设置下背景样式，解决IE下 fadeIn 后 opacity失效的bug
			$("#" + popbg).attr("style", "width:100%;position:absolute;top:0;left:0;background:#000;filter:alpha(opacity=50);opacity:0.5;z-index:999;display:none;");

			var bw = bod.width();
			var bgh = bod.height();
			var bh = $(window).height();
			var st = $(document).scrollTop();
			var left = (bw - w) / 2;
			//var top = (bh - h) / 2 + st;
			var top = 220;
			if (isbg) {
				if (isFade) {
					$("#" + popbg).fadeIn(speed).css({
						"height": bgh
					});
				} else {
					$("#" + popbg).show().css({
						"height": bgh
					});
				}
			}
			if (isFade) {
				$("#" + popbox).fadeIn(speed).css({
					"top": top,
					"left": left
				});
			} else {
				$("#" + popbox).show().css({
					"top": top,
					"left": left
				});
			}
			popBack.call();
		},
		//关闭弹出框执行回调函数，回调函数需要事先设置$.closeBack
		hidePop: function(popbox, popbg) {
			popbg = popbg || 'popbg';
			$("#" + popbox).hide();
			$("#" + popbg).hide();
			$.closeBack.call();
			$.closeBack = '';
		},

		closeBack: ''
	})

})(jQuery)

