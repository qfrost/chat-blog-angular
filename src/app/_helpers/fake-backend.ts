import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

        let post: any[] = JSON.parse(localStorage.getItem('post')) || [
            {name: "Best developer", content: "Best developer is Andrew Stepaniuk :)", author: "Andrew", date: "2018-03-18, 20:58", id: 1},
            {name: "True story", content: "True story", author: "Arthur", date: "2018-03-18, 21:58", id: 2},
            {name: "Column", content: "Text text lorum", author: "Inna", date: "2018-03-18, 22:01", id: 3},
            {name: "Money", content: "Money today is important", author: "Sofia", date: "2018-03-18, 22:54", id: 4},
        ];

        return Observable.of(null).mergeMap(() => {

            // authenticate
            if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
                let filteredUsers = users.filter(user => {
                    return user.username === request.body.username && user.password === request.body.password;
                });

                if (filteredUsers.length) {
                    let user = filteredUsers[0];
                    let body = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        about: user.about,
                        token: '2|100344ce|bb11b4d06798d856358b9c1e9413bd4c|1521188889'
                    };

                    return Observable.of(new HttpResponse({ status: 200, body: body }));
                } else {
                    return Observable.throw('Username or password is incorrect');
                }
            }

            // get users
            if (request.url.endsWith('/api/users') && request.method === 'GET') {
                if (request.headers.get('Authorization') === 'Bearer 2|100344ce|bb11b4d06798d856358b9c1e9413bd4c|1521188889') {
                    return Observable.of(new HttpResponse({ status: 200, body: users }));
                } else {
                    return Observable.throw('Unauthorised');
                }
            }

            // get posts
            if (request.url.endsWith('/api/post') && request.method === 'GET') {
                return Observable.of(new HttpResponse({ status: 200, body: post }));
            }

            // get posts by filter
            if (request.url.match(/\/api\/post\/[\wа-я0-1]+$/) && request.method === 'GET') {
                let urlParts = request.url.split('/');
                let filter = urlParts[urlParts.length - 1];
                let matchedPost = [];
                let filterLength = filter.split(' ');
                if (filterLength.length < 2) {
                    for (const key in post) {
                        let matchWord = post[key].name.split(' ');
                        for (const word in matchWord) {
                            if (matchWord[word] == filter) {
                                matchedPost.push(post[key]);
                            }
                        }
                    }
                } else {
                    matchedPost.push(post.filter(post => { return post.name === filter; }));
                }
                let posts = (matchedPost.length > 0) ? matchedPost : null;

                return Observable.of(new HttpResponse({ status: 200, body: posts }));
            }

            // create user
            if (request.url.match('/api/post') && request.method === 'POST') {
                let newPost = request.body;

                newPost.id = post.length + 1;
                post.push(newPost);
                localStorage.setItem('post', JSON.stringify(post));

                return Observable.of(new HttpResponse({ status: 200 }));
            }

            // get user by id
            if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'GET') {
                if (request.headers.get('Authorization') === 'Bearer 2|100344ce|bb11b4d06798d856358b9c1e9413bd4c|1521188889') {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedUsers = users.filter(user => { return user.id === id; });
                    let user = matchedUsers.length ? matchedUsers[0] : null;

                    return Observable.of(new HttpResponse({ status: 200, body: user }));
                } else {
                    return Observable.throw('Unauthorised');
                }
            }

            // create user
            if (request.url.endsWith('/api/users') && request.method === 'POST') {
                let newUser = request.body;

                let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                if (duplicateUser) {
                    return Observable.throw('Username "' + newUser.username + '" is already taken');
                }

                newUser.id = users.length + 1;
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                return Observable.of(new HttpResponse({ status: 200 }));
            }

            // delete user
            if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'DELETE') {
                if (request.headers.get('Authorization') === 'Bearer 2|100344ce|bb11b4d06798d856358b9c1e9413bd4c|1521188889') {
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.id === id) {
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }
                    return Observable.of(new HttpResponse({ status: 200 }));
                } else {
                    return Observable.throw('Unauthorised');
                }
            }

            // delete post
            if (request.url.match(/\/api\/post\/\d+$/) && request.method === 'DELETE') {
                if (request.headers.get('Authorization') === 'Bearer 2|100344ce|bb11b4d06798d856358b9c1e9413bd4c|1521188889') {
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < post.length; i++) {
                        let postId = post[i];
                        if (postId.id === id) {
                            post.splice(i, 1);
                            localStorage.setItem('post', JSON.stringify(post));
                            break;
                        }
                    }
                    return Observable.of(new HttpResponse({ status: 200, body: post }));
                } else {
                    return Observable.throw('Unauthorised');
                }
            }
            return next.handle(request);
            
        })
        .materialize()
        .delay(500)
        .dematerialize();
    }
}

export let fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};