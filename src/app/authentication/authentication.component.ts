import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessagesService } from './../errors/error-messages.service';
import { HttpClientService } from './../HttpClient/HttpClient.service';
import { ErrorModalComponent } from '../errors/ErrorModal/error-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  dataForSignIn: FormGroup;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly errorMessagesService: ErrorMessagesService,
    public httpClient: HttpClientService,
    private dialog: MatDialog,
    private readonly router: Router,
  ){
    console.log("Constructor");
    this.dataForSignIn = this.formBuilder.group({
      email:['', [Validators.required]],
      password:['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  submit(){
    if(this.dataForSignIn.valid){
      let x = document.getElementById("all");
      x.style.display = "none";
      let y = document.getElementById("loadingSpinner");
      y.style.display = "block";  
      this.httpClient.Login(this.dataForSignIn.value).subscribe(res => {
        console.log(res);
        console.log(res.token);
        console.log('Login success!');
        localStorage.setItem('AccessToken', res.token);
        this.router.navigate([`/user/${res.user.id}/transactions`]);
      },
      err => {
        console.log('Login fail!');
        console.log(err.error.message);
          const dialogRef = this.dialog.open(ErrorModalComponent, {
            data: {
              message: err.error.message
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            let x = document.getElementById("all");
            x.style.display = "block";
            let y = document.getElementById("loadingSpinner");
            y.style.display = "none";  
          });
      });

    }
  }

}
