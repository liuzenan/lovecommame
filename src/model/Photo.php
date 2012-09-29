<?php

class Photo {

    private $fid;
    private $uri;
    private $top;
    private $left;
    private $height;
    private $width;
    private $effect;

    public function Photo() {
        
    }

    public function getFid() {
        return $this->fid;
    }

    public function setFid($fid) {
        $this->fid = $fid;
    }

    public function getUri() {
        return $this->uri;
    }

    public function setUri($uri) {
        $this->uri = $uri;
    }

    public function getTop() {
        return $this->top;
    }

    public function setTop($top) {
        $this->top = $top;
    }

    public function getLeft() {
        return $this->left;
    }

    public function setLeft($left) {
        $this->left = $left;
    }

    public function getHeight() {
        return $this->height;
    }

    public function setHeight($height) {
        $this->height = $height;
    }

    public function getWidth() {
        return $this->width;
    }

    public function setWidth($width) {
        $this->width = $width;
    }

    public function getEffect() {
        return $this->effect;
    }

    public function setEffect($effect) {
        $this->effect = $effect;
    }
    
    public function getPhoto() {
        $photo = new stdClass();
        $photo->fid = $this->fid;
        $photo->uri = $this->uri;
        $photo->top = $this->top;
        $photo->left = $this->left;
        $photo->height = $this->height;
        $photo->width = $this->width;
        $photo->effect = $this->effect;
        return $photo;
    }

}

?>
