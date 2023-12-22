<?php
    include("./config.php");
    include ("./userClass.php");
    
    header("Access-Control-Allow-Origin: *"); 
    header("Access-Control-Allow-Headers: *");

    if($_SERVER["REQUEST_METHOD"] == "POST") {
        switch($_POST["req"]){
            // login
            case "login":
                $conn = new mysqli($dbServer, $dbUser, $dbPass, $dbNameGr);
                
                if ($conn->connect_error) {
                    echo ("connection error" . $conn->connect_error);
                } else {
                    $tableName = "user_tb";
                    $uid = $_POST["uid"];
                    $pass = $_POST["pass"];
                    $sql = "SELECT * FROM $tableName WHERE uid = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("i", $uid);

                    // Execute the statement
                    $stmt->execute();

                    // Get the result
                    $result = $stmt->get_result();

                    // Check if there is a matching row
                    if ($result->num_rows > 0) {
                        // Fetch the result as an associative array
                        $user = $result->fetch_assoc();
                        $hashed_pass= $user["pass"];

                        if (password_verify($pass, $hashed_pass)) {
                            // Passwords match
                            session_start();
                            $response = ["sid" => session_id(), "uid" => $user["uid"], "fname" =>$user["fname"], "lname"=>$user["lname"], "position"=>$user["position"]];
                            $login = true;
                            echo json_encode($response);
                        }
                    }
                    // Close the statement and connection
                    $stmt->close();
                    $conn->close();
                }

                if($login) {
                    http_response_code(200);
                } else {
                    http_response_code(401);
                }
                break;

            // register new employee data to the database
            case "register":
                $conn = new mysqli($dbServer, $dbUser, $dbPass, $dbNameGr);

                if ($conn->connect_error) {
                    echo ("connection error" . $conn->connect_error);
                } else {
                    $user = new User($conn);

                    // Get form data
                    $uid = $_POST["uid"];
                    $fname = $_POST["fname"];
                    $lname = $_POST["lname"];
                    $position = $_POST["position"];
                    $pass = $_POST["pass"];

                    // register user and get user ID
                    echo $user->register($uid, $fname, $lname, $position, $pass);

                    $conn->close();
                }
                break;

            // delete user data from the database
            case "delEmp":
                require_once 'db.php';

                $dbHdlr = new dbHdlr($dbServer, $dbUser, $dbPass, $dbNameGr);

                if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                    $uid = $_POST['uid'];
                    $fname = $_POST['fname'];
                    $lname = $_POST['lname'];

                    if ($dbHdlr->deleteUser($uid, $fname, $lname)) {
                        echo "User deleted successfully.";
                    } else {                               
                        echo "Error deleting user.";
                    }
                }
                break;

            // load the data from data base
            case "load":
                session_id($_POST["sid"]);
                session_start();
                $_SESSION["uid"] = json_decode($_POST["uid"]); // store the user data in session

                // read the product data from database
                $conn = new mysqli($dbServer, $dbUser, $dbPass, $dbNameGr);

                $tableName = "product_tb";

                if ($conn->connect_error) {
                    echo ("connection error" . $conn->connect_error);
                } else {
                    $sql = "SELECT * FROM $tableName";
                    $result = $conn->query($sql);
                    
                    $rows = array(); // $rows = [];
                    while ($row = $result->fetch_assoc()) {
                        $rows[] = $row; // $rows = [{"pid":1,"pname":"Pork - Chop, Frenched","price":0.67,"pimg":"../data/img/img1.png"}, {"pid":2,...},{...},...,{...}]
                    }
                    
                    // convert the data to json format
                    $data = json_encode($rows);
    
                    $conn->close();
                }
                echo $data;
                break;

            // add new product to the database
            case "addpr":
                $conn = new mysqli($dbServer, $dbUser, $dbPass, $dbNameGr);

                $tableName = "product_tb";

                if ($conn->connect_error) {
                    echo ("connection error" . $conn->connect_error);
                } else {
                    $insertQuery = $conn->prepare("INSERT INTO product_tb VALUES(?,?,?,?)");
                    $insertQuery->bind_param("isds", $pid, $pname, $price, $pimg);

                    $pid = $_POST["pid"];
                    $pname = $_POST["pname"];
                    $price = $_POST["price"];
                    $pimg = $_POST["pimg"];

                    if($insertQuery->execute() === TRUE){
                        echo "This product has been successfully added.";
                    } else {
                        echo "Error adding new product: " . $insertQuery->error;
                    };

                    $insertQuery->close();

                    $conn->close();
                }
                break;

            // delete product data from the database
            case "delpr":
                $conn = new mysqli($dbServer, $dbUser, $dbPass, $dbNameGr);

                $tableName = "product_tb";

                if ($conn->connect_error) {
                    echo ("connection error" . $conn->connect_error);
                } else {
                    // id of the deleted product
                    $delPid = $_POST["pid"]; 

                    // if product id exist in the database, delete the product
                    $sql = "DELETE FROM $tableName WHERE pid = $delPid";

                    if ($conn->query($sql) === TRUE) {
                        echo "This product has been successfully deleted.";
                    } else {
                        echo "Error deleting record: " . $conn->error;
                    }

                    $conn->close();
                }
                break;

            // store the list of products
            // create a table for each date in a data bese
            case "buy":
                if (isset($_POST["item"])) {

                    $conn = new mysqli($dbServer, $dbUser, $dbPass, $dbNameOr);

                    // table name is mmddyyyy_orderhistory (today's date)
                    $today = $_POST["today"];
                    $tableName = $today. "_orderhistory";

                    // chack if the table exist
                    $result = $conn->query("SHOW TABLES LIKE '$tableName'");

                    if ($conn->connect_error) {
                        echo ("connection error" . $conn->connect_error);
                    } else {
                        if($result->num_rows == 0) { // if the table doesn't exist, create a table
                            $sql = "CREATE TABLE IF NOT EXISTS $tableName (
                                pid INT PRIMARY KEY, 
                                pname varchar(50) NOT NULL,
                                price DECIMAL(10,2),
                                pimg varchar(50) NOT NULL,
                                amount INT,
                                total DECIMAL(10,2)
                            )";

                            // if error happens, show a error messages
                            if ($conn->query($sql) === FALSE) {
                                echo "Error creating table: " . $conn->error;
                            } 
                        } 
                        
                        // $_POST["item"] is a assosiated array 
                        $data = json_decode($_POST["item"], true);

                        // if the same product exist, change only amount and total
                        $insertQuery = $conn->prepare("INSERT INTO $tableName VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE amount = amount + VALUES(amount), total = total + VALUES(total)");
                        // i = INT, s = String, d = Double
                        $insertQuery->bind_param("isdsid", $pid, $pname, $price, $pimg, $amount, $total);
                        foreach ($data as $e) {
                            $pid = $e['pid'];
                            $pname = $e['pname'];
                            $price = $e['price'];
                            $pimg = $e['pimg'];
                            $amount = $e['amount'];
                            $total = $e['total'];
                    
                            $insertQuery->execute();
                        };

                        $insertQuery->close();

                        $conn->close();

                    }
                    echo "Your order has been completed.";
                }
                break;
            
            // read order history and send the data to the frontend
            case "show":
                $conn = new mysqli($dbServer, $dbUser, $dbPass, $dbNameOr);

                if ($conn->connect_error) {
                    echo ("connection error" . $conn->connect_error);
                } else {
                    
                    $tables = array();
                    $result = $conn->query("SHOW TABLES");

                    // read the table names from the database
                    if($result->num_rows != 0) {
                        while($row = $result->fetch_row()){ //read each line of the list of the table names
                            $tables[] = $row[0]; // tables = ["12132023_orderhistory","12142023_orderhistory",...]
                        }

                        // read the fields from each table
                        $data = array();
                        foreach($tables as $tableName) {
                            $sql = "SELECT * FROM `$tableName`";
                            $result = $conn->query($sql);
                            $rows = array();
                            while($row = $result->fetch_assoc()) {//read each line of the table
                                $rows[] = $row; 
                            }
                            $data[$tableName] = $rows; // 12132023_orderhistory = [{pid:1, pname:tomato, price:12.34...},...]
                        }
    
                        echo json_encode($data);
                    } 
                    
                    $conn->close();
                }
                break;
        }
    }
?>