import React, { useState } from 'react'
import * as XLSX from 'xlsx'

// Use Vite proxy in development: '/aqi' -> https://aqi.neela.nespakprogresscenter.com/api/aqi
// For production, ensure your hosting adds a similar reverse proxy or switch to the absolute URL.
const API_URL = '/aqi'

// Shallow flattener to keep sheet readable. Nested objects become JSON strings.
const normalizeRows = (rows) => {
  if (!Array.isArray(rows)) return []
  return rows.map((row) => {
    const out = {}
    Object.entries(row || {}).forEach(([k, v]) => {
      if (v === null || v === undefined) {
        out[k] = ''
      } else if (Array.isArray(v)) {
        out[k] = JSON.stringify(v)
      } else if (typeof v === 'object') {
        out[k] = JSON.stringify(v)
      } else {
        out[k] = v
      }
    })
    return out
  })
}

const AqiExcel = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleExport = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(API_URL, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`)
      }
      const text = await res.text()
      // Some backends may return HTML on error — guard before JSON.parse
      if (text.trim().startsWith('<')) throw new Error('Server returned HTML instead of JSON')
      const json = JSON.parse(text)
      const data = Array.isArray(json) ? json : (json?.data || json?.results || json?.items || [])
      if (!Array.isArray(data) || data.length === 0) throw new Error('No data returned from API')

      const rows = normalizeRows(data)
      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'AQI')

      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
      const fileName = `AQI-export-${stamp}.xlsx`
      XLSX.writeFile(wb, fileName)
    } catch (e) {
      // Common case: CORS or network errors show up as TypeError in browsers
      const msg = e?.message || 'Failed to export'
      const hint = msg.includes('Failed to fetch') || e?.name === 'TypeError'
        ? ' (Possible CORS or network issue)'
        : ''
      setError(`${msg}${hint}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{
        maxWidth: 720,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 8px 30px rgba(8,12,20,0.06)',
        padding: 16,
      }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>AQI Export</h2>
        <p style={{ color: '#6b7280', marginTop: 6 }}>Fetch all records from the AQI API and download as Excel.</p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
          <button
            onClick={handleExport}
            disabled={loading}
            style={{
              background: '#0f4c81',
              color: '#fff',
              border: 'none',
              padding: '10px 14px',
              borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 18px rgba(15,76,129,0.25)'
            }}
          >
            {loading ? 'Exporting…' : 'Export to Excel'}
          </button>
          {error && <span style={{ color: '#b91c1c' }}>{error}</span>}
        </div>
        <div style={{ marginTop: 10 }}>
          <small style={{ color: '#6b7280' }}>Source: {API_URL}</small>
        </div>
      </div>
    </div>
  )
}





export default AqiExcel
