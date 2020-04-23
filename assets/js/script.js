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

// five day forcast
var getFiveDay = function(event) {
    let city = $('#search-city').val();
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + owmApi;
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(response) {
            let fiveDayHTML = `
            <h2>5-Day Forecast</h2>
            <div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;
            for(i = 0; i < response.length; i++) {
                let dayData = response.list[i];
                let dayTimeUTC = dayData.dt;
                let timeOffset = response.city.timezone;
                let timeOffsetHours = timeOffset / 60 / 60;
                let thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeOffsetHours);
                let iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
                if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss:") === "13:00:00") {
                    fiveDayHTML += `
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
            }
            fiveDayHTML += '</div>';
            $('#five-day-forecast').html(fiveDayHTML);
            });
        } else {
            console.log("Forecast API Error");
        }
    })
};

// current weather
var getCurrentWeather = function (event) {
    let city = $('#search-city').val();
    currentCity = $('#search-city').val();
    let longitude;
    let latitude;
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + owmApi;
    fetch(apiUrl).then(function(response) { 
        if(response.ok) {
            response.json().then(function(response) {
                var currentWeatherIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
                let UTCtime = response.dt;
                let timeOffset = response.timezone;
                let timeOffsetHours = timeOffset / 60 / 60;
                let currentMoment = moment.unix(UTCtime).utc().utcOffset(timeOffsetHours);
            saveCity(city);
            $('#search-error').text("");
            pullCities();
            getFiveDay(event);
            $('header-text').text(response.name);
            let currentHTML = `
                <h3>Current Conditions<img src="${currentWeatherIcon}"></h3>
                <h6>${currentMoment.format("MM/DD/YY h:mma")} local time</h6>
                <br>
                <ul class="list-unstyled">
                    <li>Temperature: ${response.main.temp}&#8457;</li>
                    <li>Humidity: ${response.main.humidity}%</li>
                </ul>`;
            $('#current-weather').html(currentHTML);
            latitude = response.coord.lat;
            longitude = response.coord.lat;
            });
        } else {
            console.log("Current Weather API Error: try another city.");
            $('#search-error').text("City not found!");
        }
    });
};

var saveCity = function(newCity) {
    let cityExists = false;
    for (i = 0; i < localStorage.length; i++) {
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
        for (i = 0; i < localStorage.length; i++) {
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