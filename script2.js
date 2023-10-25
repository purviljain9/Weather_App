const yourtab = document.querySelector("[your-tab]");
const searchtab = document.querySelector("[search-tab]");
const mainSection = document.querySelector(".main-section");

const locationPermission = document.querySelector(".location-permission-section");
const searchWeather = document.querySelector(".search-weather-section");
const loadingPage = document.querySelector(".loading-container");
const yourWeatherPage = document.querySelector(".your-weather-section");
const accessButton = document.querySelector(".access-button");
const namecity = document.querySelector(".input-city");
const searchButton = document.querySelector(".search-button");
const errorPage = document.querySelector(".error-page");


const apikey = "d96e6e899d796d688c987bef31441b74";
let currentTab = yourtab;
currentTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchWeather.classList.contains("active")){
            yourWeatherPage.classList.remove("active");
            locationPermission.classList.remove("active");
            searchWeather.classList.add("active");
        }
        else{
            searchWeather.classList.remove("active");
            yourWeatherPage.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

function getfromSessionStorage(){
    const localcoordinates = sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        locationPermission.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localcoordinates);
        fetchUserLoaction(coordinates);
    }
}


yourtab.addEventListener("click", () => {
    switchTab(yourtab);
});

searchtab.addEventListener("click", () => {
    switchTab(searchtab);
});

async function fetchUserLoaction(coordinates){
    const {lat, lon} = coordinates;

    locationPermission.classList.remove("active");
    loadingPage.classList.add("active");

    try{
        const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`);
        const realData = await data.json();

        loadingPage.classList.remove("active");
        yourWeatherPage.classList.add("active");

        renderWeatherInfo(realData);
    }
    catch(err){
        loadingPage.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){

    errorPage.classList.remove("active");
    // yourWeatherPage.classList.add("active");

    const city = document.querySelector(".city-name");
    const cityimage = document.querySelector(".city-country");
    const weatherCondition = document.querySelector(".weather-condition");
    const weatherConditionImg = document.querySelector(".weather-condition-img");
    const TemperatureDisplay = document.querySelector(".Temperature-Display");
    const info1number = document.querySelector(".info-1-number");
    const info2number = document.querySelector(".info-2-number");
    const info3number = document.querySelector(".info-3-number");

    let n = weatherInfo?.name;
    if(n == undefined){
        errorPage.classList.add("active");
        yourWeatherPage.classList.remove("active");
    }
    else{
        city.innerText = weatherInfo?.name;
        cityimage.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        weatherCondition.innerText = weatherInfo?.weather?.[0]?.description;
        weatherConditionImg.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

        let temp = `${weatherInfo?.main?.temp}` - 273.15;
        let t = temp.toFixed(2);
        TemperatureDisplay.innerText = (t + ' °C');
        // TemperatureDisplay.innerText = `${weatherInfo?.main?.temp} °C`;
        
        info1number.innerText = `${weatherInfo?.wind?.speed} m/s`;
        info2number.innerText = `${weatherInfo?.main?.humidity} %`;
        info3number.innerText = `${weatherInfo?.clouds?.all} %`;
    }
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Enable Geolocation services");
    }
}


function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserLoaction(userCoordinates);
}

accessButton.addEventListener("click", getLocation);

async function fetchweatherinfo(cName){
    loadingPage.classList.add("active");
    yourWeatherPage.classList.remove("active");
    locationPermission.classList.remove("active");

    try{
        const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cName}&appid=${apikey}`);
        const realData = await data.json();

        loadingPage.classList.remove("active");
        yourWeatherPage.classList.add("active");

        renderWeatherInfo(realData);

    }
    catch(err){

    }
}       

searchWeather.addEventListener("submit", (e) => {
    e.preventDefault();

    let nameofcity = namecity.value;
    if(nameofcity === "")
        return;
    else    
        fetchweatherinfo(nameofcity);

})

