# Reading Bot WebApp

This is a WebApp implementation for the Reading Bot Telegram bot. It provides a web interface with a 3D character model and interactive reading content.

## Features

- 3D character model using Three.js
- Interactive reading content with questions
- Integration with the Telegram Bot API
- Responsive design for various screen sizes

## Structure

- `index.html` - Main HTML file
- `css/` - CSS styles
  - `style.css` - Main stylesheet
- `js/` - JavaScript files
  - `app.js` - Main application logic
  - `3d-model.js` - 3D model rendering using Three.js
- `server.py` - Simple server to serve the WebApp files

## Setup

1. Make sure you have the required dependencies installed:
   ```
   pip install aiohttp
   ```

2. Update the `WEBAPP_URL` in `handlers/webapp/webapp_handler.py` to point to your hosted WebApp URL.

3. Run the server:
   ```
   python webapp/server.py
   ```

4. The server will start on port 8080 by default. You can change this by setting the `PORT` environment variable.

## Integration with Telegram Bot

The WebApp is integrated with the Telegram bot through the handlers in `handlers/webapp/webapp_handler.py`. The bot provides a command `/webapp` to open the WebApp, and it can also receive data from the WebApp.

## 3D Model

The WebApp includes a 3D character model rendered using Three.js. The model is loaded from a URL, with a fallback to create a simple character if the model loading fails.

## Development

To develop the WebApp locally:

1. Run the server as described above.
2. Use a tool like ngrok to expose your local server to the internet:
   ```
   ngrok http 8080
   ```
3. Update the `WEBAPP_URL` in `handlers/webapp/webapp_handler.py` to point to your ngrok URL.
4. Restart the bot.

## Customization

You can customize the WebApp by:

- Replacing the 3D model URL in `js/3d-model.js`
- Modifying the categories and topics in `js/app.js`
- Updating the styles in `css/style.css`
- Adding new features to the WebApp

## License

This project is licensed under the same license as the main Reading Bot project.