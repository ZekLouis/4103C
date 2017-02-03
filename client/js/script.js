/**
 * Created by zeklouis on 23/01/17.
 */

// TODO Correction Cas B2 C2 I ...
// Dimensions des bateaux dynamiques avec un petit for

// Requete 0 : récupération des données

// Fonction permettant d'incrémenter un char !
function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
};


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

        // On affecte le changement de couleur a la case en dessous
        for(var i = 0; i<$(ui.draggable).data('height');i++){
            var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button'); // selecteur du bouton de la case
            under_case.removeClass("teal");
            under_case.removeClass("lighten-2");
            under_case.addClass("green");
            under_case.droppable('disable');
            // On passe a la case suivante
            dataY = nextChar(dataY)
        }
        // On affecte les changements à la case visée par le drop
        $(this).removeClass("teal");
        $(this).removeClass("lighten-2");
        $(this).addClass("green");
        // On supprime l'image draggable droppée
        $(ui.draggable).remove();
        $(this).css('background', 'url("../../4103C/client/images/boat.png") no-repeat center');
        $(this).droppable( 'disable' );
      },
      over : function(event,ui){

        // Code executé au survol d'une case

        // On sélectionne la valeur data x et data y du td parent au bouton survolé

        var dataX = $(this).parent().data('x');
        var dataY = $(this).parent().data('y');

        var length = $(ui.draggable).data('height');

        var lastElementBoat = dataY;
        for(var i = 1; i<length;i++){
          lastElementBoat = nextChar(lastElementBoat);
        }
        if(lastElementBoat>"J"){
          // On change de couleur sur la longueur du bateau drag
          for(var i = 0; i<length;i++){
              var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button');
              under_case.addClass("red");
              under_case.removeClass("teal");
              dataY = nextChar(dataY)
          }
          // On change la couleur sur la case survolée
          $(this).removeClass("teal");
          $(this).addClass("red");
          // Droppable désactivé si la derniere case du bateau dépasse le J
          $(this).droppable( 'disable' );
        }else{
          // On change de couleur sur la longueur du bateau drag
          for(var i = 0; i<length;i++){
              var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button');
              under_case.addClass("blue");
              under_case.removeClass("teal");
              dataY = nextChar(dataY)
          }
          // On change la couleur sur la case survolée
          $(this).removeClass("teal");
          $(this).addClass("blue");
        }
      },
      out : function(event,ui){

        // Code executé à l'arrêt du survol de la case (sortie/out)

        // On sélectionne la valeur data x et data y du td parent au bouton quitté

        var dataX = $(this).parent().data('x');
        var dataY = $(this).parent().data('y');
        // On rétablit la couleur sur la longueur du bateau drag
        for(var i = 0; i<$(ui.draggable).data('height');i++){
            var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button');
            under_case.removeClass("blue");
            under_case.addClass("teal");
            dataY = nextChar(dataY)
        }
        // On rétablit la couleur sur la case quittée
        $(this).removeClass("blue");
        $(this).addClass("teal");
      }
    });



    // Fonction de fin de partie TODO
    function finDePartie(){
        return null;
    };
});
