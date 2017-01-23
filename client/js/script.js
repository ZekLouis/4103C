/**
 * Created by zeklouis on 23/01/17.
 */

$(function(){
    
    $("#bouton").click(function(){
        console.info("click")
        $.getJSON("/4103C/server/request.php?no_req=0",function(data){
            console.log(data);
        });

    });
});