function getWeather(){
    const API_key = "7acf08d4381c2c30ef28857eaed4b96a";

    const cityInput = document.getElementById("city_name");
    const city = cityInput.value.trim();

    if (!city){
        alert("Enter a city name.");
        return;
    }
    const currentWeatherURl= `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_key}`;

    const forcastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_key}`;

    fetch(currentWeatherURl)
    .then(response => response.json())
    .then(data => displayWeather(data))
    .catch(err => {
         console.log(err);
         alert("Error fetching weather data. Please try again later.");
    })
    fetch(forcastURL)
    .then(response => response.json())
    .then(data => displayHourlyForcast(data.list))
    .catch(err => {
         console.log(err);
         alert("Error fetching weather data. Please try again later.");
    })  

}

function displayWeather(data){
    const weatherIcon = document.getElementById("weather_icon");
    const tempDiv = document.getElementById("temp_div");
    const infoDiv = document.getElementById("weather_info");
    const hourlyForcast = document.getElementById("hourly_forcast");
    
    tempDiv.innerHTML= "";
    infoDiv.innerHTML= "";
    hourlyForcast.innerHTML= "";
     
    console.log('Weather data', data);
    if (data.cod== 404){
        info.innerHTML= `<p>${data.message}<p/>`;
    }else{
        const cityName= data.name;
        // convert temparature in celseous
        const temperature = Math.round(data.main.temp -273.5);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        
        const temperatureHtml = `<p>${temperature} <p/>`;

        const weatherhtml = `<p>${cityName}</p>
                              <p>${description}</p>` ;
        tempDiv.innerHTML = temperatureHtml;
        infoDiv.innerHTML = weatherhtml;
        // manupulate attribute of image tag  "img"
        weatherIcon.src = iconUrl;
        weatherIcon.alt= description;   


}
}

function displayHourlyForcast(hourlyData) {
    const hourlyForcastDiv = document.getElementById("hourly_forcast");
    console.log("this is res for forcast" ,hourlyData);

    const next24Hours = hourlyData.slice(1, 9); // Get the next 24 hours (3-hour intervals)
    next24Hours.forEach(element => {
        const dateTimeObj = new Date (element.dt * 1000)
        const hour = dateTimeObj.getHours() 
        const cityName= element.name;
        // convert temparature in celseous
        const temperature = Math.round(element.main.temp -273.5);
        //const description = data.weather[0].description;
        const iconCode = element.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;        
        
        const forcastInnerHtml= `    <div id="hourly-info">

        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly weather icon">
        <span>${temperature}°C &nbsp;</span>
    </div>
    `

    hourlyForcastDiv.innerHTML +=  (forcastInnerHtml)
    });
}



// https://api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}