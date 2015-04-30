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






/**
 * 图片预加载
 */
var imagesPreloadArray = new Array();
function preload() {
	for (var i = 0; i < preload.arguments.length; i++) {
		imagesPreloadArray[i] = new Image();
		imagesPreloadArray[i].src = preload.arguments[i];
	}
}

preload(
	"http://domain.tld/gallery/image-001.jpg",
	"http://domain.tld/gallery/image-002.jpg",
	"http://domain.tld/gallery/image-003.jpg"
)