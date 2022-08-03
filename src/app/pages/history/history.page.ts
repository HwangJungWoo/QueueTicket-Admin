import { Component, OnInit } from '@angular/core';

import { BasicQueryService } from 'src/app/api/basic-query.service';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';




interface Customer {
  order: string; // 대기번호
  date: string; // 접수시간
  uid: string; // 유저 ID
  token: string; // 푸쉬 토큰
  phone_number: string; // 전화번호
  complete: number; // 입장완료 여부
}

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  p: number = 1; // 현재페이지 설정, 최초 페이지 1

  user: Customer[] = [
  ];


  constructor(
    private basicQuery: BasicQueryService,
    private db: AngularFireDatabase,
  ) { }

  ngOnInit() {
    this.getCustomerData();
  }

  // 고객의 모든 데이터 가져오기(중첩)

  getCustomerData() {

    this.db.list('backup').valueChanges().subscribe(
      value => {
        this.user = []; //초기화
        value.map((customers: Customer[]) => {
          customers.map(customer => {
            this.user.push(customer); // 배열 입력
          })
        })

      }
    )
  }





}
