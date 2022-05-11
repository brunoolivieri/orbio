// ==== FUNÇÃO PARA VALIDAR OS DADOS DOS FORMULÁRIOS ==== //

/*

- A lógica dessa função é checar se existem erros - as validações retornam true quando for encontrado um erro
- A função recebe o valor em si, um valor mínimo de caracteres (opcional), um valor máximo (opcional), um padrão Regex (opcional), e o tipo do padrão Regex (opcional)
- O tipo do padrão Regex verifica se é um padrão para um campo de "email", "nome", "senha", entre outros
- Os parâmetros opcionais por padrão são "null" e assim permanecem se não receberem um valor

- A primeira validação é se o fator é diferente de NULL
- Nesse caso, else if() não pode ser utilizado, e sim apenas if() em sequência
- else if() é executado apenas se o anterior não for verdadeiro
- Se um fator X for diferente de NULL, e não tiver erro, os posteriores a ele não serão testados

*/

export function FormValidation(value, minLength = null, maxLength = null, patternRegex = null, regexSpecificField = null) {

    // O primeiro fator que estiver errado é retornado, e utilizado na mensagem de erro do input
    // O retorno, na presença de um erro, é um objeto com o atributo "error" e "message" 

    // Verificar se é nulo
    if (nullCheck(value)) {


        return { error: true, message: "O campo deve ser preenchido" }

    }

    // Validar o padrão do valor?
    if (patternRegex != null) {

        // Inicialização da validação
        if (patternCheck(value, patternRegex)) {

            // Criar uma mensagem de erro específica para o campo?
            if (regexSpecificField != null) {

                if (regexSpecificField === "PASSWORD") {

                    return { error: true, message: "A senha deve ter no mínimo oito caracteres, uma letra minúscula, uma maiúscula e um número" }

                } else {

                    return { error: true, message: `${regexSpecificField.toLowerCase()} inválido(a)` }

                }

            }

        }

    }

    // Validar o número mínimo de caracteres?
    if (minLength != null) {

        // Inicialização da validação
        if (minLengthCheck(value, minLength)) {

            return { error: true, message: `Deve ter no mínimo ${minLength} caracteres.` }

        }


    }

    // Validar o número máximo de caracteres?
    if (maxLength != null) {

        // Inicialização da validação
        if (maxLengthCheck(value, maxLength)) {

            return { error: true, message: `Deve ter no máximo ${maxLength} caracteres.` }

        }

    }

    // Se todos os fatores do valor estiverem corretos
    return { error: false, message: "" }

}

// O valor é igual a zero? Se sim, é um erro
function nullCheck(value) {

    return value.length == 0 ? true : false;

}

// O valor tem menos caracteres do que o mínimo? Se sim, é um erro
function minLengthCheck(value, minLength) {

    return value.length < minLength ? true : false;

}

// O valor tem mais caracteres do que o máximo? Se sim, é um erro
function maxLengthCheck(value, maxLength) {

    return value.length > maxLength ? true : false;

}

// O valor é compátivel com o padrão Regex? Se não, é um erro
function patternCheck(value, patternRegex) {

    return value.match(patternRegex) ? false : true;

}