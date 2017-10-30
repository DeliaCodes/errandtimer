var jquery = require('jquery');
"use strict";

//first is the google maps api and then is the trimet transit trip planner api

//Google Maps Directions
//comment everything and uncomment line by line and run those uncommented
//6 lines of code in your head at the time - methods short for this reason
const MAPS_DIRECTIONS_URL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCndF3UNkH3RVb1fW8S65GmGDyHIso4uB0&callback=initMap';




//transit trip planner api
const TRIP_PLANNER_URL = 'https://developer.trimet.org/ws/V1/trips/tripplanner';


function getDataFromTripPlanner ( start, destination1 , callback) {
  var query = {
    'path' : '',
    'appID' : ''
    //add destination and start
  };
  
  $.getJSON(TRIP_PLANNER_URL, query, callback);
}

function listenInputExecute (){

$('button').click(function(){
  var destination1 = $('#waypoint1').val();
  var start = $('#begin').val();
  });
  getDataFromTripPlanner(start, destination1);
}

$(listenInputExecute)
