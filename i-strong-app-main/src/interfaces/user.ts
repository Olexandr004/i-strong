type Moods = 'sad' | 'angry' | 'normal' | 'happy'

export interface IMoodTrack {
  mood: Moods
}

export interface IMoodStat {
  start_date: string
  end_date: string
}

export interface IPinCodeData {
  dairy_password: string
}

export interface IPasswordData {
  new_password: string
  confirmPassword: string
}

export interface IPhoneData {
  phone_number: string
}
