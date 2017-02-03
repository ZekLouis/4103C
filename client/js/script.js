/**
 * Created by zeklouis on 23/01/17.
 */

// TODO Correction Cas B2 C2 I ...
// Dimensions des bateaux dynamiques avec un petit for

// Requete 0 : récupération des données

// Fonction permettant d'incrémenter un char !
function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}


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
                console.log(JSON.parse(xhr.responseText)["bite"])
            }else if(xhr.readyState == 4 && xhr.status != 200){
                console.log('erreur')
            }
        }
    },1000);

    $(".btn").on("click", function(){
        $(this).removeClass("teal");
        $(this).removeClass("lighten-2");
        $(this).addClass("red");
    });

    $("#last_name").on("change",function(){
        $("#my_pseudo").text(function(){
            return $("#last_name").val();
        });
    });

/*  Placement des bateaux */

    // Rend les bateaux "draggable"
    $(".boat").draggable({revert: 'invalid'});

    // Définit les cases comme zone de "drop"
      // Au drop : changement de couleur de la case + suppression de l'image
      // Au survol : changement de la couleur de la case momentané.
    $('.frame-drop').droppable({
      drop : function(event, ui){

        // On récupère data x et data y du td parent
        var dataX = $(this).parent().data('x');
        var dataY = $(this).parent().data('y');

        // Case ui data height

        // Stocker les séléecteurs dans une variable

        // On affecte le changement de couleur a la case en dessous
        for(var i = 0; i<$(ui.draggable).data('height');i++){
            var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button');
            under_case.removeClass("teal");
            under_case.removeClass("lighten-2");
            under_case.addClass("green");
            under_case.droppable('disable');
            dataY = nextChar(dataY)
        }

        $(this).removeClass("teal");
        $(this).removeClass("lighten-2");
        $(this).addClass("green");
        $(ui.draggable).remove();
        $(this).css('background', 'url("../../4103C/client/images/boat.png") no-repeat center');
        $(this).droppable( 'disable' );
      },
      over : function(event,ui){
        // Code executé au survol d'une case
        var dataX = $(this).parent().data('x');
        var dataY = $(this).parent().data('y');
        

        for(var i = 0; i<$(ui.draggable).data('height');i++){
            var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button'); 
            under_case.addClass("blue");
            under_case.removeClass("teal");
            dataY = nextChar(dataY)
            console.log(i);
        }

        $(this).removeClass("teal");
        $(this).addClass("blue");
      },
      out : function(event,ui){
        // Code executé à l'arrêt du survol de la case (sortie/out)
        var dataX = $(this).parent().data('x');
        var dataY = $(this).parent().data('y');
        for(var i = 0; i<$(ui.draggable).data('height');i++){
            var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button');
            under_case.removeClass("blue");
            under_case.addClass("teal");
            dataY = nextChar(dataY)
        }

        $(this).removeClass("blue");
        $(this).addClass("teal");
      }
    });
});
