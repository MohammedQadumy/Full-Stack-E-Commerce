import { Component,Inject } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth, pkce } from '@okta/okta-auth-js';
import OktaSignin from '@okta/okta-signin-widget';

import myAppConfig from 'src/app/config/my-app-config';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  oktaSignin:any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth:OktaAuth){
    this.oktaSignin = new OktaSignin({
      logo:'assets/images/logo.png',
      baseUrl:myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId:myAppConfig.oidc.cleintId,
      redirectUri:myAppConfig.oidc.redirectUri,
      authParams:{
        pkce:true,
        issuer:myAppConfig.oidc.issuer,
        scopes:myAppConfig.oidc.scopes,
      }
    });
  }
  ngOnInit():void{
    this.oktaSignin.remove();
    this.oktaSignin.renderEl({
      el:'#okta-sign-in-widget'} ,// this name should be same as div tag id in login component.html

      (response:any) => {
        if(response.status === 'SUCCESS'){
          this.oktaAuth.signInWithRedirect();
        }
    },
    (error:any) => {
      throw error;
    }
  );
  }
}
