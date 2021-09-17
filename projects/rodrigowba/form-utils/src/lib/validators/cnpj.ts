import { AbstractControl } from '@angular/forms';

const error = {
    cnpjvalidator: 'CNPJ inválido'
};

export const validateCnpj = (control: AbstractControl) => {
    const value = control.value;

    if (value === '' || value === null || value === undefined) {
        return null;
    }

    const cnpj: string = value.replace(/\D/g, '');

    if (cnpj.length !== 14) {
        return error;
    }

    if (cnpj === '') {
        return error;
    }

    if (/^(.)\1+$/.test(cnpj)) {
        return false;
    }

    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    const digits = cnpj.substring(length);

    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
        sum += (+numbers.charAt(length - i)) * pos--;

        if (pos < 2) {
            pos = 9;
        }
    }

    let resultado = sum % 11 < 2 ? 0 : 11 - sum % 11;

    if (resultado !== (+digits.charAt(0))) {
        return error;
    }

    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;

    for (let i = length; i >= 1; i--) {
        sum += (+numbers.charAt(length - i)) * pos--;

        if (pos < 2) {
            pos = 9;
        }
    }

    resultado = sum % 11 < 2 ? 0 : 11 - sum % 11;

    if (resultado !== (+digits.charAt(1))) {
        return error;
    }

    return null;
};
