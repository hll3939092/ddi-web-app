import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {DataSet} from 'model/DataSet';
import {SearchService} from '@shared/services/search.service';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {SearchResult} from 'model/SearchResult';
import {AppConfig} from 'app/app.config';
import {ProfileService} from '@shared/services/profile.service';
import {SelectedService} from '@shared/services/selected.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {DataSetService} from '@shared/services/dataset.service';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications/dist';
import {DatabaseListService} from '@shared/services/database-list.service';
import {CitationDialogComponent} from '@shared/modules/controls/citation-dialog/citation-dialog.component';

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit, OnDestroy, AfterViewChecked {
    subscription: Subscription;
    result: Observable<SearchResult>;
    datasets: Observable<DataSet[]>;

    p = 1;
    total: number;
    loading: boolean;

    constructor(public appConfig: AppConfig
        , public searchService: SearchService
        , private slimLoadingBarService: SlimLoadingBarService
        , public profileService: ProfileService
        , public selectedService: SelectedService
        , private dataSetService: DataSetService
        , private dialog: MatDialog
        , private router: Router
        , private notificationService: NotificationsService
        , private databaseListServce: DatabaseListService) {

        console.log('SearchResultComponent ctor');
        this.slimLoadingBarService.start();

        this.datasets = this.searchService.searchResult$.map(x => x.datasets);
    }

    ngOnInit() {
        console.log('ngOnInit');
        this.subscription = this.searchService.searchResult$.subscribe(
            searchResult => {
                this.total = searchResult.count;
                this.slimLoadingBarService.complete();
                console.log('search result observed:' + String(searchResult.count));
            });
        console.log('getting profile');
        this.profileService.getProfile();
    }

    ngOnDestroy() {
        console.log('ngOnDestroy');
        this.subscription.unsubscribe();
    }


    ngAfterViewChecked() {
        // this.slimLoadingBarService.complete();
        // console.log("search-result.ngAfterViewChecked");
    }

    /*
    omicsTest(d:DataSet, omics:string):boolean{
      if(d == null)
        return false;

      if(d.omicsType == null)
        return false;

      return (d.omicsType.indexOf(omics) !== -1);
    }*/

    clicked(source: string, id: string) {
        // console.log(`clicked ${source} ${id}`);
        this.selectedService.select(source, id);
    }

    toggle(source: string, id: string) {
        this.selectedService.toggle(source, id);
        console.log(`toggle ${source} ${id}`);
    }

    citeClicked($event, source, id) {
        this.citation(source, id);
        $event.stopPropagation();
        $event.preventDefault();
    }

    selectClicked($event, source, id) {
        this.toggle(source, id);
        $event.stopPropagation();
        $event.preventDefault();
    }

    citation(source, id) {
        let dialogRef: MatDialogRef<CitationDialogComponent>;

        this.dataSetService.getDataSetDetail_private(id, source).subscribe(
            x => {
                dialogRef = this.dialog.open(CitationDialogComponent);
                dialogRef.componentInstance.title = 'Dataset citation';
                dialogRef.componentInstance.datasetDetail = x;
                return dialogRef.afterClosed();
            }
        );
    }


}