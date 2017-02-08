<?php

header('Content-Type: application/json');
//
// Ce fichier permettra de traiter toutes les requêtes provenant de différents
//

// Le type de la requete sera défini par $_GET['no_req']

$tableauJoueur = array("Nbjoueur" => 0, "liste" => array("joueur1" => "tata", "joueur2" => "titi"));


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
        $object = new stdClass();
        $object->name="partie".($taille+1).".json";
        $object->nbJoueurs=1;
        $config->{"liste_partie"}[$i]=$object;
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
        $config->{"liste_partie"}[0]->{"nbJoueurs"} -= 1;
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
