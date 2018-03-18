import { Component, OnInit } from '@angular/core';

import { User, Post } from '../_models/index';
import { UserService, PostService } from '../_services/index';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    post_model: any = {};
    posts: any = [];
    loading = false;

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();

        this.loadPosts();
    }

    deletePost(id: number) {
        this.loading = true;
        this.posts = [];
        this.userService.deletePost(id).subscribe(() => { this.loadPosts(); this.loading = false });
    }

    deleteUser(id: number) {
        this.userService.deleteUser(id).subscribe(() => { this.loadAllUsers() });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }

    private loadPosts() {
        this.userService.getPost().subscribe(
            data => {
                for (const post in data) {
                    if (data[post].author == this.currentUser.firstName) {
                        this.posts.push(data[post]);
                    }
                }
            }
        );
    }
}