import { Component, OnInit } from '@angular/core';
import { HttpClientService } from './../HttpClient/HttpClient.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '../errors/ErrorModal/error-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalTransactionComponent } from './modal-transaction/modal-transaction.component';

export class Transaction {
  type: string;
  position: number;
  value: number;
  date: string;
  points: number;
  id: number;
}
let ELEMENT_DATA: Transaction[] = [];
let FILTERED_ELEMENT_DATA: Transaction[] = [];

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  removable = true;
  selectedValue: string;
  startDate = "1940-01-01";
  endDate = "2050-01-01";
  startDateDate = new Date(this.startDate);
  endDateDate = new Date(this.endDate);
  displayedColumns: string[] = ['position', 'type', 'points', 'date', 'value'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  types = new FormControl();
  typesList: string[] = ['All','redeem', 'earn'];

  constructor(
    public httpClient: HttpClientService,
    private dialog: MatDialog,
    private readonly router: Router
  ) { 

  }

  ngOnInit(): void {
    let accessToken = localStorage.getItem('AccessToken');
    this.httpClient.putAccessToken(accessToken);
    this.httpClient.GetTransactions(this.startDate, this.endDate).subscribe(res => {
      res.data.forEach((value, index) => {
        console.log(value);
        let transaction = new Transaction();
        transaction.value = value.value;
        transaction.type = value.type;
        transaction.date = value.createdDate;
        transaction.position = index + 1;
        transaction.points = value.points;
        transaction.id = value._id;
        ELEMENT_DATA.push(transaction);
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
      });
    },
    err => {
      const dialogRef = this.dialog.open(ErrorModalComponent, {
           width: '40%',
           height: '30%', 
           data: {
            message: "Error in token"
           }
        }
      );

      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate([``]);
      });

    });
  }

  filterByStartDate(dateObject){    
      if(dateObject.value == null){
        this.startDateDate = new Date(this.startDate);
      }
      else{
        this.startDateDate = new Date(Date.parse(dateObject.value));
      }
      this.filterTransactions();
  }

  filterByEndDate(dateObject){
    if(dateObject.value == null){
      this.endDateDate = new Date(this.endDate);
    }
    else{
      this.endDateDate = new Date(Date.parse(dateObject.value));
    }
    this.filterTransactions();
  }

  filterByType(type){
    console.log(this.selectedValue);
    this.filterTransactions();
  }

  filterTransactions(){
    FILTERED_ELEMENT_DATA = [];
      ELEMENT_DATA.forEach((value, index) => {
        var transactionDate = new Date(Date.parse(value.date));
        var transactionType = value.type;
        let days = Math.floor((transactionDate.getTime() - this.endDateDate.getTime()) / 1000 / 60 / 60 / 24);
        if(this.selectedValue == "All"){
          var isValid = transactionDate >= this.startDateDate && transactionDate <= this.endDateDate;
          if(isValid || days == 0){
            FILTERED_ELEMENT_DATA.push(value);
          }
        }
        else{
          var isValid = transactionDate >= this.startDateDate && transactionDate <= this.endDateDate && this.selectedValue == transactionType;
          if(isValid || days == 0){
            FILTERED_ELEMENT_DATA.push(value);
          }
        }
        this.dataSource = new MatTableDataSource(FILTERED_ELEMENT_DATA);
      });
  }

  rowOnClick(row){
    console.log("click");
    console.log(row);

    let date = new Date (row.date);
    let dateString = date.toLocaleDateString();
    const dialogRef = this.dialog.open(ModalTransactionComponent, {
      data: {
        type: row.type,
        points: row.points,
        date: dateString,
        value: row.value
      },
      width: '50%',
      height: '60%',
    }); 
  }
}
