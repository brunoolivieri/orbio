export const FormValidation = (value, minLength = null, maxLength = null, regex = null, field_name = null) => {

    if (emptyCheck(value)) {
        return { error: true, message: "O campo deve ser informado" }
    }

    if (regex != null) {

        if (regexCheck(value, regex)) {
            return { error: true, message: `${field_name} inválido(a)` }
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

function emptyCheck(value) {
    return value == null || value.length === 0;
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