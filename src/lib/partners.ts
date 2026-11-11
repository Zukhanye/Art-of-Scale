import { supabase } from './supabase'

// Contract 001: organisation details only. The lists match the checks in supabase/migrations/001_init.sql.
export const PARTNER_TYPES = ['Hospital group', 'Pharmacy chain', 'Pathology lab', 'Clinic network', 'Other'] as const
export const DATA_KINDS = ['Dispensing records', 'Claims and billing', 'Lab results', 'Visit and attendance', 'Other'] as const
export const STAGES = ['Identified', 'In talks', 'Agreement drafting', 'Signed', 'Data flowing', 'Lost'] as const

export type PartnerType = (typeof PARTNER_TYPES)[number]
export type DataKind = (typeof DATA_KINDS)[number]
export type Stage = (typeof STAGES)[number]

export interface Partner {
  id: string
  name: string
  partner_type: PartnerType
  data_offered: DataKind[]
  sites: number | null
  stage: Stage
  next_follow_up: string | null
  created_at: string
}

export interface NewPartner {
  name: string
  partner_type: PartnerType
  data_offered: DataKind[]
  sites: number | null
  stage: Stage
}

const COLUMNS = 'id, name, partner_type, data_offered, sites, stage, next_follow_up, created_at'

// Turns a database error into one plain sentence for the user. The full error goes to the console.
function explain(error: { code?: string; message: string }): string {
  if (error.code === 'PGRST205' || error.code === '42P01') return 'The partners table is not set up yet. Ask your Coach for the database setup step.'
  if (error.code === '42501') return 'You are not allowed to do that. Try signing out and in again.'
  return `The database said: ${error.message}`
}

export type Result<T> = { ok: true; value: T } | { ok: false; message: string }

export async function listPartners(): Promise<Result<Partner[]>> {
  if (!supabase) return { ok: false, message: 'The database is not connected yet.' }
  const { data, error } = await supabase.from('partners').select(COLUMNS).order('created_at', { ascending: false })
  if (error) {
    console.error('Could not load partners:', error)
    return { ok: false, message: explain(error) }
  }
  return { ok: true, value: data as Partner[] }
}

export async function addPartner(p: NewPartner): Promise<Result<Partner>> {
  if (!supabase) return { ok: false, message: 'The database is not connected yet.' }
  const { data, error } = await supabase.from('partners').insert(p).select(COLUMNS).single()
  if (error) {
    console.error('Could not add partner:', error)
    return { ok: false, message: explain(error) }
  }
  return { ok: true, value: data as Partner }
}
