const api_key = "b3eae25a346ef89c09037e663aa7bf66";

let temperature = 0;
let data;
let tempUnit = "C";

async function getWeather() {

    const city = document.getElementById("cityDropdown").value;

    if (city === "") {
        alert("Please select a city.");
        return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("weatherResult").style.display = "none";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`;

    try {

        const response = await fetch(url);
        data = await response.json();

        if (data.cod != 200) {
            throw new Error(data.message);
        }

        temperature = data.main.temp;

        displayWeather();

    } catch (error) {

        alert("City not found!");

    } finally {

        document.getElementById("loading").style.display = "none";

    }
}

function toggleUnit() {

    if (!data) {
        alert("Please get weather first.");
        return;
    }

    if (tempUnit === "C") {

        temperature = ((temperature * 9 / 5) + 32).toFixed(1);
        tempUnit = "F";

    } else {

        temperature = ((temperature - 32) * 5 / 9).toFixed(1);
        tempUnit = "C";

    }

    displayWeather();

}

function displayWeather() {

    document.getElementById("weatherResult").style.display = "block";

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();

    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    document.getElementById("weatherResult").innerHTML = `

        <h2>${data.name}</h2>

        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">

        <h2>${temperature} °${tempUnit}</h2>

        <p><strong>${data.weather[0].main}</strong></p>

        <p>${data.weather[0].description}</p>

        <p>🌡 Feels Like : ${data.main.feels_like} °C</p>

        <p>💧 Humidity : ${data.main.humidity}%</p>

        <p>💨 Wind Speed : ${data.wind.speed} m/s</p>

        <p>🌅 Sunrise : ${sunrise}</p>

        <p>🌇 Sunset : ${sunset}</p>

    `;

    const weather = data.weather[0].main;

    if (weather === "Clear") {
        document.body.style.background = "linear-gradient(135deg,#56CCF2,#2F80ED)";
    }
    else if (weather === "Clouds") {
        document.body.style.background = "linear-gradient(135deg,#757F9A,#D7DDE8)";
    }
    else if (weather === "Rain") {
        document.body.style.background = "linear-gradient(135deg,#4B79A1,#283E51)";
    }
    else if (weather === "Snow") {
        document.body.style.background = "linear-gradient(135deg,#E6DADA,#274046)";
    }
    else if (weather === "Thunderstorm") {
        document.body.style.background = "linear-gradient(135deg,#232526,#414345)";
    }
    else {
        document.body.style.background = "linear-gradient(135deg,#4facfe,#00f2fe)";
    }

}

async function getCurrentLocation(){

    if(!navigator.geolocation){

        alert("Geolocation is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(async(position)=>{

        const lat=position.coords.latitude;
        const lon=position.coords.longitude;

        document.getElementById("loading").style.display="block";
        document.getElementById("weatherResult").style.display="none";

        const url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;

        try{

            const response=await fetch(url);

            data=await response.json();

            temperature=data.main.temp;

            tempUnit="C";

            displayWeather();

            getForecast(data.name);

        }

        catch(error){

            alert("Unable to fetch weather.");

        }

        finally{

            document.getElementById("loading").style.display="none";

        }

    });

}

async function getForecast(city){

    const url=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`;

    const response=await fetch(url);

    const forecastData=await response.json();

    let forecastHTML="";

    for(let i=0;i<forecastData.list.length;i+=8){

        const day=forecastData.list[i];

        const date=new Date(day.dt_txt).toLocaleDateString();

        forecastHTML+=`

        <div class="forecast-card">

            <h4>${date}</h4>

            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

            <p>${day.main.temp} °C</p>

            <p>${day.weather[0].main}</p>

        </div>

        `;

    }

    document.getElementById("forecast").innerHTML=forecastHTML;

}

function toggleTheme(){

    document.body.classList.toggle("dark-mode");

    const btn = document.getElementById("themeBtn");

    if(document.body.classList.contains("dark-mode")){

        btn.innerHTML="☀️ Light Mode";

    }

    else{

        btn.innerHTML="🌙 Dark Mode";

    }

}