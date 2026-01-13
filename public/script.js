// This function is called by the Google Maps script
function initMap() {
  // 1. Initialize the map
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 18.5204, lng: 73.8567 },
  });
  
  // 2. Call fetchDataAndPlot with just the map
  fetchDataAndPlot(map);
}

/**
 * Helper function to format numbers.
 */
const formatValue = (value, decimalPlaces = 0) => {
  if (value === null || typeof value === "undefined") return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  return num.toFixed(decimalPlaces);
};

/**
 * Gets a color and status object based on the AQI value
 */
function getAQIInfo(aqi) {
  if (aqi <= 100) return { color: '#00a86b', status: 'Good' }; // Green
  if (aqi <= 200) return { color: '#f9a602', status: 'Moderate' }; // Orange
  if (aqi <= 300) return { color: '#f95738', status: 'Unhealthy' }; // Red
  return { color: '#960018', status: 'Very Unhealthy' }; // Maroon
}

/**
 * Fetches data from the API and plots it on the map.
 */
async function fetchDataAndPlot(map) { 
  
  // Find the panel HERE, after the page has loaded.
  const panel = document.getElementById("details-panel");
  if (!panel) {
    console.error("CRITICAL ERROR: Could not find #details-panel element!");
    return; // Stop if the panel doesn't exist
  }

  try {
    // 1. Fetch live data
    const response = await fetch("/api/data");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // 2. Call the function to build the cards
    populateDataCards(data);
    
    // 3. Create one InfoWindow instance to be reused
    const infowindow = new google.maps.InfoWindow();

    // 4. Loop through data to add map markers
    data.forEach((location) => {
      const lat = location.Lattitude;
      const lon = location.Longitude;
      
      // ✅ We use 'AQI' (the "good" 105 prediction) for all visuals
      const aqi = parseFloat(location.AQI); 

      if (lat && lon) {
        const marker = new google.maps.Marker({
          position: { lat: lat, lng: lon },
          map: map,
          title: location.NAME,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: getAQIInfo(aqi).color,
            fillOpacity: 0.9,
            strokeColor: '#000',
            strokeWeight: 1,
            scale: 12 
          },
          label: {
            text: location.NAME.charAt(0).toUpperCase(),
            color: 'white',
            fontWeight: 'bold'
          }
        });

        // --- ✅ Build the HTML for the sidebar (USING "Display_" fields) ---
        const sidebarContent = `
          <h3>${location.NAME}</h3>
          <hr>
          <p><strong>Predicted AQI:</strong> ${formatValue(aqi)}</p>
          <p><strong>Predicted Traffic:</strong> ${location.Predicted_Traffic_Density || "N/A"}</p>
          <hr>
          <p><strong>PM2.5:</strong> ${formatValue(location.Display_PM2_MAX, 1)} µg/m³</p>
          <p><strong>PM10:</strong> ${formatValue(location.Display_PM10_MAX, 1)} µg/m³</p>
          <p><strong>CO:</strong> ${formatValue(location.Display_CO_MAX, 1)} µg/m³</p>
          <hr>
          <p><strong>Temperature:</strong> ${formatValue(location.TEMPRATURE_MAX, 1)} °C</p>
          <p><strong>Humidity:</strong> ${formatValue(location.HUMIDITY, 0)} %</p>
        `;
        
        // --- Build simple HTML for the popup bubble ---
        const popupContent = `
          <div style="font-family: Arial, sans-serif; padding: 5px;">
            <h4 style="margin: 0 0 5px 0;">${location.NAME}</h4>
            <p style="margin: 0;"><strong>AQI: ${formatValue(aqi)}</strong></p>
            <p style="margin: 5px 0 0 0;">Traffic: ${location.Predicted_Traffic_Density || "N/A"}</p>
          </div>`;

        // --- Click listener ---
        marker.addListener("click", () => {
          // 1. Update the sidebar panel
          panel.innerHTML = sidebarContent;
          
          // 2. Open the popup bubble
          infowindow.setContent(popupContent);
          infowindow.open({
            anchor: marker,
            map,
          });
        });
      }
    });
  } catch (error) {
    console.error("Failed to load map data:", error);
    panel.innerHTML = `<h4 style="color: red;">Failed to load map data.</h4><p>${error.message}</p>`;
  }
}

/**
 * ✅ Populates a card grid (USING "Display_" fields)
 */
function populateDataCards(data) {
  const container = document.getElementById("card-grid");
  if (!container) return;
  container.innerHTML = ""; // Clear old content

  data.forEach(location => {
    // ✅ We use 'AQI' (the "good" 105 prediction) for all visuals
    const aqi = parseFloat(location.AQI);
    const aqiInfo = getAQIInfo(aqi);
    const aqiPercent = Math.min((aqi / 300) * 100, 100); 

    const card = document.createElement("div");
    card.className = "data-card";
    
    card.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">${location.NAME}</h3>
        <div class="card-traffic">${location.Predicted_Traffic_Density || "N/A"}</div>
      </div>
      
      <div class="card-body">
        <div class="aqi-gauge" 
             style="background: conic-gradient(${aqiInfo.color} ${aqiPercent}%, #eee 0)">
          <div class="aqi-gauge-inner">
            <div class="aqi-value" style="color: ${aqiInfo.color};">
              ${formatValue(aqi)}
            </div>
            <div class="aqi-label">AQI</div>
          </div>
        </div>

        <div class="card-stats">
          <div class="stat-item">
            <span>PM2.5</span>
            <strong>${formatValue(location.Display_PM2_MAX, 1)}</strong>
          </div>
          <div class="stat-item">
            <span>CO</span>
            <strong>${formatValue(location.Display_CO_MAX, 1)}</strong>
          </div>
          <div class="stat-item">
            <span>Temp</span>
            <strong>${formatValue(location.TEMPRATURE_MAX, 1)} °C</strong>
          </div>
          <div class="stat-item">
            <span>Status</span>
            <strong style="color: ${aqiInfo.color};">${aqiInfo.status}</strong>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Manually attach the initMap function to the window
window.initMap = initMap;