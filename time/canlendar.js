; (function ($, window, document, undefined) {
	//定义日历的构造函数
	var Canlendar = function (ele, opt) {
		var date=new Date();
		this.dayArr=["日","一","二","三","四","五","六"];
		this.year=date.getFullYear();
		this.month=date.getMonth();
		this.currentDate=date.getDate();
		this.day=date.getDay();
		this._init(ele);
		this.tag="date";
		this.initEle="";
	}
	//定义日历的方法
	Canlendar.prototype = {
		constructor: this,
		_init: function (ele) {
			var that=this;
			var datecurrentmonth=that._dateComputed(that.year,that.currentDate,that.day);
			//获取绑定元素的偏移位置
			var Y = $(ele).offset().top + $(ele).outerHeight();
			var X = $(ele).offset().left;
			//给绑定插件的元素添加focus事件，input框focus时日历插件出现
			$(ele).bind("focus",{X:X,Y:Y,year:that.year,month:that.month,current:datecurrentmonth,that:this},that._bindShowDate);
			that._bindfunction(ele);
			//点击空余地方移除日历
			$("body").on("click",".canlendar",function (e) {
				e.stopPropagation();
			});
			$(ele).click(function (e) {
				e.stopPropagation();
			});
			$("body").bind("click", function () {
				that.tag="date";
				$(".canlendar").remove();
			})
		},
		//当前界面添加日历元素
		_bindShowDate:function(event){
			$("#canlendar").remove();
			var data=event.data;
			var appendEle =
			 "<div class='canlendar' id='canlendar' style='top:" + data.Y + "px;left:" + data.X + "px'>"+
			 "<div class='c_top'><div class='previmg'></div>"+
			 "<div class='c_year'>"+data.year+"年"+(++data.month)+"月</div>"+
			 "<div class='nextimg'></div>"+
			 "</div>";
			var dateAppend="<div class='c_bottom'>"+data.current+"</div></div>";
			appendEle+=dateAppend;
			//添加日历元素
			$("body").append($(appendEle).hide().fadeIn(500));
		},
		//显示该月所有日期
		_dateReturn:function(X,Y,year,month,datecurrentmonth){
				//首先清空本来日历框中的显示内容
					var dateAppend="<div class='c_bottom'>"+datecurrentmonth+"</div></div>";
					return dateAppend;
		},
		//返回一个月的日期显示
		_dateComputed:function(year,date,day){
			//计算当前月份1号对应周几
			var startPosition=date/7>1?(7-(date-day-1)%7):day;
			var daynum=[31,28,31,30,31,30,31,31,30,31,30,31];
			daynum[1]=this._isLeapYear(year)?29:28;
			var currentmonth=this.month;
			var prevmonth=currentmonth==0?12:(currentmonth-1);
			var startdate=daynum[prevmonth]-startPosition+1;
			//计算当前月份天数对应日历中几行
			var row=Math.ceil((daynum[currentmonth]-7+startPosition)/7)+1;
			var dateDisplay="<ul class='weektitle'>";
			this.dayArr.map(function(day,index){
				dateDisplay+="<li>"+day+"</li>";
			})
			dateDisplay+="</ul>";
			//添加上月最后几天日期
			var sD=startdate;
			dateDisplay+="<ul class='weekday'>";
			while(sD<=daynum[prevmonth]){
				dateDisplay+="<li style='color:#b1b1bd'>"+sD+"</li>";
				sD++;
			}
			var datenum=1;
			//添加第一行的日期
			var sP=startPosition;
			while(sP<7){
				dateDisplay+="<li class='datevalid'>"+datenum+"</li>";
				datenum++;
				sP++;
			}
			dateDisplay+="</ul>"
			//中间几行的日期
			for(var i=1;i<row-1;i++){
				dateDisplay+="<ul class='weekday'>";
				for(var j=0;j<7;j++){
					dateDisplay+="<li class='datevalid'>"+datenum+"</li>";
					datenum++;
				}
				dateDisplay+="</ul>";
			}
			//最后一行
			dateDisplay+="<ul class='weekday'>";
			//保存最后一行当前月份截止日期到哪天
			var n=0;
			while(datenum<=daynum[currentmonth]){
				dateDisplay+="<li class='datevalid'>"+datenum+"</li>";
				datenum++;
				n++;
			}
			//开始保存下个月的前几天
			var num=0;
			while(n<7){
				num++;
				dateDisplay+="<li style='color:#b1b1bd'>"+num+"</li>";
				n++;
			}
			dateDisplay+="</ul>";
			this.initEle=dateDisplay;
			return dateDisplay;
		},
		_bindfunction:function(ele){
			//点击具体日期显示
			$("body").on("click",".datevalid",{that:this,ele:ele},this._showDate); 
			$("body").on("click",".c_year",{that:this},this._changeSelectClick);              //从日期选择调到年份选择
			$("body").on("click",".dateboxli",{that:this},this._selectYear);                //点击某一年跳到月份选择
			$("body").on("click",".monthboxli",{that:this},this._selectMonth);                          //点击某一月份调到对应月份
		},
		//点击切换更换年份选择
		_changeSelectClick:function(event){
			var that=event.data.that;
			that.tag=that.tag=="date"?"year":"date";
			if(that.tag==="year"){
			$(".c_year").text("2010-2019");
			$(".c_bottom").empty();
			var bottomyear="<ul class='dateboxul'><li class='dateli'>2009</li>"+
			"<li class='dateboxli'>2010</li><li class='dateboxli'>2011</li><li class='dateboxli'>2012</li></ul><ul class='dateboxul'>";
			var y=2013;
				for(var j=0;j<4;j++){
					bottomyear+="<li class='dateboxli'>"+(y++)+"</li>";
				}
				bottomyear+="</ul><ul class='dateboxul'><li class='dateboxli'>2017</li>"+
				"<li class='dateboxli'>2018</li><li class='dateboxli'>2019</li><li class='dateli'>2020</li></ul>";
				$(".c_bottom").html(bottomyear);
			}
			else{
			$(".c_year").text(that.year+"年"+that.month+"月");	
			$(".c_bottom").empty();			
			$(".c_bottom").append(that.initEle);
			}
		},
		//选中改变的年份
		_selectYear:function(event){
			$(".c_year").text($(this).text());
			$(".c_bottom").empty();
			var n=1;
			var bottomyear="";
			for(var j=0;j<3;j++){
				bottomyear+="<ul class='monthboxul'>";
			   for(var i=0;i<4;i++){
				bottomyear+="<li class='monthboxli'>"+(n++)+"</li>";
			}
			bottomyear+="</ul>";
		}
		$(".c_bottom").html(bottomyear);
		},
		//选择相应月份
		_selectMonth:function(event){
			var that=event.data.that;
			that.tag="date";
			var selyear=$(".c_year").text();
			var selmonth=$(this).text();
			that.year=selyear;
			that.month=selmonth;
			var date=selmonth+"-01";
			var day=(new Date(Date.parse((selyear+"-"+date).replace(/-/g, '/')))).getDay();
			var newDateFolumn=that._dateComputed(selyear,"01",day);
			that._dateReturn(0,0,selyear,selmonth,newDateFolumn);
			$(".c_year").html(selyear+"年"+selmonth+"月");
			$(".c_bottom").html(newDateFolumn);
		},
		//判断是否是闰年
		_isLeapYear:function(year){
			var leap=year%4===0?true:false;
			return leap;
		},
		//显示选中的日期
		_showDate:function(event){
			var selday=$(this).text();
			var that=event.data.that;
			var seldate=that.year+"-"+that.month+"-"+selday;
			$(event.data.ele).val(seldate);
			console.log(event.data.ele);
			$(".canlendar").remove();
		}
	}

	//在插件中使用日历对象
	$.fn.myCanlendar = function (options) {
		//创建日历的实体
		var can = new Canlendar(this, options);
	}
})(jQuery, window, document);