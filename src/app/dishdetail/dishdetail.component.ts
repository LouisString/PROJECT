import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import {Dish} from '../shared/dish'

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DishdetailComponent implements OnInit {
  @Input()
  dish: Dish;
  constructor() { }

  ngOnInit() {
  }

}
