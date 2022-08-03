import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

interface Customer {
  order: string;
  date: string;
  uid: string;
  token: string;
  phone_number: string;
  complete: number; // 입장완료 여부
}

@Injectable({
  providedIn: 'root'
})
export class BasicQueryService {

  constructor(
    private afAuth: AngularFireAuth,
    private datePipe: DatePipe,
    private db: AngularFireDatabase,
  ) { }


  private getUid() {
    return new Promise((resolve) => {
      resolve(
        this.afAuth.currentUser.then((info) => {
          return new Promise((resolve) => {
            resolve(info.uid);
          })
        }))
    })
  }

  /****************************************************************************
   *
   * first-page
   *
  *****************************************************************************/

  // 유저 정보 저장(1.순번, 2.날짜, 3.uid, 4.fcm token, 5.전화번호, 6.입장완료 여부)
  // 초기값 1
  setCustomerInfo(orderNumber: string, token:string, phone_number:string) {
    const date = Date.now();
    const dateNow = this.datePipe.transform(date, 'yyyy년MM월dd일');

    let today = new Date();
    let hours = ('0' + today.getHours()).slice(-2);
    let minutes = ('0' + today.getMinutes()).slice(-2);
    let seconds = ('0' + today.getSeconds()).slice(-2);

    let timeString = hours + '시' + minutes + '분' + seconds + '초';

    let dateResult = dateNow + timeString;

    this.getUid().then((uid) => {
      return this.db.list(`customer/`).set(`${orderNumber}`, {
        order: orderNumber,
        date: dateResult,
        uid: uid,
        token: token,
        phone_number: phone_number,
        complete: 1 // 초기값, 고객 입장하면 2로 변경
      });
    });
  }

  // 마지막 레코드의 순번(order) 값 가져오기
  getLastOrderNumber(): Observable<any> {
    //ref => ref.orderByChild("data").equalTo(date))
    return this.db.list('customer', ref => ref.orderByChild("order").limitToLast(1))
      .valueChanges().pipe(take(1),
        map((customer: Customer[]) => {
          return customer;
        })
      );
  }

  /****************************************************************************
   *
   * second-page
   *
  *****************************************************************************/

  // 입장하지 않은 손님의 데이터만 가져오기
  // complete 값 2 이면 입장한 손님, 값이 1이면 입장하지 않은 손님
  getNoEntranceCustomer() {
    return this.db.list('customer',
      ref =>
        ref
          .orderByChild("complete")
          .equalTo(1)) //

      .valueChanges().pipe(
        map((customers: Customer[]) => {
          return customers.map(customer =>
          ({
            token: customer.token,
          })
          ); // end return
        }) // end map
      );
  }

  // 나의 주문번호 검색
  getMyOrderNumber(uid: string) {
    this.afAuth.currentUser.then(user => {
      //console.log(user.uid)
    })

    return this.db.list('customer',
      ref =>
        ref
          .orderByChild("uid")
          .equalTo(uid))

      .valueChanges().pipe(
        map((customers: Customer[]) => {
          return customers.map(customer =>
          ({
            order: customer.order,
            token: customer.token,
          })
          ); // end return
        }) // end map
      );
  }


  // 해당 고객의 전화번호 가져오기
  // 나의 주문번호 검색
  getMyPhoneNumber(uid: string) {
    this.afAuth.currentUser.then(user => {
      //console.log(user.uid)
    })

    return this.db.list('customer',
      ref =>
        ref
          .orderByChild("uid")
          .equalTo(uid))

      .valueChanges().pipe(
        map((customers: Customer[]) => {
          return customers.map(customer =>
          ({
            phone_number: customer.phone_number,
          })
          ); // end return
        }) // end map
      );
  }

  /****************************************************************************
  *
  * admin
  *
 *****************************************************************************/
  // 전체 레코드의 값 가져오기
  getAllData(): Observable<any> {
    //ref => ref.orderByChild("data").equalTo(date))

    return this.db.list('customer')
      .valueChanges().pipe(
        map((customers: Customer[]) => {
          return customers.map(customer => ({
            order: customer.order,
            date: customer.date,
            uid: customer.uid,
            token: customer.token,
            phone_number: customer.phone_number,
            complete: customer.complete
          })
          );//end return
        }) //end map
      ); // end pipe
  }

  // 입장완료했으면 DB 값 업데이트하여 "입장완료"로 변경
  updateCustomerInfo(order:string) {

    return this.db.list(`customer/`).set(`${order}/complete/`, 2);
  }

  // 백업
  backupData() {
    const date = Date.now();
    const dateNow = this.datePipe.transform(date, 'yyyy년MM월dd일');

    this.getAllData().subscribe(customer => {
      console.log('customer: ' + JSON.stringify(customer));
      this.db.list(`backup/`).push(customer);
    }, error => {
      if (error) {
        console.log("에러발생");
        return;
      }
      console.log("백업성공");
    })
  }

  //complete?: () => void)

  // 초기화
  initData() {
    this.db.list(`/customer/`).remove().then(

    )
  }


  // 백업데이터 전체 레코드의 값 가져오기
  async getBackupData() {
    //ref => ref.orderByChild("data").equalTo(date))

    this.db.list('backup').snapshotChanges()
      .forEach(snapshot => {
        //console.log('snapshot1: ' + JSON.stringify(snapshot));
        snapshot.forEach(snapshot => {


          //console.log('snapshot2: ' + JSON.stringify(snapshot));
        })
      })



  }

  // 키가 포함된 경로의 데이터 가져오기
  getBackupDataWithKey(key: string): Observable<any> {

    // console.log('key: ' + key);


    return this.db.list(`backup/${key}/customer/`)
      .valueChanges();
  }
}
