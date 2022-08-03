const axios = require("axios");
const express = require("express");
const CryptoJS = require("crypto-js");
const https = require("https");

const app = express();
const port = 3000;

function makeSignature(timestamp) {
  const uri = "ncp:kkobizmsg:kr:2564809:ticket";
  var space = " "; // one space
  var newLine = "\n"; // new line
  var method = "POST"; // method
  const url =
    "https://sens.apigw.ntruss.com/alimtalk/v2/services/ncp:kkobizmsg:kr:2564809:ticket/messages";
  //var timestamp = Date.now().toString(); // current timestamp (epoch)
  var accessKey = "ZN0rf7kny65FDmNhuFPx"; // access key id (from portal or Sub Account)
  var secretKey = "gKDYGNakvrELexGnUa9CUD4nSG43gUCsJYrMvw2N"; // secret key (from portal or Sub Account)

  var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(accessKey);

  var hash = hmac.finalize();

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
            "고객님의 대기순서가 도래하였습니다. 매장으로 오셔서 입장하여 주십시오.",
          headerContent: "",
          useSmsFailover: false,
          failoverConfig: {
            type: "",
            from: "",
            subject: "",
            content: "",
          },
        },
      ]
    };
}

function sendAxios() {
  let timestamp = new Date().getTime().toString();

  let params = getRequestParams();

  axios
    .post(
      `https://sens.apigw.ntruss.com/alimtalk/v2/services/ncp%3Akkobizmsg%3Akr%3A2564809%3Aticket/messages`,
      params,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-ncp-apigw-timestamp": timestamp,
          "x-ncp-iam-access-key": "ZN0rf7kny65FDmNhuFPx",
          "x-ncp-apigw-signature-v2": makeSignature(timestamp),
        },
      }
    )
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}


function sendKakaoAlimTalk() {

  let timestamp = new Date().getTime().toString();

  axios
    .post(
      "https://sens.apigw.ntruss.com/alimtalk/v2/services/ncp:kkobizmsg:kr:2564809:ticketsendKakaoAlimTalk/messages",
      {
        templateCode: "0123456",
        plusFriendId: "@엠앤에이치컴퍼니",
        messages: [
          {
            countryCode: "82",
            to: "01073925490",
            content:
              "고객님의 대기순서가 도래하였습니다. 매장으로 오셔서 입장하여 주십시오.",
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
      },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "x-ncp-apigw-timestamp": timestamp,
          "x-ncp-iam-access-key": "ZN0rf7kny65FDmNhuFPx",
          "x-ncp-apigw-signature-v2": makeSignature(timestamp),
        },
      }
    )
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}


function sendAlimTalk() {


  let timestamp = new Date().getTime().toString();

  let url = "https://sens.apigw.ntruss.com/alimtalk/v2/services/ncp:kkobizmsg:kr:2564809:ticketsendKakaoAlimTalk/messages";

  const postData = {
    templateCode: "0123456",
    plusFriendId: "@엠앤에이치컴퍼니",
    messages: [
      {
        countryCode: "82",
        to: "01073925490",
        content:
          "고객님의 대기순서가 도래하였습니다. 매장으로 오셔서 입장하여 주십시오.",
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


  const options = {
    hostname: "sens.apigw.ntruss.com",
    path: "/alimtalk/v2/services/ncp:kkobizmsg:kr:2564809:ticketsendKakaoAlimTalk/messages",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-ncp-apigw-timestamp": timestamp,
      "x-ncp-iam-access-key": "ZN0rf7kny65FDmNhuFPx",
      "x-ncp-apigw-signature-v2": makeSignature(timestamp),
    },
  };


  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    console.log("headers:", res.headers);

    req.on("data", (chunk) => {
      console.log(`Data chunk available: ${chunk}`);
    });
  });

  //req.write(postData);

  req.end();


}



app.get("/", (req, res) => {

  sendAxios();
  //sendKakaoAlimTalk();
  //sendAlimTalk();

  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
