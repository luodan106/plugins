; (function($,window,document,undefined){
    //瀑布流初始化
    function Waterfall(){
        this.arr=[0,0,0,0,0];           //存储各列的高度
        this.a=0;
        this.newwidth=0;
        this._init();     
    }
    //添加瀑布流中用到的方法
    Waterfall.prototype={
        constructor:this,
        _init:function(){
            var that=this;
            that.arr=[];
            //获取当前文档元素宽度
            var wwidth=document.documentElement.clientWidth,
                imagewidth=Math.floor(wwidth*3/20);           //3/4的宽度用来自适应显示5张图片
                $("img").each(function(index,image){
                var realwidth=this.width;                  //获取图片原本的宽度
                var realheight=this.height;                //获取图片原本的高度
                that.newwidth=imagewidth;                   //图片显示的宽度
                var newheight=(that.newwidth/realwidth)*realheight;     //计算图片要展示的高度
                $(this).height(newheight+"px");
                $(this).width(that.newwidth+"px");
                //第一行按顺序放置5张图片
                if(index<5){
                    //数组初始为第一行图片的高度
                    that.arr[index]=newheight;               
                    $(this.parentNode).width(that.newwidth+"px").css({"left":that.newwidth*index+"px",top:0});
                }else{
                    //获取数组中的最小高度，将下一张图片展示在相应行
                    var min=Math.min.apply(Math,that.arr);               
                    var n=that.arr.indexOf(min);
                    $(this.parentNode).width(that.newwidth+"px").css({"left":that.newwidth*n+"px",top:that.arr[n]});
                    that.arr[n]+=newheight;
                }
                })
                $(window).on('scroll',that,this._scrollEvent);
        },
        //当页面滚动时触发，判断是否继续加载新的图片
        _scrollEvent:function(event){
            var min=Math.min.apply(Math,event.data.arr);
            //获取当前滚动到离顶部的距离
            var top = $(this).scrollTop()+$(this).height();
            //若是到顶部距离大于最小的高度，则继续加载图片
            if(top>min){
                $("<img/>").attr("src","./images/"+imageNames[0]+".jpg").on("load",function(){
                    var realwidth=this.width;                  //获取图片原本的宽度
                    var realheight=this.height;                //获取图片原本的高度
                    var newwidth=event.data.newwidth;                   //图片显示的宽度
                    var newheight=(newwidth/realwidth)*realheight;     //计算图片原本的高度
                    $(this).height(newheight+"px");
                    $(this).width(newwidth+"px");          
                    var n=event.data.arr.indexOf(min);
                    console.log(realwidth);
                    $("#main").append("<div class='imagediv' style='width:"+event.data.newwidth+"px;left:"+(event.data.newwidth*n)+"px;top:"+min+"px'><img src='./images/"+imageNames[1]+".jpg' style='width:"+newwidth+"px;height:"+newheight+"px'/></div>");
                    event.data.arr[n]+=newheight;
                })
            }
        }
    }
    $.waterfall=function(){
        var wf=new Waterfall();
    }
})(jQuery,window,document);