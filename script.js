
const imgBackground = document.querySelector('.top-right');
/*Open Weather API KEY*/
const API = 'e65d266285dc01c2ce570d54145b0c1c';
const apiKey = 'AIzaSyC75kqs_RD694ILnPBt0cOAsyzQwpSBfaU';
let myLat = '';
let myLng = '';
let city;
let temp;
let humid;
let sunUp;
let sunDown;
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
let monthName;
let timezoneName;
let offset;
let stringTime;
let exactTime;
let clockId
let updateTime;
let sunriseTime;
let sunsetTime;
let isLight;
const clock = document.getElementById('time');
let theTime;

const background = document.querySelector('.top-right');

function initMap() {
    navigator.geolocation.getCurrentPosition(function(position) {
        myLat = position.coords.latitude;
        myLng = position.coords.longitude;
        getWeather();
        var myLatLng = {lat: myLat, lng: myLng};
        var mapOptions = {
            center: myLatLng,
            zoom: 8
        };

        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            draggable: true
        });

        google.maps.event.addListener(marker, 'dragend', function() {
            myLat = marker.getPosition().lat();
            myLng = marker.getPosition().lng();
            getWeather();
        });
    }, function(error) {
        myLat = 51.49618680636265;
        myLng = -0.1460370605468686;
        getWeather();
    });
};

function getWeather(){
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLng}&appid=${API}&units=metric`)
  .then(response => response.json())
  .then(data => {
    dataExtract(data)
    });
}

function  dataExtract(data) {
    temp = data.main.temp.toFixed(1);
    city = data.name;
    pressure = data.main.pressure;
    humid = data.main.humidity;
    let sunset = data.sys.sunset;
    let sunrise = data.sys.sunrise;
    country = data.sys.country;
    weatherType = data.weather[0].main;
    wind = data.wind.speed;
    timeZone = data.timezone
    sunriseTime = new Date(sunrise * 1000);
    sunsetTime = new Date(sunset * 1000);
    let stringSunset = sunsetTime.toString();
    let stringSunrise = sunriseTime.toString();
    sunUp = stringSunrise.match(/(\d{2}):(\d{2})/)[0];
    sunDown = stringSunset.match(/(\d{2}):(\d{2})/)[0];
    isoCode = data.sys.country;
    getTime(myLat, myLng);
}

function displayData() {
    document.getElementById('temperature').innerText = temp;
    document.getElementById('city').innerText = city;
    document.getElementById('windspeed').innerText = wind + 'Km/h';
    document.getElementById('humidity').innerText = humid + '%';
    document.getElementById('pressure').innerText = pressure + ' hPa';
    document.getElementById("weather-status").innerText = weatherType;
    document.getElementById('day').innerText = day;
    document.getElementById('date').innerText = monthName + ', ' + year;
    document.getElementById('sunrise-time').innerText = sunUp;
    document.getElementById('sunset-time').innerText = sunDown;
}

function getTime(lat, lng) {
  clearInterval(clockId);
  let theTime;
  const timeStamp = Date.now()/1000;
  let url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timeStamp}&key=${apiKey}`;
  fetch(url)
  .then(response => response.json())
  .then(data => {
    timezoneName = data.timeZoneName;
    theTime = new Date((timeStamp + data.rawOffset + data.dstOffset - 3600) * 1000);
    stringTime = theTime.toString();
    day = stringTime.match(/^\w{3}/)[0];
    monthName = stringTime.match(/\s([A-Za-z]{3,9})\s\d{1,2}/)[0].trim();
    year = stringTime.match(/\d{4}/)[0];
    exactTime = stringTime.match(/(\d{2}):(\d{2})/)[0];
        clockId = setInterval(function(){
        theTime.setSeconds(theTime.getSeconds() + 1);
        clock.innerHTML = theTime.toLocaleTimeString();
    }, 1000);
    displayData();
    isDark(myLat, myLng)
  })
  .catch(error => console.log(error));
}

function isDark(lat, lng) {
    let date = new Date();
    let times = SunCalc.getTimes(date, lat, lng);
    if(date < times.sunrise || date > times.sunset) {
      isLight = false;
    } else {
      isLight = true;
    }
}