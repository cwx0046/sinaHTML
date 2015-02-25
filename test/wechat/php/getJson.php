<?php

header('Content-type: text/json');

require_once "jssdk.php";
$jssdk = new JSSDK("wx9c1728f98917fa1a", "58785f41cdb8f078855989155363074e");
$signPackage = $jssdk->GetSignPackage();

$wei = array (
    "appId"     => $signPackage["appId"],
    "timestamp" => $signPackage["timestamp"],
    "nonceStr"  => $signPackage["nonceStr"],
    "signature" => $signPackage["signature"],
    "url"		=> $signPackage["url"]
);
echo " ".htmlspecialchars($_GET['callback']).'('.json_encode($wei).')';

//echo json_encode($wei);
?>
