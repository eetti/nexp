import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private messageSource = new BehaviorSubject(null);
    currentMessage = this.messageSource.asObservable();

    constructor() { }

    sendMessage(message: any) {
        this.messageSource.next(message)
    }

}