# sensorio-hub
A hub to manage many sensor and their data.

To get the address ip to identify the sensor you can do a request to **`/ip`**.

To code the front javascript, you have to use: `npm run code`, it will start a browser-sync server.

![Demo](demo.png)

## Mail config

You will have to create a `mail-config.json` file to configurate the mail service:
```json
{
    "language": "en",
    "service": "gmail",
    "auth": {
        "user": "email",
        "pass": "password"
    }
}
```
You can use a lot of service as described [there](http://nodemailer.com/smtp/well-known/).
I use another GMail account to send me the data each day. 