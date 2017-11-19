import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish'
import { DISHES } from '../shared/dishes'
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import 'rxjs/add/operator/switchMap';
import { visibility, flyInOut, expand } from '../animations/app.animation';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
  

})

export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
  comment: Comment;
  commentForm: FormGroup;
  errMess: string;
  dishcopy = null;
  visibility = 'shown';


  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long',
      'maxlength': 'Name cannot be more than 25',
    },
    'comment': {
      'required': 'Comment is required.',
      'maxlength': 'Comment cannot be more than 250',
    }
  }

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private cb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }

  ngOnInit() {

    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .switchMap((params: Params) => {
        this.visibility = 'hidden';return this.dishservice.getDish
          (+params['id']);
      })
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish; this
          .setPrevNext(dish.id);this.visibility = 'shown';
      },
      errmess => { this.dish = null; this.errMess = <any>errmess; });

  } 

    createForm() {
      this.commentForm = this.cb.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        comment: ['', [Validators.required, Validators.maxLength(250)]],
        rating: 5,
        date: ''
      });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data),
        errmess => this.errMess = <any>errmess);

    this.onValueChanged(); //(re)set form validation messages

    }

    onValueChanged(data?: any) {
      if (!this.commentForm) { return;}
      const form = this.commentForm;
  
      for (const field in this.formErrors){
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  
    onSubmit() {
      this.comment = this.commentForm.value;
      this.comment.date = new Date().toISOString();
      console.log(this.comment);
      this.dishcopy.comments.push(this.comment);
      this.dishcopy.save()
      .subscribe(dish => { this.dish = dish; console.log(this.dish); });

      this.commentForm.reset({
        author: '',
        comment: '',
        rating: 5,
        date: ''
      });


    }  

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

    goBack(): void {
    this.location.back();
  }
  
}
