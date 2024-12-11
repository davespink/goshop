<?php

if (isset($_GET['user'])) {
    $user = $_GET['user'];
}

$fileName = "autosave_" . $user . ".txt";
 
 
$js = file_get_contents($fileName);

echo $js;

 
?>