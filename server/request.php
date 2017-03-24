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
        $partie = $_GET['nomPartie'];
        $tab = recupInfosPartie($partie);

        echo json_encode($tab);
        break;

    case 1:
        echo json_encode('Récupérer le contenu du tableau 2');
        break;

    //inscrire nouveau joueur dans fichier JSON
    case 3:
    	 file_put_contents('data.json', json_encode($tableauJoueur));
        break;

    case 4:
        resetFichierPartie('partie1.json');
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
        //$json = json_decode(file_get_contents('config.json'));
        echo file_get_contents('config.json');
        break;

    case 9:
        $nomPartie = $_GET['nomPartie'];
        $pseudo = $_GET['pseudo'];
        $boat2 = $_GET['boat2'];
        $boat3a = $_GET['boat3a'];
        $boat3b = $_GET['boat3b'];
        $boat4 = $_GET['boat4'];
        $boat5 = $_GET['boat5'];
        //$compteur = $_GET['compteur'];
        playersReady($pseudo, $nomPartie);

        $bateaux = array("boat2"=>$boat2,"boat3a"=>$boat3a,"boat3b"=>$boat3b,"boat4"=>$boat4,"boat5"=>$boat5);
        foreach ($bateaux as $nomBateau => $bateau) {
            insererBateau($bateau,$nomBateau,$pseudo,$nomPartie);
        }
        break;

    case 10:
        $nomPartie = $_GET['nomPartie'];
        if($nomPartie==""){
            die("Le nom de partie est null.");
        }
        $json = json_decode(file_get_contents($nomPartie.".json"));
        if($json->{'infos_partie'}->{'pseudo_j1'}==$_GET['pseudo']){
            $idJoueur = "joueur2";
        }else{
            $idJoueur = "joueur1";
        }

        $x = $_GET['x'];
        $y = $_GET['y'];
        $resultat = checkCase($idJoueur,$nomPartie,$x,$y);

        //On va maintenant intervertir les tours
        modifierLeTourDeJeu($nomPartie);
        echo json_encode(array("res"=>$resultat));

        break;

    default:
        echo "Erreur : pas de param";

}

function playersReady($pseudo, $nomPartie){
    $partie = $nomPartie.".json";

    $json =json_decode(file_get_contents($partie));

    if($json->{'infos_partie'}->{'pseudo_j1'} == $pseudo){
      $json->{'infos_partie'}->{'ready_j1'} = true;
    }
    else{
      $json->{'infos_partie'}->{'ready_j2'} = true;
    }

    file_put_contents($partie,json_encode($json));
}

/////////////////////////////////////////////////////////////////
//Cette fonction permute le tour de jeu
//Elle doit être appelée à chaque clic d'un des participants
//dès lors que les bateaux ont été placés
function modifierLeTourDeJeu($fichierPartie){
  $partie = $fichierPartie.".json";

  $json =json_decode(file_get_contents($partie));

  if($json->{'infos_partie'}->{'tour'} == "j1"){
      $json->{'infos_partie'}->{'tour'} = "j2";
  }
  else{
      $json->{'infos_partie'}->{'tour'} = "j1";
  }
  if($fichierPartie==null){
      die("Le nom de partie est null.");
  }else{
      file_put_contents($fichierPartie.".json",json_encode($json));
  }
}

//////////////////////////////////////////////////////////////////////////////
//Cette fonction permet de remplir le fichier config.json
//Il insère les joueurs en cours, les parties en cours, et créé des fichiers
//de parties si nécessaire
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
        if($fichierPartie==""){
            die("Le nom de partie est null.");
        }
        $fichierPartie = $fichierPartie.".json";

        // Modification du fichier de config
        $config = json_decode(file_get_contents("config.json"));


        //Cela ne marchera qu'avec la partie 1
        $config->{"liste_partie"}[0]->{"nbJoueurs"} = $config->{"liste_partie"}[0]->{"nbJoueurs"}+1;
        file_put_contents('config.json', json_encode($config));


        $json = json_decode(file_get_contents($fichierPartie));

        if($json->{'infos_partie'}->{'nbjoueurs'}==0){

            $json->{'infos_partie'}->{'pseudo_j1'}="$pseudoJ";
            $json->{'infos_partie'}->{'nbjoueurs'}=1;
            $json->{'infos_partie'}->{'tour'}="j1";

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
        if($fichierPartie==""){
            die("Le nom de partie est null.");
        }

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
            $json->{'infos_partie'}->{'ready_j1'}=false;
            $json->{'infos_partie'}->{'ready_j2'}=false;
        }else if($json->{'infos_partie'}->{'pseudo_j2'}==$pseudoJ){
            $json->{'infos_partie'}->{'pseudo_j2'}="";
            $json->{'infos_partie'}->{'nbjoueurs'} -=1;
            $json->{'infos_partie'}->{'ready_j1'}=false;
            $json->{'infos_partie'}->{'ready_j2'}=false;
        }

        $json = json_encode($json);
        file_put_contents($fichierPartie,$json);
}

/**
 * Cette fonction permet de reinitialiser le fichier de partie
 * @param fichier $fichierPartie le fichier a reset
 */
function resetFichierPartie($fichierPartie){
    if($fichierPartie==null){
        die("Le nom de la partie est null.");
    }
    $modele = file_get_contents('model.json');
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

    if($json->{'infos_partie'}->{'pseudo_j1'}==$joueur){
        $idJoueur = "joueur1";
    }else{
        $idJoueur = "joueur2";
    }
    $bateauFichier = $json->{$idJoueur}->{$idBateau};
    for($i = 0; $i<sizeof($bateauFichier);$i++){
        $json->{$idJoueur}->{$idBateau} = json_decode($bateau);
    }

    $json->{$idJoueur}->{"compteur"}->{$idBateau}->{"cp"} = 0;

    var_dump($json);
    if($partie==""){
        die("Le nom de la partie est null.");
    }
    file_put_contents($partie.".json", json_encode($json));

    echo "for ".$joueur." dans ".$partie."\n";
}

//////////////////////////////////////////////////////////////////////////////
//Cette fonction récupère les infos du fichier de la partie
//Ils seront récupérer côté client toutes les secondes
//pour mettre à jour l'état de la partie
function recupInfosPartie($fichierPartie){
        //ouverture du fichier
        if($fichierPartie==""){
            die("Le nom de la partie est null.");
        }
        $fichierPartie = $fichierPartie.".json";

        $json = json_decode(file_get_contents($fichierPartie));

        if ($json->{'infos_partie'}->{'tour'} == "j1"){
            $pseudoArecuperer = $json->{'infos_partie'}->{'pseudo_j1'};
        }
        else{
            $pseudoArecuperer = $json->{'infos_partie'}->{'pseudo_j2'};
        }
        //récupération des informations
        $tab_result = array(

          "tour"=> $json->{'infos_partie'}->{'tour'},
          "nbJoueurs"=> $json->{'infos_partie'}->{'nbjoueurs'},
          "pseudotour"=> $pseudoArecuperer,
          "ready_j1"=> $json->{'infos_partie'}->{'ready_j1'},
          "ready_j2"=> $json->{'infos_partie'}->{'ready_j2'},
          "pseudo_j1"=> $json->{'infos_partie'}->{'pseudo_j1'},
          "pseudo_j2"=> $json->{'infos_partie'}->{'pseudo_j2'},
        );

        return $tab_result;
}

function checkCase($pseudo,$nomPartie,$x,$y){
    $json = json_decode(file_get_contents($nomPartie.".json"));
    foreach($json->{$pseudo} as $key => $value){
        $cle = $key;
        foreach($json->{$pseudo}->{$key} as $key => $value){
            if($cle != "compteur"){
                if($value->{"x"}==$x and $value->{"y"}==$y){
                    $cp = $json->{$pseudo}->{"compteur"}->{$cle}->{"cp"};
                    $json->{$pseudo}->{"compteur"}->{$cle}->{"cp"} += 1;
                    file_put_contents($nomPartie.".json", json_encode($json));
                    // echo $cp;
                    // echo $json->{$pseudo}->{"compteur"}->{$cle}->{"max"};
                    if($cp+1 == $json->{$pseudo}->{"compteur"}->{$cle}->{"max"}){
                        return array("toucher"=>True,"couler"=>True);
                    }else{
                        return array("toucher"=>True,"couler"=>False);
                    }
                    
                }
            }
            
        }
    }
    return array("toucher"=>False,"couler"=>False);
}
?>
