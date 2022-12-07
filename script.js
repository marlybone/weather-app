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
});
};






console.log(lat)
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': '3dcd448ec1msh2b4f01bc724171fp1ee5bdjsn24e082f33ce9',
// 		'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
// 	}
// };

// fetch(`https://weatherbit-v1-mashape.p.rapidapi.com/current?lon=${lon}&lat=${lat}`, options)
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));