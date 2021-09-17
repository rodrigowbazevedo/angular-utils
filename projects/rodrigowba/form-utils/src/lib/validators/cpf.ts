import { AbstractControl } from '@angular/forms';

const error = {
    cpfvalidator: 'CPF inválido'
};

export const validateCpf = (control: AbstractControl) => {
    const value = control.value;

    if (value === '' || value === null || value === undefined) {
        return null;
    }

    const cpf: string = value.replace(/\D/g, '');

    if (cpf.length !== 11) {
        return error;
    }

    if (cpf === '') {
        return error;
    }

    if (/^(.)\1+$/.test(cpf)) {
        return false;
    }

    let add = 0;

    for (let i = 0; i < 9; i++) {
        add += (+cpf.charAt(i)) * (10 - i);
    }

    let rev = 11 - (add % 11);

    if (rev === 10 || rev === 11) {
        rev = 0;
    }

    if (rev !== (+cpf.charAt(9))) {
        return error;
    }

    add = 0;
    for (let i = 0; i < 10; i++) {
        add += (+cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (add % 11);

    if (rev === 10 || rev === 11) {
        rev = 0;
    }

    if (rev !== (+cpf.charAt(10))) {
        return error;
    }

    return null;
};
