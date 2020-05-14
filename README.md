<h1 align="center">Weather Dashboard 👋</h1>

<p align="center">
    <img src="https://img.shields.io/github/repo-size/jpd61/README-generator" />
    <img src="https://img.shields.io/github/languages/top/jpd61/README-generator"  />
    <img src="https://img.shields.io/github/issues/jpd61/README-generator" />
    <img src="https://img.shields.io/github/last-commit/jpd61/README-generator" >
    <a href="https://twitter.com/jpdewoody">
        <img alt="Twitter: jpdewoody" src="https://img.shields.io/twitter/follow/jpdewoody.svg?style=social" target="_blank" />
    </a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Javascript-yellow" />
    <img src="https://img.shields.io/badge/jQuery-blue"  />
    <img src="https://img.shields.io/badge/HTML5-orange" />
    <img src="https://img.shields.io/badge/Bootstrap-purple" >
    <img src="https://img.shields.io/badge/Moment.js-green" />
    <img src="https://img.shields.io/badge/OpenWeather%20API-orange" />
</p>

Created a dashboard that uses the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities that are searched for by user. Uses `localStorage` to store any cities that have been searched for prior and allows user to call them up quickly.  


**Live application deployed at: https://jpd61.github.io/weather-dashboard/**  

The following image demonstrates the application functionality:

<img src="./screenshot.PNG">  


## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

## Research websites used to learn

In this challenge I spent some time learning the difference between AJAX and Fetch and experimented with both. Particularly the AJAX .fail function, which I really liked. I also tried to continue learning the arrow function and implementing it in my code. I had my first experience with a Cross-origin resource sharing (CORS) error, which I believe I found a solution for using the cors-anywhere API link below.

https://api.jquery.com/jQuery.ajax/

https://www.xul.fr/en/html5/fetch.php

https://cors-anywhere.herokuapp.com/

https://www.freecodecamp.org/news/when-and-why-you-should-use-es6-arrow-functions-and-when-you-shouldnt-3d851d7f0b26/