let myLat = "";
let myLng = "";
let city;
let temp;
let humid;
let sunUp;
let sunDown;
let pressure;
let country;
let weatherType;
let wind;
let timeZone;
let stringTime;
let sunriseTime;
let sunsetTime;
let isLight;
let weatherIcon;
const clock = document.getElementById("time");
let weatherImgElement = document.getElementById('weather-img');

let weatherKey;
let apiKey;

const background = document.querySelector(".top-right");

async function fetchGoogleMapsApiKey() {
  try {
    const response = await fetch("http://localhost:5500/get-maps-api-key");
    const data = await response.json();
    apiKey = data.apiKey;
    weatherKey = data.weatherKey;

    const googleMapsScript = document.createElement("script");
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    document.head.appendChild(googleMapsScript);
  } catch (error) {
    console.error("Error fetching Google Maps API key:", error);
  }
}
// Call the function to fetch the API key when the page loads.
fetchGoogleMapsApiKey();

function initMap() {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      myLat = position.coords.latitude;
      myLng = position.coords.longitude;
      getWeather();
      var myLatLng = { lat: myLat, lng: myLng };
      var mapOptions = {
        center: myLatLng,
        zoom: 8,
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        draggable: true,
      });

      google.maps.event.addListener(marker, "dragend", function () {
        myLat = marker.getPosition().lat();
        myLng = marker.getPosition().lng();
        getWeather();
      });
    },
    function (error) {
      myLat = 51.49618680636265;
      myLng = -0.1460370605468686;
      getWeather();
    },
  );
}

// function getWeather() {
//   fetch(
//     `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLng}&appid=${weatherKey}&units=metric`,
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       dataExtract(data);
//       console.log(data);
//     });
// }

function convertSunriseTo24Hour(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours().toString().padStart(2, "0");
  let minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function dataExtract(data) {
  temp = data.main.temp.toFixed(1);
  city = data.name;
  pressure = data.main.pressure;
  humid = data.main.humidity;
  let sunset = data.sys.sunset;
  let sunrise = data.sys.sunrise;
  country = data.sys.country;
  weatherType = data.weather[0].description;
  wind = data.wind.speed;
  timeZone = data.timezone;
  sunUp = convertSunriseTo24Hour(sunrise);
  sunDown = convertSunriseTo24Hour(sunset);
  isoCode = data.sys.country;
  let weatherCode = data.weather[0].icon;
  weatherIcon = "https://openweathermap.org/img/wn/" + weatherCode + '@2x' + ".png";
  getTime(myLat, myLng);
}

// async function getTime(myLat, myLng) {
//   let currentTimestamp = Date.now();
//   let timezoneApiUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${myLat},${myLng}&timestamp=${
//     currentTimestamp / 1000
//   }&key=${apiKey}`;
//   let response = await fetch(timezoneApiUrl);
//   let data = await response.json();
//   let rawOffset = data.rawOffset;
//   let dstOffset = data.dstOffset;
//   let utcTime = currentTimestamp - dstOffset * 1000 + rawOffset * 1000;
//   let localTime = new Date(utcTime);

//   let date = `${localTime.getDate()}/${
//     localTime.getMonth() + 1
//   }/${localTime.getFullYear()}`;

//   // Format the time with leading zeros for hours and minutes
//   let hours = localTime.getHours().toString().padStart(2, "0");
//   let minutes = localTime.getMinutes().toString().padStart(2, "0");

//   let formattedTime = `${hours}:${minutes}`;
//   weatherImgElement.setAttribute('src', weatherIcon);
//   document.getElementById("weather-desc").innerText = weatherType;
//   document.getElementById("day").innerText = formattedTime;
//   document.getElementById("temperature").innerText = temp;
//   document.getElementById("city").innerText = city;
//   document.getElementById("windspeed").innerText = wind + " Km/h";
//   document.getElementById("humidity").innerText = humid + "%";
//   document.getElementById("pressure").innerText = pressure + " hPa";
//   document.getElementById("sunrise-time").innerText = sunUp;
//   document.getElementById("sunset-time").innerText = sunDown;
//   isDark(formattedTime);
// }

function isDark(time) {
  shortTime = time.substring(0, 2);
  console.log(shortTime, sunUp, sunDown);
  if (
    shortTime < sunUp.substring(0, 2) ||
    shortTime > sunDown.substring(0, 2)
  ) {
    isLight = false;
  } else {
    isLight = true;
  }
  weatherBackground(isLight, weatherType);
}

function weatherBackground(isLight, Weather) {
  let img = document.getElementById("img-weather");
  switch (isLight) {
    case true:
      switch (Weather) {
        case "Clear":
          img.src = "Weather/clearSun.jpg";
          break;
        case "Rain":
          img.src = "Weather/rainDay.jpg";
          break;
        case "Clouds":
          img.src = "Weather/cloudsDay.jpg";
          break;
        case "Snow":
          img.src = "Weather/snowDay.jpg";
          break;
        case "Thunderstorm":
          img.src = "Weather/thunderDay.jpg";
          break;
        case "Mist":
          img.src = "Weather/mistyDay.jpg";
          break;
      }
      break;
    case false:
      switch (Weather) {
        case "Clear":
          img.src = "Weather/clearNight.jpg";
          break;
        case "Rain":
          img.src = "Weather/rainNight.jpg";
          break;
        case "Clouds":
          img.src = "Weather/cloudsNight.jpg";
          break;
        case "Snow":
          img.src = "Weather/snowNight.jpg";
          break;
        case "Thunderstorm":
          img.src = "Weather/thunderNight.jpg";
          break;
        case "Mist":
          img.src = "Weather/mistyNight.jpg";
          break;
      }
      break;
  }
}
