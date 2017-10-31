"use strict";

//transit trip planner api
const TRIP_PLANNER_URL = 'https://developer.trimet.org/ws/V1/trips/tripplanner';

//API call
function getDataFromTripPlanner(start, errand1, date, time, callback) {
  var query = {
    'path': 'https://developer.trimet.org/ws/V1/trips/tripplanner',
    'appID': '1DA0BDD6A9377B0851E84C412',
    'date' : 'date',
    'time' : 'time',
    'fromPlace' : 'start',
    'toPlace' : 'errand1'
  };

  $.getJSON(TRIP_PLANNER_URL, query, callback);
}

//process data function goes here
function processData (data) {
console.log(data);
}

function displayData (data) {
processData(data);
}


function listenInputExecute() {

  $('#whichErrand').submit(function () {
    event.preventDefault();
    var errand1 = $('#errand1').val();
    var start = $('#start').val();
    var date = $('#tripDate').val();
    var time = $('#startTime').val();
  });
  getDataFromTripPlanner(start, errand1, date, time, displayData);
}

$(listenInputExecute);
