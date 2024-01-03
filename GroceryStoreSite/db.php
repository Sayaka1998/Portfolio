<?php

class dbHdlr
{
private $conn;

    public function __construct($host, $username, $password, $database)
    {
        //sayaka change with you actual things here
        $this->conn = new mysqli($host, $username, $password, $database);

        if ($this->conn->connect_error) {
            die("Connection failed" . $this->conn->connect_error);
        }
    }

    public function deleteUser($uid, $fname, $lname)
    {
        $stmt = $this->conn->prepare("DELETE FROM user_tb WHERE uid = ? AND fname = ? AND lname = ?");
        $stmt->bind_param("iss", $uid, $fname, $lname);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }
}
