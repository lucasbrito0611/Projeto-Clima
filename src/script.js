import { fetchCityId, fetchCityData } from './api.js';

const infoContainer = document.getElementById('infoContainer')
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
const sensation_txt = document.getElementById('sensation')
const humidity_txt = document.getElementById('humidity')


let apiDataNow = null
let apiDataForecast = null

async function catchApiData(cityName) {
    if (!cityName) {
        alert('Nome da cidade não pode estar vazio')
        return
    }
    
    try {
        const dataNow = await fetchCityId(cityName)
        const dataForecast = await fetchCityData(dataNow.id)

        console.log(dataNow)
        console.log(dataForecast)
            
        apiDataNow = dataNow
        apiDataForecast = dataForecast

        apiData()

        infoContainer.style.display = 'block'
    } catch (error) {
        alert('Não foi possível obter os dados da cidade. Tente novamente.')
    }
}

function formatTime(timezone) {
    const currentLocalTime = new Date()
    const currentUtcTime = new Date(currentLocalTime.getTime() + (currentLocalTime.getTimezoneOffset() * 60000))
    const currentCityTime = new Date(currentUtcTime.getTime() + (timezone * 1000))

    return currentCityTime
}

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

    const sensation = Math.round(apiDataNow.main.feels_like - 273.15)
    const humidity = apiDataNow.main.humidity

    const currentTemp = Math.round(apiDataNow.main.temp - 273.15)
    let minTemp = Math.round(apiDataNow.main.temp_min - 273.15)
    let maxTemp = Math.round(apiDataNow.main.temp_max - 273.15)

    let forecastList = apiDataForecast.list
    const forecastToday = []

    forecastList.forEach((forecast) => {
        const forecastDate = new Date(forecast.dt_txt)
        const formattedDate = forecastDate.toLocaleDateString('pt-BR')

        if (formattedDate === localDate) {
            forecastToday.push(Math.round(forecast.main.temp - 273.15))
            
        }
    })

    if (forecastToday.length > 0) {
        minTemp = Math.min(...forecastToday)
        maxTemp = Math.max(...forecastToday)
    }

    todayInfo(skyNow, icon, cityName, country, formattedHour, localDate, formattedLastUpdate, currentTemp, minTemp, maxTemp, sensation, humidity)
}

function todayInfo(skyNow, icon, cityName, country, formattedHour, localDate, formattedLastUpdate, currentTemp, minTemp, maxTemp, sensation, humidity) {
    skyWeather.textContent = skyNow.charAt(0).toUpperCase() + skyNow.slice(1)
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`

    city.textContent = `${cityName}, ${country}`
    localTime.textContent = formattedHour
    localDate_txt.textContent = localDate
    lastUpdate_txt.textContent = formattedLastUpdate

    currentTemp_txt.textContent = currentTemp
    maxTemp_txt.textContent = maxTemp + '°C'
    minTemp_txt.textContent = minTemp + '°C'

    sensation_txt.textContent = sensation + '°C'
    humidity_txt.textContent = humidity + '%'
}

function searchCity(event) {
    if (event.key === 'Enter') {
        event.preventDefault()
        catchApiData(cityInput.value.trim())

        cityInput.value = ''
    }
}


cityInput.addEventListener('keydown', searchCity)