'use strict';

let userLat= 0;
let userLng= 0;
let city ='';
let uvIndex = '';

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
let tomorrow = new Date(today.setDate(today.getDate() + 1));

function buildStartPage() {
  $('main').append(`<div class="startPage"><img id="startImage" class="mainPic" src="images/sunbed.png" alt="sunbed">
        <h1>Beach or Basement?</h1>
        <h3 class="startH2">Find out how long you should stay in the sun today</h3>
        <form id="js-form">
            <label for="location">Enter your location</label>
            <input type="text" name="locationInput" id="js-location-input" placeholder="e.g. Toronto" required>
            <input class="uvButton" type="submit" value="Get UV Index!">
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
     $('main').empty();
     getUVProtection(userLat, userLng);
   });
 }

 function forecastLink() {
   $('#uvForecastLink').click(function(event) {
     $('main').empty();
     getUVForecast(userLat, userLng);
   });
 }

 function uvPage() {
   $('#currentUVI').click(function(event) {
     $('main').empty();
     getUVIndex(userLat, userLng);
   })
 }

 function uvRestart() {
   $('#restartButton').click(function(event) {
     location.reload();
     watchForm();
   });
 }

  function weatherLink() {
   $('#weatherLink').click(function(event) {
     $('main').empty();
     getWeather(userLat, userLng);
   });
 }

function toggleHamburgerMenu() {
  $('.hamburger').click(function(event) {
  let menu = document.getElementById('navList');
  if (menu.style.display === 'flex') {
    menu.style.display = 'none'; 

  } else {
    menu.style.display = 'flex';
  }
})
}

function toggleCoconut() {
  $('#coconutButton').click(function(event) {
    let exLinks = document.getElementById('linkList');
    let varFooter = document.getElementById('footer');
    if(exLinks.style.display === 'flex') {
      exLinks.style.display = 'none';
      varFooter.style.backgroundColor = 'lightblue';

    } else {
      exLinks.style.display = 'flex';
      varFooter.style.backgroundColor = '#89dcc4'; 
    }
  })
}


function buildNav() {
  $('header').append(
    `<nav role="navigation" id="nav">
      <img id="logo" src="images/beach-umbrella.png" alt="logo"><img id="sun" src="images/sun.rays.medium.png" alt="sun">
      <button id="hamburger" class="hamburger hamburger-cancel">
      <span class="icon"></span>
      </button>
      <ul id="navList">
        <li id="currentUVI"><a href="#results-UV"><img class="linkImage" src="images/sun2.png" alt="sun">UV Index</a></li>
        <li id="uvForecastLink"><a href="#forecastPage"><img class="linkImage" src="images/sun2.png" alt="sun">UV Forecast</a></li>
        <li id="protectionTimeLink"><a href="#protectionPage"><img class="linkImage" src="images/sun2.png" alt="sun">Protection Time</a></li>
        <li id="weatherLink"><a href="#weatherPage"><img class="linkImage" src="images/sun2.png" alt="sun">Weather</a></li>
      </ul>
    </nav>`);
        uvPage();
        protectionLink();
        forecastLink();
        weatherLink();
        toggleHamburgerMenu();
}

  function buildFooter() {
    let bool = $('#footer').length;
    console.log('Does footer exist:',bool);
    if(!bool) {
      $('body').append(
      `<footer role="footer" id="footer">
      <button id="coconutButton">
        <img id="footerImage" src="images/coconut.png" alt="coconut">
        <p id="footerText">More Info</p>
      </button>
        <ul id="linkList">
          <li id="uvIndexWiki"><a target="_blank" href="https://en.m.wikipedia.org/wiki/Ultraviolet_index">UV Index</a></li>
          <li id="skinTypeLink"><a target="_blank" href="https://en.wikipedia.org/wiki/Fitzpatrick_scale">Skin Types</a></li>
          <li id="skinTypeTest"><a target="_blank" href="https://www.uvdaily.com.au/assessing-your-risk/skin-types/">Test yourself</a></li>
        </ul>
      </footer>`);
    }
      toggleCoconut()
  }

//get location from input
function getLongLat(userInput) {
  const searchUrlLoc = baseUrlLoc + 'key=' + apiKeyMaps + '&address=' + userInput + '&sensor=false';

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
 city = `${responseJson.results[0].formatted_address}`;
 getUVIndex(userLat, userLng);
} 
  

function getUVIndex(latitude, longitude) {
  const urlUV = baseUrlUV + '?lat=' + latitude + '&lng=' + longitude;

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
     getUVProtection(userLat, userLng);
   });
 }

 function forecastButtonHandler() {
   $('#forecastButton').click(function(event) {
     getUVForecast(userLat, userLng);
   });
 }

 function weatherButtonHandler() {
  $('#weatherButton').click(function(event) {
    getWeather(userLat, userLng);
 });
}

function displayResultsUV(responseJson) {
  uvIndex = `${responseJson.result.uv}`;
  let exposureTime = `<h4 class="exposureTimeH">Safe Exposure Time</h4>
  <ul id="results-list">
    <li class="skinType"><img src="images/redHair.jpg" alt="skin type 1" class="skinImage">Skin Type no. 1: <span>${responseJson.result.safe_exposure_time.st1} min</span></li>
    <li class="skinType"><img src="images/brownHair2.jpg" alt="skin type2" class="skinImage">Skin Type no. 2: <span>${responseJson.result.safe_exposure_time.st2} min</span></li>
    <li class="skinType"><img src="images/brownHair3.jpg" alt="skin type 3" class="skinImage">Skin Type no. 3: <span>${responseJson.result.safe_exposure_time.st3} min</span></li>
    <li class="skinType"><img src="images/brownHair4.jpg" alt=skin type 4" class="skinImage">Skin Type no. 4: <span>${responseJson.result.safe_exposure_time.st4} min</span> </li>
    <li class="skinType"><img src="images/darkBrown5.jpg" alt="skin type 5" class="skinImage">Skin Type no. 5: <span>${responseJson.result.safe_exposure_time.st5} min</span> </li>
    <li class="skinType"><img src="images/black6.jpg" alt="skin type 6" class="skinImage">Skin Type no. 6: <span>${responseJson.result.safe_exposure_time.st6} min</span></li>
    </ul>
    <input id="protectionButton" class="button" type="submit" value="Find the best time for the beach">
    <input id="weatherButton" class="button" type="submit" value="Check the weather">
    <input id="restartButton" class="button" type="submit" value="Change City">
</section>`;
  $('main').empty();

  if(uvIndex >= 11) {
    $('main').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index in <span>${city}</span></h2>
      <p class="results-value">${uvIndex}
      </p>
      <h3 class="results-description">Violet alert! That is even more than red. You should not be outside without protection. Better stay inside, close your blinds, or to be on the safe side: go to the basement.</h3>
      <div class="colorBar">
      <div class="inner inner-one"></div>
      <div class="inner inner-two"></div>
      <div class="inner inner-three"></div>
      <div class="inner inner-four"></div>
      <div class="inner inner-violet"></div>
      </div>
      ${exposureTime}`);

    } else if(uvIndex >= 8) {
      $('main').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index in <span>${city}</span></h2>
      <p class="results-value">${uvIndex}
      </p>
      <h3 class="results-description">Red alert. This is the second highest UV index. Go somewhere where the sun doesn't shine.</h3>
      <div class="colorBar">
      <div class="inner inner-one"></div>
      <div class="inner inner-two"></div>
      <div class="inner inner-three"></div>
      <div class="inner inner-red"></div>
      <div class="inner inner-five"></div>
      </div>
      ${exposureTime}`);

     } else if(uvIndex >= 6) {
      $('main').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index in <span>${city}</span></h2>
      <p class="results-value">${uvIndex}
      </p>
      <h3 class="results-description">A UV index reading of 6 to 7 means high risk of harm from unprotected sun exposure.  Protect yourself with sun screen, long sleeves, long pants, a hat and sun glasses.</h3>
      <div class="colorBar">
      <div class="inner inner-one"></div>
      <div class="inner inner-two"></div>
      <div class="inner inner-orange"></div>
      <div class="inner inner-four"></div>
      <div class="inner inner-five"></div>
      </div>
      ${exposureTime}`);


    } else if(uvIndex >= 3) {
      $('main').append(`<section id="results-UV" class="uvResult">
        <h2>The UV Index in <span>${city}</span></h2>
        <p class="results-value">${uvIndex}
        </p>
        <h3 class="results-description">A UV index reading of 3 to 5 means moderate risk of harm from unprotected sun exposure. But you should still wear sun screen or do you want to look like a raisin when you are old?</h3>
        <div class="colorBar">
        <div class="inner inner-one"></div>
        <div class="inner inner-yellow"></div>
        <div class="inner inner-three"></div>
        <div class="inner inner-four"></div>
        <div class="inner inner-five"></div>
      </div>
        ${exposureTime}`);

  } else if(uvIndex > 0) {
    $('main').append(`<section id="results-UV" class="uvResult">
      <h2>The UV Index in <span>${city}</span></h2>
      <p class="results-value">${uvIndex}
      </p>
      <h3 class="results-description">A UV index reading of 0 to 2 means low danger from the Sun\'s UV rays for the average person. Enjoy the beach!</h3>
        <div class="colorBar">
        <div class="inner inner-green"></div>
        <div class="inner inner-two"></div>
        <div class="inner inner-three"></div>
        <div class="inner inner-four"></div>
        <div class="inner inner-five"></div>
      </div>
      ${exposureTime}`);

    } else if(uvIndex == 0) {
        $('main').append(`<section id="results-UV" class="uvResult">
        <h2>The UV Index in <span>${city}</span></h2>
        <p class="results-value">${uvIndex}
        </p>
        <h3 class="results-description">No UV, no danger! Go out and enjoy the fresh air. But maybe take a look at the weather before.</h3>
        <div class="colorBar">
        <div class="inner inner-green"></div>
        <div class="inner inner-two"></div>
        <div class="inner inner-three"></div>
        <div class="inner inner-four"></div>
        <div class="inner inner-five"></div>
      </div>
      <input id="weatherButton" class="button" type="submit" value="Check the weather">
      <input id="protectionButton" class="button" type="submit" value="Find the best time for the beach">
      <input id="restartButton" class="button" type="submit" value="Change City">
    </section>`);
    }
  weatherButtonHandler();
  protectionButtonHandler();
  uvRestart();
  buildFooter();
  let menu = document.getElementById('navList');
  if (menu.style.display === 'flex') {
    menu.style.display = 'none'; 
  }
}

function getUVProtection(latitude, longitude) {
  const urlProt = baseUrlProt + '?lat=' + latitude + '&lng=' + longitude;

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
  //getTimeZone(userLat, userLng);
  let startRaw = `${responseJson.result.from_time}`;
  let endRaw = `${responseJson.result.to_time}`;
  let startTime = new Date(startRaw);
  let endTime = new Date(endRaw);
  let startHours = startTime.getHours();
  let startMin = startTime.getMinutes();
  let endHours = endTime.getHours();
  let endMin = endTime.getMinutes().toString().replace(/^(\d)$/, '0$1');

  $('main').empty().append(`<div id="currentUV">Current UV index in ${city}: ${uvIndex}</div><div id="protectionPage"><img id="protectionImage" class="mainPic" src="images/sun-glasses.png" alt="Flipflops"><h3 id="protectionHeadline">Protection Time in <span>${city}</span></h3>
        <p class="results-protection">
            From <span>${startHours}:${startMin}</span> to <span>${endHours}:${endMin}</span> the UV index is over 3.5. 
            Use adequate protection or go to the beach after ${endHours}:${endMin}.</p>
            <input id="forecastButton" class="button" type="submit" value="Get tomorrow's UV index">
            <input id="weatherButton" class="button" type="submit" value="Check the weather">
            <input id="restartButton" class="button" type="submit" value="Change City">
    </div>`);
    forecastButtonHandler();
    weatherButtonHandler();
    uvRestart();
    let menu = document.getElementById('navList');
    if (menu.style.display === 'flex') {
    menu.style.display = 'none'; 
  }
}

function getUVForecast(latitude, longitude) {
  const urlFC = baseUrlFC + '?lat=' + latitude + '&lng=' + longitude + '&dt=' + tomorrow;

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
    .then(responseJson => convertResultsFC(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    }); 
} 


function convertResultsFC(responseJson) {
  let resultsLi =[];
  for(let i=0; i<responseJson.result.length; i++) {
    resultsLi += `<li><span class="${responseJson.result[i].uv >3.5 ? 'uvFC red' : 'uvFC'}">${responseJson.result[i].uv}</span> UV Index at ` + new Date(`${responseJson.result[i].uv_time}`).getHours() + ":" 
    + new Date(`${responseJson.result[i].uv_time}`).getMinutes().toString().replace(/^(\d)$/, '0$1')
    + `</li>`;
    
  }
  displayResultsFC(resultsLi);
}

function displayResultsFC(result) {
  $('main').empty().append(`<div id="currentUV">Current UV index in ${city}: ${uvIndex}</div><div id="forecastPage"><img id="forecastImage" class="mainPic" src="images/slippers.png"><h2 id="forecastHeadline">Your UV Forecast for tomorrow in <span>${city}</span></h2>
        <ul id="forecastList">
            ${result}
        </ul>
        <input id="weatherButton" class="button" type="submit" value="Check the weather">
        <input id="restartButton" class="button" type="submit" value="Change City">
    </div>`)
  weatherButtonHandler();
  uvRestart();
  let menu = document.getElementById('navList');
  if (menu.style.display === 'flex') {
  menu.style.display = 'none'; 
    }
} 


function getWeather(latitude, longitude) {
  const urlWeather = baseUrlWeather +'&lat='+ latitude + '&lon=' + longitude + '&key=' + apiWeather;

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
  let daytime = `${responseJson.data[0].pod}`;
  let weather = `${responseJson.data[0].weather.description}`;
  let temperature = `${responseJson.data[0].temp}`;
  let wind = `${responseJson.data[0].wind_spd}`;
  let humidity = `${responseJson.data[0].rh}`;
  let cloudCoverage = `${responseJson.data[0].clouds}`;
  let temperatureDisplay = `<container class="temperatureDisplay">
  <img id="tempPic" src="images/thermometer.png">
  <p id="temp" class="results-value">${temperature} C°</p></container>
  <ul class="weather-list">
      <li class="weatherLi"><img class="weatherIcon" src="images/water-drop.png" alt="humidity">Humidity: ${humidity} %</li>
      <li class="weatherLi"><img class="weatherIcon" src="images/wind2.png">Wind: ${wind} m/s</li>
      <li class="weatherLi"><img class="weatherIcon" src="images/cloud.png">Clouds: ${cloudCoverage} %</li>
  </ul>
  <input id="restartButton" class="button" type="submit" value="Change City">`;
  
  $('main').empty();
  if(daytime == "n") {
    $('main').append(`<div id="currentUV">Current UV index in ${city}: ${uvIndex}</div><div id="weatherPage">
        <h2 class="results-weather" id="#weather1">
            The Weather in <span>${city}</span><p class="results-value">${weather}</p></h2>
            <img id="weatherNight" class="mainPic" src="images/stars-and-moon.png">
            <container class="temperatureDisplay">
            ${temperatureDisplay}</div>`);

} else if(temperature > 30 && cloudCoverage < 50) {
  $('main').append(`<div id="currentUV">Current UV index in ${city}: ${uvIndex}</div><div id="weatherPage">
        <h2 class="results-weather" id="#weather1">
            The Weather in <span>${city}</span><p class="results-value">${weather}</p></h2>
            <img id="weatherImage" class="mainPic" src="images/sun@3x.png">
            ${temperatureDisplay}</div>`);

} else if(temperature < 30 && cloudCoverage < 50) {
  $('main').append(`<div id="currentUV">Current UV index in ${city}: ${uvIndex}</div><div id="weatherPage">
        <h2 class="results-weather" id="#weather1">
            The Weather in <span>${city}</span><p class="results-value">${weather}</p></h2>
            <img id="weatherImage" class="mainPic" src="images/sunblack.png">
            ${temperatureDisplay}</div>`);

} else if(temperature < 0) {
  $('main').append(`<div id="weatherPage">
        <h2 class="results-weather" id="#weather1">
            The Weather in <span>${city}</span><p class="results-value">${weather}</p></h2>
            <img id="weatherImage" class="mainPic" src="images/snowflake.png">
            ${temperatureDisplay}</div>`);

} else if(cloudCoverage > 80) {
  $('main').append(`<div id="currentUV">Current UV index in ${city}: ${uvIndex}</div><div id="weatherPage">
        <h2 class="results-weather" id="#weather1">
            The Weather in <span>${city}</span><p class="results-value">${weather}</p></h2>
            <img id="weatherImage" class="mainPic" src="images/cloud.png">
            ${temperatureDisplay}</div>`);

} else {
    $('main').append(`<div id="currentUV">Current UV index in ${city}: ${uvIndex}</div><div id="weatherPage">
          <h2 class="results-weather" id="#weather1">
              The Weather in <span>${city}</span><p class="results-value">${weather}</p></h2>
              <img id="weatherImage" class="mainPic" src="images/sun-92.png">
              ${temperatureDisplay}</div>`);
}
uvRestart();
let menu = document.getElementById('navList');
  if (menu.style.display === 'flex') {
    menu.style.display = 'none'; 
  }
}



function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#js-location-input').geocomplete();
    const locationInput = $('#js-location-input').val();
    $('#js-location-input').val('');
    getLongLat(locationInput);
    buildNav();
  }); 
}

startApp();
$(watchForm());