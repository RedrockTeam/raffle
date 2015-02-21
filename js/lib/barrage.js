

var w = $(window);

//弹幕函数库

//弹幕数量

var slideNum = 0;

//弹幕队列初始化

var slideQueue = [],fixQueue = [];

//弹幕进行中队列

var UnderwayQueue = {};

//等待队列初始化

var slideWaitQueue = [],fixWaitQueue = [];

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

        //最大字体大小限制

        textStyle.font_size = textStyle.font_size > 28 ? 28 : textStyle.font_size;

        //弹幕初始化

        var dom = $("<div>",{

            "class":"barrage",

            "slideNum":slideNum,                        //弹幕编号

            css:{

                "top": heightNum*36+"px",				//弹幕高度
                "font-size": textStyle.font_size+"px",	//弹幕字体大小
                "font-weight": textStyle.font_weight,	//弹幕字体粗细
                "font-family": textStyle.font_family,	//弹幕字体

            },

            //添加弹幕文本

            html:text,

        }).appendTo(obj);								//添加弹幕至浏览器中

        //弹幕编号加一

        slideNum++ ;

        //弹幕颜色判断

        textColor(dom,textStyle.color);

        var ran = Math.random()-0.5;                    //随机数
        var v = 0.15+Math.abs(ran)*ran*0.2;				//弹幕速度
        var width = dom.width();						//弹幕长度判断
        var time = (obj.width()+width)/v;				//弹幕动画时间

        //弹幕类型判断

        if( slideStyle == "slide"){

            //滑动弹幕

            var banTime = (width+500)/v;				//占用队列时间

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

            //滑动弹幕发射准备

            dom.css("left",obj.width());

            //滑动弹幕发射

            dom.animate({

                left:-width,

            },time,"linear",function(){

                //弹幕结束，删除结点

                dom.remove();

                //删除行进队列中数据

                delete UnderwayQueue[dom.attr("slideNum")];

            });

        }else{

            //固定弹幕发射准备

            dom.addClass("fixBarrage");

            //固定弹幕显示3000ms

            setTimeout(function(){

                //弹幕结束，删除结点

                dom.remove();

                //删除行进队列中数据

                delete UnderwayQueue[dom.attr("slideNum")];

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

            },3000);

        }


    }else{

        //队列已满，进入等待队列


        //添加至等待队列

        WaitQueue.push(data);

    }

}

//弹幕幕布函数 参数为弹幕建立的父节点

function creatScreen(obj){

    var Screen;//弹幕容器

    (function barrage(){

        //弹幕容器

        Screen = $("<div>",{

            "class":"Screen",

            css:{

                "width": obj.width(),
                "height": obj.height()-40,
                "position": "relative",
                "overflow": "hidden",
                "cursor" : "default",

            },

        }).appendTo(obj);

        //底部标识

        $("<p>",{

            css:{

                "text-align": "center",
                "color": "#ccc",
                "line-height": "40px",
                "position": "relative",
                "width": "200px",
                "margin": "0 auto",

            },

            html:"弹幕支持 &nbsp;&nbsp;@ RedRock . Grallen ",

        }).appendTo(obj);

        //弹幕队列初始化

        var newLength = parseInt(Screen.height()/36);

        slideQueue.length = newLength;
        fixQueue.length = newLength;

        for (var i = newLength - 1; i >= 0; i--) {

            slideQueue[i] = 1;
            fixQueue[i] = 1;

        };

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
    obj.height(par.height()-40);

    //改变弹幕队列长度

    var oldLength = fixQueue.length;
    var newLength = parseInt(obj.height()/36);

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
