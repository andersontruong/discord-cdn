# discord-cdn
free CDN with Express API and Discord Bot

## Environment Variables
1. `BOT_TOKEN`
2. `GUILD_ID`
3. `CHANNEL_ID`
4. (Optional) `API_KEY`

## Setup (Discord Bot + Variables)
1. [Follow this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
2. Save the bot's token in the environmental variable `BOT_TOKEN`
3. Save your server's ID in `GUILD_ID`
    - Right click the server name and copy at the bottom
4. Save a channel ID from the server in `CHANNEL_ID`
    - Right click the channel name and copy at the bottom
    - This channel will store your files as messages (up to 25 MB)
5. (Optional) Create an API key and save it in `API_KEY`
    - This will enable authorization to secure your bot API

## How to use
1. Send a POST request to your server endpoint (default: `http://localhost:3002`)
    - Include the file as the value for FormData with the key: `file`
    - (Optional) Include your `API_KEY` in the `x-api-key` header
2. Receive a 200 response with the CDN link in the `url` field:
    ```json
    {
        "url": "https://cdn.discordapp.com/attachments/..."
    }
    ```
    - Receive a 401 response if the API key is enabled but is not in the request header
    - Receive a 400 response if the file size is too big (>25 MB)