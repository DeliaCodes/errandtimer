/* global $, moment, google */
/* exported initMap */

// state object for the user query
// curry
const trip = {};

// adds times for each leg to the trip object
// curry
const legTimesToDisplay = (leg1, leg2, trip) => {
  trip.legTimes = [leg1, leg2];
  // console.log (trip);
};

// process data function - gets data, humanizes it, sends it to display
const processData = (data) => {
  const leg1Human = data.routes[0].legs[0].duration.text;
  const leg2Human = data.routes[0].legs[1].duration.text;
  const leg1Time = data.routes[0].legs[0].duration.value;
  const leg2Time = data.routes[0].legs[1].duration.value;
  legTimesToDisplay(leg1Human, leg2Human, trip);
  return moment.duration(leg1Time + leg2Time, 'seconds').humanize();
};

// displays data to user - impure - add detail about your errands like which one.
// curry
const displayData = (totalDuration) => {
  $('#results').append(`<ul><li>The total duration of your trip from <em>${trip.origin}</em> to your errand <em>${trip.errand}</em> and back  is about <strong> ${totalDuration}</strong>.</li></ul>`);

  $('#results').append(`<ul><li>From <em>${trip.origin}</em> to <em>${trip.errand}</em> will take about <strong>${trip.legTimes[0]}</strong>.</li></ul>`);

  $('#results').append(`<ul><li> From <em>${trip.errand}</em> back to <em>${trip.origin}</em> will take about <strong>${trip.legTimes[1]}</strong>.</li></ul>`);
};


// success of response execution - impure
const callBack = (response, status) => {
  if (status === 'OK') {
    const totalDuration = processData(response);
    displayData(totalDuration);
  }
}

// makes the route request  of google maps- impure d/t the google maps
const route = (start, errand1) => {
  const request = {
    origin: start,
    destination: start,
    waypoints: errand1,
    optimizeWaypoints: true,
    travelMode: 'DRIVING',
  };
  const directionsService = new google.maps.DirectionsService();
  directionsService.route(request, callBack);
}

// adds errand to the object - pure
const addErrand = input => [{
  location: input,
}];

// inserts the user addresses into the trip object
// curry
const tripAddressesToDisplay = (start, errand1, tripData) => {
  tripData.origin = start;
  tripData.errand = errand1;
};

// gets input from user - impure
// curry
const getInput = () => {
  $('#errandForm').submit((event) => {
    event.preventDefault();
    const errand1 = $('#errand1').val();
    const start = $('#start').val();
    tripAddressesToDisplay(start, errand1, trip);
    route(start, addErrand(errand1));
  });
};

// starts the process- impure d/t jquery
// eslint-disable-next-line no-unused-vars
function initMap() {
  $(getInput);
}
