import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  moduleId: module.id,
  selector: 'cv-testfire',
  templateUrl: 'testfire.component.html',
  styleUrls: ['testfire.component.css']
})
export class TestfireComponent implements OnInit {

  // see https://github.com/angular/angularfire2/blob/master/docs/1-install-and-setup.md
  items: FirebaseListObservable<any[]>;

  firebase : String;
  constructor(af: AngularFire) {
    this.items = af.database.list('items');
    this.firebase = "FIREBASE" ;
  }

  ngOnInit() {
  }
}
