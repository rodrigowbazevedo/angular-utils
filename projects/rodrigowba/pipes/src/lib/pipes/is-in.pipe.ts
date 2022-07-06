import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isIn', pure: true })
export class IsInPipe implements PipeTransform {
  transform(value: any, array: any[]): boolean {
    if (!Array.isArray(array)) {
      return false;
    }

    return array.indexOf(value) !== -1;
  }
}
