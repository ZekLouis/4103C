/**
 * Created by zeklouis on 23/01/17.
 */

$(function(){
    setInterval(function(){
        $.getJSON("/4103C/server/request.php?no_req=0",function(data){
            console.info(data[1]);
            console.info(data[2]);
        });
    },1000);
   
});