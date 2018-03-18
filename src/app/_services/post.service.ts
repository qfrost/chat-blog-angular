import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from '../_models/index';

@Injectable()
export class PostService {
    constructor(private http: HttpClient) { }

    getPosts() {
        return this.http.get<Post[]>('/api/post');
    }
}