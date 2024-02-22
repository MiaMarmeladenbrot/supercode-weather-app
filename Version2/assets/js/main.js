// ! VERSION 1
// 1. HTML Formular bauen mit leerem div und Ausgabe-section (Felder einzeln?)
// 2. Wetterdaten fetchen mit fester lat und long
// 3. Daten ins HTML schreiben

// ! Output-Variable
const weatherDataOutput = document.querySelector(".weather-data-output");
// console.log(weatherDataOutput);

const mainInfoOutput = document.querySelector(".main-info");
const moreInfoOutput = document.querySelector(".more-info");

// eventListener, deshalb mit appendChild
// Value auslesen

// ! API für Berlin fetchen
fetch(
  "https://api.openweathermap.org/data/2.5/weather?lat=52.520008&lon=13.404954&units=metric&lang=de&appid=4d391bfa015027f6dda47c22088a30a6"
)
  .then((res) => res.json())
  .then((weatherData) => {
    console.log(weatherData);

    // * Sunrise und Sunset in Uhrzeit umwandeln:
    // leider sind die Daten für Sonnenaufgang falsch ...
    const sunrise = weatherData.sys.sunrise;
    const sunriseDatum = new Date(sunrise);
    const sunriseTime = sunriseDatum.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
    console.log(sunriseTime);

    const sunset = weatherData.sys.sunset;
    const sunsetDatum = new Date(sunset);
    const sunsetTime = sunsetDatum.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
    console.log(sunsetTime);

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
        ? `<p>Niederschlagsintensität | ${weatherData.rain["1h"]} mm/h</p>`
        : ""
    }
    ${
      weatherData.wind.speed
        ? `<p>Wind | ${Math.round(weatherData.wind.speed * 3.6)} km/h</p>`
        : ""
    }
    ${
      weatherData.wind.gust
        ? `<p>Böen | ${Math.round(weatherData.wind.gust * 3.6)} km/h</p>`
        : ""
    }

    ${
      weatherData.main.humidity
        ? `<p>Luftfeuchtigkeit | ${weatherData.main.humidity} %</p>
          `
        : ""
    }
    
    <p>Sonnenaufgang | ${sunriseTime}</p>
    <p>Sonnenuntergang | ${sunsetTime}</p>


    `;
  })
  .catch((err) => console.log("geht nicht", err));

// function checkData(data, des) {
//   data ? `<p>${des} | ${data} mm/h</p>` : "";
// }

// ! gelöschte Teile
{
  /* <p>Wind | ${Math.round(weatherData.wind.speed * 3.6)} km/h</p> */
}

{
  /* <p>Böen | ${Math.round(weatherData.wind.gust * 3.6)} km/h</p>
    <p>Luftfeuchtigkeit | ${weatherData.main.humidity} %</p>
    <p>Sonnenaufgang | ${sunriseTime}</p>
    <p>Sonnenuntergang | ${sunsetTime}</p> */
}
