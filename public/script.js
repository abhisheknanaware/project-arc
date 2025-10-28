    // function initMap() {
    //   const map = new google.maps.Map(document.getElementById("map"), {
    //     zoom: 12, // zoomed into Pune
    //     center: { lat: 18.5204, lng: 73.8567 }, // Pune coordinates
    //     mapTypeId: google.maps.MapTypeId.TERRAIN,
    //     styles: [
    //       // Hide all points of interest (shops, cafes, etc.)
    //       { featureType: "poi", stylers: [{ visibility: "off" }] },
    //       { featureType: "poi.business", stylers: [{ visibility: "off" }] },
    //       // Hide transit info (bus stops, stations)
    //       { featureType: "transit", stylers: [{ visibility: "off" }] },
    //       // Hide road icons, keep simple labels
    //       { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    //       // Keep only city/locality names
    //       { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ visibility: "on" }] },
    //       // Hide smaller area names
    //       { featureType: "administrative.neighborhood", stylers: [{ visibility: "off" }] },
    //       // Simplify the rest
    //       { featureType: "landscape.man_made", stylers: [{ visibility: "simplified" }] }
    //     ]
    //   });
    // }
function initMap() {
            // 1. Sample AQI Data (based on your Python script locations)
            // In a real app, you would fetch this from your backend API
            const aqiLocations = [
                { name: 'Bopodi Square', lat: 18.56, lng: 73.84, aqi: 120, status: 'Moderate' },
                { name: 'Karve Statue Square', lat: 18.50, lng: 73.82, aqi: 85, status: 'Satisfactory' },
                { name: 'Lullanagar Square', lat: 18.49, lng: 73.89, aqi: 155, status: 'Unhealthy' },
                { name: 'Hadapsar Gadital', lat: 18.50, lng: 73.92, aqi: 210, status: 'Very Unhealthy' },
                { name: 'PMPML Bus Depot, Deccan', lat: 18.52, lng: 73.84, aqi: 95, status: 'Satisfactory' },
                { name: 'Pune Railway Station', lat: 18.53, lng: 73.87, aqi: 180, status: 'Unhealthy' },
            ];

            // 2. Create the Map
            // Centered on Pune
            const mapOptions = {
                zoom: 12,
                center: { lat: 18.5204, lng: 73.8567 } // Center of Pune
            };
            const map = new google.maps.Map(document.getElementById("map"), mapOptions);

            // 3. Create Markers and Info Windows
            const infowindow = new google.maps.InfoWindow();

            aqiLocations.forEach(location => {
                const marker = new google.maps.Marker({
                    position: { lat: location.lat, lng: location.lng },
                    map: map,
                    title: location.name
                });

                // Content for the popup window
                const contentString = `
                    <div style="font-family: Arial, sans-serif; padding: 5px;">
                        <h4 style="margin: 0 0 5px 0;">${location.name}</h4>
                        <p style="margin: 0;"><strong>AQI: ${location.aqi}</strong></p>
                        <p style="margin: 5px 0 0 0;">Status: ${location.status}</p>
                    </div>`;

                // Add click listener to each marker
                marker.addListener("click", () => {
                    infowindow.setContent(contentString);
                    infowindow.open({
                        anchor: marker,
                        map,
                    });
                });
            });
        }