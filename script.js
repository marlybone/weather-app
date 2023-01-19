const displayTemp = document.querySelector('.weather--temp')
const displayName = document.querySelector('.location--name')
const displayCountry = document.querySelector('.country--name')
const displayDescription = document.querySelector('.icon--description')
/*Open Weather API KEY*/
const API = 'e65d266285dc01c2ce570d54145b0c1c';
let myLat = '';
let myLng = '';
let country;
let locName;
let temp;
let description;
let descIcon;
let dIcon;

var background = document.querySelector('.top-right');
background.classList.add('bg-img');



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
fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLng}&appid=${API}`)
.then(response => response.json())
.then(data =>  {
  console.log(data)
  });   
}


function  displayWeather() {
  
}

function weatherBackground(weather) {
  switch(weather) {
    case 'Clear':
  }
}