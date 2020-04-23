var owmApi = "788d5638d7c8e354a162d6c9747d1bdf";
var usApi = "R_fPrwXAPD_TNN3gw5mXZOhXQ52yQ8aPTLvMPRe3U4Q";
var currentCity = "";
var lastCity = "";

// Use URLSearchParams to get URL parameters and check url for API key
// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
var getUrlPar = function() {
    let urlPar = new URLSearchParams(window.location.search);
    if (urlPar.has('key')) {
        owmApi = urlPar.get('key');
    }
};

// current weather
// https://api.jquery.com/jQuery.ajax/
// https://www.xul.fr/en/html5/fetch.php
var getCurrentWeather = function (event) {
    let city = $('#search-city').val();
    currentCity = $('#search-city').val();
    let longitude;
    let latitude;
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + owmApi;
    $.ajax({
        url: apiUrl,
        method: "GET"  
    }).done(function (response) {
        saveCity(city);
        $('#search-error').text("");
        currentWeatherIcon="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        let currentTimeUTC = response.dt;
        let currentTimeZoneOffset = response.timezone;
        let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
        let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);
        pullCities();
        getFiveDay(event);
        $('#header-text').text(response.name);
        let currentWeatherHTML = `
            <h3>Current Conditions<img src="${currentWeatherIcon}"></h3>
            <h6>${currentMoment.format("MM/DD/YY h:mma")} local time</h6>
            <br>
            <ul class="list-unstyled">
                <li>Temperature: ${response.main.temp}&#8457;</li>
                <li>Humidity: ${response.main.humidity}%</li>
                <li>Wind Speed: ${response.wind.speed} mph</li>
                <li id="uvIndex">Mid-day UV Index:</li>
            </ul>`;
        $('#current-weather').html(currentWeatherHTML);
        latitude = response.coord.lat;
        longitude = response.coord.lon;
        let uvQueryURL = "api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=" + owmApi;
        uvQueryURL = "https://cors-anywhere.herokuapp.com/" + uvQueryURL;
        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).done(function (response) {
            uvIndex = response.value;
            $('#uvIndex').html(`Mid-day UV Index: <span id="uvVal"> ${uvIndex}</span>`);
            if (uvIndex>=0 && uvIndex<3){
                $('#uvVal').attr("class", "uv-green");
            } else if (uvIndex>=3 && uvIndex<6){
                $('#uvVal').attr("class", "uv-yellow");
            } else if (uvIndex>=6 && uvIndex<8){
                $('#uvVal').attr("class", "uv-orange");
            } else if (uvIndex>=8 && uvIndex<11){
                $('#uvVal').attr("class", "uv-red");
            } else if (uvIndex>=11){
                $('#uvVal').attr("class", "uv-violet");
            }
        });
    })
        .fail(function () {
            console.log("Current Weather API Error: city likely not found.");
            $('#search-error').text("City not found.");
        });
};

// five day forecast
// https://api.jquery.com/jQuery.ajax/
// https://www.xul.fr/en/html5/fetch.php
var getFiveDay = function(event) {
    let city = $('#search-city').val();
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + owmApi;
    $.ajax({
        url: apiUrl,
        method: "GET"
    }).done(function (response) {
        let fiveDayForecastHTML = `
        <h2>5-Day Forecast</h2>
        <div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;
        for (let i = 0; i < response.list.length; i++) {
            let dayData = response.list[i];
            let dayTimeUTC = dayData.dt;
            let timeZoneOffset = response.city.timezone;
            let timeZoneOffsetHours = timeZoneOffset / 60 / 60;
            let thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
            let iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
            if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
                fiveDayForecastHTML += `
                <div class="weather-card card m-2 p0">
                <ul class="list-unstyled p-3">
                <li>${thisMoment.format("MM/DD/YY")}</li>
                <li class="weather-icon"><img src="${iconURL}"></li>
                <li>Temp: ${dayData.main.temp}&#8457;</li>
                <li>Humidity: ${dayData.main.humidity}%</li>
                </ul>
                </div>
                <br>`;
            }
        };
        fiveDayForecastHTML += `</div>`;
        $('#five-day').html(fiveDayForecastHTML);
    })
        .fail(function () {
            console.log("Forecast API Error");
        });
};

var saveCity = function(newCity) {
    let cityExists = false;
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage["cities" + i] === newCity) {
            cityExists = true;
            break;
        }
    }
    if (cityExists === false) {
        localStorage.setItem('cities' + localStorage.length, newCity);
    }
};

var pullCities = function() {
    $('#cities-results').empty();
    if (localStorage.length === 0){
        if (lastCity){
            $('#search-city').attr("value", lastCity);
        } else {
            $('#search-city').attr("value", "Fort Worth");
        }
    } else {
        let lastCityKey = "cities"+(localStorage.length-1);
        lastCity = localStorage.getItem(lastCityKey);
        $('#search-city').attr("value", lastCity);
        for (let i = 0; i < localStorage.length; i++) {
            let city = localStorage.getItem("cities" + i);
            let cityEl;
            if (currentCity===""){
                currentCity=lastCity;
            }
            if (city === currentCity) {
                cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
            } else {
                cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
            } 
            $('#city-results').prepend(cityEl);
        }
        if (localStorage.length>0){
            $('#clear-storage').html($('<a id="clear-storage" href="#">clear</a>'));
        } else {
            $('#clear-storage').html('');
        }
    }
};

$('#search-button').on("click", function (event) {
    event.preventDefault();
    currentCity = $('#search-city').val();
    getCurrentWeather(event);
});

$('#city-results').on("click", function(event) {
    event.preventDefault();
    $('#search-city').val(event.target.textContent);
    currentCity = $('#search-city').val();
    getCurrentWeather(event);
});

$('#clear-storage').on("click", function(event){
    localStorage.clear();
    pullCities();
});

var runScript = function() {
    getUrlPar();
    pullCities();
    getCurrentWeather();
};

runScript();