'use strict';

var userLat=0;
var userLng=0;

// API Keys
const apiKey = '333747dc8dfa02a42a6f0acf5208fa31';
const apiKeyMaps = 'AIzaSyB50Sb-fhSbGV9pFMByOjrkZNDz1H8r0pc';
const apiWeather = 'da9ba0c8fdbb4347b8cb7aa8c3adad39';

// base URLs openUV
const baseUrlUV = 'https://api.openuv.io/api/v1/uv';
const baseUrlProt = 'https://api.openuv.io/api/v1/protection';
const baseUrlFC = 'https://api.openuv.io/api/v1/forecast';

// base URL Geocoding
const baseUrlLoc = 'https://maps.googleapis.com/maps/api/geocode/json?'

// base URL weather
const baseUrlWeather = 'https://api.weatherbit.io/v2.0/current?';

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
 userLat = `${responseJson.results[0].geometry.location.lat}`;
 userLng = `${responseJson.results[0].geometry.location.lng}`;
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


 function protectionButtonHandler() {
   $('#results-UV').on('click', '#protectionButton', function(event) {
     console.log("protectionButton works");
     getUVProtection(userLat, userLng)
   });
 }

  function treadmillButtonHandler() {
   $('#results-UV').on('click', '#treadmillButton', function(event) {
     console.log("Display treadmill page");
   });
 }

 function weatherButtonHandler() {
  $('#results-UV').on('click', '#weatherButton', function(event) {
    console.log("weatherHandler works");
    getWeather(userLat, userLng);
 });
}

function displayResultsUV(responseJson) {
  console.log(responseJson);
  let uvIndex = `${responseJson.result.uv}`;
  console.log("The index is: " + uvIndex);
  console.log(`${responseJson.result.safe_exposure_time.st1}`);
  $(".startPage").remove();
  if(uvIndex == 0) {
    $('body').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index is</h2>
      <p id="results-value">${uvIndex}
      </p>
      <h3 id="results-description">No UV, no danger! Go out and enjoy the fresh air. But maybe take a look at the weather before.</h3>
      <input id="weatherButton" type="submit" value="Check the weather">
    </section>`);

  } else if(uvIndex > 0) {
    $('body').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index is</h2>
      <p id="results-value">${uvIndex}
      </p>
      <h3 id="results-description">A UV index reading of 0 to 2 means low danger from the Sun\'s UV rays for the average person. But make sure you wear the right clothes. Check the weather.</h3>
      <ul id="results-list">
        <li class="skinType">Skin Type no. 1: ${responseJson.result.safe_exposure_time.st1}</li>
        <li class="skinType">Skin Type no. 2: ${responseJson.result.safe_exposure_time.st2}</li>
        <li class="skinType">Skin Type no. 3: ${responseJson.result.safe_exposure_time.st3}</li>
        <li class="skinType">Skin Type no. 4: ${responseJson.result.safe_exposure_time.st4}</li>
        <li class="skinType">Skin Type no. 5: ${responseJson.result.safe_exposure_time.st5}</li>
        <li class="skinType">Skin Type no. 6: ${responseJson.result.safe_exposure_time.st6}</li>
          </ul>
        <input id="weatherButton" type="submit" value="Check the weather">
    </section>`);

  } else if(uvIndex >= 3) {
    $('body').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index is</h2>
      <p id="results-value">${uvIndex}
      </p>
      <h3 id="results-description">A UV index reading of 3 to 5 means moderate risk of harm from unprotected Sun exposure.</h3>
      <ul id="results-list">
        <li class="skinType">Skin Type no. 1: ${responseJson.result.safe_exposure_time.st1}</li>
        <li class="skinType">Skin Type no. 2: ${responseJson.result.safe_exposure_time.st2}</li>
        <li class="skinType">Skin Type no. 3: ${responseJson.result.safe_exposure_time.st3}</li>
        <li class="skinType">Skin Type no. 4: ${responseJson.result.safe_exposure_time.st4}</li>
        <li class="skinType">Skin Type no. 5: ${responseJson.result.safe_exposure_time.st5}</li>
        <li class="skinType">Skin Type no. 6: ${responseJson.result.safe_exposure_time.st6}</li>
          </ul>
        <input id="weatherButton" type="submit" value="Check the weather">
        <input id="protectionButton" type="submit" value="Find a saver time to run">
    </section>`);

  } else if(uvIndex >= 6) {
    $('body').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index is</h2>
      <p id="results-value">${uvIndex}
      </p>
      <h3 id="results-description">A UV index reading of 6 to 7 means high risk of harm from unprotected Sun exposure. Protection against skin and eye damage is needed.</h3>
      <ul id="results-list">
        <li class="skinType">Skin Type no. 1: ${responseJson.result.safe_exposure_time.st1}</li>
        <li class="skinType">Skin Type no. 2: ${responseJson.result.safe_exposure_time.st2}</li>
        <li class="skinType">Skin Type no. 3: ${responseJson.result.safe_exposure_time.st3}</li>
        <li class="skinType">Skin Type no. 4: ${responseJson.result.safe_exposure_time.st4}</li>
        <li class="skinType">Skin Type no. 5: ${responseJson.result.safe_exposure_time.st5}</li>
        <li class="skinType">Skin Type no. 6: ${responseJson.result.safe_exposure_time.st6}</li>
          </ul>
        <input id="protectionButton" type="submit" value="Find a saver time to run">
        <input id="treadmillButton" type="submit" value="No thank you, I go on the treadmill">
    </section>`);

  } else if(uvIndex >= 8) {
    $('body').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index is</h2>
      <p id="results-value">${uvIndex}
      </p>
      <h3 id="results-description">Red alert. This is the second highest UV index. Try to avoid exposure to the sun. On the treadmill in the gym the sun doesn't shine. Go there!</h3>
      <ul id="results-list">
        <li class="skinType">Skin Type no. 1: ${responseJson.result.safe_exposure_time.st1}</li>
        <li class="skinType">Skin Type no. 2: ${responseJson.result.safe_exposure_time.st2}</li>
        <li class="skinType">Skin Type no. 3: ${responseJson.result.safe_exposure_time.st3}</li>
        <li class="skinType">Skin Type no. 4: ${responseJson.result.safe_exposure_time.st4}</li>
        <li class="skinType">Skin Type no. 5: ${responseJson.result.safe_exposure_time.st5}</li>
        <li class="skinType">Skin Type no. 6: ${responseJson.result.safe_exposure_time.st6}</li>
          </ul>
        <input id="protectionButton" type="submit" value="Find a saver time to run">
        <input id="treadmillButton" type="submit" value="No thank you, I go on the treadmill">
    </section>`);
 
  } else if(uvIndex >= 11) {
    $('body').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index is</h2>
      <p id="results-value">${uvIndex}
      </p>
      <h3 id="results-description">Violet alert! That is even more than red. You should not be outside and for sure not run outside. Go on the treadmill and stay helathy</h3>
      <ul id="results-list">
        <li class="skinType">Skin Type no. 1: ${responseJson.result.safe_exposure_time.st1}</li>
        <li class="skinType">Skin Type no. 2: ${responseJson.result.safe_exposure_time.st2}</li>
        <li class="skinType">Skin Type no. 3: ${responseJson.result.safe_exposure_time.st3}</li>
        <li class="skinType">Skin Type no. 4: ${responseJson.result.safe_exposure_time.st4}</li>
        <li class="skinType">Skin Type no. 5: ${responseJson.result.safe_exposure_time.st5}</li>
        <li class="skinType">Skin Type no. 6: ${responseJson.result.safe_exposure_time.st6}</li>
          </ul>
        <input id="protectionButton" type="submit" value="Find a saver time to run">
        <input id="treadmillButton" type="submit" value="No thank you, I go on the treadmill">
    </section>`);
  }
  weatherButtonHandler();
  protectionButtonHandler();
  treadmillButtonHandler();
}

function getUVProtection(latitude, longitude) {
  const urlProt = baseUrlProt + '?lat=' + latitude + '&lng=' + longitude;
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



function displayResultsProt(responseJson) {
  console.log(responseJson);
}

function getUVForecast(latitude, longitude) {
  const urlFC = baseUrlFC + '?lat=' + latitude + '&lng=' + longitude + '&dt=' + tomorrow;
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

function displayResultsFC(responseJson) {
  console.log(responseJson);
} 


function getWeather(latitude, longitude) {
  console.log(userLat);
  console.log('get weather ran');
  const urlWeather = baseUrlWeather +'&lat='+ latitude + '&lon=' + longitude + '&key=' + apiWeather;
  console.log(urlWeather);

  fetch(urlWeather)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayWeather(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    }); 
} 



function displayWeather() {
  console.log('display weather ran');
  $('.uvResult').remove();
  $('body').append(`<div id="#weatherResult1"><h2 id="#weatherHeadline">Display weather</h2></div>`);
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