import { Pipe, PipeTransform } from '@angular/core';
import { parseISO } from 'date-fns';

@Pipe({ name: 'toDate', pure: true })
export class ToDatePipe implements PipeTransform  {

    transform(date: string | null): Date | undefined {
        if (date === null || date === '') {
            return undefined;
        }

        return parseISO(date);
    }
}
