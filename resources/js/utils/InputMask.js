
//import * as React from 'react';

export function InputMask(event, key) {

    const field_name = event.target.name;

    if (key != "Backspace") {

        if (field_name == "anac_license") {

            //console.log(event.currentTarget.value.length)

        } else if (field_name == "cnpj") {

            if (event.currentTarget.value.length == 2 || event.currentTarget.value.length == 6) {

                event.currentTarget.value = `${event.currentTarget.value}.`;

            } else if (event.currentTarget.value.length == 10) {

                event.currentTarget.value = event.currentTarget.value + "/";

            } else if (event.currentTarget.value.length == 15) {

                event.currentTarget.value = event.currentTarget.value + "-";

            }

        } else if (field_name == "cpf") {

            if (event.currentTarget.value.length == 3 || event.currentTarget.value.length == 7) {

                event.currentTarget.value = `${event.currentTarget.value}.`;

            } else if (event.currentTarget.value.length == 11) {

                event.currentTarget.value = event.currentTarget.value + "-";

            }

        } else if (field_name == "telephone") {

            if (event.currentTarget.value.length == 1) {

                event.currentTarget.value = `(${event.currentTarget.value}`;

            } else if (event.currentTarget.value.length == 3) {

                event.currentTarget.value = event.currentTarget.value + ")";

            } else if (event.currentTarget.value.length == 9) {

                event.currentTarget.value = event.currentTarget.value + "-";
            }

        } else if (field_name == "cep") {

            if (event.currentTarget.value.length == 5) {

                event.currentTarget.value = event.currentTarget.value + "-";

            }
        }
    }
}