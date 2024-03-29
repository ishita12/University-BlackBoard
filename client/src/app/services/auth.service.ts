import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
//import  { User } from '../../../../models/user';
@Injectable()
export class AuthService {

  // domain = ""; // Production

  constructor(
    private http: Http
  ) { }

  domain = "http://localhost:8080";
  authToken;
  user;
  options;
  role;

    // Function to create headers, add token, to be used in HTTP requests
    createAuthenticationHeaders() {
      this.loadToken(); // Get token so it can be attached to headers
      // Headers configuration options
      this.options = new RequestOptions({
        headers: new Headers({
          'Content-Type': 'application/json', // Format set to JSON
          'authorization': this.authToken // Attach token
        })
      });
    }

    // Function to get token from client local storage
    loadToken() {
      this.authToken = localStorage.getItem('token'); // Get token and asssign to variable to be used elsewhere
    console.log('token is '+ this.authToken);
    }

    // Function to register user accounts
    registerUser(user) {
      return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
    }



   setUser(){
this.createAuthenticationHeaders();
console.log('inside set user');
return this.http.get(this.domain + '/authentication/getRole', this.options).map(res => res.json());


   }


    // Function to login user
    login(user) {

      return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
    }


  logout(){
    this.authToken =null;
    this.user = null;
    localStorage.clear();
  }

    // Function to store user's data in client local storage
    storeUserData(token, user) {
      localStorage.setItem('token', token); // Set token in local storage
      localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
      this.authToken = token; // Assign token to be used elsewhere
      this.user = user; // Set user to be used elsewhere
    }

    // Function to get user's profile data
    getProfile() {
      this.createAuthenticationHeaders(); // Create headers before sending to API
      return this.http.get(this.domain + '/authentication/profile', this.options).map(res => res.json());
    }



loggedIn(){

  return tokenNotExpired();
}


userRole(){
    console.log('inside userRole function');
//  if(this.loggedIn()){
    this.getProfile().subscribe(data => {
      this.role=data.user.role;
      console.log('inside role function and role is    '+this.role);
    });
    console.log('inside userRole function    '+this.role);
    return this.role;
//  }
}


getPublicProfile(username){
    console.log('inside public profile');
  this.createAuthenticationHeaders();

  return this.http.get(this.domain + '/authentication/publicProfile/' + username, this.options).map(res => res.json());
}




  }
