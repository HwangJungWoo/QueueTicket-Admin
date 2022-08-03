import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasicQueryService } from 'src/app/api/basic-query.service';
import { FcmService } from 'src/app/api/fcm.service';

import { HttpClient, HttpHeaders, HttpParams, JsonpClientBackend } from '@angular/common/http';

// declare function greet(): void;

interface Customer {
  order: string; // 대기번호
  date: string; // 접수시간
  uid: string; // 유저 ID
  token: string; // 푸쉬 토큰
  phone_number: string; // 전화번호
  complete: number; // 입장완료 여부
}

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  p: number = 1; // 현재페이지 설정, 최초 페이지 1

  mToken: string = "0"; //fcm token

  condition: boolean = false;

  constructor(
    private basicQuery: BasicQueryService,
    private datePipe: DatePipe,
    private fcmService: FcmService,
    private router: Router,

    private http: HttpClient,
  ) {
    // greet();
  }

  ngData: string;
  user: Customer[] = [
    // {
    //   order: "1",
    //   date: "2022년7월22일",
    //   uid: "111",
    //   token: "222",
    //   phone_number: "010-7392-8745",
    //   complete: 2
    // }
  ];


  ngOnInit() {

    this.getCustomerData();

    // 대기 고객이 3이하면 푸쉬 메세지 자동전송
    this.pushMsgIfLessThanThree();
  }

  onSearch(ngData: string) {

  }

  openDialog(user) {
  }

  // 고객의 모든 데이터 가져오기
  getCustomerData() {

    this.basicQuery.getAllData()
      .subscribe(customer => {
        this.user = customer;


        customer.map(customers => {
          let phone = customers.phone_number;
          console.log(phone);
        })

      })
  }

  // 푸쉬메세지 발송
  sendNoti(token: string, phone: string) {
    this.fcmService.sendPushNotification(
      token,
      "대기순서가 도래하였습니다. 입장하여 주십시오."
    );

    alert("메세지를 발송하였습니다");

    // 카카오톡 알림톡 보내기
    let phoneNumber = phone.replace(/\-/g, "");
    this.sendAlimTalk(phoneNumber);

  }

  // 입장완료했으면 버튼을 눌러 DB 업데이트
  updateCompletedEntrance(order: string) {
    this.basicQuery.updateCustomerInfo(order);
  }

  // 백업
  onBackUp() {

    this.basicQuery.backupData();

    alert("백업성공");

  }

  // 당일 초기화
  onInit() {
    this.basicQuery.initData();
    alert("초기화성공");
  }

  // 지난내역 페이지로 가기
  goHistoryPage() {
    this.router.navigate(['history/']);
  }

  // 대기순서가 몇명이 남았는지 확인하여 출력
  // 대기순서가 3 이하인지 체크하고 3이하이면 푸쉬메세지
  pushMsgIfLessThanThree() {
    this.basicQuery.getNoEntranceCustomer()
      .subscribe(customer => {


        customer.map(customers => {
          this.mToken = customers.token;

          // console.log('customer: ' + JSON.stringify(customers.token));
        })

        let customerNum = customer.length;



        // 대기순서가 3 이하인지 체크하고 3이하이면 푸쉬메세지
        this.checkWaitingNumber(customerNum, this.mToken);
      })
  }

  checkWaitingNumber(customerNum: number, token: string) {
    if (customerNum < 4) {
      // 메세지 발송
      console.log("fcm :" + this.mToken);
      this.fcmService.sendPushNotification(
        token,
        "고객님의 차례가 다가오고 있습니다. 지금 매장으로 오셔서 대기하여 주세요."
      )

      this.condition = true;
    } else {
      this.condition = false;
    }
  }

  // 카카오 알림톡 ---------------------------------------------------------------------------------


  sendAlimTalk(phone:string) {

    let url = `http://45.119.146.219:3000/`;

    const params = new HttpParams().set('phone', phone);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    let options = {
      headers: headers
    }

    let body =
    {
      params
    };

    this.http.get(url, body).subscribe(data => {
      console.log(data);
    });
  }
}
