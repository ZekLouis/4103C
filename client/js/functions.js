/**
 * Fonction permettant d'incrémenter un char
 */
function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
};

/**
 * Fonction qui permet de générer dynamiquement le tableau de l'adversaire
 */
function generateTabAdv(){
    var k = 1;
    $("#adversaire").append("<tr id="+j+">");
    $("#adversaire").append("<th></th>");
    for(k=1; k<=10; k=k+1){
        $("#adversaire").append("<th>"+k+"</th>");
    }
    $("#adversaire").append("</tr>");
    var j = 1;
    var char = "A";
    for(j=11; j<=20; j=j+1){
        $("#adversaire").append("<tr id="+j+">");

            $("#"+j+"").append("<th>"+char+"</th>");
            var i = 1;
            for(i=1; i<=10; i = i+1){
                $("#"+j+"").append('<td><button data-yA='+(j-10)+' data-xA='+i+' class="btn teal btnAdv lighten-2 btn-small waves-effect disabled waves-light" name="action"></button></td>');
            }
            char = nextChar(char);
        $("#adversaire").append("</tr>");
    }
};

/**
 *  Fonction permettant de générer le tableau de jeu du joueur
 */
function generateTabJou(){
    var k = 1;
    $("#joueur").append("<tr id="+j+">");
    $("#joueur").append("<th></th>");
    for(k=1; k<=10; k=k+1){
        $("#joueur").append("<th>"+k+"</th>");
    }
    $("#joueur").append("</tr>");
    var j = 1;
    var char = "A";
    for(j=1; j<=10; j=j+1){
        $("#joueur").append("<tr id="+j+">");

            $("#"+j+"").append("<th>"+char+"</th>");
            var i = 1;
            for(i=1; i<=10; i = i+1){
                $("#"+j+"").append('<td data-y="'+j+'"+" data-x="'+i+'"><button class="btn teal lighten-2 btn-small waves-effect waves-light frame-drop" name="action"></button></td>');
            }
            char = nextChar(char);
        $("#joueur").append("</tr>");
    }
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

/**
 * Cette fonction permet d'initialiser la partie (Récupération de la liste des parties)
 * @return {[type]} [description]
 */
function init(){
    // Initialise le fonctionnement de la pop-up
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
}
