
window.onload = function() {

	var monitor;

	var outputComment;

	//创建弹幕幕布

	var Screen = creatScreen($("#example_video_1"));

	//上墙部分

	//创建墙

	var waitComment = [];	//	等待队列

	var data = creatWall($("#wall")[0]);

	//为刷子帮上点击事件

	data.brush.on("click", function () {

		clearBool = true;

	});

	//建立老虎机

	var SlotMachine = creatSlotMachine($(".slotMachineContainer")[0]);



	//轮播器部分

	var match = 1;

	var $rotator = $(".displayer .rotator");

	var $left = $(".container .left");

	var $right = $(".container .right");

	var $body = $("body");

	$left.on("click", function () {

		if (match < 1) {

			match = 1;

		} else {

			clearScreen();

			if (match == 2) {

				match = 1;

			} else {

				match = 2;

			}

			choose(match);

		}

	});

	$right.on("click", function () {

		if (match > 3) {

			match = 3;

		} else {

			clearScreen();

			if (match == 2) {

				match = 3;

			} else {

				match = 2;

			}

			choose(match);

		}

	});

	choose(3);




	function clearScreen(){

		slideQueue = [];
		fixQueue = [];
		slideWaitQueue = [];
		fixWaitQueue = [];

		clearInterval(monitor);

		clearInterval(outputComment);

		Screen.children().remove();

		SlotMachine.winning.children().remove();

		$(".vjs-playing").click();

	}

	function choose(match) {

		//清空墙页面

		Screen.children().remove();

		waitComment = [];

		clearBool = true;

		switch (match) {

			case 1:

				$left.css("display", "none").attr("title", "");

				$right.css("display", "block").attr("title", "前往上墙页面");

				$rotator.animate({

					left: "0"

				}, 500, "linear", function () {

					//弹幕队列初始化

					var newLength = parseInt(Screen.height()/40);

					slideQueue.length = newLength;
					fixQueue.length = newLength;

					for (var i = newLength - 1; i >= 0; i--) {

						slideQueue[i] = 1;
						fixQueue[i] = 1;

					};

					//监听视频缩放

					var width = $("#example_video_1").width();
					var height = $("#example_video_1").height();

					monitor = setInterval(function () {

						var newWidth = $("#example_video_1").width();
						var newHeight = $("#example_video_1").height();

						if (width != newWidth || height != newHeight) {

							width = newWidth;
							height = newHeight;

							zoom(Screen);

						}

					}, 50);

					//测试弹幕

					for (var i = 0; i < 10000; i++) {

						// var color = 9;
						var color = Math.ceil(Math.random() * 10);
						// var font_size = 24;
						var font_size = Math.ceil(Math.random() * 4) * 4 + 12;
						// var position = 20;
						var position = Math.ceil(Math.random() * 20);
						// var family = 5;
						var family = Math.ceil(Math.random() * 5);
						var text = "我是";

						switch (color) {
							case 1:
								color = "red";
								text += "红色";
								break;
							case 2:
								color = "blue";
								text += "蓝色";
								break;
							case 3:
								color = "rainbow";
								text += "彩色";
								break;
							case 4:
								color = "flicker";
								text += "变色";
								break;
							case 5:
								color = "green";
								text += "绿色";
								break;
							default :
								color = "";
								break;
						}

						switch (family) {
							case 1:
								family = "楷体";
								text += "楷体";
								break;
							case 2:
								family = "宋体";
								text += "宋体";
								break;
							case 3:
								family = "黑体";
								text += "黑体";
								break;
							default :
								family = "";
								break;
						}

						switch (font_size) {
							case 16:
								text += "特小号";
								break;
							case 20:
								text += "小号";
								break;
							case 24:
								text += "中号";
								break;
							case 28:
								text += "大号";
								break;
							default :
								text += "大号";
								break;
						}

						switch (position) {
							case 1:
								position = "top";
								text += "顶部";
								break;
							case 2:
								position = "bottom";
								text += "底部";
								break;
							default :
								position = null;
								break;
						}

						text += "弹幕";

						slide(Screen, text, {
							"color": color,
							"font_size": font_size,
							"font_family": family,
						}, position);

					};

				});

				break;

			case 2:

				$left.css("display", "block").attr("title", "前往弹幕页面");

				$right.css("display", "block").attr("title", "前往抽奖页面");

				$rotator.animate({

					left: "-980px"

				}, 500, "linear", function () {

					var Array = data.congestionArray;

					//及时输出等待数组中的评论

					outputComment = setInterval(function () {

						outputOnTime(data.wall, waitComment, Array, clearBool);

					}, 1000);

					//模拟测试数据

					setInterval(function () {

						var i = Math.ceil(Math.random() * 20);

						var char = "我要上墙我要上墙我要上墙我要上墙我要上墙";

						var comment = creatComment(data.wall, char.substr(0, i));

						onTheWall(comment.comment, comment.size, Array, waitComment);

					}, 1300);

					setInterval(function () {

						var i = Math.ceil(Math.random() * 20);

						var char = "我要上墙我要上墙我要上墙我要上墙我要上墙";

						var comment = creatComment(data.wall, char.substr(0, i));

						onTheWall(comment.comment, comment.size, Array, waitComment);

					}, 3000);


				});

				break;

			case 3:

				$left.css("display", "block").attr("title", "前往弹幕页面");

				$right.css("display", "none").attr("title", "前往抽奖页面");

				$rotator.animate({

					left: "-1960px"

				}, 500, "linear", function () {

					//参加活动名单

					list = ["grallen", "cindy", "betty", "james", "allen", "cody", "coco", "deff", "green", "iverson"];

					//滚上默认数据

					slotMachine(SlotMachine, 8, list);

				});

				break;

			default :

				break;
		}

	}
}

