$(function(){

/*  Placement des bateaux */
    var heightTab = 10;
    var lengthTab = 10;
    var sens= "vertical";
    var dragged;
    var isStart;
    var colDesact;
    var dataX;
    var dataY;
    var idBoat;
    var boatHeight = "";
    var cssBoatHeight = "";
    var offset = "";
    var nextFrame = "";
/*

  TODO :
  - ORGANISER DECLARATION DE VARIABLES
  - ELEMENTS DE DRAG (Ligne au dessus du rouge non droppable ?)

*/


    // Changement de l'orientation de l'image du bateau
    function changeOrientation(orient, image){
      if(orient=="horizontal"){
        image.addClass('rotate');
      }else if(orient=="vertical"){
        image.removeClass('rotate');
      }
    }

    // Detection de la pression sur la touche "entrée" afin de changer le sens de placement du bateau
    $(document).keyup(function(e){
          if (e.which == 13){
              if (sens == 'vertical'){
                  sens = 'horizontal';
                  changeOrientation('horizontal',dragged);
                  //desactiveCase();
              }else {
                  sens = 'vertical';
                  changeOrientation('vertical', dragged);
                  //desactiveCase();
              }
          }
    });

    // Variable permettant d'activer ou de désactiver temporairement la boucle de controle du sens / de désactivation des cases
    isStart = false;
    function myTimer() {
      if (isStart == true){
        if (sens=="horizontal"){
          var colDesact = (lengthTab-getHauteurBateau())+2;

          // Suppression de la couleur rouge sur les cases (en vertical)
          for(var i = 0; i <= 10; i++){
            for(var j = colDesact; j<=10; j++){
                nextFrame = $('td[data-x="'+i+'"][data-y="'+j+'"] button');
                nextFrame.droppable( "option", "disabled", false );
                nextFrame.addClass("teal");
                nextFrame.removeClass("red");
            }
          }
          // Ajout de la couleur rouge sur les cases (en horizontal)
          for(var i = 0; i <= 10; i++){
            for(var j = colDesact; j<=10; j++){
                nextFrame = $('td[data-y="'+i+'"][data-x="'+j+'"] button')
                nextFrame.droppable( "option", "disabled", true );
                nextFrame.addClass("red");
                nextFrame.removeClass("teal");
            }
          }
        }
        else if(sens=="vertical"){
          colDesact = (lengthTab-getHauteurBateau())+2;
          // Suppression de la couleur rouge sur les cases (en horizontal)
          for(var i = 0; i <= 10; i++){
            for(var j = colDesact; j<=10; j++){
                nextFrame = $('td[data-y="'+i+'"][data-x="'+j+'"] button')
                nextFrame.droppable( "option", "disabled", false );
                nextFrame.addClass("teal");
                nextFrame.removeClass("red");
            }
          }
          // Ajout de la couleur rouge sur les cases verticales (en vertical)
          for(var i = 0; i <= 10; i++){
            for(var j = colDesact; j<=10; j++){
                nextFrame = $('td[data-x="'+i+'"][data-y="'+j+'"] button');
                nextFrame.droppable( "option", "disabled", true );
                nextFrame.addClass("red");
                nextFrame.removeClass("teal");
            }
          }
        }
      }
      $("button[class*='bateau']").droppable('option', 'disabled', true);
    }

    // Démarrage du timer de check des cases
    var myVar = setInterval(myTimer, 1000);

    // Permet d'envoyer la hauteur du bateau drag
    function setHauteurBateau(hautBat){
      hauteurBateau = hautBat;
    }
    // Permet de récupérer la hauteur du bateau drag
    function getHauteurBateau(){
      return hauteurBateau
    }
    // Permet de set le bateau drag (via la fonction start du draggable)
    function setBateauDrag(bateau){
      bateauDrag = bateau;
    }
    // Permet de get le bateau drag (via la fonction start du draggable)
    function getBateauDrag(){
      return bateauDrag;
    }

    // Rend les bateaux "draggable"
    $(".boat").draggable({
      revert: 'invalid',
      // Evenement déclanché lors de la selection d'un bateau
      start: function(event, ui){


        var hauteur = $(this).data('height');
        var listeOccupe = $('[class*="bateau"]');



        for(var i = 0; i < listeOccupe.length; i++){
          var currentFrame = $(listeOccupe[i]).parent();
          var xCurrentFrame = currentFrame.data('x');
          var yCurrentFrame = currentFrame.data('y');
          for(var j = 0; j < hauteur; j++){
            var frameAbove = $('td[data-y='+(yCurrentFrame-j)+'][data-x='+xCurrentFrame+'] button');
            frameAbove.droppable( "option", "disabled", true );
          }
        }



        $(this).addClass('resize');
        sens = "vertical";
        setBateauDrag($(this));
        setHauteurBateau($(this).data('height'));
        dragged = $(this);
        isStart = true;
      },
      // Evenement déclanché lors du relachement d'un bateau
      stop: function(event,ui){
        $(this).removeClass('resize');
        isStart = false;
        $(this).removeClass('rotate');
        if (sens=="horizontal"){
          var colDesact = (lengthTab-getHauteurBateau())+2;
          for(var i = 0; i <= 10; i++){
            for(var j = colDesact; j<=10; j++){
                $('td[data-y="'+i+'"][data-x="'+j+'"] button').droppable( "option", "disabled", false );
                $('td[data-y="'+i+'"][data-x="'+j+'"] button').addClass("teal");
                $('td[data-y="'+i+'"][data-x="'+j+'"] button').removeClass("red");
            }
          }
        }
        else if(sens=="vertical"){
          var colDesact = (lengthTab-getHauteurBateau())+2;
          for(var i = 0; i <= 10; i++){
            for(var j = colDesact; j<=10; j++){
                $('td[data-x="'+i+'"][data-y="'+j+'"] button').droppable( "option", "disabled", false );
                $('td[data-x="'+i+'"][data-y="'+j+'"] button').addClass("teal");
                $('td[data-x="'+i+'"][data-y="'+j+'"] button').removeClass("red");
            }
          }
        }
        var hauteur = $(this).data('height');
        var listeOccupe = $('[class*="bateau"]');



        for(var i = 0; i < listeOccupe.length; i++){
          var currentFrame = $(listeOccupe[i]).parent();
          var xCurrentFrame = currentFrame.data('x');
          var yCurrentFrame = currentFrame.data('y');
          for(var j = 0; j < hauteur; j++){
            var frameAbove = $('td[data-y='+(yCurrentFrame-j)+'][data-x='+xCurrentFrame+'] button');
            frameAbove.droppable( "option", "disabled", false );
          }
        }
      }
    });

    // Définit les cases comme zone de "drop"
      // Au drop : changement de couleur de la case + suppression de l'image
      // Au survol : changement de la couleur de la case momentané.
   $('.frame-drop').droppable({

      // Déclanché lors du survol d'une case
      over: function(event,ui){
        // On récupère les data de la case du tableau parent
        dataX = $(this).parent().data('x');
        dataY = $(this).parent().data('y');
        // On récupère la hauteur du bateau
        boatHeight = $(ui.draggable).data('height');

        // On change la couleur de la case sous l'image
        $(this).addClass("light-green");
        $(this).removeClass('teal');

        if(sens=="horizontal"){
          for(var i = 1; i < boatHeight; i++){
            nextFrame = $('td[data-x='+(dataX+i)+'][data-y='+dataY+'] button')
            nextFrame.addClass('light-green')
            nextFrame.removeClass('teal');
          }
        }else if(sens=="vertical"){
          for(var i = 1; i < boatHeight; i++){
            nextFrame = $('td[data-x='+dataX+'][data-y='+(dataY+i)+'] button')
            nextFrame.addClass('light-green')
            nextFrame.removeClass('teal');
          }
        }


      },
      out: function(event,ui){
        // On récupère les data de la case du tableau parent
        dataX = $(this).parent().data('x');
        dataY = $(this).parent().data('y');

        $(this).removeClass('light-green');
        $(this).addClass('teal');

        if(sens=="horizontal"){
          for(var i = 1; i < boatHeight; i++){
            nextFrame = $('td[data-x='+(dataX+i)+'][data-y='+dataY+'] button')
            nextFrame.addClass('teal')
            nextFrame.removeClass('light-green');
          }
        }else if(sens=="vertical"){
          for(var i = 1; i < boatHeight; i++){
            nextFrame = $('td[data-x='+dataX+'][data-y='+(dataY+i)+'] button')
            nextFrame.addClass('teal')
            nextFrame.removeClass('light-green');
          }
        }


      },
      drop: function(event,ui){
        // On récupère les data de la case du tableau parent
        dataX = $(this).parent().data('x');
        dataY = $(this).parent().data('y');
        // On récupère l'id du bateau qui est drag, afin d'affecter la classe à la case où il est posé
        idBoat = (ui.draggable).attr('id');

        // Ajout de la classe correspondant à l'id du bateau lors du drop
        $(this).addClass(idBoat);

        // Changement de la couleur de la case
        $(this).removeClass('teal');
        $(this).removeClass('green');
        $(this).removeClass('light-green')
        $(this).addClass('green');
        $(this).addClass('unavailable')
        // Desactivation du droppable sur la case drop
        $(this).droppable('option', 'disabled', true);


        if(sens=="horizontal"){
          for(var i = 1; i < boatHeight; i++){
            nextFrame = $('td[data-x='+(dataX+i)+'][data-y='+dataY+'] button')
            nextFrame.addClass('green');
            nextFrame.removeClass('light-green')
            nextFrame.removeClass('teal');
            nextFrame.addClass(idBoat);
            nextFrame.droppable('option', 'disabled', true);
            nextFrame.addClass('unavailable')
          }
        }else if(sens=="vertical"){
          for(var i = 1; i < boatHeight; i++){
            nextFrame = $('td[data-x='+dataX+'][data-y='+(dataY+i)+'] button')
            nextFrame.addClass('green');
            nextFrame.removeClass('light-green')
            nextFrame.removeClass('teal');
            nextFrame.addClass(idBoat);
            nextFrame.droppable('option', 'disabled', true);
            nextFrame.addClass('unavailable')
          }
        }


        ui.draggable.position({
          my: "center",
          at: "center",
          of: $(this),
          using: function(pos) {
            $(this).animate(pos, 100, "linear");
          }
        });

        // Désactivation du draggable sur le bateau posé
        $(ui.draggable).draggable('option', 'disabled', true);

      }
    })

    $('.btnValider').click(function(){

          window.clearInterval(myVar);
    })

})
