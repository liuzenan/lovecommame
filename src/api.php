<?php

require_once 'Slim/Slim.php';
require_once 'model/PostCard.php';
require_once 'model/User.php';
require_once 'model/UserPostCard.php';
require_once 'model/AnonPostCard.php';
require_once 'model/Contact.php';
require_once 'model/Photo.php';
require_once 'config.php';
require_once 'apis/postcard.api.php';
require_once 'apis/user.api.php';
require_once 'apis/contact.api.php';
require_once 'apis/photo.api.php';
require_once 'apis/authentication.api.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();
db_connect();
// GET route
$app->get('/postcard/:pid', function ($pid) use($app) {
            $note = get_postcard($pid);
            if (!$note) {
                $app->response()->status(404);
                $app->response()->write('The requested postcard does not exist');
                $app->response();
            } else {
                $return = $note->getPostCard();

                $user_from = get_user($note->getUid_from());
                if (!$user_from) {
                    $user_from = NULL;
                }
                $return->uid_from = $user_from->getUser();

                if (get_class($note) == 'UserPostCard') {
                    $user_to = get_user($note->getUid_to());
                    if (!$user_to) {
                        $user_to = NULL;
                    } else {
                        $return->uid_to = $user_to->getUser();
                    }
                } else {
                    $return->mail_to = $note->getMail_to();
                }
                if ($return->fid != -1) {
                    $return->photo = get_photo($return->fid)->getPhoto();
                }
                unset($return->fid);
                $app->response()->status(200);
                $app->response()->write(json_encode($return));
                $app->response();
            }
        });

// POST route
$app->post('/postcard/', function () use($app) {
            $access_token = $_POST['token'];
            if (authenticate_request($access_token, $_POST['uid_from'])) {

                $note = new PostCard();
                if (!empty($_POST['data_url'])) { //so photo is also uploaded
                    $photo = new Photo();
                    $photo->setTop($_POST['top']);
                    $photo->setLeft($_POST['left']);
                    $photo->setWidth($_POST['width']);
                    $photo->setHeight($_POST['height']);
                    $photo->setEffect($_POST['photo_effect']);

                    $data_url = parseDataUrl($_POST['data_url']);
                    $extension = $data_url['extension'];
                    $file = $data_url['file'];
                    $fileName = getPhotoName($extension);
                    file_put_contents($fileName, $file);
                    $photo->setUri($fileName);
                    $fid = save_photo($photo);
                    $note->setFid($fid);
                } else {
                    $fid = rand(1, 2);
                    $note->setFid($fid);
                }
                $note->setBody($_POST['body']);
                $note->setBody_effect($_POST['body_effect']);
                $note->setPostcard_effect($_POST['postcard_effect']);
                $note->setUid_from($_POST['uid_from']);
                $note->setStatus($_POST['status']);
                $note->setPublic($_POST['public_card']);
                $note->setTimestamp(time());
                $id = insert_postcard($note, $_POST['mail']);

                if ($id) {
                    $app->response()->status(200);
                    $app->response()->write($id); //return the pid of the postcard instead?
                    $app->response();
                } else {
                    $app->response()->status(500); //??
                    $app->response()->write("insert into the database failed");
                    $app->response();
                }
            } else {
                $app->response()->status(401); //??
                $app->response()->write("Not authorised, pls login");
                $app->response();
            }
        });

// DELETE route - delete
//$app->delete('/postcard/:nid', function ($pid) {
//    if(authenticate_request($_, $uid))
//            if (delete_postcard($pid)) {
//                //default response should suffice
//            } else {
//                $app->response()->status(500);
//                $app->response()->write("deleting of postcard failed");
//                $app->response();
//            }
//        });
//api to update the entire postcard based on the pid
$app->put('/postcard/:pid', function($pid) use ($app) {
            $orginal_postcard = get_postcard($pid);
            $request = $app->request();
            $_PUT = $request->params();
            if (!empty($_PUT['data_url'])) { //photo has been uploaded
                $data_url = parseDataUrl($_PUT['data_url']);
                $extension = $data_url['extension'];
                $fid = get_postcard($pid)->getFid();

                $fileName = getPhotoName($extension);

                $photo = new Photo();
                $photo->setTop($_PUT['top']);
                $photo->setLeft($_PUT['left']);
                $photo->setHeight($_PUT['height']);
                $photo->setWidth($_PUT['width']);
                $photo->setEffect($_PUT['photo_effect']);
                $photo->setUri($fileName);

                $file = $data_url['file'];
                file_put_contents($fileName, $file);

                update_photo($photo, $fid);
            }
            
            $postcard = new PostCard();
            $postcard->setBody($_PUT['body']);
            $postcard->setBody_effect($_PUT['body_effect']);
            $postcard->setUid_from($_PUT['uid_from']);
            $postcard->setStatus($_PUT['status']);
            $postcard->setPublic($_PUT['public_card']);
            $postcard->setPostcard_effect($_PUT['postcard_effect']);
            $postcard->setFid($orginal_postcard->getFid());
            $postcard->setTimestamp(time());
            update_postcard($pid, $postcard, $_PUT['mail']);
        });
$app->get('/user/:uid', function($uid) use($app) {
            if (authenticate_request($_GET['token'], $uid)) {
                $user = get_user($uid);
                if (!$user) {
                    $app->response()->status(404);
                    $app->response()->write("User not found");
                    $app->response();
                } else {
                    $return = $user->getUser();
                    $postcard_type[0] = 'draft';
                    $postcard_type[1] = 'unread';
                    $postcard_type[2] = 'read';
                    $postcard_type[3] = 'archived';
                    $postcard_type[4] = 'sent';
                    for ($i = 0; $i < 5; $i++) {
                        $postcards = get_postcard_user($uid, $i);
                        $postcards_clone = array();
                        foreach ($postcards as $postcard) {
                            $temp_postcard = $postcard->getPostCard();
                            $temp_postcard->uid_from = get_user($temp_postcard->uid_from)->getUser();
                            if ($postcard->getType() == 0) {
                                $temp_postcard->mail_to = $postcard->getMail_to();
                            } else {
                                $temp_postcard->uid_to = get_user($postcard->getUid_to())->getUser();
                            }
                            if ($temp_postcard->fid != -1) {
                                $temp_postcard->photo = get_photo($temp_postcard->fid)->getPhoto();
                            }
                            unset($temp_postcard->fid);
                            $postcards_clone[] = $temp_postcard;
                        }
                        $type = $postcard_type[$i];
                        $return->$type = $postcards_clone;
                    }
                    //return some public postcards
                    $public_postcards = get_public_postcards(10);
                    $photo_cards = array();
                    foreach($public_postcards as $public_postcard) {
//                        $public_postcard = get_postcard($public_postcard->getFid())->getPostCard();
                        $public_postcard = $public_postcard->getPostCard();
                        $public_photo = get_photo($public_postcard->fid)->getPhoto();
                        $public_postcard->photo = $public_photo;
                        unset($public_postcard->fid);
                        $photo_cards[] = $public_postcard;
                    }
                    $return->public = $photo_cards;
                    
                    $contacts = get_contacts_user($uid);
                    $contacts_clone = array();
                    foreach ($contacts as $contact) {
                        $contacts_clone[] = $contact->getContact();
                    }
                    $return->contacts = $contacts_clone;
                    echo json_encode($return);
                }
            } else {
                $app->response()->status(401); //??
                $app->response()->write("Not authorised, pls login");
                $app->response();
            }
        });
//adding in a new user and log him in as well
$app->post('/user/', function() use ($app) {
            //return error if the mailid already exists
            $mail = $_POST['mail'];
            $query = mysql_query("SELECT * from users where mail = '$mail'");
            $flag = true;
            if (mysql_num_rows($query) > 0) {
                $flag = FALSE;
                $app->response()->status(500); //??
                $app->response()->write("Mail id already in use");
                $app->response();
            } else if ($flag) {
                $user = new User();
                $user->setUname($_POST['uname']);
                $user->setMail($_POST['mail']);

                $pass = base64_decode($_POST['pass']);
                //generate a random salt
                $salt = hash('sha256', uniqid(mt_rand()) . $_POST['uname'] . 'haha');
                //adding the salt to the password

                $hash = $salt . $pass;
                $hash = hash('sha256', $hash);

                //storing the salt for later
                $hash = $salt . $hash;
                $user->setPass($hash);

                $uid = insert_user($user);
                insert_new_postcards($mail, $uid);

                $token = get_token($uid);
                $return = new stdClass();
                $return->uid = $uid;
                $return->token = $token;
                echo json_encode($return);
            }
        });

$app->post('/user/login', function () use ($app) {
            $mail = $_POST['uname'];
            $pass = $_POST['pass'];
            $decoded_pass = base64_decode($pass);

            if (($uid = authenticate_user($mail, $decoded_pass)) != FALSE) {
                $token = get_token($uid);
                $return = new stdClass();
                $return->uid = $uid;
                $return->token = $token;
                echo json_encode($return);
            } else {
                $app->response()->status(401);
                $app->response()->write("User not authorised");
                $app->response();
            }
        });

//mysql_close();
//disconnect from the db?
$app->run();
