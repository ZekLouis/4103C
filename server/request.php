<?php

header('Content-Type: application/json');
//
// Ce fichier permettra de traiter toutes les requêtes provenant de différents
//

// Le type de la requete sera défini par $_GET['no_req']

$tableauJoueur = array("Nbjoueur" => 0, "liste" => array("joueur1" => "tata", "joueur2" => "titi"));


switch($_GET['no_req']){
    
    case 0:
        echo json_encode(array("bite"=>"bonjour","2"=>"aurevoir"));
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

}

?>
