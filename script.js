
const imgBackground = document.querySelector('.top-right');
/*Open Weather API KEY*/
const timestamp = Math.round(Date.now() / 1000);
const API = 'e65d266285dc01c2ce570d54145b0c1c';
const apiKey = 'AIzaSyC75kqs_RD694ILnPBt0cOAsyzQwpSBfaU';
let myLat = '';
let myLng = '';
let city;
let temp;
let humid;
let sunset;
let sunrise;
let sunsetTime;
let sunriseTime;
let pressure;
let country;
let weatherType;
let wind; 
let currentTime;
let timeZone;
let isoCode;
let day;
let month;
let year;
let countryName;
const background = document.querySelector('.top-right');

navigator.geolocation.getCurrentPosition(function(position) {
  myLat = position.coords.latitude;
  myLng = position.coords.longitude;
  getWeather();
}, function(error) {
  myLat = 51.49618680636265;
  myLng = -0.1460370605468686;
  getWeather();
});
  
function initMap() {
var myLatLng = {lat: myLat, lng: myLng}
var mapOptions = {
  center: myLatLng,
  zoom: 8
};
    map = new google.maps.Map(document.getElementById('map'),
    mapOptions);

  var marker = new google.maps.Marker({
  position: myLatLng,
  map: map,
  draggable: true
});

google.maps.event.addListener(marker, 'dragend', function(){
  myLat = marker.getPosition().lat();
  myLng = marker.getPosition().lng();
  getWeather()
});
};

function getWeather(){
fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLng}&appid=${API}&units=metric`)
.then(response => response.json())
.then(data => {
  dataExtract(data)
  console.log(data);
  });
}

function  dataExtract(data) {
  temp = data.main.temp;
  city = data.name;
  pressure = data.main.pressure;
  humid = data.main.humidity;
  sunset = data.sys.sunset;
  sunrise = data.sys.sunrise;
  country = data.sys.country;
  weatherType = data.weather[0].main;
  wind = data.wind.speed;
  timeZone = data.timezone
  sunriseTime = new Date(sunrise * 1000);
  sunsetTime = new Date(sunset * 1000);
  isoCode = data.sys.country;
  getTime();
}

function displayData() {
  document.getElementById('temperature').innerText = temp;
  document.getElementById('city').innerText = city;
  document.getElementById('windspeed').innerText = wind + 'Km/h';
  document.getElementById('humidity').innerText = humid + '%';
  document.getElementById('pressure').innerText = pressure + ' hPa';
  document.getElementById("weather-status").innerText = weatherType;
  
}

function getTime() {
  const timeStamp = Date.now() / 1000;
  let url = `https://maps.googleapis.com/maps/api/timezone/json?location=${myLat},${myLng}&timestamp=${timeStamp}&key=${apiKey}`;
  fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    let date = new Date((timeStamp + data.rawOffset + data.dstOffset) * 1000);
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
    countryName = data.timeZoneId.match(/\/(.*)/)[1];
    displayData();
  })
  .catch(error => console.log(error));
}


function weatherBackground(weather) {
  switch(weather) {
    case 'Clear':
      imgBackground.style.setProperty('background-image', 'url("Weather/image.jpg")');
  }
}