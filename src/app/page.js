"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import ChatWidget from "@/components/ChatWidget";

const TG = "https://t.me/arinashrr";
const CRM = "https://speakup-crm.vercel.app";
const DEMO_BOT = "https://t.me/sunsh22bot";
const N8N_IMG = "https://i.ibb.co/VYB0mrTq/2026-04-27-10-43-09.png";

/* ── Scroll reveal ── */
function S({ children, d = 0, style = {} }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return <div ref={ref} style={{ ...style, opacity: v ? 1 : 0, transform: v ? "none" : "translateY(36px)", transition: `all .7s cubic-bezier(.22,1,.36,1) ${d}ms` }}>{children}</div>;
}

/* ── Counter ── */
function Ct({ end, sfx = "" }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const ran = useRef(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const s = performance.now(), n = parseFloat(end);
        const f = (now) => { const p = Math.min((now - s) / 1600, 1); setV(Math.round(n * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(f); };
        requestAnimationFrame(f);
      }
    }, { threshold: 0.5 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [end]);
  return <span ref={ref}>{v}{sfx}</span>;
}

/* ── Data ── */
const CASES = [
  {
    tag: "Языковая школа", title: "Агент отвечает на вопросы о курсах и записывает на обучение",
    desc: "Школа Sunshine. Бот в мессенджере консультирует по программам, подбирает курс под уровень и цель, записывает на бесплатное пробное занятие. Менеджер подключается только на этапе оплаты. Ни одна заявка не висит без ответа.",
    metrics: [{ v: "2", s: " сек", l: "ответ" }, { v: "0", s: "", l: "потерянных заявок" }, { v: "24", s: "/7", l: "без выходных" }],
    chat: [
      { r: "b", t: "Здравствуйте. Школа английского Sunshine. Чем могу помочь?" },
      { r: "u", t: "Хочу записать ребёнка на английский, ему 10 лет" },
      { r: "b", t: "Отлично. Какой у ребёнка уровень? Учил раньше или с нуля?" },
      { r: "u", t: "Учил в школе, но говорит плохо" },
      { r: "b", t: "Понял. Для его возраста и уровня подойдёт курс Elementary. Группа до 6 человек, 2 раза в неделю. Хотите записаться на бесплатное пробное занятие?" },
      { r: "u", t: "Да" },
      { r: "b", t: "Записала. Пробное занятие в среду в 16:00. Адрес и детали отправила в сообщении." },
    ],
  },
  {
    tag: "Услуги", title: "Клиент получает ответ за 10 секунд вместо следующего дня",
    desc: "Агент на сайте консультирует по услугам и ценам, задаёт уточняющие вопросы и передаёт менеджеру уже с полной информацией о клиенте. Менеджер не тратит время на выяснение деталей — сразу работает с готовым запросом.",
    metrics: [{ v: "10", s: " сек", l: "до ответа" }, { v: "3", s: "x", l: "заявки ночью" }, { v: "45", s: "%", l: "дешевле лид" }],
    chat: [
      { r: "b", t: "Добрый день. Чем могу помочь?" },
      { r: "u", t: "Хочу узнать про дизайн интерьера, сколько стоит" },
      { r: "b", t: "Стоимость зависит от площади и формата. Скажите, это квартира или дом? Примерный метраж?" },
      { r: "u", t: "Квартира, 65 метров, двушка" },
      { r: "b", t: "Понял. Дизайн-проект для 65 кв.м. — от 130 000. Включает планировку, чертежи и авторский надзор. Удобно, если наш специалист свяжется с вами сегодня?" },
      { r: "u", t: "Да, после 18:00" },
      { r: "b", t: "Передала запрос. Специалист позвонит после 18:00. Оставьте номер телефона, пожалуйста." },
    ],
  },
  {
    tag: "Интернет-магазин", title: "Продавец, который работает без перерывов",
    desc: "Помогает выбрать товар, сравнивает модели, проверяет наличие, оформляет заказ прямо в диалоге. Одновременно с сотнями клиентов.",
    metrics: [{ v: "27", s: "%", l: "рост чека" }, { v: "100", s: "+", l: "диалогов" }, { v: "10", s: " сек", l: "до ответа" }],
    chat: [
      { r: "b", t: "Здравствуйте. Что ищете? Помогу подобрать." },
      { r: "u", t: "Кроссовки для бега, до 10 000" },
      { r: "b", t: "Nike Pegasus 41 — 9 490, размеры 42-45. Лёгкие, хорошая амортизация." },
      { r: "u", t: "43, беру" },
      { r: "b", t: "Заказ оформлен. Доставка завтра до 18:00." },
    ],
  },
];

const FEATURES = [
  { t: "Консультирует круглосуточно", d: "Знает всё о продукте, ценах, условиях. Отвечает мгновенно — от наличия до доставки.", w: true },
  { t: "Квалифицирует лиды", d: "Собирает имя, потребность, бюджет, контакт. Передаёт только тех, кто готов." },
  { t: "Бронирует слоты", d: "Показывает свободное время, записывает в календарь, отправляет напоминания." },
  { t: "Работает с возражениями", d: "Персональные предложения которые закрывают конкретное сомнение клиента.", w: true },
  { t: "CRM-панель", d: "Все лиды, диалоги и метрики — в одном месте." },
  { t: "Эскалация менеджеру", d: "Сложный случай — передаёт с резюме диалога и рекомендацией." },
];

const WORKFLOW = [
  { n: "01", icon: "💬", t: "Обсуждаем задачу", d: "Разбираемся, как должен работать бот: какие вопросы задавать, как квалифицировать, куда передавать лида. Я задаю правильные вопросы — вы получаете агента, который понимает ваш бизнес." },
  { n: "02", icon: "🎯", t: "Показываю мини-демо", d: "Делаю рабочий прототип специально под ваш бизнес — не абстрактные скриншоты, а живой бот. Можете потрогать руками и понять, как это будет работать у вас." },
  { n: "03", icon: "📋", t: "Составляем ТЗ", d: "Фиксируем всё письменно: логика диалогов, интеграции, сценарии, метрики. ТЗ — это защита для обеих сторон. Вы знаете что получите, я знаю что делать." },
  { n: "04", icon: "⚙️", t: "Разработка", d: "Строю агента на n8n + Claude API. Каждый узел автоматизации — это логика, которую вы согласовали. Полная прозрачность: покажу схему до запуска.", img: true },
  { n: "05", icon: "🧪", t: "Тестирование", d: "Прогоняю все сценарии — типичные, нестандартные, стрессовые. Ловлю баги до того, как клиент их найдёт. Сдаю только то, в чём уверена." },
  { n: "06", icon: "🛡️", t: "Поддержка или передача", d: "Выбор за вами: техническая поддержка от меня — или полная передача инструкций и доступов, чтобы вести всё самостоятельно. Никаких закрытых черных ящиков." },
];

const TRUST = [
  { icon: "⚡", t: "Быстро", d: "От разговора до работающего агента — от 3 дней. Не месяцами, не «ждите ответа»." },
  { icon: "🔍", t: "Прозрачно", d: "Фиксированное ТЗ, понятная цена, доступ к схемам. Вы видите каждый шаг." },
  { icon: "🤝", t: "Без привязки", d: "Всё, что я делаю — остаётся у вас. Доступы, схемы, код — полностью ваши." },
  { icon: "📊", t: "С результатом", d: "Ориентируюсь на метрики: конверсия, скорость ответа, количество лидов. Не «сдала и ушла»." },
];

/* ── Stack data ── */
const STACK_LAYERS = [
  {
    label: "Модель ИИ",
    color: "#4a6cf7",
    items: ["Claude", "OpenAI", "YandexGPT", "GigaChat"],
    desc: "Подбираю под задачу и бюджет. Не навязываю один инструмент.",
  },
  {
    label: "Каналы",
    color: "#7c5ce6",
    items: ["Telegram", "WhatsApp", "Avito", "Instagram", "Сайт"],
    desc: "Любой мессенджер или чат на сайте — подключаю туда, где ваши клиенты.",
  },
  {
    label: "CRM",
    color: "#00b4d8",
    items: ["Bitrix24", "amoCRM", "Web CRM"],
    desc: "Встраиваюсь в вашу воронку или собираю собственную веб-панель.",
  },
  {
    label: "Автоматизация",
    color: "#f59e42",
    items: ["n8n", "Make", "Webhooks", "API"],
    desc: "Связываю всё в единый поток: агент → CRM → уведомление → аналитика.",
  },
  {
    label: "Аналитика",
    color: "#34d399",
    items: ["Дашборд", "История диалогов", "Воронка лидов", "Метрики"],
    desc: "Полный контур управления: видите что происходит, в реальном времени.",
  },
];

/* ── Timeline data ── */
const TIMELINE = [
  { day: "День 1", t: "Разбор задачи", d: "Кастдев за 20 минут или перепиской: выясняю бизнес-процесс, болевые точки, ожидания. Вы уходите с конкретным планом." },
  { day: "День 3", t: "Живое демо", d: "Рабочий прототип под ваш бизнес — не скриншот, а реальный бот. Трогаете, даёте обратную связь." },
  { day: "День 5", t: "ТЗ подписано", d: "Фиксируем логику диалогов, интеграции, метрики. Никаких сюрпризов в процессе." },
  { day: "День 10", t: "Агент готов", d: "Собранный, протестированный агент. Показываю схему, объясняю каждый узел." },
  { day: "День 12", t: "Запуск", d: "Деплой на ваш сайт или мессенджер. Первые реальные диалоги — уже с реальными клиентами." },
  { day: "День 14+", t: "Поддержка", d: "Мониторинг, правки по диалогам, масштабирование. Или передача всех доступов — на ваш выбор." },
];

/* ── Calc data ── */
const CALC_PRESETS = [
  { label: "Малый бизнес", leads: 30, hours: 2, salary: 50000 },
  { label: "Средний бизнес", leads: 100, hours: 4, salary: 80000 },
  { label: "Крупный отдел", leads: 300, hours: 6, salary: 120000 },
];

function Calculator() {
  const [leads, setLeads] = useState(60);
  const [hours, setHours] = useState(3);
  const [salary, setSalary] = useState(60000);
  const [preset, setPreset] = useState(null);

  const applyPreset = (p, idx) => {
    setLeads(p.leads); setHours(p.hours); setSalary(p.salary); setPreset(idx);
  };

  const lostLeads = Math.round(leads * 0.35);
  const savedLeadsRub = Math.round(lostLeads * (salary / leads) * 1.5);
  const savedHoursRub = Math.round(hours * 22 * (salary / 160));
  const total = savedLeadsRub + savedHoursRub;

  return (
    <div className="calc-wrap">
      <div className="calc-presets">
        {CALC_PRESETS.map((p, i) => (
          <button key={i} className={`calc-preset${preset === i ? " active" : ""}`} onClick={() => applyPreset(p, i)}>{p.label}</button>
        ))}
      </div>
      <div className="calc-sliders">
        <div className="calc-row">
          <div className="calc-label">Заявок в месяц <span className="calc-val">{leads}</span></div>
          <input type="range" min="10" max="500" value={leads} onChange={e => { setLeads(+e.target.value); setPreset(null); }} className="calc-slider" />
        </div>
        <div className="calc-row">
          <div className="calc-label">Часов в день на обработку <span className="calc-val">{hours}</span></div>
          <input type="range" min="1" max="8" value={hours} onChange={e => { setHours(+e.target.value); setPreset(null); }} className="calc-slider" />
        </div>
        <div className="calc-row">
          <div className="calc-label">Зарплата менеджера (₽/мес) <span className="calc-val">{salary.toLocaleString()}</span></div>
          <input type="range" min="30000" max="200000" step="5000" value={salary} onChange={e => { setSalary(+e.target.value); setPreset(null); }} className="calc-slider" />
        </div>
      </div>
      <div className="calc-results">
        <div className="calc-result-item">
          <div className="calc-result-val">+{lostLeads}</div>
          <div className="calc-result-label">заявок возвращаем</div>
          <div className="calc-result-sub">которые уходили без ответа</div>
        </div>
        <div className="calc-result-item">
          <div className="calc-result-val">{(hours * 22).toFixed(0)}ч</div>
          <div className="calc-result-label">освобождаем</div>
          <div className="calc-result-sub">менеджер занимается продажами</div>
        </div>
        <div className="calc-result-item highlight">
          <div className="calc-result-val">~{(total / 1000).toFixed(0)}к ₽</div>
          <div className="calc-result-label">выгода в месяц</div>
          <div className="calc-result-sub">упущенный доход + экономия ФОТ</div>
        </div>
      </div>
      <div className="calc-cta-row">
        <a href={TG} target="_blank" rel="noopener noreferrer" className="btn-p" style={{ fontSize: 13, padding: "11px 26px" }}>Обсудить под мой бизнес</a>
        <span className="calc-disclaimer">* расчёт ориентировочный, обсудим точные цифры</span>
      </div>
    </div>
  );
}

/* ── Quick starters for demo block ── */
const QUICK_QUESTIONS = [
  "Сколько стоит агент для салона?",
  "Можно интегрировать с Bitrix24?",
  "Как быстро сделаете?",
  "Есть WhatsApp-бот?",
];

export default function Home() {
  const [tab, setTab] = useState(0);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const c = CASES[tab];

  const onM = useCallback((e) => {
    setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
  }, []);
  useEffect(() => { window.addEventListener("mousemove", onM); return () => window.removeEventListener("mousemove", onM); }, [onM]);

  const openChat = (text) => {
    const btn = document.querySelector('.cw-btn');
    if (btn) btn.click();
    if (text) {
      setTimeout(() => {
        const inp = document.querySelector('.cw-inp');
        if (inp) {
          inp.value = text;
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 320);
    }
  };

  const Phone = ({ chat }) => (
    <div className="phone-wrap">
      <div className="phone-body">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600, textAlign: "center", marginBottom: 8, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Live Demo</div>
          {chat.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.r === "u" ? "flex-end" : "flex-start" }}>
              <div className={m.r === "b" ? "ph-b" : "ph-u"}>{m.t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <style>{`
        .wrap{max-width:1080px;margin:0 auto;padding:0 20px}

        /* Ambient BG */
        .ambient{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
        .ambient .orb1{position:absolute;top:-15%;left:-5%;width:50vw;height:50vh;border-radius:50%;background:radial-gradient(circle,rgba(74,108,247,0.06),transparent 70%);transition:transform .4s ease-out}
        .ambient .orb2{position:absolute;bottom:-20%;right:-10%;width:45vw;height:45vh;border-radius:50%;background:radial-gradient(circle,rgba(124,92,230,0.04),transparent 70%);transition:transform .4s ease-out}
        .ambient .grid{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.018) 1px,transparent 1px);background-size:28px 28px}

        /* Nav */
        .nav{position:fixed;top:0;left:0;right:0;z-index:50;padding:12px 0;background:rgba(8,9,14,0.8);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.03)}
        .nav-inner{display:flex;align-items:center;justify-content:space-between}
        .nav-logo{display:flex;align-items:center;gap:8px}
        .nav-mark{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#4a6cf7,#7c5ce6);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff}
        .nav-name{font-weight:700;font-size:17px;color:var(--text-bright);letter-spacing:-.3px}
        .nav-links{display:flex;align-items:center;gap:20px}
        .nav-link{font-size:13px;color:var(--text-dim);text-decoration:none;transition:color .2s}
        .nav-link:hover{color:var(--text)}
        .nav-cta{display:inline-flex;align-items:center;gap:6px;padding:8px 20px;border-radius:10px;background:linear-gradient(135deg,#4a6cf7,#3b5de7);color:#fff;font-weight:600;font-size:13px;text-decoration:none;transition:all .2s;border:none;box-shadow:0 2px 12px rgba(74,108,247,0.2)}
        .nav-cta:hover{box-shadow:0 4px 20px rgba(74,108,247,0.3);transform:translateY(-1px)}
        @media(max-width:640px){.nav-links .nav-link{display:none}}

        /* Hero */
        .hero{position:relative;z-index:1;min-height:100vh;display:flex;align-items:center;padding:120px 0 80px}
        .hero-grid{display:grid;grid-template-columns:1fr 260px;gap:48px;align-items:center}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:24px;border:1px solid rgba(74,108,247,0.12);background:rgba(74,108,247,0.04);font-size:12px;color:var(--accent);font-weight:500;margin-bottom:28px}
        .hero-badge .dot{width:5px;height:5px;border-radius:50%;background:#34d399}
        .hero-h1{font-size:clamp(32px,5vw,56px);font-weight:800;line-height:1.08;letter-spacing:-1.5px;color:var(--text-bright);margin-bottom:20px}
        .hero-h1 .grad{background:linear-gradient(135deg,#638cff 0%,#9f7afa 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .hero-p{font-size:16px;color:var(--text-dim);line-height:1.65;margin-bottom:32px;max-width:440px}
        .hero-btns{display:flex;gap:10px;flex-wrap:wrap}
        .btn-p{display:inline-flex;align-items:center;gap:6px;padding:14px 30px;border-radius:12px;background:linear-gradient(135deg,#4a6cf7,#3b5de7);color:#fff;font-weight:600;font-size:14px;text-decoration:none;border:none;cursor:pointer;transition:all .25s;box-shadow:0 4px 16px rgba(74,108,247,0.2);font-family:inherit}
        .btn-p:hover{transform:translateY(-2px);box-shadow:0 6px 28px rgba(74,108,247,0.3)}
        .btn-s{display:inline-flex;align-items:center;gap:6px;padding:14px 30px;border-radius:12px;background:rgba(255,255,255,0.03);color:var(--text);font-weight:500;font-size:14px;text-decoration:none;border:1px solid rgba(255,255,255,0.06);cursor:pointer;transition:all .25s;font-family:inherit}
        .btn-s:hover{border-color:var(--border-hover);color:var(--text-bright)}
        .hero-stats{display:flex;gap:40px;margin-top:48px;flex-wrap:wrap}
        .hero-stat-val{font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:700;background:linear-gradient(135deg,#638cff,#9f7afa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .hero-stat-label{font-size:12px;color:var(--text-dim);margin-top:2px}
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr;text-align:center}
          .hero-p{margin-left:auto;margin-right:auto}
          .hero-btns{justify-content:center}
          .hero-stats{justify-content:center}
          .phone-wrap{display:none}
        }

        /* Phone */
        .phone-wrap{flex-shrink:0;animation:float 7s ease-in-out infinite}
        .phone-body{width:260px;border-radius:32px;background:#0a0c14;border:1.5px solid rgba(255,255,255,0.05);padding:8px;box-shadow:0 24px 64px rgba(0,0,0,0.5)}
        .phone-notch{width:70px;height:3px;background:rgba(255,255,255,0.06);border-radius:3px;margin:0 auto 10px}
        .phone-screen{background:#0e1018;border-radius:26px;padding:20px 10px 10px;min-height:360px;display:flex;flex-direction:column;gap:5px}
        .ph-b{padding:7px 10px;border-radius:12px 12px 12px 2px;background:#151820;border:1px solid rgba(255,255,255,0.03);font-size:11.5px;line-height:1.4;max-width:88%;color:var(--text)}
        .ph-u{padding:7px 10px;border-radius:12px 12px 2px 12px;background:rgba(74,108,247,0.08);border:1px solid rgba(74,108,247,0.08);font-size:11.5px;line-height:1.4;max-width:88%;color:#b4c6ff;align-self:flex-end}

        /* Section label */
        .sec-label{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent);font-weight:500;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px}
        .sec-h2{font-size:clamp(24px,3.5vw,40px);font-weight:800;letter-spacing:-1px;color:var(--text-bright);margin-bottom:0}

        /* Steps */
        .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .step{border-radius:20px;padding:32px 28px;background:var(--bg-card);backdrop-filter:blur(20px);border:1px solid var(--border);transition:border-color .3s,box-shadow .3s}
        .step:hover{border-color:var(--border-hover);box-shadow:0 8px 32px var(--accent-glow)}
        .step-num{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--accent);font-weight:700;opacity:.5;margin-bottom:16px}
        .step-title{font-size:18px;font-weight:700;color:var(--text-bright);margin-bottom:8px}
        .step-desc{font-size:14px;color:var(--text-dim);line-height:1.6}
        @media(max-width:768px){.steps{grid-template-columns:1fr}}

        /* Cases */
        .case-tabs{display:flex;gap:8px;margin-bottom:40px;flex-wrap:wrap}
        .case-tab{padding:9px 20px;border-radius:24px;font-size:13px;font-weight:500;cursor:pointer;transition:all .25s;font-family:inherit;border:none}
        .case-tab-a{background:linear-gradient(135deg,#4a6cf7,#3b5de7);color:#fff;box-shadow:0 3px 14px rgba(74,108,247,0.2)}
        .case-tab-i{background:transparent;color:var(--text-dim);border:1px solid rgba(255,255,255,0.06)}
        .case-tab-i:hover{border-color:rgba(255,255,255,0.1);color:var(--text)}
        .case-layout{display:grid;grid-template-columns:1fr 280px;gap:40px;align-items:start}
        .case-title{font-size:clamp(22px,3vw,30px);font-weight:700;color:var(--text-bright);line-height:1.2;margin-bottom:14px;letter-spacing:-.5px}
        .case-desc{font-size:15px;color:var(--text-dim);line-height:1.65;margin-bottom:28px;max-width:500px}
        .case-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px}
        .case-metric{text-align:center;padding:20px 12px;border-radius:16px;background:rgba(74,108,247,0.03);border:1px solid rgba(74,108,247,0.06)}
        .case-metric-val{font-family:'JetBrains Mono',monospace;font-size:26px;font-weight:700;background:linear-gradient(135deg,#638cff,#9f7afa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .case-metric-label{font-size:11px;color:var(--text-dim);margin-top:4px}
        .demo-card{margin-top:20px;padding:18px 22px;border-radius:16px;background:linear-gradient(135deg,rgba(99,140,255,0.05),rgba(159,122,250,0.04));border:1px solid rgba(99,140,255,0.12);position:relative;overflow:hidden}
        .demo-card::before{content:"";position:absolute;top:0;left:0;width:3px;height:100%;background:linear-gradient(180deg,#638cff,#9f7afa)}
        .demo-card-label{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--accent);font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:2px;font-family:'JetBrains Mono',monospace}
        .demo-card-label .live-dot{width:6px;height:6px;border-radius:50%;background:#34d399;box-shadow:0 0 8px rgba(52,211,153,0.6);animation:livePulse 1.8s ease-in-out infinite}
        @keyframes livePulse{0%,100%{opacity:1}50%{opacity:.4}}
        .demo-card-text{font-size:14px;color:var(--text);margin-bottom:14px;line-height:1.55}
        .crm-note{font-size:11px;color:var(--text-dim);opacity:.65;margin-top:10px;font-family:'JetBrains Mono',monospace;letter-spacing:.3px}
        @media(max-width:768px){
          .case-layout{grid-template-columns:1fr}
          .case-layout .phone-wrap{display:none}
        }

        /* Bento features */
        .bento{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .bento-item{border-radius:18px;padding:26px 24px;background:var(--bg-card);backdrop-filter:blur(20px);border:1px solid var(--border);transition:border-color .3s}
        .bento-item:hover{border-color:var(--border-hover)}
        .bento-item.wide{grid-column:span 2}
        .bento-title{font-size:15px;font-weight:700;color:var(--text-bright);margin-bottom:6px}
        .bento-desc{font-size:13px;color:var(--text-dim);line-height:1.55}
        @media(max-width:768px){.bento{grid-template-columns:1fr}.bento-item.wide{grid-column:span 1}}

        /* Workflow */
        .wf-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .wf-card{border-radius:20px;padding:28px 26px;background:var(--bg-card);border:1px solid var(--border);transition:border-color .3s,box-shadow .3s;position:relative;overflow:hidden}
        .wf-card:hover{border-color:var(--border-hover);box-shadow:0 8px 32px var(--accent-glow)}
        .wf-card-accent{border-color:rgba(74,108,247,0.18);background:rgba(74,108,247,0.03)}
        .wf-num{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent);font-weight:700;opacity:.5;margin-bottom:10px;letter-spacing:2px}
        .wf-icon{font-size:26px;margin-bottom:12px;display:block}
        .wf-title{font-size:17px;font-weight:700;color:var(--text-bright);margin-bottom:8px}
        .wf-desc{font-size:13.5px;color:var(--text-dim);line-height:1.6}
        .wf-img-wrap{margin-top:16px;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.06)}
        .wf-img-wrap img{width:100%;display:block;object-fit:cover}
        @media(max-width:768px){.wf-grid{grid-template-columns:1fr}}

        /* ── TIMELINE ── */
        .tl-wrap{position:relative;display:flex;flex-direction:column;gap:0}
        .tl-wrap::before{content:"";position:absolute;left:52px;top:12px;bottom:12px;width:1px;background:linear-gradient(180deg,rgba(74,108,247,0.3),rgba(124,92,230,0.15));pointer-events:none}
        .tl-item{display:grid;grid-template-columns:104px 1fr;gap:24px;align-items:flex-start;padding:16px 0}
        .tl-day-wrap{display:flex;flex-direction:column;align-items:center;gap:6px;position:relative;z-index:1}
        .tl-dot{width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg,#4a6cf7,#7c5ce6);box-shadow:0 0 12px rgba(74,108,247,0.5);flex-shrink:0}
        .tl-day{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--accent);font-weight:700;letter-spacing:1px;white-space:nowrap}
        .tl-card{border-radius:14px;padding:16px 20px;background:var(--bg-card);border:1px solid var(--border);transition:border-color .25s}
        .tl-card:hover{border-color:var(--border-hover)}
        .tl-title{font-size:14px;font-weight:700;color:var(--text-bright);margin-bottom:4px}
        .tl-desc{font-size:13px;color:var(--text-dim);line-height:1.55}
        @media(max-width:600px){
          .tl-wrap::before{left:36px}
          .tl-item{grid-template-columns:72px 1fr;gap:12px}
          .tl-day{font-size:9px}
        }

        /* ── STACK ── */
        .stack-layout{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .stack-card{border-radius:18px;padding:24px;background:var(--bg-card);border:1px solid var(--border);transition:border-color .3s,box-shadow .3s}
        .stack-card:hover{border-color:var(--border-hover);box-shadow:0 6px 24px var(--accent-glow)}
        .stack-layer-label{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px}
        .stack-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
        .stack-chip{padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;border:1px solid}
        .stack-desc{font-size:12.5px;color:var(--text-dim);line-height:1.5}
        .stack-flow{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:32px;flex-wrap:wrap}
        .stack-flow-item{padding:7px 16px;border-radius:8px;font-size:12px;font-weight:600;border:1px solid rgba(74,108,247,0.15);background:rgba(74,108,247,0.04);color:var(--accent)}
        .stack-flow-arrow{color:var(--text-dim);font-size:16px}
        @media(max-width:900px){.stack-layout{grid-template-columns:1fr 1fr}}
        @media(max-width:560px){.stack-layout{grid-template-columns:1fr}}

        /* ── DELIVERY BLOCK (что получает бизнес) ── */
        .delivery-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .delivery-card{border-radius:18px;padding:26px 24px;background:var(--bg-card);border:1px solid var(--border);transition:border-color .3s,box-shadow .3s;display:flex;gap:16px;align-items:flex-start}
        .delivery-card:hover{border-color:var(--border-hover);box-shadow:0 6px 24px var(--accent-glow)}
        .delivery-icon{width:40px;height:40px;border-radius:10px;background:rgba(74,108,247,0.08);border:1px solid rgba(74,108,247,0.14);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
        .delivery-title{font-size:14px;font-weight:700;color:var(--text-bright);margin-bottom:5px}
        .delivery-desc{font-size:12.5px;color:var(--text-dim);line-height:1.55}
        @media(max-width:640px){.delivery-grid{grid-template-columns:1fr}}

        /* ── DEMO BLOCK ── */
        .demo-block{border-radius:24px;padding:48px 44px;background:rgba(74,108,247,0.03);border:1px solid rgba(74,108,247,0.1);position:relative;overflow:hidden;text-align:center}
        .demo-block::before{content:"";position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(74,108,247,0.07),transparent 70%);pointer-events:none}
        .demo-block-badge{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:24px;border:1px solid rgba(52,211,153,0.2);background:rgba(52,211,153,0.05);font-size:11px;color:#34d399;font-weight:600;margin-bottom:16px;font-family:'JetBrains Mono',monospace;letter-spacing:1px}
        .demo-block-badge .live-dot{width:6px;height:6px;border-radius:50%;background:#34d399;box-shadow:0 0 8px rgba(52,211,153,0.6);animation:livePulse 1.8s ease-in-out infinite}
        .demo-block-h{font-size:clamp(20px,3vw,28px);font-weight:800;color:var(--text-bright);margin-bottom:10px;letter-spacing:-.5px}
        .demo-block-p{font-size:14px;color:var(--text-dim);line-height:1.65;max-width:440px;margin:0 auto 20px}
        .demo-quick{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:24px}
        .demo-quick-btn{padding:7px 16px;border-radius:20px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid rgba(74,108,247,0.2);background:rgba(74,108,247,0.05);color:var(--text-dim);font-family:inherit;transition:all .2s}
        .demo-quick-btn:hover{border-color:rgba(74,108,247,0.4);color:var(--accent);background:rgba(74,108,247,0.1)}
        .demo-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
        @media(max-width:480px){.demo-block{padding:28px 18px}}

        /* ── PHONE SHOWCASE (all screens) ── */
        .showcase-layout{display:grid;grid-template-columns:280px 1fr;gap:48px;align-items:center}
        .showcase-phone{width:280px;border-radius:36px;background:#0a0c14;border:1.5px solid rgba(255,255,255,0.05);padding:10px;box-shadow:0 32px 80px rgba(0,0,0,0.5);animation:float 7s ease-in-out infinite}
        .showcase-screen{background:#0e1018;border-radius:28px;padding:22px 12px 12px;min-height:400px;display:flex;flex-direction:column;gap:6px}
        .showcase-header{display:flex;align-items:center;gap:8px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.04)}
        .showcase-avatar{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#4a6cf7,#7c5ce6);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0}
        .showcase-name{font-size:12px;font-weight:600;color:var(--text-bright)}
        .showcase-status{font-size:10px;color:#34d399}
        .showcase-points{display:flex;flex-direction:column;gap:12px}
        .showcase-point{display:flex;gap:12px;align-items:flex-start}
        .showcase-point-icon{width:32px;height:32px;border-radius:8px;background:rgba(74,108,247,0.1);border:1px solid rgba(74,108,247,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px}
        .showcase-point-text{font-size:13px;color:var(--text-dim);line-height:1.5}
        .showcase-point-text strong{color:var(--text-bright);display:block;font-size:13px;margin-bottom:2px}
        @media(max-width:768px){
          .showcase-layout{grid-template-columns:1fr;gap:28px}
          .showcase-phone{width:100%;max-width:300px;margin:0 auto}
        }

        /* ── CALC ── */
        .calc-wrap{background:var(--bg-card);border:1px solid var(--border);border-radius:20px;padding:32px 28px}
        .calc-presets{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap}
        .calc-preset{padding:7px 18px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.07);background:transparent;color:var(--text-dim);font-family:inherit;transition:all .2s}
        .calc-preset.active{background:rgba(74,108,247,0.1);border-color:rgba(74,108,247,0.3);color:var(--accent)}
        .calc-preset:hover{border-color:rgba(255,255,255,0.12);color:var(--text)}
        .calc-sliders{display:flex;flex-direction:column;gap:20px;margin-bottom:28px}
        .calc-row{}
        .calc-label{font-size:13px;color:var(--text-dim);margin-bottom:8px;display:flex;justify-content:space-between;align-items:center}
        .calc-val{font-family:'JetBrains Mono',monospace;color:var(--accent);font-weight:700}
        .calc-slider{width:100%;-webkit-appearance:none;appearance:none;height:3px;border-radius:2px;background:rgba(255,255,255,0.08);outline:none;cursor:pointer}
        .calc-slider::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,#4a6cf7,#7c5ce6);cursor:pointer;box-shadow:0 2px 8px rgba(74,108,247,0.4)}
        .calc-results{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
        .calc-result-item{text-align:center;padding:20px 12px;border-radius:14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05)}
        .calc-result-item.highlight{background:rgba(74,108,247,0.05);border-color:rgba(74,108,247,0.15)}
        .calc-result-val{font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700;background:linear-gradient(135deg,#638cff,#9f7afa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .calc-result-label{font-size:12px;color:var(--text);font-weight:600;margin-top:4px}
        .calc-result-sub{font-size:11px;color:var(--text-dim);margin-top:2px;line-height:1.4}
        .calc-cta-row{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
        .calc-disclaimer{font-size:11px;color:var(--text-dim);opacity:.6}
        @media(max-width:600px){
          .calc-results{grid-template-columns:1fr}
          .calc-wrap{padding:20px 16px}
        }

        /* FZ-152 */
        .fz-card{border-radius:24px;padding:48px 44px;background:rgba(74,108,247,0.03);border:1px solid rgba(74,108,247,0.1);position:relative;overflow:hidden}
        .fz-card::before{content:"";position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(74,108,247,0.07),transparent 70%);pointer-events:none}
        .fz-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}
        .fz-badge{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:24px;border:1px solid rgba(74,108,247,0.15);background:rgba(74,108,247,0.06);font-size:11px;color:var(--accent);font-weight:600;margin-bottom:20px;font-family:'JetBrains Mono',monospace;letter-spacing:1px}
        .fz-h{font-size:clamp(20px,2.5vw,30px);font-weight:800;color:var(--text-bright);letter-spacing:-.5px;margin-bottom:14px;line-height:1.2}
        .fz-p{font-size:14px;color:var(--text-dim);line-height:1.7;margin-bottom:0}
        .fz-points{display:flex;flex-direction:column;gap:14px}
        .fz-point{display:flex;gap:12px;align-items:flex-start}
        .fz-point-icon{width:32px;height:32px;border-radius:8px;background:rgba(74,108,247,0.08);border:1px solid rgba(74,108,247,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px}
        .fz-point-text{font-size:13.5px;color:var(--text-dim);line-height:1.55}
        .fz-point-text strong{color:var(--text);display:block;margin-bottom:2px;font-size:13px}
        @media(max-width:768px){.fz-grid{grid-template-columns:1fr}.fz-card{padding:28px 22px}}

        /* Trust */
        .trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .trust-card{border-radius:18px;padding:24px 20px;background:var(--bg-card);border:1px solid var(--border);transition:border-color .3s}
        .trust-card:hover{border-color:var(--border-hover)}
        .trust-icon{font-size:22px;margin-bottom:12px}
        .trust-title{font-size:14px;font-weight:700;color:var(--text-bright);margin-bottom:6px}
        .trust-desc{font-size:12.5px;color:var(--text-dim);line-height:1.55}
        @media(max-width:768px){.trust-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:420px){.trust-grid{grid-template-columns:1fr}}

        /* CTA */
        .cta-card{max-width:640px;margin:0 auto;border-radius:24px;padding:60px 40px;text-align:center;position:relative;overflow:hidden;background:var(--bg-card);backdrop-filter:blur(24px);border:1px solid var(--border);box-shadow:0 0 48px var(--accent-glow)}
        .cta-card .orb{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(74,108,247,0.08),transparent);pointer-events:none}
        @media(max-width:480px){
          .cta-card{padding:40px 24px}
          .btn-p,.btn-s{padding:12px 24px;font-size:13px}
        }

        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes typing{0%,80%,100%{transform:scale(0.6);opacity:.4}40%{transform:scale(1);opacity:1}}
      `}</style>

      {/* BG */}
      <div className="ambient">
        <div className="orb1" style={{ transform: `translate(${mouse.x * 25}px, ${mouse.y * 25}px)` }} />
        <div className="orb2" style={{ transform: `translate(${-mouse.x * 18}px, ${-mouse.y * 18}px)` }} />
        <div className="grid" />
      </div>

      {/* NAV */}
      <nav className="nav">
        <div className="wrap nav-inner">
          <div className="nav-logo">
            <div className="nav-mark">A</div>
            <span className="nav-name">agento</span>
          </div>
          <div className="nav-links">
            <a href="#workflow" className="nav-link">Процесс</a>
            <a href="#cases" className="nav-link">Кейсы</a>
            <a href="#stack" className="nav-link">Стек</a>
            <a href="#calc" className="nav-link">Калькулятор</a>
            <a href="#privacy" className="nav-link">Конфиденциальность</a>
            <a href={TG} target="_blank" rel="noopener noreferrer" className="nav-cta">Написать</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <S><div className="hero-badge"><span className="dot"/>Принимаю проекты · Telegram, WhatsApp, Bitrix24</div></S>
            <S d={80}><h1 className="hero-h1">ИИ-агент продаёт<br/><span className="grad">пока вы спите</span></h1></S>
            <S d={150}><p className="hero-p">Клиенты уходят не потому что у вас плохой продукт — конкурент ответил быстрее. Агент отвечает за 2 секунды. Днём и ночью. Без выходных.</p></S>
            <S d={220}><div className="hero-btns">
              <a href={TG} target="_blank" rel="noopener noreferrer" className="btn-p">Обсудить проект</a>
              <a href="#cases" className="btn-s">Как это работает</a>
            </div></S>
            <S d={320}><div className="hero-stats">
              {[{v:"2",s:" сек",l:"ответ агента"},{v:"24",s:"/7",l:"без выходных"},{v:"38",s:"%",l:"рост конверсии"}].map((m,i)=>(
                <div key={i}><div className="hero-stat-val"><Ct end={m.v} sfx={m.s}/></div><div className="hero-stat-label">{m.l}</div></div>
              ))}
            </div></S>
          </div>
          <S d={300}><Phone chat={CASES[0].chat.slice(0,7)}/></S>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="workflow" style={{position:"relative",zIndex:1,padding:"100px 0"}}>
        <div className="wrap">
          <S><div style={{marginBottom:48}}>
            <div className="sec-label">Как я работаю</div>
            <h2 className="sec-h2">Шесть шагов от идеи<br/>до работающего агента</h2>
            <p style={{fontSize:15,color:"var(--text-dim)",marginTop:14,maxWidth:520,lineHeight:1.65}}>Никаких сюрпризов. Каждый этап согласован — вы знаете, что происходит и когда.</p>
          </div></S>
          <div className="wf-grid">
            {WORKFLOW.map((w, i) => (
              <S key={i} d={i * 80}>
                <div className={`wf-card${i % 2 === 0 ? " wf-card-accent" : ""}`}>
                  <div className="wf-num">{w.n}</div>
                  <span className="wf-icon">{w.icon}</span>
                  <div className="wf-title">{w.t}</div>
                  <div className="wf-desc">{w.d}</div>
                  {w.img && (
                    <div className="wf-img-wrap">
                      <img src={N8N_IMG} alt="Схема автоматизации в n8n" loading="lazy" width="600" height="300" />
                    </div>
                  )}
                </div>
              </S>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" style={{position:"relative",zIndex:1,padding:"100px 0"}}>
        <div className="wrap">
          <S><div style={{marginBottom:48}}>
            <div className="sec-label">Таймлайн</div>
            <h2 className="sec-h2">От первого звонка<br/>до запуска — 12 дней</h2>
            <p style={{fontSize:15,color:"var(--text-dim)",marginTop:14,maxWidth:500,lineHeight:1.65}}>Конкретные сроки для каждого шага. Никакого «мы уточним позже».</p>
          </div></S>
          <S d={80}>
            <div className="tl-wrap">
              {TIMELINE.map((item, i) => (
                <div key={i} className="tl-item">
                  <div className="tl-day-wrap">
                    <div className="tl-dot" />
                    <div className="tl-day">{item.day}</div>
                  </div>
                  <div className="tl-card">
                    <div className="tl-title">{item.t}</div>
                    <div className="tl-desc">{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </S>
        </div>
      </section>

      {/* HOW */}
      <section id="how" style={{position:"relative",zIndex:1,padding:"100px 0"}}>
        <div className="wrap">
          <S><div style={{marginBottom:48}}><div className="sec-label">Процесс</div><h2 className="sec-h2">Три шага до автопилота</h2></div></S>
          <div className="steps">
            {[
              {n:"01",t:"Клиент пишет",d:"В мессенджер, на сайт — куда угодно. Агент подхватывает за 2 секунды. Клиент не остывает и не уходит."},
              {n:"02",t:"Агент квалифицирует",d:"Выясняет потребность, консультирует, подбирает вариант. Как лучший менеджер — только работает круглосуточно."},
              {n:"03",t:"Вы получаете горячего",d:"Имя, телефон, потребность, история диалога. Менеджер работает только с готовыми клиентами."},
            ].map((s,i)=>(
              <S key={i} d={i*100}><div className="step"><div className="step-num">{s.n}</div><div className="step-title">{s.t}</div><div className="step-desc">{s.d}</div></div></S>
            ))}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section id="cases" style={{position:"relative",zIndex:1,padding:"100px 0"}}>
        <div className="wrap">
          <S><div style={{marginBottom:40}}><div className="sec-label">Кейсы</div><h2 className="sec-h2">Как это работает в деле</h2></div></S>
          <S d={60}><div className="case-tabs">
            {CASES.map((cs,i)=>(
              <button key={i} className={`case-tab ${tab===i?"case-tab-a":"case-tab-i"}`} onClick={()=>setTab(i)}>{cs.tag}</button>
            ))}
          </div></S>
          <div className="case-layout" key={tab}>
            <div>
              <S><div className="case-title">{c.title}</div></S>
              <S d={50}><div className="case-desc">{c.desc}</div></S>
              <S d={100}><div className="case-metrics">
                {c.metrics.map((m,i)=>(
                  <div key={i} className="case-metric">
                    <div className="case-metric-val"><Ct end={m.v} sfx={m.s}/></div>
                    <div className="case-metric-label">{m.l}</div>
                  </div>
                ))}
              </div></S>
              <S d={150}><div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                <a href={TG} target="_blank" rel="noopener noreferrer" className="btn-p">Хочу так же</a>
                {tab === 0 && (
                  <a href={CRM} target="_blank" rel="noopener noreferrer" className="btn-s" title="Демо-версия CRM. Реальные данные клиентов скрыты в целях конфиденциальности.">Демо CRM</a>
                )}
              </div></S>
              {tab === 0 && (<S d={180}><div className="crm-note">* демо-версия CRM. реальные данные клиентов скрыты в целях конфиденциальности</div></S>)}
              {tab === 0 && (
                <S d={220}><div className="demo-card">
                  <div className="demo-card-label"><span className="live-dot"/>Живое демо</div>
                  <div className="demo-card-text">Напишите боту Sunshine — это реальный агент, который квалифицирует и записывает на урок. Посмотрите, как это работает изнутри.</div>
                  <a href={DEMO_BOT} target="_blank" rel="noopener noreferrer" className="btn-p" style={{fontSize:13,padding:"10px 22px"}}>Попробовать бота Sunshine</a>
                </div></S>
              )}
            </div>
            <S d={180}><Phone chat={c.chat}/></S>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{position:"relative",zIndex:1,padding:"100px 0"}}>
        <div className="wrap">
          <S><div style={{marginBottom:40}}><div className="sec-label">Возможности</div><h2 className="sec-h2">Что умеет агент</h2></div></S>
          <div className="bento">
            {FEATURES.map((f,i)=>(
              <S key={i} d={i*60} style={f.w?{gridColumn:"span 2"}:{}}>
                <div className={`bento-item${f.w?" wide":""}`}>
                  <div className="bento-title">{f.t}</div>
                  <div className="bento-desc">{f.d}</div>
                </div>
              </S>
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section id="stack" style={{position:"relative",zIndex:1,padding:"100px 0"}}>
        <div className="wrap">
          <S><div style={{marginBottom:48}}>
            <div className="sec-label">Инфраструктура</div>
            <h2 className="sec-h2">Не один бот,<br/>а рабочая система</h2>
            <p style={{fontSize:15,color:"var(--text-dim)",marginTop:14,maxWidth:520,lineHeight:1.65}}>Не навязываю один инструмент. Собираю решение под ваш бизнес: нужную модель, нужный канал, нужную CRM и нужную аналитику.</p>
          </div></S>
          <S d={80}>
            <div className="stack-layout">
              {STACK_LAYERS.map((layer, i) => (
                <div key={i} className="stack-card">
                  <div className="stack-layer-label" style={{color: layer.color}}>{layer.label}</div>
                  <div className="stack-chips">
                    {layer.items.map((item, j) => (
                      <span key={j} className="stack-chip" style={{color: layer.color, borderColor: `${layer.color}30`, background: `${layer.color}0d`}}>{item}</span>
                    ))}
                  </div>
                  <div className="stack-desc">{layer.desc}</div>
                </div>
              ))}
            </div>
          </S>
          <S d={160}>
            <div className="stack-flow">
              {["Claude / OpenAI / YandexGPT","→","Telegram / WhatsApp / Сайт","→","n8n / Make","→","Bitrix24 / amoCRM","→","Dashboard"].map((item, i) => (
                item === "→"
                  ? <span key={i} className="stack-flow-arrow">→</span>
                  : <span key={i} className="stack-flow-item">{item}</span>
              ))}
            </div>
          </S>
          <S d={200}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginTop:32}}>
              {[
                {t:"Подбираю модель под задачу",d:"Не всегда нужен самый дорогой стек. Оптимизирую под бюджет и требования."},
                {t:"Можно начать с одного канала",d:"Сначала Telegram или сайт — потом масштабируем. Без переплаты за ненужное."},
                {t:"Контур управления в комплекте",d:"CRM, аналитика, история обращений. Вы видите каждый диалог и метрику."},
              ].map((item, i) => (
                <div key={i} style={{borderRadius:14,padding:"18px 20px",background:"var(--bg-card)",border:"1px solid var(--border)"}}>
                  <div style={{fontSize:13,fontWeight:700,color:"var(--text-bright)",marginBottom:6}}>{item.t}</div>
                  <div style={{fontSize:12.5,color:"var(--text-dim)",lineHeight:1.55}}>{item.d}</div>
                </div>
              ))}
            </div>
          </S>
        </div>
      </section>

      {/* CALC */}
      <section id="calc" style={{position:"relative",zIndex:1,padding:"100px 0"}}>
        <div className="wrap">
          <S><div style={{marginBottom:48}}>
            <div className="sec-label">Калькулятор</div>
            <h2 className="sec-h2">Посчитайте выгоду<br/>для своего бизнеса</h2>
            <p style={{fontSize:15,color:"var(--text-dim)",marginTop:14,maxWidth:520,lineHeight:1.65}}>Передвигайте ползунки — увидите, сколько заявок теряете и сколько сможете сэкономить.</p>
          </div></S>
          <S d={80}><Calculator /></S>
        </div>
      </section>

      {/* SHOWCASE — phone mock, visible on mobile too */}
      <section id="showcase" style={{position:"relative",zIndex:1,padding:"100px 0"}}>
        <div className="wrap">
          <S><div style={{marginBottom:48}}>
            <div className="sec-label">Как это выглядит</div>
            <h2 className="sec-h2">Что получает клиент<br/>на своём телефоне</h2>
            <p style={{fontSize:15,color:"var(--text-dim)",marginTop:14,maxWidth:520,lineHeight:1.65}}>Агент выглядит как живой менеджер. Отвечает моментально, ведёт диалог, передаёт горячего лида.</p>
          </div></S>
          <S d={80}>
            <div className="showcase-layout">
              <div className="showcase-phone">
                <div className="showcase-screen">
                  <div className="showcase-header">
                    <div className="showcase-avatar">A</div>
                    <div>
                      <div className="showcase-name">Agento</div>
                      <div className="showcase-status">● онлайн</div>
                    </div>
                  </div>
                  {[
                    {r:"b",t:"Добрый день! Чем могу помочь?"},
                    {r:"u",t:"Хочу узнать подробнее о ваших услугах"},
                    {r:"b",t:"Конечно. Под какой бизнес подбираем решение?"},
                    {r:"u",t:"Салон красоты, записи через WhatsApp"},
                    {r:"b",t:"Отлично. Агент подключится к WhatsApp и будет записывать клиентов автоматически. Хотите увидеть демо прямо сейчас?"},
                    {r:"u",t:"Да, покажите"},
                    {r:"b",t:"Запускаю демо для вас. Сейчас пришлю ссылку 👇"},
                  ].map((m,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:m.r==="u"?"flex-end":"flex-start"}}>
                      <div className={m.r==="b"?"ph-b":"ph-u"}>{m.t}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="showcase-points">
                {[
                  {icon:"⚡",t:"Ответ за 2 секунды",d:"Клиент написал — агент уже отвечает. Даже ночью, в воскресенье, в праздник."},
                  {icon:"🧠",t:"Понимает контекст",d:"Запоминает детали из диалога. Не просит повторять то, что уже сказано."},
                  {icon:"📋",t:"Передаёт с резюме",d:"Менеджер видит: имя, потребность, история переписки. Сразу к делу."},
                  {icon:"📱",t:"Любой мессенджер",d:"Telegram, WhatsApp, Avito, Instagram, чат на сайте — ваш выбор."},
                ].map((p,i)=>(
                  <S key={i} d={i*80}>
                    <div className="showcase-point">
                      <div className="showcase-point-icon">{p.icon}</div>
                      <div className="showcase-point-text"><strong>{p.t}</strong>{p.d}</div>
                    </div>
                  </S>
                ))}
              </div>
            </div>
          </S>
        </div>
      </section>

      {/* DELIVERY — что получает бизнес после запуска */}
      <section id="delivery" style={{position:"relative",zIndex:1,padding:"80px 0"}}>
        <div className="wrap">
          <S><div style={{marginBottom:40}}>
            <div className="sec-label">После запуска</div>
            <h2 className="sec-h2">Не просто бот —<br/>готовая инфраструктура</h2>
            <p style={{fontSize:15,color:"var(--text-dim)",marginTop:14,maxWidth:520,lineHeight:1.65}}>Вы не привязаны ко мне. Всё, что я собираю — остаётся у вас: доступы, схемы, документация.</p>
          </div></S>
          <S d={80}>
            <div className="delivery-grid">
              {[
                {icon:"🔑", t:"Все доступы ваши", d:"API-ключи, аккаунты, схемы автоматизации. Никакой зависимости от разработчика."},
                {icon:"📖", t:"Инструкция по управлению", d:"Как вносить правки, как менять сценарии, как смотреть аналитику. Всё задокументировано."},
                {icon:"📊", t:"Дашборд с метриками", d:"Лиды, конверсия, история диалогов, качество ответов — в реальном времени."},
                {icon:"🔄", t:"Можно масштабировать", d:"Добавить канал, поменять модель ИИ, интегрировать новую CRM — без переделки с нуля."},
                {icon:"🛡️", t:"Поддержка по желанию", d:"Не хотите вникать — беру на сопровождение. Хотите сами — передаю с объяснением каждого узла."},
                {icon:"⚡", t:"Работает без вас", d:"Агент не болеет, не устаёт, не уходит в отпуск. Обрабатывает заявки пока вы занимаетесь бизнесом."},
              ].map((item, i) => (
                <S key={i} d={i*50}>
                  <div className="delivery-card">
                    <div className="delivery-icon">{item.icon}</div>
                    <div>
                      <div className="delivery-title">{item.t}</div>
                      <div className="delivery-desc">{item.d}</div>
                    </div>
                  </div>
                </S>
              ))}
            </div>
          </S>
        </div>
      </section>

      {/* DEMO CTA BLOCK */}
      <section style={{position:"relative",zIndex:1,padding:"60px 0"}}>
        <div className="wrap">
          <S>
            <div className="demo-block">
              <div className="demo-block-badge"><span className="live-dot"/>Ассистент онлайн прямо сейчас</div>
              <h2 className="demo-block-h">Спросите ассистента прямо здесь</h2>
              <p className="demo-block-p">Нажмите на один из вопросов или откройте чат — это реальный ИИ-ассистент. Спросите что угодно про автоматизацию, интеграции или цены.</p>
              <div className="demo-quick">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} className="demo-quick-btn" onClick={() => openChat(q)}>{q}</button>
                ))}
              </div>
              <div className="demo-btns">
                <button className="btn-p" onClick={() => openChat()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                  Открыть чат
                </button>
                <a href={TG} target="_blank" rel="noopener noreferrer" className="btn-s">Написать в Telegram</a>
              </div>
            </div>
          </S>
        </div>
      </section>

      {/* PRIVACY / FZ-152 */}
      <section id="privacy" style={{position:"relative",zIndex:1,padding:"100px 0"}}>
        <div className="wrap">
          <S>
            <div className="fz-card">
              <div className="fz-grid">
                <div>
                  <div className="fz-badge">🔒 ФЗ-152 · Персональные данные</div>
                  <h2 className="fz-h">Конфиденциальность — это часть работы, не опция</h2>
                  <p className="fz-p">Перед каждым проектом мы обсуждаем, какие данные собирает агент и как они хранятся. Я учитываю требования Федерального закона №152-ФЗ «О персональных данных» — политику обработки, хранение на серверах РФ и согласие пользователей.</p>
                  <div style={{marginTop:24}}>
                    <a href={TG} target="_blank" rel="noopener noreferrer" className="btn-p" style={{fontSize:13,padding:"10px 24px"}}>Обсудить условия</a>
                  </div>
                </div>
                <div className="fz-points">
                  {[
                    {icon:"📄", t:"Политика обработки данных", d:"Помогу составить политику конфиденциальности под ваш бот и бизнес."},
                    {icon:"🇷🇺", t:"Хранение в РФ", d:"При необходимости настраиваем хранение данных на серверах в России — соответствие 149-ФЗ."},
                    {icon:"✅", t:"Согласие пользователей", d:"Агент собирает согласие на обработку данных там, где это требуется по закону."},
                    {icon:"🗑️", t:"Право на удаление", d:"По запросу клиента данные удаляются. Прописываем это в регламенте проекта."},
                  ].map((p,i)=>(
                    <div key={i} className="fz-point">
                      <div className="fz-point-icon">{p.icon}</div>
                      <div className="fz-point-text"><strong>{p.t}</strong>{p.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </S>
        </div>
      </section>

      {/* TRUST */}
      <section style={{position:"relative",zIndex:1,padding:"80px 0"}}>
        <div className="wrap">
          <S><div style={{marginBottom:36}}>
            <div className="sec-label">Стандарт</div>
            <h2 className="sec-h2">Почему со мной спокойно</h2>
          </div></S>
          <div className="trust-grid">
            {TRUST.map((t,i)=>(
              <S key={i} d={i*70}>
                <div className="trust-card">
                  <div className="trust-icon">{t.icon}</div>
                  <div className="trust-title">{t.t}</div>
                  <div className="trust-desc">{t.d}</div>
                </div>
              </S>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{position:"relative",zIndex:1,padding:"60px 0 100px"}}>
        <div className="wrap">
          <S><div className="cta-card">
            <div className="orb" style={{top:-60,right:-60,width:240,height:240}}/>
            <div className="orb" style={{bottom:-40,left:-40,width:160,height:160}}/>
            <h2 style={{fontSize:"clamp(22px,3.5vw,32px)",fontWeight:700,color:"var(--text-bright)",marginBottom:14,letterSpacing:-.5,position:"relative"}}>Готовы запустить ИИ-агента?</h2>
            <p style={{fontSize:15,color:"var(--text-dim)",marginBottom:32,position:"relative",maxWidth:400,margin:"0 auto 32px",lineHeight:1.6}}>Напишите — обсудим проект, покажу как это будет работать у вас. Стоимость договорная.</p>
            <a href={TG} target="_blank" rel="noopener noreferrer" className="btn-p" style={{position:"relative"}}>Написать</a>
            <p style={{fontSize:12,color:"var(--text-dim)",marginTop:16,position:"relative",opacity:.6}}>@arinashrr / Telegram</p>
          </div></S>
        </div>
      </section>

      <footer style={{position:"relative",zIndex:1,padding:"16px 20px",borderTop:"1px solid rgba(255,255,255,0.02)",textAlign:"center"}}>
        <span style={{fontSize:11,color:"var(--text-dim)",opacity:.4}}>2026 Agento / Арина / ИИ-агенты для бизнеса</span>
      </footer>

      <ChatWidget/>
    </div>
  );
}
