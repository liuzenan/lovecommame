<?php

function get_contact ($cid) {
    $query = mysql_query("SELECT * from contacts where cid = '$cid'");
    if(!$query) {
        die(mysql_error());
    }
    while($row = mysql_fetch_assoc($query)) {
        $contact = new Contact();
        $contact->setCid($row['cid']);
        $contact->setMail($row['mail']);
        $contact->setName($row['name']);
        $contact->setUid($row['uid']);
        return $contact;
    }
}

//gets all the contacts of a user
function get_contacts_user($uid) {
    $query = mysql_query("SELECT cid from contacts where uid = '$uid'");
    if(!$query) {
        die(mysql_error());
    }
    $user_contacts = array();
    while($row = mysql_fetch_assoc($query)) {
        $user_contacts[] = get_contact($row['cid']);
    }
    return $user_contacts;
}
?>
