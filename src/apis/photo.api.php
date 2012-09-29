<?php

function save_photo(Photo $photo) {
    $effect = $photo->getEffect();
    $height = $photo->getHeight();
    $left = $photo->getLeft();
    $top = $photo->getTop();
    $uri = mysql_escape_string($photo->getUri());
    $width = $photo->getWidth();

    $query = mysql_query("INSERT into photos (`uri`,`top`, `left`, `height`, `width`, `effect`) values ('$uri',$top, $left,$height, $width, $effect)");
    if (!$query) {
        die(mysql_error());
    }

    $query = mysql_query("SELECT LAST_INSERT_ID() id");
    $id = mysql_fetch_assoc($query);
    $id = $id['id'];

    return $id;
}

function get_photo($fid) {
    $query = mysql_query("SELECT * from photos where fid = '$fid'");
    if (!$query) {
        die(mysql_error());
    }

    while ($row = mysql_fetch_assoc($query)) {
        $photo = new Photo();
        $photo->setEffect($row['effect']);
        $photo->setFid($row['fid']);
        $photo->setHeight($row['height']);
        $photo->setLeft($row['left']);
        $photo->setTop($row['top']);
        $photo->setUri($row['uri']);
        $photo->setWidth($row['width']);
        return $photo;
    }
}

function update_photo($photo, $fid) {
    if ($fid == -1) {
        save_photo($photo);
    } else {
        $effect = $photo->getEffect();
        $height = $photo->getHeight();
        $left = $photo->getLeft();
        $top = $photo->getTop();
        $uri = mysql_escape_string($photo->getUri());
        $width = $photo->getWidth();

        $query = mysql_query("UPDATE photos set `uri` = '$uri',`top` = $top, `left` = $left, `height` = $height, `width` = $width, `effect` = $effect where `fid` = $fid");
        if (!$query) {
            die("sdf");
        }

        $query = mysql_query("SELECT LAST_INSERT_ID() id");
        $id = mysql_fetch_assoc($query);
        $id = $id['id'];

        return $id;
    }
}

function getPhotoName($extension) {
    $name = mysql_fetch_assoc(mysql_query("SELECT value from variables where mykey = 'photo_count'"));
    $name = $name['value'];
    $update = $name + 1;
    $query = mysql_query("UPDATE variables set value = '$update' where mykey = 'photo_count' ");
    $fileName = "image/" . $name . "." . $extension; //just to make it unique
    return $fileName;
}

function parseDataUrl($dataurl) {
    $image_data = explode('base64,', $dataurl);
    $image_data = base64_decode($image_data[1]);
    $length = strpos($dataurl, ";") - strpos($dataurl, "/");
    $extension = substr($dataurl, strpos($dataurl, "/") + 1, $length - 1);
    $return['extension'] = $extension;
    $return['file'] = $image_data;
    return $return;
}

?>
