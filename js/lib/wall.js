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

        "src" : "img/logo.jpg"

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

        wallHeight = Math.floor((parseInt(wall.css("height"))-60)/90);

        wallWidth = Math.floor((parseInt(wall.css("width"))-80)/40);

        for(var i = 0; i < wallHeight; i++){

            congestionArray[i] = [];

            for(var m = 0; m < wallWidth; m++){

                congestionArray[i][m] = 1;

            }

        }

        brush = $("<img>",{

            "class":"brush",

            "src":"img/iconfont-icon.png",

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