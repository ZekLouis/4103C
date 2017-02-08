/**
 * Created by zeklouis on 23/01/17.
 */

// TODO Correction Cas B2 C2 I ...
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

// Fonction permettant d'incrémenter un char !
function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
};


/**
 * Cette fonction permet de modifier le HTML en fonction des données reçues par le server
 */
function affecte(nbJoueurs,j1,j2){
    $("#j1").text(function(){
        return j1;
    });
    $("#j2").text(function(){
        return j2;
    });
    $("#nbJoueurs").text(function(){
        return nbJoueurs;
    });
};


$(function(){
    /*
      INITIALISATION DE LA PARTIE
    */


    $.getJSON("/4103C/server/request.php?no_req=8",function(data){
        var nbParties = data['nb_parties'];
        var listePartie = data['liste_partie'];
        for(var i = 0; i < nbParties; i ++){
                var statut = "";
                switch (listePartie[i]['nbJoueurs']){
                    case 0:
                        statut = "Partie vide";
                        break;

                    case 1:
                        statut = "Partie en attente";
                        break;

                    case 2:
                        statut = "Partie complète";
                        break;

                    default:
                        statut = "Erreur";
                        break;
                }
                $("#listePartieTab").append('<tr id="'+listePartie[i]['name']
                +'"><td>'+listePartie[i]['name']
                +'</td><td>'+statut+'</td><td>'+listePartie[i]['nbJoueurs']
                +'/2</td><td><button class="btn waves-effect waves-light">Rejoindre</button></td></tr>')
        };
    });

    setInterval(function(){
        var xhr = new XMLHttpRequest();
        /*$.getJSON("/4103C/server/request.php?no_req=0",function(data){
            console.info(data[1]);
            console.info(data[2]);
        });*/

        //xhr.open('GET', '/4103C/server/request.php?no_req=0');
        //xhr.send(null);

        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                console.log(JSON.parse(xhr.responseText)["1"])
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

        //Requete qui modifie le fichier JSON et affecte le nom j1 et incrémente le nombre de joueur
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/4103C/server/request.php?no_req=6&pseudo='+$("#last_name").val());
        xhr.send(null);

        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                affecte(JSON.parse(xhr.responseText)["Nb"],JSON.parse(xhr.responseText)["j1"],JSON.parse(xhr.responseText)["j2"]);
            }else if(xhr.readyState == 4 && xhr.status != 200){
                console.log('erreur')
            }
        }
    });

/*  Placement des bateaux */
    var heightTab = 10;

    // Rend les bateaux "draggable"
    $(".boat").draggable({
      revert: 'invalid',
      start: function(event, ui){
        var hauteur = $(this).data('height');
        ligneDesact = (heightTab-hauteur)+2;

        for(var i = ligneDesact; i<=10; i++){
          console.log(i);
          $('td[data-y="'+i+'"] button').droppable( "option", "disabled", true );
        }

      },
      stop: function(event, ui){
        var hauteur = $(this).data('height');
        ligneDesact = (heightTab-hauteur)+2;

        for(var i = ligneDesact; i<=10; i++){
          console.log(i);
          $('td[data-y="'+i+'"] button').droppable( "option", "disabled", false );
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
        for(var i = 0; i<$(ui.draggable).data('height');i++){
            var under_case = $('td[data-y="'+dataY+'"][data-x="'+dataX+'"] button'); // selecteur du bouton de la case
            under_case.removeClass("teal");
            under_case.removeClass("lighten-2");
            under_case.addClass("green");
            under_case.droppable('disable');
            under_case.addClass(id);
            // On passe a la case suivante
            dataY += 1;
        }
        $(this).addClass(id);
        // On affecte les changements à la case visée par le drop
        $(this).removeClass("teal");
        $(this).removeClass("lighten-2");
        $(this).addClass("green");

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

      },
      out: function(event,ui){

      }
    })



    // Fonction de fin de partie TODO
    function finDePartie(){
        return null;
    };

    $(window).on("unload",function(){
        // Reset de tous le fichier JSON
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/4103C/server/request.php?no_req=7&pseudo='+$("#last_name").val());
        xhr.send(null);

        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                var pseudo = JSON.parse(xhr.responseText)['pseudo'];
                $("#my_pseudo").text(function(){
                    return pseudo;

                });
            }else if(xhr.readyState == 4 && xhr.status != 200){
                console.log('erreur')
            }
        }
        alert("bye");
    });

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
    });
});
