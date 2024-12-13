<?php
$data = $_POST['data'];

if (isset($_GET['user'])) {
    $user = $_GET['user'];
} else $user ="";

$file = "autosave_" .  $user . ".txt";

file_put_contents($file, $data);


echo "data saved";
