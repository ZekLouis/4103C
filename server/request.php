<?php
//
// Ce fichier permettra de traiter toutes les requêtes provenant de différents
//

// Le type de la requete sera défini par $_GET['no_req']

switch($_GET['no_req']){
    case 0:
        echo json_encode("Nous sommes le retour de la requete 0");
        break;

    default:
        break;
}

?>