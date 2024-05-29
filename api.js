const apiKey = process.env.API_KEY

export async function fetchCityId(cityName) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&lang=pt`)
        
        if (!response.ok) {
            throw new Error(`Erro: ${response.status}. Please see https://openweathermap.org/faq#error${response.status} for more info.`)
        }
        
        const data = await response.json()
        return data
        
    } catch (error) {
        console.error('Erro:', error)
        throw error
    }
}

export async function fetchCityData(cityId) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}&lang=pt`)
        
        if (!response.ok) {
            throw new Error(`Erro: ${response.status}. Please see https://openweathermap.org/faq#error${response.status} for more info.`)
        }
        
        const data = await response.json()
        return data
        
    } catch (error) {
        console.error('Erro:', error)
        throw error
    }
}