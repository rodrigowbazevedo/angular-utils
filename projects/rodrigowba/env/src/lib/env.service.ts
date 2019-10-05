import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EnvService {
    get<T>(property: string) {
        return (this[property] as T) || null;
    }
}
