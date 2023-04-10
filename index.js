require('dotenv').config();
axios = require('axios');
qs = require('qs');

const container = document.querySelector('.container');
const messageRegistration = document.querySelector('.message-registration');
const sendSMS = document.querySelector('.submit-sms button');
const sendVoice = document.querySelector('.submit-call button');
const sendWhatsApp = document.querySelector('.submit-whatsapp button');
const country = document.querySelector('.select-country');
const error400 = document.querySelector('.bad-request');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_PHONE_NUMBER;
let country_iso = '';

//generate random 6-digit number
const randomNumber = Math.floor(Math.random()*8999+1000)

//message template
const bodyMessage = `Your OTP is ${randomNumber}, please do not share`;
//WhatsApp template depends on the template you have approved in your account
const whatsappTemplate = `Your login code for OTP is ${randomNumber}. If you have doubts, please reach out to support!`; 

//function country code
function country_code_plus(country_iso){
    switch(country_iso){
        case 'CO':
            country_code = '+57'
            break
        case 'US':
            country_code = '+1'
            break    
        case 'BR':
            country_code = '+55'
            break
    }
}

//hanlding countries
country.addEventListener('change', () =>{
    var country_iso = document.getElementById('user-select').value;
    country_code_plus(country_iso)
    console.log(country_code)
})

//function for handling error 400
function errorHandling(error){
    if(error.response.status === 400){
        container.style.height = '500px';
        sendSMS.style.display = 'none';
        sendWhatsApp.style.display = 'none';
        messageRegistration.style.display = 'none';
        sendVoice.style.display = 'none';
        error400.style.display = 'block';
        error400.classList.add('fadeIn');
        return;
    }  
}

//function to send OTP through different channels
function sendOtp(channel, message){
    
    channel.addEventListener('click', () =>{
        const to = document.querySelector('.container input').value;

        if(to === '')
            return;

        if(channel === sendWhatsApp){
            axios.post(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, qs.stringify({
                Body: message,
                From: 'whatsapp:'+from,
                To: 'whatsapp:' + country_code + to
            }), {
                auth: {
                    username: accountSid,
                    password: authToken
                }
            }).then((response)=>{
                console.log(response, "success");
            })
            .catch((err)=>{
                //console.log(err.response.status);
                //console.log(err.response.data);
                //console.log(err.response.headers);
                errorHandling(err);
                })
        } else if (channel === sendSMS){
            axios.post(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, qs.stringify({
                Body: `Your OTP is ${randomNumber}, please do not share`,
                From: from,
                To: country_code + to
            }), {
                auth: {
                    username: accountSid,
                    password: authToken
                }
            }).then((response)=>{
                console.log(response, "success");
            })
            .catch((err)=>{
                //console.log(err.response.status);
                //console.log(err.response.data);
                //console.log(err.response.headers);
                errorHandling(err);        
            })
        } else if (channel === sendVoice){
            axios.post(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`, qs.stringify({
                Url: `https://handler.twilio.com/twiml/EH073ec66c09bef810861cf247d3f6ba63?OTP=${randomNumber}`,
                From: from,
                To: country_code + to
            }), {
                auth: {
                    username: accountSid,
                    password: authToken
                }
            }).then((response)=>{
                console.log(response, "success");
            })
            .catch((err)=>{
                //console.log(err);
                //console.log(err.response.status);
                //console.log(err.response.data);
                //console.log(err.response.headers);
                errorHandling(err);        
            })
        }
        error400.style.display = 'none';
        error400.classList.remove('fadeIn');
        container.style.height = '305px';
    })

}

//Calling functions to send the OTP
sendOtp(sendSMS, bodyMessage);
sendOtp(sendWhatsApp, whatsappTemplate);
sendOtp(sendVoice);