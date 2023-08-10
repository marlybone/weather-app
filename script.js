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
let formattedTime;
const clock = document.getElementById("time");
let weatherImgElement = document.getElementById('weather-img');
const glassBox = document.getElementById("glass-box");
let svgFile;
let countryName;
let geocoder;
let feelsLike;
let imageUrl;
let weatherIsLight;
let weatherKey;
let apiKey;
let currentDate;
let dayName;

const weatherMapping = {
  '01d': 'day.svg',
  '01n': 'night.svg',
  '02d': 'cloudy-day-1.svg',
  '02n': 'cloudy-night-1.svg',
  '03d': 'cloudy.svg',
  '03n': 'cloudy.svg',
  '04d': 'cloudy.svg',
  '04n': 'cloudy.svg',
  '09d': 'rainy-6.svg',
  '09n': 'rainy-6.svg',
  '10d': 'rainy-1.svg',
  '10n': 'rainy-4.svg',
  '11d': 'thunder.svg',
  '11n': 'thunder.svg',
  '13d': 'snowy-3.svg',
  '13n': 'snowy-5.svg',
  '50d': '50d',
  '50n': '50d'
}

const background = document.querySelector(".top-right");

async function fetchGoogleMapsApiKey() {
  try {
    const response = await fetch("/.netlify/functions/grabapikey/get-maps-api-key");
    const data = await response.json();
    apiKey = data.apiKey;
    weatherKey = data.weatherKey;
    console.log(data)

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
  // Function to perform geocoding and get country name
  function getCountryName(latlng) {
    return new Promise((resolve, reject) => {
      try {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latlng }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results && results.length > 0) {
              let countryComponent = results[results.length - 1].address_components.find(
                (component) => component.types.includes("country")
              );
              if (countryComponent) {
                countryName = countryComponent.long_name; 
                resolve(countryName); 
              } else {
                reject(new Error("Country name not found."));
              }
            } else {
              reject(new Error("No geocoding results found."));
            }
          } else {
            reject(new Error("Geocode was not successful for the following reason:", status));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  navigator.geolocation.getCurrentPosition(
    async function (position) {
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
      try {
        countryName = await getCountryName(myLatLng);
      } catch (error) {
        console.error("Error getting country name:", error);
      }

      google.maps.event.addListener(marker, "dragend", async function () {
        myLat = marker.getPosition().lat();
        myLng = marker.getPosition().lng();
        getWeather();
        try {
          countryName = await getCountryName({ lat: myLat, lng: myLng });
        } catch (error) {
          console.error("Error getting country name:", error);
        }
      });
    },
    function (error) {
      myLat = 51.49618680636265;
      myLng = -0.1460370605468686;
      getWeather();
    }
  );
}

function getWeather() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLng}&appid=${weatherKey}&units=metric`,
  )
    .then((response) => response.json())
    .then((data) => {
      dataExtract(data);
    });
}

function dataExtract(data) {
  temp = data.main.temp.toFixed(1);
  city = data.name;
  pressure = data.main.pressure;
  humid = data.main.humidity;
  country = data.sys.country;
  weatherType = data.weather[0].description;
  weatherIsLight = data.weather[0].main;
  wind = data.wind.speed;
  timeZone = data.timezone;
  isoCode = data.sys.country;
  let weatherCode = data.weather[0].icon;
  let svgPath = weatherMapping[weatherCode];
  svgFile = `./animated/${svgPath}`
  feelsLike = data.main.feels_like;
  getTime(myLat, myLng);
  sunriseSunset(myLat, myLng);
}

async function getCorrectTime(timeZoneId) {
  let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  try {
    let worldTimeAPIUrl = `https://worldtimeapi.org/api/timezone/${timeZoneId}`;
    let response = await fetch(worldTimeAPIUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    let dateTime = data.datetime;
    formattedTime = dateTime.substring(11,16);
    currentDate = data.datetime.substring(0,10);
    dayName = daysOfWeek[data.day_of_week];
  } catch (error) {
    console.error("Error fetching time:", error);
    return null;
  }
}

function convertTimeTo24Hours(sunsetSunrise) {
    let [timeDigits, period] = sunsetSunrise.split(' ')
    let [timeHours, timeMinutes] = timeDigits.split(':')
    let hours = parseInt(timeHours)
    let minutes = parseInt(timeMinutes)

  if (period === 'PM' && hours !== 12) {
    hours+=12;
  }
  if (period === 'AM' && hours === 12){
    hours = 0;
  }

  let formattedHours = hours.toString().padStart(2, '0');
  let formattedMinutes = minutes.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}

async function sunriseSunset(myLat, myLng){
  let sunriseSunsetApi = `https://api.sunrisesunset.io/json?lat=${myLat}&lng=${myLng}`
  try{
    let response = await fetch(sunriseSunsetApi);
    if (!response.ok){
      throw new Error('This response was not ok')
    }
    let data = await response.json();

    sunUp = convertTimeTo24Hours(data.results.sunrise)
    sunDown = convertTimeTo24Hours(data.results.sunset)

  } catch (error) {
    console.error('error fetching', error)
  }
}

async function getTime(myLat, myLng) {
  let currentTimestamp = Date.now() ;
  let timezoneApiUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${myLat},${myLng}&timestamp=${currentTimestamp / 1000}&key=${apiKey}`;
  let response = await fetch(timezoneApiUrl);
  let data = await response.json();
  let timeZoneId = data.timeZoneId;
  await getCorrectTime(timeZoneId);
  isDark(formattedTime);
}

  function deliverDataToUi() {
    weatherImgElement.setAttribute('src', svgFile);
    document.getElementById('day').innerText = dayName
    document.getElementById("weather-desc").innerText = weatherType;
    document.getElementById("time").innerText = formattedTime;
    document.getElementById("temperature").innerText = temp;
    document.getElementById("city").innerText = city + ', ' + countryName;
    document.getElementById("wind").innerText = wind + " Km/h";
    document.getElementById("humidity-value").innerText = humid + "%";
    document.getElementById("pressure-value").innerText = pressure + " hPa";
    document.getElementById("sunrise").innerText = sunUp;
    document.getElementById("sunset").innerText = sunDown;
    document.getElementById('date').innerText = currentDate;
    document.getElementById('feels-like').innerText = feelsLike;
}

function isDark(formattedTime) {
  if (
    formattedTime < sunUp ||
    formattedTime > sunDown
  ) {
    isLight = false;
  } else {
    isLight = true;
  }
  weatherBackground(isLight, weatherIsLight);
  deliverDataToUi()
}

function weatherBackground(isLight, Weather) {
  switch (isLight) {
    case true:
      switch (Weather) {
        case "Clear":
          imageUrl = "Weather/clearSun.jpg";
          break;
        case "Rain":
          imageUrl = "Weather/rainDay.jpg";
          break;
        case "Clouds":
          imageUrl = "Weather/cloudsDay.jpg";
          break;
        case "Snow":
          imageUrl = "Weather/snowDay.jpg";
          break;
        case "Thunderstorm":
          imageUrl = "Weather/thunderDay.jpg";
          break;
        case "Mist":
          imageUrl = "Weather/mistyDay.jpg";
          break;
      }
      break;
    case false:
      switch (Weather) {
        case "Clear":
          imageUrl = "Weather/clearNight.jpg";
          break;
        case "Rain":
          imageUrl = "Weather/rainNight.jpg";
          break;
        case "Clouds":
          imageUrl = "Weather/cloudsNight.jpg";
          break;
        case "Snow":
          imageUrl = "Weather/snowNight.jpg";
          break;
        case "Thunderstorm":
          imageUrl = "Weather/thunderNight.jpg";
          break;
        case "Mist":
          imageUrl = "Weather/mistyNight.jpg";
          break;
      }
      break;
  }
  glassBox.style.backgroundImage = `url('${imageUrl}')`;
}
