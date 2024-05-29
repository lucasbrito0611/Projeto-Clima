import { fetchCityId, fetchCityData } from './api.js';

const divTeste = document.getElementById('teste')
const cityInput = document.getElementById('cityInput')

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

    showCityData()
}

function formatHour(hour, timezone) {
    const milliSeconds = ((hour + timezone) * 1000) + 10800000
    return new Date(milliSeconds)
}

function showCityData() {
    let temperature = apiDataNow.main.temp - 273.15
    let sensation = apiDataNow.main.feels_like - 273.15
    let hour = apiDataNow.dt
    let cityTimezone = apiDataForecast.city.timezone
    let formattedHour = formatHour(hour, cityTimezone).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})
    let lastUpdate = new Date(apiDataNow.dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    let forecast = apiDataForecast.list
    
    let forecastString = forecast.map(object => {
        const date = new Date(object.dt_txt)
        const formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR')

        const temperatureForecast = object.main.temp - 273.15

        return `Data: ${formattedDate}, Temperatura: ${temperatureForecast.toFixed(1)}°C`
    }).join('<br>')

    divTeste.innerHTML = `
    Cidade: ${apiDataForecast.city.name}<br>
    País: ${apiDataForecast.city.country}<br>
    Horário: ${formattedHour}<br>
    Última atualização: ${lastUpdate}<br>
    Temperatura: ${temperature.toFixed(1)}°C<br>
    Sensação Térmica: ${sensation.toFixed(1)}°C<br>
    Previsão: <br>
    ${forecastString}
    
    `
}

function searchCity(event) {
    if (event.key === 'Enter') {
        event.preventDefault()
        catchApiData(cityInput.value.trim())
    }
}

cityInput.addEventListener('keydown', searchCity)