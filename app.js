"use strict";

//transit trip planner api
const TRIP_PLANNER_URL = 'https://developer.trimet.org/ws/V1/trips/tripplanner';

//API call
function getDataFromTripPlanner(start, errand1, callback) {
  var query = {
    'path': '',
    'appID': ''
    //add destination and start
  };

  $.getJSON(TRIP_PLANNER_URL, query, callback);
}

//process data


function listenInputExecute() {

  $('button').click(function () {
    var errand1 = $('#errand1').val();
    var start = $('#start').val();
  });
  getDataFromTripPlanner(start, errand1);

}

$(listenInputExecute)
