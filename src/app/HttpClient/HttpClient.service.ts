import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  
export class HttpClientService {

    // Base url
    baseurl = 'https://pruebatecnica.puntosleal.com/';
  
    constructor(private http: HttpClient) { }

    // Http Headers
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }


    // POST
  Login(data): Observable<any> {
    return this.http.post<any>(this.baseurl + 'api/user/login/', JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1)
    )
  }
  
   // GET
   GetTransactions(startDate, endDate): Observable<any> {
    return this.http.get<any>(this.baseurl + 'api/user/my/transactions?' + startDate + ',' + endDate, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  putAccessToken(accessToken){
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization':'Bearer '+accessToken
        })
      }
  }

   errorHandl(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}