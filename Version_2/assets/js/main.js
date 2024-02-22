// # Version 2: Input-Formular ohne select options, 1. Treffer wird automatisch ausgewählt

// ! Variablen
const weatherDataOutput = document.querySelector(".weather-data-output");
const mainInfoOutput = document.querySelector(".main-info");
const moreInfoOutput = document.querySelector(".more-info");
const optionsOutput = document.querySelector("#city-options");
const errorMessage = document.querySelector(".error-message");
const submitBtn = document.querySelector("#submit");

// ! Event-Listener fürs Eingeben der Stadt
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();

  // * User-Input auslesen:
  const userInput = document.querySelector("#city-input").value.toLowerCase();
  // console.log(userInput);

  // * Fehlermeldung, falls nichts eingegeben:
  if (userInput.length === 0) {
    errorMessage.innerHTML = `Bitte gib eine Stadt ein`;
  }

  // ! 1. Fetch, um die City aus User-Input anzuzeigen:
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=10&lang=de&appid=4d391bfa015027f6dda47c22088a30a6`
  )
    .then((res) => res.json())
    .then((geoData) => {
      //   console.log(geoData);
      //   console.log(geoData[0]);
      let lat = geoData[0].lat;
      let lon = geoData[0].lon;
      console.log(geoData[0].lat);
      console.log(geoData[0].lon);

      // ! 2. Fetch, um mir mit Longitude und Latitude der Stadt die Daten für die jeweilige Stadt rauszuholen:
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=de&appid=4d391bfa015027f6dda47c22088a30a6`
      )
        .then((res) => res.json())
        .then((weatherData) => {
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
                  ? `<p>Wind: ${Math.round(
                      weatherData.wind.speed * 3.6
                    )} km/h</p>`
                  : ""
              }
              ${
                weatherData.wind.gust
                  ? `<p>Böen: ${Math.round(
                      weatherData.wind.gust * 3.6
                    )} km/h</p>`
                  : ""
              }

              ${
                weatherData.main.humidity
                  ? `<p>Luftfeuchtigkeit: ${weatherData.main.humidity} %</p>
                    `
                  : ""
              }
              `;
        })
        .catch((err) => console.log("fehler", err));
    })
    .catch((err) => console.log("fehler beim ersten fetch", err));
});

// ! Fetch, um Felder beim Laden der Seite per default zu befüllen
// # das muss einfacher gehen mit Parametern ...
fetch(
  "https://api.openweathermap.org/data/2.5/weather?lat=52.520008&lon=13.404954&units=metric&lang=de&appid=4d391bfa015027f6dda47c22088a30a6"
)
  .then((res) => res.json())
  .then((weatherData) => {
    // * großes Hauptinfo-Feld betexten:
    mainInfoOutput.innerHTML = `
    <p>${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString(
      "de-DE",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}</p>
    <h3>Berlin-${weatherData.name} (${weatherData.sys.country})</h3>
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

    `;
  })
  .catch((err) => console.log("geht nicht", err));
