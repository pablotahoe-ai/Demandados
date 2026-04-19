import { useState, useEffect, useRef, useCallback } from 'react'
import { CASOS, START_MONEY, TOTAL_CASES } from './data.js'

/* ═══════════════════════════════════════════
   CONFIG — valores altos para que se sienta
═══════════════════════════════════════════ */
const MULT = { gravedad:4000, prueba:2500, forma:3500, respuesta:5000, argumento:4000, escalada:6000 }
const REVEAL_MS = 1500
const TRANSFER_MAX = 20000

const HINTS = {
  gravedad:["El tono que elegís acá define todo lo que viene después.","Exagerar te puede costar más que ganar el caso.","Una mala lectura de la situación y todo se cae."],
  prueba:["El otro ya está pensando cómo refutarte.","No necesitás las tres — necesitás las correctas.","Una prueba débil puede hundir tu caso entero."],
  forma:["Cómo entrás define cómo salís.","El otro va a leer esto y preparar su respuesta.","La forma importa tanto como el fondo. A veces más."],
  respuesta:["El demandante ya jugó sus cartas. Ahora son las tuyas.","60 segundos. Una mala respuesta y todo se cae.","Negá, reconocé o atacá — solo una te conviene."],
  argumento:["Acá se consolida o se hunde tu defensa.","Tu argumento es el corazón del caso.","Si llegaste hasta acá, todavía podés ganar esto."],
  escalada:["Última jugada. Todo o nada.","El que mejor decide acá, gana. Sin excepciones.","¿Cerrás bien o tirás todo por la borda?"],
}
const rHint = f => { const a=HINTS[f]; return a[Math.floor(Math.random()*a.length)] }

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function shuffle(arr) {
  const a=[...arr]
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a
}

const fmt = n => '$\u00A0' + Math.abs(Math.round(n)).toLocaleString('es-AR')

function calcStacks(gc, ch) {
  let cs=gc.base, ds=Math.round(gc.base*0.55)
  const gv=gc.gravedad.find(x=>x.id===ch.gravedad); if(gv) cs+=gv.v*MULT.gravedad
  ;(ch.prueba||[]).forEach(id=>{const e=gc.prueba.find(x=>x.id===id);if(e) cs+=e.v*MULT.prueba})
  const fv=gc.forma.find(x=>x.id===ch.forma); if(fv) cs+=fv.v*MULT.forma
  const rv=gc.respuesta.find(x=>x.id===ch.respuesta); if(rv) ds+=rv.v*MULT.respuesta
  const av=gc.argumento.find(x=>x.id===ch.argumento); if(av) ds+=av.v*MULT.argumento
  const ev=gc.escalada.find(x=>x.id===ch.escalada); if(ev) ds+=ev.v*MULT.escalada
  if(ch.timeout) ds=Math.round(ds*0.15)
  return {cs:Math.max(0,cs), ds:Math.max(0,ds)}
}

function calcLiveCs(gc, ch) {
  let cs=gc.base
  const gv=gc.gravedad.find(x=>x.id===ch.gravedad); if(gv) cs+=gv.v*MULT.gravedad
  ;(ch.prueba||[]).forEach(id=>{const e=gc.prueba.find(x=>x.id===id);if(e) cs+=e.v*MULT.prueba})
  const fv=gc.forma.find(x=>x.id===ch.forma); if(fv) cs+=fv.v*MULT.forma
  return Math.max(0,cs)
}

function calcTransfer(cs, ds) {
  const total=cs+ds; if(total===0) return 3000
  const diff=Math.abs(cs-ds)
  return Math.min(TRANSFER_MAX, Math.max(3000, Math.round((diff/total)*25000)))
}

function calcCaseStrength(gc) {
  const bestGrav=Math.max(...gc.gravedad.map(x=>x.v))
  const bestP=[...gc.prueba].sort((a,b)=>b.v-a.v).slice(0,3).reduce((s,x)=>s+x.v,0)
  const bestForma=Math.max(...gc.forma.map(x=>x.v))
  const score=bestGrav+(bestP/3)+bestForma
  if(score>=8) return 'strong'
  if(score>=5.5) return 'medium'
  return 'weak'
}

const calcMediationAmount = gc => Math.round((gc.base*1.5)/1000)*1000

// Escala de color: 6 niveles claros
function colorForV(v) {
  if(v>=4) return {bg:'rgba(5,80,20,0.95)', border:'#16a34a', text:'#86efac'}
  if(v>=2) return {bg:'rgba(15,60,5,0.88)', border:'#4d7c0f', text:'#a3e635'}
  if(v>=1) return {bg:'rgba(80,65,0,0.88)', border:'#b45309', text:'#fcd34d'}
  if(v===0) return {bg:'rgba(35,35,35,0.85)', border:'#4b5563', text:'#9ca3af'}
  if(v>=-2) return {bg:'rgba(120,40,0,0.88)', border:'#c2410c', text:'#fb923c'}
  return {bg:'rgba(100,5,5,0.95)', border:'#b91c1c', text:'#fca5a5'}
}

/* ── STORAGE ── */
const pKey = n=>'jd4_'+n.toLowerCase().replace(/\s+/g,'_')
const emptyP = n=>({name:n,money:0,wins:0,losses:0,streak:0,best:0})
function loadP(name){try{const r=localStorage.getItem(pKey(name));if(r)return JSON.parse(r)}catch{}return emptyP(name)}
function saveP(p){try{localStorage.setItem(pKey(p.name),JSON.stringify(p))}catch{}}

/* ═══════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════ */
function Card({children, st={}}) {
  return <div style={{background:'linear-gradient(150deg,#ecdcaa,#d4a860)',border:'1px solid #a07030',borderRadius:4,padding:16,boxShadow:'0 3px 18px rgba(0,0,0,.55)',...st}}>{children}</div>
}

function BigBtn({children, onClick, disabled, col='#cc1a00'}) {
  return <button onClick={onClick} disabled={disabled} style={{background:disabled?'#2a1a08':col,color:'#fff',border:'none',padding:'14px 20px',borderRadius:3,width:'100%',cursor:disabled?'not-allowed':'pointer',fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:3,opacity:disabled?.5:1,transition:'all .15s'}}>{children}</button>
}

function GhostBtn({children, onClick, col='#d4a030'}) {
  return <button onClick={onClick} style={{background:'transparent',color:col,border:`2px solid ${col}`,padding:'12px 20px',borderRadius:3,width:'100%',cursor:'pointer',fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:3,transition:'all .15s'}}>{children}</button>
}

function Stamp({children, col='#cc1a00', angle=-2}) {
  return <span style={{fontFamily:"'Bebas Neue',sans-serif",border:`2px solid ${col}`,color:col,padding:'1px 8px',borderRadius:2,letterSpacing:3,fontSize:11,display:'inline-block',transform:`rotate(${angle}deg)`}}>{children}</span>
}

function Divider() {
  return <div style={{borderTop:'1px solid rgba(160,112,48,.3)',margin:'12px 0'}}/>
}

/* ── OPCIÓN CON REVEAL ── */
function OptReveal({o, field, pickedId, onPick, isRevealing}) {
  const isSel=pickedId===o.id
  const val=o.v*MULT[field]
  const c=colorForV(o.v)
  return (
    <button onClick={()=>!pickedId&&onPick(o.id)} style={{
      background:isRevealing?c.bg:(isSel?'#4a2000':'#c49040'),
      border:`2px solid ${isRevealing?c.border:(isSel?'#e07700':'#a07030')}`,
      borderRadius:4,padding:'12px 10px',textAlign:'left',width:'100%',
      cursor:pickedId?'default':'pointer',
      display:'flex',gap:10,alignItems:'center',transition:'all .3s',
    }}>
      <span style={{fontSize:20,flexShrink:0}}>{o.emoji}</span>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:'bold',color:isRevealing?c.text:(isSel?'#f5c060':'#2a1800')}}>{o.lbl}</div>
        {o.desc&&!isRevealing&&<div style={{fontSize:11,color:isSel?'#d4a060':'#5a3a10',marginTop:2,lineHeight:1.3}}>{o.desc}</div>}
      </div>
      {isRevealing&&<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,flexShrink:0,color:c.text,minWidth:84,textAlign:'right'}}>{val>0?'+':''}{fmt(val)}</div>}
      {!isRevealing&&isSel&&<div style={{width:8,height:8,borderRadius:'50%',background:'#e07700',flexShrink:0}}/>}
    </button>
  )
}

/* ── FASE SINGLE-CHOICE — key={fase} garantiza reset completo ── */
function FaseScreen({title, sub, gc, field, onPick, onMountTimer}) {
  const [pickedId,setPickedId]=useState(null)
  const [isRevealing,setIsRevealing]=useState(false)
  const doneRef=useRef(false)
  const [hint]=useState(()=>rHint(field))

  const handlePick=useCallback((id)=>{
    if(doneRef.current) return
    doneRef.current=true
    setPickedId(id); setIsRevealing(true)
    setTimeout(()=>onPick(id),REVEAL_MS)
  },[onPick])

  useEffect(()=>{if(onMountTimer) onMountTimer(handlePick,doneRef)},[])

  return (
    <div>
      <div style={{marginBottom:14}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:'#d4a030',letterSpacing:2}}>{title}</div>
        <div style={{fontSize:12,color:'#8a7a60',marginTop:2}}>{sub}</div>
      </div>
      {!isRevealing&&<div style={{borderLeft:'3px solid #c49040',background:'rgba(196,144,64,.1)',padding:'8px 12px',borderRadius:'0 3px 3px 0',fontSize:13,color:'#c49040',marginBottom:14,fontStyle:'italic'}}>{hint}</div>}
      {isRevealing&&<div style={{borderLeft:'3px solid #d4a030',background:'rgba(212,160,48,.1)',padding:'8px 12px',borderRadius:'0 3px 3px 0',fontSize:12,color:'#d4a030',marginBottom:14,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2}}>RESULTADO DE CADA OPCIÓN</div>}
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {gc[field].map(o=><OptReveal key={o.id} o={o} field={field} pickedId={pickedId} onPick={handlePick} isRevealing={isRevealing}/>)}
      </div>
    </div>
  )
}

/* ── PRUEBA MULTI-SELECT ── */
function PruebaScreen({gc, selected, onToggle, onConfirm}) {
  const [confirmed,setConfirmed]=useState(false)
  const [isRevealing,setIsRevealing]=useState(false)
  const doConfirm=()=>{if(confirmed||selected.length===0)return;setConfirmed(true);setIsRevealing(true);setTimeout(()=>onConfirm(),REVEAL_MS)}
  return (
    <div>
      <div style={{marginBottom:14}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:'#d4a030',letterSpacing:2}}>ELEGÍ TUS PRUEBAS</div>
        <div style={{fontSize:12,color:'#8a7a60',marginTop:2}}>Hasta 3 — elegí las más sólidas</div>
      </div>
      {!isRevealing&&<div style={{borderLeft:'3px solid #c49040',background:'rgba(196,144,64,.1)',padding:'8px 12px',borderRadius:'0 3px 3px 0',fontSize:13,color:'#c49040',marginBottom:14,fontStyle:'italic'}}>No todo lo que tenés sirve. El otro ya está pensando cómo refutarte.</div>}
      {isRevealing&&<div style={{borderLeft:'3px solid #d4a030',background:'rgba(212,160,48,.1)',padding:'8px 12px',borderRadius:'0 3px 3px 0',fontSize:12,color:'#d4a030',marginBottom:14,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2}}>VALOR DE CADA PRUEBA</div>}
      <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:14}}>
        {gc.prueba.map(o=>{
          const isSel=selected.includes(o.id)
          const blocked=!isSel&&selected.length>=3
          const c=colorForV(o.v)
          return (
            <button key={o.id} onClick={()=>!blocked&&!confirmed&&onToggle(o.id)} style={{
              background:isRevealing?c.bg:(isSel?'#4a2000':'#c49040'),
              border:`2px solid ${isRevealing?c.border:(isSel?'#e07700':'#a07030')}`,
              borderRadius:4,padding:'12px 10px',textAlign:'left',width:'100%',
              cursor:(blocked||confirmed)?'default':'pointer',opacity:blocked?.4:1,
              display:'flex',gap:10,alignItems:'center',transition:'all .3s',
            }}>
              <span style={{fontSize:20,flexShrink:0}}>{o.emoji}</span>
              <div style={{flex:1,fontSize:13,fontWeight:'bold',color:isRevealing?c.text:(isSel?'#f5c060':'#2a1800')}}>{o.lbl}</div>
              {isRevealing&&<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:c.text,flexShrink:0,minWidth:84,textAlign:'right'}}>{o.v*MULT.prueba>0?'+':''}{fmt(o.v*MULT.prueba)}</div>}
              {!isRevealing&&isSel&&<span style={{color:'#e07700',fontSize:16,flexShrink:0}}>✓</span>}
            </button>
          )
        })}
      </div>
      {!isRevealing&&<><div style={{fontSize:12,color:'#8a7a60',textAlign:'center',marginBottom:12}}>{selected.length}/3 seleccionadas</div><BigBtn onClick={doConfirm} disabled={selected.length===0} col="#8a5a00">CONFIRMAR PRUEBAS</BigBtn></>}
    </div>
  )
}

/* ── TIMER ── */
function TimerBar({seconds, onTimeout, runKey}) {
  const [t,setT]=useState(seconds); const iv=useRef(null); const fired=useRef(false)
  useEffect(()=>{
    setT(seconds); fired.current=false; clearInterval(iv.current)
    iv.current=setInterval(()=>setT(p=>{if(p<=1){clearInterval(iv.current);if(!fired.current){fired.current=true;onTimeout()};return 0};return p-1}),1000)
    return()=>clearInterval(iv.current)
  },[runKey])
  const pct=(t/seconds)*100; const col=pct>50?'#4a8a20':pct>25?'#cc7700':'#cc1a00'
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
        <span style={{fontSize:11,color:'#8a7a60',letterSpacing:1}}>TIEMPO PARA RESPONDER</span>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:col}}>{t}s</span>
      </div>
      <div style={{background:'#2a1a08',borderRadius:2,height:6,overflow:'hidden'}}>
        <div style={{height:'100%',width:pct+'%',background:col,transition:'width 1s linear'}}/>
      </div>
    </div>
  )
}

/* ── GAME HEADER — siempre muestra el caso y el monto ── */
function GameHeader({titulo, idx, total, sc, n1, n2, mon, liveCs, showLive}) {
  return (
    <div style={{marginBottom:12}}>
      <div style={{background:'#0f0803',borderRadius:3,padding:'7px 10px',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:'#8a7a60',letterSpacing:2}}>CASO {idx+1}/{total}</div>
        <div style={{display:'flex',gap:16,alignItems:'center'}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:8,color:'#8a7a60',letterSpacing:1,marginBottom:1}}>{n1.split(' ')[0].toUpperCase()}</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:'#cc1a00',lineHeight:1}}>{sc.p1}</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:'rgba(204,26,0,0.6)'}}>{fmt(mon.p1)}</div>
          </div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,color:'#4a3a28'}}>vs</div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:8,color:'#8a7a60',letterSpacing:1,marginBottom:1}}>{n2.split(' ')[0].toUpperCase()}</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:'#0066cc',lineHeight:1}}>{sc.p2}</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:'rgba(0,102,204,0.6)'}}>{fmt(mon.p2)}</div>
          </div>
        </div>
        {showLive
          ? <div style={{textAlign:'right'}}>
              <div style={{fontSize:8,color:'#8a7a60',letterSpacing:1,marginBottom:1}}>DEMANDA</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:'#d4a030'}}>{fmt(liveCs)}</div>
            </div>
          : <div style={{width:60}}/>
        }
      </div>
      <div style={{background:'rgba(212,160,48,.08)',borderLeft:'3px solid #d4a030',padding:'5px 10px',borderRadius:'0 3px 3px 0'}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,color:'#d4a030',letterSpacing:1}}>⚖ {titulo}</span>
      </div>
    </div>
  )
}

/* ── MEDIDOR DE FUERZA DEL CASO ── */
function CaseStrengthBadge({strength}) {
  const cfg={
    strong:{col:'#16a34a',bg:'rgba(5,80,20,0.12)',label:'CASO SÓLIDO',sub:'Tenés con qué pelear. Elegí bien y ganás.'},
    medium:{col:'#b45309',bg:'rgba(80,65,0,0.12)',label:'CASO JUSTO',sub:'Todo depende de cómo elijas. No hay margen para errores.'},
    weak:{col:'#b91c1c',bg:'rgba(100,5,5,0.12)',label:'CASO DÉBIL',sub:'Una mala elección y perdiste. Tenés que ser perfecto.'},
  }[strength]
  return (
    <div style={{background:cfg.bg,border:`1px solid ${cfg.col}`,borderRadius:4,padding:'10px 14px',marginBottom:14}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:cfg.col,letterSpacing:2,marginBottom:3}}>{cfg.label}</div>
      <div style={{fontSize:12,color:'#c49040',lineHeight:1.4}}>{cfg.sub}</div>
    </div>
  )
}

/* ── MEDIACIÓN ── */
function MediationOfferScreen({demName, defName, mediationAmount, gc, onGoAll, onPropose}) {
  return (
    <div>
      <Card st={{marginBottom:14,borderTop:'4px solid #b45309'}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:'#8a5000',letterSpacing:2,marginBottom:10}}>ADVERTENCIA DEL JUZGADO</div>
        <p style={{fontSize:14,color:'#3a2000',lineHeight:1.7,marginBottom:16}}>
          Este caso tiene pruebas débiles. Una mala elección y la demanda se cae sola. Podés ir con todo o proponer una mediación rápida.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:4}}>
          <div style={{background:'rgba(200,60,0,.08)',borderRadius:3,padding:12,borderLeft:'3px solid #cc1a00',textAlign:'center'}}>
            <div style={{fontSize:10,color:'#8a6a50',letterSpacing:1,marginBottom:2}}>SI GANÁS</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:'#cc1a00'}}>{fmt(gc.base*3)}</div>
            <div style={{fontSize:10,color:'#8a6a50',marginTop:2}}>máximo posible</div>
          </div>
          <div style={{background:'rgba(0,60,200,.08)',borderRadius:3,padding:12,borderLeft:'3px solid #0066cc',textAlign:'center'}}>
            <div style={{fontSize:10,color:'#8a6a50',letterSpacing:1,marginBottom:2}}>SI PERDÉS</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:'#0066cc'}}>{fmt(gc.base)}</div>
            <div style={{fontSize:10,color:'#8a6a50',marginTop:2}}>mínimo a pagar</div>
          </div>
        </div>
      </Card>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <BigBtn onClick={onGoAll} col="#cc1a00">IR CON TODO — DEMANDAR</BigBtn>
        <GhostBtn onClick={onPropose} col="#d4a030">PROPONER MEDIACIÓN — {fmt(mediationAmount)}</GhostBtn>
      </div>
    </div>
  )
}

function MediationHandoffScreen({to, from, mediationAmount, onReady}) {
  return (
    <div style={{textAlign:'center',paddingTop:24}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:'#d4a030',marginBottom:6}}>PASÁ EL TELÉFONO A</div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:'#cc1a00',marginBottom:16}}>{to}</div>
      <Card st={{textAlign:'left',marginBottom:20}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:'#3a2800',letterSpacing:1,marginBottom:10}}>PROPUESTA DE MEDIACIÓN</div>
        <p style={{fontSize:14,color:'#3a2000',lineHeight:1.6,marginBottom:8}}>
          <strong>{from}</strong> propone cerrar el caso sin juicio.<br/>
          Pago único de <strong style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:'#d4a030'}}>{fmt(mediationAmount)}</strong>
        </p>
        <Divider/>
        <p style={{fontSize:13,color:'#5a3a10',lineHeight:1.5}}>Si aceptás, el caso se cierra ahora.<br/>Si rechazás, se juega la demanda completa.</p>
      </Card>
      <BigBtn onClick={onReady} col="#cc1a00">VER LA PROPUESTA Y DECIDIR</BigBtn>
    </div>
  )
}

function MediationResponseScreen({defName, demName, mediationAmount, onAccept, onReject}) {
  return (
    <div style={{paddingTop:16}}>
      <Card st={{marginBottom:20,borderTop:'4px solid #d4a030',textAlign:'center'}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:'#3a2800',marginBottom:14}}>PROPUESTA DE MEDIACIÓN</div>
        <div style={{background:'rgba(0,0,0,.06)',borderRadius:3,padding:'14px',marginBottom:14}}>
          <div style={{fontSize:10,color:'#8a7a60',letterSpacing:1,marginBottom:4}}>MONTO PROPUESTO</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:44,color:'#d4a030'}}>{fmt(mediationAmount)}</div>
          <div style={{fontSize:11,color:'#6a4a20',marginTop:4}}>pago único · caso cerrado</div>
        </div>
        <p style={{fontSize:13,color:'#5a3a10',lineHeight:1.6,textAlign:'left'}}>
          Si aceptás: pagás {fmt(mediationAmount)} y el caso termina acá.<br/>
          Si rechazás: van a juicio. Podés ganar más… o perder todo.
        </p>
      </Card>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <BigBtn onClick={onAccept} col="#16a34a">ACEPTO — PAGAR {fmt(mediationAmount)}</BigBtn>
        <GhostBtn onClick={onReject} col="#cc1a00">RECHAZO — VAMOS A JUICIO</GhostBtn>
      </div>
    </div>
  )
}

/* ── HANDOFF ── */
function HandoffScreen({to, liveCs, onReady}) {
  return (
    <div style={{textAlign:'center',paddingTop:24}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:'#d4a030',marginBottom:6}}>PASÁ EL TELÉFONO A</div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:'#cc1a00',marginBottom:4}}>{to}</div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:'#8a7a60',marginBottom:20}}>debe responder la demanda</div>
      <div style={{background:'rgba(204,26,0,0.1)',border:'1px solid #8a2000',borderRadius:3,padding:'10px 14px',marginBottom:20}}>
        <div style={{fontSize:10,color:'#cc7070',letterSpacing:1,marginBottom:2}}>LA DEMANDA ES POR</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,color:'#cc1a00'}}>{fmt(liveCs)}</div>
      </div>
      <Card st={{textAlign:'left',marginBottom:20}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,color:'#3a2800',letterSpacing:1,marginBottom:10}}>INSTRUCCIONES</div>
        {['60 segundos por cada decisión','Si el tiempo se acaba, perdés la jugada','No sabés cómo jugó el otro — confiá en tu instinto','Al elegir, todas las opciones revelan su valor'].map((t,i)=>(
          <div key={i} style={{fontSize:13,color:'#3a2000',marginBottom:6,lineHeight:1.4,display:'flex',gap:8}}>
            <span style={{color:'#cc1a00',fontFamily:"'Bebas Neue',sans-serif",fontSize:13,flexShrink:0}}>{i+1}.</span>
            <span>{t}</span>
          </div>
        ))}
      </Card>
      <BigBtn onClick={onReady} col="#cc1a00">COMENZAR A RESPONDER</BigBtn>
    </div>
  )
}

/* ═══════════════════════════════════════════
   GAME SCREEN
═══════════════════════════════════════════ */
function GameScreen({p1, p2name, idx, order, demIs, matchSc, matchMon, onResult, total}) {
  const gc=CASOS[order[idx]]
  const demName=demIs==='p1'?p1.name:p2name
  const defName=demIs==='p1'?p2name:p1.name
  const [fase,setFase]=useState('intro')
  const [ch,setCh]=useState({gravedad:null,prueba:[],forma:null,respuesta:null,argumento:null,escalada:null,timeout:false})
  const [tk,setTk]=useState(0)
  const pickRef=useRef(null)
  const doneRef=useRef(null)
  const strength=calcCaseStrength(gc)
  const mediationAmount=calcMediationAmount(gc)
  const liveCs=calcLiveCs(gc,ch)

  const advance=(next)=>{
    setFase(next)
    if(['respuesta','argumento','escalada'].includes(next)) setTk(k=>k+1)
  }

  const pick=(field,id,next,isLast=false)=>{
    setCh(prev=>{
      const nc={...prev,[field]:id}
      if(isLast) setTimeout(()=>onResult({ch:nc,gc,demIs}),REVEAL_MS)
      else setTimeout(()=>advance(next),REVEAL_MS)
      return nc
    })
  }

  const handleTimeout=(field,next,isLast=false)=>{
    if(doneRef.current&&doneRef.current.current) return
    const worst=[...gc[field]].sort((a,b)=>a.v-b.v)[0].id
    if(pickRef.current) pickRef.current(worst)
    else{
      setCh(prev=>{
        const nc={...prev,[field]:worst,timeout:isLast?true:prev.timeout}
        if(isLast) setTimeout(()=>onResult({ch:nc,gc,demIs}),100)
        else setTimeout(()=>advance(next),100)
        return nc
      })
    }
  }

  const showLive=!['intro','mediation_offer','mediation_handoff','mediation_response','handoff'].includes(fase)
  const hdr=<GameHeader titulo={gc.titulo} idx={idx} total={total} sc={matchSc} n1={p1.name} n2={p2name} mon={matchMon} liveCs={liveCs} showLive={showLive}/>

  if(fase==='intro') return (
    <div>{hdr}
      <Card st={{marginBottom:14,borderTop:'4px solid #cc1a00'}}>
        <div style={{display:'flex',gap:8,marginBottom:10}}><Stamp>{gc.cat}</Stamp></div>
        <p style={{fontSize:14,color:'#2a1000',lineHeight:1.7,marginBottom:14}}>{gc.desc}</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {[['DEMANDANTE',demName,'#cc1a00'],['DEMANDADO',defName,'#0066cc']].map(([r,n,c])=>(
            <div key={r} style={{background:'rgba(0,0,0,.07)',borderRadius:3,padding:'8px 10px',borderLeft:`3px solid ${c}`}}>
              <div style={{fontSize:9,color:'#6a4a20',letterSpacing:1,marginBottom:2}}>{r}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:'#2a1800'}}>{n}</div>
            </div>
          ))}
        </div>
      </Card>
      <CaseStrengthBadge strength={strength}/>
      <BigBtn onClick={()=>advance(strength==='weak'?'mediation_offer':'gravedad')} col="#cc1a00">COMENZAR CASO</BigBtn>
    </div>
  )

  if(fase==='mediation_offer') return (
    <div>{hdr}
      <MediationOfferScreen demName={demName} defName={defName} mediationAmount={mediationAmount} gc={gc}
        onGoAll={()=>advance('gravedad')} onPropose={()=>advance('mediation_handoff')}/>
    </div>
  )

  if(fase==='mediation_handoff') return (
    <MediationHandoffScreen to={defName} from={demName} mediationAmount={mediationAmount} onReady={()=>advance('mediation_response')}/>
  )

  if(fase==='mediation_response') return (
    <MediationResponseScreen defName={defName} demName={demName} mediationAmount={mediationAmount}
      onAccept={()=>onResult({ch,gc,demIs,mediationAccepted:true,mediationAmount})}
      onReject={()=>advance('gravedad')}/>
  )

  if(fase==='gravedad') return (
    <div>{hdr}
      <FaseScreen key="gravedad" title="¿QUÉ TAN GRAVE ES?" sub={`${demName} — evaluá la situación`}
        gc={gc} field="gravedad" onPick={id=>pick('gravedad',id,'prueba')}/>
    </div>
  )

  if(fase==='prueba') return (
    <div>{hdr}
      <PruebaScreen key="prueba" gc={gc} selected={ch.prueba}
        onToggle={id=>setCh(c=>({...c,prueba:c.prueba.includes(id)?c.prueba.filter(x=>x!==id):c.prueba.length<3?[...c.prueba,id]:c.prueba}))}
        onConfirm={()=>advance('forma')}/>
    </div>
  )

  if(fase==='forma') return (
    <div>{hdr}
      <FaseScreen key="forma" title="¿CÓMO LO PLANTEÁS?" sub={`${demName} — forma de presentar`}
        gc={gc} field="forma" onPick={id=>pick('forma',id,'handoff')}/>
    </div>
  )

  if(fase==='handoff') return <HandoffScreen to={defName} liveCs={liveCs} onReady={()=>advance('respuesta')}/>

  if(fase==='respuesta') return (
    <div>{hdr}
      <div style={{background:'rgba(100,5,5,0.1)',border:'1px solid rgba(180,30,0,.3)',borderRadius:3,padding:'7px 12px',marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:12,color:'#cc7070',letterSpacing:1}}>DEMANDA RECIBIDA POR</span>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:'#cc1a00'}}>{fmt(liveCs)}</span>
      </div>
      <TimerBar seconds={60} runKey={tk} onTimeout={()=>handleTimeout('respuesta','argumento')}/>
      <FaseScreen key="respuesta" title="¿CÓMO RESPONDÉS?" sub={`${defName} — tu primera jugada`}
        gc={gc} field="respuesta"
        onMountTimer={(hp,dr)=>{pickRef.current=hp;doneRef.current=dr}}
        onPick={id=>pick('respuesta',id,'argumento')}/>
    </div>
  )

  if(fase==='argumento') return (
    <div>{hdr}
      <div style={{background:'rgba(100,5,5,0.1)',border:'1px solid rgba(180,30,0,.3)',borderRadius:3,padding:'7px 12px',marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:12,color:'#cc7070',letterSpacing:1}}>DEFENDÉS CONTRA</span>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:'#cc1a00'}}>{fmt(liveCs)}</span>
      </div>
      <TimerBar seconds={60} runKey={tk} onTimeout={()=>handleTimeout('argumento','escalada')}/>
      <FaseScreen key="argumento" title="TU ARGUMENTO" sub={`${defName} — reforzá tu posición`}
        gc={gc} field="argumento"
        onMountTimer={(hp,dr)=>{pickRef.current=hp;doneRef.current=dr}}
        onPick={id=>pick('argumento',id,'escalada')}/>
    </div>
  )

  if(fase==='escalada') return (
    <div>{hdr}
      <div style={{background:'rgba(100,5,5,0.1)',border:'1px solid rgba(180,30,0,.3)',borderRadius:3,padding:'7px 12px',marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:12,color:'#cc7070',letterSpacing:1}}>DECISIÓN FINAL — CASO POR</span>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:'#cc1a00'}}>{fmt(liveCs)}</span>
      </div>
      <TimerBar seconds={60} runKey={tk} onTimeout={()=>handleTimeout('escalada',null,true)}/>
      <FaseScreen key="escalada" title="DECISIÓN FINAL" sub={`${defName} — última jugada`}
        gc={gc} field="escalada"
        onMountTimer={(hp,dr)=>{pickRef.current=hp;doneRef.current=dr}}
        onPick={id=>pick('escalada',id,null,true)}/>
    </div>
  )

  return <div/>
}

/* ═══════════════════════════════════════════
   RESULT SCREENS
═══════════════════════════════════════════ */
function CasoResultScreen({gc, demName, defName, stacks, choices, matchSc, matchMon, idx, total, onNext, mediation, mediationAmount}) {
  const {cs,ds}=stacks
  const demGano=cs>ds; const empate=cs===ds
  const transfer=mediation?mediationAmount:calcTransfer(cs,ds)
  const [show,setShow]=useState(false)
  useEffect(()=>{const t=setTimeout(()=>setShow(true),500);return()=>clearTimeout(t)},[])
  const lbl=(field,id)=>gc[field]?.find(x=>x.id===id)?.lbl||'—'

  return (
    <div>
      <div style={{textAlign:'center',marginBottom:16}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",border:`3px solid ${mediation?'#16a34a':demGano?'#cc1a00':empate?'#888':'#0066cc'}`,color:mediation?'#16a34a':demGano?'#cc1a00':empate?'#888':'#0066cc',padding:'4px 18px',borderRadius:3,fontSize:20,display:'inline-block',transform:'rotate(-2deg)',letterSpacing:3}}>
          {mediation?'MEDIACIÓN ACEPTADA':empate?'EMPATE':demGano?`GANA ${demName.split(' ')[0].toUpperCase()}`:`GANA ${defName.split(' ')[0].toUpperCase()}`}
        </span>
      </div>

      <Card st={{marginBottom:14,textAlign:'center'}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:2,color:'#5a3a10',marginBottom:12}}>
          {mediation?'ACUERDO EXTRAJUDICIAL':'VALOR DE LAS JUGADAS'}
        </div>
        {!mediation&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:8,alignItems:'center',marginBottom:show?12:0}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:9,color:'#5a3a10',letterSpacing:1,marginBottom:3}}>DEMANDA</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:'#cc1a00',marginBottom:3}}>{demName.split(' ')[0].toUpperCase()}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:show?22:0,color:(demGano&&!empate)?'#cc1a00':'#5a4a30',transition:'font-size .6s ease',overflow:'hidden'}}>{fmt(cs)}</div>
              {(demGano&&!empate)&&show&&<div style={{fontSize:18,marginTop:4}}>🏆</div>}
            </div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:'#8a7a60'}}>VS</div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:9,color:'#5a3a10',letterSpacing:1,marginBottom:3}}>DEFENSA</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:'#0066cc',marginBottom:3}}>{defName.split(' ')[0].toUpperCase()}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:show?22:0,color:(!demGano&&!empate)?'#0066cc':'#5a4a30',transition:'font-size .6s ease',overflow:'hidden'}}>{fmt(ds)}</div>
              {(!demGano&&!empate)&&show&&<div style={{fontSize:18,marginTop:4}}>🏆</div>}
            </div>
          </div>
        )}
        {mediation&&show&&(
          <div style={{marginBottom:12}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:'#16a34a',marginBottom:4}}>{fmt(mediationAmount)}</div>
            <div style={{fontSize:12,color:'#5a3a10'}}>{defName.split(' ')[0]} pagó sin ir a juicio</div>
          </div>
        )}
        {show&&!empate&&(
          <div style={{background:'rgba(0,0,0,.07)',borderRadius:3,padding:'8px 12px',borderLeft:`3px solid ${mediation?'#16a34a':demGano?'#cc1a00':'#0066cc'}`}}>
            <span style={{fontSize:13,color:'#3a2000'}}>
              {mediation||demGano?defName.split(' ')[0]:demName.split(' ')[0]} le pagó{' '}
              <strong style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18}}>{fmt(transfer)}</strong>
              {' '}a {mediation||demGano?demName.split(' ')[0]:defName.split(' ')[0]}
            </span>
          </div>
        )}
        {show&&choices.timeout&&<div style={{marginTop:8,background:'rgba(180,0,0,.1)',borderRadius:3,padding:'6px 10px',fontSize:12,color:'#cc1a00'}}>Penalización por tiempo agotado</div>}
      </Card>

      {show&&!mediation&&(
        <Card st={{marginBottom:14}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:'#3a2800',letterSpacing:1,marginBottom:10}}>ASÍ JUGARON</div>
          <div style={{fontSize:12,color:'#3a2000',lineHeight:2.1}}>
            <div><strong>{demName.split(' ')[0]}</strong> · Gravedad: <em>{lbl('gravedad',choices.gravedad)}</em></div>
            <div><strong>{demName.split(' ')[0]}</strong> · Forma: <em>{lbl('forma',choices.forma)}</em></div>
            <Divider/>
            <div><strong>{defName.split(' ')[0]}</strong> · Respuesta: <em>{lbl('respuesta',choices.respuesta)}</em></div>
            <div><strong>{defName.split(' ')[0]}</strong> · Argumento: <em>{lbl('argumento',choices.argumento)}</em></div>
            <div><strong>{defName.split(' ')[0]}</strong> · Escalada: <em>{lbl('escalada',choices.escalada)}</em></div>
          </div>
        </Card>
      )}

      <Card st={{marginBottom:16,textAlign:'center'}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,letterSpacing:2,color:'#5a3a10',marginBottom:10}}>SALDOS ACTUALES</div>
        <div style={{display:'flex',justifyContent:'center',gap:28,alignItems:'center'}}>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:'#cc1a00',marginBottom:2}}>{demName.split(' ')[0].toUpperCase()}</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:'#cc1a00'}}>{fmt(matchMon.p1)}</div>
            <div style={{fontSize:10,color:'#6a4a20'}}>{matchSc.p1} casos</div>
          </div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,color:'#8a7a60'}}>·</div>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:'#0066cc',marginBottom:2}}>{defName.split(' ')[0].toUpperCase()}</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:'#0066cc'}}>{fmt(matchMon.p2)}</div>
            <div style={{fontSize:10,color:'#6a4a20'}}>{matchSc.p2} casos</div>
          </div>
        </div>
      </Card>
      <BigBtn onClick={onNext} col={idx>=total-1?'#cc1a00':'#7a5000'}>{idx>=total-1?'VER RESULTADO FINAL':'SIGUIENTE CASO'}</BigBtn>
    </div>
  )
}

function MatchResultScreen({n1, n2, matchSc, matchMon, onReset}) {
  const p1W=matchSc.p1>matchSc.p2; const empate=matchSc.p1===matchSc.p2
  return (
    <div style={{textAlign:'center',paddingTop:24}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:44,color:'#d4a030',lineHeight:1,marginBottom:8}}>DECISIÓN<br/>FINAL</div>
      <div style={{fontSize:64,marginBottom:16}}>{p1W?'🏆':empate?'⚖️':'💀'}</div>
      <Card st={{marginBottom:20}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:p1W?'#cc1a00':empate?'#888':'#0066cc',marginBottom:16}}>
          {empate?'EMPATE':`GANA ${(p1W?n1:n2).split(' ')[0].toUpperCase()}`}
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:28,marginBottom:16}}>
          {[[n1,matchSc.p1,matchMon.p1,p1W&&!empate,'#cc1a00'],[n2,matchSc.p2,matchMon.p2,!p1W&&!empate,'#0066cc']].map(([n,w,m,isW,c])=>(
            <div key={n} style={{textAlign:'center'}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:isW?c:'#8a7a60',marginBottom:3}}>{n.split(' ')[0].toUpperCase()}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52,color:isW?c:'#5a4a30'}}>{w}</div>
              <div style={{fontSize:11,color:'#6a4a20'}}>casos ganados</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:m>=START_MONEY?'#16a34a':'#cc1a00',marginTop:4}}>{fmt(m)} {m>=START_MONEY?'▲':'▼'}</div>
            </div>
          ))}
        </div>
        <div style={{background:'rgba(0,0,0,.07)',borderRadius:3,padding:'10px 14px',borderLeft:'3px solid #d4a030',fontSize:13,color:'#3a2000'}}>
          {empate?'Los saldos terminaron equilibrados.':`${(p1W?n2:n1).split(' ')[0]} pagó en total ${fmt(Math.abs(matchMon.p1-matchMon.p2))}`}
        </div>
      </Card>
      <BigBtn onClick={onReset} col="#cc1a00">NUEVA PARTIDA</BigBtn>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN SCREENS
═══════════════════════════════════════════ */
/* ═══════════════════════════════════════════
   SPLASH SCREEN — portada estilo PDF
═══════════════════════════════════════════ */
function SplashScreen({onStart}) {
  const paperStyle = {
    position:'relative',
    background:'linear-gradient(148deg,#e8d090,#c8a048)',
    borderRadius:3,
    padding:'44px 36px 120px',
    maxWidth:440,
    width:'100%',
    boxShadow:'0 12px 48px rgba(0,0,0,.75)',
  }
  const titleStyle = {
    fontFamily:"'Bebas Neue',sans-serif",
    fontSize:72,
    lineHeight:.88,
    color:'#0f0800',
    marginBottom:18,
    letterSpacing:2,
  }
  const subtitleBoxStyle = {
    background:'rgba(255,255,255,.72)',
    padding:'5px 10px',
    marginBottom:32,
    display:'inline-block',
  }
  const subtitleStyle = {
    fontFamily:"'Special Elite',serif",
    fontSize:13,
    color:'#1a0800',
  }
  const stampoStyle = {
    position:'absolute',
    bottom:68,
    left:36,
    border:'5px solid rgba(180,20,0,.82)',
    borderRadius:6,
    padding:'6px 18px',
    transform:'rotate(-9deg)',
  }
  const stampoTextStyle = {
    fontFamily:"'Bebas Neue',sans-serif",
    fontSize:40,
    color:'rgba(180,20,0,.82)',
    letterSpacing:5,
    lineHeight:1,
  }
  const postitStyle = {
    position:'absolute',
    bottom:28,
    right:28,
    background:'#f060a8',
    width:108,
    height:108,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    cursor:'pointer',
    boxShadow:'3px 4px 12px rgba(0,0,0,.35)',
    transform:'rotate(4deg)',
    userSelect:'none',
  }
  const postitLabelStyle = {
    fontFamily:"'Bebas Neue',sans-serif",
    fontSize:22,
    color:'#1a0800',
    letterSpacing:3,
  }
  const smileStyle = {
    width:36,
    height:36,
    borderRadius:'50%',
    border:'2.5px solid #1a0800',
    position:'relative',
    marginBottom:4,
    flexShrink:0,
  }
  const eyeStyle = {
    position:'absolute',
    top:10,
    width:4,
    height:4,
    borderRadius:'50%',
    background:'#1a0800',
  }
  const mouthStyle = {
    position:'absolute',
    bottom:7,
    left:'50%',
    transform:'translateX(-50%)',
    width:18,
    height:9,
    borderBottom:'2.5px solid #1a0800',
    borderLeft:'2.5px solid #1a0800',
    borderRight:'2.5px solid #1a0800',
    borderTop:'none',
    borderRadius:'0 0 12px 12px',
  }
  const clip1 = {position:'absolute',top:-8,right:40,width:3,height:28,background:'#888',borderRadius:2,transform:'rotate(8deg)'}
  const clip2 = {position:'absolute',top:-6,right:52,width:3,height:24,background:'#999',borderRadius:2,transform:'rotate(5deg)'}
  const dot1 = {position:'absolute',top:16,right:16,width:14,height:14,background:'#4ecfb0',borderRadius:2,opacity:.7}
  const dot2 = {position:'absolute',top:32,right:16,width:14,height:14,background:'#f06040',borderRadius:2,opacity:.7}
  const dot3 = {position:'absolute',top:16,right:32,width:14,height:14,background:'#f0c020',borderRadius:2,opacity:.7}

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'#1a0e05'}}>
      <div style={paperStyle}>
        <div style={clip1}/>
        <div style={clip2}/>
        <div style={dot1}/>
        <div style={dot2}/>
        <div style={dot3}/>
        <h1 style={titleStyle}>EL JUEGO DE<br/>LA DEMANDA</h1>
        <div style={subtitleBoxStyle}>
          <p style={subtitleStyle}>Mandar la carta es facil. Mandarla bien es el juego.</p>
        </div>
        <div style={stampoStyle}>
          <div style={stampoTextStyle}>URGENTE</div>
        </div>
        <div onClick={onStart} style={postitStyle}>
          <div style={smileStyle}>
            <div style={{...eyeStyle,left:8}}/>
            <div style={{...eyeStyle,right:8}}/>
            <div style={mouthStyle}/>
          </div>
          <div style={postitLabelStyle}>JUGAR</div>
        </div>
      </div>
    </div>
  )
}

function RegisterScreen({onDone}) {
  const [name,setName]=useState('')
  const go=()=>{if(name.trim().length<4)return;onDone(loadP(name.trim()))}
  return (
    <div style={{paddingTop:48,textAlign:'center'}}>
      <div style={{fontSize:11,letterSpacing:3,color:'#6a5a40',marginBottom:12}}>CORREO ARGENTINO · CARTA DOCUMENTO</div>
      <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:56,color:'#d4a030',lineHeight:1,marginBottom:6}}>EL JUEGO<br/>DE LA DEMANDA</h1>
      <div style={{width:60,height:2,background:'#8a5a00',margin:'0 auto 16px'}}/>
      <p style={{fontSize:14,color:'#c49040',fontStyle:'italic',marginBottom:40,lineHeight:1.6}}>"No gana el que más demanda.<br/>Gana el que mejor decide."</p>
      <Card st={{textAlign:'left',marginBottom:20}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,color:'#3a2800',letterSpacing:2,marginBottom:12,borderBottom:'1px solid rgba(160,112,48,.3)',paddingBottom:10}}>IDENTIFICACIÓN DEL LITIGANTE</div>
        <label style={{fontSize:11,color:'#5a3a10',letterSpacing:1,display:'block',marginBottom:6}}>NOMBRE COMPLETO</label>
        <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="Ej: María González"
          style={{width:'100%',padding:'12px 14px',background:'#f5e8c0',border:'1px solid #a07030',borderRadius:3,fontSize:15,color:'#1a0a00',outline:'none',fontFamily:"'Special Elite',serif"}}/>
        <div style={{fontSize:11,color:'#8a7a60',marginTop:6}}>Aparecerá en todas tus demandas</div>
      </Card>
      <BigBtn onClick={go} disabled={name.trim().length<4} col="#8a5a00">INGRESAR AL TRIBUNAL</BigBtn>
    </div>
  )
}

function HomeScreen({p1, onLocal, onOnline, onChange}) {
  return (
    <div style={{paddingTop:20}}>
      <Card st={{marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
          <div style={{width:46,height:46,borderRadius:'50%',background:'#5a2800',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:17,color:'#f5c060',border:'2px solid #8a5000'}}>
            {p1.name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
          </div>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:'#2a1800',letterSpacing:1}}>{p1.name}</div>
            <Stamp>LITIGANTE ACTIVO</Stamp>
          </div>
        </div>
        <Divider/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
          {[['SALDO',fmt(p1.money)],['VICTORIAS',p1.wins],['DERROTAS',p1.losses],['RACHA',p1.streak+'🔥']].map(([l,v])=>(
            <div key={l} style={{textAlign:'center',background:'rgba(0,0,0,.06)',borderRadius:3,padding:'8px 4px'}}>
              <div style={{fontSize:8,color:'#5a3a10',letterSpacing:1,marginBottom:2}}>{l}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,color:'#2a1800'}}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
        <Card st={{textAlign:'center',borderTop:'3px solid #cc1a00',padding:'16px 10px'}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:'#8a7a60',letterSpacing:2,marginBottom:8}}>MODO</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:'#2a1800',marginBottom:4}}>LOCAL</div>
          <div style={{fontSize:11,color:'#5a3a10',marginBottom:12,lineHeight:1.5}}>6 casos · Mismo dispositivo</div>
          <button onClick={onLocal} style={{background:'#cc1a00',color:'#fff',border:'none',padding:'10px 0',borderRadius:3,width:'100%',cursor:'pointer',fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:3}}>JUGAR</button>
        </Card>
        <Card st={{textAlign:'center',borderTop:'3px solid #0066cc',padding:'16px 10px'}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:'#8a7a60',letterSpacing:2,marginBottom:8}}>MODO</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:'#2a1800',marginBottom:4}}>ONLINE</div>
          <div style={{fontSize:11,color:'#5a3a10',marginBottom:12,lineHeight:1.5}}>Retar por WhatsApp</div>
          <button onClick={onOnline} style={{background:'#0066cc',color:'#fff',border:'none',padding:'10px 0',borderRadius:3,width:'100%',cursor:'pointer',fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:3}}>RETAR</button>
        </Card>
      </div>
      <button onClick={onChange} style={{background:'none',border:'none',color:'#6a5a40',fontSize:12,cursor:'pointer',textDecoration:'underline',display:'block',textAlign:'center',width:'100%'}}>
        No soy {p1.name.split(' ')[0]} · Cambiar perfil
      </button>
    </div>
  )
}

function OnlineScreen({p1, onBack}) {
  const [sent,setSent]=useState(false)
  const caseId=useRef(Math.floor(Math.random()*CASOS.length))
  const challengeId=useRef(Math.random().toString(36).slice(2,8).toUpperCase())
  const gc=CASOS[caseId.current]
  const sendWhatsApp=()=>{
    const appUrl=window.location.href.split('?')[0]+'?challenge='+challengeId.current
    const msg=encodeURIComponent(`⚖️ *${p1.name} te inició una DEMANDA* ⚖️\n\n📋 Caso: _"${gc.titulo}"_\n\nTenés 24hs para responder:\n${appUrl}\n\n_(No es un virus 😂 — es El Juego de la Demanda)_`)
    window.open(`https://wa.me/?text=${msg}`,'_blank')
    setSent(true)
  }
  return (
    <div style={{paddingTop:16}}>
      <div style={{textAlign:'center',marginBottom:20}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,letterSpacing:3,color:'#8a7a60',marginBottom:4}}>MODO ONLINE</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:'#d4a030'}}>RETAR POR WHATSAPP</div>
      </div>
      <Card st={{marginBottom:16,borderTop:'3px solid #0066cc'}}>
        <div style={{display:'flex',gap:8,marginBottom:8}}><Stamp col="#0066cc">{gc.cat}</Stamp></div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:'#2a1800',marginBottom:6}}>{gc.titulo}</div>
        <p style={{fontSize:13,color:'#5a3a10',lineHeight:1.5}}>{gc.desc}</p>
      </Card>
      {!sent?<BigBtn onClick={sendWhatsApp} col="#25D366">ABRIR WHATSAPP Y ENVIAR RETO</BigBtn>
        :<Card st={{textAlign:'center',borderTop:'3px solid #25D366'}}>
          <div style={{fontSize:36,marginBottom:8}}>✅</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:'#2a1800',marginBottom:4}}>RETO ENVIADO</div>
          <div style={{fontSize:13,color:'#5a3a10'}}>Esperás que tu rival acepte la demanda</div>
        </Card>}
      <div style={{marginTop:12,textAlign:'center'}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:'#6a5a40',fontSize:12,cursor:'pointer',textDecoration:'underline'}}>← Volver</button>
      </div>
    </div>
  )
}

function SetupScreen({p1, onDone}) {
  const [name,setName]=useState('')
  return (
    <div style={{paddingTop:24}}>
      <div style={{textAlign:'center',marginBottom:20}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:'#d4a030',marginBottom:4}}>NUEVA PARTIDA</div>
        <div style={{fontSize:13,color:'#8a7a60'}}>Pasale el teléfono para que ingrese su nombre</div>
      </div>
      <Card st={{marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:'#5a2800',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:'#f5c060',border:'1px solid #8a5000'}}>
            {p1.name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
          </div>
          <div>
            <div style={{fontSize:9,color:'#8a7a60',letterSpacing:1}}>JUGADOR 1</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:'#2a1800'}}>{p1.name}</div>
          </div>
        </div>
        <Divider/>
        <label style={{fontSize:11,color:'#5a3a10',letterSpacing:1,display:'block',marginBottom:6}}>NOMBRE DEL RIVAL</label>
        <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&name.trim().length>=4&&onDone(name.trim())} placeholder="Nombre completo del rival"
          style={{width:'100%',padding:'12px 14px',background:'#f5e8c0',border:'1px solid #a07030',borderRadius:3,fontSize:15,color:'#1a0a00',outline:'none',fontFamily:"'Special Elite',serif"}}/>
      </Card>
      <BigBtn onClick={()=>onDone(name.trim())} disabled={name.trim().length<4} col="#cc1a00">COMENZAR PARTIDA</BigBtn>
    </div>
  )
}

function CaseSelectScreen({demName, onSelect}) {
  const [selected, setSelected] = useState(null)
  const catColors = {'AMIGOS':'#e07700','PAREJA':'#cc1a00','DIGITAL':'#0066cc','CONVIVENCIA':'#16a34a','CONSUMO':'#7c3aed','SOCIAL':'#db2777','TRABAJO':'#0891b2','VECINOS':'#b45309','PRESTAMO':'#dc2626'}
  const getCatColor = (cat) => { const k=Object.keys(catColors).find(k=>cat.includes(k)); return k?catColors[k]:'#8a5a00' }
  return (
    <div>
      <div style={{textAlign:'center',marginBottom:20}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:'#8a7a60',letterSpacing:3,marginBottom:6}}>ELEGÍ EL CONFLICTO</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:'#d4a030',marginBottom:4}}>DE QUE DEMANDAS?</div>
        <div style={{fontSize:13,color:'#8a7a60'}}>{demName} — elegí el caso que vas a iniciar</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
        {CASOS.map(gc=>{
          const isSel=selected===gc.id
          const col=getCatColor(gc.cat)
          return (
            <button key={gc.id} onClick={()=>setSelected(isSel?null:gc.id)} style={{background:isSel?'#2a1200':'#c49040',border:`2px solid ${isSel?col:'#a07030'}`,borderRadius:4,padding:'12px 14px',textAlign:'left',width:'100%',cursor:'pointer',transition:'all .2s'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{background:isSel?col:'rgba(0,0,0,.12)',borderRadius:3,padding:'2px 8px',flexShrink:0}}>
                  <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:isSel?'#fff':'#5a3a10',letterSpacing:2}}>{gc.cat.split(' ')[0]}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:isSel?'#f5c060':'#2a1800',letterSpacing:1,marginBottom:2}}>{gc.titulo}</div>
                  <div style={{fontSize:11,color:isSel?'#c49040':'#5a3a10',lineHeight:1.4}}>{gc.desc.length>80?gc.desc.slice(0,80)+'…':gc.desc}</div>
                </div>
                {isSel&&<div style={{width:10,height:10,borderRadius:'50%',background:col,flexShrink:0}}/>}
              </div>
            </button>
          )
        })}
      </div>
      <BigBtn onClick={()=>selected!==null&&onSelect(selected)} disabled={selected===null} col="#cc1a00">INICIAR ESTE CASO</BigBtn>
    </div>
  )
}

function WelcomeScreen({n1, n2, startsWith, juzgado, exp, onStart}) {
  return (
    <div style={{textAlign:'center',paddingTop:24}}>
      <div style={{fontSize:11,color:'#6a5a40',letterSpacing:3,marginBottom:12}}>REPÚBLICA ARGENTINA</div>
      <Card st={{marginBottom:20,borderTop:'4px solid #cc1a00'}}>
        <div style={{marginBottom:14,display:'flex',justifyContent:'center',gap:8,flexWrap:'wrap'}}>
          <Stamp>JUZGADO CIVIL N° {juzgado}</Stamp>
          <Stamp col="#0066cc" angle={2}>EXP. {exp}</Stamp>
        </div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:'#2a1800',marginBottom:12}}>BIENVENIDOS AL HONORABLE JUZGADO</div>
        <div style={{fontSize:14,color:'#4a3010',marginBottom:16,lineHeight:1.9}}>
          Se inician actuaciones en la causa<br/>
          <strong style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,color:'#cc1a00'}}>{n1}</strong>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,color:'#8a7a60',margin:'0 8px'}}>vs</span>
          <strong style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,color:'#0066cc'}}>{n2}</strong>
        </div>
        <Divider/>
        <div style={{background:'rgba(0,0,0,.05)',borderRadius:3,padding:'10px 14px',marginBottom:12}}>
          <div style={{fontSize:10,color:'#6a4a20',letterSpacing:1,marginBottom:4}}>COMIENZA CON LA PRIMERA DEMANDA</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:'#cc1a00'}}>{startsWith}</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {[[n1,'#cc1a00'],[n2,'#0066cc']].map(([n,c])=>(
            <div key={n} style={{background:`rgba(${c==='#cc1a00'?'200,60,0':'0,60,200'},.07)`,borderRadius:3,padding:'8px 10px',borderLeft:`3px solid ${c}`}}>
              <div style={{fontSize:9,color:'#8a7a60',letterSpacing:1,marginBottom:2}}>SALDO INICIAL</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:17,color:c}}>{n.split(' ')[0]}: $50.000</div>
            </div>
          ))}
        </div>
      </Card>
      <BigBtn onClick={onStart} col="#cc1a00">QUE COMIENCE EL JUICIO</BigBtn>
    </div>
  )
}

/* ═══════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════ */
export default function App() {
  const [scr,setScr]=useState('splash')
  const [p1,setP1]=useState(null)
  const [p2name,setP2name]=useState('')
  const [order,setOrder]=useState([])
  const [idx,setIdx]=useState(0)
  const [demIs,setDemIs]=useState('p1')
  const [matchSc,setMatchSc]=useState({p1:0,p2:0})
  const [matchMon,setMatchMon]=useState({p1:START_MONEY,p2:START_MONEY})
  const [lastResult,setLastResult]=useState(null)
  const [juzgado]=useState(1000+Math.floor(Math.random()*8999))
  const [exp]=useState(`${Math.floor(10000000+Math.random()*89999999)}-${Math.floor(Math.random()*9)}`)
  const [starter,setStarter]=useState('p1')

  const startGame=(p2n)=>{
    setP2name(p2n)
    const s=Math.random()<.5?'p1':'p2'
    setStarter(s); setDemIs(s)
    setScr('caseselect')
  }

  const onCaseSelected=(caseId)=>{
    // Put selected case first, then shuffle the rest
    const rest=shuffle(Array.from({length:CASOS.length},(_,i)=>i).filter(i=>i!==caseId))
    setOrder([caseId, ...rest.slice(0,TOTAL_CASES-1)])
    setScr('welcome')
  }

  const onResult=({ch,gc,demIs:di,mediationAccepted,mediationAmount:mAmt})=>{
    let newMon={...matchMon}; let newSc={...matchSc}
    if(mediationAccepted){
      if(di==='p1'){newSc.p1++;newMon.p1+=mAmt;newMon.p2-=mAmt}
      else{newSc.p2++;newMon.p2+=mAmt;newMon.p1-=mAmt}
      newMon.p1=Math.max(0,newMon.p1); newMon.p2=Math.max(0,newMon.p2)
      setMatchSc(newSc); setMatchMon(newMon)
      setLastResult({ch,stacks:{cs:mAmt,ds:0},gc,demIs:di,mediation:true,mediationAmount:mAmt})
      setScr('casoResult'); return
    }
    const stacks=calcStacks(gc,ch)
    const {cs,ds}=stacks; const demGano=cs>ds; const empate=cs===ds
    const transfer=empate?0:calcTransfer(cs,ds)
    if(!empate){
      if(demGano){if(di==='p1'){newSc.p1++;newMon.p1+=transfer;newMon.p2-=transfer}else{newSc.p2++;newMon.p2+=transfer;newMon.p1-=transfer}}
      else{if(di==='p1'){newSc.p2++;newMon.p2+=transfer;newMon.p1-=transfer}else{newSc.p1++;newMon.p1+=transfer;newMon.p2-=transfer}}
    }
    newMon.p1=Math.max(0,newMon.p1); newMon.p2=Math.max(0,newMon.p2)
    setMatchSc(newSc); setMatchMon(newMon)
    setLastResult({ch,stacks,gc,demIs:di})
    setScr('casoResult')
  }

  const onNext=()=>{
    if(idx>=TOTAL_CASES-1){
      if(p1){const p1W=matchSc.p1>matchSc.p2;const gained=matchMon.p1-START_MONEY;saveP({...p1,wins:p1.wins+(p1W?1:0),losses:p1.losses+(matchSc.p1<matchSc.p2?1:0),money:p1.money+gained,streak:p1W?p1.streak+1:0,best:Math.max(p1.best,p1W?p1.streak+1:p1.streak)})}
      setScr('matchResult'); return
    }
    setIdx(i=>i+1); setDemIs(d=>d==='p1'?'p2':'p1'); setLastResult(null); setScr('game')
  }

  const reset=()=>{setIdx(0);setDemIs('p1');setMatchSc({p1:0,p2:0});setMatchMon({p1:START_MONEY,p2:START_MONEY});setLastResult(null);setP2name('');setScr('home')}
  const demName=lastResult?(lastResult.demIs==='p1'?p1?.name:p2name):''
  const defName=lastResult?(lastResult.demIs==='p1'?p2name:p1?.name):''

  return (
    <div style={{minHeight:'100vh',background:'#1a0e05'}}>
      {scr!=='register'&&scr!=='splash'&&scr!=='caseselect'&&(
        <div style={{background:'#0f0803',borderBottom:'1px solid #5a3a10',padding:'10px 16px',position:'sticky',top:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:'#d4a030',letterSpacing:3}}>LA DEMANDA</div>
          {p1&&<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,color:'#8a7a60',letterSpacing:1}}>{p1.name.split(' ')[0].toUpperCase()} · {fmt(p1.money)}</div>}
        </div>
      )}
      {scr==='splash'
        ? <SplashScreen onStart={()=>setScr('register')}/>
        : <div style={{maxWidth:640,margin:'0 auto',padding:'16px 14px 80px'}}>
        {scr==='register'&&<RegisterScreen onDone={p=>{setP1(p);setScr('home')}}/>}
        {scr==='home'&&p1&&<HomeScreen p1={p1} onLocal={()=>setScr('setup')} onOnline={()=>setScr('online')} onChange={()=>{setP1(null);setScr('register')}}/>}
        {scr==='online'&&p1&&<OnlineScreen p1={p1} onBack={()=>setScr('home')}/>}
        {scr==='setup'&&p1&&<SetupScreen p1={p1} onDone={n=>startGame(n)}/>}
        {scr==='caseselect'&&p1&&p2name&&<CaseSelectScreen demName={demIs==='p1'?p1.name:p2name} onSelect={onCaseSelected}/>}
        {scr==='welcome'&&p1&&p2name&&<WelcomeScreen n1={p1.name} n2={p2name} startsWith={starter==='p1'?p1.name:p2name} juzgado={juzgado} exp={exp} onStart={()=>setScr('game')}/>}
        {scr==='game'&&p1&&p2name&&order.length>0&&<GameScreen key={idx} p1={p1} p2name={p2name} idx={idx} order={order} demIs={demIs} matchSc={matchSc} matchMon={matchMon} onResult={onResult} total={TOTAL_CASES}/>}
        {scr==='casoResult'&&lastResult&&<CasoResultScreen gc={lastResult.gc} demName={demName} defName={defName} stacks={lastResult.stacks} choices={lastResult.ch} matchSc={matchSc} matchMon={matchMon} idx={idx} total={TOTAL_CASES} onNext={onNext} mediation={lastResult.mediation} mediationAmount={lastResult.mediationAmount}/>}
        {scr==='matchResult'&&<MatchResultScreen n1={p1 ? p1.name : ''} n2={p2name} matchSc={matchSc} matchMon={matchMon} onReset={reset}/>}
      </div>
      }
    </div>
  )
}
