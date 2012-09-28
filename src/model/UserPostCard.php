<?php

class UserPostCard extends PostCard {

    private $uid_to;

    public function UserPostCard() {
        
    }

    public function getUid_to() {
        return $this->uid_to;
    }

    public function setUid_to($uid_to) {
        $this->uid_to = $uid_to;
    }

}

?>
