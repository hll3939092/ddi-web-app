import {Component, ViewChild} from '@angular/core';
import { AuthService } from './services/auth.service';
import {DropdownModule} from "ng2-dropdown";
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {QueryBuilderComponent} from "./controls/query-builder/query-builder.component";
import {SearchQuery} from "./model/SearchQuery";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title : string;
  homePage: boolean;

  constructor(private auth: AuthService, private slimLoadingBarService: SlimLoadingBarService
    , private route: ActivatedRoute
    , private router: Router){

    this.title =this.getTitle();
  }

  ngOnInit() {
    this.router.events.subscribe(x => {
      this.homePage = (x.url == "/" || x.url == "/home");
    });
  }


  getTitle(): string{
    let result = 'Omics DI 2.0';
    return result;
  }

  startLoading() {
    this.slimLoadingBarService.start(() => {
      console.log('Loading complete');
    });
  }

  stopLoading() {
    this.slimLoadingBarService.stop();
  }

  completeLoading() {
    this.slimLoadingBarService.complete();
  }
}