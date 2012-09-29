<?php

//include_once '../model/PostCard.php';

function get_postcard($pid) {
    $query = mysql_query("SELECT * from postcard where pid = '$pid'");
    if (!$query) {
        die(mysql_error());
    }
    $row = mysql_fetch_assoc($query);
    if ($row) {

        if ($row['type'] == 0) {
            $note = new AnonPostCard();
            $query = mysql_fetch_assoc(mysql_query("SELECT mail_to from anon_postcard where pid = '$pid'"));
            $mail_to = $query['mail_to'];
            $note->setMail_to($mail_to);
        } else {
            $note = new UserPostCard();
            $query = mysql_fetch_assoc(mysql_query("SELECT uid_to from user_postcard where pid = '$pid'"));
            $uid_to = $query['uid_to'];
            $note->setUid_to($uid_to);
        }
        $note->setPid($row['pid']);
        $note->setBody($row['body']);
        $note->setStatus($row['status']);
        $note->setUid_from($row['uid_from']);
        $note->setTimestamp($row['timestamp']);
        $note->setFid($row['fid']);
        $note->setType($row['type']);
        $note->setPostcard_effect($row['postcard_effect']);
        $note->setBody_effect($row['body_effect']);
        $note->setPublic($row['public']);

        return $note;
    }
}

function insert_postcard(PostCard $note, $mail_to) {
//    var_dump($note);
    $body = mysql_escape_string($note->getBody());
    $uid_from = $note->getUid_from();
    $status = $note->getStatus();
    $timestamp = $note->getTimestamp();
    $fid = $note->getFid(); //@TODO: change
    $postcard_effect = $note->getPostcard_effect();
    $body_effect = $note->getBody_effect();
    $public = $note->getPublic();
//check if mail id belongs to existing user, if so update the mailto field
    $query = mysql_query("SELECT uid from users where mail = '$mail_to'");
    $row = mysql_fetch_array($query);
    if ($row) {
        $uid_to = $row['uid'];
        $query = mysql_query("INSERT into postcard (body, uid_from , status, timestamp, fid, type, postcard_effect, body_effect, public) values ('$body', $uid_from, $status, $timestamp, $fid, 1, $postcard_effect, $body_effect, $public)");
        if (!$query) {
            return FALSE;
        }
//find the pid of the inserted postcard
        $query = mysql_query("SELECT LAST_INSERT_ID() id");
        $id = mysql_fetch_assoc($query);
        $id = $id['id'];

        $query = mysql_query("INSERT into user_postcard (pid, uid_to) values ($id, $uid_to)");
        if (!$query) {
            die(mysql_error());
        }
    } else {
//add it to the unsent postcards table   
        $query = mysql_query("INSERT into postcard (body, uid_from , status, timestamp, fid, type, postcard_effect, body_effect, public) values ('$body', $uid_from, $status, $timestamp, $fid, 0, $postcard_effect, $body_effect, $public)");
        if (!$query) {
            return FALSE;
        }

        $query = mysql_query("SELECT LAST_INSERT_ID() id");
        $id = mysql_fetch_assoc($query);
        $id = $id['id'];

        $query = mysql_query("INSERT into anon_postcard (pid, mail_to) values ($id, '$mail_to')");
        if (!$query) {
            return FALSE;
        }

        //send a mail to the other person informing that he has got a postcard..
        $subject = urlencode("Love,Me Invitation");
        $mail = urlencode(get_user($uid_from)->getUname() . " has sent you a postcard. To view it please create an account at http://54.251.37.19/mobile");
        file_get_contents("http://memoriz.co/mail.php?mail=$mail_to&subject=$subject&message=$mail");
    }

    return $id;
}

//mostly wont be used cos deleting of postcards not there as of now
function delete_postcard($pid) {
    $query = mysql_query("DELETE from postcard where pid = '$pid'");
    if (!$query) {
        return FALSE;
    }
//delete from the other 2 tables also - can be optimised
    $query = mysql_query("DELETE from anon_postcard where pid = '$pid'");
    if (!$query) {
        return FALSE;
    }
    $query = mysql_query("DELETE from user_postcard where pid = '$pid'");
    if (!$query) {
        return FALSE;
    }
}

//NOT OVER
function update_postcard($pid, PostCard $postcard, $mail) {
    var_dump($postcard);
        var_dump($pid);
    $mail = mysql_escape_string($mail);
    //delete the postcard with the pid and insert it again
    delete_postcard($pid);
    $body = mysql_escape_string($postcard->getBody());
    $body_effect = $postcard->getBody_effect();
    $uid_from = $postcard->getUid_from();
    $fid = $postcard->getFid();
    $postcard_effect = $postcard->getPostcard_effect();
    $status = $postcard->getStatus();
    $public = $postcard->getPublic();
    $time = time();
    $type = 0;
    $query = mysql_query("SELECT uid from users where mail = '$mail'");
    if(!$query) {
        die('haha');
    }
    while ($row = mysql_fetch_assoc($query)) {
        $uid_to = $row['uid'];
        $type = 1;
    }
    echo $pid." "; echo $body." "; echo $uid_from." "; echo $status." "; echo $time." ";echo $fid." "; echo $type." "; echo $postcard_effect." "; echo $body_effect." "; echo $public;
//    $query = mysql_query("UPDATE postcard set body=$body, body_effect = $body_effect, fid = $fid, postcard_effect = $postcard_effect, status = $status, time = $time");    
    $query = mysql_query("INSERT into postcard (`pid`, `body`, `uid_from`, `status`, `timestamp`, `fid`, `type`, `postcard_effect`, `body_effect`, `public`) values ($pid, '$body', $uid_from, $status, $time, $fid, $type, $postcard_effect, $body_effect, $public)");
    if (!$query) {
        die(mysql_error());
    }
    if ($status == 0) {
        $query = mysql_query("INSERT into anon_postcard (pid, mail_to) values ($pid, '$mail')");
        if (!$query) {
            return FALSE;
        }
    } else {
        $query = mysql_query("INSERT into user_postcard (pid, uid_to) values ($pid, $uid_to)");
        if (!$query) {
            echo(9);die(mysql_error());
        }
    }
}

//returns an array of postcards given a uid
//type = 0 - draft //correct
//       1 - unread 
//       2 - read
//       3 - archived  
//       4 - sent 
//       5- recieved = read + unread + archived
//chack for 5?!!
function get_postcard_user($uid, $type = 5) {
    if ($type == 5) {
        $query = mysql_query("SELECT * from user_postcard inner join postcard on user_postcard.pid = postcard.pid and user_postcard.uid_to = '$uid' ORDER BY postcard.timestamp desc");
    } else if ($type == 4) {
        $query = mysql_query("SELECT pid from postcard where uid_from = '$uid' and status not in ('0') ORDER BY timestamp desc");
    } else if ($type == 0) {
        $query = mysql_query("SELECT pid from postcard where uid_from = '$uid' and status = 0 ORDER BY timestamp desc");
    } else {
        $query = mysql_query("SELECT * from user_postcard inner join postcard on user_postcard.pid = postcard.pid and user_postcard.uid_to = '$uid' and postcard.status = '$type' ORDER BY postcard.timestamp desc");
    }
    if (!$query) {
        die(mysql_error());
    }
//can be optimised
    $postcards = array();
    while ($row = mysql_fetch_assoc($query)) {
        $pid = $row['pid'];
        $postcards[] = get_postcard($pid);
    }
    return $postcards;
}

function get_public_postcards($limit) {
    $query = mysql_query("SELECT * from postcard where public = 1 LIMIT $limit");
    if(!$query) {
        die(mysql_error());
    }
    
    $postcards = array();
    while ($row = mysql_fetch_assoc($query)) {
        $postcards[] = get_postcard($row['pid']);
    }
    return $postcards;
    
}

function insert_new_postcards($mail, $uid) {
    $mail = mysql_escape_string($mail);
    $query = mysql_query("SELECT pid from anon_postcard where mail_to = '$mail'");
    if(!$query) {
        die(mysql_error());
    }
    while ($row = mysql_fetch_assoc($query)) {
        $pid = $row['pid'];
        $query = mysql_query("INSERT into user_postcard (pid, uid_to) values ($pid, '$uid')");
        if(!$query){
            die(mysql_error());
        }
    }
}

?>
