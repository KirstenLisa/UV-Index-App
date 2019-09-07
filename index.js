'use strict';

// API Keys
const apiKey = '333747dc8dfa02a42a6f0acf5208fa31';
const apiKeyMaps = 'AIzaSyB50Sb-fhSbGV9pFMByOjrkZNDz1H8r0pc';

// base URLs openUV
const baseUrlUV = 'https://api.openuv.io/api/v1/uv';
const baseUrlProt = 'https://api.openuv.io/api/v1/protection';
const baseUrlFC = 'https://api.openuv.io/api/v1/forecast';

// base URL Geocoding
const baseUrlLoc = 'https://maps.googleapis.com/maps/api/geocode/json?'
let lat = -31.1;
let lng = 56.4;
let dt = '2019-09-14T10:50:52.283Z';
let today = new Date;
console.log(today);
let tomorrow = new Date(today.setDate(today.getDate() + 1));
console.log(tomorrow);

// get current location if enabled
/* let options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  let crd = pos.coords;

  console.log('Current position:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);

  let lat = `${crd.latitude}`;
  let lng = `${crd.longitude}`;
  console.log(lat);
  console.log(lng);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options); */

//get location from input
function getLongLat(userInput) {
  //https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB50Sb-fhSbGV9pFMByOjrkZNDz1H8r0pc&address=rüsselsheim&sensor=false
  const searchUrlLoc = baseUrlLoc + 'key=' + apiKeyMaps + '&address=' + userInput + '&sensor=false';
  console.log(searchUrlLoc);

  fetch(searchUrlLoc) 
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => getResultsLoc(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    }); 
}



function getResultsLoc(responseJson) {
 let userLat = `${responseJson.results[0].geometry.location.lat}`;
 let userLng = `${responseJson.results[0].geometry.location.lng}`;
 console.log(userLat);
 console.log(userLng);
 getUVIndex(userLat, userLng);
} 

function getUVIndex(latitude, longitude) {
  const urlUV = baseUrlUV + '?lat=' + lat + '&lng=' + lng;
  console.log(urlUV);

  const options = {
    headers: new Headers({
      'x-access-token': apiKey})
  };

  fetch(urlUV, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResultsUV(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    }); 
} 



/* function getUVProtection(latitude, longitude) {
  const urlProt = baseUrlProt + '?lat=' + lat + '&lng=' + lng;
  console.log(urlProt);

  const options = {
    headers: new Headers({
      'x-access-token': apiKey})
  };

  fetch(urlProt, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResultsProt(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    }); 
} 

getUVProtection(lat, lng);

function displayResultsProt(responseJson) {
  console.log(responseJson);
} */

/* function getUVForecast(latitude, longitude) {
  const urlFC = baseUrlFC + '?lat=' + lat + '&lng=' + lng + '&dt=' + tomorrow;
  console.log(urlFC);

  const options = {
    headers: new Headers({
      'x-access-token': apiKey})
  };

  fetch(urlFC, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResultsFC(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    }); 
} 

getUVForecast(lat, lng);

function displayResultsFC(responseJson) {
  console.log(responseJson);
} */
// format user input
/* function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
} */


// loop through results
function displayResultsUV(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
}
  /* $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.items.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#results-list').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <img src='${responseJson.items[i].snippet.thumbnails.default.url}'>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden'); 
}; */

/*function getUserLocation(query) {
  const params = {
    key: apiKey,
    q: query,
    part: 'snippet',
    maxResults,
    type: 'video'
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    }); 
} */

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const locationInput = $('#js-location-input').val();
    $('#js-location-input').val('');
    console.log(locationInput);
    getLongLat(locationInput)
  });
}

$(watchForm);