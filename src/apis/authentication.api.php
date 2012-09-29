<?php

function authenticate_user($mail, $entered_pass) {
    $mail = mysql_escape_string($mail);
    $query = mysql_query("SELECT  uid, pass from users where mail = '$mail'");
    if (!$query) {
        die(mysql_error());
    }
    while($row = mysql_fetch_assoc($query)) {
        $actual_password = $row['pass'];
        $salt = substr($actual_password, 0, 64);
        $hash = $salt.$entered_pass;
        $hash = hash('sha256', $hash);
        if($salt.$hash == $actual_password) {
            return $row['uid'];
        }
    }
    return FALSE;
}

function get_token($uid) {
    //keep trying to insert until success
    $time = time();
    $query2 = mysql_query("SELECT nonce from nonces where uid = '$uid' and maxtime > '$time'");
    if(!$query2) {
        die(mysql_error());
    }
    while($row = mysql_fetch_assoc($query2)) {
        $nonce = $row['nonce'];
        $maxtime = time() + 3*24*60*60;
        $query = mysql_query("UPDATE nonces set maxtime = $maxtime where uid = $uid");
        if(!$query) {
            die(mysql_error());
        }
        return $nonce;
    }
    
    //no valid token exists, generate a new token 
    $query = false;
    while (!$query) {
        //check if a valid token exists and return that token, and increase the expiry time
        $created = time();
        $maxtime = $created + 3 * 24 * 60 * 60; //3 days expiry dates
        $new_token = uniqid($uid . "_", true);
        $query = mysql_query("INSERT into nonces (nonce, uid, maxtime, created) VALUES ('$new_token', $uid, $maxtime, $created)");
    }

    return $new_token;
}

function authenticate_request ($token, $uid) {
    $time = time();
    $query = mysql_query("SELECT * from nonces where nonce = '$token' and uid = $uid and maxtime > $time");
    return(mysql_num_rows($query) > 0); 
}
?>
