export interface ISignUp {
  username: string
  phone_number: string
  password: string
}

export interface ISignIn {
  phone_number: string
  password: string
}

export interface IVerifyCode {
  phone_number: string
  confirmation_code: string
}

export interface IPasswordReset {
  phone_number: string
}

export interface INewPassword {
  phone_number: string
  new_password: string
}
