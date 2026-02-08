// API Configuration
const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Free API key
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const loading = document.getElementById('loading');
const weatherDisplay = document.getElementById('weatherDisplay');

// Current weather elements
const cityName = document.getElementById('cityName');
const date = document.getElementById('date');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');

// Forecast container
const forecastContainer = document.getElementById('forecastContainer');

// Event listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Search weather function
async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (city === '') {
        showError('Please enter a city name');
        return;
    }
    
    hideError();
    showLoading();
    hideWeather();
    
    try {
        // Fetch current weather
        const currentWeatherData = await fetchCurrentWeather(city);
        
        // Fetch 5-day forecast
        const forecastData = await fetchForecast(city);
        
        // Display data
        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);
        
        hideLoading();
        showWeather();
        
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// Fetch current weather from API
async function fetchCurrentWeather(city) {
    const url = `${API_BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found. Please check the spelling.');
        } else {
            throw new Error('Failed to fetch weather data. Please try again.');
        }
    }
    
    return await response.json();
}

// Fetch 5-day forecast from API
async function fetchForecast(city) {
    const url = `${API_BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
    }
    
    return await response.json();
}

// Display current weather
function displayCurrentWeather(data) {
    // City name and country
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    // Current date
    const currentDate = new Date();
    date.textContent = formatDate(currentDate);
    
    // Temperature
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    
    // Weather description
    weatherDescription.textContent = data.weather[0].description;
    
    // Weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // Weather details
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;
}

// Display 5-day forecast
function displayForecast(data) {
    // Clear previous forecast
    forecastContainer.innerHTML = '';
    
    // Get one forecast per day (at 12:00 PM)
    const dailyForecasts = data.list.filter(item => {
        return item.dt_txt.includes('12:00:00');
    });
    
    // Take only 5 days
    dailyForecasts.slice(0, 5).forEach(day => {
        const forecastItem = createForecastCard(day);
        forecastContainer.appendChild(forecastItem);
    });
}

// Create forecast card
function createForecastCard(day) {
    const date = new Date(day.dt * 1000);
    const dayName = getDayName(date);
    const iconCode = day.weather[0].icon;
    const temperature = Math.round(day.main.temp);
    const description = day.weather[0].description;
    
    const card = document.createElement('div');
    card.className = 'forecast-item';
    card.innerHTML = `
        <div class="forecast-date">${dayName}</div>
        <img class="forecast-icon" 
             src="https://openweathermap.org/img/wn/${iconCode}@2x.png" 
             alt="${description}">
        <div class="forecast-temp">${temperature}°C</div>
        <div class="forecast-desc">${description}</div>
    `;
    
    return card;
}

// Helper function: Format date
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Helper function: Get day name
function getDayName(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

// Show/hide functions
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
}

function showLoading() {
    loading.classList.add('show');
}

function hideLoading() {
    loading.classList.remove('show');
}

function showWeather() {
    weatherDisplay.classList.add('show');
}

function hideWeather() {
    weatherDisplay.classList.remove('show');
}

// Load default city on page load (optional)
window.addEventListener('load', () => {
    // You can set a default city here
    // cityInput.value = 'Chennai';
    // searchWeather();
});