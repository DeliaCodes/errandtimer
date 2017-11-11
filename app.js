"use strict";

function initMap () {
var directionsService = new google.maps.DirectionsService;
var request = {
  origin : start,
  destination : start,
  waypoints : errand1,
  optimizeWaypoints: true,
travelMode : 'DRIVING'
}
directionsService.route(request, callBack);
}

function callBack (response, status) {
  if (status === 'OK') {
    console.log(response);
    alert('ok!');
  }
  else {alert('error!');}
}

//process data function 
function processData(data) {
  console.log(data);
}


//displays data to user
function displayData(data) {
  processData(data);
}

//gets input from user
function getInput () {
  $('#errandForm').submit(function () {
    event.preventDefault();
    var errand1 =[];
    errand1.push($('#errand1').val());
    var start = $('#start').val();
  });
}

function listenInputExecute() {
getInput();
}

$(listenInputExecute);
