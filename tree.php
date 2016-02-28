<?php

class Node{
	public $val;
	public $left,$right;
	public function __construct($item){
	$this->val=$item;
	$this->left=null;
	$this->right=null;
	}
}

class BTree{
	protected $root;
	public function __construct(){
	$this->root =null;
	}
	public function isEmpty(){
     return $this->root === null;	
	}
	
	public function insert($item){
	 $node = new Node($item);
	 if($this->isEmpty()){
	  $this->root= $node;
	 }else{
	 $this->insertNode($node,$this->root);
	 }
	}
	public function insertNode($node,&$subtree){
	 if($subtree === null){
	 $subtree = $node;
	 }
	 if($node->val > $subtree->val){
	  $this->insertNode($node,$subtree->right);
	 }
	 else if($node->val < $subtree->val){
	  $this->insertNode($node,$subtree->left);
	 }
	}
	public function printTree(){
	 print_r($this->root);
	}
	public function search($data){
	return ($this->searchNode($data,$this->root)==true)?true:false;
	}
	
	public function searchNode($data,&$subtree){
	 if($subtree === null){
	  return 0;
	 }else{
	  //print_r($subtree->val);
	  //print_r($data);sleep(3);	 
	  if($subtree->val == $data){
	  return true;
	  }else{
	   $temp = $this->searchNode($data,$subtree->left);
	   if($temp !=0){
	   return $temp;
       }
	   else{
		   $this->searchNode($data,$subtree->right);
	   }
	  }
	 }
	}
}

$t = new BTree();
/*for($i=10;$i>0;$i--){
	$t->insert($i);
}

$t->printTree();
var_dump($t->search(2));
*/
While(1){
	echo "Enter an Option \n 1. Insert\n 2. Search\n 3.Print\n";
	$in = fgets(STDIN);
	switch($in){
	case 1:
	 echo "Enter any value except 0\n";
	 $nodeData = fgets(STDIN);
	 $t->insert($nodeData);
	 break;
	 case 2:
	 echo "Enter any value except to search 0\n";
	 $nodeData = fgets(STDIN);
	 var_dump($t->search($nodeData));
	 break;
	 case 3:
	 $t->printTree();
	 break;
	 case 0:
	 break 2;
	 break;
	default:
	break 2;
	break;
	
	}
}


