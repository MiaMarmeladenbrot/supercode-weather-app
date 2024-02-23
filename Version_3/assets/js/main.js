// # VERSION 3: input-Feld mit select-Options

// ! HTML Elemente:
const weatherDataOutput = document.querySelector(".weather-data-output");
const mainInfoOutput = document.querySelector(".main-info");
const moreInfoOutput = document.querySelector(".more-info");
const optionsOutput = document.querySelector("#city-options");
const errorMessage = document.querySelector(".error-message");
// const form = document.querySelector("form");

// ! Funktion, um den User-Input-Value und die ausgewählte Stadt in die options weiterzugeben:
const getUserData = (event) => {
  event.preventDefault();

  // * User-Input auslesen:
  const userInput = document.querySelector("#city-input").value.toLowerCase();
  // console.log(userInput);

  // * Fehlermeldung, falls nichts eingegeben:
  if (userInput.length === 0) {
    errorMessage.innerHTML = `Bitte gib eine Stadt ein`;
  }

  // * Geodaten fetchen mit User-Input, um City rauszubekommen (auf 5 begrenzt):
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=5&lang=de&appid=4d391bfa015027f6dda47c22088a30a6`
  )
    .then((res) => res.json())
    .then(
      (cities) =>
        // * Funktionsaufruf, um gefundenen Suchergebnisse als Optionen auszugeben:
        getOptions(cities)
      // .catch((err) =>
      //   console.log("fehler beim GeoDaten fetchen", err)
      // )
    );
};

// ! Funktion, um die gefundenen Suchergebnisse via select/option anzeigen zu lassen
const getOptions = (cities) => {
  // * über Geo-Fetch-Daten des User-Inputs iterieren, um alle gefetchten Suchergebnisse des User-Inputs zu durchlaufen:
  cities.forEach((city) => {
    // console.log(city);

    // * option-Elemente im select-Output erstellen und mit Name und Land des Suchergebnisses befüllen:
    const optionElement = document.createElement("option");
    optionElement.textContent = `${city.name} | ${city.country}`;
    optionsOutput.classList.add("show");
    errorMessage.innerHTML = "";
    optionsOutput.appendChild(optionElement);

    // * Latitude und Longitude der gesuchten Stadt weitergeben an Funktion getWeatherData beim Klick auf die Stadt in den options:
    const getLatLon = () => {
      const lat = city.lat;
      const lon = city.lon;

      // console.log(lat, lon);
      getWeatherData(lat, lon);
    };

    // * Event Listener: sobald auf eine Option geklickt wird, sollen ...
    // optionElement.addEventListener("click", getLatLon);
    optionElement.addEventListener("click", () => {
      // * ... die anderen Optionen verschwinden
      optionsOutput.classList.remove("show");

      // * ... und via Funktionsaufruf die Wetterdaten für die ausgewählte Stadt angezeigt werden:
      getLatLon();
    });
  });
};

// ! Funktion, um die Wetterdaten via longitude und latitude zu fetchen:
// mit festen lat- und lon-Werten, um Münchner-Wetter als default auszugeben:
const getWeatherData = (lat = 48.137154, lon = 11.576124) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4d391bfa015027f6dda47c22088a30a6&units=metric&lang=de`
  )
    .then((res) => res.json())
    // * Funktionsaufruf, um gefundene Daten ins HTML zu schreiben:
    .then((data) => fetchWeatherData(data));
};

getWeatherData();

// ! Funktion, um die gefetchten Wetterdaten ins HTML zu schreiben:
const fetchWeatherData = (weatherData) => {
  console.log(weatherData);

  // * Sonnenauf- und -untergang als Uhrzeit ausgeben (mit 0, falls Zahl<10):
  // -1, weil Sommerzeit/Winterzeit-Problematik
  // console.log(weatherData.sys.sunrise);
  const sunrise = new Date(
    (weatherData.sys.sunrise + weatherData.timezone) * 1000
  );
  const sunriseHours =
    sunrise.getHours() - 1 < 10
      ? `0${sunrise.getHours() - 1}`
      : sunrise.getHours() - 1;
  const sunriseMinutes =
    sunrise.getMinutes() < 10
      ? `0${sunrise.getMinutes()}`
      : sunrise.getMinutes();
  // console.log(sunriseHours, sunriseMinutes);

  const sunset = new Date(
    (weatherData.sys.sunset + weatherData.timezone) * 1000
  );
  const sunsetHours =
    sunset.getHours() - 1 < 10
      ? `0${sunset.getHours() - 1}`
      : sunset.getHours() - 1;
  const sunsetMinutes =
    sunset.getMinutes() < 10 ? `0${sunset.getMinutes()}` : sunset.getMinutes();
  // console.log(sunsetHours, sunsetMinutes);

  // * Zeit und Datum jeweils an ausgewählte Stadt anpassen (mit 0, falls Zahl<10):
  // -1, weil Sommerzeit/Winterzeit-Problematik
  // console.log(weatherData.dt);
  // console.log(weatherData);
  const dt = new Date((weatherData.dt + weatherData.timezone) * 1000);
  const localDay = dt.getDate();
  const localMonth = dt.getMonth() + 1;
  const localYear = dt.getFullYear();

  const localHours =
    dt.getHours() - 1 < 10 ? `0${dt.getHours() - 1}` : dt.getHours() - 1;
  const localMinutes =
    dt.getMinutes() < 10 ? `0${dt.getMinutes()}` : dt.getMinutes();

  // * Main-Info-Box betexten:

  weatherDataOutput.innerHTML = `
  <div>
  <p>${localDay}.${localMonth}.${localYear} | ${localHours}:${localMinutes}</p>
  <h3>${weatherData.name} (${weatherData.sys.country})</h3>
  </div>`;

  mainInfoOutput.innerHTML = `
  <img src="https://openweathermap.org/img/wn/${
    weatherData.weather[0].icon
  }@2x.png">
  <h2>${Math.round(weatherData.main.temp)} °C</h2>
  <p>gefühlt wie ${Math.round(weatherData.main.feels_like)} °C</p>
  <p>${weatherData.weather[0].description}</p>
  `;

  // * kleineres Feld mit weiteren Infos betexten, sofern sie im json vorhanden sind:
  moreInfoOutput.innerHTML = `
    ${weatherData.rain ? `<p>🌧️ ${weatherData.rain["1h"]} mm/h</p>` : ""}
    ${
      weatherData.wind.speed
        ? `<p>💨 ${Math.round(weatherData.wind.speed * 3.6)} km/h</p>`
        : ""
    }
    ${
      weatherData.wind.gust
        ? `<p>🌬️ ${Math.round(weatherData.wind.gust * 3.6)} km/h</p>`
        : ""
    }

    ${
      weatherData.main.humidity
        ? `<p>🌡️ ${weatherData.main.humidity} %</p>
          `
        : ""
    }
    <p>☀️ ${sunriseHours}:${sunriseMinutes}</p>
    <p>☀️ ${sunsetHours}:${sunsetMinutes}</p>
  
    `;
};

// * Event Listener auf dem Input-Feld, um die User-Suchergebnisse direkt darunter auszugeben:
// form.addEventListener("submit", getUserData);
const input = document.querySelector("#city-input");
input.addEventListener("input", () => {
  // Select-Element immer zuerst leeren, damit es sich überschreibt:
  optionsOutput.innerHTML = "";
  // Funktionsaufruf, um User-Daten auszugeben:
  getUserData(event);
});
