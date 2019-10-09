import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

import { NgrxI18nService } from '../ngrx-i18n.service';
import { defaultNamespace } from '../ngrx-i18n.model';


@Pipe({ name: 'i18n' })
export class I18nPipe implements PipeTransform  {

    constructor(private i18nService: NgrxI18nService) { }

    transform(key: string, params: { [k: string]: string | number } = {}, namespace = defaultNamespace ): Observable<string> {

        return this.i18nService.selectTranslation(key, params, namespace);
    }
}
