# sensorio-hub
A hub to manage many sensor and their data.

To get the address ip to identify the sensor you can do a request to **`/ip`**.

To code the front javascript, you have to use: `npm run code`, it will start a browser-sync server.

![Demo](demo.png)

## Configuration

You will have to create a `.env` file to configurate the mail service:
```dosini
MAIL_LANGUAGE=en
MAIL_SERVICE=gmail
MAIL_AUTH_USER=example@gmail.com
MAIL_AUTH_PASS=password
```
You can use a lot of service as described [there](http://nodemailer.com/smtp/well-known/).
I use another GMail account to send me the data each day. 