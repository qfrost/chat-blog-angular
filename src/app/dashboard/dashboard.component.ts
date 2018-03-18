import { Component, OnInit, TemplateRef } from '@angular/core';

import { User, Post } from '../_models/index';
import { UserService, PostService } from '../_services/index';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    post_model: any = {
      date: new Date().toISOString().substr(0, 16).replace('T', ', ')
    };
    posts;
    modalRef: BsModalRef;
    filter: string = '';
    constructor(private userService: UserService,
                private modalService: BsModalService) { 
                  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
                }

    openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template);
    }

    filterPost(filter) {
      this.userService.filterPost(filter).subscribe(
        data => {
          if (filter.length > 0) {
            this.posts = data;
          } else {
            this.userService.getPost().subscribe(
              data => {
                  this.posts = data;
              }
            )
          }
        },
        err => {
          this.userService.getPost().subscribe(
            data => {
                this.posts = data;
            }
          )
        }
      );
    }

    lengthText(content: string) {
      console.log(content);
      if (content.length <= 250) {
        return ''
      } else {
        console.log('content');
        this.post_model.content.substr(0, 250);
      }
    }

    newPost() {
      this.userService.newPost(this.post_model)
          .subscribe(
              data => {
                  this.userService.getPost().subscribe(
                      data => {
                          this.posts = data;
                          this.modalRef.hide();
                      }
                  )
              }
          )
    }

    ngOnInit() {
        this.userService.getPost().subscribe(
          data => {
            this.posts = data;
          }
        );
    }
}