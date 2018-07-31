;(function(){
	"use strict"
	//var _global;

	var Canlendar=function(){
		this._init();
		var num=1;
	};
	Canlendar.prototype={
		constructor:this,
		_init:function(){
			var def={
				num:1,
				num1:2
			}
			console.log(def.num);
		}
	}
    
    window.Canlendar=Canlendar;
   /*_global = (function(){ return this || (0, eval)('this'); }());
   //判断运行环境，将对象暴露到全局环境中
    if (typeof module !== "undefined" && module.exports) {
        module.exports = Canlendar;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return Canlendar;});
    } else {
        !('Canlendar' in _global) && (_global.Canlendar = Canlendar);
    }*/
})();