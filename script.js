const API_key = "7acf08d4381c2c30ef28857eaed4b96a";
const searchForm = document.getElementById("weather_search");

searchForm.addEventListener("submit", getWeather);

async function getWeather(event) {
    event.preventDefault();

    const cityInput = document.getElementById("city_name");
    const city = cityInput.value.trim();
    const searchButton = document.getElementById("search");
    const statusMessage = document.getElementById("weather_status");
    const results = document.getElementById("weather_results");

    if (!city) {
        statusMessage.dataset.state = "error";
        statusMessage.textContent = "Enter a city name to search for its weather.";
        cityInput.focus();
        return;
    }

    searchButton.disabled = true;
    searchButton.classList.add("is-loading");
    searchButton.querySelector(".button-label").textContent = "Searching";
    results.hidden = true;
    results.setAttribute("aria-busy", "true");
    statusMessage.dataset.state = "loading";
    statusMessage.textContent = `Getting the forecast for ${city}…`;

    try {
        const encodedCity = encodeURIComponent(city);
        const currentWeatherUrl =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${API_key}`;
        const forecastUrl =
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&appid=${API_key}`;

        const [currentWeather, forecast] = await Promise.all([
            fetchWeather(currentWeatherUrl),
            fetchWeather(forecastUrl)
        ]);

        if (!Array.isArray(forecast.list) || forecast.list.length === 0) {
            throw new Error("The forecast is currently unavailable. Please try again later.");
        }

        displayWeather(currentWeather);
        displayHourlyForcast(forecast.list, forecast.city?.timezone ?? currentWeather.timezone ?? 0);
        results.hidden = false;
        statusMessage.dataset.state = "success";
        statusMessage.textContent = `Weather updated for ${currentWeather.name}.`;
    } catch (error) {
        statusMessage.dataset.state = "error";
        statusMessage.textContent = error.message || "We couldn't load the weather. Please try again.";
    } finally {
        searchButton.disabled = false;
        searchButton.classList.remove("is-loading");
        searchButton.querySelector(".button-label").textContent = "Search";
        results.setAttribute("aria-busy", "false");
    }
}

async function fetchWeather(url) {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("We couldn't find that place. Check the spelling and try again.");
        }
        if (response.status === 401) {
            throw new Error("The weather service is unavailable right now. Please try again later.");
        }
        throw new Error(data.message || "The weather service couldn't complete your request.");
    }

    return data;
}

function displayWeather(data) {
    const weatherIcon = document.getElementById("weather_icon");
    const cityHeading = document.getElementById("city_heading");
    const temperature = document.getElementById("temp_div");
    const description = data.weather[0].description;
    const temperatureCelsius = Math.round(data.main.temp - 273.15);

    cityHeading.textContent = data.name;
    document.getElementById("weather_info").textContent = description;
    temperature.textContent = `${temperatureCelsius}°C`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = "";
}

function displayHourlyForcast(hourlyData, timezoneOffset) {
    const forecastContainer = document.getElementById("hourly_forcast");
    const forecastEntries = hourlyData.slice(1, 9);
    const fragment = document.createDocumentFragment();
    const formatter = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        timeZone: "UTC"
    });

    forecastEntries.forEach((entry) => {
        const forecastTime = new Date((entry.dt + timezoneOffset) * 1000);
        const timeLabel = formatter.format(forecastTime);
        const temperature = Math.round(entry.main.temp - 273.15);
        const description = entry.weather[0].description;
        const item = document.createElement("article");
        item.className = "forecast-item";
        item.setAttribute("aria-label", `${timeLabel}: ${description}, ${temperature} degrees Celsius`);

        const time = document.createElement("span");
        time.className = "forecast-time";
        time.textContent = timeLabel;

        const icon = document.createElement("img");
        icon.src = `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`;
        icon.alt = "";
        icon.width = 52;
        icon.height = 52;

        const temperatureLabel = document.createElement("span");
        temperatureLabel.className = "forecast-temperature";
        temperatureLabel.textContent = `${temperature}°C`;

        item.append(time, icon, temperatureLabel);
        fragment.append(item);
    });

    forecastContainer.replaceChildren(fragment);
}
