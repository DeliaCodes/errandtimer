/* global $, moment, google, document */

// clears results field, takes in data object
const displayWrapper = (tripData) => {
  $('#results').html('');
  // displays data to user
  const displayData = () => {
    $('#results').append(`<p>The total duration of your trip from <em>${tripData.origin}</em> to your errand <em>${tripData.errand}</em> and back  is about <strong> ${tripData.totalDuration}</strong>.</p>`);

    $('#results').append(`<p>From <em>${tripData.origin}</em> to <em>${tripData.errand}</em> will take about <strong>${tripData.leg1Human}</strong>.</p>`);

    $('#results').append(`<p> From <em>${tripData.errand}</em> back to <em>${tripData.origin}</em> will take about <strong>${tripData.leg2Human}</strong>.</p>`);
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

// callback for Maps API request, on success hands data to be processed - impure
const routeDataProcess = (response, status) => {
  if (status === 'OK') {
    processData(response);
  }
};

// calls the maps route API request- impure d/t the google maps
const route = (start, errand1, callback) => {
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

// adds errand to an object for passing to maps APU - pure
const addErrand = input => [{
  location: input,
}];

// gets the submitted input from user - impure d/t jquery
const getInput = () => {
  $('#errandForm').submit((event) => {
    event.preventDefault();
    const errand1 = $('#errand1').val();
    const start = $('#start').val();
    route(start, addErrand(errand1), routeDataProcess);
  });
};

// queries maps autocomplete when user enters input - impure d/t external query
// eslint-disable-next-line no-unused-vars
function initAutocomplete() {
  const inputOrigin = document.getElementById('start');
  const inputErrand = document.getElementById('errand1');
  const searchBoxOrigin = new google.maps.places.SearchBox(inputOrigin);
  searchBoxOrigin.addListener('places_changed', () => {});
  const searchBoxErrand = new google.maps.places.SearchBox(inputErrand);
  searchBoxErrand.addListener('places_changed', () => {});
  $(getInput);
}
