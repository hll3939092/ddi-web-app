import { Component, OnInit } from '@angular/core';
import {DataSetDetail} from "../../model/DataSetDetail";
import {Observable} from "rxjs/Observable";
import {SelectedService} from "../../services/selected.service";
import {DataSetService} from "../../services/dataset.service";
import {AppConfig} from "../../app.config";
import {DatabaseListService} from "../../services/database-list.service";

@Component({
  selector: 'app-selected',
  templateUrl: './selected.component.html',
  styleUrls: ['./selected.component.css']
})
export class SelectedComponent implements OnInit {

  dataSets: DataSetDetail[];

  constructor(private selectedService:SelectedService
              ,private dataSetService: DataSetService
              ,private appConfig: AppConfig
              ,private databaseListServce: DatabaseListService) { }

  ngOnInit() {
    this.reloadDataSets();
  }

  reloadDataSets(){
    this.dataSets = new Array();
    if(!this.selectedService.dataSets){
      return;
    }
    Observable.forkJoin(this.selectedService.dataSets.map(x => { return this.dataSetService.getDataSetDetail_private(x.id,x.source)})).subscribe(
      y => {this.dataSets = y}
    )
  }

  remove(source, id){
    var i = this.dataSets.findIndex(x => x.id==id && x.source==source);
    if(i>-1){
      this.dataSets.splice(i,1);
    }
  }

  getDatabaseUrl(source){
    var db =  this.databaseListServce.databases[source];
    if(!db) {
      console.log("source not found:"+source);
    }
    else {
      return db.sourceUrl;
    }
  }

  getDatabaseTitle(source){
    var db =  this.databaseListServce.databases[source];
    if(!db) {
      console.log("source not found:"+source);
    }
    else {
      return db.databaseName;
    }
  }


}
