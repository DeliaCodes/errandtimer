/* global $, moment, google, document  */

const state = {
  errands: [],
};

// const directionsDisplay = () => new google.maps.DirectionsRenderer();

// clears results field, takes in data object
const displayWrapper = (tripData) => {
  $('#results').html('');
  // displays data to user

  const displayData = () => {
    const displayLeg = tripData.legsDurationEstimates[0];
    $(displayLeg).each((index) => {
      const count = index + 1;
      return $('#results').append(`<p> Leg ${count} of your errands will take about <strong>${displayLeg[index]}</strong>.`);
    });
    $('#results').append(`<p> for a total travel time of about ${tripData.totalDuration}.</p>`);
  };
  displayData();
};

const getRoute = routes => routes[0];

const getRouteLegs = routes => routes.legs;

const getNumberOfSecondsForLeg = legs => legs.duration.value;

const getGoogleMapsLegTimeEstimate = legs => legs.duration.text;

const getLegEstimates = routes => getRouteLegs(getRoute(routes)).map(getGoogleMapsLegTimeEstimate);

const sum = array => array.reduce((acc, val) => acc + val);

// process data function - gets data, humanizes it, sends it to display
const processData = (data) => {
  const legsDurationEstimates = [];
  legsDurationEstimates.push(getLegEstimates(data.routes));

  const getLegDurations = routes => getRouteLegs(getRoute(routes)).map(getNumberOfSecondsForLeg);
  const times = sum(getLegDurations(data.routes), 0);
  const totalDuration = moment.duration(times, 'seconds').humanize();
  const tripData = {
    totalDuration,
    legsDurationEstimates,
  };
  return displayWrapper(tripData);
};

// callback for Maps API request, on success hands data to be processed - impure
const routeDataProcess = (response, status) => {
  if (status === 'OK') {
    processData(response);
    const directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setDirections(response);
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

const addAutoComplete = (errand) => {
  const searchBoxErrand = new google.maps.places.SearchBox(errand);
  searchBoxErrand.addListener('places_changed', () => {});
};

const generateErrand = () => `<div class="responsive">
<label id="errand" for="errand">Errand Street Address:</label>
<input class="errands" type="text" name="enter errand street address">
</div>`;

const renderErrand = () => {
  const newErrand = $(generateErrand());
  $('.row').append(newErrand);
  addAutoComplete(newErrand.find('input').get(0));
};

const insertErrand = () => {
  $('#addErrand').click(renderErrand);
};

// gets the submitted input from user - impure d/t jquery
const getInput = () => {
  $('#errandForm').submit((event) => {
    event.preventDefault();
    state.errands = [];
    const start = $('#start').val();
    $('.errands').each(function () {
      state.errands.push({
        location: $(this).val(),
      });
    });
    route(start, state.errands, routeDataProcess);
  });
};



// queries maps autocomplete when user enters input - impure d/t external query
// eslint-disable-next-line no-unused-vars
function initAutocomplete() {
  const inputOrigin = document.getElementById('start');
  const inputErrand = document.getElementById('errand0');
  const searchBoxOrigin = new google.maps.places.SearchBox(inputOrigin);
  searchBoxOrigin.addListener('places_changed', () => {});
  const searchBoxErrand = new google.maps.places.SearchBox(inputErrand);
  searchBoxErrand.addListener('places_changed', () => {});
  // const directionsDisplay = new google.maps.DirectionsRenderer;
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -34.397,
      lng: 150.644,
    },
    zoom: 8,
  });
  // directionsDisplay.setMap(map);
  insertErrand();
  $(getInput);
}
