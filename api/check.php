<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	
</body>
</html>
<?php
	require_once("conn.php");
	$get_course_sql = "SELECT * FROM course";
	$get_course_sql_q = mysql_query($get_course_sql);
	$course = array();
	$pre_course = "";
	$code = 0;
	while($row = mysql_fetch_array($get_course_sql_q)){
		$name = $row['name'];
		$teacher = $row['teacher'];
		$type = $row['type'];
		$time = $row['time'];
		$type = $row['type'];
		$teacher_array = explode(",", $teacher);
		sort($teacher_array);
		$teacher_str = implode("、", $teacher_array);
		$cur_course = $name.",".$teacher_str;
		if($cur_course !== $pre_course){
			$code++;
			array_push($course, $code.",".$type.",".$name.",".$teacher_str.",".$time);
			$pre_course = $cur_course;
		}else{
			array_push($course, $code.",".$type.",".$name.",".$teacher_str.",".$time);
		}
	}
	// $course = array_unique($course);
	foreach ($course as  $value) {
		echo $value."<br />";
	}
?>