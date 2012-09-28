<?php

class PostCard {

    private $pid;
    private $body;
    private $uid_from;
    private $status;
    private $timestamp;
    private $fid;
    private $type;
    private $postcard_effect;
    private $body_effect;
    private $public;

    public function PostCard() {
        $this->public = 0;
    }

    public function getPid() {
        return $this->pid;
    }

    public function setPid($pid) {
        $this->pid = $pid;
    }

    public function getBody() {
        return $this->body;
    }

    public function setBody($body) {
        $this->body = $body;
    }

    public function getUid_from() {
        return $this->uid_from;
    }

    public function setUid_from($uid_from) {
        $this->uid_from = $uid_from;
    }

    public function getStatus() {
        return $this->status;
    }

    public function setStatus($status) {
        $this->status = $status;
    }

    public function getTimestamp() {
        return $this->timestamp;
    }

    public function setTimestamp($timestamp) {
        $this->timestamp = $timestamp;
    }

    public function getFid() {
        return $this->fid;
    }

    public function setFid($fid) {
        $this->fid = $fid;
    }

    public function getType() {
        return $this->type;
    }

    public function setType($type) {
        $this->type = $type;
    }

    public function getPostcard_effect() {
        return $this->postcard_effect;
    }

    public function setPostcard_effect($postcard_effect) {
        $this->postcard_effect = $postcard_effect;
    }

    public function getBody_effect() {
        return $this->body_effect;
    }

    public function setBody_effect($body_effect) {
        $this->body_effect = $body_effect;
    }
    
    public function getPublic() {
        return $this->public;
    }

    public function setPublic($public) {
        $this->public = $public;
    }

    
    public function getPostCard() {
        $postcard = new stdClass();
        $postcard->pid = $this->pid;
        $postcard->body = new stdClass();
        $postcard->body->content = $this->body;
        $postcard->body->body_effect = $this->body_effect;
        $postcard->uid_from = $this->uid_from;
        $postcard->status = $this->status;
        $postcard->timestamp = $this->timestamp;
        $postcard->fid = $this->fid;
        $postcard->type = $this->type;
        $postcard->postcard_effect = $this->postcard_effect;
        $postcard->public = $this->public;
        return $postcard;
    }

}

?>
