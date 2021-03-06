//Search variables
var searchInput;

var cityList = document.querySelector(".city-list");

var pastSearches = [];
// API related variables
let ApiKey = "ec824d7cd7829507b791a150658771ef";
let city = ""; //click listener to insert html
//console.log(city);
let lat = "";
let lon = "";


init();

function renderCities() {
    cityList.innerHTML = "";
    //Render a new li for each city search
    for (var i = 0; i < pastSearches.length; i++) {
        var citySearches = pastSearches[i];

        var li = document.createElement("button");
        li.textContent = citySearches;
        li.classList.add("list-group-item", "city-list");
        //li.setAttribute("data-index", i);

        cityList.appendChild(li);
    }
}

// Today's Date JS function
var d = new Date();
var day = d.getDate();
var month = d.getMonth() + 1;
var year = d.getFullYear();
//to test: document.write(month + "/" + day + "/" + year); 

// GET functionality weather in selected city + HTML output

function requestWeather() {

    //clear();

    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${ApiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET",
        statusCode: {
            404: function () {
                generateErrorMsg();
            }
        }
    }).then(function (response) {
        //console.log(response.cod); // test for error response

        var weatherApiResponse = response;

        lon = response.coord.lon;
        lat = response.coord.lat;

        queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${ApiKey}`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var uvApiResponse = response;
            //console.log("UV ", uvApiResponse ); // to test response

            renderCurrentWeather(weatherApiResponse, uvApiResponse);
        });

    });
}

function generateErrorMsg() {
    $(".error").text(`Enter a valid city`);
}

//const tempF = (response.main.temp - 273.15) * 1.80 + 32;
function renderCurrentWeather(response1, response2) {
    //console.log("test1", response1); //to test response
    //console.log("test2", response2); //to test response
    document.getElementById("border").classList.add("card");
    $(".city-selected").html(`<h1>${response1.name} (${month}/${day}/${year}) <img src="https://openweathermap.org/img/wn/${response1.weather[0].icon}.png"></h1>`);
    $(".humidity").text(`Humidity: ${response1.main.humidity}%`);
    $(".wind").text(`Wind Speed: ${response1.wind.speed} MPH`);
    $(".temp").text(`Temperature: ${response1.main.temp.toFixed(1)} °F`);
    $("#uv").html(`<div>UV Index: <span id="uvColor">${response2.value}</span></div>`);

    var uvValue = response2.value;
    //console.log(uvValue); // to test for uv value
    var uvId = document.getElementById("uvColor");
    if (uvValue < 3) {
        uvId.classList.add("safe");
    } else if (uvValue > 3 && uvValue < 7) {
        uvId.classList.add("warning");
    } else {
        uvId.classList.add("danger");
    }

}

// GET functionality for weather forecast of selected city + HTML output
function requestForecast() {

    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${ApiKey}&cnt=5`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //console.log("testFct", response); //to test response
        //console.log("test day", response.list[0].main.temp); //to test path

        $(".five-day").html(`<h3>5-Day Forecast:</h3>`);

        var cardDeck = "";

        $(".card-deck").empty();

        for (var i = 0; i < 5; i++) {
            //console.log("hello"); //to test for loop

            cardDeck +=
                `<div class="card text-white bg-primary">
                   <h5>${month}/${day + i}/${year}</h5>
                   <span><img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png"></span>
                   <p>Temp: ${response.list[i].main.temp.toFixed(2)}&#176;F</p>
                   <p>Humidity: ${response.list[i].main.humidity}&#37</p>
                   </div>`;
            //card += card;

        }

        $(".card-deck").append(cardDeck);

    });

}

// initializing seach
function init() {
    //get cities searched from local storage
    //parse JSON string to an object
    var storedSearches = JSON.parse(localStorage.getItem("pastSearches"));

    //if cities are retreived from local sotrage, update pastSearches array
    if (storedSearches !== null) {
        pastSearches = storedSearches;
    }

    if (pastSearches.length > 5) {
        pastSearches.splice(1, pastSearches.length);
    }

    //render cities searched to the dom
    renderCities();
}

function storeCities() {
    //stringify and set pastSearches key in local sotorage into array
    localStorage.setItem("pastSearches", JSON.stringify(pastSearches));
}

//click handler when search is submitted
$(".search-btn").on("click", function (event) {
    event.preventDefault();

    var searchInput = (document.querySelector(".search-input")).value.trim();
    //return from function if input is blank
    if (searchInput === "") {
        return;
    }

    // add new city to pastSearches array
    pastSearches.push(searchInput);

    searchInput.text = "";
    city = searchInput;

    //store updated array in local storage, re-render the list
    //spliceCities();
    storeCities();
    renderCities();

    requestWeather();
    requestForecast();

});

// click handler for search history
$(document).on("click", ".city-list", function(event) {
    event.preventDefault();
    alert("sorry =(\nthis button is currently unavailable"); //have to log off before i can complete this functionality

    requestWeather();
    requestForecast();

})