import { fetchCityId, fetchCityData } from './api.js';

const todayContainer = document.getElementById('todayContainer')
const cityInput = document.getElementById('cityInput')
const skyWeather = document.querySelector('#skyInfo p')
const weatherIcon = document.getElementById('weatherIcon')
const city = document.getElementById('city')
const localTime = document.getElementById('localTime')
const localDatetxt = document.getElementById('localDate')
const lastUpdatetxt = document.getElementById('lastUpdate')


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

function formatHour(hour, timezone) {
    const milliSeconds = ((hour + timezone) * 1000) + 10800000
    return new Date(milliSeconds)
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
    const formattedHour = formatHour(lastUpdate, cityTimezone).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})
    const localDate = formatHour(lastUpdate, cityTimezone).toLocaleDateString()
    const formattedLastUpdate = new Date(lastUpdate * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    todayInfo(skyNow, icon, cityName, country, formattedHour, localDate, formattedLastUpdate)
}

function todayInfo(skyNow, icon, cityName, country, formattedHour, localDate, formattedLastUpdate) {
    skyWeather.textContent = skyNow.charAt(0).toUpperCase() + skyNow.slice(1)
    weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`

    city.textContent = `${cityName}, ${country}`
    localTime.textContent = formattedHour
    localDatetxt.textContent = localDate
    lastUpdatetxt.textContent = formattedLastUpdate

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