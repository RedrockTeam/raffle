/**
 * Created by grallen on 2015/2/21.
 */


window.onload = function() {

    var data = creatWall($(".container")[0]);

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

};