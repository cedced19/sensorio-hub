# sensorio-hub
A hub to manage many sensor and their data.

The devices allowed to publish data are listened in the `whitelist.json` file:

```json
{
    "weather_stations": [
        "::ffff:192.168.0.15"
    ]
}
```

To get the address ip to identify the sensor you can do a request to **`/ip`**.

To code the front javascript, you have to use: `npm run code`, it will start a browser-sync server.