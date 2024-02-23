// # VERSION 3: input-Feld mit select-Options

// ! HTML Elemente:
const weatherDataOutput = document.querySelector(".weather-data-output");
const mainInfoOutput = document.querySelector(".main-info");
const moreInfoOutput = document.querySelector(".more-info");
const optionsOutput = document.querySelector("#city-options");
const errorMessage = document.querySelector(".error-message");
const adviceMessage = document.querySelector(".advice-message");
// const form = document.querySelector("form");

// ! Funktion, um den User-Input-Value und die ausgewählte Stadt in die options weiterzugeben:
const getUserData = (event) => {
  event.preventDefault();

  // * User-Input auslesen:
  const userInput = document.querySelector("#city-input").value.toLowerCase();
  // console.log(userInput);

  // * Fehlermeldung, falls nichts eingegeben:
  if (userInput.length === 0) {
    errorMessage.innerHTML = `Bitte gib eine Stadt ein:`;
  }

  // * Geodaten fetchen mit User-Input, um City rauszubekommen (auf 5 begrenzt):
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=5&lang=de&appid=4d391bfa015027f6dda47c22088a30a6`
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
  // console.log(weatherData);

  // * Sonnenauf- und -untergang als Uhrzeit ausgeben (mit 0, falls Zahl<10 und mit UTCHours/Minutes wg. Sommer/Winterzeit):
  // : Sonnenaufgang
  const sunrise = new Date(
    (weatherData.sys.sunrise + weatherData.timezone) * 1000
  );

  const sunriseHours =
    sunrise.getUTCHours() < 10
      ? `0${sunrise.getUTCHours()}`
      : sunrise.getUTCHours();

  const sunriseMinutes =
    sunrise.getUTCMinutes() < 10
      ? `0${sunrise.getUTCMinutes()}`
      : sunrise.getUTCMinutes();
  // console.log(sunriseHours, sunriseMinutes);

  // : Sonnenuntergang:
  const sunset = new Date(
    (weatherData.sys.sunset + weatherData.timezone) * 1000
  );
  const sunsetHours =
    sunset.getUTCHours() < 10
      ? `0${sunset.getUTCHours()}`
      : sunset.getUTCHours();

  const sunsetMinutes =
    sunset.getUTCMinutes() < 10
      ? `0${sunset.getUTCMinutes()}`
      : sunset.getUTCMinutes();

  // * Zeit und Datum jeweils an ausgewählte Stadt anpassen (mit 0, falls Zahl<10):
  const dt = new Date((weatherData.dt + weatherData.timezone) * 1000);
  const localDay = dt.getDate();
  const localMonth = dt.getMonth() + 1;
  const localYear = dt.getFullYear();

  const localHours =
    dt.getUTCHours() - 1 < 10 ? `0${dt.getUTCHours()}` : dt.getUTCHours();
  const localMinutes =
    dt.getUTCMinutes() < 10 ? `0${dt.getUTCMinutes()}` : dt.getUTCMinutes();

  // * Weather-Data-Box betexten:
  weatherDataOutput.innerHTML = `
  <div>
  <p>${localDay}.${localMonth}.${localYear} | ${localHours}:${localMinutes}</p>
  <h3>${weatherData.name} (${weatherData.sys.country})</h3>
  </div>`;

  // * Main-Info-Box betexten:
  mainInfoOutput.innerHTML = `
  <img src="https://openweathermap.org/img/wn/${
    weatherData.weather[0].icon
  }@2x.png">
  <h2>${Math.round(weatherData.main.temp)} °C</h2>
  <p>gefühlt wie ${Math.round(weatherData.main.feels_like)} °C</p>
  <p>${weatherData.weather[0].description}</p>
  `;

  // * More-Info-Box betexten, sofern Inhalte in API vorhanden sind:
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

  // * Ratschlag ins HTML schreiben, basierend auf den IDs der Wetterdaten:
  // id = rain
  if (weatherData.weather[0].id >= 500 && weatherData.weather[0].id <= 599) {
    adviceMessage.innerHTML = `<p class="green">Mit Regenjacke vermutlich okay</p>`;
  } else if (
    // id = clear - few clouds
    weatherData.weather[0].id >= 800 &&
    weatherData.weather[0].id <= 802
  ) {
    adviceMessage.innerHTML = `<p class="green">Perfektes Wanderwetter, viel Spaß!</p>`;
  } else if (
    // id = clouds
    weatherData.weather[0].id >= 803 &&
    weatherData.weather[0].id <= 804
  ) {
    adviceMessage.innerHTML = `<p class="green">Die paar Wolken sind doch kein Problem!</p>`;
  } else if (
    // id = snow
    weatherData.weather[0].id >= 600 &&
    weatherData.weather[0].id <= 699
  ) {
    adviceMessage.innerHTML = `<p class="green">Mit warmer Kleidung vermutlich okay</p>`;
  } else if (
    // id = thunderstorm
    weatherData.weather[0].id >= 200 &&
    weatherData.weather[0].id <= 299
  ) {
    adviceMessage.innerHTML = `<p class="red">Viel zu stürmisch - ab auf die Couch!</p>`;
  } else if (
    // id = drizzle
    weatherData.weather[0].id >= 300 &&
    weatherData.weather[0].id <= 399
  ) {
    adviceMessage.innerHTML = `<p class="green">Ohne Regenjacke eventuell bisschen unangenehm</p>`;
  } else if (
    // id = atmosphere
    weatherData.weather[0].id >= 700 &&
    weatherData.weather[0].id <= 799
  ) {
    adviceMessage.innerHTML = `<p class="red">Da liegt was in der Luft, bleib lieber zu Haus ...</p>`;
  } else {
    adviceMessage.innerHTML = `<p class="red">Da kann ich leider nichts empfehlen</p>`;
  }
};

// * Event Listener auf dem Input-Feld, um die User-Suchergebnisse direkt darunter auszugeben:
const input = document.querySelector("#city-input");
input.addEventListener("input", () => {
  // Select-Element immer zuerst leeren, damit es sich überschreibt:
  optionsOutput.innerHTML = "";
  // Funktionsaufruf, um User-Daten auszugeben:
  getUserData(event);
});
// # EventListener auf das Event input funktioniert in dieser Form nicht für mobile, stattdessen keyup?
// https://stackoverflow.com/questions/41234395/how-do-i-listen-for-input-events-on-mobile-browsers
