const lon = '';
const lat = '';

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3dcd448ec1msh2b4f01bc724171fp1ee5bdjsn24e082f33ce9',
		'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
	}
};

fetch('https://weatherbit-v1-mashape.p.rapidapi.com/current?lon=' + lon + '&lat=' + lat, options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));