import { fetchCityId, fetchCityData } from './api.js';

const todayContainer = document.getElementById('todayContainer')
const cityInput = document.getElementById('cityInput')
const skyWeather = document.querySelector('#skyInfo p')
const weatherIcon = document.getElementById('weatherIcon')
const city = document.getElementById('city')
const localTime = document.getElementById('localTime')
const localDate_txt = document.getElementById('localDate')
const lastUpdate_txt = document.getElementById('lastUpdate')
const currentTemp_txt = document.getElementById('currentTemp')
const minTemp_txt = document.getElementById('minTemp')
const maxTemp_txt = document.getElementById('maxTemp')


let apiDataNow = null
let apiDataForecast = null

async function catchApiData(cityName) {
    if (!cityName) {
        console.error('Nome da cidade não pode estar vazio')
        return
    }

    const dataNow = await fetchCityId(cityName)
    const dataForecast = await fetchCityData(dataNow.id)

    console.log(dataNow)
    console.log(dataForecast)
        
    apiDataNow = dataNow
    apiDataForecast = dataForecast

    apiData()
}

function formatTime(timezone) {
    const currentLocalTime = new Date()
    const currentUtcTime = new Date(currentLocalTime.getTime() + (currentLocalTime.getTimezoneOffset() * 60000))
    const currentCityTime = new Date(currentUtcTime.getTime() + (timezone * 1000))

    return currentCityTime
}

// function showCityData() {
//     let temperature = apiDataNow.main.temp - 273.15
//     let sensation = apiDataNow.main.feels_like - 273.15
//     let hour = apiDataNow.dt
//     let cityTimezone = apiDataForecast.city.timezone
//     let formattedHour = formatHour(hour, cityTimezone).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})
//     let lastUpdate = new Date(apiDataNow.dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

//     let forecast = apiDataForecast.list
    
//     let forecastString = forecast.map(object => {
//         const date = new Date(object.dt_txt)
//         const formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR')

//         const temperatureForecast = object.main.temp - 273.15

//         return `Data: ${formattedDate}, Temperatura: ${temperatureForecast.toFixed(1)}°C`
//     }).join('<br>')

//     todayContainer.innerHTML = `
//     Local: ${apiDataNow.name}, ${apiDataNow.sys.country}<br>
    
//     Horário: ${formattedHour}<br>
//     Última atualização: ${lastUpdate}<br>
//     Temperatura: ${Math.round(temperature)}°C<br>
//     Sensação Térmica: ${Math.round(sensation)}°C<br>`
// }

function apiData() {
    const skyNow = apiDataNow.weather[0].description
    const icon = apiDataNow.weather[0].icon

    const cityName = apiDataNow.name
    const country = apiDataNow.sys.country

    const lastUpdate = apiDataNow.dt
    const cityTimezone = apiDataNow.timezone
    const formattedHour = formatTime(cityTimezone).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})
    const localDate = formatTime(cityTimezone).toLocaleDateString()
    const formattedLastUpdate = new Date(lastUpdate * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    const currentTemp = Math.round(apiDataNow.main.temp - 273.15)
    const minTemp = Math.round(apiDataNow.main.temp_min - 273.15)
    const maxTemp = Math.round(apiDataNow.main.temp_max - 273.15)

    todayInfo(skyNow, icon, cityName, country, formattedHour, localDate, formattedLastUpdate, currentTemp, minTemp, maxTemp)
}

function todayInfo(skyNow, icon, cityName, country, formattedHour, localDate, formattedLastUpdate, currentTemp, minTemp, maxTemp) {
    skyWeather.textContent = skyNow.charAt(0).toUpperCase() + skyNow.slice(1)
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`

    city.textContent = `${cityName}, ${country}`
    localTime.textContent = formattedHour
    localDate_txt.textContent = localDate
    lastUpdate_txt.textContent = formattedLastUpdate

    currentTemp_txt.textContent = currentTemp
    maxTemp_txt.textContent = maxTemp + '°C'
    minTemp_txt.textContent = minTemp + '°C'
}

function searchCity(event) {
    if (event.key === 'Enter') {
        event.preventDefault()
        catchApiData(cityInput.value.trim())
        todayContainer.style.display = 'block'
        
        cityInput.value = ''
    }
}


cityInput.addEventListener('keydown', searchCity)