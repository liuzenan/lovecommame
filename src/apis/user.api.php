<?php

//include_once '../model/User.php';

function get_user($uid) {
    $query = mysql_query("SELECT * from users where uid = '$uid'");
    if (!$query) {
        die(mysql_error());
    }
    $row = mysql_fetch_assoc($query);
    if ($row) {
        $user = new User();
        $user->setUid($row['uid']);
        $user->setUname($row['uname']);
        $user->setMail($row['mail']);

        return $user;
    } else {
        return FALSE;
    }
}

function insert_user(User $user) {
    $uname = mysql_escape_string($user->getUname());
    $pass = mysql_escape_string($user->getPass());
    $mail = mysql_escape_string($user->getMail());
    $query = mysql_query("INSERT into users (uname, pass, mail) values ('$uname', '$pass', '$mail')");
    if (!$query) {
        die(mysql_error());
    }
    //return the uid of the user inserted
    $query = mysql_query("SELECT LAST_INSERT_ID() id");
    $id = mysql_fetch_assoc($query);
    $id = $id['id'];
    
    return $id;
}

?>
