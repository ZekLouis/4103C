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
    	$json = json_decode(file_get_contents('data.json'));

    	foreach ($json->liste as $joueur) {
	    	echo $joueur;
		}
        break;

    case 5:

        error_reporting(~0); ini_set('display_errors', 1);
        $string = htmlspecialchars(file_get_contents('beta.json'));
        $json = json_decode($string, true);
        echo "Json".$json;
        foreach($json as $key=>$value) {
            if (!is_array($value)) {
                echo $key . '=>' . $value . '<br />';
            } else {
                foreach ($value as $key=>$val) {
                    echo $key . '=>' . $val . '<br />';
                }
            }
        }
        break;


        case 6:
            echo json_encode(array("pseudo"=>$_GET['pseudo']));
            //Insertion de $_GET['pseudo'] dans le json
            //Incrémentation du nb joueurs dans le json

            // return le nom d'un autre joueur s'il y a
            // return le nombre de joueurs
            break;

        case 7:
            // Réinitialisation du fichier JSON
            break;
    default:
        echo "Erreur : pas de param";

}

?>
