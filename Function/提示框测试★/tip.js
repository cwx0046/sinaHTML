// JavaScript Document
/**
 * @description : dialog类
 * @author      : laohu@staff.sina.com.cn
 * @create date : 2011-12-13
 * @change date : 2011-14-28 18:26
 * @version     : v0.1
 * @see         : http://ria.city.sina.com.cn/widget/tips/index2.htm
 */

(function($, undefined){
$.ns("DFZ.APP.Dialog");
DFZ.APP.Dialog.BasicDiaglog = function( options ){
	this.init( options );
}

function now(){
	return new Date().getTime();	
}

function bind(obj, func){
	return function(){
		return func.apply(obj, arguments);	
	};	
}

$.extend( DFZ.APP.Dialog.BasicDiaglog.prototype, {
	constructor : DFZ.APP.Dialog.BasicDiaglog,
	init : function( options ){
		var self = this,
			tpl = '<div class="bg"><table cellspacing="0" cellpadding="0" border="0"><tbody><tr><td><div class="dialogcontent"><div node-type="title" class="title dialogDrag"><span node-type="title_content">${title}</span></div><a title="${closeTip}" class="W_close" href="javascript:void(0);"></a><a title="关闭" class="W_close2 __close" style="display:none;" href="javascript:void(0);"></a><div class="layContent">{{html content}}</div></div></td></tr></tbody></table>{{html arrowContent}}</div>',
			$window = $(window);
		self.ie6 = !!window.ActiveXObject && !window.XMLHttpRequest;
		self.options = $.extend( { 
			title : "BasicDialog",
			content : "......",
			width : 0,
			height : 0,
			zIndex : 10001,
			hiddClose : null,
			esc : false,
			hidden : true,
			noDrag : true,
			isBg : true,
			isHover : false,
			isTitle : true,
			isClose : true,
			bgColor : "#000",
			opacity : .4,
			closeTip : "关闭",
			arrowContent : "",
			onClose : function(){},
			onHide : function(){}
		}, options || {} );
		var options = self.options;
		options.isBg && self.setMask(options.zIndex, options.hidden);
		self._$node = $("<div class=\"W_layer\"></div>");
		self._$node.appendTo( "body" ).css( {
			"position" : "absolute",
			"visibility" : "hidden"
		} );
		if( options.zIndex ){
			self._$node.css( "z-index", options.zIndex );
		}
		if( options.hidden ){
			self._$node.css( "visibility", "hidden" );
		}
		if(self.ie6){
			self._$node.bgIframe && self._$node.bgIframe();	
		}
		
		$.tmpl(tpl, options).appendTo( self._$node );
		self._$nodeBody = self._$node.find( ".layContent" );
		self.setSize(options.width, options.height );
		self._$btnClose = self._$node.find( ".W_close" );
		self._$nodeTitle = self._$node.prev().find("span");
		self._bindClose = bind(self, self._setBtnClose);
		self._$btnClose.bind("click", self._bindClose);
		self._$btnMove = self._$btnClose.prev();
		if(!options.noDrag){
			self._$btnMove.css( "cursor", "move");	
		}
		self._$btnMove["resize"] = function(){
			self.resize();	
		};
		self._$btnMove["scroll"] = function(){		
			self.scroll();			
		};
		self._$btnMove["keydown"] = function(event){
			if (options.esc) {
				return;
			}
			if(!self._$btnMove){
				return;	
			}
			var p = event.keyCode;
			
			if (p === 27) {
				self.close()
			}	
		};
		
		!options.isHover && self.setMiddle();
		if (options.hidden) {
			self._$node.css("visibility", "hidden");
			self.focusTarget = self._$btnClose;
		} else {
			self._$node.css("visibility", "visible");
			self._$btnClose.focus().blur();
		}
		
		if(!options.isTitle){
			self._$btnMove.hide();

		}
		
		if(!options.isClose){
			self._$btnClose.hide();	
		}
		
		if (!options.noDrag) {
			self._$node.draggable({ handle: ".dialogDrag" });
		}
		
		
		
		$window.bind({
			"resize" : self._$btnMove["resize"],	
			"scroll" : self._$btnMove["scroll"]
		});
		
		$(document).bind("keydown", self._$btnMove["keydown"]);	
	},
	_setBtnClose : function(){
		var self = this,
			options = self.options;	
		if (options.hiddClose) {
			options.onHide();
		} else {
			self.close();
		}			
		return false;			
	},
    distory: function() {
		var self = this,
			options = self.options;	
        if (self._distory) {
            return;
        }
		$(window).unbind({
			"resize" : self._$btnMove["resize"],	
			"scroll" : self._$btnMove["scroll"]
		});		
		self._$btnClose.unbind("click", self._bindClose);
		self._$btnClose = null;
		self._$node.remove();
		self._$mask && self._$mask.remove();
		self._$node = null;
		self._$btnMove["resize"] = null;
		self._$btnMove["scroll"] = null;
		self._$btnMove["close"] = null;	
		self._$btnMove = null;
		self._destory = true;
		self._close = true;
    },
	setSize : function( width, height){
		var self = this,
			options = self.options;
        width = width ? width + "px": "auto";
        height = height ? height + "px": "auto";
        self._$nodeBody.css( {
			"width" : width,
			"height" : height
		});
	},
    close: function() {
		var self = this,
			options = self.options;
		if(self._close){
			return;	
		}
		setTimeout(function(){
			options.onClose();			
		}, 0);
        self.distory();
    },
    show: function() {
		var self = this,
			options = self.options;
		if(!self._$node){
			return;	
		}
		self._$node.css( "visibility",  "visible" );
		if(self._$mask){
			self._$mask.css("visibility", "visible");
		}        
        if (self.focusTarget) {
            self.focusTarget.focus()
        }
		if( self._$mask && self.ie6){
			var html = document.getElementsByTagName('html')[0];
			if (document.body.currentStyle.backgroundAttachment !== 'fixed') {
				html.style.backgroundImage = 'url(about:blank)';
				html.style.backgroundAttachment = 'fixed';
			}; 	
		}
        self.resize();
        !options.isHover && self.setMiddle();
    },
    hidd: function() {
		var self = this,
			options = self.options;
        options.onHide();
		self._$node.css( "visibility",  "hidden" );
		if(self._$mask){
			self._$mask.css("visibility", "hidden");
		}		
    },
    setMask: function(z, hidden) {
		var self = this,
			options = self.options;
		self._$mask = $("<div class=\"setFixedIE6\"></div>").appendTo("body");
		
		if( hidden ){
			self._$mask.css("visibility", "hidden");
		}
		
		self._$mask.css({
            position : "fixed",
            backgroundColor : options.bgColor,
            width : "100%",
			height : "100%",
            zIndex : parseInt(z),
			opacity : options.opacity
		});
		if(self.ie6){			
			self._$mask.bgIframe && self._$mask.bgIframe();
			self._$mask.css({
				"position" : "absolute"
			});
			
		}else{
			self._$mask.css({
				left : 0,
				top : 0
			});
		}
		//self.resize();
    },
    setPosition: function(left, top) {
		var self = this;
		if(!self._$node){
			return;	
		}
		self._$node.css({
			"left" : left + "px",
			"top" : top + "px"
		});
    },
    resize: function() {
		var self = this,
			options = self.options;
		if( self._$mask ){
			if(self.ie6){
				self._setIE6Scroll();
			}			
		}
		//self.setMiddle();
    },
	_setIE6Scroll : function(){
		var self = this,
			$window = $(window);
		if( self._$mask && self.ie6){
			self._$mask.css({"width" : $window.width() + "px","height" : $window.height() + "px"});
		}			
	},
    scroll: function(){
		var self = this;
		self._setIE6Scroll();
    },
    setTitle: function( title ) {
		var self = this;
       self._$nodeTitle.html( title );
    },
	setContent : function(content){
		var self = this;
		self._$nodeBody.html(content);
	},
    setMiddle: function() {
		var self = this,
			options = self.options,
			w = self._$node.outerWidth(),
			h = self._$node.outerHeight(),
			$window = $(window),
			s = $window.scrollTop(),			
			b = {
				width : $window.width(),
				height : $window.height()
			},
			a = s + ( b.height - h ) / 2,
			c = ( b.width - w ) / 2;
		
		self._$node.css({
			"left" : c + "px",
			"top" : a < 20 ? 20 : a + "px"
		});
		
    }
} );

DFZ.APP.alert = function(content, options){
	var obj = {},
		tpl = '<div node-type="inner"><div class="layer_point" node-type="outer"><dl class="point clearfix"><dt><span node-type="icon" class="icon_${type}M"></span></dt><dd node-type="inner"><p node-type="textLarge" class="W_texta">{{html content}}</p><p node-type="textSmall" class="W_textb"></p></dd></dl>',
		btn_id = "btn_" + now(),
		_content = "",
		_dialog = null,
		$btn = null,
		tempJ = $("<div></div>");
	options = $.extend({
		hasBtn : true,
		title : "提示",
		ok_label : "确定",
		ok_callback : function(){}
	}, options || {});
	
    obj.width = options.width ? options.width: 380;
    obj.height = options.height;
    obj.zIndex = options.zIndex ? options.zIndex: 10001;
    obj.hidden = options.hidden;
	obj.title = options.title;
	obj.isBg = options.isBg;
	obj.noDrag = false;
	obj.esc = true;
	obj.isTitle = options.isTitle;
	tpl += '<div class="btn"';
	if(!options.hasBtn){
		tpl += ' style="height:0;overflow:hidden;" ';
	}
	tpl += '>';
	tpl += '<a node-type="OK" id="${btn_id}" class="W_btn_b" href="javascript:void(0)"><span>${ok_label}</span></a></div></div></div>';
	_content = $.tmpl(tpl, {
		type : options.type,
		content : content,
		ok_label : options.ok_label,
		btn_id : btn_id
	}).appendTo(tempJ);
	
	obj.content = tempJ.html();
	
	_dialog = new DFZ.APP.Dialog.BasicDiaglog(obj);
	
	$btn = $("#" + btn_id);
    var j = function() {
        options.ok_callback();
		$btn.unbind("click", arguments.callee);
		$btn = null;
		_dialog.close();
		$(document).unbind("keyup", r);
        return false;
    };
    var r = function(event) {
        var x = event,
        	w = x.target,
			tagName = w.tagName.toUpperCase();
        if (w.nodeType == 3) {
            w = w.parentNode
        }
        if (w.tagName == "input" || w.tagName == "textarea") {
            return;
        }
        switch (x.keyCode) {
        case 27:
            j();
            break;
        }
    };
	
	$btn.bind("click", j);
	
	$(document).bind("keyup", r);
    if (options.hidden) {
        this.focusTarget = $btn
    } else {
        $btn.focus()
    }
	_dialog.show();
	return _dialog;
};

$.extend(DFZ.APP, {
	warn : function(content, callback){
		return DFZ.APP.alert(content, {
			title : "提示信息",
			type : "warn",
			hasBtn : true,
			width : "auto",
			ok_callback : callback
		});			
	},
	error : function(content, callback){
		return DFZ.APP.alert(content, {
			title : "提示信息",
			type : "error",
			hasBtn : true,
			width : "auto",
			ok_callback : callback
		});			
	},
	success : function(content, callback){
		return DFZ.APP.alert(content, {
			title : "提示信息",
			type : "success",
			hasBtn : true,
			width : "auto",
			ok_callback : callback
		});			
	},
	question : function(content, callback){
		return DFZ.APP.alert(content, {
			title : "提示信息",
			type : "question",
			hasBtn : true,
			width : "auto",
			ok_callback : callback
		});			
	}
});

DFZ.APP._tip = function( content, isTitle, interval , type){
	var dialog = null;
	interval = interval || 3;
	if(!!isTitle){
		dialog = DFZ.APP.alert(content, {
			title : "提示信息",
			type : type,
			hasBtn : false,
			isBg : false,
			width : "300",
			isTitle : !! isTitle
		});				
	}else{
		dialog = new DFZ.APP.Dialog.BasicDiaglog({
			isTitle : false,
			noDrag : false,
			isBg : false,
			noDrag : true,
			isHover : false,
			isClose : false,
			width:300,
			content : "<div style='padding:15px;'>" + content + "</div>"
		});
		dialog.show();
	}

	
	setTimeout(function(){
		try{
			dialog.close();		
		}catch(e){}						
	}, interval * 1000);
	
	return dialog;
};

DFZ.APP.SUCCESS = function(content){
	
	if(!content)
	{
		content = "发布成功";
	}
	
	return DFZ.APP._tip('<div class="inner flow-step"><h3><span class="succeed-tit">' + content + '</span></h3></div>', false);
};

DFZ.APP.EDITORTIP = function(url, content){
	content = content || '<div class="inner flow-step"><h3><span class="succeed-tit">发布成功</span></h3><p class="auto-skip">3秒后自动跳转至发布的帖子<a href="' + url + '">马上去看看</a></p></div>';
	var dialog = new DFZ.APP.Dialog.BasicDiaglog({
		isTitle : false,
		noDrag : false,
		isBg : false,
		noDrag : true,
		isHover : false,
		isClose : false,
		width:250,
		content : "<div style='padding:5px;'>" + content + "</div>"
	});	
	dialog.show();
	setTimeout(function(){
		try{
			dialog.close();		
		}catch(e){}
		window.location.href = url;					
	}, 3 * 1000);	
};



DFZ.APP.confirm = function(content, options){
	var obj = {},
		tpl = '<div node-type="inner"><div class="layer_point" node-type="outer"><dl class="point clearfix"><dt><span node-type="icon" class="icon_questionM"></span></dt><dd node-type="inner"><p node-type="textLarge" class="W_texta">{{html content}}</p><p node-type="textSmall" class="W_textb"></p></dd></dl><div class="btn"><a node-type="OK" id="${ok_id}" class="W_btn_b" href="javascript:void(0)"><span>${ok_label}</span></a><a node-type="OK" id="${cancel_id}" class="W_btn_a" href="javascript:void(0)"><span>${cancel_label}</span></a></div></div></div>',
		ok_id = "ok_" + now(),
		cancel_id = "cancel_" + now(),
		_content = "",
		_dialog = null,
		$btn = null,
		tempJ = $("<div></div>");
	options = $.extend({
		hasBtn : true,
		title : "提示",
		ok_label : "确定",
		cancel_label : "取消",
		ok_callback : function(){},
		cancel_callback : function(){}
	}, options || {});
	
    obj.width = options.width ? options.width: 380;
    obj.height = options.height;
    obj.zIndex = options.zIndex;
    obj.hidden = options.hidden;
	obj.title = options.title;
	obj.isBg = options.isBg;
	obj.noDrag = false;
	obj.esc = true;
	obj.isTitle = options.isTitle;
	_content = $.tmpl(tpl, {
		content : content,
		ok_label : options.ok_label,
		cancel_label : options.cancel_label,
		ok_id : ok_id,
		cancel_id : cancel_id
	}).appendTo(tempJ);
	
	obj.content = tempJ.html();
	
	_dialog = new DFZ.APP.Dialog.BasicDiaglog(obj);
	
	$ok = $("#" + ok_id);
	$cancel = $("#" + cancel_id);
    var j = function() {
        options.ok_callback();
		$ok.unbind("click", r);
		$ok = null;
		$cancel.unbind("click", a);
		$cancel = null;
		_dialog.close();
		$(document).unbind("keyup", r);
        return false;
    };
    var a = function() {
        options.cancel_callback();
		$ok.unbind("click", r);
		$ok = null;
		$cancel.unbind("click", a);
		$cancel = null;
		_dialog.close();
		$(document).unbind("keyup", r);
        return false;
    };
    var r = function(event) {
        var x = event,
        	w = x.target,
			tagName = w.tagName.toUpperCase();
        if (w.nodeType == 3) {
            w = w.parentNode
        }
        if (w.tagName == "input" || w.tagName == "textarea") {
            return;
        }
        switch (x.keyCode) {
        case 27:
            a();
            break;
        }
    };
	
	$ok.bind("click", j);
	
	$cancel.bind("click", a);
	
	$(document).bind("keyup", r);
    if (options.hidden) {
        this.focusTarget = $ok;
    } else {
        $ok.focus();
    }
	_dialog.show();
	return _dialog;
};

DFZ.APP.Tip = function(options){
	this.init(options);	
};

$.extend( DFZ.APP.Tip.prototype, {
	constructor : DFZ.APP.Tip,
	init : function( options ){
		var self = this;
		self.options = options = $.extend({
			elem : null,
			direction : "top",
			content : "",
			delay : 1,
			width : 350,
			height : 100,
			arrowDistance : 30,
			fixDistance : 10,
			eventType : "click",
			isClose : false,
			hide_callback : function(){}						  
		}, options || {});
		self.timer = null;
		self.hover = bind(self, self._setNodeHide);
		self.arrow();
		self._setEvent();
		
	},
	arrow : function(){
		var self = this,
			options = self.options,
			tempObj = {};
		tempObj.width = options.width ? options.width: 380;
		tempObj.height = options.height;
		tempObj.zIndex = options.zIndex ? options.zIndex: 1000;
		tempObj.content = options.content;
		tempObj.arrowContent = '<div class="__arrow" ></div>'
		tempObj.isBg = false;
		tempObj.noDrag = true;
		tempObj.isClose = false;
		tempObj.esc = true;
		tempObj.isTitle = false;
		tempObj.onClose = options.hide_callback;
		self.bd = new DFZ.APP.Dialog.BasicDiaglog(tempObj);
		if(options.isClose){
			self.bd._$node.find(".__close").show().click(bind(self, self.hide));
		}
	},
	_setEvent : function(){
		var	self = this,
			options = self.options;
		if(options.eventType === "hover"){
			options.elem.hover(function(event){
				if(self.timer){
					clearTimeout(self.timer);	
				}
				var arr = self._getXYCLASS(this, event);
				self.setArrow(arr[2]);
				self.show();
				self.setPosition(arr[0], arr[1]);
				return false;
			}, function(){
				if(self.timer){
					clearTimeout(self.timer);					
				}
				self.timer = setTimeout(self.hover, options.delay * 1000);
				return false;
			});	
			self.bd._$node.hover(function(){
				if(self.timer){
					clearTimeout(self.timer);	
				}										  
			},function(){
				if(self.timer){
					clearTimeout(self.timer);					
				}
				self.timer = setTimeout(self.hover, options.delay * 1000);				
			});
		}	
	},
	_setNodeHide : function(){
		var self = this;
		self.bd.hidd();
	},
	_getXYCLASS : function(obj, event){
		var $this = obj instanceof $ ? obj : $(obj),
			self = this,
			options = self.options,		
			$offset = $this.offset(), 
			offset = [$offset.left, $offset.top],
			arrowClass = "",
			x = 0,
			y = 0,
			node = self.bd._$node[0],
			arrow = self.bd._$node.find(".__arrow"),
			offsetJ = [node.offsetWidth, node.offsetHeight],
			offsetI = [obj.offsetWidth, obj.offsetHeight],
			$window = $(window),
			winJ = [$window.width(), $window.height()];
			
		if(event){
			var client = [event.clientX, event.clientY],
			page = [event.pageX, event.pageY];			
		}
			
		switch( options.direction.toLowerCase() ){
			case "left" : 
				x = offset[0] + options.fixDistance + offsetI[0];
				y = offset[1] - options.arrowDistance / 2;
				arrowClass = "arrow arrow_l";
				break;
			case "right" :
				x = offset[0] - offsetJ[0] - options.fixDistance;
				y = offset[1] - options.arrowDistance / 2;
				arrowClass = "arrow arrow_r";
				break;
			case "bottom" : 
					x = offset[0];
					y = offset[1] - offsetJ[1] - options.fixDistance;
					arrowClass = "arrow arrow_bl";
				break;
			case "top" : 
					x = offset[0];
					y = offset[1] + offsetI[1] + options.fixDistance;
					arrowClass = "arrow arrow_tl";
				break;
			default : 
				if(event){
					if(client[1] - offsetJ[1] > 0){
						x = offset[0];
						y = offset[1] - offsetJ[1] - options.fixDistance;
						arrowClass = "arrow arrow_bl";
						if(Math.abs( client[0] - winJ[0] ) < offsetJ[0]){
							x = offset[0] - offsetJ[0] + offsetI[0] / 2 + options.arrowDistance / 2;
							arrowClass = "arrow arrow_br";
						}				
					}else{
						x = offset[0];
						y = offset[1] + offsetI[1] + options.fixDistance;
						arrowClass = "arrow arrow_tl";
						if(Math.abs( client[0] - winJ[0] ) < offsetJ[0]){
							x = offset[0] - offsetJ[0] + offsetI[0] / 2 + options.arrowDistance;
							arrowClass = "arrow arrow_tr";
						}	
					}
				}

		}	
		return [x, y, arrowClass];
	},
	setArrow : function(arrowClass){
		var self = this,
			arrow = self.bd._$node.find(".__arrow");
		arrow.removeClass("arrow arrow_r arrow_l arrow_tl arrow_tr arrow_bl arrow_br").addClass(arrowClass);
	},
	show : function(){
		this.bd.show();	
	},
	hide : function(){
		if(this.timer){
			clearTimeout(this.timer);	
		}
		this.bd.hidd();	
	},
	close : function(){
		this.bd.close();	
	},
	setPosition : function(left, top){
		var self = this,
			options = self.options;
		self.bd.setPosition(left, top);			
	},
	setContent : function(content){
		this.bd.setContent(content);			
	},
	setC : function(elem, callback, event){
		var arr = this._getXYCLASS(elem, event);
		callback.call(this, arr);
	}
});


DFZ.APP.tip = function(options){
	return new DFZ.APP.Tip(options);
}



})(jQuery);



