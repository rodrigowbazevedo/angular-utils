import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ValidadeDirective } from './directives/validate.directive';

const components = [
    ValidadeDirective
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: components,
  exports: components,
})
export class FormUtilsModule { }
