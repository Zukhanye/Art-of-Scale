import { useEffect, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { SignOutButton } from './lib/auth'
import {
  DATA_KINDS, PARTNER_TYPES, STAGES, addPartner, listPartners,
  type DataKind, type Partner, type PartnerType, type Stage,
} from './lib/partners'

function AddPartnerForm({ onAdded }: { onAdded: (p: Partner) => void }) {
  const [name, setName] = useState('')
  const [type, setType] = useState<PartnerType>('Hospital group')
  const [data, setData] = useState<DataKind[]>([])
  const [sites, setSites] = useState('')
  const [stage, setStage] = useState<Stage>('Identified')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  function toggle(kind: DataKind) {
    setData((d) => (d.includes(kind) ? d.filter((k) => k !== kind) : [...d, kind]))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) { setMessage('Please enter the organisation name.'); return }
    const siteCount = sites.trim() === '' ? null : Number(sites)
    if (siteCount !== null && (!Number.isInteger(siteCount) || siteCount < 0 || siteCount > 100000)) {
      setMessage('Number of sites must be a whole number from 0 to 100000.'); return
    }
    setBusy(true)
    setMessage('')
    const result = await addPartner({ name: trimmed, partner_type: type, data_offered: data, sites: siteCount, stage })
    setBusy(false)
    if (!result.ok) { setMessage(result.message); return }
    onAdded(result.value)
    setName(''); setData([]); setSites(''); setStage('Identified'); setType('Hospital group')
    setMessage(`Added ${result.value.name}.`)
  }

  return (
    <form className="card add" onSubmit={submit} noValidate>
      <h2>Add a data partner</h2>
      <label>Organisation name <small>(organisations only, no people's names)</small>
        <input value={name} maxLength={120} onChange={(e) => setName(e.target.value)} placeholder="Example Hospital Group" />
      </label>
      <div className="row">
        <label>Type
          <select value={type} onChange={(e) => setType(e.target.value as PartnerType)}>
            {PARTNER_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label>Number of sites
          <input type="number" min={0} max={100000} step={1} value={sites} onChange={(e) => setSites(e.target.value)} placeholder="40" />
        </label>
        <label>Stage
          <select value={stage} onChange={(e) => setStage(e.target.value as Stage)}>
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <fieldset>
        <legend>Data it could share</legend>
        {DATA_KINDS.map((k) => (
          <label key={k} className="check">
            <input type="checkbox" checked={data.includes(k)} onChange={() => toggle(k)} /> {k}
          </label>
        ))}
      </fieldset>
      <button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Add partner'}</button>
      {message ? <p role="alert">{message}</p> : null}
    </form>
  )
}

export default function Partners({ session }: { session: Session }) {
  const [partners, setPartners] = useState<Partner[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    listPartners().then((r) => {
      if (r.ok) setPartners(r.value)
      else { setError(r.message); setPartners([]) }
    })
  }, [])

  return (
    <main className="wrap">
      <header className="top">
        <div>
          <p className="kicker">GEO-Q</p>
          <h1>Data partners</h1>
        </div>
        <p className="who"><small>{session.user.email}</small><br /><SignOutButton /></p>
      </header>
      <AddPartnerForm onAdded={(p) => setPartners((list) => [p, ...(list ?? [])])} />
      {error ? <p role="alert" className="error">{error}</p> : null}
      {partners === null ? <p>Loading your partners…</p> : partners.length === 0 ? (
        <p className="empty">No partners yet. Add your first data partner above.</p>
      ) : (
        <ul className="partners">
          {partners.map((p) => (
            <li key={p.id} className="card">
              <b>{p.name}</b> <span className="stage">{p.stage}</span>
              <br /><small>{p.partner_type}{p.sites !== null ? ` · ${p.sites} sites` : ''}{p.data_offered.length ? ` · ${p.data_offered.join(', ')}` : ''}</small>
            </li>
          ))}
        </ul>
      )}
      <p className="foot">Organisation details only. No patient data and no people's contact details. Factory status: add <code>?status</code> to this page's address.</p>
    </main>
  )
}
