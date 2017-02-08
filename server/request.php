<?php

header('Content-Type: application/json');
//
// Ce fichier permettra de traiter toutes les requêtes provenant de différents
//

// Le type de la requete sera défini par $_GET['no_req']

$tableauJoueur = array("Nbjoueur" => 0, "liste" => array("joueur1" => "tata", "joueur2" => "titi"));


switch($_GET['no_req']){

    case 0:
        echo json_encode(array("1"=>"bonjour","2"=>"aurevoir"));
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
        SaisirJoueur($_GET['pseudo'],'partieTest.json');
        echo json_encode(getNomAndNbJoueurs('partieTest.json'));
        break;

    case 7:
        // Réinitialisation du fichier JSON
        break;

    case 8:
        $json = json_decode(file_get_contents('config.json'));
        echo json_encode($json);
        break;

    default:
        echo "Erreur : pas de param";

}


function SaisirJoueur($pseudoJ, $fichierPartie){
        $json = json_decode(file_get_contents($fichierPartie));

        if($json->{'infos_partie'}->{'nbjoueurs'}==0){

            $json->{'infos_partie'}->{'pseudo_j1'}=$pseudoJ;
            $json->{'infos_partie'}->{'nbjoueurs'}="1";
        }
        else if($json->{'infos_partie'}->{'nbjoueurs'}==1){

            $json->{'infos_partie'}->{'pseudo_j2'}=$pseudoJ;
            $json->{'infos_partie'}->{'nbjoueurs'}="2";
        }else{
            //Création d'un nouveau fichier pour une nouvelle partie
            echo "Erreur : partie pleine";
        }

        $json = json_encode($json);
        file_put_contents($fichierPartie,$json);
}

function resetFichierPartie($fichierPartie){

    $modele = file_get_contents('modele.json');
    file_put_contents($fichierPartie, $modele);
}

function getNomAndNbJoueurs($Fichierpartie){
    $json = json_decode(file_get_contents($Fichierpartie));

    $result = array(
        "Nb"=>$json->{'infos_partie'}->{'nbjoueurs'},
        "j1"=>$json->{'infos_partie'}->{'pseudo_j1'},
        "j2"=>$json->{'infos_partie'}->{'pseudo_j2'}
    );
    return $result;

}
?>
