"use strict";


const MAPS_API_URL = '';

//API call
function getDataFromMaps(start, errand1, callback) {
  var query = {
    'path': '',
  };

  $.getJSON(MAPS_API_URL, query, callback);
}

//process data function 
function processData(data) {
  console.log(data);
}

//display data function
function displayData(data) {
  processData(data);
}

function listenInputExecute() {

  $('#errandForm').submit(function () {
    event.preventDefault();
    var errand1 = $('#errand1').val();
    var start = $('#start').val();
  });
  getDataFromTripPlanner(start, errand1, displayData);
}

$(listenInputExecute);
