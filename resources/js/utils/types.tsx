// Generic Interface for FieldError Object
// Its used for controll errors in form inputs
export interface FieldError {
    [key: string]: boolean
}

// Generic Interface for FieldErrorMessage Object
// Its used for controll error messages in form inputs
export interface FieldErrorMessage {
    [key: string]: string
}

// Generic Interface for FormData Object
// Its used for controll form values
export interface FormData {
    [key: string]: string | null
}

// Generic Interface for RequestStatus Object
// Used to controll ui effects before and after request 
export interface RequestStatus {
    status: boolean,
    error: boolean,
    message: string
}

// Generic Interface for InputValidation Object
// Used for get client and server input validation
export interface InputValidation {
    error: boolean,
    message: string
}

// Generic Interface for ServerValidationErrors Object
// Used for handle server validation errors and fill the InputValidation object
export interface ServerValidationErrors {
    [key: string]: InputValidation
}
