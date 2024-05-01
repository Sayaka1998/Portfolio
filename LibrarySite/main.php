<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require("./config.php");
require("./lendBookClass.php");

// check if the request method is post
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SERVER["PATH_INFO"])) {
        // If a user is logged in, check for session timeout and redirect to the login page if inactive
        if (isset($_POST["sid"])) {
            session_id($_POST["sid"]);
            session_start();
            // Check if the last activity time is set
            if (isset($_SESSION["last_activity"]) && $_SESSION["last_activity"] > time()) {
                // Update the last activity timestamp
                $_SESSION["last_activity"] = time() + 600;
            } else {
                session_unset();
                session_destroy();
            }
        }

        switch ($_SERVER["PATH_INFO"]) {
            case "/login":
                $loginUser = null;
                $flag = true; // to check if the user type is staff
                $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                if ($dbCon->connect_error) {
                    echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                    $dbCon->close();
                } else {
                    // Query to check if the entered email and user type match a record in the database
                    $result = $dbCon->query("SELECT * FROM user_tb WHERE email='" . $_POST["email"] . "' AND type='" . $_POST["type"] . "'");
                    // Fetch the result as an associative array
                    $user = $result->fetch_array();
                    if ($user > 0) { // if the user data exist on the database
                        if ($_POST["type"] === "Staff") { // if the user data is staff
                            // check if the user data exists on the approval table
                            $resultAppr = $dbCon->query("SELECT * FROM approval_tb WHERE uid = " . $user["uid"]);
                            if ($resultAppr->num_rows > 0) { // if the user data is pending, the user can't log in.
                                $flag = false;
                            }
                        }
                        if ($flag) { // if the user type is not staff or the staff data is already approved
                            // check if the user data is in the black list
                            $resultBlk = $dbCon->query("SELECT * FROM blacklst_tb WHERE uid = " . $user["uid"]);
                            if ($resultBlk->num_rows > 0) { // if the user data exists in the black list, the user can't login.
                                $loginUser = 0;
                                echo json_encode(["message" => "Account is locked due to too many unsuccessful login attempts."]);
                            } else {
                                // Verify the enterd password and the hashed password on the user table
                                if (password_verify($_POST["pass"], $user["pass"])) {
                                    if ($user["ecount"] != 5) {
                                        // Password is correct, reset login attempts
                                        $dbCon->query("UPDATE user_tb SET ecount = 5 WHERE uid=" . $user["uid"]);
                                    }
                                    // Set session variables for logged in user, and set timestamp for the last activity (login time)
                                    session_start();
                                    $_SESSION["loginUser"] = $user;
                                    $_SESSION["last_activity"] = time() + 600;
                                } else {
                                    $user["ecount"]--; // reduce the error count of password
                                    if ($user["ecount"] <= 0) { //Lock the user account after unsuccessful authentication attempts passes 5 times.
                                        $dbCon->query("INSERT INTO blacklst_tb (uid) VALUES (" . $user["uid"] . ")");
                                    }
                                    // update the ecount on the user table 
                                    $dbCon->query("UPDATE user_tb SET ecount=" . $user["ecount"] . " WHERE uid=" . $user["uid"]);
                                }
                            }
                        }
                    }
                }
                if (session_status() === 2) { // if session works, return the user type and session id to the front-end
                    $response = ["type" => $_SESSION["loginUser"]["type"], "sid" => session_id()];
                    echo json_encode($response);
                } else if ($loginUser === null && $flag === false) { // if the user type is staff and the data isn't approved
                    echo json_encode(["message" => "Your data is not approved!"]);
                } else if ($loginUser === null) { // if the email/password/type is wrong.
                    echo json_encode(["message" => "email/password/type is wrong."]);
                }
                $dbCon->close();
                break;

            case "/logout":
                if (isset($_SESSION["loginUser"])) { // if the user is logged in, stop session
                    session_unset();
                    session_destroy();
                    echo json_encode(["message" => "Log out"]);
                } else {
                    echo json_encode(["logout" => "Login first."]);
                }
                break;

            case "/register":
                $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                if ($dbCon->connect_error) {
                    echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                    $dbCon->close();
                } else {
                    // Check if the email already exists in the appropriate table
                    $checkEmailQuery = "SELECT email FROM user_tb WHERE email = '" .$_POST["email"]. "'";
                    $result = $dbCon->query($checkEmailQuery);
                    if($result->num_rows > 0) {
                        // Email already exists
                        echo json_encode(["message" => "Email already exists. Please choose a different email."]);
                    } else { // If the email doesn't exist, proceed with registration
                        // Insert user data into the appropriate table
                        $insertQuery = "INSERT INTO user_tb (fname, lname, email, pass, type) VALUES (?, ?, ?, ?, ?)";
                        $stmtInsert = $dbCon->prepare($insertQuery);
                        // hash password
                        $pass = password_hash($_POST["pass"], PASSWORD_BCRYPT, ["cost" => 10]);
                        $stmtInsert->bind_param("sssss", $_POST["fname"], $_POST["lname"], $_POST["email"], $pass, $_POST["type"]);

                        if ($stmtInsert->execute()) {
                            // If the user is a staff, add an entry to the approval table
                            if ($_POST["type"] === "Staff") {
                                // get the user id from the user table
                                $selectUid = "SELECT uid FROM user_tb WHERE email = '" . $_POST["email"] . "'";
                                $result = $dbCon->query($selectUid);

                                if ($result->num_rows > 0) {
                                    $staffUid = $result->fetch_assoc()["uid"]; // set user id
                                    $approvalQuery = "INSERT INTO approval_tb (uid, status) VALUES ('$staffUid', 'pending')";
                                    $stmtApproval = $dbCon->query($approvalQuery);
                                } else {
                                    echo json_encode(["message" => "No data."]);
                                }
                            }
                            // Registration successful
                            echo json_encode(["success" => "Registration successful!"]);
                        }
                    }
                }
                break;

            case "/ulist": // load user data
                if (isset($_SESSION["loginUser"])) {
                    $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                    if ($dbCon->connect_error) {
                        echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                        $dbCon->close();
                    } else {
                        if ($_SESSION["loginUser"]["type"] == "Admin") { //if the logged in user type is Admin, the user can see the list of staffs and customers
                            $selectUser = "SELECT uid,fname,lname,email,type FROM user_tb WHERE type = 'Staff' OR type = 'Customer'";
                            $result = $dbCon->query($selectUser);
                            // $staffList = [];
                            // $custList = [];
                            $ulistAdmin = [];
                            if ($result->num_rows > 0) {
                                while ($user = $result->fetch_assoc()) {
                                    // if ($user["type"] == "Staff") {
                                    //     array_push($staffList, $user);
                                    // } else if ($user["type"] == 'Customer') {
                                    //     array_push($custList, $user);
                                    // }
                                    array_push($ulistAdmin, $user);
                                }
                                // $ulistAdmin = ["staff" => $staffList, "customer" => $custList];
                                echo json_encode($ulistAdmin);
                            } else {
                                echo json_encode(["message" => "No user data."]);
                            }
                        } else if ($_SESSION["loginUser"]["type"] == "Staff") { //if the logged in user type is Staff, the user can see the list of customers
                            $selectUser = "SELECT uid,fname,lname,email,type FROM user_tb WHERE type = 'Customer'";
                            $result = $dbCon->query($selectUser);
                            $custList = [];
                            if ($result->num_rows > 0) {
                                while ($user = $result->fetch_assoc()) {
                                    array_push($custList, $user);
                                }
                                echo json_encode($custList);
                            } else {
                                echo json_encode(["message" => "No user data."]);
                            }
                        }
                    }
                } else {
                    echo json_encode(["logout" => "Login first."]);
                }
                break;

            case "/deluser":
                if (isset($_SESSION["loginUser"]) && ($_SESSION["loginUser"]["type"] == "Admin" || $_SESSION["loginUser"]["type"] == "Staff")) {
                    $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                    if ($dbCon->connect_error) {
                        echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                        $dbCon->close();
                    } else {
                        $userData = json_decode($_POST["userData"], true);
                        if ($userData["uid"] != $_SESSION["loginUser"]["uid"]) { // the sent user data doesn't match the logged in user data, delete the sent user data 
                            if ($userData["type"] == "Staff") { // if the sent user type id staff, check if the user data exists on the approval_tb
                                $sql = "SELECT * FROM approval_tb WHERE uid = " . $userData["uid"];
                                $result = $dbCon->query($sql);
                                if ($result->num_rows > 0) { // if the sent user data exists on the approval_tb, delete the user data from the approval_tb
                                    $delAppUser = "DELETE FROM approval_tb WHERE uid = " . $userData["uid"];
                                    $dbCon->query($delAppUser);
                                }
                            }
                            $selectBlack = "SELECT uid FROM blacklst_tb WHERE uid = " . $userData["uid"];
                            $result = $dbCon->query($selectBlack);
                            if ($result->num_rows > 0) { // if the sent user data exists on the blacklst_tb, delete the user data from the blacklst_tb
                                $delBlack = "DELETE FROM blacklst_tb WHERE uid = " . $userData["uid"];
                                $dbCon->query($delBlack);
                            }
                            $selectLendUser = "SELECT uid FROM lend_tb WHERE uid = " . $userData["uid"];
                            $result = $dbCon->query($selectLendUser);
                            if ($result->num_rows > 0) { // if the sent user data exists on the lend_tb, unable to delete the user data from the user_tb
                                echo json_encode(["message" => "You can't delete this user data. The user is currently borrowing books."]);
                                $dbCon->close();
                            } else {
                                $delUserCmd = "DELETE FROM user_tb WHERE uid = " . $userData["uid"];
                                $dbCon->query($delUserCmd);
                                $dbCon->close();
                                echo json_encode(["message" => "The staff is deleted successfully!"]);
                            }
                        } else {
                            echo json_encode(["message" => "You can't delete your own data."]);
                        }
                    }
                } else {
                    echo json_encode(["logout" => "Login first."]);
                }
                break;

                // load the staff data which aren't approved yet
            case "/alist":
                if (isset($_SESSION["loginUser"])) { // if a user log in, start to connect to the approval table
                    $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                    if ($dbCon->connect_error) {
                        echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                        $dbCon->close();
                    } else {
                        // load the user data from the user table by using the user id on the approval table
                        $sql = "SELECT user_tb.uid,fname,lname,email,type FROM user_tb INNER JOIN approval_tb on user_tb.uid = approval_tb.uid";
                        $result = $dbCon->query($sql);

                        if ($result->num_rows > 0) { // if the approval table has the data
                            $pendingEmployees = [];
                            while ($row = $result->fetch_assoc()) { // set the data to the array
                                array_push($pendingEmployees, $row);
                            }
                            echo json_encode($pendingEmployees);
                        } else {
                            echo json_encode(["message" => "No waiting staff"]); // Return this message if there are no pending employees
                        }
                    }
                } else { // if a user doesn't log in, show the following message
                    echo json_encode(["logout" => "Login first."]);
                }
                break;

                // approve staff
            case "/approve":
                // if the user is logged in and the user type is admin
                if (isset($_SESSION["loginUser"]) && $_SESSION["loginUser"]["type"] === "Admin") {
                    if (isset($_POST['approve'])) {
                        $staff = json_decode($_POST['approve'], true); // the user data which will be approved. it's converted to php object 
                        $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                        if ($dbCon->connect_error) {
                            echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                            $dbCon->close();
                        } else {
                            // delete the user data from the approval table
                            $deleteSql = "DELETE FROM approval_tb WHERE uid = " . $staff["uid"];
                            $dbCon->query($deleteSql);
                            $dbCon->close();
                            echo json_encode(["message" => "The staff is approved!"]);
                        }
                    } else {
                        echo json_encode(["message" => "No staff selected."]);
                    }
                } else {  // if a user doesn't log in, show the following message
                    echo json_encode(["logout" => "Login first."]);
                }
                break;

            case "/blist":
                if (isset($_SESSION["loginUser"])) { // if the user s logged in, start to connect to the book table
                    $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                    if ($dbCon->connect_error) {
                        echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                        $dbCon->close();
                    } else {
                        $loadBlist = "SELECT * FROM books_tb"; // load all of the data in the book table
                        $result = $dbCon->query($loadBlist);
                        if ($result->num_rows > 0) { // if the table has data, load each book data
                            $blist = [];
                            while ($book = $result->fetch_assoc()) {
                                array_push($blist, $book); // push each book data to a array
                            }
                            echo json_encode($blist); // convert the array to json, and send it to the front end
                        } else { // no data
                            echo json_encode(["message" => "No books."]);
                        }
                    }
                } else { // if a user doesn't log in, show the following message
                    echo json_encode(["logout" => "Login first."]);
                }
                break;

            case "/borrow":
                if (isset($_SESSION["loginUser"]) && $_SESSION["loginUser"]["type"] === "Customer") { // if a user log in and the user type is customer, the user can borrow books.
                    $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                    if ($dbCon->connect_error) {
                        echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                        $dbCon->close();
                    } else {
                        $bookBor = json_decode($_POST["book"]);
                        foreach ($bookBor as $book) {
                            // insert the data of the books borrowed to the lend table
                            $insLend = $dbCon->prepare("INSERT INTO lend_tb (isbn, uid, ldate,rdata) VALUES (?,?,?,?)");
                            $today = date("Y-m-d");
                            $returnDate  = date("Y-m-d", strtotime($today . '+1 week'));
                            $insLend->bind_param("siss", $book->isbn, $_SESSION["loginUser"]["uid"], $today, $returnDate);
                            $insLend->execute();
                            // update the status of the books borrowed
                            $updateLend = "UPDATE books_tb SET status = 'unavailable' WHERE isbn = $book->isbn";
                            $dbCon->query($updateLend);
                        }
                        $insLend->close();
                        $dbCon->close();
                        echo json_encode(["message" => "Success to borrow books!"]);
                    }
                } else {  // if a user doesn't log in, show the following message
                    echo json_encode(["logout" => "Login first."]);
                }
                break;

            case "/lendlist":
                if (isset($_SESSION["loginUser"]) && $_SESSION["loginUser"]["type"] == "Customer") {
                    $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                    if ($dbCon->connect_error) {
                        echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                        $dbCon->close();
                    } else {
                        $selectBook = "SELECT isbn,rdata FROM lend_tb WHERE uid = " . $_SESSION["loginUser"]["uid"]; // select isbn and return date from the lend_tb if the logged in user borrows books
                        $result = $dbCon->query($selectBook);
                        $lendList = [];
                        if ($result->num_rows > 0) { // if the logged in user borrows books
                            while ($lendBook = $result->fetch_assoc()) {
                                array_push($lendList, $lendBook);
                            }
                        }
                        $selectBdata = "SELECT books_tb.isbn,bname,author FROM books_tb INNER JOIN lend_tb on books_tb.isbn = lend_tb.isbn"; // select isbn, book name, author from books_tb if the books exist on the lend_tb
                        $result = $dbCon->query($selectBdata);
                        $bookData = [];
                        if ($result->num_rows > 0) { //if the books exist on the lend_tb
                            while ($bdata = $result->fetch_assoc()) {
                                array_push($bookData, $bdata);
                            }
                        }
                        $lendBookList = [];
                        foreach ($bookData as $book) { //merge $bookdata and $lendList to return the lended book data to front-end
                            foreach ($lendList as $lend) {
                                if ($book["isbn"] == $lend["isbn"]) {
                                    $tmpBook = new LendBook($book["isbn"], $book["bname"], $book["author"], $lend["rdata"]);
                                    array_push($lendBookList, $tmpBook->display());
                                }
                            }
                        }
                        echo json_encode($lendBookList);
                        $dbCon->close();
                    }
                } else {
                    echo json_encode(["logout" => "Login first."]);
                }
                break;


            case "/return": // return books
                if (isset($_SESSION["loginUser"]) && ($_SESSION["loginUser"]["type"] == "Admin" || $_SESSION["loginUser"]["type"] == "Staff")) {
                    $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                    if ($dbCon->connect_error) {
                        echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                        $dbCon->close();
                    } else {
                        $reBook = json_decode($_POST["reBook"], true);
                        $delLend = "DELETE FROM lend_tb WHERE isbn ='" . $reBook["isbn"] . "'"; // delete the book data from the lend_tb
                        $dbCon->query($delLend);
                        $updateStatus = "UPDATE books_tb SET status = 'available' WHERE isbn = '" . $reBook["isbn"] . "'"; // update the book status to available on the books_tb
                        $dbCon->query($updateStatus);
                        $dbCon->close();
                        echo json_encode(["message" => "This book is returned successfully."]);
                    }
                } else {
                    echo json_encode(["logout" => "Login first."]);
                }
                break;

            case "/bookregister":
                // session_start();
                if (isset($_SESSION["loginUser"]) && ($_SESSION["loginUser"]["type"] == "Staff" || $_SESSION["loginUser"]["type"] == "Admin")) {

                    // Your existing code for book registration
                    $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                    if ($dbCon->connect_error) {
                        echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                        $dbCon->close();
                    } else {
                        // check if the book already exists
                        $bselectCmd = "SELECT isbn FROM books_tb WHERE isbn='" . $_POST["isbn"] . "'";
                        $result = $dbCon->query($bselectCmd);
                        if ($result->num_rows > 0) {
                            echo json_encode(["message" => "Registration failed!"]);
                        } else { // save the book data on the book table
                            $insCmd = $dbCon->prepare("INSERT INTO books_tb (isbn,bname,author,category,status) VALUES (?,?,?,?,?)");
                            $insCmd->bind_param("sssss", $_POST["isbn"], $_POST["bname"], $_POST["author"], $_POST["category"], $_POST["status"]);
                            if ($insCmd->execute()) {
                                echo json_encode(["message" => "Record added."]);
                            } else {
                                echo json_encode(["message" => "Error: " . $insCmd->error]);
                            }
                            $insCmd->close();
                        }
                        $dbCon->close();
                    }
                } else {
                    echo json_encode(["logout" => "Login first."]);
                }
                break;

            case "/bookdelete":
                if (isset($_SESSION["loginUser"]) && ($_SESSION["loginUser"]["type"] == "Admin" || $_SESSION["loginUser"]["type"] == "Staff")) { // only admin or staff can delete the book data
                    $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                    if ($dbCon->connect_error) {
                        echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                        $dbCon->close();
                    } else { // delete a book data
                        $delBook = json_decode($_POST["delBook"], true);
                        $delBookCmd = "DELETE FROM books_tb WHERE isbn = '" . $delBook["isbn"] . "'";
                        $dbCon->query($delBookCmd);
                        $dbCon->close();
                        echo json_encode(["message" => "This book is deleted successfully."]);
                    }
                } else {
                    echo json_encode(["logout" => "Login first."]);
                }
                break;
        }
    } else {
        echo ("Bad request!!!!");
    }
}
