import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Comment } from '../models/comment';
import { Configuration } from '../shared/app.configuration';

@Injectable()
export class CommentDataService {

	private actionUrl: string;


	// @Output() foodAdded: EventEmitter<any> = new EventEmitter();
	// @Output() foodDeleted: EventEmitter<any> = new EventEmitter();

	constructor(private _Http: Http, private _configuration: Configuration) {
		this.actionUrl = _configuration.apiUrl + 'comment/';
	}

	createAuthorizationHeader(headers: Headers) {
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		headers.append('Authorization', 'Basic ' + this._configuration.authentic);
	}

	public getAll() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this._Http.get(this.actionUrl + 'index', { headers: headers, withCredentials: true })
			.map(res => res.json())
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		return Observable.throw(error.json().error || 'Server error');
	}


	// private prepareOptions = (options: RequestOptionsArgs): RequestOptionsArgs => {
	// 	options = options || {};

	// 	if (!options.headers) {
	// 		options.headers = new Headers();
	// 	}

	// 	options.headers.append('Content-Type', 'application/json');

	// 	return options;
	// }
}
