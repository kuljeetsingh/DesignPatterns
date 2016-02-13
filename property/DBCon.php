<?php
include("config.php");
class DBCon{
	private $conn;
	private $columns;
	private $where = array();
	private $limit;
	public function __construct(){
		$this->conn = new mysqli(HOST, USER, PASSWORD, DATABASE);
		// Check connection
		if ($this->conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
	}
	
	public function insert($table,$data=array()){
	  $columns = array_keys($data);
	  $values  = array_values($data);
	  array_walk($values,function(&$value, &$key){
		                $value = "\"$value\"";
		                });
	  $sql = "INSERT INTO $table(".implode(',',$columns).") VALUES (".implode(",",$values).")";
	  $result = $this->conn->query($sql);
	  if($result){
	  return true;
	  }else{
		  return false;
	  }
	}
	
	public function select($select=array()){
	  $this->columns = implode(',',$select);
	  return $this;
	}
	
	public function where($key,$val){
	 $this->where[] = $key."='".$val."'";
	 return $this;
	}
	
	public function limit($limit){
	  $this->limit = " LIMIT $limit";
	}
	
	public function get($table){
		$out = array();
	 $sql = "SELECT ".$this->columns." FROM ".$table;
	 if(count($this->where)){
	 $sql .= " WHERE ".implode(" AND ",$this->where);
	 }
	 if($this->limit){
	 $sql .= " ".$this->limit;
	 }
	 $result = $this->conn->query($sql);

	if ($result->num_rows > 0) {
		// output data of each row
		while($row = $result->fetch_assoc()) {
			if(isset($row['created'])){
			 $row['created'] = strtotime($row['created']);
			}
			$out[] = $row;
			
      }
    }
	 return $out;
	}
	
	
	public function is_present($table){
	 $sql = "SELECT * FROM $table";
     $result = $this->conn->query($sql);
     if($result){
			return true;
	 }else{
			return false;
	 }
	}
}
