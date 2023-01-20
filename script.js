const displayTemp = document.querySelector('.weather--temp')
const displayName = document.querySelector('.location--name')
const displayCountry = document.querySelector('.country--name')
const displayDescription = document.querySelector('.icon--description')
const imgBackground = document.querySelector('.top-right');
/*Open Weather API KEY*/
const API = 'e65d266285dc01c2ce570d54145b0c1c';
let myLat = '';
let myLng = '';
let city;
let temp;
let humid;
let sunset;
let sunrise;
let pressure;
let country;
let weatherType;

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
  displayWeather(data)
  console.log(data);
  });
}

function  displayWeather(data) {
  temp = data.main.temp;
  city = data.name;
  pressure = data.main.pressure;
  humid = data.main.humidity;
  sunset = data.sys.sunset;
  sunrise = data.sys.sunrise;
  country = data.sys.country;
  weatherType = data.weather[0].main;
  console.log(temp, city)
  console.log(weatherType, sunrise, sunset, humid)
}

function weatherBackground(weather) {
  switch(weather) {
    case 'Clear':
      imgBackground.style.setProperty('background-image', 'url("Weather/image.jpg")');
  }
}