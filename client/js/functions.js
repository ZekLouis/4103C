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
