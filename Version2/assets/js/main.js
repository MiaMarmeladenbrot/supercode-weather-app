// ! VERSION 2
// 1. HTML Formular bauen mit leeren Ausgabe-Feldern ✅
// 2. output Variablen ✅
// 3. eventListener, deshalb mit appendChild ✅
// 4. value auslesen ✅
// 5. Geodaten fetchen ✅
// 6. Wetterdaten fetchen mit variablen lat und long
// 7. Daten ins HTML schreiben
// UND: Resultate reduzieren, select/option?

// ! Variablen
const weatherDataOutput = document.querySelector(".weather-data-output");
// console.log(weatherDataOutput);
const mainInfoOutput = document.querySelector(".main-info");
const moreInfoOutput = document.querySelector(".more-info");
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

  // * Geodaten fetchen mit User-Input:
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=10&lang=de&appid=4d391bfa015027f6dda47c22088a30a6`
  )
    .then((res) => res.json())
    .then((geoData) => {
      // console.log(geoData);

      // * über Geo-Daten des User-Inputs iterieren, um alle gefetchten Matches zum User-Input zu erhalten und zu durchlaufen:
      geoData.forEach((item) => {
        // console.log(item.lat);
        // console.log(item.lon);

        // * Wetterdaten fetchen mit User-Input:
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${item.lat}&lon=${item.lon}&units=metric&lang=de&appid=4d391bfa015027f6dda47c22088a30a6`
        )
          .then((res) => res.json())
          .then((weatherData) => {
            console.log(weatherData);

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
          .catch((err) => console.log("fehler beim wetterdaten fetchen", err));
      });
    })
    .catch((err) => console.log("fehler beim geo fetch", err));
});
