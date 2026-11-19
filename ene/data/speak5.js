// data/speak5.js —— 开口 30 天 · 综合实战（Día 29–30）。格式见 data/SPEAK.md
window.ENE_SPEAK = window.ENE_SPEAK || [];

// ---------- Día 29 听播客：在国外生活 ----------
window.ENE_SPEAK.push({
  day: 29, week: 5, title: "听播客：在国外生活",
  cando: "能听懂一段两分钟的真实访谈，并用自己的话复述要点",
  candoItems: ["听出嘉宾来了多久、做什么工作", "听出她觉得什么最难", "复述她的习惯和计划"],
  canSay: { latam: "Lleva dos años aquí y trabaja en una empresa de importación.", zh: "她在这里两年了，在一家进口公司工作。" },
  warm: {
    q: "听一句，选出中文意思（复习 Día 28）",
    say: { latam: "Necesito que traiga su pasaporte." },
    opts: ["我需要您带上护照。", "我已经拿到您的护照了。", "您的护照在这儿。", "您不用带护照。"], answer: 0
  },
  dialog: [
    { who: "主持人", latam: "Hola a todos y bienvenidos. Hoy hablamos con Mei, que es de China.", zh: "大家好，欢迎收听。今天我们和来自中国的梅聊一聊。" },
    { who: "主持人", latam: "Mei, ¿cuánto tiempo llevas aquí?", zh: "梅，你来这里多久了？" },
    { who: "嘉宾", latam: "Llevo dos años en Ciudad de México.", es: "Llevo dos años en Madrid.", zh: "我在墨西哥城两年了。（西班牙版：马德里）" },
    { who: "主持人", latam: "¿Y a qué te dedicas?", zh: "那你是做什么工作的？" },
    { who: "嘉宾", latam: "Trabajo en una empresa de importación. Hablo con clientes y proveedores todos los días.", zh: "我在一家进口公司工作。每天都和客户、供应商打交道。" },
    { who: "主持人", latam: "¿Ha sido difícil aprender español?", zh: "学西班牙语难吗？" },
    { who: "嘉宾", latam: "Al principio, sí. Nunca he estudiado tanto en mi vida. Pero ahora me gusta mucho.", zh: "刚开始很难。我这辈子从来没这么用功过。但现在我很喜欢。" },
    { who: "主持人", latam: "¿Qué es lo más difícil para ti?", zh: "对你来说最难的是什么？" },
    { who: "嘉宾", latam: "Los verbos y hablar por teléfono. La gente habla muy rápido.", zh: "动词变位和打电话。大家说话都很快。" },
    { who: "主持人", latam: "¿Y qué te gusta más de la ciudad?", zh: "那你最喜欢这座城市的什么？" },
    { who: "嘉宾", latam: "Me encanta la comida y la gente es muy amable. Los domingos siempre voy al mercado.", zh: "我超爱这里的吃的，人也很友好。每个星期天我都去市场。" },
    { who: "主持人", latam: "¿Qué planes tienes para el futuro?", zh: "你以后有什么计划？" },
    { who: "嘉宾", latam: "Voy a abrir mi propia empresa. Espero que todo salga bien.", zh: "我打算开自己的公司。希望一切顺利。" },
    { who: "主持人", latam: "¡Ojalá! Muchas gracias, Mei.", zh: "但愿如此！非常感谢你，梅。" }
  ],
  check: { q: "梅以后打算做什么？", opts: ["回中国", "开自己的公司", "换一座城市", "当老师"], answer: 1 },
  chunks: [
    { latam: "Llevo dos años aquí. / Lleva dos años aquí.", zh: "我在这里两年了。/ 她在这里两年了。",
      note: { latam: "llevar + 时间 + 地点 = 在某地已经待了多久。“我”是 llevo，“她 / 他”是 lleva。问别人：¿Cuánto tiempo llevas aquí?" } },
    { latam: "¿A qué te dedicas? — Trabajo en …", zh: "你是做什么工作的？——我在……工作",
      note: { latam: "问职业比 ¿Qué haces? 更清楚。对“您”说：¿A qué se dedica? 复述别人时换成第三人称：Trabaja en …。" } },
    { latam: "Lo más difícil es … / son …", zh: "最难的是……",
      note: { latam: "lo más + 形容词 = 最……的（事情）。后面是复数时用 son：Lo más difícil son los verbos。" } },
    { latam: "Le encanta … / Va a …", zh: "她超爱…… / 她打算……",
      note: { latam: "复述时把“我”换成“她”：me encanta → le encanta，voy a → va a，voy → va。这就是复述最常用的变化。" } }
  ],
  tip: { latam: "gente 的 g 在 e 前读喉音，像 j：hen-te。听真人说话时先抓动词和时间词，听不懂的词先跳过。" },
  tasks: [
    { zh: "复述第 1 点：她在这里两年了。", cue: "llevar 的“她”形", skill: "conj", latam: "Lleva dos años aquí." },
    { zh: "复述第 2 点：她在一家进口公司工作。", cue: "trabajar 的“她”形", skill: "conj", latam: "Trabaja en una empresa de importación." },
    { zh: "复述第 3 点：对她来说最难的是动词。", cue: "后面是复数，用 son", skill: "phrase", latam: "Para ella, lo más difícil son los verbos." },
    { zh: "复述第 4 点：她超爱这里的吃的。", cue: "me encanta 换成“她”", skill: "conj", latam: "Le encanta la comida." },
    { zh: "复述第 5 点：每个星期天她都去市场。", cue: "ir 的“她”形", skill: "conj", latam: "Los domingos siempre va al mercado." },
    { zh: "复述第 6 点：她打算开自己的公司。", cue: "va a + 原形", skill: "conj", latam: "Va a abrir su propia empresa." }
  ],
  drill: {
    title: "复述时换成“她”",
    items: [
      { latam: "lleva dos años", tip: "lle-va：ll 读 ye，结尾是 a 不是 o" },
      { latam: "le encanta la comida", tip: "le-en-can-ta：le 和 en 连读" },
      { latam: "va al mercado", tip: "va-al 连成一拍，mer 的 r 弹一下" },
      { latam: "su propia empresa", tip: "pro-pia：pr 连在一起，ia 连成一拍" }
    ]
  }
});

// ---------- Día 30 结业：三分钟介绍我自己 ----------
window.ENE_SPEAK.push({
  day: 30, week: 5, title: "结业：介绍我的生活",
  cando: "能连续说三分钟，介绍自己、工作、日常、经历和计划",
  candoItems: ["介绍自己和来了多久", "说工作和日常习惯", "说今年做过的事", "说以后的计划和希望"],
  canSay: { latam: "Este año he aprendido mucho español.", zh: "今年我学了很多西班牙语。" },
  warm: {
    q: "听一句，她来这里多久了？（复习 Día 29）",
    say: { latam: "Llevo dos años en Ciudad de México.", es: "Llevo dos años en Madrid." },
    opts: ["两年", "两个月", "十二年", "两天"], answer: 0
  },
  dialog: [
    { who: "小林", latam: "Hola, me llamo Lin y soy de China.", zh: "大家好，我叫小林，是中国人。" },
    { who: "小林", latam: "Llevo un año aquí. Vivo en un departamento cerca del centro.", es: "Llevo un año aquí. Vivo en un piso cerca del centro.", zh: "我来这里一年了。我住在市中心附近的一套公寓里。" },
    { who: "小林", latam: "Trabajo en una empresa de comercio exterior. Me encargo de los clientes nuevos.", zh: "我在一家外贸公司工作，负责新客户。" },
    { who: "小林", latam: "Normalmente empiezo a las nueve y vengo en metro.", zh: "我通常九点上班，坐地铁来。" },
    { who: "小林", latam: "Después del trabajo, a veces voy al gimnasio. Casi nunca salgo de noche.", zh: "下班后，我有时候去健身房。我几乎从不晚上出去。" },
    { who: "小林", latam: "Me gusta mucho la comida de aquí, pero no me gusta la comida muy picante.", zh: "我很喜欢这里的菜，但不喜欢太辣的。" },
    { who: "小林", latam: "Este año he aprendido mucho español.", zh: "今年我学了很多西班牙语。" },
    { who: "小林", latam: "Lo más difícil son los verbos, pero ahora hablo mejor.", zh: "最难的是动词，但现在我说得更好了。" },
    { who: "小林", latam: "Esta semana he ido al médico y he abierto una cuenta en el banco, todo en español.", zh: "这周我去看了医生，还在银行开了户，全都用西班牙语。" },
    { who: "小林", latam: "El próximo año voy a viajar por todo el país.", zh: "明年我打算去全国各地旅行。" },
    { who: "小林", latam: "Quiero que mi familia venga a visitarme.", zh: "我想让家人来看我。" },
    { who: "小林", latam: "Espero que mi español sea cada día mejor. ¡Gracias por escucharme!", zh: "希望我的西班牙语一天比一天好。谢谢大家听我说！" }
  ],
  check: { q: "小林明年打算做什么？", opts: ["回中国工作", "去全国各地旅行", "换一份工作", "搬家"], answer: 1 },
  chunks: [
    { latam: "Me llamo … Soy de … Llevo … aquí.", zh: "开头：我叫…… 我是……人 我来这里……了",
      note: { latam: "第一部分：名字、从哪来、来了多久。三句就够，别在开头卡太久。" } },
    { latam: "Trabajo en … / Normalmente … / Me gusta …", zh: "现在：工作、日常、喜好",
      note: { latam: "第二部分用现在时（第 3 周）：trabajo, vivo, empiezo, vengo；配上频率词和 me gusta / me gustan。这部分可以说最长。" } },
    { latam: "Este año he … / Esta semana he …", zh: "经历：今年我…… / 这周我……",
      note: { latam: "第三部分用 he + 过去分词（Día 22）。注意不规则分词：abrir → abierto，hacer → hecho，ver → visto。", es: "在西班牙，“今年、这周”里的事用 he hecho 最自然。" } },
    { latam: "Voy a … / Quiero que … / Espero que …", zh: "未来：计划和希望",
      note: { latam: "第四部分：voy a + 原形说计划（Día 23），quiero que / espero que + 虚拟式说希望（Día 24）。最后说一句 ¡Gracias por escucharme! 收尾。" } }
  ],
  tip: { latam: "说三分钟不用快，句号处停一下换气。he aprendido 连读成 ea-pren-di-do，he abierto 连读成 ea-bier-to。" },
  tasks: [
    { zh: "第 1 步：说你是哪里人、来这里多久了。", cue: "ser + llevar", skill: "conj", latam: "Soy de China y llevo un año aquí." },
    { zh: "第 2 步：说工作和住处。", cue: "trabajar 和 vivir 的“我”形", skill: "conj", latam: "Trabajo en una empresa y vivo cerca del centro." },
    { zh: "第 3 步：说日常习惯。", cue: "频率词 + empezar、venir", skill: "conj", latam: "Normalmente empiezo a las nueve y vengo en metro." },
    { zh: "第 4 步：说你喜欢什么。", cue: "单数用 gusta", skill: "conj", latam: "Me gusta mucho la comida de aquí." },
    { zh: "第 5 步：说今年做过的事。", cue: "he + 过去分词", skill: "conj", latam: "Este año he aprendido mucho español." },
    { zh: "第 6 步：说明年的计划。", cue: "voy a + 原形", skill: "conj", latam: "El próximo año voy a viajar por todo el país." }
  ],
  drill: {
    title: "长段自述里的难点",
    items: [
      { latam: "llevo un año aquí", tip: "ye-vo-un-a-ño：ll 读 ye，ñ 像“尼”" },
      { latam: "he aprendido", tip: "ea-pren-di-do：h 不发音，pr 连在一起" },
      { latam: "he abierto una cuenta", tip: "ea-bier-to：abierto 是不规则分词" },
      { latam: "voy a viajar", tip: "vo-ya-via-jar：j 从喉咙送气" },
      { latam: "que mi español sea mejor", tip: "se-a：两个元音分开读；me-jor 的 j 送气" }
    ]
  }
});
