import { Directive, Renderer2, ElementRef, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ObserverComponent } from '@rodrigowba/observer-component';

@Directive({
// tslint:disable-next-line: directive-selector
    selector: '[validate]'
})
export class ValidadeDirective extends ObserverComponent implements OnInit {
    @Input('validate') form: FormControl;
    @Input() validClass = false;
    @Input() checkDirty = true;

    constructor(
        private renderer: Renderer2,
        private hostElement: ElementRef
    ) {
        super();
    }

    ngOnInit() {
        this.observe(
            this.form.statusChanges
        ).subscribe(() => {
            if (this.isInvalid) {
                this.renderer.addClass(this.hostElement.nativeElement, 'is-invalid');
                if (this.validClass) {
                    this.renderer.removeClass(this.hostElement.nativeElement, 'is-valid');
                }

                return;
            }

            this.renderer.removeClass(this.hostElement.nativeElement, 'is-invalid');

            if (this.validClass) {
                this.renderer.addClass(this.hostElement.nativeElement, 'is-valid');
            }
        });
    }

    get isInvalid(): boolean {
        if (this.form.valid) {
            return false;
        }

        if (this.checkDirty && (!this.form.dirty || !this.form.touched)) {
            return false;
        }

        return this.form.invalid;
    }
}
