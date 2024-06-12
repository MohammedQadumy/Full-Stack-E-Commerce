import { Component, Inject } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent {
  isAuthenticated:boolean = false;
  userFullName:string ='';
  storage:Storage = sessionStorage;



  constructor(private oktaAuthService:OktaAuthStateService,@Inject(OKTA_AUTH) private oktaAuth:OktaAuth){

  }

  ngOnInit():void{
    // subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) =>{
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );

  }
  getUserDetails() {
    if(this.isAuthenticated){
      (res: { name: string; email: string; }) => {
        this.userFullName = res.name;

        const theEmail = res.email;
        this.storage.setItem('userEmail', JSON.stringify(theEmail));
        
      }
    }
  }

  logout(){
    // terminate the session with okta and removes current tokens
    this.oktaAuth.signOut();
  }
}
