/**
 * Created by grallen on 2015/2/21.
 */


//抽奖函数库

//参加活动的名单

var list;

//抽奖函数

function drawARaffle(obj){

    $($(".winning p")[4]).css("color","#000");

    //动画开始移除按钮点击事件

    $(obj.button).unbind("click").css("cursor","default");

    //中奖对象 编号

    var winnerNum = Math.ceil(Math.random()*1000)+100;

    slotMachine(obj,winnerNum);

}

//老虎机函数

function slotMachine(obj,winnerNum){

    //判断动画是否应该结束

    if(winnerNum > 0){

        //该动画时间

        var time = 1000/winnerNum;

        //候选人名单

        var candidate;

        //线

        var line;

        //获取新的候选人姓名

        var newCandidate = list.shift();

        list.push(newCandidate);

        //添加线

        $("<div>",{

            css:{

                "top": "-35px"

            },

            "class":"line"

        }).appendTo($(obj.winning));

        //添加新的候选人

        $("<p>",{

            css:{

                "top": "-70px",
                "color": "#000",
                "transform": "rotateX(60deg)"

            },

            "num":0,

            html:newCandidate

        }).appendTo($(obj.winning));

        //获取候选人

        candidate = $(obj.winning).children("p");

        //获取线

        line = $(obj.winning).children("div");

        //开始滚动

        for(var i = candidate.length - 1; i >= 0;i-- ) {

            //目标属性

            var topPX,lineTopPX,transformDEG;

            //当前节点

            var p = $(candidate[i]);

            //当前线

            var liner = $(line[i]);

            //当前节点的编号

            var num = parseInt(p.attr("num"));

            //删除多余节点

            if(num > 7){

                setTimeout(function(){

                    p.remove();

                    liner.remove();

                },50);

                break;

            }

            //设定动画css属性

            switch (num){
                case 0:
                    topPX = "-20px";lineTopPX="10px";transformDEG = 60;break;
                case 1:
                    topPX = "34px";lineTopPX="72px";transformDEG = 45;break;
                case 2:
                    topPX = "95px";lineTopPX="141px";transformDEG = 30;break;
                case 3:
                    topPX = "160px";lineTopPX="203px";transformDEG = 15;break;
                case 4:
                    topPX = "225px";lineTopPX="271px";transformDEG = 0;break;
                case 5:
                    topPX = "286px";lineTopPX="332px";transformDEG = -15;break;
                case 6:
                    topPX = "340px";lineTopPX="384px";transformDEG = -30;break;
                default :
                    topPX = "390px";lineTopPX="434px";transformDEG = -45;break;
            }

            //当前节点的编号更新

            p.attr("num",++num);

            //开始滚动

            animateTransform (p,transformDEG,time);

            p.animate({

                top:topPX

            },time,"linear");

            liner.animate({

                top:lineTopPX

            },time,"linear");

        }

        //选中框 动画

        //var v = 600;
        //
        //if(winnerNum > 0){
        //
        //    var t = ((52-((v*0.2)/(winnerNum+1)))/(65*winnerNum+v));
        //
        //    $(obj.frame).animate({
        //
        //        top:(t*65*winnerNum+250)+"px"
        //
        //    },t*1000,"linear",function(){
        //
        //        $(obj.frame).animate({
        //
        //            top:"302px"
        //
        //        },(time*0.9-t*1000),"linear",function(){
        //
        //            $(obj.frame).animate({
        //
        //                top:(302-v*time*0.0001)+"px"
        //
        //            },(time*0.1),"linear");
        //
        //        });
        //
        //    });
        //
        //}else{
        //
        //    var t = ((52-((v*0.2)/(winnerNum+1)))/(65*winnerNum+v));
        //
        //    $(obj.frame).animate({
        //
        //        top:(t*65*winnerNum+250)+"px"
        //
        //    },t*1000,"linear",function(){
        //
        //        $(obj.frame).animate({
        //
        //            top:"302px"
        //
        //        },(time*0.8-t*1000),"linear",function(){
        //
        //            $(obj.frame).animate({
        //
        //                top:"250px"
        //
        //            },(52/v)*1000,"linear")
        //
        //        });
        //
        //    });
        //
        //}

        //该动画执行完成 执行下一个动画

        setTimeout(function(){

            //计数器减一

            winnerNum--;

            //再次执行

            slotMachine(obj,winnerNum)

        },time);

    }else{

        //动画执行完毕

        //给中奖人添加css

        setTimeout(function(){

            $($(".winning p")[4]).css("color","#fff");

        },400);

        // 给按钮绑定点击事件

        $(obj.button).on("click",function(){

            animateButton($(obj.button));

            drawARaffle(obj);

        }).css("cursor","pointer");

    }

}

//建立老虎机

function creatSlotMachine (obj){

    var slotMachine;    //老虎机

    var winning;        //获奖区域

    var frame;          //中奖框

    var button;         //开始按钮

    (function (){

        //老虎机

        slotMachine = $("<div>",{

            "class":"slotMachine",

        }).appendTo(obj);

        //获奖区域

        winning = $("<div>",{

            "class":"winning",

        }).appendTo(slotMachine);

        //中奖框

        frame = $("<div>",{

            "class":"frame",

        }).appendTo(slotMachine);

        //中奖框

        button = $("<img>",{

            "class":"button",

            "src" : "img/button.png",

        }).appendTo(slotMachine);

    })();

    var returnData = {};

    returnData.slotMachine = slotMachine;

    returnData.winning = winning;

    returnData.frame = frame;

    returnData.button = button;

    return returnData;

}

//3D旋转动画 每次调用旋转15度 (一次性函数) 5帧

function animateTransform (obj,rotateX,time) {

    if(time < 50){

        rotateX += 15 ;

        obj.css("transform","rotateX("+rotateX+"deg)");

    }else{

        var frameNum = time*0.02;

        var eachRotateX = 15/frameNum;

        animateTransformFrame(obj,rotateX,rotateX,eachRotateX,frameNum);

    }

}

function animateTransformFrame (obj,rotateX,original,each,num){

    if(num > 1){

        original -= each;

        var color = Math.ceil((60-Math.abs(original))/0.9);

        obj.css("transform","rotateX("+original+"deg)").css("color","rgb("+color+","+color+","+color+")");

        num--;

        setTimeout(function(){

            animateTransformFrame (obj,rotateX,original,each,num);

        },50);

    }else{

        rotateX -= 15;

        var color = Math.ceil((60-Math.abs(original))/0.9);

        obj.css("transform","rotateX("+rotateX+"deg)").css("color","rgb("+color+","+color+","+color+")");

    }

}

//按钮动画效果

function animateButton (obj){

    obj.animate({

        top:"254px"

    },250,"linear",function(){

        obj.animate({

            top:"207px"

        },800,"linear");

    });

}



