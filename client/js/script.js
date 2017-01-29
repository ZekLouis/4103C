/**
 * Created by zeklouis on 23/01/17.
 */

// Requete 0 : récupération des données

$(function(){
    setInterval(function(){
        var xhr = new XMLHttpRequest();
        /*$.getJSON("/4103C/server/request.php?no_req=0",function(data){
            console.info(data[1]);
            console.info(data[2]);
        });*/

        xhr.open('GET', '/4103C/server/request.php?no_req=0');
        xhr.send(null);

        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                console.log(JSON.parse(xhr.responseText)[1])
            }else if(xhr.readyState == 4 && xhr.status != 200){
                console.log('erreur')
            }
        }
    },1000);

    $(".btn").click(function(){
        $(this).removeClass("teal");
        $(this).removeClass("lighten-2");
        $(this).addClass("red");
    });



    // PLACEMENT DES bateaux
    $(".boat").draggable({revert: 'invalid'});

    $('.frame-drop').droppable({
      drop : function(event, ui){
        $(this).removeClass("teal");
        $(this).removeClass("lighten-2");
        $(this).addClass("green");
        $(ui.draggable).remove();
        $(this).css('background', 'url("/4103C/client/images/boat.png") no-repeat center');
      },
      over : function(){
        $(this).removeClass("teal");
        $(this).removeClass("lighten-2");
        $(this).addClass("blue");
      },
      out : function(){
        $(this).removeClass("blue");
        $(this).addClass("teal");
        $(this).addClass("lighten-2");
      }
    });
});
