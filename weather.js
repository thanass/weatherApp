// handle click and enter
$(document).ready(function()
{
	var place = getUrlParameter('place');
	if (place != undefined)
	{
		showeather(place);
	}
	else
	{
		$("#locator").click(function() {
		  getLocation();
		});
		$("#search").click(function() {
			window.location = "index.html?place="+ document.getElementById("weatherpoint").value;
		});
		$("#weatherpoint").bind("enterKey",function(e){ showeather(); });
		$('#weatherpoint').keyup(function(e){
				if(e.keyCode == 13)
				{
				  $(this).trigger("enterKey");
				}
			});
	}
	
});
function showeather(pointName)
{
	var urlapiCurrent = "http://api.openweathermap.org/data/2.5/weather?q=" + pointName + "&units=metric&appid=5c59c7d427cc610acedf7f669ef9a240";
	var urlforecastfivedays="http://api.openweathermap.org/data/2.5/forecast/daily?q=" + pointName + "&units=metric&cnt=6&lang=en&appid=5c59c7d427cc610acedf7f669ef9a240";
	request(urlapiCurrent, showCurrentWeather);
	request(urlforecastfivedays, showForecastWeather);
	
}

function request(urlapi,callback)
{
	var http = new XMLHttpRequest();
	http.open("GET",urlapi,true);
	http.send();
	http.onreadystatechange = function(){
		if(http.status==200 && http.readyState==4){
			var wdata =JSON.parse(http.responseText);
			callback(wdata);
		}	
	};
}

//current conditions
function showCurrentWeather(weatherdata)
{
	var weatherwrapper =  $("#weather-widget-wrapper");
	var placename = weatherwrapper.find(".area-title-small");
	
	var icon = weatherdata.weather[0].icon
	var condition = weatherdata.weather[0].description
	var max = weatherdata.main.temp_max
	var min = weatherdata.main.temp_min

	placename.html(weatherdata.name+', '+weatherdata.sys.country);
	
	$("#current").html('<img class="current-icon" src="icons/' + icon + '.svg" alt="' + condition + '"><span class="cmax-temp"> ' + max + '&#8451; </span><span class="cmin-temp">' + min + '&#8451;</span>');
}

//create forecast list in wrapper
function showForecastWeather(weatherdata)
{
	var forecastListElement = $("ul#forecast")
	var days = weatherdata.list
	
	//clear forecast list
	forecastListElement.empty();
	//jump the current day
	days.slice(1).forEach(function(item)
	{
		createForecastItem(forecastListElement,item)	
	})
	
	$("#search-wrapper").hide();
	$("#forecast-wrapper").show();
}

//create forecast item in list 
function createForecastItem(listElement,item)
{	
	var date =  new Date(item.dt * 1000);
	var day = getDayEn(date);
	var icon = item.weather[0].icon
	var condition = item.weather[0].main
	var max = (item.temp.max).toFixed(0)
	var min = (item.temp.min).toFixed(0)
	
	listElement.append('<li class="col-xs-12 col-md-2"><span class="day">'+ day + ' </span><img class="forecast-icon" src="icons/' + icon + '.svg" alt="' + condition + '"><span class="max-temp"> ' + max + '&#8451; </span><span class="min-temp">' + min + '&#8451;</span></li>');
}

//convert Date to day of a week with 3 letters English
function getDayEn(date)
{
	var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	return days[ date.getDay() ];
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showeatherCoords);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
}

function showeatherCoords(position)
{
	$(this).attr('href', function() {
        return this.href + '?lat="+ position.coords.latitude +"&lon="+ position.coords.longitude';
    });
	var pointName = document.getElementById("weatherpoint").value;
	var urlapiCurrent = "http://api.openweathermap.org/data/2.5/weather?lat="+ position.coords.latitude +"&lon="+ position.coords.longitude +"&units=metric&appid=5c59c7d427cc610acedf7f669ef9a240";
	var urlforecastfivedays="http://api.openweathermap.org/data/2.5/forecast/daily?lat="+ position.coords.latitude +"&lon="+ position.coords.longitude +"&lon=139&units=metric&cnt=6&lang=en&appid=5c59c7d427cc610acedf7f669ef9a240";
	request(urlapiCurrent, showCurrentWeather);
	request(urlforecastfivedays, showForecastWeather);
	
}

//https://stackoverflow.com/a/21903119/1452285
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};