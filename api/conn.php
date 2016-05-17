<?php
$con = mysql_connect("localhost","root","");
if($con){
	 mysql_select_db("test");
}else{
	die("Could not connect:" . mysql_error());
}
mysql_query("set names utf8");
?>