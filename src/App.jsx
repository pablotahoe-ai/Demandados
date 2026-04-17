import { useState, useEffect, useRef, useCallback } from 'react'
import { CASOS, MULT, START_MONEY, TRANSFER_MAX, TOTAL_CASES } from './data.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const fmt = n => '$\u00A0' + Math.abs(Math.round(n)).toLocaleString('es-AR')

function calcStacks(gc, ch) {
  let cs = gc.base
  let ds = Math.round(gc.base * 0.55)
  const gv = gc.gravedad.find(x => x.id === ch.gravedad); if (gv) cs += gv.v * MULT.gravedad
  ;(ch.prueba || []).forEach(id => { const e = gc.prueba.find(x => x.id === id); if (e) cs += e.v * MULT.prueba })
  const fv = gc.forma.find(x => x.id === ch.forma); if (fv) cs += fv.v * MULT.forma
  const rv = gc.respuesta.find(x => x.id === ch.respuesta); if (rv) ds += rv.v * MULT.respuesta
  const av = gc.argumento.find(x => x.id === ch.argumento); if (av) ds += av.v * MULT.argumento
  const ev = gc.escalada.find(x => x.id === ch.escalada); if (ev) ds += ev.v * MULT.escalada
  if (ch.timeout) ds = Math.round(ds * 0.15)
  return { cs: Math.max(0, cs), ds: Math.max(0, ds) }
}

function calcTransfer(cs, ds) {
  const total = cs + ds; if (total === 0) return 2000
  const diff = Math.abs(cs - ds)
  return Math.min(TRANSFER_MAX, Math.max(1500, Math.round((diff / total) * TRANSFER_MAX * 2)))
}

const pKey = n => 'jd3_' + n.toLowerCase().replace(/\s+/g, '_')
const emptyP = n => ({ name: n, money: 0, wins: 0, losses: 0, streak: 0, best: 0 })

function loadP(name) {
  try { const raw = localStorage.getItem(pKey(name)); if (raw) return JSON.parse(raw) } catch {}
  return emptyP(name)
}
function saveP(p) {
  try { localStorage.setItem(pKey(p.name), JSON.stringify(p)) } catch {}
}

/* ── ATOMS ── */
function Card({ children, st = {} }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg,#e8cc90,#d4a860)',
      border: '1px solid #a07030', borderRadius: 6, padding: 16,
      boxShadow: '0 4px 20px rgba(0,0,0,.5)', ...st
    }}>{children}</div>
  )
}

function BigBtn({ children, onClick, disabled, col = '#cc1a00' }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? '#2a1a08' : col, color: '#fff', border: 'none',
      padding: '13px 20px', borderRadius: 4, width: '100%',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 2,
      opacity: disabled ? 0.5 : 1, transition: 'all .15s',
    }}>{children}</button>
  )
}

function Stamp({ children, col = '#cc1a00', angle = -2 }) {
  return (
    <span style={{
      fontFamily: "'Bebas Neue', sans-serif", border: `2px solid ${col}`,
      color: col, padding: '1px 8px', borderRadius: 3, letterSpacing: 2,
      fontSize: 12, display: 'inline-block', transform: `rotate(${angle}deg)`,
    }}>{children}</span>
  )
}

/* ── OPCIÓN CON REVEAL ── */
function OptReveal({ o, field, pickedId, onPick, isRevealing }) {
  const isSel = pickedId === o.id
  const val = o.v * MULT[field]
  const pos = val > 0; const neg = val < 0
  return (
    <button onClick={() => !pickedId && onPick(o.id)} style={{
      background: isRevealing
        ? (isSel ? (pos ? 'rgba(10,50,5,0.95)' : neg ? 'rgba(80,5,5,0.95)' : 'rgba(30,30,30,0.9)')
                 : (pos ? 'rgba(10,50,5,0.5)' : neg ? 'rgba(80,5,5,0.45)' : 'rgba(30,30,30,0.45)'))
        : (isSel ? '#4a2000' : '#c49040'),
      border: `2px solid ${isRevealing ? (pos ? '#4a9a20' : neg ? '#cc2200' : '#555') : (isSel ? '#e07700' : '#a07030')}`,
      borderRadius: 6, padding: '11px 10px', textAlign: 'left', width: '100%',
      cursor: pickedId ? 'default' : 'pointer',
      display: 'flex', gap: 10, alignItems: 'center', transition: 'all .35s',
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{o.emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 13, fontWeight: 'bold',
          color: isRevealing ? (pos ? '#b0ef70' : neg ? '#ff8080' : '#aaa') : (isSel ? '#f5c060' : '#3a2000'),
        }}>{o.lbl}</div>
        {o.desc && !isRevealing && (
          <div style={{ fontSize: 11, color: isSel ? '#d4a060' : '#5a3a10', marginTop: 2, lineHeight: 1.3 }}>{o.desc}</div>
        )}
      </div>
      {isRevealing && (
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, flexShrink: 0,
          color: pos ? '#b0ef70' : neg ? '#ff8080' : '#888', minWidth: 84, textAlign: 'right',
        }}>{val > 0 ? '+' : ''}{fmt(val)}</div>
      )}
      {!isRevealing && isSel && (
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e07700', flexShrink: 0 }} />
      )}
    </button>
  )
}

/* ── FASE SINGLE-CHOICE
   KEY FIX: cada instancia es fresh porque el padre le pasa key={fase}
── */
function FaseScreen({ title, sub, hint, gc, field, onPick, timerSeconds, onMountTimer }) {
  const [pickedId, setPickedId] = useState(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const doneRef = useRef(false)

  const handlePick = useCallback((id) => {
    if (doneRef.current) return
    doneRef.current = true
    setPickedId(id)
    setIsRevealing(true)
    setTimeout(() => onPick(id), 2500)
  }, [onPick])

  // Exponer handlePick al padre para que el timer pueda llamarlo
  useEffect(() => {
    if (onMountTimer) onMountTimer(handlePick, doneRef)
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#d4a030', letterSpacing: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#8a7a60', marginTop: 2 }}>{sub}</div>
      </div>
      {hint && !isRevealing && (
        <div style={{ background: 'rgba(200,160,60,.12)', border: '1px solid #8a6030', borderRadius: 4, padding: '8px 12px', fontSize: 12, color: '#c49040', marginBottom: 14, fontStyle: 'italic' }}>{hint}</div>
      )}
      {isRevealing && (
        <div style={{ background: 'rgba(200,160,60,.12)', border: '1px solid #d4a030', borderRadius: 4, padding: '8px 12px', fontSize: 12, color: '#d4a030', marginBottom: 14, textAlign: 'center', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 }}>
          ⚖️ VALOR DE CADA OPCIÓN ↓
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {gc[field].map(o => (
          <OptReveal key={o.id} o={o} field={field} pickedId={pickedId} onPick={handlePick} isRevealing={isRevealing} />
        ))}
      </div>
    </div>
  )
}

/* ── PRUEBA MULTI-SELECT ── */
function PruebaScreen({ gc, selected, onToggle, onConfirm }) {
  const [confirmed, setConfirmed] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const doConfirm = () => {
    if (confirmed || selected.length === 0) return
    setConfirmed(true); setIsRevealing(true)
    setTimeout(() => onConfirm(), 2500)
  }
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#d4a030', letterSpacing: 2 }}>🔍 ELEGÍ TUS PRUEBAS</div>
        <div style={{ fontSize: 12, color: '#8a7a60', marginTop: 2 }}>Hasta 3 — elegí las más sólidas</div>
      </div>
      {!isRevealing && <div style={{ background: 'rgba(200,160,60,.12)', border: '1px solid #8a6030', borderRadius: 4, padding: '8px 12px', fontSize: 12, color: '#c49040', marginBottom: 14, fontStyle: 'italic' }}>No todo lo que tenés sirve igual. Pensá bien.</div>}
      {isRevealing && <div style={{ background: 'rgba(200,160,60,.12)', border: '1px solid #d4a030', borderRadius: 4, padding: '8px 12px', fontSize: 12, color: '#d4a030', marginBottom: 14, textAlign: 'center', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 }}>⚖️ VALOR DE CADA PRUEBA ↓</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {gc.prueba.map(o => {
          const isSel = selected.includes(o.id)
          const blocked = !isSel && selected.length >= 3
          const val = o.v * MULT.prueba; const pos = val > 0; const neg = val < 0
          return (
            <button key={o.id} onClick={() => !blocked && !confirmed && onToggle(o.id)} style={{
              background: isRevealing ? (isSel ? (pos ? 'rgba(10,50,5,0.95)' : 'rgba(80,5,5,0.95)') : (pos ? 'rgba(10,50,5,0.5)' : neg ? 'rgba(80,5,5,0.45)' : 'rgba(30,30,30,0.45)')) : (isSel ? '#4a2000' : '#c49040'),
              border: `2px solid ${isRevealing ? (pos ? '#4a9a20' : neg ? '#cc2200' : '#555') : (isSel ? '#e07700' : '#a07030')}`,
              borderRadius: 6, padding: '11px 10px', textAlign: 'left', width: '100%',
              cursor: (blocked || confirmed) ? 'default' : 'pointer', opacity: blocked ? 0.4 : 1,
              display: 'flex', gap: 10, alignItems: 'center', transition: 'all .35s',
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{o.emoji}</span>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 'bold', color: isRevealing ? (pos ? '#b0ef70' : neg ? '#ff8080' : '#aaa') : (isSel ? '#f5c060' : '#3a2000') }}>{o.lbl}</div>
              {isRevealing && <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: pos ? '#b0ef70' : neg ? '#ff8080' : '#888', flexShrink: 0, minWidth: 84, textAlign: 'right' }}>{val > 0 ? '+' : ''}{fmt(val)}</div>}
              {!isRevealing && isSel && <span style={{ color: '#e07700', fontSize: 16, flexShrink: 0 }}>✓</span>}
            </button>
          )
        })}
      </div>
      {!isRevealing && <>
        <div style={{ fontSize: 12, color: '#8a7a60', textAlign: 'center', marginBottom: 12 }}>{selected.length}/3 seleccionadas</div>
        <BigBtn onClick={doConfirm} disabled={selected.length === 0} col="#e07700">CONFIRMAR PRUEBAS →</BigBtn>
      </>}
    </div>
  )
}

/* ── TIMER ── */
function TimerBar({ seconds, onTimeout, runKey }) {
  const [t, setT] = useState(seconds)
  const iv = useRef(null)
  const fired = useRef(false)
  useEffect(() => {
    setT(seconds); fired.current = false
    clearInterval(iv.current)
    iv.current = setInterval(() => {
      setT(p => {
        if (p <= 1) { clearInterval(iv.current); if (!fired.current) { fired.current = true; onTimeout() }; return 0 }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(iv.current)
  }, [runKey])
  const pct = (t / seconds) * 100
  const col = pct > 50 ? '#4a8a20' : pct > 25 ? '#cc7700' : '#cc1a00'
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#8a7a60', letterSpacing: 1 }}>⏱️ TIEMPO PARA RESPONDER</span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: col }}>{t}s</span>
      </div>
      <div style={{ background: '#2a1a08', borderRadius: 3, height: 8, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct + '%', background: col, transition: 'width 1s linear' }} />
      </div>
    </div>
  )
}

/* ── GAME HEADER ── */
function GameHeader({ titulo, idx, total, sc, n1, n2, mon }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ background: '#0f0803', borderRadius: 4, padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, color: '#d4a030', letterSpacing: 2 }}>🏛️ CASO {idx + 1}/{total}</div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#8a7a60' }}>{n1.split(' ')[0].toUpperCase()}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#cc1a00' }}>{sc.p1}</div>
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: '#5a4a30' }}>—</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#8a7a60' }}>{n2.split(' ')[0].toUpperCase()}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#0066cc' }}>{sc.p2}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#cc1a00', fontFamily: "'Bebas Neue', sans-serif", fontSize: 12 }}>{fmt(mon.p1)}</div>
          <div style={{ color: '#0066cc', fontFamily: "'Bebas Neue', sans-serif", fontSize: 12 }}>{fmt(mon.p2)}</div>
        </div>
      </div>
      <div style={{ background: 'rgba(212,160,48,.12)', borderRadius: 4, padding: '6px 12px', borderLeft: '3px solid #d4a030', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>⚖️</span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, color: '#d4a030', letterSpacing: 1 }}>{titulo}</span>
      </div>
    </div>
  )
}

/* ── HANDOFF ── */
function HandoffScreen({ to, onReady }) {
  return (
    <div style={{ textAlign: 'center', paddingTop: 32 }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>📱⚖️</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: '#d4a030', marginBottom: 6 }}>PASÁ EL TELÉFONO A</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#cc1a00', marginBottom: 4 }}>{to}</div>
      <div style={{ fontSize: 13, color: '#8a7a60', marginBottom: 28 }}>debe responder la demanda</div>
      <Card st={{ textAlign: 'left', marginBottom: 20 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: '#3a2800', letterSpacing: 1, marginBottom: 10 }}>🔨 INSTRUCCIONES PARA {to.split(' ')[0].toUpperCase()}</div>
        {['⏱️ Tenés 60 segundos por cada decisión', '💀 Si el tiempo se acaba, perdés la jugada', '🤐 No sabés cómo jugó el otro — confiá en tu instinto', '💡 Al elegir, todas las opciones revelan su valor'].map((t, i) => (
          <div key={i} style={{ fontSize: 13, color: '#3a2000', marginBottom: 6, lineHeight: 1.4 }}>{t}</div>
        ))}
      </Card>
      <BigBtn onClick={onReady} col="#cc1a00">⚡ COMENZAR A RESPONDER LA DEMANDA</BigBtn>
    </div>
  )
}

/* ══════════════════════════════════════
   GAME SCREEN
   BUG FIX: key={fase} en cada FaseScreen fuerza
   unmount/remount completo al cambiar de fase,
   reseteando pickedId e isRevealing desde cero.
══════════════════════════════════════ */
function GameScreen({ p1, p2name, idx, order, demIs, matchSc, matchMon, onResult, total }) {
  const gc = CASOS[order[idx]]
  const demName = demIs === 'p1' ? p1.name : p2name
  const defName = demIs === 'p1' ? p2name : p1.name
  const [fase, setFase] = useState('intro')
  const [ch, setCh] = useState({ gravedad: null, prueba: [], forma: null, respuesta: null, argumento: null, escalada: null, timeout: false })
  const [tk, setTk] = useState(0)

  // Refs para pasar handlePick al timer desde afuera del FaseScreen
  const pickRef = useRef(null)
  const doneRef = useRef(null)

  const advance = (next) => {
    setFase(next)
    if (['respuesta', 'argumento', 'escalada'].includes(next)) setTk(k => k + 1)
  }

  const pick = (field, id, next, isLast = false) => {
    setCh(prev => {
      const nc = { ...prev, [field]: id }
      if (isLast) setTimeout(() => onResult({ ch: nc, gc, demIs }), 2500)
      else setTimeout(() => advance(next), 2500)
      return nc
    })
  }

  // Timeout handler — usa pickRef para llamar al handlePick del FaseScreen activo
  const handleTimeout = (field, next, isLast = false) => {
    if (doneRef.current && doneRef.current.current) return
    const worst = [...gc[field]].sort((a, b) => a.v - b.v)[0].id
    if (pickRef.current) pickRef.current(worst)
    else {
      setCh(prev => {
        const nc = { ...prev, [field]: worst, timeout: isLast ? true : prev.timeout }
        if (isLast) setTimeout(() => onResult({ ch: nc, gc, demIs }), 100)
        else setTimeout(() => advance(next), 100)
        return nc
      })
    }
  }

  const hdr = <GameHeader titulo={gc.titulo} idx={idx} total={total} sc={matchSc} n1={p1.name} n2={p2name} mon={matchMon} />

  if (fase === 'intro') return (
    <div>{hdr}
      <Card st={{ marginBottom: 14, borderTop: '4px solid #cc1a00' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}><Stamp>{gc.cat}</Stamp></div>
        <p style={{ fontSize: 14, color: '#3a2000', lineHeight: 1.6, marginBottom: 14 }}>{gc.desc}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[['⚔️ DEMANDANTE', demName, '#cc1a00'], ['🛡️ DEMANDADO', defName, '#0066cc']].map(([r, n, c]) => (
            <div key={r} style={{ background: 'rgba(0,0,0,.1)', borderRadius: 4, padding: '8px 10px', borderLeft: `3px solid ${c}` }}>
              <div style={{ fontSize: 9, color: '#6a4a20', letterSpacing: 1, marginBottom: 2 }}>{r}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: '#3a2800' }}>{n}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card st={{ marginBottom: 14, background: 'linear-gradient(145deg,#d4b870,#c09040)' }}>
        <div style={{ fontSize: 10, color: '#5a3a10', letterSpacing: 1, marginBottom: 4 }}>📋 TU SITUACIÓN · {demName.split(' ')[0].toUpperCase()}</div>
        <p style={{ fontSize: 13, color: '#3a2000', lineHeight: 1.5 }}>{gc.ctx.dem}</p>
      </Card>
      <BigBtn onClick={() => advance('gravedad')} col="#cc1a00">🔨 COMENZAR CASO →</BigBtn>
    </div>
  )

  if (fase === 'gravedad') return (
    <div>{hdr}
      {/* KEY FIX — key={fase} garantiza componente fresco en cada fase */}
      <FaseScreen key="gravedad"
        title="⚖️ ¿QUÉ TAN GRAVE ES?" sub={`${demName} — evaluá la situación`}
        hint="Tu reclamo empieza aquí. El juego evaluará si fuiste proporcional."
        gc={gc} field="gravedad"
        onPick={id => pick('gravedad', id, 'prueba')}
      />
    </div>
  )

  if (fase === 'prueba') return (
    <div>{hdr}
      <PruebaScreen key="prueba" gc={gc} selected={ch.prueba}
        onToggle={id => setCh(c => ({ ...c, prueba: c.prueba.includes(id) ? c.prueba.filter(x => x !== id) : c.prueba.length < 3 ? [...c.prueba, id] : c.prueba }))}
        onConfirm={() => advance('forma')}
      />
    </div>
  )

  if (fase === 'forma') return (
    <div>{hdr}
      <FaseScreen key="forma"
        title="📢 ¿CÓMO LO PLANTEÁS?" sub={`${demName} — forma de presentar el reclamo`}
        hint="La forma importa tanto como el fondo."
        gc={gc} field="forma"
        onPick={id => pick('forma', id, 'handoff')}
      />
    </div>
  )

  if (fase === 'handoff') return <HandoffScreen to={defName} onReady={() => advance('respuesta')} />

  if (fase === 'respuesta') return (
    <div>{hdr}
      <TimerBar seconds={60} runKey={tk} onTimeout={() => handleTimeout('respuesta', 'argumento')} />
      <FaseScreen key="respuesta"
        title="🛡️ ¿CÓMO RESPONDÉS?" sub={`${defName} — tu primera jugada`}
        hint="Esta es tu primera reacción. Define el tono de toda tu defensa."
        gc={gc} field="respuesta"
        onMountTimer={(hp, dr) => { pickRef.current = hp; doneRef.current = dr }}
        onPick={id => pick('respuesta', id, 'argumento')}
      />
    </div>
  )

  if (fase === 'argumento') return (
    <div>{hdr}
      <TimerBar seconds={60} runKey={tk} onTimeout={() => handleTimeout('argumento', 'escalada')} />
      <FaseScreen key="argumento"
        title="🗣️ TU ARGUMENTO" sub={`${defName} — reforzá tu posición`}
        hint="Tu defensa de fondo. Acá se consolida o se cae tu caso."
        gc={gc} field="argumento"
        onMountTimer={(hp, dr) => { pickRef.current = hp; doneRef.current = dr }}
        onPick={id => pick('argumento', id, 'escalada')}
      />
    </div>
  )

  if (fase === 'escalada') return (
    <div>{hdr}
      <TimerBar seconds={60} runKey={tk} onTimeout={() => handleTimeout('escalada', null, true)} />
      <FaseScreen key="escalada"
        title="🔨 DECISIÓN FINAL" sub={`${defName} — última jugada del caso`}
        hint="No hay vuelta atrás. La mejor decisión cierra el caso."
        gc={gc} field="escalada"
        onMountTimer={(hp, dr) => { pickRef.current = hp; doneRef.current = dr }}
        onPick={id => pick('escalada', id, null, true)}
      />
    </div>
  )

  return <div />
}

/* ── CASO RESULT ── */
function CasoResultScreen({ gc, demName, defName, stacks, choices, matchSc, matchMon, idx, total, onNext }) {
  const { cs, ds } = stacks
  const demGano = cs > ds; const empate = cs === ds
  const transfer = calcTransfer(cs, ds)
  const [show, setShow] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShow(true), 600); return () => clearTimeout(t) }, [])
  const lbl = (field, id) => gc[field]?.find(x => x.id === id)?.lbl || '—'
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", border: `3px solid ${demGano ? '#cc1a00' : empate ? '#888' : '#0066cc'}`, color: demGano ? '#cc1a00' : empate ? '#888' : '#0066cc', padding: '4px 18px', borderRadius: 4, fontSize: 22, display: 'inline-block', transform: 'rotate(-2deg)', letterSpacing: 3 }}>
          {empate ? '⚖️ EMPATE' : demGano ? `🏆 GANA ${demName.split(' ')[0].toUpperCase()}` : `🏆 GANA ${defName.split(' ')[0].toUpperCase()}`}
        </span>
      </div>
      <Card st={{ marginBottom: 14, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 2, color: '#5a3a10', marginBottom: 12 }}>🪙 VALOR DE LAS JUGADAS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'center', marginBottom: show ? 12 : 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#5a3a10', letterSpacing: 1, marginBottom: 4 }}>⚔️ DEMANDA</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, color: '#cc1a00', marginBottom: 4 }}>{demName.split(' ')[0].toUpperCase()}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: show ? 22 : 0, color: (demGano && !empate) ? '#cc1a00' : '#5a4a30', transition: 'font-size .7s ease', overflow: 'hidden' }}>{fmt(cs)}</div>
            {(demGano && !empate) && show && <div style={{ fontSize: 20, marginTop: 4 }}>🏆</div>}
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#8a7a60' }}>VS</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#5a3a10', letterSpacing: 1, marginBottom: 4 }}>🛡️ DEFENSA</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, color: '#0066cc', marginBottom: 4 }}>{defName.split(' ')[0].toUpperCase()}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: show ? 22 : 0, color: (!demGano && !empate) ? '#0066cc' : '#5a4a30', transition: 'font-size .7s ease', overflow: 'hidden' }}>{fmt(ds)}</div>
            {(!demGano && !empate) && show && <div style={{ fontSize: 20, marginTop: 4 }}>🏆</div>}
          </div>
        </div>
        {show && !empate && (
          <div style={{ background: '#c49040', borderRadius: 4, padding: '8px 12px', borderLeft: `4px solid ${demGano ? '#cc1a00' : '#0066cc'}` }}>
            <span style={{ fontSize: 13, color: '#3a2000' }}>🪙 {demGano ? defName.split(' ')[0] : demName.split(' ')[0]} le paga <strong style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}>{fmt(transfer)}</strong> a {demGano ? demName.split(' ')[0] : defName.split(' ')[0]}</span>
          </div>
        )}
        {show && choices.timeout && <div style={{ marginTop: 8, background: 'rgba(180,0,0,.12)', borderRadius: 4, padding: '6px 10px', fontSize: 12, color: '#cc1a00' }}>⏱️ Penalización por tiempo agotado</div>}
      </Card>
      {show && (
        <Card st={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, color: '#3a2800', letterSpacing: 1, marginBottom: 10 }}>📜 ASÍ JUGARON</div>
          <div style={{ fontSize: 12, color: '#3a2000', lineHeight: 2 }}>
            <div><strong>{demName.split(' ')[0]}</strong> · Gravedad: <em>{lbl('gravedad', choices.gravedad)}</em></div>
            <div><strong>{demName.split(' ')[0]}</strong> · Forma: <em>{lbl('forma', choices.forma)}</em></div>
            <div style={{ borderTop: '1px dashed #c49040', paddingTop: 6, marginTop: 4 }}>
              <strong>{defName.split(' ')[0]}</strong> · Respuesta: <em>{lbl('respuesta', choices.respuesta)}</em>
            </div>
            <div><strong>{defName.split(' ')[0]}</strong> · Argumento: <em>{lbl('argumento', choices.argumento)}</em></div>
            <div><strong>{defName.split(' ')[0]}</strong> · Escalada: <em>{lbl('escalada', choices.escalada)}</em></div>
          </div>
        </Card>
      )}
      <Card st={{ marginBottom: 16, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: 2, color: '#5a3a10', marginBottom: 8 }}>🪙 SALDOS ACTUALES</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, color: '#cc1a00' }}>{demName.split(' ')[0].toUpperCase()}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#cc1a00' }}>{fmt(matchMon.p1)}</div>
            <div style={{ fontSize: 10, color: '#6a4a20' }}>🏆 {matchSc.p1} casos</div>
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: '#8a7a60' }}>·</div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, color: '#0066cc' }}>{defName.split(' ')[0].toUpperCase()}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#0066cc' }}>{fmt(matchMon.p2)}</div>
            <div style={{ fontSize: 10, color: '#6a4a20' }}>🏆 {matchSc.p2} casos</div>
          </div>
        </div>
      </Card>
      <BigBtn onClick={onNext} col={idx >= total - 1 ? '#cc1a00' : '#e07700'}>{idx >= total - 1 ? 'VER RESULTADO FINAL →' : 'SIGUIENTE CASO →'}</BigBtn>
    </div>
  )
}

function MatchResultScreen({ n1, n2, matchSc, matchMon, onReset }) {
  const p1W = matchSc.p1 > matchSc.p2; const empate = matchSc.p1 === matchSc.p2
  return (
    <div style={{ textAlign: 'center', paddingTop: 24 }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: '#d4a030', lineHeight: 1, marginBottom: 8 }}>🔨 DECISIÓN<br />FINAL</div>
      <div style={{ fontSize: 64, marginBottom: 16 }}>{p1W ? '🏆' : empate ? '⚖️' : '💀'}</div>
      <Card st={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: p1W ? '#cc1a00' : empate ? '#888' : '#0066cc', marginBottom: 16 }}>
          {empate ? 'EMPATE' : `GANA ${(p1W ? n1 : n2).split(' ')[0].toUpperCase()}`}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 16 }}>
          {[[n1, matchSc.p1, matchMon.p1, p1W && !empate, '#cc1a00'], [n2, matchSc.p2, matchMon.p2, !p1W && !empate, '#0066cc']].map(([n, w, m, isW, c]) => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, color: isW ? c : '#8a7a60', marginBottom: 4 }}>{n.split(' ')[0].toUpperCase()}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: isW ? c : '#5a4a30' }}>{w}</div>
              <div style={{ fontSize: 11, color: '#6a4a20' }}>casos ganados</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: m >= START_MONEY ? '#4a8a20' : '#cc1a00', marginTop: 4 }}>{fmt(m)} {m >= START_MONEY ? '▲' : '▼'}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#c49040', borderRadius: 4, padding: '10px 14px', borderLeft: '4px solid #cc1a00', fontSize: 14, color: '#3a2000' }}>
          {empate ? '🤝 Los saldos terminaron equilibrados.' : `🪙 ${(p1W ? n2 : n1).split(' ')[0]} pagó en total ${fmt(Math.abs(matchMon.p1 - matchMon.p2))}`}
        </div>
      </Card>
      <BigBtn onClick={onReset} col="#cc1a00">↺ NUEVA PARTIDA</BigBtn>
    </div>
  )
}

/* ── MAIN SCREENS ── */
function RegisterScreen({ onDone }) {
  const [name, setName] = useState('')
  const go = () => { if (name.trim().length < 4) return; onDone(loadP(name.trim())) }
  return (
    <div style={{ paddingTop: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 11, letterSpacing: 3, color: '#8a7a60', marginBottom: 8 }}>⚖️ CORREO ARGENTINO — CD XXXXXX-X</div>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 50, color: '#d4a030', lineHeight: 1, marginBottom: 4 }}>EL JUEGO<br />DE LA DEMANDA</h1>
      <p style={{ fontSize: 14, color: '#d4a030', fontStyle: 'italic', marginBottom: 36, lineHeight: 1.5 }}>"No gana el que más demanda.<br />Gana el que mejor decide."</p>
      <Card st={{ textAlign: 'left', marginBottom: 20 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: '#3a2800', letterSpacing: 1, marginBottom: 10, borderBottom: '1px solid #b8923a', paddingBottom: 8 }}>👨‍⚖️ IDENTIFICACIÓN DEL LITIGANTE</div>
        <label style={{ fontSize: 11, color: '#5a3a10', letterSpacing: 1, display: 'block', marginBottom: 6 }}>NOMBRE COMPLETO</label>
        <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()} placeholder="Ej: María González"
          style={{ width: '100%', padding: '12px 14px', background: '#f5e8c0', border: '1px solid #a07030', borderRadius: 4, fontSize: 15, color: '#1a0a00', outline: 'none' }} />
        <div style={{ fontSize: 11, color: '#8a7a60', marginTop: 6 }}>Aparecerá en todas tus demandas</div>
      </Card>
      <BigBtn onClick={go} disabled={name.trim().length < 4} col="#e07700">⚖️ INGRESAR AL TRIBUNAL</BigBtn>
    </div>
  )
}

function HomeScreen({ p1, onLocal, onOnline, onChange }) {
  return (
    <div style={{ paddingTop: 20 }}>
      <Card st={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#8a3000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5c060' }}>
            {p1.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#3a2800' }}>{p1.name}</div>
            <Stamp>⚖️ LITIGANTE ACTIVO</Stamp>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, borderTop: '1px solid #b8923a', paddingTop: 12 }}>
          {[['🪙 GANADO', fmt(p1.money), 'en total'], ['🏆 VICTORIAS', p1.wins, 'partidas'], ['💀 DERROTAS', p1.losses, 'partidas'], ['🔥 RACHA', p1.streak, 'seguidas']].map(([l, v, s]) => (
            <div key={l} style={{ textAlign: 'center', background: '#c49040', borderRadius: 4, padding: '8px 4px' }}>
              <div style={{ fontSize: 9, color: '#5a3a10', letterSpacing: 1, marginBottom: 2 }}>{l}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: '#1a0800' }}>{v}</div>
              <div style={{ fontSize: 9, color: '#6a4a20' }}>{s}</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <Card st={{ textAlign: 'center', borderTop: '4px solid #cc1a00', padding: '14px 10px' }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>📱</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#3a2800', marginBottom: 4 }}>LOCAL</div>
          <div style={{ fontSize: 11, color: '#5a3a10', marginBottom: 10, lineHeight: 1.4 }}>6 casos · Mismo dispositivo · Amistoso</div>
          <button onClick={onLocal} style={{ background: '#cc1a00', color: '#fff', border: 'none', padding: '10px 0', borderRadius: 4, width: '100%', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 2 }}>⚡ JUGAR</button>
        </Card>
        <Card st={{ textAlign: 'center', borderTop: '4px solid #0066cc', padding: '14px 10px' }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>📲</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#3a2800', marginBottom: 4 }}>ONLINE</div>
          <div style={{ fontSize: 11, color: '#5a3a10', marginBottom: 10, lineHeight: 1.4 }}>Retar a alguien por WhatsApp</div>
          <button onClick={onOnline} style={{ background: '#0066cc', color: '#fff', border: 'none', padding: '10px 0', borderRadius: 4, width: '100%', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 2 }}>📲 RETAR</button>
        </Card>
      </div>
      <button onClick={onChange} style={{ background: 'none', border: 'none', color: '#6a5a40', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', display: 'block', textAlign: 'center', width: '100%' }}>
        No soy {p1.name.split(' ')[0]} · Cambiar perfil
      </button>
    </div>
  )
}

function OnlineScreen({ p1, onBack }) {
  const [sent, setSent] = useState(false)
  const caseId = useRef(Math.floor(Math.random() * CASOS.length))
  const challengeId = useRef(Math.random().toString(36).slice(2, 8).toUpperCase())
  const gc = CASOS[caseId.current]
  const sendWhatsApp = () => {
    const appUrl = window.location.href.split('?')[0] + '?challenge=' + challengeId.current
    const msg = encodeURIComponent(`⚖️ *${p1.name} te inició una DEMANDA* ⚖️\n\n📋 Caso: _"${gc.titulo}"_\n\nTenés 24hs para responder. Hacé click acá para defenderte:\n${appUrl}\n\n_(No es un virus 😂 — es El Juego de la Demanda. ¡Aceptá si te animás!)_`)
    window.open(`https://wa.me/?text=${msg}`, '_blank')
    setSent(true)
  }
  return (
    <div style={{ paddingTop: 16 }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: '#8a7a60', marginBottom: 4 }}>📲 MODO ONLINE</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: '#d4a030' }}>RETAR POR WHATSAPP</div>
      </div>
      <Card st={{ marginBottom: 16, borderTop: '4px solid #0066cc' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: '#3a2800', letterSpacing: 1, marginBottom: 10 }}>⚖️ CASO QUE VAS A DEMANDAR</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}><Stamp>{gc.cat}</Stamp></div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#3a2800', marginBottom: 6 }}>{gc.titulo}</div>
        <p style={{ fontSize: 13, color: '#5a3a10', lineHeight: 1.5 }}>{gc.desc}</p>
      </Card>
      {!sent
        ? <BigBtn onClick={sendWhatsApp} col="#25D366">📲 ABRIR WHATSAPP Y ENVIAR RETO</BigBtn>
        : <Card st={{ textAlign: 'center', borderTop: '4px solid #25D366' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#3a2800', marginBottom: 4 }}>RETO ENVIADO</div>
            <div style={{ fontSize: 13, color: '#5a3a10' }}>Esperás que tu rival acepte la demanda</div>
          </Card>
      }
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#6a5a40', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>← Volver al inicio</button>
      </div>
    </div>
  )
}

function SetupScreen({ p1, onDone }) {
  const [name, setName] = useState('')
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: '#d4a030', marginBottom: 4 }}>⚖️ NUEVA PARTIDA LOCAL</div>
        <div style={{ fontSize: 13, color: '#8a7a60' }}>Pasale el teléfono para que ingrese su nombre</div>
      </div>
      <Card st={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#5a2800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: '#f5c060' }}>
            {p1.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#8a7a60', letterSpacing: 1 }}>⚔️ JUGADOR 1</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#3a2800' }}>{p1.name}</div>
          </div>
        </div>
        <div style={{ borderTop: '1px dashed #b8923a', paddingTop: 14 }}>
          <label style={{ fontSize: 11, color: '#5a3a10', letterSpacing: 1, display: 'block', marginBottom: 6 }}>🛡️ NOMBRE DEL RIVAL</label>
          <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && name.trim().length >= 4 && onDone(name.trim())} placeholder="Nombre completo del rival"
            style={{ width: '100%', padding: '12px 14px', background: '#f5e8c0', border: '1px solid #a07030', borderRadius: 4, fontSize: 15, color: '#1a0a00', outline: 'none' }} />
        </div>
      </Card>
      <BigBtn onClick={() => onDone(name.trim())} disabled={name.trim().length < 4} col="#cc1a00">⚖️ COMENZAR PARTIDA</BigBtn>
    </div>
  )
}

function WelcomeScreen({ n1, n2, startsWith, juzgado, exp, onStart }) {
  return (
    <div style={{ textAlign: 'center', paddingTop: 24 }}>
      <div style={{ fontSize: 11, color: '#8a7a60', letterSpacing: 2, marginBottom: 4 }}>🏛️ REPÚBLICA ARGENTINA</div>
      <Card st={{ marginBottom: 20, borderTop: '4px solid #cc1a00' }}>
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Stamp>🔨 JUZGADO CIVIL N° {juzgado}</Stamp>
          <Stamp col="#0066cc" angle={2}>📋 EXP. {exp}</Stamp>
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#3a2800', marginBottom: 10 }}>👨‍⚖️ BIENVENIDOS AL HONORABLE JUZGADO</div>
        <div style={{ fontSize: 14, color: '#5a3a10', marginBottom: 16, lineHeight: 1.8 }}>
          Se inician actuaciones en la causa<br />
          <strong style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#cc1a00' }}>{n1}</strong>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: '#888', margin: '0 8px' }}>⚖️</span>
          <strong style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#0066cc' }}>{n2}</strong>
        </div>
        <div style={{ background: 'rgba(0,0,0,.06)', borderRadius: 4, padding: '10px 14px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#6a4a20', letterSpacing: 1, marginBottom: 4 }}>⚔️ COMIENZA CON LA PRIMERA DEMANDA</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#cc1a00' }}>{startsWith}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[[n1, '#cc1a00'], [n2, '#0066cc']].map(([n, c]) => (
            <div key={n} style={{ background: `rgba(${c === '#cc1a00' ? '200,60,0' : '0,60,200'},.08)`, borderRadius: 4, padding: 8, borderLeft: `3px solid ${c}` }}>
              <div style={{ fontSize: 10, color: '#8a7a60', letterSpacing: 1, marginBottom: 2 }}>🪙 SALDO INICIAL</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, color: c }}>{n.split(' ')[0]}: $50.000</div>
            </div>
          ))}
        </div>
      </Card>
      <BigBtn onClick={onStart} col="#cc1a00">⚖️ QUE COMIENCE EL JUICIO</BigBtn>
    </div>
  )
}

/* ══════════════════════════════════════
   APP ROOT
══════════════════════════════════════ */
export default function App() {
  const [scr, setScr] = useState('register')
  const [p1, setP1] = useState(null)
  const [p2name, setP2name] = useState('')
  const [order, setOrder] = useState([])
  const [idx, setIdx] = useState(0)
  const [demIs, setDemIs] = useState('p1')
  const [matchSc, setMatchSc] = useState({ p1: 0, p2: 0 })
  const [matchMon, setMatchMon] = useState({ p1: START_MONEY, p2: START_MONEY })
  const [lastResult, setLastResult] = useState(null)
  const [juzgado] = useState(1000 + Math.floor(Math.random() * 8999))
  const [exp] = useState(`${Math.floor(10000000 + Math.random() * 89999999)}-${Math.floor(Math.random() * 9)}`)
  const [starter, setStarter] = useState('p1')

  const startGame = (p2n) => {
    const indices = Array.from({ length: CASOS.length }, (_, i) => i)
    const shuffled = shuffle(indices).slice(0, TOTAL_CASES)
    setOrder(shuffled)
    setP2name(p2n)
    const s = Math.random() < 0.5 ? 'p1' : 'p2'
    setStarter(s); setDemIs(s)
    setScr('welcome')
  }

  const onResult = ({ ch, gc, demIs: di }) => {
    const stacks = calcStacks(gc, ch)
    const { cs, ds } = stacks
    const demGano = cs > ds; const empate = cs === ds
    const transfer = empate ? 0 : calcTransfer(cs, ds)
    let newMon = { ...matchMon }; let newSc = { ...matchSc }
    if (!empate) {
      if (demGano) {
        if (di === 'p1') { newSc.p1++; newMon.p1 += transfer; newMon.p2 -= transfer }
        else { newSc.p2++; newMon.p2 += transfer; newMon.p1 -= transfer }
      } else {
        if (di === 'p1') { newSc.p2++; newMon.p2 += transfer; newMon.p1 -= transfer }
        else { newSc.p1++; newMon.p1 += transfer; newMon.p2 -= transfer }
      }
    }
    newMon.p1 = Math.max(0, newMon.p1); newMon.p2 = Math.max(0, newMon.p2)
    setMatchSc(newSc); setMatchMon(newMon)
    setLastResult({ ch, stacks, gc, demIs: di })
    setScr('casoResult')
  }

  const onNext = () => {
    if (idx >= TOTAL_CASES - 1) {
      if (p1) {
        const p1W = matchSc.p1 > matchSc.p2
        const gained = matchMon.p1 - START_MONEY
        saveP({ ...p1, wins: p1.wins + (p1W ? 1 : 0), losses: p1.losses + (matchSc.p1 < matchSc.p2 ? 1 : 0), money: p1.money + gained, streak: p1W ? p1.streak + 1 : 0, best: Math.max(p1.best, p1W ? p1.streak + 1 : p1.streak) })
      }
      setScr('matchResult'); return
    }
    setIdx(i => i + 1); setDemIs(d => d === 'p1' ? 'p2' : 'p1'); setLastResult(null); setScr('game')
  }

  const reset = () => {
    setIdx(0); setDemIs('p1'); setMatchSc({ p1: 0, p2: 0 })
    setMatchMon({ p1: START_MONEY, p2: START_MONEY })
    setLastResult(null); setP2name(''); setScr('home')
  }

  const demName = lastResult ? (lastResult.demIs === 'p1' ? p1?.name : p2name) : ''
  const defName = lastResult ? (lastResult.demIs === 'p1' ? p2name : p1?.name) : ''

  return (
    <div style={{ minHeight: '100vh', background: '#1a0e05' }}>
      {scr !== 'register' && (
        <div style={{ background: '#0f0803', borderBottom: '2px solid #8a4a00', padding: '10px 16px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#d4a030', letterSpacing: 2 }}>⚖️ LA DEMANDA</div>
          {p1 && <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: '#d4a030' }}>🪙 {fmt(p1.money)}</div>}
        </div>
      )}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 14px 80px' }}>
        {scr === 'register' && <RegisterScreen onDone={p => { setP1(p); setScr('home') }} />}
        {scr === 'home' && p1 && <HomeScreen p1={p1} onLocal={() => setScr('setup')} onOnline={() => setScr('online')} onChange={() => { setP1(null); setScr('register') }} />}
        {scr === 'online' && p1 && <OnlineScreen p1={p1} onBack={() => setScr('home')} />}
        {scr === 'setup' && p1 && <SetupScreen p1={p1} onDone={n => startGame(n)} />}
        {scr === 'welcome' && p1 && p2name && <WelcomeScreen n1={p1.name} n2={p2name} startsWith={starter === 'p1' ? p1.name : p2name} juzgado={juzgado} exp={exp} onStart={() => setScr('game')} />}
        {scr === 'game' && p1 && p2name && order.length > 0 && <GameScreen key={idx} p1={p1} p2name={p2name} idx={idx} order={order} demIs={demIs} matchSc={matchSc} matchMon={matchMon} onResult={onResult} total={TOTAL_CASES} />}
        {scr === 'casoResult' && lastResult && <CasoResultScreen gc={lastResult.gc} demName={demName} defName={defName} stacks={lastResult.stacks} choices={lastResult.ch} matchSc={matchSc} matchMon={matchMon} idx={idx} total={TOTAL_CASES} onNext={onNext} />}
        {scr === 'matchResult' && <MatchResultScreen n1={p1?.name || ''} n2={p2name} matchSc={matchSc} matchMon={matchMon} onReset={reset} />}
      </div>
    </div>
  )
}
