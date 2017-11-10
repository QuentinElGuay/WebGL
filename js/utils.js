
function loadJSONFile( filePath, callBack )
{
	var request = new XMLHttpRequest();
	request.open('GET', filePath);
	request.responseType = 'json';
	request.send();
	request.onload = function() 
	{
		callBack(request.response);
	}
}
		
		
function smoothCities( cities, max )
{

	console.log('Nb cities '+cities.length );
	/*if(cities.length >= max)
	{
		
	}*/
	var smoothedCities = [];;
	for(var i = 0; i < cities.length; ++i)
	{
		smoothedCities[cities[i]['name']] = {'lon':cities[i]['latitude'], 'lat':cities[i]['latitude']};
	}
	console.log('Nb cities '+smoothedCities.length );
	return cities;
}