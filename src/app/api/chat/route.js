export async function POST(req) {
  const { messages } = await req.json();
  const key = process.env.OPENROUTER_API_KEY;

  if (!key) {
    return Response.json({ reply: "Ассистент временно недоступен. Напишите Арине — @arinashrr" });
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4",
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content: `Ты — ИИ-ассистент Арины, специалиста по автоматизации и ИИ-агентам (бренд Agento).

СТИЛЬ:
— 2-4 предложения максимум. Без воды.
— Дружелюбно но профессионально.
— Без эмодзи. Совсем.
— Если спрашивают цену или конкретный проект — предлагай написать Арине @arinashrr в Telegram.

ЧТО ЗНАЕШЬ:
— ИИ-агенты: чат-боты в Telegram, на сайте, в WhatsApp
— Автоматизация продаж: квалификация, запись, бронирование, доведение до сделки
— Интеграции: CRM, базы данных, Google Calendar, оплаты, email, документы
— Стек: n8n, Supabase, Redis, OpenAI, Claude API, Telegram Bot API
— Ниши: онлайн-школы, туризм, услуги, магазины, недвижимость
— Стоимость договорная, сроки от 3 дней`,
          },
          ...messages,
        ],
      }),
    });
    const data = await res.json();
    return Response.json({ reply: data.choices?.[0]?.message?.content || "Напишите Арине — @arinashrr" });
  } catch {
    return Response.json({ reply: "Сейчас не могу ответить. Напишите Арине — @arinashrr" });
  }
}
