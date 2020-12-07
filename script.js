//Search variables
var searchBtn = document.querySelector(".search-btn");
var searchInput = (document.querySelector(".search-input")).value.trim();

var cityList = document.querySelector(".city-list");

var pastSearches = [];

// API related variables
let ApiKey = "ec824d7cd7829507b791a150658771ef";
let city = searchInput; //click listener to insert html
let lat = "";
let lon = "";


init();

function renderCities () {
    cityList.innerHTML = "";
    //Render a new li for each city search
    for (var i = 0; i < pastSearches.length; i++) {
        var citySearches = pastSearches[i];

        var li = document.createElement("li");
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

function requestWeather () {

    //clear();

    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${ApiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        //console.log(response)
        var weatherApiResponse = response;
        
        lon = response.coord.lon;
        lat = response.coord.lat;

        queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${ApiKey}`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            var uvApiResponse = response;
            //console.log("UV ", uvApiResponse ); // to test response

            renderCurrentWeather(weatherApiResponse, uvApiResponse);
        });

    });
}

        //const tempF = (response.main.temp - 273.15) * 1.80 + 32;
function renderCurrentWeather(response1, response2){
    //console.log("test1", response1); //to test response
    //console.log("test2", response2); //to test response
    $(".city-selected").html(`<h1>${response1.name} (${month}/${day}/${year}) (${response1.weather[0].description})</h1>`);
    $(".humidity").text(`Humidity: ${response1.main.humidity}`);
    $(".wind").text(`Wind Speed: ${response1.wind.speed}`);
    $(".temp").text(`Temperature (F): ${response1.main.temp.toFixed(2)}`);
    $(".uv").text(`UV Index: ${response2.value}`);

}      


// GET functionality for weather forecast of selected city + HTML output
function requestForecast (){

    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${ApiKey}&cnt=5`;

        $.ajax ({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            //console.log("testFct", response); //to test response
            //console.log("test day", response.list[0].main.temp); //to test path

           {

            $(".card-deck").html(
                `<div class="card text-white bg-primary">
                <h4>${month}/${day}/${year}</h4>
                <p>Temp: ${response.list[0].main.temp.toFixed(2)}</p>
                <p>Humidity: ${response.list[0].main.humidity}</p>
                </div>`
            );
        }
                  

    });
    
}

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

//click handler when search is submitted
$(".search-btn").on("click", function(event) {
    event.preventDefault();

    //return from function if input is blank
    if (searchInput === "") {
        return;
    }

    // add new city to pastSearches array
    pastSearches.push(searchInput);
    searchInput.value = "";

    //store updated array in local storage, re-render the list
    storeCities();
    renderCities();

    requestWeather();
    requestForecast();
});
