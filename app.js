"use strict";


const MAPS_API_URL = '';

/*//API call - am I required to use this?
function getDataFromMaps(start, errand1, callback) {
  var query = {
    'path': '',
    'key' : 'AIzaSyCndF3UNkH3RVb1fW8S65GmGDyHIso4uB0'
  };

  $.getJSON(MAPS_API_URL, query, callback);
}*/

function initMap () {
var directionsService = new google.maps.DirectionsService;
var request = {
  origin : start,
  destination : start,
  waypoints : errand1,
  optimizeWaypoints: true,
travelMode : 'DRIVING'
}


}

//process data function 
function processData(data) {
  console.log(data);
}

/
//displays data to user
function displayData(data) {
  processData(data);
}

//gets input from user
function getInput () {
  $('#errandForm').submit(function () {
    event.preventDefault();
    var errand1 = $('#errand1').val();
    var start = $('#start').val();
  });
}

function listenInputExecute() {
getInput();

  getDataFromMaps(start, errand1, displayData);
}

$(listenInputExecute);
