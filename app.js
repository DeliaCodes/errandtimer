const trip = {};

// starts the process - impure d/t jquery
function initMap() {
  $(getInput);
}
const tripAddressesToDisplay = (start, errand1, trip) => {
  trip.origin = start;
  trip.errand = errand1;
};

// gets input from user - impure
const getInput = () => {
  $('#errandForm').submit((event) => {
    event.preventDefault();
    const errand1 = $('#errand1').val();
    const start = $('#start').val();
    tripAddressesToDisplay(start, errand1, trip);
    route(start, addErrand(errand1));
  });
};

// adds errand to to object - pure
const addErrand = input => [{
  location: input,
}];

// makes the route request - impure d/t the google maps
function route(start, errand1) {
  const request = {
    origin: start,
    destination: start,
    waypoints: errand1,
    optimizeWaypoints: true,
    travelMode: 'DRIVING',
  };
  // does this need to be here? or can this be broken out?
  const directionsService = new google.maps.DirectionsService();
  directionsService.route(request, callBack);
}

// success of response execution - impure
function callBack(response, status) {
  if (status === 'OK') {
    // console.log(response);
    const totalDuration = processData(response);
    displayData(totalDuration);
  }
}

// adds times for each leg to the trip object
const legTimesToDisplay = (leg1, leg2, trip) => {
  trip.legTimes = [leg1, leg2];
  // console.log (trip);
};


// process data function - gets data, humanizes it, sends it to display
const processData = (data) => {
  // console.log(data);
  const leg1Human = data.routes[0].legs[0].duration.text;
  const leg2Human = data.routes[0].legs[1].duration.text;
  const leg1Time = data.routes[0].legs[0].duration.value;
  const leg2Time = data.routes[0].legs[1].duration.value;
  legTimesToDisplay(leg1Human, leg2Human, trip);
  return moment.duration(leg1Time + leg2Time, 'seconds').humanize();
};

// displays data to user - impure - add detail about your errands like which one.
const displayData = (totalDuration) => {
  $('#results').append(`<p> The total duration of your trip from ${trip.origin} to your errand ${trip.errand} and back  is about ${totalDuration}.</p>`);

  $('#results').append(`<p>From ${trip.origin} to ${trip.errand} will take ${trip.legTimes[0]}.</p>`);

  $('#results').append(`<p> From ${trip.errand} back to ${trip.origin} will take ${trip.legTimes[1]}.</p>`);
};