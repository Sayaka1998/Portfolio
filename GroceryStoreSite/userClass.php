<?php
class User
{
    private $conn;

    public function __construct($conn){
        $this->conn = $conn;
    }

    public function register($uid, $fname, $lname, $position, $pass){
        // hashing the password
        $hashedPassword = password_hash($pass, PASSWORD_BCRYPT);

        // insert user into the database
        $query = "INSERT INTO user_tb (uid, fname, lname, position,pass) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("issss", $uid, $fname, $lname, $position, $hashedPassword);
        $stmt->execute();
        $stmt->close();

        return "Registration successful!";
    }
}
