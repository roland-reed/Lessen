<?php
require_once("conn.php");

function server_error() {
    $res = array(
        "code" => 500,
        "msg" => "服务器错误"
    );
    echo json_encode($res);
    exit;
}

if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'top':
            if (isset($_GET['type']) && intval($_GET['type']) !== 0) {
                $type = "WHERE `type` = " . $_GET['type'];
            } else {
                $type = "";
            }
            $sql   = "SELECT * FROM `course` " . $type . " GROUP BY `code` ORDER BY `score` DESC LIMIT 20";
            $sql_q = mysql_query($sql);
            $count = mysql_num_rows($sql_q);
            if ($count === 0) {
                $res = array(
                    "code" => 0,
                    "msg" => "ok",
                    "count" => $count
                );
            } else {
                $data = array();
                while ($row = mysql_fetch_array($sql_q)) {
                    $id      = $row['id'];
                    $code    = $row['code'];
                    $name    = $row['name'];
                    $teacher = $row['teacher'];
                    $type    = $row['type'];
                    $time    = $row['time'];
                    $score   = $row['score'];
                    
                    $rate_times_sql   = "SELECT COUNT(`id`) as 'rate_times' FROM `rate` WHERE `code` = '$code'";
                    $rate_times_sql_q = mysql_query($rate_times_sql);
                    $rate_times_arr   = mysql_fetch_array($rate_times_sql_q);
                    $rate_times       = $rate_times_arr['rate_times'];
                    
                    $comment_times_sql   = "SELECT COUNT(`id`) as 'comment_times' FROM `comment` WHERE `code` = '$code'";
                    $comment_times_sql_q = mysql_query($comment_times_sql);
                    $comment_times_arr   = mysql_fetch_array($comment_times_sql_q);
                    $comment_times       = $comment_times_arr['comment_times'];
                    
                    $single = array(
                        "id" => $id,
                        "code" => $code,
                        "name" => $name,
                        "teacher" => $teacher,
                        "type" => $type,
                        "time" => $time,
                        "score" => $score,
                        "rateTimes" => $rate_times,
                        "commentTimes" => $comment_times
                    );
                    array_push($data, $single);
                }
                $res = array(
                    "code" => 0,
                    "msg" => "ok",
                    "count" => $count,
                    "data" => $data
                );
            }
            echo json_encode($res);
            break;
        
        case 'filter':
            if (!isset($_POST['type']) || !isset($_POST['time']) || !isset($_POST['score']) || !isset($_POST['roll']) || !isset($_POST['exam'])) {
                $res = array(
                    "code" => 0,
                    "msg" => "ok",
                    "count" => 0
                );
            } else {
                $score         = intval($_POST['score']);
                $roll          = intval($_POST['roll']);
                $exam          = intval($_POST['exam']);
                $type          = intval($_POST['type']);
                $time          = intval($_POST['time']);
                $condition_arr = array();
                if ($roll !== 0) {
                    $roll_sql = "`roll` = '$roll'";
                    array_push($condition_arr, $roll_sql);
                }
                
                if ($exam !== 0) {
                    $exam_sql = "`exam` = '$exam'";
                    array_push($condition_arr, $exam_sql);
                }
                
                if ($type !== 0) {
                    $type_sql = "`type` = '$type'";
                    array_push($condition_arr, $type_sql);
                }
                
                if ($time !== 0) {
                    $time_sql = "`time` = '$time'";
                    array_push($condition_arr, $time_sql);
                }
                
                if (count($condition_arr) > 0) {
                    $condition = "WHERE " . implode(" AND ", $condition_arr);
                } else {
                    $condition = implode(" AND ", $condition_arr);
                }
                if ($score === 0) {
                    $score_sql = "";
                } elseif ($score === 1) {
                    $score_sql = " ORDER BY `score` ASC";
                } elseif ($score === 2) {
                    $score_sql = " ORDER BY `score` DESC";
                }
            }
            $sql   = "SELECT * FROM `course` " . $condition . $score_sql;
            $sql_q = mysql_query($sql);
            if (empty($sql_q)) {
                $res = array(
                    "code" => 0,
                    "msg" => "ok",
                    "count" => 0
                );
            } else {
                $data  = array();
                $count = mysql_num_rows($sql_q);
                while ($row = mysql_fetch_array($sql_q)) {
                    $id            = $row['id'];
                    $code          = $row['code'];
                    $name          = $row['name'];
                    $teacher       = $row['teacher'];
                    $type          = $row['type'];
                    $time          = $row['time'];
                    $score         = $row['score'];
                    $rate_times    = $row['rate_times'];
                    $comment_times = $row['comment_times'];
                    $single        = array(
                        "id" => $id,
                        "code" => $code,
                        "name" => $name,
                        "teacher" => $teacher,
                        "type" => $type,
                        "time" => $time,
                        "score" => $score,
                        "rateTimes" => $rate_times,
                        "commentTimes" => $comment_times
                    );
                    array_push($data, $single);
                }
                $res = array(
                    "code" => 0,
                    "msg" => "ok",
                    "count" => $count,
                    "data" => $data
                );
            }
            echo json_encode($res);
            break;
        
        case 'search':
            if (isset($_GET['q'])) {
                $q   = addslashes($_GET['q']);
                $sql = "SELECT * FROM `course` WHERE `name` LIKE '%$q%'";
            }
            $sql_q = mysql_query($sql);
            if (empty($sql_q)) {
                $res = array(
                    "code" => 0,
                    "msg" => "ok",
                    "count" => 0
                );
            } else {
                $data  = array();
                $count = mysql_num_rows($sql_q);
                while ($row = mysql_fetch_array($sql_q)) {
                    $id            = $row['id'];
                    $code          = $row['code'];
                    $name          = $row['name'];
                    $teacher       = $row['teacher'];
                    $type          = $row['type'];
                    $time          = $row['time'];
                    $score         = $row['score'];
                    $rate_times    = $row['rate_times'];
                    $comment_times = $row['comment_times'];
                    $single        = array(
                        "id" => $id,
                        "code" => $code,
                        "name" => $name,
                        "teacher" => $teacher,
                        "type" => $type,
                        "time" => $time,
                        "score" => $score,
                        "rateTimes" => $rate_times,
                        "commentTimes" => $comment_times
                    );
                    array_push($data, $single);
                }
                $res = array(
                    "code" => 0,
                    "msg" => "ok",
                    "count" => $count,
                    "data" => $data
                );
            }
            echo json_encode($res);
            break;
        
        case 'detail':
            if (isset($_GET['id'])) {
                $id    = $_GET['id'];
                $sql   = "SELECT * FROM `course` WHERE `id` = '$id'";
                $sql_q = mysql_query($sql);
                if (empty($sql_q)) {
                    $res = array(
                        "code" => 0,
                        "msg" => "ok",
                        "count" => 0
                    );
                } else {
                    $data  = array();
                    $count = mysql_num_rows($sql_q);
                    while ($row = mysql_fetch_array($sql_q)) {
                        $id                = $row['id'];
                        $code              = $row['code'];
                        $name              = $row['name'];
                        $teacher           = $row['teacher'];
                        $teacher_score     = $row['teacher_score'];
                        $type              = $row['type'];
                        $time              = $row['time'];
                        $score             = $row['score'];
                        $roll              = $row['roll'];
                        $roll_percent      = $row['roll_percent'];
                        $exam              = $row['exam'];
                        $exam_percent      = $row['exam_percent'];
                        $comment_array     = array();
                        $get_comment_sql   = "SELECT * FROM `comment` WHERE `code` = '$code'";
                        $get_comment_sql_q = mysql_query($get_comment_sql);
                        while ($row = mysql_fetch_array($get_comment_sql_q)) {
                            $comment = array(
                                "content" => $row['content']
                            );
                            array_push($comment_array, $comment);
                        }
                        $rate_times_sql   = "SELECT COUNT(`id`) as 'rate_times' FROM `rate` WHERE `code` = '$code'";
                        $rate_times_sql_q = mysql_query($rate_times_sql);
                        $rate_times_arr   = mysql_fetch_array($rate_times_sql_q);
                        $rate_times       = $rate_times_arr['rate_times'];
                        
                        $comment_times_sql   = "SELECT COUNT(`id`) as 'comment_times' FROM `comment` WHERE `code` = '$code'";
                        $comment_times_sql_q = mysql_query($comment_times_sql);
                        $comment_times_arr   = mysql_fetch_array($comment_times_sql_q);
                        $comment_times       = $comment_times_arr['comment_times'];
                        
                        $single = array(
                            "id" => $id,
                            "code" => $code,
                            "name" => $name,
                            "teacher" => $teacher,
                            "teacherScore" => $teacher_score,
                            "type" => $type,
                            "roll" => $roll,
                            "rollPercent" => $roll_percent,
                            "exam" => $exam,
                            "examPercent" => $exam_percent,
                            "time" => $time,
                            "score" => $score,
                            "rateTimes" => $rate_times,
                            "commentTimes" => $comment_times,
                            "detailComment" => $comment_array
                        );
                        array_push($data, $single);
                    }
                    $res = array(
                        "code" => 0,
                        "msg" => "ok",
                        "count" => $count,
                        "data" => $data
                    );
                }
                echo json_encode($res);
            }
            break;
        
        case 'rate':
            if (isset($_POST['code']) && isset($_POST['roll']) && isset($_POST['exam']) && isset($_POST['teacherScore'])) {
                $code          = $_POST['code'];
                $teacher_score = intval($_POST['teacherScore']);
                $roll          = intval($_POST['roll']);
                $exam          = intval($_POST['exam']);
                if ($teacher_score > 10 || $teacher_score < 0 || $roll > 4 || $roll < 1 || $exam > 3 || $exam < 1) {
                    server_error();
                }
                $score = $teacher_score * 3 + $roll * 10 + $exam * 10;
                if (isset($_POST['comment']) && $_POST['comment'] !== "") {
                    $comment     = addslashes($_POST['comment']);
                    $time        = time();
                    $comment_sql = "INSERT INTO `comment` (`code`, `content`, `time`)
					VALUES ('$code', '$comment', '$time')";
                    mysql_query($comment_sql);
                }
                $sql = "INSERT INTO `rate` (`code`, `roll`, `exam`, `teacher_score`, `score`)
				VALUES ('$code', '$roll', '$exam', '$teacher_score', '$score')";
                if (mysql_query($sql)) {
                    $res = array(
                        "code" => 0,
                        "msg" => "ok"
                    );
                    echo json_encode($res);
                }
            }
            break;

        mysql_close();
    }
}