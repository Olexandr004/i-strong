export interface IChallenge {
  id: number
  title: string
  duration: number
  points: number
  bonus: number
  is_completed: boolean
  track_diary: boolean
  type: string
  current_subtask?: ISubtask
}

export interface ISubtask {
  id: number
  day_number: number
  is_completed: boolean
  points: number
  description: string
}

export interface IChallengeData {
  challenge_id: number
  subtask_id?: number
  note?: string
}

export type ChallengeType = 'new' | 'in_progress' | 'completed'
