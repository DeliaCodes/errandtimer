/* global $, moment, google, document  */

const state = {
  errands: [],
  displayTimes: [],
  durationTimes: [],
};

// clears results field, takes in data object
const displayWrapper = (tripData) => {
  $('#results').html('');
  // displays data to user
  const displayData = () => {
    for (i = 0; i < state.displayTimes.length; i++) {
      const legCount = i + 1;
      $('#results').append(`<p> Leg ${legCount} of your errands will take about <strong>${state.displayTimes[i]}</strong>.`);
    }
    $('#results').append(`<p> for a total travel time of about ${tripData.totalDuration}.</p>`);
  };
  displayData();
};

// process data function - gets data, humanizes it, sends it to display
// use state.errands length to iterate through using map?
// use filter to iterate through the object and get the duration text?
const processData = (data) => {
  const allLegs = data.routes[0].legs.map((itm) => {
    state.displayTimes.push(itm.duration.text);
    console.log('items!', state.displayTimes);
  });
  /* const duration = data.routes[0].legs.map((itm) => {
    itm.duration.value.reduce((accumulator, current) => accumulator + current, 0);
    console.log('durated!', );
  }); */
  const duration = data.routes[0].legs.map((itm) => {
    state.durationTimes.push(itm.duration.value);
  });
  const times = state.durationTimes.reduce((acc, curr) => acc + curr, 0)
  console.log('timed!', times)
  const totalDuration = moment.duration(times, 'seconds').humanize();
  const tripData = {
    totalDuration,
  };
  return displayWrapper(tripData);
};

// callback for Maps API request, on success hands data to be processed - impure
const routeDataProcess = (response, status) => {
  if (status === 'OK') {
    console.log('response!', response);
    processData(response);
  }
};

// calls the maps route API request- impure d/t the google maps
const route = (start, errand1, callback) => {
  console.log('route', errand1);
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
  console.log('auto', errand);
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
    const start = $('#start').val();
    $('.errands').each(function () {
      console.log('inner', $(this).val());
      state.errands.push({
        location: $(this).val(),
      });
    });
    // console.log('errands!', state.errands);
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
  insertErrand();
  $(getInput);
}
