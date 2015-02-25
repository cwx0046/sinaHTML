var dataForWeixin={
 
   appId: "",
 
   MsgImg: "http://makaprojects.oss-cn-hangzhou.aliyuncs.com/sinashanxi/wxlogo.jpg",
 
   TLImg: "http://makaprojects.oss-cn-hangzhou.aliyuncs.com/sinashanxi/wxlogo.jpg",
 
   url: "http://www.grameenvision.org/maka/project/sinashanxi",
 
   title: "山西微博营销大会邀请函",
 
   desc: "2014年5月22日\n山西·太原",
 
   fakeid: "",
 
   callback:function(){}
 
};
 
(function(){

    var onBridgeReady = function() {

        WeixinJSBridge.on('menu:share:appmessage', function(argv) {

            WeixinJSBridge.invoke('sendAppMessage', {

                "appid": dataForWeixin.appId, 

                "img_url": dataForWeixin.MsgImg, 

                "img_width": "120", 

                "img_height": "120", 

                "link": dataForWeixin.url, 

                "desc": dataForWeixin.desc, 

                "title": dataForWeixin.title

            }, function(res) {
                (dataForWeixin.callback)();
            });
        });

        WeixinJSBridge.on('menu:share:timeline', function(argv) {

            (dataForWeixin.callback)();

            WeixinJSBridge.invoke('shareTimeline',{

                "img_url": dataForWeixin.TLImg, 

                "img_width": "120", 

                "img_height": "120", 

                "link": dataForWeixin.url, 

                "desc": dataForWeixin.desc, 

                "title": dataForWeixin.title

            }, function(res) {
            });
        });

        WeixinJSBridge.on('menu:share:weibo', function(argv) {

            WeixinJSBridge.invoke('shareWeibo',{

                "content": dataForWeixin.title, 

                "url": dataForWeixin.url

            }, function(res){
                (dataForWeixin.callback)();
            });
        });

        WeixinJSBridge.on('menu:share:facebook', function(argv) {

            (dataForWeixin.callback)();

            WeixinJSBridge.invoke('shareFB', {

                "img_url": dataForWeixin.TLImg, 

                "img_width": "120", 

                "img_height": "120", 

                "link": dataForWeixin.url, 

                "desc": dataForWeixin.desc, 

                "title": dataForWeixin.title

            }, function(res) {
            });
        });
    };
 
    if (document.addEventListener) {

        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
     
    } else if (document.attachEvent) {

        document.attachEvent('WeixinJSBridgeReady'   , onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady' , onBridgeReady);
    }
})();