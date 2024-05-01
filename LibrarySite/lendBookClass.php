<?php
class LendBook {
    private $isbn;
    private $bname;
    private $author;
    private $rdate;

    function __construct($isbn,$bname,$author,$rdate){
        $this->isbn = $isbn;
        $this->bname = $bname;
        $this->author = $author;
        $this->rdate = $rdate;
    }

    function display(){
        return ["isbn" => $this->isbn,"bname" => $this->bname, "author" => $this->author, "rdate" => $this->rdate];
    }
}
?>