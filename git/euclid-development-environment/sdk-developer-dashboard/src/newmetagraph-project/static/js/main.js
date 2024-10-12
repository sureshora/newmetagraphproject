const countrySelect = document.getElementById('country');
const citySelect = document.getElementById('city');
const form = document.getElementById('dataForm');
const chartCtx = document.getElementById('myChart').getContext('2d');

let weatherChart;

// Define city options based on country
const cityOptions = {
    US: [{ value: 'New York', label: 'New York' }, { value: 'Los Angeles', label: 'Los Angeles' }],
    IN: [{ value: 'Delhi', label: 'Delhi' }, { value: 'Mumbai', label: 'Mumbai' }],
    UK: [{ value: 'London', label: 'London' }, { value: 'Manchester', label: 'Manchester' }],
    CA: [{ value: 'Toronto', label: 'Toronto' }, { value: 'Vancouver', label: 'Vancouver' }, { value: 'Montreal', label: 'Montreal' }, { value: 'Calgary', label: 'Calgary' }, { value: 'Ottawa', label: 'Ottawa' }],
    AU: [{ value: 'Sydney', label: 'Sydney' }, { value: 'Melbourne', label: 'Melbourne' }, { value: 'Brisbane', label: 'Brisbane' }, { value: 'Perth', label: 'Perth' }, { value: 'Adelaide', label: 'Adelaide' }],
    DE: [{ value: 'Berlin', label: 'Berlin' }, { value: 'Munich', label: 'Munich' }, { value: 'Frankfurt', label: 'Frankfurt' }, { value: 'Hamburg', label: 'Hamburg' }, { value: 'Cologne', label: 'Cologne' }],
    JP: [{ value: 'Tokyo', label: 'Tokyo' }, { value: 'Osaka', label: 'Osaka' }, { value: 'Kyoto', label: 'Kyoto' }, { value: 'Yokohama', label: 'Yokohama' }, { value: 'Sapporo', label: 'Sapporo' }],
    BR: [{ value: 'São Paulo', label: 'São Paulo' }, { value: 'Rio de Janeiro', label: 'Rio de Janeiro' }, { value: 'Brasília', label: 'Brasília' }, { value: 'Salvador', label: 'Salvador' }, { value: 'Fortaleza', label: 'Fortaleza' }]
};


// Populate city dropdown based on selected country
countrySelect.addEventListener('change', () => {
    const selectedCountry = countrySelect.value;
    const cities = cityOptions[selectedCountry] || [];

    citySelect.innerHTML = '<option value="">Select a city</option>';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.value;
        option.textContent = city.label;
        citySelect.appendChild(option);
    });
});

async function fetchData() {
    const city = document.getElementById("city").value;
    const country = document.getElementById("country").value;

    if (!city || !country) {
        alert("Please select both country and city");
        return;
    }

    const response = await fetch('/fetch-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city, country })
    });

    if (response.ok) {
        const data = await response.json();
        
        // Populate tables
        document.getElementById("cityTable").innerText = data.city;
        document.getElementById("tempTable").innerText = data.temperature;
        document.getElementById("humidityTable").innerText = data.humidity;
        document.getElementById("pm25Table").innerText = data.pm25;
        document.getElementById("co2Table").innerText = data.co2;

        // Render chart
        renderChart({
            labels: ['Temperature', 'Humidity', 'PM2.5', 'CO2'],
            data: [data.temperature, data.humidity, data.pm25, data.co2]
        });
    } else {
        alert("Error fetching data. Please try again.");
    }
}

function renderChart(chartData) {
    if (weatherChart) {
        weatherChart.destroy();
    }

    weatherChart = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Weather and Air Quality Data',
                data: chartData.data,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
