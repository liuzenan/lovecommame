<?php

class User {

    private $uid;
    private $uname;
    private $pass;
    private $mail;
    
    public function User() {
        
    }
    public function getUid() {
        return $this->uid;
    }

    public function setUid($uid) {
        $this->uid = $uid;
    }

    public function getUname() {
        return $this->uname;
    }

    public function setUname($uname) {
        $this->uname = $uname;
    }

    public function getPass() {
        return $this->pass;
    }

    public function setPass($pass) {
        $this->pass = $pass;
    }

    public function getMail() {
        return $this->mail;
    }

    public function setMail($mail) {
        $this->mail = $mail;
    }

    public function getUser() {
        $user = new stdClass();
        $user->uid = $this->uid;
        $user->uname = $this->uname;
        //not sending the password
        $user->mail = $this->mail;
        return $user;
    }

}

?>
