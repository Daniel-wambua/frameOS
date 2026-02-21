'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import FrameOSLogo from '@/components/FrameOSLogo';

/* ═══════════════════════════════════════════════════════════════
   useMounted — guarantees identical SSR + first-client render
═══════════════════════════════════════════════════════════════ */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

/* ═══════════════════════════════════════════════════════════════
   useReveal — IntersectionObserver scroll reveal
═══════════════════════════════════════════════════════════════ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ═══════════════════════════════════════════════════════════════
   Global CSS (keyframes + utilities)
═══════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @keyframes ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes floaty   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes gradmove { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes pulsering{
    0%  { box-shadow: 0 0 0 0   rgba(124,58,237,.55); }
    70% { box-shadow: 0 0 0 14px rgba(124,58,237,0);  }
    100%{ box-shadow: 0 0 0 0   rgba(124,58,237,0);   }
  }
  .hero-text {
    background: linear-gradient(115deg,#f1f5f9 0%,#c4b5fd 40%,#818cf8 72%,#93c5fd 100%);
    background-size: 220% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradmove 7s ease infinite;
  }
  .reveal > * {
    opacity:0; transform:translateY(22px);
    transition: opacity .5s ease, transform .5s ease;
  }
  .reveal.on > *:nth-child(1){opacity:1;transform:none;transition-delay:.00s}
  .reveal.on > *:nth-child(2){opacity:1;transform:none;transition-delay:.07s}
  .reveal.on > *:nth-child(3){opacity:1;transform:none;transition-delay:.14s}
  .reveal.on > *:nth-child(4){opacity:1;transform:none;transition-delay:.21s}
  .reveal.on > *:nth-child(5){opacity:1;transform:none;transition-delay:.28s}
  .reveal.on > *:nth-child(6){opacity:1;transform:none;transition-delay:.35s}
  .fcard { transition: box-shadow .25s, transform .25s; }
  .fcard:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 0 1px rgba(167,139,250,.18), 0 12px 48px rgba(124,58,237,.15);
  }
  .cta-btn { transition: transform .18s, box-shadow .18s; }
  .cta-btn:hover  { transform:translateY(-1px); box-shadow:0 0 44px rgba(124,58,237,.5); }
  .cta-btn:active { transform:translateY(0);    box-shadow:none; }
`;

/* ═══════════════════════════════════════════════════════════════
   Static sub-components
═══════════════════════════════════════════════════════════════ */

function Reveal({ children, className = '', style = {} }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  const { ref, visible } = useReveal();
  return <div ref={ref} className={`reveal ${visible ? 'on' : ''} ${className}`} style={style}>{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color:'#a78bfa', fontSize:11, fontWeight:800,
      textTransform:'uppercase', letterSpacing:'0.18em', marginBottom:12 }}>
      {children}
    </p>
  );
}

/* ── MacWindow chrome ── */
function Win({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      borderRadius:16, overflow:'hidden',
      border:'1px solid rgba(255,255,255,.08)',
      background:'#0e0e1c',
      boxShadow:'0 32px 80px rgba(0,0,0,.55)',
      ...style,
    }}>
      <div style={{
        height:36, display:'flex', alignItems:'center', gap:6, padding:'0 14px',
        background:'rgba(14,14,28,.95)',
        borderBottom:'1px solid rgba(255,255,255,.05)',
      }}>
        <span style={{ width:12,height:12,borderRadius:'50%',background:'#ff5f57',boxShadow:'inset 0 0 0 1px rgba(0,0,0,.2)' }} />
        <span style={{ width:12,height:12,borderRadius:'50%',background:'#febc2e',boxShadow:'inset 0 0 0 1px rgba(0,0,0,.2)' }} />
        <span style={{ width:12,height:12,borderRadius:'50%',background:'#28c840',boxShadow:'inset 0 0 0 1px rgba(0,0,0,.2)' }} />
        <div style={{
          flex:1, marginLeft:16, height:20, borderRadius:6,
          background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.05)',
          display:'flex', alignItems:'center', padding:'0 10px', gap:6,
        }}>
          <span style={{ width:6,height:6,borderRadius:'50%',background:'rgba(52,211,153,.6)' }} />
          <span style={{ fontSize:10, color:'#475569', fontFamily:'monospace' }}>frameos.app/editor</span>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ── Phone mockup ── */
function Phone({ from, to, delay = '0s' }: { from: string; to: string; delay?: string }) {
  return (
    <div style={{ animation:`floaty 4s ease-in-out ${delay} infinite` }}>
      <div style={{
        width:110, borderRadius:'2.2rem', overflow:'hidden',
        border:'2px solid rgba(255,255,255,.12)',
        boxShadow:'0 24px 60px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.07)',
        background:'#0a0a18',
      }}>
        {/* notch */}
        <div style={{ height:26, background:'#0a0a18', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:48,height:17,borderRadius:20,background:'#000',
            display:'flex',alignItems:'center',justifyContent:'center',gap:5 }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:'rgba(255,255,255,.12)' }} />
            <div style={{ width:7,height:7,borderRadius:'50%',background:'rgba(255,255,255,.07)' }} />
          </div>
        </div>
        {/* screen */}
        <div style={{
          height:200,
          background:`linear-gradient(160deg, ${from}, ${to})`,
          display:'flex', flexDirection:'column', justifyContent:'space-between', padding:14,
        }}>
          <div>
            <div style={{ height:8, width:'70%', borderRadius:6, background:'rgba(255,255,255,.22)', marginBottom:6 }} />
            <div style={{ height:6, width:'50%', borderRadius:6, background:'rgba(255,255,255,.12)' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            <div style={{ height:46, borderRadius:10, background:'rgba(255,255,255,.1)' }} />
            <div style={{ height:46, borderRadius:10, background:'rgba(255,255,255,.1)' }} />
          </div>
        </div>
        {/* home bar */}
        <div style={{ height:22, background:'#0a0a18', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:72, height:4, borderRadius:4, background:'rgba(255,255,255,.15)' }} />
        </div>
      </div>
    </div>
  );
}

/* ── Feature card ── */
function FCard({ icon, title, body, accent }: {
  icon: React.ReactNode; title: string; body: string; accent: string;
}) {
  return (
    <div className="fcard" style={{
      padding:22, borderRadius:18, cursor:'default',
      background:'rgba(255,255,255,.025)',
      border:'1px solid rgba(255,255,255,.06)',
      position:'relative', overflow:'hidden',
    }}>
      <div style={{
        position:'absolute', top:0, left:0, width:64, height:64, borderRadius:'0 0 80px 0',
        filter:'blur(22px)', opacity:.35, background:accent, pointerEvents:'none',
      }} />
      <div style={{
        position:'relative', width:40, height:40, borderRadius:12, display:'flex',
        alignItems:'center', justifyContent:'center', marginBottom:14,
        background:accent, opacity:.85, border:'1px solid rgba(255,255,255,.10)',
      }}>
        {icon}
      </div>
      <p style={{ position:'relative', fontSize:14, fontWeight:700, color:'#e2e8f0', marginBottom:6 }}>{title}</p>
      <p style={{ position:'relative', fontSize:13, color:'#64748b', lineHeight:1.65 }}>{body}</p>
    </div>
  );
}

/* ── Step ── */
function Step({ n, title, body, active }: { n: number; title: string; body: string; active: boolean }) {
  return (
    <div style={{ display:'flex', gap:14 }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flexShrink:0 }}>
        <div style={{
          width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:14, fontWeight:900, flexShrink:0,
          background: active ? '#7c3aed' : 'rgba(255,255,255,.04)',
          color: active ? '#fff' : '#475569',
          border: active ? 'none' : '1px solid rgba(255,255,255,.06)',
          animation: active ? 'pulsering 2s infinite' : 'none',
        }}>
          {n}
        </div>
        {n < 4 && <div style={{ width:1, flex:1, marginBottom:4, background:'rgba(255,255,255,.05)' }} />}
      </div>
      <div style={{ paddingBottom:28 }}>
        <p style={{ fontSize:14, fontWeight:700, marginBottom:4,
          color: active ? '#c4b5fd' : '#94a3b8' }}>{title}</p>
        <p style={{ fontSize:13, color:'#475569', lineHeight:1.65 }}>{body}</p>
      </div>
    </div>
  );
}

/* ── Ticker ── */
const TICKS = [
  'macOS Frame','Windows 11','Browser Chrome','Phone','Tablet','Minimal',
  'Batch Export','App Store Ready','Google Play Ready','No Upload','No Account','Undo History',
];
function Ticker() {
  const items = [...TICKS, ...TICKS];
  return (
    <div style={{ overflow:'hidden', borderTop:'1px solid rgba(255,255,255,.045)',
      borderBottom:'1px solid rgba(255,255,255,.045)', padding:'12px 0' }}>
      <div style={{ display:'flex', width:'max-content', animation:'ticker 32s linear infinite' }}>
        {items.map((t, i) => (
          <span key={i} style={{
            fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase',
            whiteSpace:'nowrap', padding:'0 18px',
            color: i % 3 === 0 ? '#a78bfa' : 'rgba(148,163,184,.35)',
          }}>
            {t}
            {i < items.length - 1 && <span style={{ color:'#3b0764', margin:'0 8px' }}>◆</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const mounted   = useMounted();
  const [scrolled, setScrolled] = useState(false);
  const [step,     setStep]     = useState(1);
  /* spotlight is purely visual — only tracked after mount */
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    const onMove   = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s % 4) + 1), 2400);
    return () => clearInterval(t);
  }, []);

  /* ─── static background blobs (same on server + client) ─── */
  const blobs = (
    <div style={{ position:'fixed', inset:0, zIndex:-1, overflow:'hidden', pointerEvents:'none' }}>
      <div style={{ position:'absolute', width:900, height:900, borderRadius:'50%',
        top:-280, left:-180, filter:'blur(100px)', opacity:.14,
        background:'radial-gradient(circle, #7c3aed 0%, transparent 65%)' }} />
      <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%',
        top:'40%', right:-200, filter:'blur(90px)', opacity:.1,
        background:'radial-gradient(circle, #2563eb 0%, transparent 65%)' }} />
      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%',
        bottom:-80, left:'30%', filter:'blur(80px)', opacity:.08,
        background:'radial-gradient(circle, #6d28d9 0%, transparent 65%)' }} />
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div style={{ background:'#07070e', color:'#94a3b8', minHeight:'100vh', overflowX:'hidden' }}>

        {blobs}

        {/* mouse spotlight — only after mount so SSR matches initial client render */}
        {mounted && (
          <div style={{
            position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
            background:`radial-gradient(550px circle at ${mouse.x}px ${mouse.y}px, rgba(124,58,237,.055), transparent 40%)`,
          }} />
        )}

        {/* ══ NAV ════════════════════════════════════════════════ */}
        <header style={{
          position:'fixed', top:0, left:0, right:0, zIndex:50, height:64,
          transition:'background .3s, border-color .3s',
          backdropFilter: mounted && scrolled ? 'blur(20px) saturate(180%)' : 'none',
          background: mounted && scrolled ? 'rgba(7,7,14,.82)' : 'transparent',
          borderBottom: mounted && scrolled ? '1px solid rgba(255,255,255,.06)' : '1px solid transparent',
        }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', height:'100%',
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <FrameOSLogo iconSize={28} />
            <nav style={{ display:'flex', gap:28, fontSize:13, fontWeight:500, color:'#64748b' }}
              className="hidden md:flex">
              {[['#frames','Frames'],['#features','Features'],['#how','How it works']].map(([h,l]) => (
                <a key={h} href={h}
                  style={{ transition:'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color='#cbd5e1')}
                  onMouseLeave={e => (e.currentTarget.style.color='#64748b')}>{l}</a>
              ))}
            </nav>
            <Link href="/editor" className="cta-btn" style={{
              display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:10,
              fontSize:13, fontWeight:700, color:'#fff', textDecoration:'none',
              background:'linear-gradient(135deg,#7c3aed,#4f46e5)',
            }}>
              Open Editor
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </header>

        {/* ══ HERO ═══════════════════════════════════════════════ */}
        <section style={{
          maxWidth:1200, margin:'0 auto', padding:'148px 24px 64px',
          display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
          position:'relative', zIndex:10,
        }}>
          {/* badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'6px 14px', borderRadius:999, marginBottom:32,
            border:'1px solid rgba(167,139,250,.22)',
            background:'rgba(124,58,237,.08)', color:'#a78bfa',
            fontSize:11, fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase',
          }}>
            <span style={{ width:6,height:6,borderRadius:'50%',background:'#a78bfa',
              animation:'blink 1.6s step-end infinite' }} />
            Free · No Account · Runs in Browser
          </div>

          {/* headline */}
          <h1 className="hero-text" style={{
            fontWeight:900, lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:22,
            fontSize:'clamp(2.8rem,7vw,5.2rem)', maxWidth:'13ch',
          }}>
            Frame your screenshots. Ship faster.
          </h1>

          {/* sub */}
          <p style={{ fontSize:17, color:'#94a3b8', lineHeight:1.65, maxWidth:420, marginBottom:36 }}>
            Drag, frame, export at <strong style={{ color:'#e2e8f0', fontWeight:600 }}>exact App Store &amp;
            Google Play dimensions</strong> — no Figma, no Photoshop.
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center', marginBottom:18 }}>
            <Link href="/editor" className="cta-btn" style={{
              display:'inline-flex', alignItems:'center', gap:10, padding:'13px 28px',
              borderRadius:12, fontWeight:800, fontSize:15, color:'#fff', textDecoration:'none',
              background:'linear-gradient(135deg,#7c3aed,#4f46e5)',
              boxShadow:'0 0 32px rgba(124,58,237,.32)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Start framing — free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="#how" style={{
              display:'inline-flex', alignItems:'center', gap:8, padding:'13px 28px',
              borderRadius:12, fontWeight:600, fontSize:15, color:'#94a3b8', textDecoration:'none',
              border:'1px solid rgba(255,255,255,.07)', background:'rgba(255,255,255,.02)',
              transition:'color .2s, border-color .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color='#e2e8f0'; e.currentTarget.style.borderColor='rgba(255,255,255,.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.borderColor='rgba(255,255,255,.07)'; }}>
              See how it works ↓
            </a>
          </div>

          {/* kb hints */}
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'6px 20px',
            fontSize:12, color:'#334155', marginBottom:72 }}>
            {[['E','Export'],['← →','Navigate'],['⌘Z','Undo']].map(([k,l]) => (
              <span key={k} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <kbd style={{
                  fontFamily:'monospace', fontSize:11, color:'#475569',
                  padding:'2px 6px', borderRadius:5,
                  border:'1px solid rgba(255,255,255,.08)', background:'rgba(255,255,255,.03)',
                }}>{k}</kbd>{l}
              </span>
            ))}
          </div>

          {/* ── Hero visual: editor window ── */}
          <div style={{ width:'100%', maxWidth:860 }}>
            <Win>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 250px', minHeight:400 }}>
                {/* preview pane */}
                <div style={{
                  display:'flex', alignItems:'center', justifyContent:'center', padding:32,
                  background:'linear-gradient(135deg,#080814,#0f0f26)',
                  borderRight:'1px solid rgba(255,255,255,.05)',
                }}>
                  <div style={{ animation:'floaty 4.5s ease-in-out infinite' }}>
                    <Win style={{ width:224 }}>
                      <div style={{
                        height:160,
                        background:'linear-gradient(140deg, #6d28d9, #4f46e5, #1d4ed8)',
                        display:'flex', flexDirection:'column', justifyContent:'space-between', padding:16,
                      }}>
                        <div>
                          <div style={{ height:9,width:'72%',borderRadius:5,background:'rgba(255,255,255,.25)',marginBottom:7 }} />
                          <div style={{ height:7,width:'50%',borderRadius:5,background:'rgba(255,255,255,.14)' }} />
                        </div>
                        <div style={{ display:'flex', gap:8 }}>
                          <div style={{ flex:1,height:32,borderRadius:8,background:'rgba(255,255,255,.12)' }} />
                          <div style={{ flex:1,height:32,borderRadius:8,background:'rgba(255,255,255,.18)' }} />
                        </div>
                      </div>
                    </Win>
                  </div>
                </div>

                {/* controls pane */}
                <div style={{ padding:20, background:'#0c0c1e', display:'flex', flexDirection:'column', gap:18 }}>
                  <div>
                    <p style={{ fontSize:10,fontWeight:800,letterSpacing:'0.16em',
                      textTransform:'uppercase',color:'#334155',marginBottom:10 }}>Frame</p>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:5 }}>
                      {['macOS','Win','Browser','Phone','Tablet','Minimal'].map((f,i) => (
                        <button key={f} style={{
                          padding:'5px 0', borderRadius:8, fontSize:10, fontWeight:700,
                          cursor:'default', border: i===0 ? '1px solid rgba(124,58,237,.4)' : '1px solid rgba(255,255,255,.05)',
                          background: i===0 ? 'rgba(124,58,237,.22)' : 'rgba(255,255,255,.03)',
                          color: i===0 ? '#c4b5fd' : '#475569',
                        }}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize:10,fontWeight:800,letterSpacing:'0.16em',
                      textTransform:'uppercase',color:'#334155',marginBottom:10 }}>Background</p>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:5 }}>
                      {[
                        ['linear-gradient(135deg,#7c3aed,#3b82f6)', true],
                        ['linear-gradient(135deg,#f97316,#ec4899)', false],
                        ['linear-gradient(135deg,#10b981,#0ea5e9)', false],
                        ['linear-gradient(135deg,#475569,#0f172a)', false],
                      ].map(([g, sel], i) => (
                        <div key={i} style={{
                          height:28, borderRadius:7, background:String(g), cursor:'default',
                          outline: sel ? '2px solid #a78bfa' : 'none', outlineOffset:2,
                        }} />
                      ))}
                    </div>
                  </div>
                  {[['Padding','32px','55%'],['Scale','0.85','68%']].map(([label,val,w]) => (
                    <div key={label}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                        <p style={{ fontSize:10,fontWeight:800,letterSpacing:'0.16em',
                          textTransform:'uppercase',color:'#334155' }}>{label}</p>
                        <span style={{ fontSize:10,fontFamily:'monospace',color:'#a78bfa' }}>{val}</span>
                      </div>
                      <div style={{ height:5,borderRadius:4,background:'rgba(255,255,255,.06)' }}>
                        <div style={{ height:'100%',width:w,borderRadius:4,
                          background:'linear-gradient(90deg,#7c3aed,#4f46e5)' }} />
                      </div>
                    </div>
                  ))}
                  <button style={{
                    padding:'10px 0', borderRadius:10, fontSize:12, fontWeight:800,
                    color:'#fff', cursor:'default',
                    background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none',
                  }}>Export PNG ↓</button>
                </div>
              </div>
            </Win>
          </div>
        </section>

        {/* ══ TICKER ═════════════════════════════════════════════ */}
        <Ticker />

        {/* ══ STATS ══════════════════════════════════════════════ */}
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'56px 24px',
          display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:24 }}
          className="md:grid-cols-4">
          {[['6','Frame styles'],['10','Batch images'],['20','Undo steps'],['∞','Free forever']].map(([n,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <p style={{ fontSize:40,fontWeight:900,color:'#e2e8f0',letterSpacing:'-0.02em',lineHeight:1 }}>{n}</p>
              <p style={{ fontSize:12,fontWeight:700,color:'#334155',textTransform:'uppercase',
                letterSpacing:'0.12em',marginTop:8 }}>{l}</p>
            </div>
          ))}
        </div>

        {/* ══ FRAMES SHOWCASE ════════════════════════════════════ */}
        <section id="frames" style={{ padding:'80px 0', borderTop:'1px solid rgba(255,255,255,.04)' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
            <Reveal>
              <Label>Frame Styles</Label>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:900, color:'#f1f5f9',
                lineHeight:1.1, marginBottom:12 }}>6 styles, pixel-perfect</h2>
              <p style={{ fontSize:15, color:'#475569', marginBottom:56, maxWidth:380 }}>
                Every frame is hand-crafted to match the real platform — not a screenshot blur.
              </p>
            </Reveal>

            <div style={{ display:'flex', flexWrap:'wrap', gap:24, alignItems:'flex-end', justifyContent:'center' }}>
              {[
                { from:'#6d28d9', to:'#1d4ed8', delay:'0s',   label:'macOS'   },
                { from:'#db2777', to:'#7c3aed', delay:'0.4s', label:'iOS Phone'},
                { from:'#0e7490', to:'#0d9488', delay:'0.8s', label:'Browser'  },
                { from:'#b45309', to:'#dc2626', delay:'1.2s', label:'Windows'  },
              ].map(({ from, to, delay, label }) => (
                <div key={label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                  <Phone from={from} to={to} delay={delay} />
                  <span style={{ fontSize:11,fontWeight:700,color:'#334155',
                    textTransform:'uppercase',letterSpacing:'0.14em' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ═══════════════════════════════════════ */}
        <section id="how" style={{ padding:'80px 0', borderTop:'1px solid rgba(255,255,255,.04)' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px',
            display:'grid', gap:56 }} className="lg:grid-cols-2">
            <Reveal>
              <Label>How it works</Label>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:900, color:'#f1f5f9',
                lineHeight:1.1, marginBottom:10 }}>Four steps. Under a minute.</h2>
              <p style={{ fontSize:15, color:'#475569', marginBottom:40, maxWidth:360 }}>
                Everything runs in your browser. Your screenshots never touch a server.
              </p>
              <Step n={1} title="Drop your screenshots" body="PNG, JPEG, or WebP. Up to 10 at a time. No size limit." active={step===1} />
              <Step n={2} title="Pick a frame style" body="macOS, Windows 11, Browser, Phone, Tablet, or Minimal." active={step===2} />
              <Step n={3} title="Tune background & scale" body="4 gradient presets or custom hex. Padding slider. 20-step undo." active={step===3} />
              <Step n={4} title="Export at store dimensions" body="App Store 6.7″, 6.5″, 5.5″ · Play Store 9:16 and 9:20." active={step===4} />
            </Reveal>

            {/* live panel */}
            <div style={{ display:'flex', alignItems:'center' }}>
              <Win style={{ width:'100%' }}>
                <div style={{ padding:20, background:'#0c0c1e', minHeight:360 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20,
                    paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,.05)' }}>
                    <div style={{ width:8,height:8,borderRadius:'50%',background:'#7c3aed',
                      animation:'pulsering 2.2s infinite' }} />
                    <p style={{ fontSize:12,fontWeight:600,color:'#64748b' }}>FrameOS Editor</p>
                    <span style={{ marginLeft:'auto', fontSize:10,fontFamily:'monospace',color:'#334155',
                      padding:'2px 8px',borderRadius:5,background:'rgba(255,255,255,.04)',
                      border:'1px solid rgba(255,255,255,.05)' }}>3 images</span>
                  </div>
                  {[
                    { name:'screenshot-1.png', size:'3.2 MB', from:'#6d28d9', to:'#2563eb', sel:true  },
                    { name:'screenshot-2.png', size:'2.8 MB', from:'#db2777', to:'#f97316', sel:false },
                    { name:'screenshot-3.png', size:'1.9 MB', from:'#0d9488', to:'#0ea5e9', sel:false },
                  ].map(({ name, size, from, to, sel }) => (
                    <div key={name} style={{
                      display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
                      borderRadius:12, marginBottom:8,
                      background: sel ? 'rgba(124,58,237,.12)' : 'rgba(255,255,255,.02)',
                      border: sel ? '1px solid rgba(124,58,237,.22)' : '1px solid rgba(255,255,255,.04)',
                    }}>
                      <div style={{ width:36,height:24,borderRadius:6,flexShrink:0,
                        background:`linear-gradient(135deg,${from},${to})` }} />
                      <div>
                        <p style={{ fontSize:12,fontFamily:'monospace',
                          color: sel ? '#c4b5fd' : '#475569' }}>{name}</p>
                        <p style={{ fontSize:10,color:'#334155' }}>{size}</p>
                      </div>
                      {sel && <svg style={{ marginLeft:'auto',color:'#a78bfa' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  ))}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16,
                    paddingTop:16, borderTop:'1px solid rgba(255,255,255,.05)' }}>
                    <div style={{ padding:14, borderRadius:12,
                      background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.05)' }}>
                      <p style={{ fontSize:10,color:'#334155',marginBottom:4 }}>Export preset</p>
                      <p style={{ fontSize:12,fontWeight:700,color:'#64748b' }}>App Store 6.7″</p>
                      <p style={{ fontSize:10,fontFamily:'monospace',color:'#7c3aed',marginTop:2 }}>1290 × 2796</p>
                    </div>
                    <button style={{
                      borderRadius:12, fontWeight:800, fontSize:12, color:'#fff',
                      border:'none', cursor:'default',
                      background:'linear-gradient(135deg,#7c3aed,#4f46e5)',
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Export All
                    </button>
                  </div>
                </div>
              </Win>
            </div>
          </div>
        </section>

        {/* ══ FEATURES ═══════════════════════════════════════════ */}
        <section id="features" style={{ padding:'80px 0', borderTop:'1px solid rgba(255,255,255,.04)' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
            <Reveal>
              <Label>Features</Label>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:900, color:'#f1f5f9',
                lineHeight:1.1, marginBottom:48 }}>Built for devs who ship</h2>
            </Reveal>
            <Reveal style={{ display:'grid', gap:12 }} className="sm:grid-cols-2 lg:grid-cols-3">
              <FCard accent="#7c3aed" title="6 pixel-perfect frames"
                body="macOS, Windows 11, Browser chrome, Phone, Tablet, Minimal — every detail matches the real platform."
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>} />
              <FCard accent="#2563eb" title="Store-exact export"
                body="App Store 6.7″/6.5″/5.5″ and Play Store 9:16/9:20 canvas sizes — no guessing, no resizing."
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>} />
              <FCard accent="#db2777" title="Batch up to 10 images"
                body="Load a full app-store batch, style once, export all. Arrow keys navigate between screens."
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8a1 1 0 0 0-1 1v3h10V4a1 1 0 0 0-1-1z"/></svg>} />
              <FCard accent="#059669" title="4 gradients + custom colour"
                body="Cosmic, Sunset, Forest, Midnight — or pick any hex. The background updates live."
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>} />
              <FCard accent="#d97706" title="20-step undo"
                body="Every slider move is tracked. Cmd+Z back to anything — no session resets."
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>} />
              <FCard accent="#0891b2" title="Copy to clipboard"
                body="Paste framed screenshots into Slack, Notion, or X — one click, no download needed."
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>} />
            </Reveal>
          </div>
        </section>

        {/* ══ CTA ════════════════════════════════════════════════ */}
        <section style={{ padding:'100px 0', borderTop:'1px solid rgba(255,255,255,.04)' }}>
          <Reveal>
            <div style={{ maxWidth:640, margin:'0 auto', padding:'0 24px', textAlign:'center' }}>
              <Label>Ready?</Label>
              <h2 className="hero-text" style={{
                fontSize:'clamp(2rem,5vw,3.4rem)', fontWeight:900, lineHeight:1.1, marginBottom:16,
              }}>
                Your screenshots deserve better
              </h2>
              <p style={{ fontSize:16, color:'#475569', marginBottom:36 }}>
                No account. No watermark. No cost.<br/>Opens in 3 seconds.
              </p>
              <Link href="/editor" className="cta-btn" style={{
                display:'inline-flex', alignItems:'center', gap:12,
                padding:'15px 32px', borderRadius:14, fontWeight:900, fontSize:16,
                color:'#fff', textDecoration:'none',
                background:'linear-gradient(135deg,#7c3aed,#4f46e5)',
                boxShadow:'0 0 56px rgba(124,58,237,.3)',
              }}>
                Open FrameOS
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ══ FOOTER ═════════════════════════════════════════════ */}
        <footer style={{ borderTop:'1px solid rgba(255,255,255,.04)' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 24px',
            display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:16 }}>
            <FrameOSLogo iconSize={22} />
            <p style={{ fontSize:12, color:'#1e293b', textAlign:'center' }}>
              Everything runs in your browser — zero data leaves your device
            </p>
            <Link href="/editor" style={{
              fontSize:12, fontWeight:700, color:'#6d28d9', textDecoration:'none', transition:'color .2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color='#a78bfa')}
              onMouseLeave={e => (e.currentTarget.style.color='#6d28d9')}>
              Launch Editor →
            </Link>
          </div>
        </footer>

      </div>
    </>
  );
}
