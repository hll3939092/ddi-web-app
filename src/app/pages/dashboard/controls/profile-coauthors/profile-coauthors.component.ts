import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {ProfileService} from "../../../../services/profile.service";
import {Profile} from "../../../../model/Profile";
import {UserShort} from "../../../../model/UserShort";

@Component({
  selector: 'app-profile-coauthors',
  templateUrl: './profile-coauthors.component.html',
  styleUrls: ['./profile-coauthors.component.css']
})
export class ProfileCoauthorsComponent implements OnInit, OnChanges {
  @Input() profile: Profile;
  @Output() change = new EventEmitter();

  coauthors: UserShort[];

  constructor(private profileService: ProfileService) { }
  ngOnInit() {
    this.profileService.getCoAuthors("1234")
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur  = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      //console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
      if(propName=="profile"){
        if(null!=chng.currentValue){
          console.log(`profile-coauthors ngOnChanges: ${chng.currentValue.userId}`);
          this.profileService.getCoAuthors(chng.currentValue.userId).subscribe(
            x => this.coauthors = x);

          console.log(`after profile-coauthors ngOnChanges: ${chng.currentValue.userId}`);
          this.profile = chng.currentValue;
        }
      }
    }
  }

  add(user: UserShort){
    if(!this.profile.coauthors)
      this.profile.coauthors = new Array<UserShort>();

    let index: number = this.profile.coauthors.findIndex(x => x.userId == user.userId);

    if(index===-1) {
      this.profile.coauthors.push(user);
      this.change.emit(null);
    }
  }

  remove(userId: string){
    let index: number = this.profile.coauthors.findIndex(x => x.userId == userId);
    if (index !== -1) {
      this.profile.coauthors.splice(index, 1);
    }
    this.change.emit(null);
  }
}