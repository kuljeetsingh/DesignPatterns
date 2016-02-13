<?php
include "DBCon.php";

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Content-Type:application/json");
$db = new DBCon();
$authToken = md5("get_messages");
$response = $db->select(array('*'))->get("estate");
if(empty($response)){
$response = array('status'=>0);
}
echo json_encode(array('properties'=>$response));
