import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Dish } from '../shared/dish';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {

  constructor() { }
  ngOnInit() {
  }

}

