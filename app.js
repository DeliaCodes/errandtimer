/* global $, moment, google, document  */

// clears results field, takes in data object
const displayWrapper = (tripData) => {
  $('#results').html('');

  // displays data to user
  const displayData = () => {
    const displayLeg = tripData.legsDurationEstimates;
    $(displayLeg).each((index) => {
      const count = index + 1;
      return $('#results').append(`<p> Leg ${count} of your errands will take about <strong>${displayLeg[index]}</strong>.`);
    });
    $('#results').append(`<p> for a total travel time of about ${tripData.totalDuration}.</p>`);
  };
  displayData();
};

// selects the Route portion of the data
const getRoute = routes => routes[0];

// selects the legs within the route data
const getRouteLegs = routes => routes.legs;

// selects the leg duration in seconds of the trip leg
const getNumberOfSecondsForLeg = legs => legs.duration.value;

// selects the human readable duration portion of the data
const getGoogleMapsLegTimeEstimate = legs => legs.duration.text;

// gets the human readable durations for each leg of the trip
const getLegEstimates = routes => getRouteLegs(getRoute(routes)).map(getGoogleMapsLegTimeEstimate);

// uses reduce to total up the values passed to it
const sum = array => array.reduce((acc, val) => acc + val);


// take in response data, humanizes it, sends it to display
const processData = (data) => {
  const legsDurationEstimates = getLegEstimates(data.routes);

  // gets the duration in seconds of each leg of the trip
  const getLegDurations = routes => getRouteLegs(getRoute(routes)).map(getNumberOfSecondsForLeg);

  // Totals up each portion of the trip in seconds.
  const times = sum(getLegDurations(data.routes), 0);

  // Humanizes the duration in seconds using MomentsJS
  const totalDuration = moment.duration(times, 'seconds').humanize();

  const tripData = {
    totalDuration,
    legsDurationEstimates,
  };
  return displayWrapper(tripData);
};

/* callback for Maps API request.
on success hands data to be processed
on error hands user an error message */
const getMapsFromGoogle = (response, status) => {
  if (status === 'OK') {
    processData(response);
    const map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: -34.397,
        lng: 150.644,
      },
      zoom: 8,
    });
    const directionsDisplay = new google.maps.DirectionsRenderer({
      map,
    });
    directionsDisplay.setDirections(response);
  } else {
    $('#results').html('<p><strong>Your search returned an error.</strong> Please check your addresses and try again</p>');
  }
};

// calls the maps route API request via Map's Directions Service
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

// initiates Google Maps Search Autocomplete service
const addAutoComplete = (errand) => {
  const searchBoxErrand = new google.maps.places.SearchBox(errand);
  searchBoxErrand.addListener('places_changed', () => {});
};

// html template for additional errands
const generateErrand = () => `<div class="responsive">
<label id="errand" for="errand">Errand Street Address:</label>
<input class="errands" type="text" name="enter errand street address">
</div>`;

// inserts the errand into the DOM
const renderErrand = () => {
  const newErrand = $(generateErrand());
  $('.row').append(newErrand);
  addAutoComplete(newErrand.find('input').get(0));
};

// accepts the click from the user to add another errand
const insertErrand = () => {
  $('#addErrand').click(renderErrand);
};

// gets the submitted input from user - impure d/t jquery
const getInput = () => {
  $('#errandForm').submit((event) => {
    event.preventDefault();
    const start = $('#start').val();
    const errands = $('.errands').toArray().map(function (itm) {
      return {
        location: $(itm).val(),
      };
    }).filter(itm => itm.location !== '');
    route(start, errands, getMapsFromGoogle);
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
  insertErrand();
  $(getInput);
}
