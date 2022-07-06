import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fn', pure: true })
export class FnPipe implements PipeTransform {

  transform(
    templateValue: any,
// tslint:disable-next-line: ban-types
    fnReference: Function,
    ...fnArguments: any[]
  ): any {
    fnArguments.unshift(templateValue);

    return fnReference.apply(null, fnArguments);
  }
}
