from flask import Flask, render_template, jsonify, request
import requests
import os
from dotenv import load_dotenv  # Import dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Load API keys from environment variables
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')
AIR_QUALITY_API_KEY = os.getenv('AIR_QUALITY_API_KEY')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fetch-data', methods=['POST'])
def fetch_data():
    data = request.get_json()
    city = data['city']
    country = data['country']

    # Fetch weather data
    weather_url = f"http://api.openweathermap.org/data/2.5/weather?q={city},{country}&units=metric&appid={WEATHER_API_KEY}"
    weather_response = requests.get(weather_url)
    weather_data = weather_response.json()

    # Check if the location data is available
    if 'coord' not in weather_data:
        return jsonify({"error": "Weather data not found for this location."}), 404

    lat = weather_data['coord']['lat']
    lon = weather_data['coord']['lon']
    temperature = weather_data['main']['temp']
    humidity = weather_data['main']['humidity']

    # Fetch air quality data
    air_quality_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={AIR_QUALITY_API_KEY}"
    air_quality_response = requests.get(air_quality_url)
    air_quality_data = air_quality_response.json()

    pm25 = air_quality_data['list'][0]['components']['pm2_5']
    co2 = air_quality_data['list'][0]['components']['co']

    # Return the collected data as JSON
    return jsonify({
        "city": city,
        "country": country,
        "temperature": temperature,
        "humidity": humidity,
        "pm25": pm25,
        "co2": co2
    })

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3005, debug=True)  # Set the port here

    
