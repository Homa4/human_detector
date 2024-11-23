function find_me() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const current_date = new Date();
            const date = `${current_date.getDate()}:${current_date.getMonth() + 1}:${current_date.getFullYear()}`;
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const coords = [latitude, longitude];

            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

            const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

            // Fetch geolocation data first
            fetch(geoApiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log('Geolocation data:', data);

                    // Prepare the data for sending
                    const pigeon = {
                        info_obj: data,
                        date: date,
                        coords: coords,
                    };

                    // Send the data to the server
                    fetch('/data', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(pigeon),
                    })
                        .then(() => {
                            console.log('Data sent successfully');
                        })
                        .catch((error) => {
                            console.error('Error sending data to the server:', error);
                        });
                })
                .catch(error => {
                    console.error('Error fetching geolocation data:', error);
                });
        },
        (error) => {
            console.log('Geolocation error:', error.message);
        }
    );
}

document.addEventListener('DOMContentLoaded', find_me);
