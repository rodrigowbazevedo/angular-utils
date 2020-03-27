import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment';

const moment = _moment;

@Pipe({ name: 'toDate', pure: true })
export class ToDatePipe implements PipeTransform  {

    transform(date: string | null): Date | undefined {
        if (date === null || date === '') {
            return undefined;
        }

        return moment(date).toDate();
    }
}
