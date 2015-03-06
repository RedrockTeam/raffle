/**
 * Created by Administrator on 2015/2/26.
 */

//弹幕部分 函数库

var w = $(window);

//弹幕函数库

//弹幕数量

var slideNum;

//弹幕队列初始化

var slideQueue,fixQueue;

//弹幕进行中队列

var UnderwayQueue;

//等待队列初始化

var slideWaitQueue,fixWaitQueue;

//弹幕函数

function slide (obj,text,textStyle,slideStyle){

    var heightNum = 0;																				                        //弹幕进入的队列号
    var Queue = slideStyle == "top" || slideStyle == "bottom" ? fixQueue : slideQueue;				                        //判断进入队列
    var WaitQueue = slideStyle == "top" || slideStyle == "bottom" ? fixWaitQueue : slideWaitQueue;	                        //判断等待队列
    var len = Queue.length;																			                        //队列长度
    var data = {};                                                                                                          //弹幕数据

    data.obj = obj;
    data.text = text;
    data.textStyle = textStyle;
    data.slideStyle = slideStyle;


    //弹幕队列判断

    if (slideStyle == "bottom") {

        for ( heightNum = len ; heightNum >=0 ; heightNum--) {

            if(Queue[heightNum] == 1){

                Queue[heightNum] = 0;

                break;
            }

        };

    }else{

        for ( ; heightNum <= len ; heightNum++) {

            if(Queue[heightNum] == 1){

                Queue[heightNum] = 0;

                break;
            }

        };

    };

    //判断当前队列是否已满

    if(heightNum < len && heightNum >= 0){

        //弹幕信息记录进入行进队列

        UnderwayQueue[slideNum] = data;

        //发射弹幕

        //默认参数设置

        textStyle = arguments[2] ? arguments[2] : {};
        slideStyle = arguments[3] ? arguments[3] : "slide";

        //弹幕初始化

        var dom = $("<div>",{

            "class":"barrage",

            "slideNum":slideNum,                        //弹幕编号

            css:{

                "top": heightNum*40+"px",				//弹幕高度

            },

            //添加弹幕文本

            html:text,

        }).appendTo(obj);								//添加弹幕至浏览器中

        //弹幕编号加一

        slideNum++ ;

        //弹幕颜色判断

        textColor(dom,textStyle.color);

        var width = dom.width();						//弹幕长度判断

        //弹幕类型判断

        if( slideStyle == "slide"){

            //滑动弹幕

            var banTime = (width+400)/(obj.width()+width)*12000;				//占用队列时间

            //队列占用中

            setTimeout(function(){

                //判断该队列是否被删除

                if (Queue[heightNum] != undefined) {

                    //空出队列

                    Queue[heightNum] = 1;

                    //判断等待队列中是否还有等待弹幕

                    var returnObj = WaitQueue.shift();

                    if(returnObj){

                        //有等待弹幕，进入下一条弹幕

                        slide (returnObj.obj,returnObj.text,returnObj.textStyle,returnObj.slideStyle);

                    }

                }

            },banTime);

            //滑动弹幕发射

            dom.css("left",obj.width()).css("transform","translateX("+parseInt(-obj.width()-width)+"px)");

            //弹幕结束，删除结点

            setTimeout(function(){

                dom.remove();

            },12000);

        }else{

            //固定弹幕发射准备

            dom.addClass("fixBarrage");

            //固定弹幕显示3000ms

            setTimeout(function(){

                //弹幕结束，删除结点

                dom.remove();

                //删除行进队列中数据

                delete UnderwayQueue[dom.attr("slideNum")];

                setTimeout(function(){

                    //判断改队列是否被删除

                    if (Queue[heightNum] != undefined) {

                        //空出队列

                        Queue[heightNum] = 1;

                        //判断等待队列中是否还有等待弹幕

                        var returnObj = WaitQueue.shift();

                        if(returnObj){

                            //有等待弹幕，进入下一条弹幕

                            slide (returnObj.obj,returnObj.text,returnObj.textStyle,returnObj.slideStyle);

                        }

                    };

                },500);

            },5000);

        }


    }else{

        //队列已满，进入等待队列

        //添加至等待队列

        WaitQueue.push(data);

    }

}

//弹幕幕布函数 参数为弹幕建立的父节点

function creatScreen(obj){

    //弹幕数量

    slideNum = 0;

    //弹幕队列初始化

    slideQueue = [],fixQueue = [];

    //弹幕进行中队列

    UnderwayQueue = {};

    //等待队列初始化

    slideWaitQueue = [],fixWaitQueue = [];

    var Screen;//弹幕容器

    (function barrage(){

        //弹幕容器

        Screen = $("<div>",{

            "class":"Screen",

            css:{

                "width": obj.width(),
                "height": obj.height()-50,
                "position": "relative",
                "overflow": "hidden",
                "cursor" : "default",

            },

        }).appendTo(obj);

        //对弹幕容器添加绑定时间

        $(".Screen").on("dblclick",function(){

            $(".vjs-fullscreen-control").click();

        }).on("click",function(){

            $(".vjs-play-control").click();

        });

    })();

    return Screen;

}
//设置弹幕颜色函数

function textColor (obj,color){

    switch (color){

        //变色型弹幕

        case "flicker":

            flicker(obj);

            break;

        //彩虹型弹幕

        case "rainbow":

            rainbow(obj);

            break;

        //普通弹幕

        default :

            obj.css("color",color);

            break;

    }

}

//变色型弹幕设置

function flicker(obj){

    var txt = obj.html();								//弹幕内容
    var len = txt.length;								//弹幕字数
    var text = "<span>";								//新弹幕HTML

    //弹幕重整

    for (var i = 0; i < len; i++) {

        text += txt[i]+"</span><span>"

    };

    text += "</span>"

    //默认设置

    obj.html(text).css("font-weight","blod");

    //变色效果

    var span = obj.children("span");

    flickering(span);

}

//变色函数设置

function flickering(obj){

    //弹幕变色函数

    for (var i = obj.length - 1; i >= 0; i--) {

        var color = '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);

        $(obj[i]).css("color",color);

    };

    //判断该弹幕是否已经完成

    var parent = obj.parent();

    setTimeout(function(){

        //未完成，继续变色

        if( parseFloat(parent.css("left")) > -parent.width()){

            flickering(obj);

        }

    },500);

}

//彩虹弹幕设置

function rainbow(obj){

    obj.addClass("rainbow");

}

//视频缩放触发函数

function zoom(obj){

    var par = obj.parent();

    //删除所有弹幕

    $(".Screen").children().remove();

    //重新加载行进中的弹幕

    $.each(UnderwayQueue,function(n,value) {

        slide(Screen,value.text,value.textStyle,value.position);

    });

    //改变幕布大小
    obj.width(par.width());
    obj.height(par.height()-50);

    //改变弹幕队列长度

    var oldLength = fixQueue.length;
    var newLength = parseInt(obj.height()/40);

    //设置新的队列长度

    slideQueue.length = newLength;
    fixQueue.length = newLength;

    if(oldLength < newLength){

        //新的队列元素初始化

        for (var i = newLength - 1; i >= oldLength; i--) {

            slideQueue[i] = 1;
            fixQueue[i] = 1;

        };

        //将滑动等待队列中的弹幕调出

        for (var i = oldLength ; i < newLength; i++) {

            var returnObj = slideWaitQueue.shift();

            if(returnObj){

                //有等待弹幕，进入下一条弹幕

                slide (returnObj.obj,returnObj.text,returnObj.textStyle,returnObj.slideStyle);

            }else{

                //无等待弹幕

                break;

            }

        };

        //将固定等待队列中的弹幕调出

        for (var i = oldLength ; i < newLength; i++) {

            var returnObj = fixWaitQueue.shift();

            if(returnObj){

                //有等待弹幕，进入下一条弹幕

                slide (returnObj.obj,returnObj.text,returnObj.textStyle,returnObj.slideStyle);

            }else{

                //无等待弹幕

                break;

            }

        };

    }

}


//上墙部分 函数库

/**
 * Created by grallen on 2015/2/21.
 */

//建立评论

function creatComment(obj,text,logo){

    var logo = logo ? logo : "img/logo.jpg";            //设置默认头像

    var size;                                           //评论占用空间

    //评论

    var comment = $("<div>",{

        css:{

            "top": 0,
            "left": 0,
            "display": "none"

        },

        "class":"comment"

    }).appendTo(obj);

    $("<img>",{

        "src" : logo

    }).appendTo(comment);

    var textLen = text.length < 20 ? text.length : 20;      //最大长度限制

    if(textLen > 10){

        $("<p>",{

            "class" : "long",

            text : text.substr(0,textLen/2+2)

        }).appendTo(comment);

        $("<br/>",{

        }).appendTo(comment);

        if(textLen == 20){

            $("<p>",{

                "class" : "long",

                text : text.substr(textLen/2+2,textLen/2-2)+"..."

            }).appendTo(comment);

        }else{

            $("<p>",{

                "class" : "long",

                text : text.substr(textLen/2+2,textLen/2-2)

            }).appendTo(comment);

        }

    }else{

        $("<p>",{

            "class" : "",

            text : text

        }).appendTo(comment);

    }

    size = Math.ceil(parseInt(comment.css("width"))/40)+1;

    var returnData = {};

    returnData.comment = comment;

    returnData.size = size;

    return returnData;

}

//上墙函数

function onTheWall(obj,len,array,waitArray){

    if(waitArray.length == 0 && arrangeComment(obj,len,array)){

    }else{

        var data = {};

        data.obj = obj;

        data.len = len;

        data.array = array;

        data.waitArray = waitArray;

        waitArray.push(data);

    }

}

//清空评论

var clearBool = false;

function clear(container,array,wait){

    var wallHeight = array.length;

    var wallWidth = array[0].length;

    var obj = container.children(".comment");

    for(var i = 0,len = obj.length; i < len; i++){

        if($(obj[i]).css("display") == "block"){

            $(obj[i]).addClass("disappear");

        }

    };

    for(var i = 0; i < wallHeight; i++){

        for(var m = 0; m < wallWidth; m++){

            array[i][m] = 1;

        }

    }

    setTimeout(function(){

        container.children(".disappear").remove().attr("exist","none");

        output(array,wait);

    },950);

    clearBool = false;

}

//删除某一条评论

function delectComment (obj,array,wait){

    var len = parseInt(obj.attr("len"));

    var y = parseInt(obj.attr("top"));

    var x = parseInt(obj.attr("left"));

    obj.addClass("disappear");

    for(var i = 0;i < len;i++){

        array[y][x+i] = 1;

    }

    setTimeout(function(){

        obj.remove().attr("exist","none");

        output(array,wait);

    },950);

}

//实时输出等待队列中的评论

function outputOnTime(container,wait,array){

    if(clearBool){

        clear(container,array,wait);

    }else{

        if(wait.length != 0){

            var obj;

            if(wait.length > 15) {

                clear(container,array,wait);

            }else{

                obj = $(container.children(".comment")[0]);

                delectComment (obj,array,wait);

                obj = $(container.children(".comment")[1]);

                delectComment (obj,array,wait);

                obj = $(container.children(".comment")[2]);

                delectComment (obj,array,wait);

            }

        }

    }

}

//输出等待队列中评论

function output(array,waitComment){

    if(waitComment.length > 0 && selection (array,waitComment[0].len)){

        var data = waitComment.shift();

        arrangeComment(data.obj,data.len,array);

        output(array,waitComment);

    }

}

//评论定位函数

function arrangeComment(obj,len,array){

    var selectionArray = selection(array,len);

    if(selectionArray){

        obj.css("top",selectionArray.y*90+50).css("left",selectionArray.x*40+70-20*(selectionArray.y - Math.floor(selectionArray.y/2)*2)).css("display","block");

        obj.attr("len",len).attr("top",selectionArray.y).attr("left",selectionArray.x);

        for(var i = 0;i < len;i++){

            array[selectionArray.y][selectionArray.x+i] = 0;

        }

        setTimeout(function(){

            if(obj.attr("exist") != "none"){

                obj.addClass("disappear");

                setTimeout(function(){

                    var len = parseInt(obj.attr("len"));

                    var y = parseInt(obj.attr("top"));

                    var x = parseInt(obj.attr("left"));

                    obj.remove().attr("exist","none");

                    for(var i = 0;i < len;i++){

                        array[y][x+i] = 1;

                    }

                },950);

            }

        },15000);

        return true;

    }else{

        return false;

    }

}

//随机产生一个可用区域

function selection (array,len){

    var usableArea = [];        //可用区域

    var blankSpace;             //空白区域长度

    var returnObj = {};         //返回的可用区域

    for(var i = 0,arrayHeight = array.length; i < arrayHeight; i++){

        blankSpace = 0;

        for(var m = array[i].length - 1; m >= 0; m--){

            if(array[i][m] == 1){

                blankSpace++;

            }else{

                blankSpace = 0;
            };

            if(blankSpace >= len){

                var data = {};

                data.x = m;

                data.y = i;

                usableArea.push(data);

            };

        };

    };

    if(usableArea.length != 0){

        returnObj = usableArea[Math.floor(Math.random()*(usableArea.length))];

        return returnObj;

    }else{

        return false;

    }

}

//建立墙

function creatWall (obj){

    var wall;                       //墙

    var brush;                      //重置墙评论

    var congestionArray = [];       //判断是否被占用的数组

    var wallHeight;                 //墙高度

    var wallWidth;                  //墙宽度

    (function(){

        //墙

        wall = $("<div>",{

            "class":"wall"

        }).appendTo(obj);

        wallHeight = Math.floor((560-60)/90);

        wallWidth = Math.floor((900-80)/40);

        for(var i = 0; i < wallHeight; i++){

            congestionArray[i] = [];

            for(var m = 0; m < wallWidth; m++){

                congestionArray[i][m] = 1;

            }

        }

        brush = $("<img>",{

            "class":"brush",

            "src":"img/brush.png",

            "alt":"清空评论",

            "title":"点击清空墙上评论！"

        }).appendTo(obj);

    })();

    var returnData = {};

    returnData.wall = wall;

    returnData.brush = brush;

    returnData.wallHeight = wallHeight;

    returnData.wallWidth = wallWidth;

    returnData.congestionArray = congestionArray;

    return returnData;

}


//抽奖部分 函数库

/**
 * Created by grallen on 2015/2/21.
 */


//抽奖函数库

var list;

//抽奖函数

function drawARaffle(obj){

    $(".winning p").removeClass("pitch");

    //动画开始移除按钮点击事件

    $(obj.button).unbind("click").css("cursor","default");

    //中奖对象 编号

    var winnerNum = Math.ceil(Math.random()*1000)+100;

    slotMachine(obj,1,list);

}

//老虎机函数

function slotMachine(obj,winnerNum,list){

    //判断动画是否应该结束

    if(winnerNum > 0){

        var time = 1000/winnerNum;

        //候选人名单

        var candidate;

        //获取新的候选人姓名

        var newCandidate = list.shift();

        list.push(newCandidate);

        //添加新的候选人

        $("<p>",{

            "num":0,

            "class":"candidate",

            html:newCandidate

        }).appendTo($(obj.winning));

        //获取候选人

        candidate = $(obj.winning).children("p");

        candidate.removeClass("candidatenum");

        //开始滚动

        for(var i = candidate.length - 1; i >= 0;i-- ) {

            //目标属性

            var topPX;

            //当前节点

            var p = $(candidate[i]);

            //当前节点的编号

            var num = parseInt(p.attr("num"));

            //删除多余节点

            if(num > 6){

                setTimeout(function(){

                    p.remove();

                },50);

                break;

            }

            //设定动画css属性

            switch (num){
                case 0:
                    topPX = "-116px";break;
                case 1:
                    topPX = "-45px";break;
                case 2:
                    topPX = "26px";break;
                case 3:
                    topPX = "97px";break;
                case 4:
                    topPX = "168px";break;
                case 5:
                    topPX = "239px";break;
                case 6:
                    topPX = "310px";break;
                default :
                    topPX = "381px";break;
            }

            p.css("top",topPX);

            //当前节点的编号更新

            p.attr("num",++num);

        }

        candidate.addClass("candidatenum").css("transition-duration",1/winnerNum+"s");

        //该动画执行完成 执行下一个动画

        setTimeout(function(){

            //计数器减一

            winnerNum--;

            //再次执行

            slotMachine(obj,winnerNum,list)

        },time);

    }else{

        //动画执行完毕

        //给中奖人添加css

        setTimeout(function(){

            $($(".winning p")[3]).addClass("pitch");

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
//
//function animateTransform (obj,rotateX,time) {
//
//    if(time < 50){
//
//        rotateX += 15 ;
//
//        obj.css("transform","rotateX("+rotateX+"deg)");
//
//    }else{
//
//        var frameNum = time*0.02;
//
//        var eachRotateX = 15/frameNum;
//
//        animateTransformFrame(obj,rotateX,rotateX,eachRotateX,frameNum);
//
//    }
//
//}
//
//function animateTransformFrame (obj,rotateX,original,each,num){
//
//    if(num > 1){
//
//        original -= each;
//
//        var color = Math.ceil((60-Math.abs(original))/0.9);
//
//        obj.css("transform","rotateX("+original+"deg)").css("color","rgb("+color+","+color+","+color+")");
//
//        num--;
//
//        setTimeout(function(){
//
//            animateTransformFrame (obj,rotateX,original,each,num);
//
//        },50);
//
//    }else{
//
//        rotateX -= 15;
//
//        var color = Math.ceil((60-Math.abs(original))/0.9);
//
//        obj.css("transform","rotateX("+rotateX+"deg)").css("color","rgb("+color+","+color+","+color+")");
//
//    }
//
//}

//按钮动画效果

function animateButton (obj){

    obj.animate({

        top:"264px"

    },250,"linear",function(){

        obj.animate({

            top:"225px"

        },800,"linear");

    });

}



