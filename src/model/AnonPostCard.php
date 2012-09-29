<?php

class AnonPostCard extends PostCard {

    private $mail_to;

    public function AnonPostCard() {
        
    }

    public function getMail_to() {
        return $this->mail_to;
    }

    public function setMail_to($mail_to) {
        $this->mail_to = $mail_to;
    }

}

?>
