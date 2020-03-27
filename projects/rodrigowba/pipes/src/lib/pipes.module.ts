import { NgModule } from '@angular/core';

import { FnPipe } from './pipes/fn.pipe';
import { IsInPipe } from './pipes/is-in.pipe';
import { ToDatePipe } from './pipes/to-date.pipe';

const pipes = [
    FnPipe,
    IsInPipe,
    ToDatePipe
];

@NgModule({
    declarations: pipes,
    exports: pipes
})
export class PipesModule {}
