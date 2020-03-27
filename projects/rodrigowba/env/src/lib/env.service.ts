import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EnvService {
    get<T>(property: string, fallback: T = null) {
        return (this[property] as T) || fallback;
    }
}
