# Weather App: Beginner's Guide

This small browser app looks up a city's current weather and shows a short
hourly forecast. It is also a hands-on example of basic JavaScript, the DOM,
and making requests to a web API.

## Live app

Try the deployed app: [nsweatherapp.vercel.app](https://nsweatherapp.vercel.app/)

## Run the app

1. Make sure the project files (`index.html`, `style.css`, and `script.js`) are
   in the same folder.
2. Open `index.html` in a browser. No package installation or build step is
   needed.
3. Enter a city name and select **Search**. The browser needs an internet
   connection, and the weather service must accept the API key configured in
   `script.js`.

The app uses OpenWeather's API. If its configured key does not work, get your
own key from OpenWeather and replace the value assigned to `API_key` in
`script.js`. Keep in mind that a key placed in browser JavaScript is visible to
anyone who visits the app. That approach is suitable only for a learning
example; a real deployed app should keep its key on a server and have the
browser call that server instead.

## How the app works

### 1. HTML provides the page

In `index.html`, the labeled input with the ID `city_name` lets the user enter
a city. Submitting the form calls `getWeather()`. The elements with IDs
`weather_icon`, `temp_div`, `weather_info`, and `hourly_forcast` show the
results.

The HTML loads `style.css` for appearance and `script.js` for behavior.

### 2. JavaScript reads the city

`getWeather()` finds the input using `document.getElementById()`, reads its
`value`, and calls `trim()` to remove extra spaces. The required input also
uses the browser's built-in validation to prevent an empty search.

### 3. The app builds API request URLs

The function creates two URLs:

- **Current weather:** `https://api.openweathermap.org/data/2.5/weather`
- **Forecast:** `https://api.openweathermap.org/data/2.5/forecast`

Both requests include the city (`q`) and API key (`appid`). `encodeURIComponent()`
makes the city safe to include in a URL, including city names that contain
spaces or special characters.

### 4. `fetch()` requests and reads data

`fetch(url)` sends a request from the browser. The app uses `async`/`await` to
wait for each response and calls `response.json()` to turn the JSON response
into a JavaScript object. It checks for unsuccessful HTTP responses and shows
the user a helpful error message.

The current-weather response goes to `displayWeather(data)`. The forecast
response's `list` goes to `displayHourlyForcast(hourlyData)`. A `try`/`catch`
handles network or other request errors.

An API response is data, not a web page. For example, the current-weather
response includes a city name, temperature, and weather description; the
forecast response contains a `list` of forecast entries.

### 5. JavaScript updates the page

The display functions use `document.getElementById()` to find page elements and
update them. They read values from the API response and set text or image
attributes on the page. Forecast cards are created as DOM elements.

The forecast API returns entries at three-hour intervals. The app uses
`slice(1, 9)` to show up to eight entries after the first one, and builds a
forecast card for each entry. Temperatures are converted from Kelvin to Celsius
by subtracting `273.15` and rounding.

## HCI and accessibility choices

- **Clear hierarchy:** A descriptive heading, labeled search field, current
  conditions, and forecast heading help people scan the page.
- **Visible system status:** The page announces when a search is in progress,
  confirms a successful update, and explains common errors. The search button
  is disabled while data is loading to prevent duplicate requests.
- **Accessible interaction:** The search has a visible label, works as a
  keyboard-submittable form, and provides visible keyboard-focus styles.
  Updates are announced through a live status region.
- **Readable and responsive presentation:** Text, spacing, and controls are
  sized for readability; the layout adjusts on narrow screens and the forecast
  can scroll horizontally.
- **Motion preferences:** The loading animation is reduced for people who
  request reduced motion in their device settings.

These are good baseline practices, not a substitute for testing with users.
For a research or production claim, evaluate the app with representative users
and assistive technologies.

## JavaScript and API terms

- **API (Application Programming Interface):** A way for one program to request
  information or services from another. Here, the browser asks OpenWeather for
  weather data.
- **Endpoint:** A URL for a particular API operation, such as current weather
  or forecast.
- **Query parameter:** A value added to a URL after `?`, such as `q` for the
  city. Parameters are separated by `&`.
- **JSON:** A common text format for structured data that JavaScript can read.
- **Function:** A reusable block of JavaScript. In this app,
  `getWeather()` starts the lookup and the display functions render results.
- **DOM:** The browser's in-memory representation of the HTML. JavaScript uses
  the DOM to find and update elements.
- **Promise:** A JavaScript object representing work that finishes later.
  `fetch()` returns a promise; `await` pauses the async function until it
  completes, and `try`/`catch` handles failures.

## Try these learning exercises

1. Change the page title in `index.html`.
2. Find where the temperature is converted from Kelvin to Celsius in
   `script.js`. The API returns Kelvin by default; the app subtracts about
   `273.5` and rounds the result.
3. Change the CSS in `style.css` to adjust the card's colors or spacing.
4. Inspect the API response in the browser developer tools' Network tab. Avoid
   logging or sharing your API key.

## Troubleshooting

- **No results:** Check the spelling of the city and the browser's internet
  connection.
- **Request or API error:** Check the browser developer tools' Console and
  Network tabs. Confirm that the API key is valid and enabled for the API.
- **Layout looks unstyled:** Confirm `style.css` is next to `index.html` and
  that the stylesheet link in the HTML points to it.
