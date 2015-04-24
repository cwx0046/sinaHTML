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