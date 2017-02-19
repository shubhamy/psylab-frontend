<?php
$app->get('/session', function() {
    $db = new DbHandler();
    $session = $db->getSession();
    $response["uid"] = $session['uid'];
    $response["userid"] = $session['userid'];
    $response["name"] = $session['name'];
    echoResponse(200, $session);
});
$app->post('/login', function() use ($app) {
    require_once 'passwordHash.php';
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('userid', 'password'),$r->adminuser);
    $response = array();
    $db = new DbHandler();
    $password = $r->adminuser->password;
    $userid = $r->adminuser->userid;
    $user = $db->getOneRecord("select uid,name,userid,password,created from users where userid='$userid'");
    if ($user != NULL) {
        if(passwordHash::check_password($user['password'],$password)){
        $response['status'] = "success";
        $response['message'] = 'Logged in successfully.';
        $response['name'] = $user['name'];
        $response['uid'] = $user['uid'];
        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['uid'] = $user['uid'];
        $_SESSION['userid'] = $userid;
        $_SESSION['name'] = $user['name'];
        } else {
            $response['status'] = "error";
            $response['message'] = 'Login failed. Incorrect credentials';
        }
    }else {
            $response['status'] = "error";
            $response['message'] = 'No such user is registered';
        }
    echoResponse(200, $response);
});
$app->post('/signUp', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('userid', 'name', 'password'),$r->adminuser);
    require_once 'passwordHash.php';
    $db = new DbHandler();
    $name = $r->adminuser->name;
    $userid = $r->adminuser->userid;
    $password = $r->adminuser->password;
    $isUserExists = $db->getOneRecord("select 1 from users where userid='$userid'");
    if(!$isUserExists){
        $r->adminuser->password = passwordHash::hash($password);
        $tabble_name = "users";
        $column_names = array('name', 'userid', 'password');
        $result = $db->insertIntoTable($r->adminuser, $column_names, $tabble_name);
        if ($result != NULL) {
            $response["status"] = "success";
            $response["message"] = "User account created successfully";
            $response["uid"] = $result;
            // if (!isset($_SESSION)) {
            //     session_start();
            // }
            // $_SESSION['uid'] = $response["uid"];
            // $_SESSION['name'] = $name;
            // $_SESSION['userid'] = $userid;
            echoResponse(200, $response);
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to create customer. Please try again";
            echoResponse(201, $response);
        }
    }else{
        $response["status"] = "error";
        $response["message"] = "An user with the provided userid exists!";
        echoResponse(201, $response);
    }
});
$app->get('/logout', function() {
    $db = new DbHandler();
    $session = $db->destroySession();
    $response["status"] = "info";
    $response["message"] = "Logged out successfully";
    echoResponse(200, $response);
});
?>
