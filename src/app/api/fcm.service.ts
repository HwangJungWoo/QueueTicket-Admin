import { Injectable } from '@angular/core';
// FCM 라이브러리
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, JsonpClientBackend } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class FcmService {

  // 파이어베이스 클라우드 메시징 서버키
  SERVER_KEY = 'AAAAOM4RcGU:APA91bEy21PRQ2lJO8bM8Wb0o8RBLoVwxUA9pEPR0576pQvZPOvlGSkP3JEpfp1mCTAkBBbrZsIElVCw69o41GJMuJdkWBuGP-x84aqsYKTKgcxUabxiPr9AwNrPTPgVCNsEPwxchtTj';

  constructor(
    private http: HttpClient,

  ) { }

  // 퍼미션을 승인후 FCM 토큰을 서버에서 받음
  async requestPermission() {
    const messaging = getMessaging();
    // console.log("messaging : " + JSON.stringify(messaging));
    let fcmToken = getToken(messaging,
      {
        vapidKey: environment.firebase.vapidKey
      }).then(
        (currentToken) => {
          if (currentToken) {
            return currentToken;

          } else {

            let err = "등록된 토큰이 없습거나 권한요청을 하지 않았습니다";
            this.presentAlert(err);
            //console.log('등록된 토큰이 없습거나 권한요청을 하지 않았습니다.');
          }
        }).catch((err) => {
          let error = '토큰 받는중 에러 발생, ' + err;
          this.presentAlert(error);
          //console.log('토큰 받는중 에러 발생 ', err);
        });

    return fcmToken;
  }

  async presentAlert(err: string) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Alert';
    alert.subHeader = 'Important message';
    alert.message = err;
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    await alert.present();
  }



  // 푸쉬 메세지 보내기
  sendPushNotification(token:string, message:string) {
    let url = 'https://fcm.googleapis.com/fcm/send';
    let body =
    {
      "notification": {
        "title": "링클식당 입장안내",
        "body": message,
        "sound": "default",
        "click_action": "FCM_PLUGIN_ACTIVITY",
        "icon": "fcm_push_icon"
      },
      "data": {
        "hello": "This is a Firebase Cloud Messaging hbhj g Device Gr new v Message!",
      },
      "to": token
      //"to": "/topics/notice",
    };

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'key=' + this.SERVER_KEY
    });
    let options = {
      headers: headers
    }

    this.http.post(url, body, options).subscribe(data => {
      console.log(data);
    });
  }
}
