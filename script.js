console.log("I'm working.");
var cityList = [];
var cities;

initCityList();
//initWeather();

//Our function for calling the data from the API
$(document).ready(function () {


});

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
// This function saves the city array to local storage
function storeCityList() {
    localStorage.setItem("cities", JSON.stringify(cityList));
}

// This function saves the currently display city to local storage
function storeCities() {

    localStorage.setItem("currentCity", JSON.stringify(cities));
}
function initCityList() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {
        cityList = storedCities;
    }

    renderCities();
}

//Function which handles when our user submits a value
// This function handles events where a movie button is clicked
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

            // Transfer content to HTML
            var d = new Date();
            $(".cityInfo").html("<h1>" + response.name + " (" + d.toDateString() + ")</h1>");
            var iconcode = response.weather[0].icon;
            var displayCurrentWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + iconcode + "@2x.png />");
            $(".cityInfo").append(displayCurrentWeatherIcon);
            // Convert the temp to fahrenheit
            let tempF = (response.main.temp - 273.15) * 1.80 + 32;
            $(".cityInfo").append("<br>" + "Temperature (F) " + tempF.toFixed(1) + "</br>");
            $(".cityInfo").append("<br>" + "Humidity: " + response.main.humidity + "%" + "</br>");
            $(".cityInfo").append("<br>" + "Wind Speed: " + response.wind.speed + "MPH" + "</br>");
            var longValue = response.coord.lon;
            var latValue = response.coord.lat;
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

function displayPreviousInfo(){
    cities = $(this).attr("data-name");
    getWeatherData();
    //displayFiveDayForecast();
    console.log(cities);
    
}

$(document).on("click", ".city", displayPreviousInfo);
