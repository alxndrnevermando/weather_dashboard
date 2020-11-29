//Global variables that hold the cities entered
var cityList = [];
var cities;

//Functions that are initialized when the page loads/reloads
initCityList();
initWeather();

//This function creates a list of our cities, and prepends them inside of a div
function renderCities() {
    $("#cityHistory").empty();
    $("#city").val("");

    for (i = 0; i < cityList.length; i++) {
        var a = $("<a>");
        a.addClass("cityListBox city");
        a.attr("data-name", cityList[i]);
        a.text(cityList[i]);
        $("#cityHistory").prepend(a);
    }
}
// This function saves the cityList array to local storage
function storeCityList() {
    localStorage.setItem("cities", JSON.stringify(cityList));
}

// This function saves the currently displayed city to local storage
function storeCities() {

    localStorage.setItem("currentCity", JSON.stringify(cities));
}

//Grabs whatever is in our cityList and renders the list upon this function being called
function initCityList() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {
        cityList = storedCities;
    }

    renderCities();
}

//Grabs whatever city was last entered by the user, which is stored in our local storage, and displays that cities current weather data
function initWeather() {
    var storedWeather = JSON.parse(localStorage.getItem("currentCity"));

    if (storedWeather !== null) {
        cities = storedWeather;

        getWeatherData();
    }
}

//Function which handles when our user submits a value
$(".submit").on("click", function (event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    cities = $("#city").val().trim();
    cityList.push(cities);
    storeCities();
    storeCityList();
    getWeatherData();
    renderCities();
});

//Makes an AJAX call which supplies our application with the weather data
function getWeatherData() {
    // This is our API key
    var APIKey = "7da86c3d6d515ae36123339318916fd1";

    // Here we are building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cities + "&appid=" + APIKey;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then (function (response) {

            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);

            //Create var which holds date
            var d = new Date();
            $(".cityInfo").html("<h1>" + response.name + " (" + d.toDateString() + ")</h1>");
            //Create var which holds the weather icon and append this to display in our app
            var iconcode = response.weather[0].icon;
            var displayCurrentWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + iconcode + "@2x.png />");
            $(".cityInfo").append(displayCurrentWeatherIcon);
            
            // Convert the temp to fahrenheit for use later
            let tempF = (response.main.temp - 273.15) * 1.80 + 32;
            
            //Append temp, humidity, and wind speed to our display div
            $(".cityInfo").append("<br>" + "Temperature (F) " + tempF.toFixed(1) + "</br>");
            $(".cityInfo").append("<br>" + "Humidity: " + response.main.humidity + "%" + "</br>");
            $(".cityInfo").append("<br>" + "Wind Speed: " + response.wind.speed + "MPH" + "</br>");
            
            //Store the repsonse data containing lat and lon to variables
            var longValue = response.coord.lon;
            var latValue = response.coord.lat;

            //Here we run a new AJAX call to a different API in order to get UV Index and append to display div
            var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=7da86c3d6d515ae36123339318916fd1&lat=" + latValue + "&lon=" + longValue;
            var uResponse = $.ajax({
                url: uvURL,
                method: "GET"
            })

                .then(function (uResponse) {
                    $(".cityInfo").append("<br>" + "UV Index: " + uResponse.value + "</br>");
                });
        });
};

//This function will display the weather info whenever a user clicks on a city in our list
function displayPreviousInfo(){
    cities = $(this).attr("data-name");
    getWeatherData();
    //displayFiveDayForecast();
    console.log(cities);
    
}

$(document).on("click", ".city", displayPreviousInfo);