/**
 * Created by grallen on 2015/2/19.
 */

window.onload = function(){

    //参加活动名单

    list  = ["grallen","cindy","betty","james","allen","cody","coco","deff","green","iverson"];

    //建立老虎机

    var SlotMachine = creatSlotMachine($("body")[0]);

    //滚上默认数据

    slotMachine(SlotMachine.winning,7);

    //给按钮绑定点击事件

    SlotMachine.button.on("click",function(){

        drawARaffle(SlotMachine.winning);

    });

};






















