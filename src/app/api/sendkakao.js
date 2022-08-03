const express = require('express');
const CryptoJS = require('crypto-js');
const axios = require('axios');
const app = express()
const port = 3000

const server_id = "ncp:kkobizmsg:kr:2564809:ticket";

app.get('/', (req, res) => {
  res.send('Hello World!');

  sendKakaoAlimTalk();

})


function makeSignature() {
  const uri = "ncp:kkobizmsg:kr:2564809:ticket";
  var space = " "; // one space
  var newLine = "\n"; // new line
  var method = "POST"; // method
  const url = `/alimtalk/v2/services/${uri}/messages`;
  const url2 = `/sms/v2/services/${uri}/messages`;
  // var url = "/alimtalk/v2/services/${}/messages";  // url (include query string)
  var timestamp = Date.now().toString(); // current timestamp (epoch)
  var accessKey = "ZN0rf7kny65FDmNhuFPx"; // access key id (from portal or Sub Account)
  var secretKey = "gKDYGNakvrELexGnUa9CUD4nSG43gUCsJYrMvw2N"; // secret key (from portal or Sub Account)

  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(accessKey);

  const hash = hmac.finalize();

  console.log(hash.toString(CryptoJS.enc.Base64));

  return hash.toString(CryptoJS.enc.Base64);
}


function getRequestParams() {
  return {
    templateCode: "0123456",
    plusFriendId: "@엠앤에이치컴퍼니",
    messages: [
      {
        countryCode: "82",
        to: "01073925490",
        content:
          "고객님의 대기순서가 도래하였습니다.  매장으로 오셔서 입장하여 주십시오.",
        headerContent: "",
        useSmsFailover: false,
        failoverConfig: {
          type: "",
          from: "",
          subject: "",
          content: "",
        },
      },
    ],
  };
}

async function sendKakaoAlimTalk() {
  const params = getRequestParams();

  const encryptedKey = makeSignature();

  console.log(encryptedKey);
  console.log(params);

  await axios.post(
    `https://sens.apigw.ntruss.com/alimtalk/v2/services/ncp:kkobizmsg:kr:2564809:ticketsendKakaoAlimTalk/messages`,
    params,
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-ncp-apigw-timestamp": Date.now().toString(),
        "x-ncp-iam-access-key": "ZN0rf7kny65FDmNhuFPx",
        "x-ncp-apigw-signature-v2": encryptedKey,
      },

      body: {

      }
    }
  );

  
}


