; (function ($, window, document, undefined) {
    //定义轮播对象
    var Lunbo = function (ele, opts) {
        this.srcs = opts.src;
        this.ele = ele;
        this.num = 0;
        this.width = 0;
        this.timer;
        this._init();
    }
    Lunbo.prototype = {
        constructor: this,
        _init: function () {
            //获取父节点的长宽，根据此来设置轮播图片的长宽
            this.width = this.ele.width();
            var height = this.ele.height();
            //获取有几张图片
            this.num = this.srcs.length;
            var that = this;
            this.ele.append("<div class='imgWrapper' style='width:" + this.width + "px;height:" + height + "px'><div class='imgContent' style='width:" + (this.width * (this.num + 1)) + "px;height:" + height + "px'></div></div>")
            $(".imgWrapper").append("<div class='imgSmallWrapper' style='width:" + this.width + "px;height:" + height*0.1+ "px;line-height:" + height*0.1 + "px'></div>")
            //将所有传入的图片顺序插入待展示区域
            this.srcs.map(function (src, index) {
                $(".imgContent").append("<img class='imgCls' style='width:" + that.width + "px;height:" + height + "px' src=" + src + " />");
                $(".imgSmallWrapper").append("<div class='imgSmall' style='height:" + height*0.08 + "px' ><img class='imgCls' style='width:" + that.width*0.08 + "px;height:" + height*0.08  + "px;' src=" + src + " /></div>");
                if(index==0){
                    $(".imgSmall").addClass("focusImg");
                }
            });
            //最后多插入一张图片为实现无缝轮播
            $(".imgContent").append("<img class='imgCls' style='width:" + that.width + "px;height:" + height + "px' src=" + this.srcs[0] + " />");
            //添加左右跳转图片
            $(".imgWrapper").append("<div><img class='leftLink' src='./images/left-circle.png'/></div>");
            $(".imgWrapper").append("<div><img class='rightLink' src='./images/right-circle.png'/></div>");
            this.ele.on("click",".imgSmall",this,this._chooseImg);
            //为左箭头图片添加鼠标移进移出、点击事件
            this.ele.on("click mouseover mouseout",".leftLink",this,function(e){
                var that=e.data;
                switch(e.type){
                    case "click":
                    that._prevImg(e);
                          break;
                    case "mouseout":
                    that._hideNav(e);
                          break;
                    case "mouseover":
                    that._showNav(e);
                          break;
                    default:
                        break;
                }
            });
           //为右箭头图片添加鼠标移进移出、点击事件
            this.ele.on("click mouseover mouseout",".rightLink",this,function(e){
                var that=e.data;
                switch(e.type){
                    case "click":
                    that._nextImg(e);
                          break;
                    case "mouseout":
                    that._hideNav(e);
                          break;
                    case "mouseover":
                    that._showNav(e);
                          break;
                    default:
                        break;
                }
            });
            //触发滚动图片事件
            this._srollOnTime();
        },
        //鼠标挪到该位置时出现左右箭头
        _showNav:function(e){
            $(e.target).css({"opacity":"1","cursor":"pointer"});
            clearInterval(e.data.timer);
        },
        //鼠标挪出该位置时隐藏左右箭头
        _hideNav:function(e){
            $(e.target).css("opacity","0");
            e.data.timer=setInterval(e.data._setCircle(e.data), 2000);
        },
        //设置固定时间循环展示
        _srollOnTime: function() {
            var that = this;
            this.timer=setInterval(this._setCircle(that), 2000);
        },
        //轮播图片设置图片的left值
        _setCircle:function(that){
            return function(){
                that._changeImg("normal",that);
            }
        },
        _nextImg:function(e){
            var that=e.data;
            that._changeImg("right",that);
        },
        _prevImg:function(e){
            var that=e.data;
            that._changeImg("left",that);
         },
        _changeImg:function(type,that){
            var margin = $(".imgContent").css("left"),
                newIndex=0;
            //若是正常循环或者前一张则执行下列代码
            if(type==="normal"||type==="right"){
            //判断是否是最后一张，如果是则将left设置为初始值
            if (Math.abs(parseFloat(margin)) > that.width * (that.num - 1)) {
                margin = "0px";
                $(".imgContent").css("left", "0px");
            }
            //当前展示图片次序的相反数
            newIndex=Math.floor((parseFloat(margin))/that.width)-1;
            $(".imgContent").animate({ left: (newIndex* that.width) + "px" });
            newIndex=Math.abs(newIndex);
            //当轮播到最后一张，重新从第一张开始
            if(newIndex===that.num){
                newIndex=0;
            }
        }
        else{
             //判断是否是第一张，如果是则将left设置为最后一张的left值
             if(Math.abs(parseFloat(margin))<that.width){
                margin = -that.width * that.num +"px";
                $(".imgContent").css("left", margin);
            }
            //在图片移动位置之前先将left的值调整至图片宽度的整数倍，防止移动后图片错位
            newIndex=Math.floor((parseFloat(margin))/that.width)+1;
            $(".imgContent").animate({ left: (newIndex* that.width) + "px" });
            newIndex=Math.abs(newIndex);
       
        }
            //当前展示的图片下面缩略图边框变色，其他缩略图去除变色边框
            $(".focusImg").removeClass("focusImg");
            $(".imgSmall").eq(newIndex).addClass("focusImg");
        },
        _chooseImg:function(e){
            clearInterval(e.data.timer);
            var that=e.data;
            //获取点击的是第几张图片
            var index=$(this).index();
            $(".imgContent").animate({ left: -(that.width)*index+ "px" });
            //当前展示的图片下面缩略图边框变色，其他缩略图去除变色边框
            $(".focusImg").removeClass("focusImg");
            $(".imgSmall").eq(index).addClass("focusImg");
            that.timer=setInterval(that._setCircle(that), 2000);
        }
    }
    $.fn.lunbo = function (opts) {
        var lun = new Lunbo(this, opts);
    }
})(jQuery, window, document)