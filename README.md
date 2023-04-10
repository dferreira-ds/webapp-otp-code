# webapp-otp-code
This repo contains a simple code to send OTP message via SMS, Voice or WhatsApp.

In order to create a bundle, you will need to install browserify and envify by running:
```
npm install -g browserify
npm install -g envify
```

Then, you need to create the bundle.js file. You can do so by running the following command in your terminal:
```
browserify index.js -t [ envify --TWILIO_ACCOUNT_SID ACXXXX --TWILIO_AUTH_TOKEN XXXX --TWILIO_PHONE_NUMBER +1XXXX ] > bundle.js
```
This is what the webapp looks like:

![alt text](https://github.com/dferreira-ds/webapp-otp-code/blob/main/Screenshot.png)

Note: make sure to update the TwiML URL in the index.js file.
