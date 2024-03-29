import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { TokenStorage } from './core/token.storage';
import { EventService } from './service/event.service';
import { CategoryService } from './service/category.service';
import { SalePlaceService } from './service/salePlace.service';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.min.css']
})
export class AppComponent {

  showHeader = false;
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  countEvents = 0;
  countCategories = 0;
  countSalePlaces = 0;
  countUsers = 0;

  constructor(private token: TokenStorage,
              private router: Router,
              private breakpointObserver: BreakpointObserver,
              private eventService: EventService,
              private categoryService: CategoryService,
              private salePlaceService: SalePlaceService,
              private userService: UserService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] === '/login') {
          this.showHeader = false;
        } else {
          this.showHeader = true;
        }
      }
    });
  }

  ngOnInit() {
    this.token.checkToken();

    this.eventService.getEvents(1, 0)
      .subscribe( data => {
        this.countEvents = data['events'].length;
      });

    this.categoryService.getCategories(1, 0)
      .subscribe( data => {
        this.countCategories = data['categories'].length;
      });

    this.salePlaceService.getSalePlaces(1, 0)
      .subscribe( data => {
        this.countSalePlaces = data['sale_places'].length;
      });

    this.userService.getUsers(1)
      .subscribe( data => {
        this.countUsers = data['users'].length;
      });

  }

  signOut(): void {
    this.token.signOut();
    this.router.navigate(['login']);
  }

  event(): void {
    this.router.navigate(['list-event']);
  }

  category(): void {
    this.router.navigate(['list-category']);
  }

  salePlace(): void {
    this.router.navigate(['list-sale-place']);
  }

  user(): void {
    this.router.navigate(['list-user']);
  }

}
