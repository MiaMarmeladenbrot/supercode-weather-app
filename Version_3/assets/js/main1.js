// # VERSION 3b

// ! HTML Elemente:
const weatherDataOutput = document.querySelector(".weather-data-output");
const mainInfoOutput = document.querySelector(".main-info");
const moreInfoOutput = document.querySelector(".more-info");
const optionsOutput = document.querySelector("#city-options");
const errorMessage = document.querySelector(".error-message");
const submitBtn = document.querySelector("#submit");
const form = document.querySelector("form");

// ! Funktion, um den User-Input-Value und die ausgewählte Stadt aus den options zu bekommen:
const getUserData = (event) => {
  event.preventDefault();

  // * User-Input auslesen:
  const userInput = document.querySelector("#city-input").value.toLowerCase();
  // console.log(userInput);

  // * Fehlermeldung, falls nichts eingegeben:
  if (userInput.length === 0) {
    errorMessage.innerHTML = `Bitte gib eine Stadt ein`;
  }

  // * Geodaten fetchen mit User-Input, um City rauszubekommen:
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=10&lang=de&appid=4d391bfa015027f6dda47c22088a30a6`
  )
    .then((res) => res.json())
    .then((cities) =>
      getOptions(cities).catch((err) =>
        console.log("fehler beim GeoDaten fetchen", err)
      )
    );
};

// ! Funktion, um die gefundenen Suchergebnisse via select/option anzeigen zu lassen
const getOptions = (cities) => {
  // * über Geo-Fetch-Daten des User-Inputs iterieren, um alle gefetchten Matches zum User-Input zu durchlaufen:
  cities.forEach((city) => {
    const optionElement = document.createElement("option");
    optionElement.textContent = `${city.name} | ${city.country}`;
    optionsOutput.appendChild(optionElement);

    console.log(city);

    // Event Handler
    const getLatLon = () => {
      const { lat, lon } = city;
      getWeatherData(lat, lon);
    };

    // * Event Listener, sobald auf Option geklickt wird:
    optionElement.addEventListener("click", getLatLon);
  });
};

// ! Funktion, um die Wetterdaten via longitude und latitude zu fetchen:
// mit festen lat- und lon-Werten, um Münchner-Wetter als default auszugeben:
const getWeatherData = (lat = 48.137154, lon = 11.576124) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4d391bfa015027f6dda47c22088a30a6&units=metric&lang=de`
  )
    .then((res) => res.json())
    .then((data) => fetchWeatherData(data));
};

getWeatherData();

// ! Funktion, um die gefetchten Wetterdaten ins HTML zu schreiben:
const fetchWeatherData = (weatherData) => {
  // * Sunrise und Sunset in Uhrzeit umwandeln (deutsche Ausgabe mit 2 Ziffern für h und m):
  const sunrise = weatherData.sys.sunrise * 1000;
  const sunriseTime = new Date(sunrise).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  console.log(sunriseTime);

  const sunset = weatherData.sys.sunset * 1000;
  const sunsetTime = new Date(sunset).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  console.log(sunsetTime);

  // * Main-Info-Box betexten:
  mainInfoOutput.innerHTML = `
          <p>${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString(
    "de-DE",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )}</p>
  <h3>${weatherData.name} (${weatherData.sys.country})</h3>
  <img src="https://openweathermap.org/img/wn/${
    weatherData.weather[0].icon
  }@2x.png">
  <h2>${Math.round(weatherData.main.temp)} °C</h2>
  <p>gefühlt wie ${Math.round(weatherData.main.feels_like)} °C</p>
  <p>${weatherData.weather[0].description}</p>
  `;

  // * kleineres Feld mit weiteren Infos betexten, sofern sie im json vorhanden sind:
  moreInfoOutput.innerHTML = `
    ${
      weatherData.rain
        ? `<p>Niederschlagsintensität: ${weatherData.rain["1h"]} mm/h</p>`
        : ""
    }
    ${
      weatherData.wind.speed
        ? `<p>Wind: ${Math.round(weatherData.wind.speed * 3.6)} km/h</p>`
        : ""
    }
    ${
      weatherData.wind.gust
        ? `<p>Böen: ${Math.round(weatherData.wind.gust * 3.6)} km/h</p>`
        : ""
    }

    ${
      weatherData.main.humidity
        ? `<p>Luftfeuchtigkeit: ${weatherData.main.humidity} %</p>
          `
        : ""
    }

    <p>Sonnenaufgang: ${sunriseTime}</p>
    <p>Sonnenuntergang: ${sunsetTime}</p>
    `;
};

form.addEventListener("submit", getUserData);
