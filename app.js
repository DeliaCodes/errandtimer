/* global $, moment, google */


// displays data to user - impure - add detail about your errands like which one.
const displayData = (totalDuration, leg1, leg2, start, errand1) => {
  $('#results').append(`<ul><li>The total duration of your trip from <em>${start}</em> to your errand <em>${errand1}</em> and back  is about <strong> ${totalDuration}</strong>.</li></ul>`);

  $('#results').append(`<ul><li>From <em>${start}</em> to <em>${errand1}</em> will take about <strong>${leg1}</strong>.</li></ul>`);

  $('#results').append(`<ul><li> From <em>${start}</em> back to <em>${errand1}</em> will take about <strong>${leg2}</strong>.</li></ul>`);
};

// breaks down data, calls legtimes, humanizes total duration, sends it to display
const processData = (data, start, errand1) => {
  const leg1 = data.routes[0].legs[0].duration.text;
  const leg2 = data.routes[0].legs[1].duration.text;
  const leg1InSeconds = data.routes[0].legs[0].duration.value;
  const leg2InSeconds = data.routes[0].legs[1].duration.value;
  const totalDuration = moment.duration(leg1InSeconds + leg2InSeconds, 'seconds').humanize();
  displayData(totalDuration, leg1, leg2, start, errand1);
};


// success of response execution - impure
function callBack(response, status, start, errand1) {
  if (status === 'OK') {
    processData(response, start, errand1);
  }
}
const route = (start, errand1) => {
  const request = {
    origin: start,
    destination: start,
    waypoints: errand1,
    optimizeWaypoints: true,
    travelMode: 'DRIVING',
  };
  const directionsService = new google.maps.DirectionsService();
  directionsService.route(request, callBack(errand1, start));
};

// makes the route request  of google maps- impure d/t the google maps
const createMapsRequest = (start, errand1) => {
  route(start, errand1);
};
// adds errand to the object - pure
const addErrand = input => [{
  location: input,
}];


// gets input from user - impure
// curry
const getInput = () => {
  $('#errandForm').submit((event) => {
    event.preventDefault();
    const errand1 = $('#errand1').val();
    const start = $('#start').val();
    createMapsRequest(start, addErrand(errand1));
  });
};

// starts the process- impure d/t jquery
// eslint-disable-next-line no-unused-vars
function initMap() {
  $(getInput);
}
