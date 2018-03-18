import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, Post } from '../_models/index';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>('/api/users');
    }

    getById(id: number) {
        return this.http.get('/api/users/' + id);
    }

    create(user: User) {
        return this.http.post('/api/users', user);
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user);
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id);
    }
    
    getPost() {
        return this.http.get<Post[]>('/api/post');
    }

    newPost(post: Post) {
        return this.http.post('/api/post', post);
    }

    filterPost(filter: string) {
        return this.http.get('/api/post/' + filter);
    }
}