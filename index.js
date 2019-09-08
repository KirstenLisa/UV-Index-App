'use strict';

// API Keys
const apiKey = '';
const apiKeyMaps = '';

// base URLs openUV
const baseUrlUV = 'https://api.openuv.io/api/v1/uv';
const baseUrlProt = 'https://api.openuv.io/api/v1/protection';
const baseUrlFC = 'https://api.openuv.io/api/v1/forecast';

// base URL Geocoding
const baseUrlLoc = 'https://maps.googleapis.com/maps/api/geocode/json?'

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
  const urlUV = baseUrlUV + '?lat=' + latitude + '&lng=' + longitude;
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

function weatherButtonHandler() {
  $('#results-UV').on('click', '#weatherButton', function(event) {
    event.preventDefault();
    console.log("Display weather");
 });
}

 function protectionButtonHandler() {
   $('#results-UV').on('click', '#protectionButton', function(event) {
     event.preventDefault();
     console.log("Display protection time");
   });
 }

  function treadmillButtonHandler() {
   $('#results-UV').on('click', '#treadmillButton', function(event) {
     event.preventDefault();
     console.log("Display treadmill page");
   });
 }

function displayResultsUV(responseJson) {
  console.log(responseJson);
  let uvIndex = `${responseJson.result.uv}`;
  console.log("The index is: " + uvIndex);
  console.log(`${responseJson.result.safe_exposure_time.st1}`);
  $(".startPage").remove();
  weatherButtonHandler();
  protectionButtonHandler()
  if(uvIndex === 0) {
    $('body').append(`<section id="results-UV">
      <h2>The UV Index is</h2>
      <p id="results-value">${uvIndex}
      </p>
      <h3 id="results-description">No UV, no danger! Go out and enjoy the fresh air. But maybe take a look at the weather before.</h3>
      <input id="weatherButton" type="submit" value="Check the weather">
    </section>`);

  } else if(uvIndex > 0) {
    $('body').append(`<section id="results-UV" class="hidden">
      <h2>The UV Index is</h2>
      <p id="results-value">${uvIndex}
      </p>
      <h3 id="results-description">A UV index reading of 0 to 2 means low danger from the Sun\'s UV rays for the average person. But make sure you wear the right clothes. Check the weather.</h3>
      <ul id="results-list">
        <li class="skinType">${responseJson.result.safe_exposure_time.st1}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st2}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st3}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st4}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st5}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st6}</li>
          </ul>
        <input id="weatherButton" type="submit" value="Check the weather">
    </section>`);

  } else if(uvIndex >= 3) {
    $('body').append(`<section id="results-UV" class="hidden">
      <h2>The UV Index is</h2>
      <p id="results-value">${uvIndex}
      </p>
      <h3 id="results-description">A UV index reading of 3 to 5 means moderate risk of harm from unprotected Sun exposure.</h3>
      <ul id="results-list">
        <li class="skinType">${responseJson.result.safe_exposure_time.st1}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st2}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st3}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st4}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st5}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st6}</li>
          </ul>
        <input id="weatherButton" type="submit" value="Check the weather">
        <input id="protectionButton" type="submit" value="Find a saver time to run">
    </section>`);

  } else if(uvIndex >= 6) {
    $('body').append(`<section id="results-UV" class="hidden">
      <h2>The UV Index is</h2>
      <p id="results-value">${uvIndex}
      </p>
      <h3 id="results-description">A UV index reading of 6 to 7 means high risk of harm from unprotected Sun exposure. Protection against skin and eye damage is needed.</h3>
      <ul id="results-list">
        <li class="skinType">${responseJson.result.safe_exposure_time.st1}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st2}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st3}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st4}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st5}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st6}</li>
          </ul>
        <input id="protectionButton" type="submit" value="Find a saver time to run">
        <input id="treadmillButton" type="submit" value="No thank you, I go on the treadmill">
    </section>`);

  } else if(uvIndex >= 8) {
    $('body').append(`<section id="results-UV" class="hidden">
      <h2>The UV Index is</h2>
      <p id="results-value">${uvIndex}
      </p>
      <h3 id="results-description">Red alert. This is the second highest UV index. Try to avoid exposure to the sun. On the treadmill in the gym the sun doesn't shine. Go there!</h3>
      <ul id="results-list">
        <li class="skinType">${responseJson.result.safe_exposure_time.st1}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st2}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st3}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st4}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st5}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st6}</li>
          </ul>
        <input id="protectionButton" type="submit" value="Find a saver time to run">
        <input id="treadmillButton" type="submit" value="No thank you, I go on the treadmill">
    </section>`);
 
  } else if(uvIndex >= 11) {
    $('body').append(`<section id="results-UV" class="hidden">
      <h2>The UV Index is</h2>
      <p id="results-value">${uvIndex}
      </p>
      <h3 id="results-description">Violet alert! That is even more than red. You should not be outside and for sure not run outside. Go on the treadmill and stay helathy</h3>
      <ul id="results-list">
        <li class="skinType">${responseJson.result.safe_exposure_time.st1}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st2}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st3}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st4}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st5}</li>
        <li class="skinType">${responseJson.result.safe_exposure_time.st6}</li>
          </ul>
        <input id="protectionButton" type="submit" value="Find a saver time to run">
        <input id="treadmillButton" type="submit" value="No thank you, I go on the treadmill">
    </section>`);
  }
}

  


function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const locationInput = $('#js-location-input').val();
    $('#js-location-input').val('');
    console.log(locationInput);
    getLongLat(locationInput);
  });
}

$(watchForm);