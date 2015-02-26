
window.onload = function(){

	//轮播器部分

	var $rotator = $(".rotator");

	$(".left").on("click",function(){

		$rotator.css("")

	});



	//弹幕部分

	//创建弹幕幕布

	var Screen = creatScreen($("#example_video_1"));

	//视频缩放触发

	var width = $("#example_video_1").width();
	var height = $("#example_video_1").height();

	setInterval(function(){

		var newWidth = $("#example_video_1").width();
		var newHeight = $("#example_video_1").height();

		if(width != newWidth || height != newHeight){

			width = newWidth;
			height = newHeight;

			zoom(Screen);

		}

	},50);


	//上墙部分

	var data = creatWall($("#wall")[0]);

	var Array = data.congestionArray;

	var waitComment = [];            //等待队列

	//及时输出等待数组中的评论

	setInterval(function(){

		outputOnTime(data.wall,waitComment,Array,clearBool);

	},1000);

	//为刷子帮上点击事件

	data.brush.on("click",function(){

		clearBool = true;

	});


	//老虎机部分

	//参加活动名单

	list  = ["grallen","cindy","betty","james","allen","cody","coco","deff","green","iverson"];

	//建立老虎机

	var SlotMachine = creatSlotMachine($(".slotMachineContainer")[0]);

	//滚上默认数据

	slotMachine(SlotMachine,8,list);



















	//模拟测试数据

	setInterval(function(){

		var i = Math.ceil(Math.random()*20);

		var char = "我要上墙我要上墙我要上墙我要上墙我要上墙";

		var comment = creatComment(data.wall,char.substr(0,i));

		onTheWall(comment.comment,comment.size,Array,waitComment);

	},1300);

	setInterval(function(){

		var i = Math.ceil(Math.random()*20);

		var char = "我要上墙我要上墙我要上墙我要上墙我要上墙";

		var comment = creatComment(data.wall,char.substr(0,i));

		onTheWall(comment.comment,comment.size,Array,waitComment);

	},3000);





	//测试弹幕

	for (var i = 0; i < 10000; i++) {

		// var color = 9;
		var color = Math.ceil(Math.random()*10);
		// var font_size = 24;
		var font_size = Math.ceil(Math.random()*4)*4+12;
		// var position = 20;
		var position = Math.ceil(Math.random()*20);
		// var family = 5;
		var family = Math.ceil(Math.random()*5);
		var text = "我是";

		switch (color) {
			case 1:
				color = "red";text += "红色";break;
			case 2:
				color = "blue";text += "蓝色";break;
			case 3:
				color = "rainbow";text += "彩色";break;
			case 4:
				color = "flicker";text += "变色";break;
			case 5:
				color = "green";text += "绿色";break;
			default :
				color = "";break;
		}

		switch (family) {
			case 1:
				family = "楷体";text += "楷体";break;
			case 2:
				family = "宋体";text += "宋体";break;
			case 3:
				family = "黑体";text += "黑体";break;
			default :
				family = "";break;
		}

		switch (font_size) {
			case 16:
				text += "特小号";break;
			case 20:
				text += "小号";break;
			case 24:
				text += "中号";break;
			case 28:
				text += "大号";break;
			default :
				text += "大号";break;
		}

		switch (position) {
			case 1:
				position = "top";text += "顶部";break;
			case 2:
				position = "bottom";text += "底部";break;
			default :
				position = null;break;
		}

		text += "弹幕";

		slide(Screen,text,{
			"color":color,
			"font_size":font_size,
			"font_family":family,
		},position);

	};

}




