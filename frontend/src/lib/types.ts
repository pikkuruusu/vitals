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
  noted_at: string
  created_at: string
}
