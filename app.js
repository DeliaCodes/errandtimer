/* global $, moment, google, document, map  */

// clears results field, takes in data object
const displayWrapper = (tripData) => {
  $('#results').html('');
  // displays data to user
  const displayData = () => {
    $('#results').append(`<p>Each way of your errand will take about <strong>${tripData.leg1Human}</strong> for a total travel time of about ${tripData.totalDuration}.</p>`);
  };
  displayData();
};

// process data function - gets data, humanizes it, sends it to display
const processData = (data) => {
  const leg1Human = data.routes[0].legs[0].duration.text;
  const leg1Time = data.routes[0].legs[0].duration.value;
  const leg2Time = data.routes[0].legs[1].duration.value;
  const totalDuration = moment.duration(leg1Time + leg2Time, 'seconds').humanize();
  const tripData = {
    totalDuration,
    leg1Human,
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
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -34.397,
      lng: 150.644,
    },
    zoom: 8,
  });
  $(getInput);
}
