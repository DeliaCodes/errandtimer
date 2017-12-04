/* global $, moment, google */
/* exported initMap */

// state object for the user query
// const trip = {};

// adds times for each leg to the trip object

/* const legTimesToDisplay = (leg1, leg2, trip) => {
// trip.legTimes = [leg1, leg2];
// console.log (trip);
}; */
const displayWrapper = (tripData) => {
  console.log('Wrappered!', tripData);
  // $('#results').html('');
  // console.log('Tripped!', trip);
  const displayData = () => {
    console.log('Displayed!', tripData);
    $('#results').append(`<ul><li>The total duration of your trip from <em>${tripData.origin}</em> to your errand <em>${tripData.errand}</em> and back  is about <strong> ${tripData.totalDuration}</strong>.</li></ul>`);

    $('#results').append(`<ul><li>From <em>${tripData.origin}</em> to <em>${tripData.errand}</em> will take about <strong>${tripData.leg1Human}</strong>.</li></ul>`);

    $('#results').append(`<ul><li> From <em>${tripData.errand}</em> back to <em>${tripData.origin}</em> will take about <strong>${tripData.leg2Human}</strong>.</li></ul>`);
  };
  displayData();
};

// process data function - gets data, humanizes it, sends it to display
const processData = (data) => {
  const leg1Human = data.routes[0].legs[0].duration.text;
  const leg2Human = data.routes[0].legs[1].duration.text;
  const leg1Time = data.routes[0].legs[0].duration.value;
  const leg2Time = data.routes[0].legs[1].duration.value;
  const origin = data.routes[0].legs[0].start_address;
  const errand = data.routes[0].legs[0].end_address;
  // legTimesToDisplay(leg1Human, leg2Human, trip);
  console.log('Processed!', leg1Human, leg2Human, leg1Time, leg2Time, origin, errand);
  const totalDuration = moment.duration(leg1Time + leg2Time, 'seconds').humanize();
  const tripData = {
    totalDuration,
    leg1Human,
    leg2Human,
    origin,
    errand,
  };
  return displayWrapper(tripData);
};

// displays data to user - impure - add detail about your errands like which one.
// curry

// success of response execution - impure
const callback = (response, status) => {
  if (status === 'OK') {
    console.log('Calling!', response);
    processData(response);
  }
};

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
  directionsService.route(request, callback);
};

const createMapsRequest = (start, errand1) => {
  route(start, errand1);
};

// adds errand to the object - pure
const addErrand = input => [{
  location: input,
}];

// inserts the user addresses into the trip object
// curry
/* const tripAddressesToDisplay = (start, errand1, tripData) => {
  tripData.origin = start;
  tripData.errand = errand1;
}; */

// gets input from user - impure
// curry
const getInput = () => {
  $('#errandForm').submit((event) => {
    event.preventDefault();
    const errand1 = $('#errand1').val();
    const start = $('#start').val();
    // tripAddressesToDisplay(start, errand1, trip);
    createMapsRequest(start, addErrand(errand1));
  });
};

// starts the process- impure d/t jquery
// eslint-disable-next-line no-unused-vars
function initMap() {
  $(getInput);
}
