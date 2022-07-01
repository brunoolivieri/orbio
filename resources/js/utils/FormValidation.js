export function FormValidation(value, minLength = null, maxLength = null, regex = null, field_name = null) {

    if (nullCheck(value)) {

        return { error: true, message: "O campo deve ser preenchido" }

    }

    if (regex != null) {

        if (regexCheck(value, regex)) {

            return { error: true, message: `${field_name.toLowerCase()} inválido(a)` }

        }

    }

    if (minLength != null) {

        if (minLengthCheck(value, minLength)) {

            return { error: true, message: `Deve ter no mínimo ${minLength} caracteres.` }

        }


    }

    if (maxLength != null) {

        if (maxLengthCheck(value, maxLength)) {

            return { error: true, message: `Deve ter no máximo ${maxLength} caracteres.` }

        }

    }

    return { error: false, message: "" }

}

function nullCheck(value) {

    return value.length == 0;

}

function minLengthCheck(value, minLength) {

    return value.length < minLength;

}

function maxLengthCheck(value, maxLength) {

    return value.length > maxLength;

}

function regexCheck(value, regex) {

    return !value.match(regex);

}