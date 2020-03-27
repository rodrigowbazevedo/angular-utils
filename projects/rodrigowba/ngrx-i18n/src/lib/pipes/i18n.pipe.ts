import { Pipe, PipeTransform, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { NgrxI18nService } from '../ngrx-i18n.service';
import { MODULE_NAMESPACE } from '../tokens';


@Pipe({ name: 'i18n' })
export class I18nPipe implements PipeTransform  {

    constructor(
        private i18nService: NgrxI18nService,
        @Inject(MODULE_NAMESPACE) private namespace: string,
    ) { }

    transform(key: string, params: { [k: string]: string | number } = {}, namespace = this.namespace ): Observable<string> {
        return this.i18nService.selectTranslation(key, params, namespace);
    }
}
