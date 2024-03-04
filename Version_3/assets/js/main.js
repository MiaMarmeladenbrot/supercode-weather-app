// # VERSION 3: input-Feld mit select-Options
// * To Dos
// - weitere Illus suchen, um sie bei Ratschlägen auszugeben: https://www.freepik.com/author/pch-vector
// - 4. Version mit klassischem Wetter-App-Design machen
// - footer mit credits
// - Plus- und Minus-Grade bei den Ratschlägen berücksichtigen (dann bei Bildern über 30 Grad dieses nehmen: https://www.freepik.com/free-vector/woman-conditioning-air-home-feeling-hot-trying-cool-sitting-gat-fan-vector-illustration-summer-weather-home-appliance-heat-room_10174022.htm#&position=4&from_view=user&uuid=38b97589-7ac4-4963-8d79-7bca66aa5275)

// ! HTML Elemente:
const weatherDataOutput = document.querySelector(".weather-data-output");
const mainInfoOutput = document.querySelector(".main-info");
const moreInfoOutput = document.querySelector(".more-info");
const optionsOutput = document.querySelector("#city-options");
const errorMessage = document.querySelector(".error-message");
const adviceMessage = document.querySelector(".advice-message");
const adviceImg = document.querySelector(".advice-img");

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

  // * Geodaten fetchen mit User-Input, um gesuchten Ort rauszubekommen (auf 5 begrenzt):
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=5&lang=de&appid=4d391bfa015027f6dda47c22088a30a6`
  )
    .then((res) => res.json())
    .then((cities) =>
      // * Funktionsaufruf, um gefundene Suchergebnisse als Select-Optionen auszugeben:
      getOptions(cities)
    )
    .catch((err) => console.log("Fehler beim GeoDaten-Fetchen", err));
};

// ! Funktion, um die gefundenen Suchergebnisse via article/p anzeigen zu lassen:
const getOptions = (cities) => {
  // * über gefetchte Geo-Daten des User-Inputs (getUserData()) iterieren, um alle gefetchten Suchergebnisse des User-Inputs zu durchlaufen:
  cities.forEach((city) => {
    // console.log(city);

    // * Ratschlag-p-Tag leeren:
    document.querySelector(".ratschlag").classList.add("hide");

    // * p-Elemente im article-Output erstellen und mit Name und Land des Suchergebnisses befüllen:
    const optionElement = document.createElement("p");
    optionElement.textContent = `${city.name} (${city.country})`;
    errorMessage.innerHTML = "";
    optionsOutput.appendChild(optionElement);

    // * Event Listener: sobald auf ein p-Tag geklickt wird, sollen ...
    optionElement.addEventListener("click", () => {
      // * ... alle p-Tags wieder verschwinden:
      optionsOutput.innerHTML = "";

      // * ... und mithilfe der Latitude und Longitude der ausgewählten Stadt soll die Funktion getWeatherData () aufgerufen werden, um die Wetterdaten für die gewählte Stadt auszugeben:
      const lat = city.lat;
      const lon = city.lon;

      // console.log(lat, lon);
      getWeatherData(lat, lon);
    });
  });
};

// ! Funktion, um die Wetterdaten via longitude und latitude zu fetchen:
// mit festen lat- und lon-Werten, um Münchner-Wetter als default auszugeben:
const getWeatherData = (lat = 48.137154, lon = 11.576124) => {
  fetch(
    // * Fetch mit variablen Latitude- und Longitude-Werten, um die Daten der jeweils gesuchten Stadt anzuzeigen:
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4d391bfa015027f6dda47c22088a30a6&units=metric&lang=de`
  )
    .then((res) => res.json())
    // * Funktionsaufruf, um gefundene Daten ins HTML zu schreiben:
    .then((data) => fetchWeatherData(data));
};

// getWeatherData(); //--> auskommentiert, damit zu Beginn doch eine leere Seite angezeigt wird

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

  // * aktuelle Zeit und Datum jeweils an ausgewählte Stadt anpassen (mit 0, falls Zahl<10):
  // dt = Time of data calculation, unix, UTC
  const dt = new Date((weatherData.dt + weatherData.timezone) * 1000);
  const localDay = dt.getDate();
  const localMonth = dt.getMonth() + 1;
  const localYear = dt.getFullYear();

  const localHours =
    dt.getUTCHours() < 10 ? `0${dt.getUTCHours()}` : dt.getUTCHours();
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

  // * Ratschlag ins HTML schreiben zusammen mit passendem Bild, basierend auf den IDs der Wetterdaten:
  // # hier noch weitere Bilder suchen und einbauen
  // id = rain
  if (weatherData.weather[0].id >= 500 && weatherData.weather[0].id <= 599) {
    adviceMessage.innerHTML = `<p class="green">Mit Regenjacke vermutlich okay</p>`;
    adviceImg.innerHTML = `<img src="./assets/img/rain.png" alt="Illustration of woman and child in rain">`;
  } else if (
    // id = clear - few clouds
    weatherData.weather[0].id >= 800 &&
    weatherData.weather[0].id <= 802
  ) {
    adviceMessage.innerHTML = `<p class="green">Perfektes Wanderwetter, viel Spaß!</p>`;
    adviceImg.innerHTML = `<img src="./assets/img/two-hikers.png" alt="Illustration of hiking man and woman">`;
  } else if (
    // id = clouds
    weatherData.weather[0].id >= 803 &&
    weatherData.weather[0].id <= 804
  ) {
    adviceMessage.innerHTML = `<p class="green">Die paar Wolken sind doch kein Problem!</p>`;
    // # hier fehlt noch ein Wolken-Bild
  } else if (
    // id = snow
    weatherData.weather[0].id >= 600 &&
    weatherData.weather[0].id <= 699
  ) {
    adviceMessage.innerHTML = `<p class="green">Mit warmer Kleidung vermutlich okay</p>`;
    adviceImg.innerHTML = `<img src="./assets/img/snow.png" alt="Illustration of children playing on ice">`;
  } else if (
    // id = thunderstorm
    weatherData.weather[0].id >= 200 &&
    weatherData.weather[0].id <= 299
  ) {
    adviceMessage.innerHTML = `<p class="red">Viel zu stürmisch - ab auf die Couch!</p>`;
    adviceImg.innerHTML = `<img src="./assets/img/couch.png" alt="Illustration of woman sitting on a couch">`;
  } else if (
    // id = drizzle
    weatherData.weather[0].id >= 300 &&
    weatherData.weather[0].id <= 399
  ) {
    adviceMessage.innerHTML = `<p class="green">Ohne Regenjacke evtl. bisschen unangenehm</p>`;
    adviceImg.innerHTML = `<img src="./assets/img/rain.png" alt="Illustration of woman and child in rain">`;
  } else if (
    // id = atmosphere
    weatherData.weather[0].id >= 700 &&
    weatherData.weather[0].id <= 799
  ) {
    adviceMessage.innerHTML = `<p class="red">Da liegt was in der Luft, bleib lieber zu Haus ...</p>`;
    adviceImg.innerHTML = `<img src="./assets/img/couch.png" alt="Illustration of woman sitting on a couch">`;
  } else {
    adviceMessage.innerHTML = `<p class="red">Da kann ich leider nichts empfehlen</p>`;
  }
};

// ! Event Listener auf dem Input-Feld, um die User-Suchergebnisse direkt darunter auszugeben:
const input = document.querySelector("#city-input");
input.addEventListener("input", () => {
  // article-Element immer zuerst leeren, damit die p-Tags darin sich überschreiben, nicht ergänzen:
  optionsOutput.innerHTML = "";
  // Funktionsaufruf, um User-Input zu kriegen und alles weitere loszutreten:
  getUserData(event);
});
