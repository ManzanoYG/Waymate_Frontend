import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../utils/authentication/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  ImagePath: string;
  collapsed = true;
  isConnected = false;
  passenger = false;
  driver = false;
  admin = false;
  username = "";


  constructor(private authService: AuthenticationService, private _route:Router) {
    this.ImagePath = "assets/img/WayMate_Logo.png"
  }

  displayLogout(){
    this.authService.isConnected().subscribe({
      next: () => {
        this.isConnected = true;
      },
      error: () => {
        this.isConnected = false;
    }
    });
  }

  displayPassenger(){
    this.authService.TestConnectionPassenger().subscribe({
      next: () => {
        this.passenger = true;
      },
      error: () => {
        this.passenger = false;
      }
    });
  }

  displayDriver(){
    this.authService.TestConnectionDriver().subscribe({
      next: () => {
        this.driver = true;
      },
      error: () => {
        this.driver = false;
      }
    });
  }

  displayAdmin(){
    this.authService.TestConnectionAdmin().subscribe({
      next: () => {
        this.admin = true;
      },
      error: () => {
        this.admin = false;
      }
    });
  }

  logout(): void{
    this.authService.logout().subscribe({
      next: value => {
        this._route.navigate(['/home']);
      },
      error: (err) => {
        console.error("Logout failed", err);
      }
    });
  }

  getUsernameToken() {
    this.authService.GetUsernameFromToken().subscribe(
      value => {
        this.username = value.username;
      }
    );
  }

  ngOnInit(): void {
    this.getUsernameToken()
    this.displayPassenger();
    this.displayDriver();
    this.displayAdmin();
  }
}
