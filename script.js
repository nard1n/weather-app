//Search variables
var searchBtn = document.querySelector(".search-btn");
var searchInput = document.querySelector(".search-input");
var cityList = document.querySelector(".city-list");

var pastSearches = [];

// API info
let ApiKey = "ec824d7cd7829507b791a150658771ef";
//let ApiKeyFct = "c631e641422bc935ff36e943b2ff177b";
let city = "New York"; //click listener to insert html
let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ApiKey}`;
let queryURLuv = `http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid=${ApiKey}`;
let queryURLforecast = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=5&appid=${ApiKey}`;

init();

function renderCities () {
    cityList.innerHTML = "";
    //Render a new li for each city search
    for (var i = 0; i < pastSearches.length; i++) {
        var citySearches = pastSearches[i];

        var li = document.createElement("li");
        li.textContent = citySearches;
        li.classList.add("list-group-item");
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
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    //console.log(response)
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
    console.log(response)

    //<div class="card text-white bg-primary mb-3" style="max-width: 18rem;">

});

// initializing seach
function init(){
    //get cities searched from local storage
    //parse JSON string to an object
    var storedSearches = JSON.parse(localStorage.getItem("pastSearches"));

    //if cities are retreived from local sotrage, update pastSearches array
    if (storedSearches !== null) {
        pastSearches = storedSearches;
    }

    //render cities searched to the dom
    renderCities();
}

function storeCities() {
    //stringify and set pastSearches key in local sotorage into array
    localStorage.setItem("pastSearches", JSON.stringify(pastSearches));
}

//When search is submitted
searchBtn.addEventListener("click", function(event) {
    event.preventDefault();

    var searchText = searchInput.value.trim();

    //return from function if input is blank
    if (searchInput === "") {
        return;
    }

    // add new city to pastSearches array
    pastSearches.push(searchText);
    searchInput.value = "";

    //store updated array in local storage, re-render the list
    storeCities();
    renderCities();
});
