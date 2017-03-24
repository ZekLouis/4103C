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
var nomPartieTemp = "";
var pseudo = "";
var sens= "vertical";
var full = false;
var modalTurn_opened = false;
var pseudo_tour = "";
var pseudo_j1;
var pseudo_j2;

$(function(){
    /*
      INITIALISATION DE LA PARTIE
    */

    $('.modal').modal();
    $('.modal').modal({
                dismissible: false,
    });

    $('.modalTurn').modal({
                dismissible: false,
                opacity: .5,
    });

    // Génération des tableaux de jeux
    generateTabJou();
    generateTabAdv();


    /*
        Requete permettant de récupérer la liste des parties
    */
   setInterval(function(){
       $.getJSON("/4103C/server/request.php?no_req=8",function(data){
            console.log(data);
            $("#listePartieTab").html('')
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
                    $("#listePartieTab").html('<tr id="'+nomDePartie
                    +'"><td>'+nomDePartie
                    +'</td><td>'+statut+'</td><td>'+listePartie[i]['nbJoueurs']
                    +'/2</td><td><button id="joinButton" data-partie="'+nomDePartie+'" class="btn '+classe+' waves-effect waves-light join">Rejoindre</button></td></tr>'+$("#listePartieTab").html());
            };

            /**
             * Quand on click sur rejoindre une partie
             */
            $(".join").click(function() {
                $("#modal1").modal('open');
                nomPartieTemp = $(this).data('partie');
            });
        });
    },1000);
    /**
     * Quand on confirme après avoir rentré un pseudo
     */
    $(".joinSuite").click(function() {
        pseudo = $("#pseudo").val();
        if(pseudo==""){
            Materialize.toast('Erreur : saisissez un pseudo', 4000);
        }else{
            console.info("Joining : "+nomPartieTemp);
            $(".loader").slideDown(300);
            /**
             * Requete permettant d'insérer un un joueur dans une partie
             */
            $.getJSON("/4103C/server/request.php?no_req=6&pseudo="+pseudo+"&nomPartie="+nomPartieTemp,function(data){
                if(data['res']==true){
                    nomPartie = nomPartieTemp;
                    $("#init").slideUp(300);
                    $("#main").slideDown(300);
                    $("#modal2").modal('open');
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
        if(nomPartie!=""){
            $.getJSON("/4103C/server/request.php?no_req=0&nomPartie="+nomPartie,function(data){

                pseudo_tour = data['pseudotour'];
                pseudo_j1 = data['pseudo_j1'];
                pseudo_j2 = data['pseudo_j2'];
                last_case_x = data['last_case_x'];
                last_case_y = data['last_case_y'];

                $('#situationTour').text("Tour de "+pseudo_tour);
                $('#j1').text(pseudo_j1);
                $('#j2').text(pseudo_j2);

                if (data['pseudotour'] == pseudo){
                  //modifs d'affichages
                    //$(".btnAdv").removeClass("disabled");

                    if (full == true && modalTurn_opened == true){

                        $("#modalTurn").modal('close');
                        modalTurn_opened = false;
                        $("td[data-y='"+last_case_y+"'][data-x='"+last_case_x+"'] button").addClass("orange");
                    }
                }
                else{
                  //modifs d'affichages

                    //$(".btnAdv").addClass("disabled");

                    if (full == true && modalTurn_opened == false && data['ready_j2'] == true){

                        $("#modalTurn").modal('open');
                        modalTurn_opened = true;

                    }

                }

                if (data['nbJoueurs'] == 2 ){
                    $("#modal2").modal('close');
                    full = true;
                } else if (data['nbJoueurs'] == 1 && full == true ){
                    $("#modal3").modal('open');
                    $("#modalTurn").modal('close');
                }

            });
        }

    },1000);



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

      $this = $(this);
      console.info("x:"+dataX+" ,y:"+ dataY);

      $.ajax({"url":"/4103C/server/request.php","data":"no_req=10&pseudo="+pseudo+"&nomPartie="+nomPartie+"&x="+ dataX+"&y="+dataY,"dataType":"json",
      "success": function(data){
        console.log(data);
        if(data.res.toucher){
          $this.addClass("red");
          Materialize.toast('Touché', 2000);
          if(data.res.couler){
            Materialize.toast('Coulé', 2000);
          }
        }else{
          $this.addClass("green");
          Materialize.toast('Dans l\'eau ...', 2000);
        }

      },
      error:function(xhr,err){
        console.log(xhr);
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

    $("#quit_player_left").on("click",function(){
        $.getJSON("/4103C/server/request.php?no_req=7&pseudo="+pseudo+"&nomPartie="+nomPartie,function(data){
            $("#init").slideDown(300);
            $("#main").slideUp(300);
            $(".loader").slideUp(300);
            $("#modal3").modal('close');
        });
    });

    $("#creerNouvellePartie").on("click",function(){
        console.log("Création d'une nouvelle partie");
        $.getJSON("/4103C/server/request.php?no_req=11");
    });

    $(window).on("beforeunload", function() {
        if(nomPartie!=""){
            $.getJSON("/4103C/server/request.php?no_req=7&pseudo="+pseudo+"&nomPartie="+nomPartie,function(data){
                $("#init").slideDown(300);
                $("#main").slideUp(300);
            });
        }
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

                var compteur = {
                    boat2 : {cp: 0, max:2},
                    boat3 : {cp: 0, max:3},
                    boat3bis : {cp: 0, max:3},
                    boat4 : {cp: 0, max:4},
                    boat5 : {cp: 0, max:5},
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

        if (typeof boat2 !== 'undefined' && boat2.length > 0 &&
        typeof boat3a !== 'undefined' && boat3a.length > 0 &&
        typeof boat3b !== 'undefined' && boat3b.length > 0 &&
        typeof boat4 !== 'undefined' && boat4.length > 0 &&
        typeof boat5 !== 'undefined' && boat5.length > 0) {
            resB2 = JSON.stringify(boat2);
            resB3 = JSON.stringify(boat3a);
            resB3b = JSON.stringify(boat3b);
            resB4 = JSON.stringify(boat4);
            resB5 = JSON.stringify(boat5);
            //resCompteur = JSON.stringify(compteur);
            $.getJSON("/4103C/server/request.php?no_req=9&pseudo="+pseudo+"&nomPartie="+nomPartie+"&boat2="+resB2+"&boat3a="+resB3+"&boat3b="+resB3b+"&boat4="+resB4+"&boat5="+resB5);
            $(".boats-container").slideUp(300);
            $('.btnValider').slideUp(300);
            $(".btnAdv").removeClass("disabled");
        }else{
            Materialize.toast('Placez tous vos bateaux avant de valider', 4000);
        }

    });

});
