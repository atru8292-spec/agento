"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: "Привет. Я ИИ-ассистент Арины. Спросите что угодно про автоматизацию — расскажу как это работает для вашего бизнеса." },
  ]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState(false);
  const [hintClosed, setHintClosed] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  // Всплывающая подсказка через 2.5 сек
  useEffect(() => {
    const t = setTimeout(() => {
      if (!open && !hintClosed) setHint(true);
    }, 2500);
    return () => clearTimeout(t);
  }, [open, hintClosed]);

  const closeHint = (e) => {
    e?.stopPropagation();
    setHint(false);
    setHintClosed(true);
  };

  const send = async () => {
    if (!inp.trim() || loading) return;
    const text = inp.trim();
    setInp("");
    const next = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMsgs([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "Напишите Арине напрямую — @arinashrr" }]);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .cw-wrap{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:10px}
        .cw-win{width:360px;height:480px;border-radius:20px;display:flex;flex-direction:column;background:rgba(10,12,20,0.95);backdrop-filter:blur(40px);border:1px solid rgba(255,255,255,0.05);box-shadow:0 32px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.02) inset;overflow:hidden}
        .cw-btn{position:relative;width:56px;height:56px;border-radius:16px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s;background:linear-gradient(135deg,#4a6cf7,#7c5ce6);box-shadow:0 6px 24px rgba(74,108,247,0.25)}
        .cw-btn:hover{transform:scale(1.06);box-shadow:0 8px 32px rgba(74,108,247,0.35)}
        .cw-btn::before{content:"";position:absolute;inset:0;border-radius:16px;background:linear-gradient(135deg,#4a6cf7,#7c5ce6);opacity:.55;z-index:-1;animation:cwPulse 2.4s ease-out infinite;pointer-events:none}
        .cw-btn.is-open::before{display:none}
        @keyframes cwPulse{
          0%{transform:scale(1);opacity:.55}
          100%{transform:scale(1.55);opacity:0}
        }

        .cw-hint{
          position:relative;
          background:#151820;color:#fff;
          border:1px solid rgba(255,255,255,0.08);
          padding:12px 32px 12px 14px;
          border-radius:14px 14px 4px 14px;
          font-size:13px;line-height:1.45;max-width:240px;
          box-shadow:0 12px 32px rgba(0,0,0,0.45);
          animation:cwHintIn .45s cubic-bezier(.22,1,.36,1);
          cursor:pointer;
        }
        .cw-hint b{background:linear-gradient(135deg,#638cff,#9f7afa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .cw-hint-x{
          position:absolute;top:6px;right:8px;background:none;border:none;
          color:rgba(255,255,255,0.4);cursor:pointer;font-size:14px;line-height:1;padding:2px
        }
        .cw-hint-x:hover{color:#fff}
        @keyframes cwHintIn{
          from{opacity:0;transform:translateY(8px) scale(.92)}
          to{opacity:1;transform:none}
        }

        .cw-msg-b{padding:10px 14px;border-radius:14px 14px 14px 2px;background:#12141f;border:1px solid rgba(255,255,255,0.03);font-size:14px;line-height:1.55;max-width:88%;color:var(--text);white-space:pre-wrap}
        .cw-msg-u{padding:10px 14px;border-radius:14px 14px 2px 14px;background:rgba(74,108,247,0.1);border:1px solid rgba(74,108,247,0.1);font-size:14px;line-height:1.55;max-width:88%;color:#c4d0ff;white-space:pre-wrap}
        .cw-dot{width:4px;height:4px;border-radius:50%;background:var(--accent);animation:typing 1.4s infinite}
        .cw-dot:nth-child(2){animation-delay:.2s}
        .cw-dot:nth-child(3){animation-delay:.4s}

        @media(max-width:480px){
          .cw-wrap{bottom:12px;right:12px;left:12px;align-items:flex-end}
          .cw-win{width:100%;height:70vh}
          .cw-hint{max-width:80%}
        }
      `}</style>

      <div className="cw-wrap">
        {open && (
          <div className="cw-win">
            <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#4a6cf7,#7c5ce6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff"}}>A</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--text-bright)"}}>Agento</div>
                  <div style={{fontSize:11,color:"#34d399"}}>онлайн</div>
                </div>
              </div>
              <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",color:"var(--text-dim)",cursor:"pointer",fontSize:18,lineHeight:1,padding:4}}>&#x2715;</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:8}}>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div className={m.role==="user"?"cw-msg-u":"cw-msg-b"}>{m.content}</div>
                </div>
              ))}
              {loading&&<div style={{display:"flex"}}><div className="cw-msg-b" style={{display:"flex",gap:4,padding:"12px 16px"}}><span className="cw-dot"/><span className="cw-dot"/><span className="cw-dot"/></div></div>}
              <div ref={endRef}/>
            </div>
            <div style={{padding:"10px 14px",borderTop:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:8}}>
              <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send()}}
                placeholder="Задайте вопрос..."
                style={{flex:1,background:"#0c0e18",border:"1px solid rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 12px",color:"var(--text)",fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              <button onClick={send} disabled={loading}
                style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#4a6cf7,#7c5ce6)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:loading?.4:1,transition:"opacity .2s",flexShrink:0}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* Всплывающая подсказка */}
        {hint && !open && (
          <div className="cw-hint" onClick={()=>{setOpen(true);setHint(false);setHintClosed(true);}}>
            <button className="cw-hint-x" onClick={closeHint}>×</button>
            👋 Привет! Я <b>ИИ-ассистент</b>. Спросите про автоматизацию — отвечу за пару секунд.
          </div>
        )}

        <button
          className={`cw-btn${open?" is-open":""}`}
          onClick={()=>{setOpen(!open);setHint(false);setHintClosed(true);}}
        >
          {open
            ?<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            :<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>}
        </button>
      </div>
    </>
  );
}
