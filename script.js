const displayTemp = document.querySelector('.weather--temp')
const displayName = document.querySelector('.location--name')
const displayCountry = document.querySelector('.country--name')
const displayDescription = document.querySelector('.icon--description')



var myLat = '';
var myLng = '';
  
function initMap() {
var myLatLng = {lat: 59.3293, lng: 18.0686}
var mapOptions = {
  center: myLatLng,
  zoom: 8
  
};
    map = new google.maps.Map(document.getElementById('map'),
    mapOptions);

  var marker = new google.maps.Marker({
  position: {
    lat:59.3293,
    lng:18.0686
  },
  map: map,
  draggable: true
});

google.maps.event.addListener(marker, 'dragend', function(){
  myLat = marker.getPosition().lat();
  myLng = marker.getPosition().lng();
  console.log(myLat + ' And ' + myLng)
  getWeather()

});
};

function getWeather() {
const options = {
	method: 'GET',
	headers: {
			'X-RapidAPI-Key': '3dcd448ec1msh2b4f01bc724171fp1ee5bdjsn24e082f33ce9',
		  'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
	}
};

fetch(`https://open-weather13.p.rapidapi.com/city/latlon/${myLat}/${myLng}`, options)
	.then(response => response.json())
	.then(data => {
    const country = data.sys.country;
    const locName = data.name;
    const temp = Math.round(data.main.temp - 273.15);
    const theData = data;
    const description = data.weather[0].main;
    const descIcon = data.weather[0].icon;
    const dIcon = "https://openweathermap.org/img/w/" + descIcon + ".png"
    console.log(locName);
    console.log(descIcon);
    console.log(theData);
    displayTemp.innerHTML = `${temp}°C`;
    displayName.innerHTML = `${country} `;
    displayCountry.innerHTML = ` , ${locName}`;
    displayDescription.innerHTML = `${description}`;
    document.getElementById("temp--icon").src = dIcon
  })
}

