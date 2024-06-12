import { fetchCityId, fetchCityData } from './api.js';

const infoContainer = document.getElementById('infoContainer')
const cityInput = document.getElementById('cityInput')
const skyWeather = document.querySelector('#skyInfo p')
const weatherIcon = document.getElementById('weatherIcon')
const city = document.getElementById('city')
const localTime_txt = document.getElementById('localTime')
const localDate_txt = document.getElementById('localDate')
const lastUpdate_txt = document.getElementById('lastUpdate')
const currentTemp_txt = document.getElementById('currentTemp')
const minTemp_txt = document.getElementById('minTemp')
const maxTemp_txt = document.getElementById('maxTemp')
const precipitation_txt = document.getElementById('precipitation')
const sensation_txt = document.getElementById('sensation')
const humidity_txt = document.getElementById('humidity')
const wind_txt = document.getElementById('wind')
const pressure_txt = document.getElementById('pressure')
const visibility_txt = document.getElementById('visibility')
const clouds_txt = document.getElementById('clouds')
const sunrise_txt = document.getElementById('sunrise')
const sunset_txt = document.getElementById('sunset')
const gmt_txt = document.getElementById('gmt')
const tomorrowDate_txt = document.getElementById('tomorrowDate')
const forecastTemp_txt = document.getElementById('forecastTemp')
const forecastMax_txt = document.getElementById('forecastMax')
const forecastMin_txt = document.getElementById('forecastMin')
const forecastPrecipitation_txt = document.getElementById('forecastPrecipitation')
const forecastHumidity_txt = document.getElementById('forecastHumidity')
const forecastWind_txt = document.getElementById('forecastWind')
const forecastSensation_txt = document.getElementById('forecastSensation')
const forecastVisibility_txt = document.getElementById('forecastVisibility')
const main_txt = document.getElementById('main')

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

        infoContainer.style.display = 'flex'
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

function translate(text) {
    const translations = {
        'Clear': 'Limpo',
        'Rain': 'Chuva',
        'Clouds': 'Nuvens',
    }

    return translations[text] || text
}

function calcAverage(list) {
    return list.reduce((sum, currentValue) => sum + currentValue, 0) / list.length
}

function apiData() {
    const skyNow = apiDataNow.weather[0].description
    const icon = apiDataNow.weather[0].icon

    const cityName = apiDataNow.name
    const country = apiDataNow.sys.country

    const lastUpdate = apiDataNow.dt
    const cityTimezone = apiDataNow.timezone
    const localDate = formatTime(cityTimezone)
    const localTime = formatTime(cityTimezone)
    const gmt = cityTimezone / 3600
    const formattedLastUpdate = new Date(lastUpdate * 1000)

    const sensation = apiDataNow.main.feels_like
    const humidity = apiDataNow.main.humidity
    const windSpeed = apiDataNow.wind.speed
    const pressure = apiDataNow.main.pressure
    const visibility = apiDataNow.visibility
    const clouds = apiDataNow.clouds.all

    const sunriseUnix = new Date(apiDataNow.sys.sunrise * 1000)
    const sunrise = new Date(sunriseUnix.getTime() + (cityTimezone * 1000))

    const sunsetUnix = new Date(apiDataNow.sys.sunset * 1000)
    const sunset = new Date(sunsetUnix.getTime() + (cityTimezone * 1000))

    const currentTemp = apiDataNow.main.temp
    let minTemp = apiDataNow.main.temp_min
    let maxTemp = apiDataNow.main.temp_max

    let forecastList = apiDataForecast.list
    let avgTodayPrecipitation = 0

    const forecastToday = []
    const forecastTomorrow = []

    const tomorrowDate = new Date(localDate)
    tomorrowDate.setDate(localDate.getDate() + 1)

    forecastList.forEach((forecast) => {
        const forecastDate = new Date(forecast.dt_txt)
        const formattedDate = forecastDate.toLocaleDateString('pt-BR')
        const formattedLocalDate = localDate.toLocaleDateString('pt-BR')
        const formattedTomorrowDate = tomorrowDate.toLocaleDateString('pt-BR')

        if (formattedDate === formattedLocalDate) {
            forecastToday.push(forecast)
        } else if (formattedDate === formattedTomorrowDate) {
            forecastTomorrow.push(forecast)
        }
    })

    if (forecastToday.length > 0) {
        const temperatures = forecastToday.map(forecast => forecast.main.temp)
        minTemp = Math.min(...temperatures)
        maxTemp = Math.max(...temperatures)

        const precipitations = forecastToday.map(forecast => forecast.pop)
        avgTodayPrecipitation = calcAverage(precipitations)
    }

    const temperatures = forecastTomorrow.map(forecast => forecast.main.temp)
    const forecastMaxTemp = Math.max(...temperatures)
    const forecastMinTemp = Math.min(...temperatures)
    const avgTemperature = calcAverage(temperatures)

    const forecastPrecipitations = forecastTomorrow.map(forecast => forecast.pop)
    const avgTomorrowPrecipitation = calcAverage(forecastPrecipitations)

    const tomorrowMainList = forecastTomorrow.map(forecast => forecast.weather[0].main)

    let frequency = {}
    tomorrowMainList.forEach(main => {
        if (frequency[main]) {
            frequency[main]++
        } else {
            frequency[main] = 1
        }
    })

    const oftenMain = Object.entries(frequency).reduce((max, value) => {
        return value[1] > max[1] ? value : max
    })
    
    const tomorrowMain = translate(oftenMain[0])
    
    const humidityList = forecastTomorrow.map(forecast => forecast.main.humidity)
    const avgHumidity = calcAverage(humidityList)

    const windList = forecastTomorrow.map(forecast => forecast.wind.speed)
    const avgWind = calcAverage(windList)

    const sensationList = forecastTomorrow.map(forecast => forecast.main.feels_like)
    const avgSensation = calcAverage(sensationList)

    const visibilityList = forecastTomorrow.map(forecast => forecast.visibility)
    const avgVisibility = calcAverage(visibilityList)

    todayInfo(skyNow, icon, cityName, country, localDate, localTime, gmt, formattedLastUpdate, currentTemp, minTemp, maxTemp, avgTodayPrecipitation, sensation, humidity, windSpeed, pressure, visibility, clouds, sunrise, sunset)
    forecastInfo(tomorrowDate, tomorrowMain, avgTemperature, forecastMaxTemp, forecastMinTemp, avgTomorrowPrecipitation, avgHumidity, avgWind, avgSensation, avgVisibility)
}

function todayInfo(skyNow, icon, cityName, country, localDate, localTime, gmt, formattedLastUpdate, currentTemp, minTemp, maxTemp, avgPrecipitation, sensation, humidity, windSpeed, pressure, visibility, clouds, sunrise, sunset) {
    skyWeather.textContent = skyNow.charAt(0).toUpperCase() + skyNow.slice(1)
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`

    city.textContent = `${cityName}, ${country}`
    localDate_txt.textContent = localDate.toLocaleDateString()
    localTime_txt.textContent = localTime.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})
    gmt_txt.textContent = `(GMT ${gmt <= 0 ? gmt : `+${gmt}`})`
    lastUpdate_txt.textContent = formattedLastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    currentTemp_txt.textContent = Math.round(currentTemp - 273.15)
    maxTemp_txt.textContent = Math.round(maxTemp - 273.15) + '°C'
    minTemp_txt.textContent = Math.round(minTemp - 273.15) + '°C'

    precipitation_txt.textContent = Math.round(avgPrecipitation * 100)
    sensation_txt.textContent = Math.round(sensation - 273.15)
    humidity_txt.textContent = humidity 
    wind_txt.textContent = Math.round(windSpeed * 3.6)
    pressure_txt.textContent = pressure
    visibility_txt.textContent = visibility % 1000 !== 0 ? (visibility / 1000).toFixed(1).replace(/\./g, ',') : (visibility / 1000)
    clouds_txt.textContent = clouds

    sunrise_txt.textContent = sunrise.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC'})
    sunset_txt.textContent = sunset.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC'})
}

function forecastInfo(tomorrowDate, tomorrowMain, avgTemperature, forecastMaxTemp, forecastMinTemp, avgTomorrowPrecipitation, avgHumidity, avgWind, avgSensation, avgVisibility) {
    tomorrowDate_txt.textContent = tomorrowDate.toLocaleDateString('pt-BR')
    main_txt.textContent = tomorrowMain

    forecastTemp_txt.textContent = Math.round(avgTemperature - 273.15)
    forecastMax_txt.textContent = Math.round(forecastMaxTemp - 273.15)
    forecastMin_txt.textContent = Math.round(forecastMinTemp - 273.15)
    forecastPrecipitation_txt.textContent = Math.round(avgTomorrowPrecipitation * 100)
    forecastHumidity_txt.textContent = Math.round(avgHumidity)
    forecastWind_txt.textContent = Math.round(avgWind * 3.6)
    forecastSensation_txt.textContent = Math.round(avgSensation - 273.15)
    forecastVisibility_txt.textContent = (((avgVisibility / 1000)).toFixed(1) * 1000) % 1000 === 0 ? (((avgVisibility / 1000)).toFixed(1) * 1000) / 1000 : (avgVisibility / 1000).toFixed(1).replace(/\./g, ',')
}

function searchCity(event) {
    if (event.key === 'Enter') {
        event.preventDefault()
        catchApiData(cityInput.value.trim())

        cityInput.value = ''
    }
}

cityInput.addEventListener('keydown', searchCity)