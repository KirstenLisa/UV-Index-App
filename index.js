'use strict';

var userLat=0;
var userLng=0;
var timeDiff=0;

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

// base URL timezone
const baseUrlTime = 'http://api.geonames.org/timezoneJSON?';
;

// base URL weather
const baseUrlWeather = 'https://api.weatherbit.io/v2.0/current?';

let today = new Date;
console.log(today);
let tomorrow = new Date(today.setDate(today.getDate() + 1));
console.log(tomorrow);

function buildStartPage() {
  $('main').append(`<div class="startPage">
        <h1>Track or Treadmill?</h1>
        <form id="js-form">
            <label for="location">Enter your location</label>
            <input type="text" name="locationInput" id="js-location-input" placeholder="e.g. Toronto" required>
            <input type="submit" value="Get UV Index!">
        </form>
     </div>
     <div class="errorMessage">   
        <p id="js-error-message" class="error-message"></p>
    </div>`);
}

function startApp() {
  buildStartPage();
}

 function protectionLink() {
   $('#protectionTimeLink').click(function(event) {
     console.log("protectionLink works");
     $('main').empty();
     getUVProtection(userLat, userLng);
   });
 }

 function forecastLink() {
   $('#uvForecastLink').click(function(event) {
     console.log("forecastLink works");
     $('main').empty();
     getUVForecast(userLat, userLng);
   });
 }

 function uvLink() {
   $('#uvIndexLink').click(function(event) {
     console.log("uvLink works");
     $('nav').remove();
     $('main').empty();
     buildStartPage();
     watchForm();
   });
 }

  function weatherLink() {
   $('#weatherLink').click(function(event) {
     console.log("weatherLink works");
     $('main').empty();
     getWeather(userLat, userLng);
   });
 }


function buildNav() {
  $('header').append(`<nav role="navigation">
            <ul id="navList">
                <li id="uvIndexLink"><a href="#startPage">Get UV Index</a></li>
                <li id="uvForecastLink"><a href="#forecastPage">UV Forecast</a></li>
                <li id="protectionTimeLink"><a href="#protectionPage">Protection Time</a></li>
                <li id="weatherLink"><a href="#weatherPage">Weather</a></li>
            </ul>
            <ul id="linkList">
                <li id="uvIndexWiki"><a target="_blank" href="https://en.m.wikipedia.org/wiki/Ultraviolet_index">UV Index</a></li>
                <li id="skinTypeLink"><a target="_blank" href="https://en.wikipedia.org/wiki/Fitzpatrick_scale">Skin Types</a></li>
                <li id="skinTypeTest"><a target="_blank" href="https://www.uvdaily.com.au/assessing-your-risk/skin-types/">Test yourself</a></li>
            </ul>
            <button id="hamburger" class="hamburger hamburger-cancel">
            <span class="icon"></span>
            </button>
           </nav>`);
        uvLink();
        protectionLink();
        forecastLink();
        weatherLink();
        toggleHamburgerMenu();
}

function toggleHamburgerMenu() {
  $('.hamburger').click(function(event) {
  let hamburger = document.getElementById("hamburger");
  let menu = document.getElementById("linkList");
  if (menu.style.display === "flex") {
    menu.style.display = "none"; 

  } else {
    menu.style.display = "flex";
  }
  console.log('Menu ran');
})
}





/*<script>
   var hamburger = document.querySelector(".hamburg");
   hamburger.onclick = function () {
      this.classList.toggle ("checked");
   }
</script> */


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

  let userLat = `${crd.latitude}`;
  let userLng = `${crd.longitude}`;
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
 console.log(responseJson);
 console.log(userLat);
 console.log(userLng);
 getUVIndex(userLat, userLng);
} 

function getTimeZone(latitude, longitude) {
  const searchUrlTime = baseUrlTime + 'lat=' + latitude + '&lng=' + longitude + '&username=kirstenlisa';

  console.log(searchUrlTime);

  fetch(searchUrlTime)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => convertTime(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    }); 
} 
  


function convertTime(responseJson) {
  timeDiff = `${responseJson.dstOffset}`
  console.log(timeDiff);
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
   $('#protectionButton').click(function(event) {
     console.log("protectionButton works");
     getUVProtection(userLat, userLng);
   });
 }

 function forecastButtonHandler() {
   $('#forecastButton').click(function(event) {
     console.log("forecastButton works");
     getUVForecast(userLat, userLng);
   });
 }

function treadmillButtonHandler() {
   $('#treadmillButton').click(function(event) {
     console.log("Display treadmill page");
     displayTreadmillPage();
   });
 }


 function weatherButtonHandler() {
  $('#weatherButton').click(function(event) {
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
  buildNav();

  if(uvIndex >= 11) {
    $('main').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index is</h2>
      <p id="results-value violet">${uvIndex}
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

    } else if(uvIndex >= 8) {
      $('main').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index is</h2>
      <p id="results-value red">${uvIndex}
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

     } else if(uvIndex >= 6) {
      $('main').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index is</h2>
      <p id="results-value orange">${uvIndex}
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


    } else if(uvIndex >= 3) {
      $('main').append(`<section id="results-UV" class="uvResult">
        <h2>The UV Index is</h2>
        <p id="results-value yellow">${uvIndex}
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

  } else if(uvIndex > 0) {
    $('main').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index is</h2>
      <p id="results-value green">${uvIndex}
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

    } else if(uvIndex == 0) {
        $('main').append(`<section id="results-UV" class="uvResult">
        <h2>The UV Index is</h2>
        <p id="results-value green">${uvIndex}
        </p>
        <h3 id="results-description">No UV, no danger! Go out and enjoy the fresh air. But maybe take a look at the weather before.</h3>
      <input id="weatherButton" type="submit" value="Check the weather">
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
  console.log('protection ran');
  console.log(responseJson);
  //getTimeZone(userLat, userLng);
  let startRaw = `${responseJson.result.from_time}`;
  let endRaw = `${responseJson.result.to_time}`;
  console.log("start raw: " + startRaw);
  let startTime = new Date(startRaw);
  let endTime = new Date(endRaw);
  let startHours = startTime.getHours();
  let startMin = startTime.getMinutes();
  let endHours = endTime.getHours();
  let endMin = endTime.getMinutes();
  console.log("Time: " + startTime);
  console.log("endRaw: "+ endTime);
  $('.uvResult').remove();
  $('main').append(`<div id="protectionPage"><h3>Protection Time</h3>
        <p class="results-protection">
            From ${startHours}:${startMin} to ${endHours}:${endMin} the UV index is over 3.5. 
            Use adequate protection or run after or before.</p>
            <input id="treadmillButton" type="submit" value="No thank you, I go on the treadmill">
            <input id="forecastButton" type="submit" value="Get tomorrow's UV index">
    </div>`);
    forecastButtonHandler()
    treadmillButtonHandler() 
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
  console.log('display forecast ran');
  let resultsLi ='';
  for(let i=0; i<responseJson.result.length; i++) {
    console.log(`${responseJson.result[i].uv}`);
    resultsLi += `<li>UV index: ${responseJson.result[i].uv} at: ${responseJson.result[i].uv_time}</li>`
  }
  console.log(resultsLi);
  $('main').empty();
  $('main').append(`<div id='#forecastPage'><h2 id="forecastHeadline">Your UV Forecast for tomorrow</h2>
        <ul id="forecastList">
            ${resultsLi}
        </ul>
    </div>`)
} 

function displayTreadmillPage() {
  $('main').empty();
  $('main').append(`<div id="treadmillPage">
        <h2 id="treadmillHeadline">Have fun on the treadmill!</h2>
        <input id="forecastButton" type="submit" value="Get tomorrow's UV index">
    </div>`);
    forecastButtonHandler();
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



function displayWeather(responseJson) {
  console.log('display weather ran');
  console.log(responseJson);
  let weather = `${responseJson.data[0].weather.description}`;
  let temperature = `${responseJson.data[0].temp}`;
  let wind = `${responseJson.data[0].wind_spd}`;
  let airQuality = `${responseJson.data[0].aqi}`;
  let cloudCoverage = `${responseJson.data[0].clouds}`;
  console.log(weather);
  console.log(temperature);
  console.log(wind);
  console.log(airQuality);
  $('.uvResult').remove();
  $('main').append(`<div id="weatherPage">
        <p class="results-weather" id="#weather1">
            Weather Description: ${weather}</p>
            <ul class="weather-list">
                <li>Temperature: ${temperature}</li>
                <li>Wind: ${wind}</li>
                <li>Air Quality: ${airQuality}</li>
                <li>Clouds: ${cloudCoverage}</li>
            </ul>
    </div>`);
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

startApp();
$(watchForm());