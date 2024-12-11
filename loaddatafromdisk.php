<?php

if (isset($_GET['filename'])) {
    $fileName = $_GET['filename'];
}
 
$js = file_get_contents($fileName);

echo $js;

 
?>