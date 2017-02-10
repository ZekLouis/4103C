<?php

header('Content-Type: application/json');
//
// Ce fichier permettra de traiter toutes les requêtes provenant de différents
//

/**
 * Liste des requêtes
 */

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


// Le type de la requete sera défini par $_GET['no_req']

switch($_GET['no_req']){

    case 0:
        creerPartie();
        break;

    case 1:
        echo json_encode('Récupérer le contenu du tableau 2');
        break;

    //inscrire nouveau joueur dans fichier JSON
    case 3:
    	file_put_contents('data.json', json_encode($tableauJoueur));
        break;

    case 4:
        resetFichierPartie('partieTest.json');
        break;

    case 5:
        $partie = 'partieTest.json';
        SaisirJoueur("titi",$partie);
        SaisirJoueur("toto",$partie);
        break;

    case 6:
        $pseudo = $_GET['pseudo'];
        $partie = $_GET['nomPartie'];
        SaisirJoueur($pseudo,$partie);
        echo json_encode(array("res"=>true));
        break;

    case 7:
        $pseudo = $_GET['pseudo'];
        $partie = $_GET['nomPartie'];
        RetirerJoueur($pseudo,$partie);
        echo json_encode(array("res"=>true));
        break;

    case 8:
        $json = json_decode(file_get_contents('config.json'));
        echo json_encode($json);
        break;

    case 9:
        $nomPartie = $_GET['nomPartie'];
        $pseudo = $_GET['pseudo'];
        $boat2 = $_GET['boat2'];
        $boat3a = $_GET['boat3a'];
        $boat3b = $_GET['boat3b'];
        $boat4 = $_GET['boat4'];
        $boat5 = $_GET['boat5'];
        $bateaux = array("boat2"=>$boat2,"boat3a"=>$boat3a,"boat3b"=>$boat3b,"boat4"=>$boat4,"boat5"=>$boat5);
        foreach ($bateaux as $nomBateau => $bateau) {
            insererBateau($bateau,$nomBateau,$pseudo,$nomPartie);
        }
        break;

    case 10:
        $nomPartie = $_GET['nomPartie'];
        $pseudo = $_GET['pseudo'];
        $x = $_GET['x'];
        $y = $_GET['y'];
        $resultat = checkCase($pseudo,$nomPartie,$x,$y);
        break;

    default:
        echo "Erreur : pas de param";

}


function creerPartie(){
     //$partiejson = json_decode(file_get_contents("./model.json"));
    $config = json_decode(file_get_contents("./config.json"));

    $i = 0;
    $taille=count($config->{"liste_partie"});

    foreach($config->{"liste_partie"} as $partie){
        if($partie->{"nbJoueurs"} <= 1){
            $partie->{"nbJoueurs"}+=1;
            file_put_contents('config.json', json_encode($config));
            break;
        }
        else if($partie->{"nbJoueurs"} == 2){
            //rien
        }
      $i += 1;
    }
    if($i == $taille){
        //création de l'objet
        $object = new stdClass();
        $object->name="partie".($taille+1).".json";
        $object->nbJoueurs=1;
        $config->{"liste_partie"}[$i]=$object;


        //création du fichier
        //fopen("partie".($taille+1).".json", "a+");
        shell_exec('cp ./model.json ./partie'.($taille+1).".json");
    }
    file_put_contents('config.json', json_encode($config));
}

function SaisirJoueur($pseudoJ, $fichierPartie){
        $fichierPartie = $fichierPartie.".json";

        // Modification du fichier de config
        $config = json_decode(file_get_contents("config.json"));
        $config->{"liste_partie"}[0]->{"nbJoueurs"} += 1;
        file_put_contents('config.json', json_encode($config));


        $json = json_decode(file_get_contents($fichierPartie));

        if($json->{'infos_partie'}->{'nbjoueurs'}==0){

            $json->{'infos_partie'}->{'pseudo_j1'}="$pseudoJ";
            $json->{'infos_partie'}->{'nbjoueurs'}=1;
        }else if($json->{'infos_partie'}->{'nbjoueurs'}==1){
            $json->{'infos_partie'}->{'pseudo_j2'}=$pseudoJ;
            $json->{'infos_partie'}->{'nbjoueurs'}=2;
        }else{
            //Création d'un nouveau fichier pour une nouvelle partie
            echo "Erreur : partie pleine";
        }

        $json = json_encode($json);
        file_put_contents($fichierPartie,$json);
}

function RetirerJoueur($pseudoJ, $fichierPartie){
        $fichierPartie = $fichierPartie.".json";

        // Modification du fichier de config
        $config = json_decode(file_get_contents("config.json"));
        
        if ($config->{"liste_partie"}[0]->{"nbJoueurs"} > 0 ){
          $config->{"liste_partie"}[0]->{"nbJoueurs"} -= 1;
        }
        file_put_contents('config.json', json_encode($config));


        $json = json_decode(file_get_contents($fichierPartie));

        if($json->{'infos_partie'}->{'pseudo_j1'}==$pseudoJ){

            $json->{'infos_partie'}->{'pseudo_j1'}="";
            $json->{'infos_partie'}->{'nbjoueurs'} -=1;
        }else if($json->{'infos_partie'}->{'pseudo_j2'}==$pseudoJ){
            $json->{'infos_partie'}->{'pseudo_j2'}="";
            $json->{'infos_partie'}->{'nbjoueurs'} -=1;
        }

        $json = json_encode($json);
        file_put_contents($fichierPartie,$json);
}

/**
 * Cette fonction permet de reinitialiser le fichier de partie
 * @param fichier $fichierPartie le fichier a reset
 */
function resetFichierPartie($fichierPartie){
    $modele = file_get_contents('modele.json');
    file_put_contents($fichierPartie, $modele);
}

/**
 * Cette fonction permet de retourner un tableau qui contient les informations d'une partie
 * @param  fichier $Fichierpartie le fichier à traiter
 * @return [array]                le tableau
 */
function getNomAndNbJoueurs($Fichierpartie){
    $json = json_decode(file_get_contents($Fichierpartie));

    $result = array(
        "Nb"=>$json->{'infos_partie'}->{'nbjoueurs'},
        "j1"=>$json->{'infos_partie'}->{'pseudo_j1'},
        "j2"=>$json->{'infos_partie'}->{'pseudo_j2'}
    );
    return $result;

}

/**
 * Cette fonction permet d'insérer un bateau dans le fichier en fonction du joueur et de la partie
 */
function insererBateau($bateau,$idBateau,$joueur,$partie){
    $json = json_decode(file_get_contents($partie.".json"));
    //print_r($json);
    if($json->{'infos_partie'}->{'pseudo_j1'}==$joueur){
        $idJoueur = "joueur1";
    }else{
        $idJoueur = "joueur2";
    }
    $bateauFichier = $json->{$idJoueur}->{$idBateau};
    for($i = 0; $i<sizeof($bateauFichier);$i++){
        $json->{$idJoueur}->{$idBateau} = json_decode($bateau);
    }


    var_dump($json);
    file_put_contents($partie.".json", json_encode($json));

    echo "for ".$joueur." dans ".$partie."\n";
}

function checkCase($pseudo,$nomPartie,$x,$y){

    return true;
}
?>
