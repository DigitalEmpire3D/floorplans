<?php
$model = trim($_REQUEST['mod']);
$community =  trim($_REQUEST['com']);

$show = trim($_REQUEST['show']);
//echo $show;

// $database_name = "oakwood";
// $database_host = "localhost";
// $database_username = "digitalempire";
// $database_password = "MqQznirpG0QHWI3j";
$database_name = "oakwood";
$database_host = "digitalempiredev-mysql.cc9pofoc7sbs.us-west-1.rds.amazonaws.com";
$database_username = "digitalempiredev";
$database_password = "ugz-S63-CDK-syB";

$db = new mysqli($database_host, $database_username, $database_password, $database_name);

if(strlen($community) > 0) {
	$sql = "SELECT * FROM models WHERE `ModelRID` = '$model' AND `communityRID` = '$community'";
} else {
	$sql = "SELECT * FROM models WHERE `ModelRID` = '$model'";
}

if(!$result = $db->query($sql)) {
	die('There was an error running the query [' . $db->error . ']');
}

if($show == "print") {
	echo "<pre>";
}
// echo "<pre>";
$rows = array();
while($row = $result->fetch_assoc()){
	//$rows[] = stripslashes($row);
	$rows[] = $row;
	//print_r($row);
}
foreach ($rows as $key => $value) {
	//$rows[$key] = stripslashes($value);
	//echo $value;
}
if($show == "print") {
	//echo $rows['Options'];
	//print_r($rows);
	$decoded = json_decode($rows[0]['Options']);
	print_r($decoded);
} else {
	print json_encode($rows);
}

?>