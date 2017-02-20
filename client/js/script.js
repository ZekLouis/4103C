/**
 * Created by zeklouis on 23/01/17.
 */

// Dimensions des bateaux dynamiques avec un petit for

// Requete 0 : récupération des données
// Requete 1 : Bidon
// Requete 2 : Empty
// Requete 3 : Test
// Requete 4 : Test
// Requete 5 : Test
// Requete 6 : Inscription d'un joueur
// Requete 7 : Desincription d'un joueur
// Requete 8 : Récupération de la liste des parties
// Requete 9 : Insertion des bateaux
// Requete 10 : Envoies des coordonnées du click sur le tableau adversaire


var nomPartie = "";
var pseudo = "";
var sens= "";

$(function(){
    /*
      INITIALISATION DE LA PARTIE
    */

    $('.modal').modal();

    // Génération des tableaux de jeux
    generateTabJou();
    generateTabAdv();

    /*
        Requete permettant de récupérer la liste des parties
    */
    $.getJSON("/4103C/server/request.php?no_req=8",function(data){
        console.log(data);
        var listePartie = data['liste_partie'];
        var taillePartie = listePartie.length;
        for(var i = 0; i < taillePartie; i ++){
                var statut = "";
                var classe = "";

                switch (listePartie[i]['nbJoueurs']){
                    case 0:
                        statut = "Partie vide";
                        break;

                    case 1:
                        statut = "Partie en attente";
                        break;

                    case 2:
                        statut = "Partie complète";
                        classe = "disabled";
                        break;

                    default:
                        statut = "Erreur";
                        break;
                }
                /*
                    On modifie le tableau pour y faire figurer toutes les infos de chaque partie
                */

                var nomDePartie = listePartie[i]['name'];
                nomDePartie = nomDePartie.split(".");
                nomDePartie = nomDePartie[0];
                $("#listePartieTab").append('<tr id="'+nomDePartie
                +'"><td>'+nomDePartie
                +'</td><td>'+statut+'</td><td>'+listePartie[i]['nbJoueurs']
                +'/2</td><td><button data-partie="'+nomDePartie+'" class="btn '+classe+' waves-effect waves-light join">Rejoindre</button></td></tr>');
        };

        /**
         * Quand on click sur rejoindre une partie
         */
        $(".join").click(function() {
            $("#modal1").modal('open');
            nomPartie = $(this).data('partie');
        });
    });

    /**
     * Quand on confirme après avoir rentré un pseudo
     */
    $(".joinSuite").click(function() {
        pseudo = $("#pseudo").val();

        if(pseudo==""){
            Materialize.toast('Erreur : saisissez un pseudo', 4000);
        }else{
            console.info("Joining : "+nomPartie);
            $(".loader").slideDown(300);

            /**
             * Requete permettant d'insérer un un joueur dans une partie
             */
            $.getJSON("/4103C/server/request.php?no_req=6&pseudo="+pseudo+"&nomPartie="+nomPartie,function(data){
                console.log(data);
                if(data['res']==true){
                    $("#init").slideUp(300);
                    $("#main").slideDown(300);
                    Materialize.toast('Connexion réussie, Démarrage de la partie ...', 2000);
                    setTimeout(function(){
                        Materialize.toast('Commencez par placer vos bateaux', 5000);
                    },1000);
                    setTimeout(function(){
                        Materialize.toast('Validez une fois le placement terminé', 5000);
                    },3000);
                    setTimeout(function(){
                        Materialize.toast('Vous pouvez faire tourner vos bateaux avec la touche R tout en faisant glisser le bateau', 5000);
                    },6000);
                }else{
                    $(".loader").slideUp(300);
                    Materialize.toast('Échec de la connexion', 4000);
                }
            });
        }
    });

    setInterval(function(){

        $.getJSON("/4103C/server/request.php?no_req=0&nomPartie="+nomPartie,function(data){
            console.info(data);

            if (data['pseudotour'] == pseudo){
              jouer = true;
              //modifs d'affichages
            }
            else{
              jouer = false;
              //modifs d'affichages

            }

        });
    },1000);

/*  Placement des bateaux */
    var heightTab = 10;
    $(document).keyup(function(e){
            e.preventDefault(true);
            console.log("start");
            console.log(e);
            if (e.which == 13){
                if (sens == 'vertical'){
                    sens = 'horizontal';
                    console.log("h: " +  sens);
                }else {
                    sens = 'vertical';
                    console.log("v: " +  sens);
                }
            }
        });
    // Rend les bateaux "draggable"
    $(".boat").draggable({
      revert: 'invalid',
      start: function(event, ui){
        sens = 'vertical';
        var hauteur = $(this).data('height');
        ligneDesact = (heightTab-hauteur)+2;

        for(var i = ligneDesact; i<=10; i++){
          $('td[data-y="'+i+'"] button').droppable( "option", "disabled", true );
        }


        var listeOccupe = $('[class*="bateau"]');


        for(var i = 0; i < listeOccupe.length; i++){
          var currentFrame = $(listeOccupe[i]).parent();
          var xCurrentFrame = currentFrame.data('x');
          var yCurrentFrame = currentFrame.data('y');

          for(var j = 0; j < hauteur; j++){
            var frameAbove = $('td[data-y='+(yCurrentFrame-j)+'][data-x='+xCurrentFrame+'] button');
            frameAbove.droppable( "option", "disabled", true );
            console.log(frameAbove);
          }
        }

      },
      stop: function(event, ui){
        var hauteur = $(this).data('height');
        ligneDesact = (heightTab-hauteur)+2;

        for(var i = ligneDesact; i<=10; i++){
          $('td[data-y="'+i+'"] button').droppable( "option", "disabled", false );
          $('td[data-y="'+i+'"] button').removeClass('red');
          $('td[data-y="'+i+'"] button').addClass('teal');
        }

      }
    });

    // Définit les cases comme zone de "drop"
    // Au drop : changement de couleur de la case + suppression de l'image
    // Au survol : changement de la couleur de la case momentané.
   $('.frame-drop').droppable({
      drop: function(event,ui){
        // On récupère data x et data y du td parent
        var dataX = $(this).parent().data('x');
        var dataY = $(this).parent().data('y');

        var id = $(ui.draggable).attr('id');

        // On affecte le changement de couleur a la case en dessous
       if(sens=='vertical'){
            for(var i = 0; i<$(ui.draggable).data('height');i++){
                var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button'); // selecteur du bouton de la case
                under_case.removeClass("teal");
                under_case.removeClass("lighten-2");
                under_case.addClass("green");
                under_case.droppable( "option", "disabled", true );
                under_case.addClass(id);
                // On passe a la case suivante
                dataY += 1;
            }
        }else if(sens=='horizontal'){
            for(var i = 0; i<$(ui.draggable).data('height');i++){
                var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button'); // selecteur du bouton de la case
                under_case.removeClass("teal");
                under_case.removeClass("lighten-2");
                under_case.addClass("green");
                under_case.droppable( "option", "disabled", true );
                under_case.addClass(id);
                // On passe a la case suivante
                dataX += 1;
            }

        }
        $(this).addClass(id);
        // On affecte les changements à la case visée par le drop
        $(this).removeClass("teal");
        $(this).removeClass("lighten-2");
        $(this).addClass("green");
        $(this).droppable( "option", "disabled", true );

        // Centrer le bateau lors du drop
        var $this = $(this);
        ui.draggable.position({
          my: "center",
          at: "center",
          of: $this,
          using: function(pos) {
            $(this).animate(pos, 200, "linear");
          }
        });

      },
      over: function(event,ui){
        // On récupère data x et data y du td parent
        var dataX = $(this).parent().data('x');
        var dataY = $(this).parent().data('y');
        var dataXbis = $(this).parent().data('x');
        var dataYbis = $(this).parent().data('y');

        var id = $(ui.draggable).attr('id');

        // On affecte le changement de couleur a la case en dessous
        if(sens=='vertical'){
            for(var i = 0; i<$(ui.draggable).data('height');i++){
                var under_case = $('td[data-y="'+dataYbis+'"][data-x="'+dataXbis+'"] button'); // selecteur du bouton de la case
                    under_case.removeClass("blue");
                    under_case.addClass("teal");
                // On passe a la case suivante
                dataXbis += 1;
            }
            for(var i = 0; i<$(ui.draggable).data('height');i++){
                var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button'); // selecteur du bouton de la case
                under_case.removeClass("teal");
                under_case.addClass("blue");
                under_case.addClass(id);
                // On passe a la case suivante
                dataY += 1;
            }
        }else if(sens=='horizontal'){
            for(var i = 0; i<$(ui.draggable).data('height');i++){
                var under_case = $('td[data-y="'+dataYbis+'"][data-x="'+dataXbis+'"] button'); // selecteur du bouton de la case
                    under_case.removeClass("blue");
                    under_case.addClass("teal");
                // On passe a la case suivante
                dataYbis += 1;
            }
            for(var i = 0; i<$(ui.draggable).data('height');i++){
                var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button'); // selecteur du bouton de la case
                under_case.removeClass("teal");
                under_case.addClass("blue");
                under_case.addClass(id);
                // On passe a la case suivante
                dataX += 1;
            }
        }
        $(this).addClass(id);
        // On affecte les changements à la case visée par le drop
        $(this).removeClass("teal");

        $(this).addClass("blue");


      },
      out: function(event,ui){
        // On récupère data x et data y du td parent
        var dataX = $(this).parent().data('x');
        var dataY = $(this).parent().data('y');

        var id = $(ui.draggable).attr('id');

        // On affecte le changement de couleur a la case en dessous

       if(sens=='vertical'){
            for(var i = 0; i<$(ui.draggable).data('height');i++){
                var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button'); // selecteur du bouton de la case
                under_case.removeClass("blue");
                under_case.addClass("teal");
                under_case.addClass(id);
                // On passe a la case suivante
                dataY += 1;
          }
        }else if(sens=='horizontal'){
            for(var i = 0; i<$(ui.draggable).data('height');i++){
                var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button'); // selecteur du bouton de la case
                under_case.removeClass("blue");
                under_case.addClass("teal");
                under_case.addClass(id);
                // On passe a la case suivante
                dataX += 1;


            }
        }
        $(this).addClass(id);
        // On affecte les changements à la case visée par le drop
        $(this).removeClass("blue");
        $(this).addClass("teal");
      }
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////////
///Cette fonction est activé lorsque l'utilisateur appuie sur une des cases du tableau de l'adversaire
///
///
    $(".btnAdv").click(function(){
      console.log("vous avez appuyez sur une case de l'adv");

      var dataX = $(this).data('xa');
      var dataY = $(this).data('ya');
      $(this).removeClass("teal");
      $(this).removeClass("lighten-2");

      $.getJSON("/4103C/server/request.php?no_req=10&pseudo="+pseudo+"&nomPartie="+nomPartie+"&x="+ dataX+"&y="+dataY,function(data){
        if(data.res){
            $(this).addClass("green");
        }else{
            $(this).addClass("red");
        }
      });

    });
////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Les deux fonctions qui suivent on pour but de déconnecter les joueurs
    //
    //La première lorque le client clic sur quitter
    //La seconde lorsque qu'il raffraichit ou quitte son naviguateur
    $("#quit").on("click",function(){
        $.getJSON("/4103C/server/request.php?no_req=7&pseudo="+pseudo+"&nomPartie="+nomPartie,function(data){
            $("#init").slideDown(300);
            $("#main").slideUp(300);
        });
    });


    $(window).on("beforeunload", function() {
      console.log("ON FAIT UNLOAD");
      $.getJSON("/4103C/server/request.php?no_req=7&pseudo="+pseudo+"&nomPartie="+nomPartie,function(data){
          $("#init").slideDown(300);
          $("#main").slideUp(300);
      });

    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Fonction qui s'éxécute lorsque l'on appui sur le bouton valider
    //Elle permet d'envoyer les bateaux
    $('.btnValider').click(function(){
        var boat2 = [];
        var boat3a = [];
        var boat3b = [];
        var boat4 = [];
        var boat5 = [];
        $(".btn").each(function(){
            if ($(this).hasClass("green")){
                var dataX = $(this).parent().data('x');
                var dataY = $(this).parent().data('y');

                var position = {
                    x: dataX,
                    y: dataY
                }

                if ($(this).hasClass("bateau2")){
                    boat2.push(position);
                }
                if ($(this).hasClass("bateau3a")){
                    boat3a.push(position);
                }

                if ($(this).hasClass("bateau3b")){
                    boat3b.push(position);
                }

                if ($(this).hasClass("bateau4")){
                    boat4.push(position);
                }

                if ($(this).hasClass("bateau5")){
                    boat5.push(position);
                }
            }
        });
        console.log(boat2);
        console.log(boat3a);
        console.log(boat3b);
        console.log(boat4);
        console.log(boat5);


        resB2 = JSON.stringify(boat2);
        resB3 = JSON.stringify(boat3a);
        resB3b = JSON.stringify(boat3b);
        resB4 = JSON.stringify(boat4);
        resB5 =JSON.stringify(boat5);

        $.getJSON("/4103C/server/request.php?no_req=9&pseudo="+pseudo+"&nomPartie="+nomPartie+"&boat2="+resB2+"&boat3a="+resB3+"&boat3b="+resB3b+"&boat4="+resB4+"&boat5="+resB5,function(data){
            $("#init").slideDown(300);
            $("#main").slideUp(300);
        });
    });

    ///////////////////////////////////////////////////////////////////
    //Cette fonction récupère le texte situé dans la barre de nav
    //Elle gère aussi le tour du joueurs
    $("#situationTour")
});
