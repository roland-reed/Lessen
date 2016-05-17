<?php
#!/usr/bin/php5 -q
require_once("conn.php");

$course_array = array();
$get_course   = "SELECT DISTINCT `code` FROM `course`";
$get_course_q = mysql_query($get_course);
while ($row = mysql_fetch_array($get_course_q)) {
    array_push($course_array, $row['code']);
}
foreach ($course_array as $code) {              
    $count_sql   = "SELECT COUNT(`id`) AS 'count' FROM `rate`  WHERE `code` = '$code'";
    $count_sql_q = mysql_query($count_sql);
    $count_arr   = mysql_fetch_array($count_sql_q);
    $count       = $count_arr['count'];
    $time        = time();
    
    if ($count > 0) {
        $roll_most_sql   = "SELECT `roll`,COUNT('*') AS 'count' FROM `rate` WHERE `code` = '$code' GROUP BY `roll` ORDER BY `count` DESC LIMIT 1";
        $roll_most_sql_q = mysql_query($roll_most_sql);
        $roll_most_arr   = mysql_fetch_array($roll_most_sql_q);
        $roll_most_value = $roll_most_arr['roll'];
        $roll_most_times = $roll_most_arr['count'];
        $roll_percent    = intval($roll_most_times / $count * 100);
        
        $exam_most_sql   = "SELECT `exam`,COUNT('*') AS 'count' FROM `rate` WHERE `code` = '$code' GROUP BY `exam` ORDER BY `count` DESC LIMIT 1";
        $exam_most_sql_q = mysql_query($exam_most_sql);
        $exam_most_arr   = mysql_fetch_array($exam_most_sql_q);
        $exam_most_value = $exam_most_arr['exam'];
        $exam_most_times = $exam_most_arr['count'];
        $exam_percent    = intval($exam_most_times / $count * 100);
        
        $score_sql   = "SELECT AVG(`score`) AS 'avg' FROM `rate` WHERE `code` = '$code'";
        $score_sql_q = mysql_query($score_sql);
        $score_arr   = mysql_fetch_array($score_sql_q);
        $score       = intval($score_arr['avg']);
        
        $teacher_score_sql   = "SELECT AVG(`teacher_score`) AS 'avg' FROM `rate` WHERE `code` = '$code'";
        $teacher_score_sql_q = mysql_query($teacher_score_sql);
        $teacher_score_arr   = mysql_fetch_array($teacher_score_sql_q);
        $teacher_score       = intval($teacher_score_arr['avg'] * 100);
        
        $update_sql = "UPDATE `course` SET `roll` = $roll_most_value, `roll_percent` = $roll_percent, `exam` = $exam_most_value,
		`exam_percent` = $exam_percent, `score` = $score, `teacher_score` = $teacher_score WHERE `code` = '$code'";
		mysql_query($update_sql);
    }
}