<?php

class Contact {
    private $cid;
    private $uid;
    private $name;
    private $mail;
    
    function __construct() {
        
    }
    public function getCid() {
        return $this->cid;
    }

    public function setCid($cid) {
        $this->cid = $cid;
    }

    public function getUid() {
        return $this->uid;
    }

    public function setUid($uid) {
        $this->uid = $uid;
    }

    public function getName() {
        return $this->name;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function getMail() {
        return $this->mail;
    }

    public function setMail($mail) {
        $this->mail = $mail;
    }
    
    //return a stdClass so that it can work with json_encode
    public function getContact() {
        $return = new stdClass();
        $return->cid = $this->cid;
        $return->uid = $this->uid;
        $return->name = $this->name;
        $return->mail = $this->mail;
        return $return;
    }


}
?>
