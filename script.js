// API info
let ApiKey = "ec824d7cd7829507b791a150658771ef";
let city = "New York"; //click listener to insert html
let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ApiKey}`;
let queryURLuv = `http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid=${ApiKey}`;
let queryURLforecast = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt={5}&appid=${ApiKey}`;

// Today's Date JS function
var d = new Date();
var day = d.getDate();
var month = d.getMonth() + 1;
var year = d.getFullYear();
//to test: document.write(month + "/" + day + "/" + year); 

// GET functionality weather in selected city + HTML output
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    console.log(response)
    const tempF = (response.main.temp - 273.15) * 1.80 + 32;

    $(".city-selected").html(`<h1>${response.name} (${month}/${day}/${year}) (${response.weather[0].description})</h1>`);
    $(".wind").text(`Wind Speed: ${response.wind.speed}`);
    $(".humidity").text(`Humidity: ${response.main.humidity}`);
    $(".temp").append(`Temperature (F): ${tempF.toFixed(2)}`);
    //$(".uv").append(`UV Index: ${}`);

});

// GET functionality for weather forecast of selected city + HTML output
$.ajax ({
    url: queryURLforecast,
    method: "GET"
}).then(function(response){
    console.log("test 123");
});
