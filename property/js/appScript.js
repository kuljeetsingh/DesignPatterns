var $builderdata = null;   // maintain the builder data for further processing 
var $price       = [];     // mainatins the key and price for sorting
var $ftype        = [];    // mainatina the type of flat for sorting

$( document ).ajaxStart(function() {
  NProgress.start();
});

$( document ).ajaxComplete(function() {
  NProgress.done();
});

// bind events on ready
$(document).ready(function(){
 // get builder properties list
 $.get('getList.php',function(data){
	 $builderdata = data.properties;
	 console.log($builderdata); 
	 displayList();
	});	
 $('#propertyList').on('click','li',function(){
	NProgress.start();
	removeActive();
	//alert("");
	$(this).addClass('active');
	console.log($(this).data('listid'));
	displayDeatilData($(this).data('listid'));
 });
 
 $('#searchProperty').on( "keyup",function(){
  searchInList($(this).val());
 });
 
 $('#searchGo').click(function(){
  searchInList($('#searchProperty').val());
  });	
 $('#sortByPrice').click(function(){
	 sortByPrice();
	 });
 $('#sortByType').click(function(){
	 sortByType();
	 });
 $('#likeMe').click(function(){
	 updateLikes();
	 });
 //setData('likes','0');
 if(getData('likes') !== null){	 
  $('#likes').html(getData('likes'));
 }	 	 
});

// set data in local storage
var setData = function(key,value){
 if(typeof(Storage) !== "undefined") {
		localStorage.setItem(key, value);
	    return true;
	} else {
		
		console.log("undefined");
		return false;
	}
}
// get data from local storage
var getData = function(key){
 if(typeof(Storage) !== "undefined") {
		return localStorage.getItem(key);
	} else {
		return false;
		console.log("undefined");
	}
}

// functio to update likes via local storage
var updateLikes = function(){
 var $userLikes = getData('likes');
 console.log($userLikes);
 if($userLikes === null){
  setData('likes','1');
  $('#likes').html("1");
 }else{
	 setData('likes',(parseInt($userLikes)+1)+'');
     $('#likes').html((parseInt($userLikes)+1));
 }
 
}

// function to reset active property
var removeActive = function(){
  $('#propertyList li').each(function(){
	  //console.log($(this).hasClass('active'));
	  if($(this).hasClass('active')){
		  $(this).removeClass('active');
	  }
  });
}

// function display the property list
var displayList =function(){
    $('#propertyList').html("");
    $price = [];
    $('#total').html($builderdata.length);
    $.each($builderdata,function(key,val){
		//console.log(key);
		tempprice = val.price;
		temptype  = val.type;
		temptype=temptype.replace("BHK", ""); 
		tempprice=tempprice.replace("L", ""); 
		console.log(tempprice);
		$price.push({id:key,price:tempprice});
		$ftype.push({id:key,ftype:temptype});
		
		if(key==0){
	        $('#propertyList').append('<li data-listId="'+key+'" class="list-group-item active"><i class="glyphicon glyphicon-play pull-right"></i> <span class="pull-right">&#8377; '+val.price+' L &nbsp;</span> '+val.name+'</li>');	
		    displayDeatilData(key);
		}
		else{
			$('#propertyList').append('<li data-listId="'+key+'" class="list-group-item"><i class="glyphicon glyphicon-play pull-right"></i> <span class="pull-right">&#8377; '+val.price+'  &nbsp;</span> '+val.name+'</li>');
		}
     
     
    });	
};

// function to search name in list
var searchInList = function(name){
  if(name.length < 1){
  displayList();
  return; 
  }
  var tempname = '';
  $('#propertyList').html("");
  for(var i in $builderdata){
	tempname = ($builderdata[i].name).toLowerCase();  

   if(tempname.indexOf(name.toLowerCase()) > -1){
    $('#propertyList').append('<li data-listId="'+i+'" class="list-group-item"><i class="glyphicon glyphicon-play pull-right"></i> <span class="pull-right">&#8377; '+$builderdata[i].price+'  &nbsp;</span> '+$builderdata[i].name+'</li>');
   }
  }
}

// function to reset the item listing
var resetList= function($item){
 var item;
 $('#propertyList').html("");
 for(var i in $item){
  item = $item[i].id;
  $('#propertyList').append('<li data-listId="'+item+'" class="list-group-item"><i class="glyphicon glyphicon-play pull-right"></i> <span class="pull-right">&#8377; '+$builderdata[item].price+'  &nbsp;</span> '+$builderdata[item].name+'</li>');
 }
}

// function to sort the listing by type
var sortByType = function(){
  console.log($ftype);
 $ftype.sort(function(a,b) { return a.ftype - b.ftype;});
 resetList($ftype);
 console.log($ftype);
}

// function to sort the listing by price
var sortByPrice = function(){
 console.log($price);
 $price.sort(function(a,b) { return a.price - b.price;});
 resetList($price);
 console.log($price);
}

// function to update map marker
var updatemap = function(showItem){
// update map
   $location = JSON.parse($builderdata[showItem].location);
   console.log($location);
   if(marker !== null){
	   if(typeof $location.location.latitude !== "undefined" && typeof $location.location.longitude !== "undefined"){
	   marker.setPosition(new google.maps.LatLng($location.location.latitude,$location.location.longitude));
       map.setCenter(new google.maps.LatLng($location.location.latitude,$location.location.longitude));
	   }else{
	   marker.setPosition(new google.maps.LatLng($location.location.lat,$location.location.lon));
       map.setCenter(new google.maps.LatLng($location.location.lat,$location.location.lon)); 
	   }
    
   }
}

// update more details section and map
var displayDeatilData = function(showItem){
  $('#amenities').html("");
  $('#moreDeatilsHeading').html("");
  $('#moreDeatils').html("");
  console.log($builderdata[showItem].amenities);
  var $amnities = JSON.parse($builderdata[showItem].amenities);
  //$amnities = $amnities.amnities;
  console.log($amnities.amenities);
  var amnitiesHTML = '';
      amnitiesHTML += ($amnities.amenities.community_hall == "1")?'<tr><td>Community Hall</td></tr>':'hhh'; 
      amnitiesHTML += ($amnities.amenities.gym == '1')?'<tr><td>GYM</td></tr>':''; 
      amnitiesHTML += ($amnities.amenities.lift == '1')?'<tr><td>Lift</td></tr>':''; 
      amnitiesHTML += ($amnities.amenities.play_area == '1')?'<tr><td>Play Area</td></tr>':''; 
      amnitiesHTML += ($amnities.amenities.pool == '1')?'<tr><td>Pool</td></tr>':''; 
      amnitiesHTML += ($amnities.amenities.power_backup == '1')?'<tr><td>Power Backup</td></tr>':''; 
      
   $("#amenities").html(amnitiesHTML);
   $('#moreDeatilsHeading').html($builderdata[showItem].name);
   $("#buildingImage").attr("src","");
   $("#buildingImage").attr("src",$builderdata[showItem].image);  
   var $moreDetail = '<li class="list-group-item"> <i class="glyphicon glyphicon-home"></i> &nbsp; '+$builderdata[showItem].builder+'</li>'+
				 '<li class="list-group-item"> <i class="glyphicon glyphicon-unchecked"></i> &nbsp; Area: 710 sq ft</li>'+ // takin area a shard coded for all
				 '<li class="list-group-item"> <i class="glyphicon glyphicon-th-large"></i> &nbsp;Type: '+$builderdata[showItem].type+'</li>'+
				 '<li class="list-group-item"> <i class="glyphicon glyphicon-th-large"></i> &nbsp; Color '+$builderdata[showItem].color+'</li>"';
   $('#moreDeatils').html($moreDetail);
   
   updatemap(showItem);
   NProgress.done();
};
