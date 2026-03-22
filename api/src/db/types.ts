export interface ActivityLevel {
  id: string
  label: string
  tdee_multiplier: number
  sort_order: number
}

export interface UserProfile {
  id: string
  height_cm: number | null
  birth_date: Date | null
  default_activity_level: string | null
  created_at: Date
  updated_at: Date
}

export interface Metric {
  id: string
  name: string
  unit: string | null
}

export interface Entry {
  id: string
  user_id: string
  metric_id: string
  value: number
  comment: string | null
  noted_at: Date
  created_at: Date
}

export interface Goal {
  id: string
  user_id: string
  metric_id: string
  target_value: number
  target_date: Date
  created_at: Date
}
