console.log("I'm working.");
var cityList = [];
var cities;

//Our function for calling the data from the API
$(document).ready(function () {


});

function renderCities(){
    $("#cityList").empty();
    $("#cityInput").val("");
    
    for (i=0; i<cityList.length; i++){
        var a = $("<a>");
        a.addClass("list-group-item list-group-item-action list-group-item-primary city");
        a.attr("data-name", cityList[i]);
        a.text(cityList[i]);
        $("#cityList").prepend(a);
    } 
}

//Function which handles when our user submits a value
// This function handles events where a movie button is clicked
$(".submit").on("click", function (event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    cities = $("#city").val().trim();
    cityList.push(cities);

    console.log(cities)
    // This is our API key
    var APIKey = "7da86c3d6d515ae36123339318916fd1";

    // Here we are building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cities + "&appid=" + APIKey;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);

            // Transfer content to HTML
            $(".cityInfo").html("<h1>" + response.city.name + " (" + response.list[0].dt_txt + ")</h1>");
            var iconcode = response.list[0].weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            $('#wicon').attr('src', iconurl);
            // Convert the temp to fahrenheit
            let tempF = (response.list[0].main.temp - 273.15) * 1.80 + 32;
            $(".cityInfo").append("<br>" + "Temperature (F) " + tempF.toFixed(1) + "</br>");
            $(".cityInfo").append("<br>" + "Humidity: " + response.list[0].main.humidity + "%" + "</br>");
            $(".cityInfo").append("<br>" + "Wind Speed: " + response.list[0].wind.speed + "MPH" + "</br>");
            // Log the data in the console as well
            console.log("Wind Speed: " + response.list[0].wind.speed);
            console.log("Humidity: " + response.list[0].main.humidity);
            console.log("Temperature (F): " + tempF);
        });
});