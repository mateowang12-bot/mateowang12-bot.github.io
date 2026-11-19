// data/speak3.js —— 开口 30 天 · 第 3 周「能变位」（Día 15–21）。格式见 data/SPEAK.md
window.ENE_SPEAK = window.ENE_SPEAK || [];

// ---------- Día 15 认识新同事：现在时变位 ----------
window.ENE_SPEAK.push({
  day: 15, week: 3, title: "认识新同事",
  cando: "能用现在时说出自己在哪工作、住在哪、今天有什么安排",
  candoItems: ["说自己在哪工作、住在哪", "用 -ar / -er / -ir 动词的“我”形", "用 8 个常用不规则动词回答问题"],
  canSay: { latam: "Trabajo en ventas y vivo cerca de la oficina.", zh: "我在销售部工作，住在公司附近。" },
  warm: {
    q: "听一句，选出中文意思（复习 Día 14）",
    say: { latam: "La cuenta, por favor. ¿Cuánto es?" },
    opts: ["请结账。多少钱？", "请给我菜单。", "请再来一份。", "厕所在哪儿？"], answer: 0
  },
  dialog: [
    { who: "同事", latam: "Hola, soy Laura. ¿Eres nuevo aquí?", zh: "你好，我是劳拉。你是新来的吗？" },
    { who: "你", latam: "Sí, soy Wei. Trabajo en ventas.", zh: "是的，我是伟。我在销售部工作。" },
    { who: "同事", latam: "¡Qué bien! ¿Dónde vives?", zh: "太好了！你住哪儿？" },
    { who: "你", latam: "Vivo cerca de la oficina. Vengo a pie.", zh: "我住在公司附近，走路来。" },
    { who: "同事", latam: "Yo como aquí todos los días. ¿Quieres comer con nosotros?", zh: "我每天在这儿吃饭。你想和我们一起吃吗？" },
    { who: "你", latam: "Hoy no puedo, tengo una reunión.", zh: "今天不行，我有个会。" },
    { who: "同事", latam: "No pasa nada. ¿Puedes mañana?", zh: "没关系。明天可以吗？" },
    { who: "你", latam: "Sí, mañana puedo. ¿Dónde estás tú?", zh: "可以，明天我可以。你在哪儿办公？" },
    { who: "同事", latam: "Estoy en el segundo piso. Mañana vamos juntos.", es: "Estoy en la segunda planta. Mañana vamos juntos.", zh: "我在二楼。明天我们一起去。" }
  ],
  check: { q: "新同事今天为什么不能一起吃饭？", opts: ["他要开会", "他不饿", "他住得远"], answer: 0 },
  chunks: [
    { latam: "Trabajo / Como / Vivo", zh: "我工作 / 我吃 / 我住（规则动词的“我”形）",
      note: { latam: "规则动词去掉 -ar / -er / -ir，换词尾。-ar：trabajo, trabajas, trabaja, trabajamos, trabajan；-er：como, comes, come, comemos, comen；-ir：vivo, vives, vive, vivimos, viven。“我”形都以 -o 结尾。拉美“你们”用 ustedes，和“他们”同形：ustedes trabajan。",
              es: "词尾同拉美。西班牙“你们”用 vosotros：trabajáis, coméis, vivís。" } },
    { latam: "Soy / Estoy / Tengo / Hago", zh: "我是 / 我在 / 我有 / 我做",
      note: { latam: "8 个最常用的不规则动词，“我”形要死记：ser→soy，estar→estoy，tener→tengo，hacer→hago，ir→voy，querer→quiero，poder→puedo，venir→vengo。tengo、hago、vengo 都有个 g，可以叫它们“go 家族”。" } },
    { latam: "¿Quieres …? / ¿Puedes …?", zh: "你想……吗？/ 你能……吗？",
      note: { latam: "后面直接接动词原形：¿Quieres comer? querer 的 e 变 ie（quiero, quieres），poder 的 o 变 ue（puedo, puedes），但 nosotros 不变：queremos, podemos。" } },
    { latam: "Vengo a pie / Vamos juntos", zh: "我走路来 / 我们一起去",
      note: { latam: "venir（来）：vengo, vienes, viene；ir（去）：voy, vas, va, vamos, van。" } }
  ],
  tip: { latam: "vivo 里的 v 和 b 读音一样，都像双唇轻轻碰一下的 b，不要咬下唇读成英语的 v。" },
  tasks: [
    { zh: "我在销售部工作。", cue: "trabajar 的“我”形", skill: "conj", latam: "Trabajo en ventas." },
    { zh: "我住在公司附近。", cue: "vivir 的“我”形", skill: "conj", latam: "Vivo cerca de la oficina." },
    { zh: "今天我有个会。", cue: "tener 的“我”形是 go 家族", skill: "conj", latam: "Hoy tengo una reunión." },
    { zh: "你想和我们一起吃饭吗？", cue: "querer 对“你”，后面接原形", skill: "conj", latam: "¿Quieres comer con nosotros?" },
    { zh: "可以，明天我可以。", cue: "poder 的“我”形，o 变 ue", skill: "conj", latam: "Sí, mañana puedo." }
  ],
  drill: {
    title: "“我”形的不规则变位",
    items: [
      { latam: "tengo una reunión", tip: "ten-go：不是 teno，g 要读出来" },
      { latam: "vengo a pie", tip: "ven-go：venir 的“我”形也是 go 家族" },
      { latam: "quiero comer", tip: "quie-ro：e 变成 ie，ie 连成一拍" },
      { latam: "mañana puedo", tip: "pue-do：o 变成 ue，ue 读得像“喂”" },
      { latam: "estoy en el segundo piso", es: "estoy en la segunda planta", tip: "es-toy：重音在 toy" }
    ]
  }
});

// ---------- Día 16 午饭聊天：疑问语调和否定 ----------
window.ENE_SPEAK.push({
  day: 16, week: 3, title: "午饭聊天",
  cando: "能用语调分清问句和陈述句，并用否定句回答",
  candoItems: ["用升调问是不是", "用降调回答", "用 No, no … 否定"],
  canSay: { latam: "No, no tengo carro. Vengo en metro.", es: "No, no tengo coche. Vengo en metro.", zh: "不，我没有车，我坐地铁来。" },
  warm: {
    q: "听一句，选出中文意思（复习 Día 15）",
    say: { latam: "Vivo cerca de la oficina. Vengo a pie." },
    opts: ["我住在公司附近，走路来。", "我在公司工作，坐车来。", "我住得很远，坐地铁来。", "我今天不来公司。"], answer: 0
  },
  dialog: [
    { who: "同事", latam: "¿Hablas inglés?", zh: "你会说英语吗？" },
    { who: "你", latam: "Sí, hablo inglés. Pero no hablo bien español.", zh: "会，我会说英语。但是我西班牙语说得不好。" },
    { who: "同事", latam: "¡Hablas muy bien! ¿Tienes carro?", es: "¡Hablas muy bien! ¿Tienes coche?", zh: "你说得很好！你有车吗？" },
    { who: "你", latam: "No, no tengo carro. Vengo en metro.", es: "No, no tengo coche. Vengo en metro.", zh: "不，我没有车。我坐地铁来。" },
    { who: "同事", latam: "¿No sabes manejar?", es: "¿No sabes conducir?", zh: "你不会开车吗？" },
    { who: "你", latam: "No, no sé manejar.", es: "No, no sé conducir.", zh: "对，我不会开车。" },
    { who: "同事", latam: "¿Eres de China?", zh: "你是中国人吗？" },
    { who: "你", latam: "Sí, soy de China. ¿Y tú? ¿Eres de aquí?", zh: "是的，我是中国人。你呢？你是这里人吗？" },
    { who: "同事", latam: "No, no soy de aquí. Soy de Colombia.", es: "No, no soy de aquí. Soy de Valencia.", zh: "不，我不是这里人。我是哥伦比亚人。（西班牙版：瓦伦西亚人）" }
  ],
  check: { q: "“你”每天怎么来上班？", opts: ["开车", "坐地铁", "走路"], answer: 1 },
  chunks: [
    { latam: "Hablas inglés. / ¿Hablas inglés?", zh: "你会说英语。/ 你会说英语吗？",
      note: { latam: "西语问“是不是”不用换词序，也没有“吗”，全靠语调：陈述句句尾往下降，问句句尾往上扬。写的时候前面加 ¿，后面加 ?。" } },
    { latam: "No tengo carro.", es: "No tengo coche.", zh: "我没有车。",
      note: { latam: "否定很简单：把 no 放在动词前面。no hablo, no sé, no soy。车在拉美多说 carro（阿根廷等地说 auto）。", es: "西班牙说 coche。" } },
    { latam: "No, no …", zh: "不，我不……",
      note: { latam: "回答时第一个 no 是“不”，第二个 no 是否定动词：No, no soy de aquí. 两个 no 中间稍停一下。" } },
    { latam: "¿Y tú?", zh: "你呢？",
      note: { latam: "反问对方最简单的说法，句尾上扬。对长辈或客户说 ¿Y usted?" } }
  ],
  tip: { latam: "问句结尾往上扬，像中文惊讶地问“你会？”；陈述句结尾往下落。同一句 Eres de aquí，语调一变意思就变。" },
  tasks: [
    { zh: "你会说英语吗？", cue: "句尾往上扬", skill: "pron", latam: "¿Hablas inglés?" },
    { zh: "不，我没有车。", cue: "两个 no", skill: "conj", latam: "No, no tengo carro.", es: "No, no tengo coche." },
    { zh: "我不会开车。", cue: "saber 的“我”形是 sé", skill: "conj", latam: "No sé manejar.", es: "No sé conducir." },
    { zh: "我不是这里人。", cue: "no 放在动词前", skill: "conj", latam: "No soy de aquí." },
    { zh: "你是这里人吗？", cue: "和上一句词差不多，靠语调", skill: "pron", latam: "¿Eres de aquí?" }
  ],
  drill: {
    title: "升调和降调",
    items: [
      { latam: "¿Eres de aquí?", tip: "aquí 往上扬：问句" },
      { latam: "Soy de aquí.", tip: "aquí 往下落：陈述句" },
      { latam: "No, no tengo carro.", es: "No, no tengo coche.", tip: "两个 no 中间停一下，句尾往下落" },
      { latam: "¿Tienes carro?", es: "¿Tienes coche?", tip: { latam: "ca-rro：rr 要多弹几下，句尾上扬", es: "co-che：句尾上扬" } }
    ]
  }
});

// ---------- Día 17 聊日程：频率副词 ----------
window.ENE_SPEAK.push({
  day: 17, week: 3, title: "聊日程",
  cando: "能说清自己多久做一次某件事",
  candoItems: ["用 siempre / a veces / nunca 说频率", "说一周几次", "说每周几做什么"],
  canSay: { latam: "Voy al gimnasio dos veces por semana.", zh: "我一周去两次健身房。" },
  warm: {
    q: "听一句，选出中文意思（复习 Día 16）",
    say: { latam: "No, no tengo carro.", es: "No, no tengo coche." },
    opts: ["不，我没有车。", "是的，我有车。", "我不会开车。", "我的车不在这儿。"], answer: 0
  },
  dialog: [
    { who: "朋友", latam: "¿A qué hora empiezas a trabajar?", zh: "你几点开始上班？" },
    { who: "你", latam: "Normalmente empiezo a las nueve.", zh: "我通常九点开始。" },
    { who: "朋友", latam: "¿Y vas al gimnasio?", zh: "那你去健身房吗？" },
    { who: "你", latam: "Sí, voy dos veces por semana. Los martes y los jueves.", zh: "去，一周两次。每周二和周四。" },
    { who: "朋友", latam: "¡Qué bien! Yo nunca voy. Siempre estoy cansado.", zh: "真好！我从来不去。我总是很累。" },
    { who: "你", latam: "¿Y qué haces los fines de semana?", zh: "那你周末做什么？" },
    { who: "朋友", latam: "A veces juego fútbol. Casi nunca salgo de noche.", es: "A veces juego al fútbol. Casi nunca salgo de noche.", zh: "有时候踢足球。我几乎从不晚上出去。" },
    { who: "你", latam: "Yo siempre limpio la casa los sábados.", zh: "我每个星期六都打扫房子。" }
  ],
  check: { q: "朋友多久去一次健身房？", opts: ["从来不去", "一周两次", "每天都去", "只有周末去"], answer: 0 },
  chunks: [
    { latam: "siempre / normalmente / a veces / casi nunca / nunca", zh: "总是 / 通常 / 有时候 / 几乎从不 / 从不",
      note: { latam: "一般放在动词前面：Siempre limpio… nunca 放在动词前就不用再加 no：Nunca salgo. 放在后面要加 no：No salgo nunca。" } },
    { latam: "dos veces por semana / todos los días", zh: "一周两次 / 每天",
      note: { latam: "una vez（一次）、dos veces（两次）。por semana 每周，al mes 每月。" } },
    { latam: "los lunes / el lunes", zh: "每个星期一 / 这个星期一",
      note: { latam: "带 los 是“每周的这天”：los sábados = 每个星期六；带 el 是某一个具体的日子：el sábado = 这个星期六。" } },
    { latam: "empiezo / juego / salgo", zh: "我开始 / 我玩 / 我出去",
      note: { latam: "empezar 的 e 变 ie：empiezo, empiezas；jugar 的 u 变 ue：juego, juegas；salir 的“我”形也是 go 家族：salgo。", es: "西班牙说 jugar al fútbol，要加 al。" } }
  ],
  tip: { latam: "veces 里的 c 读 s（seseo），ve-ses；empiezo 的 z 也读 s。", es: "veces 里的 c 读 θ：舌尖放在上下齿之间，ve-θes；empiezo 的 z 也读 θ。" },
  tasks: [
    { zh: "我通常九点开始上班。", cue: "empezar 的“我”形，e 变 ie", skill: "conj", latam: "Normalmente empiezo a las nueve." },
    { zh: "我一周去两次健身房。", cue: "ir 的“我”形 + 次数", skill: "phrase", latam: "Voy al gimnasio dos veces por semana." },
    { zh: "我几乎从不晚上出去。", cue: "salir 的“我”形是 go 家族", skill: "conj", latam: "Casi nunca salgo de noche." },
    { zh: "我每个星期六都打扫房子。", cue: "每周的这天用 los", skill: "phrase", latam: "Siempre limpio la casa los sábados." },
    { zh: "有时候我踢足球。", cue: "jugar 的“我”形，u 变 ue", skill: "conj", latam: "A veces juego fútbol.", es: "A veces juego al fútbol." }
  ],
  drill: {
    title: "日程里的变位和 c / z",
    items: [
      { latam: "empiezo a las nueve", tip: { latam: "em-pie-so：z 读 s", es: "em-pie-θo：z 读 θ" } },
      { latam: "juego fútbol", es: "juego al fútbol", tip: "jue-go：j 从喉咙送气，ue 像“喂”" },
      { latam: "casi nunca salgo", tip: "sal-go：不是 salo，g 要读出来" },
      { latam: "dos veces por semana", tip: { latam: "ve-ses", es: "ve-θes" } }
    ]
  }
});

// ---------- Día 18 聊爱好和吃的：me gusta / me gustan ----------
window.ENE_SPEAK.push({
  day: 18, week: 3, title: "聊爱好和吃的",
  cando: "能分清“喜欢一样东西”和“喜欢几样东西”的说法，说出喜欢和不喜欢",
  candoItems: ["单数和动词用 me gusta", "复数用 me gustan", "用 a mí también / tampoco 接话"],
  canSay: { latam: "Me gusta caminar y me gustan las comedias.", zh: "我喜欢散步，也喜欢喜剧片。" },
  warm: {
    q: "听一句，选出中文意思（复习 Día 17）",
    say: { latam: "Voy al gimnasio dos veces por semana." },
    opts: ["我一周去两次健身房。", "我每天去健身房。", "我从来不去健身房。", "我两点去健身房。"], answer: 0
  },
  dialog: [
    { who: "朋友", latam: "¿Te gusta la comida mexicana?", zh: "你喜欢墨西哥菜吗？" },
    { who: "你", latam: "Sí, me gusta mucho. Me gustan los tacos.", zh: "喜欢，很喜欢。我喜欢塔可饼。" },
    { who: "朋友", latam: "¿Y te gusta el picante?", zh: "那你喜欢辣吗？" },
    { who: "你", latam: "Un poco. No me gusta la comida muy picante.", zh: "一点点。我不喜欢太辣的菜。" },
    { who: "朋友", latam: "A mí me encanta. ¿Qué te gusta hacer los fines de semana?", zh: "我超爱吃辣。你周末喜欢做什么？" },
    { who: "你", latam: "Me gusta caminar y ver películas.", zh: "我喜欢散步和看电影。" },
    { who: "朋友", latam: "¡A mí también! ¿Te gustan las películas de acción?", zh: "我也是！你喜欢动作片吗？" },
    { who: "你", latam: "No, no me gustan mucho. Me gustan las comedias.", zh: "不，不太喜欢。我喜欢喜剧片。" },
    { who: "朋友", latam: "A mí tampoco me gustan.", zh: "我也不喜欢（动作片）。" }
  ],
  check: { q: "“你”喜欢动作片吗？", opts: ["很喜欢", "不太喜欢", "没说"], answer: 1 },
  chunks: [
    { latam: "me gusta / me gustan", zh: "我喜欢（单数 / 复数）",
      note: { latam: "西语的意思其实是“……让我喜欢”，所以动词跟着后面的东西变：单数名词或动词原形用 gusta（me gusta el café, me gusta caminar），复数名词用 gustan（me gustan los tacos）。最常见的错是说 yo gusto，千万别这么说。" } },
    { latam: "¿Te gusta …? / ¿Te gustan …?", zh: "你喜欢……吗？",
      note: { latam: "问朋友用 te，问长辈或客户用 le：¿Le gusta el café? 否定把 no 放在最前面：No me gusta。" } },
    { latam: "A mí también. / A mí tampoco.", zh: "我也（喜欢）。/ 我也不（喜欢）。",
      note: { latam: "对方说喜欢，你也喜欢：A mí también；对方说不喜欢，你也不喜欢：A mí tampoco。别在否定后面说 también。" } },
    { latam: "me encanta / me encantan", zh: "我超爱……",
      note: { latam: "比 me gusta mucho 更强，用法完全一样：单数 encanta，复数 encantan。" } }
  ],
  tip: { latam: "gustan 结尾的 n 要读清楚。少了 n，听的人就以为你说的是单数 gusta。" },
  tasks: [
    { zh: "我很喜欢墨西哥菜。", cue: "菜是单数", skill: "conj", latam: "Me gusta mucho la comida mexicana." },
    { zh: "我喜欢喜剧片。", cue: "喜剧片是复数", skill: "conj", latam: "Me gustan las comedias." },
    { zh: "我不喜欢太辣的菜。", cue: "no 放在最前面", skill: "conj", latam: "No me gusta la comida muy picante." },
    { zh: "我喜欢散步和看电影。", cue: "后面是动词原形，用单数", skill: "conj", latam: "Me gusta caminar y ver películas." },
    { zh: "我也不喜欢。", cue: "否定的“我也”", skill: "phrase", latam: "A mí tampoco." }
  ],
  drill: {
    title: "gusta 还是 gustan",
    items: [
      { latam: "me gusta el picante", tip: "单数：gusta" },
      { latam: "me gustan los tacos", tip: "复数：gustan，结尾 n 读清楚" },
      { latam: "no me gustan mucho", tip: "no 在最前面，不在 me 后面" },
      { latam: "me gusta caminar", tip: "后面是动词原形：用单数 gusta" },
      { latam: "a mí tampoco", tip: "mí 有重音符号，意思是“我”" }
    ]
  }
});

// ---------- Día 19 手机卡和网络 ----------
window.ENE_SPEAK.push({
  day: 19, week: 3, title: "办手机卡",
  cando: "能在手机店办一张卡并问清怎么充值",
  candoItems: ["说要买电话卡", "选预付费还是套餐", "问怎么充值"],
  canSay: { latam: "Quiero comprar un chip para mi celular.", es: "Quiero comprar una tarjeta SIM para mi móvil.", zh: "我想给我的手机买张电话卡。" },
  warm: {
    q: "听一句，选出中文意思（复习 Día 18）",
    say: { latam: "No me gusta la comida muy picante." },
    opts: ["我不喜欢太辣的菜。", "我很喜欢辣的菜。", "这个菜不辣。", "我不喜欢这家店。"], answer: 0
  },
  dialog: [
    { who: "店员", latam: "Buenas tardes. ¿En qué le puedo ayudar?", es: "Buenas tardes. ¿En qué te puedo ayudar?", zh: "下午好，有什么可以帮您？" },
    { who: "顾客", latam: "Quiero comprar un chip para mi celular.", es: "Quiero comprar una tarjeta SIM para mi móvil.", zh: "我想给我的手机买张电话卡。" },
    { who: "店员", latam: "Claro. ¿Quiere prepago o quiere contratar un plan?", es: "Claro. ¿Quieres prepago o quieres contratar una tarifa?", zh: "好的。您要预付费，还是签一个套餐？" },
    { who: "顾客", latam: "Prepago, por favor. ¿Cuántos gigas tiene?", zh: "预付费，谢谢。有多少流量？" },
    { who: "店员", latam: "Diez gigas por mes. Necesito su pasaporte.", es: "Diez gigas al mes. Necesito tu pasaporte.", zh: "每个月十个G。我需要您的护照。" },
    { who: "顾客", latam: "Aquí tiene. ¿Cómo recargo el saldo?", es: "Aquí tienes. ¿Cómo recargo el saldo?", zh: "给您。话费怎么充值？" },
    { who: "店员", latam: "Puede recargar aquí o en la aplicación.", es: "Puedes recargar aquí o en la aplicación.", zh: "可以在这儿充，也可以在App上充。" },
    { who: "顾客", latam: "Perfecto. ¿Me ayuda a activarlo?", es: "Perfecto. ¿Me ayudas a activarlo?", zh: "好的。您能帮我激活吗？" },
    { who: "店员", latam: "Sí, un momento… Ya está. ¡Ya tiene internet!", es: "Sí, un momento… Ya está. ¡Ya tienes internet!", zh: "可以，稍等……好了，您已经可以上网了！" }
  ],
  check: { q: "顾客最后选了什么？", opts: ["预付费", "签套餐", "什么都没买"], answer: 0 },
  chunks: [
    { latam: "Quiero comprar un chip para mi celular.", es: "Quiero comprar una tarjeta SIM para mi móvil.", zh: "我想给我的手机买张电话卡。",
      note: { latam: "手机在拉美叫 celular，电话卡在墨西哥等地常说 chip（也说 tarjeta SIM）。", es: "西班牙手机叫 móvil，电话卡说 tarjeta SIM。西班牙店员常对顾客用 tú（te / tienes），很正常。" } },
    { latam: "¿Prepago o contratar un plan?", es: "¿Prepago o contratar una tarifa?", zh: "预付费还是签套餐？",
      note: { latam: "contratar = 签约、开通（套餐、网络、服务都用它）：Quiero contratar internet。", es: "西班牙“套餐”多说 tarifa。" } },
    { latam: "¿Cómo recargo el saldo?", zh: "话费怎么充值？",
      note: { latam: "recargar（充值）是规则 -ar 动词，“我”形 recargo。saldo = 余额、话费。" } },
    { latam: "¿Me ayuda a …?", es: "¿Me ayudas a …?", zh: "您能帮我……吗？",
      note: { latam: "ayudar a + 动词原形。对店员用 usted：ayuda。", es: "对“你”说：ayudas。" } }
  ],
  tip: { latam: "gigas 里 gi 的 g 读喉音，像 j，听起来是“hi-gas”；但 ga 的 g 是普通的 g。" },
  tasks: [
    { zh: "我想给我的手机买张电话卡。", cue: "用今天第 1 个语块", skill: "phrase",
      latam: "Quiero comprar un chip para mi celular.", es: "Quiero comprar una tarjeta SIM para mi móvil." },
    { zh: "预付费，谢谢。", cue: "两三个词就行", skill: "phrase", latam: "Prepago, por favor." },
    { zh: "我想签一个套餐。", cue: "签约用 contratar", skill: "conj", latam: "Quiero contratar un plan.", es: "Quiero contratar una tarifa." },
    { zh: "话费怎么充值？", cue: "recargar 的“我”形", skill: "conj", latam: "¿Cómo recargo el saldo?" },
    { zh: "您能帮我激活吗？", cue: "ayudar a + 原形", skill: "phrase", latam: "¿Me ayuda a activarlo?", es: "¿Me ayudas a activarlo?" }
  ],
  drill: {
    title: "手机店里的 r 和 g",
    items: [
      { latam: "recargo", tip: "re-car-go：开头的 r 要多弹几下（大舌音）" },
      { latam: "contratar", tip: "con-tra-tar：tr 连在一起，r 只弹一下" },
      { latam: "gigas", tip: "gi 读喉音像 hi，ga 读普通 g" },
      { latam: "celular", es: "móvil", tip: { latam: "ce 读 se（seseo）：se-lu-lar", es: "mó-vil：重音在 mó" } }
    ]
  }
});

// ---------- Día 20 变位限时训练 ----------
window.ENE_SPEAK.push({
  day: 20, week: 3, title: "变位快问快答",
  cando: "能在三秒内用正确的变位回答日常问题",
  candoItems: ["“我”形脱口而出", "听到“你”形马上换成“我”形", "说出“我们”形"],
  canSay: { latam: "Quiero ir, pero no puedo el viernes.", zh: "我想去，但是周五不行。" },
  warm: {
    q: "听一句，选出中文意思（复习 Día 19）",
    say: { latam: "¿Cómo recargo el saldo?" },
    opts: ["话费怎么充值？", "余额还有多少？", "怎么激活手机？", "套餐多少钱？"], answer: 0
  },
  dialog: [
    { who: "同事", latam: "Rápido: ¿dónde trabajas y dónde vives?", zh: "快问快答：你在哪工作，住哪儿？" },
    { who: "你", latam: "Trabajo en una empresa china y vivo en el centro.", zh: "我在一家中国公司工作，住在市中心。" },
    { who: "同事", latam: "¿Cómo vienes a la oficina?", zh: "你怎么来公司？" },
    { who: "你", latam: "Vengo en metro. Salgo de casa a las ocho.", zh: "坐地铁来。我八点出门。" },
    { who: "同事", latam: "¿Y qué haces después del trabajo?", zh: "那你下班后做什么？" },
    { who: "你", latam: "Hago ejercicio o leo un libro.", zh: "做运动或者看书。" },
    { who: "同事", latam: "¿Quieres venir al cine con nosotros el viernes?", zh: "周五你想和我们去看电影吗？" },
    { who: "你", latam: "Quiero ir, pero no puedo el viernes. ¿Podemos ir el sábado?", zh: "我想去，但是周五不行。我们能周六去吗？" },
    { who: "同事", latam: "Claro. Vamos el sábado.", zh: "当然。我们周六去。" }
  ],
  check: { q: "他们最后定在哪天去看电影？", opts: ["星期五", "星期六", "星期天"], answer: 1 },
  chunks: [
    { latam: "trabajo / vivo / leo", zh: "“我”形：-o 结尾",
      note: { latam: "听到对方问 ¿trabajas?（你），马上回 trabajo（我）：-as / -es 换成 -o。vives → vivo，lees → leo。" } },
    { latam: "hago / salgo / vengo / tengo", zh: "go 家族",
      note: { latam: "这几个动词的“我”形多一个 g：hacer → hago，salir → salgo，venir → vengo，tener → tengo。但“你”形没有 g：haces, sales, vienes, tienes。" } },
    { latam: "podemos / vamos / vivimos", zh: "“我们”形",
      note: { latam: "-ar → -amos，-er → -emos，-ir → -imos。不规则动词的“我们”形通常是规则的：poder → podemos（不变 ue），ir → vamos。", es: "西班牙“你们”形：podéis, vais, vivís。" } }
  ],
  tip: { latam: "trabajo 的重音在 ba：tra-BA-jo。如果读成 tra-ba-JÓ，就变成“他做过”了。" },
  tasks: [
    { zh: "我在一家中国公司工作。", cue: "-ar 动词“我”形", skill: "conj", latam: "Trabajo en una empresa china." },
    { zh: "我住在市中心。", cue: "-ir 动词“我”形", skill: "conj", latam: "Vivo en el centro." },
    { zh: "你住在哪儿？", cue: "-ir 动词“你”形", skill: "conj", latam: "¿Dónde vives?" },
    { zh: "我坐地铁来。", cue: "venir：go 家族", skill: "conj", latam: "Vengo en metro." },
    { zh: "我八点出门。", cue: "salir：go 家族", skill: "conj", latam: "Salgo de casa a las ocho." },
    { zh: "我做运动。", cue: "hacer：go 家族", skill: "conj", latam: "Hago ejercicio." },
    { zh: "我看一本书。", cue: "-er 动词“我”形", skill: "conj", latam: "Leo un libro." },
    { zh: "我想去，但是我不能。", cue: "querer 和 poder 的“我”形", skill: "conj", latam: "Quiero ir, pero no puedo." },
    { zh: "我们能周六去吗？", cue: "poder 的“我们”形不变 ue", skill: "conj", latam: "¿Podemos ir el sábado?" },
    { zh: "我们周六去。", cue: "ir 的“我们”形", skill: "conj", latam: "Vamos el sábado." }
  ],
  drill: {
    title: "go 家族和“我们”形",
    items: [
      { latam: "hago ejercicio", tip: "a-go：h 不发音，g 要读出来" },
      { latam: "salgo de casa", tip: "sal-go：l 和 g 都要清楚" },
      { latam: "vengo en metro", tip: "ven-go 连读 ven-goen-me-tro" },
      { latam: "¿podemos ir?", tip: "po-de-mos：没有 ue" },
      { latam: "¿dónde vives?", tip: "vi-ves：两个 v 都读 b，结尾 s 别丢" }
    ]
  }
});

// ---------- Día 21 第 3 周复盘：三分钟自述 ----------
window.ENE_SPEAK.push({
  day: 21, week: 3, title: "复盘：我的日常",
  cando: "能连续说一段话介绍自己的工作、日程和喜好",
  candoItems: ["说自己从哪来、住哪", "说工作和通勤", "说频率和喜好", "用 y / pero 把句子连起来"],
  canSay: { latam: "Normalmente vengo en metro y a veces voy al gimnasio.", zh: "我通常坐地铁来，有时候去健身房。" },
  warm: {
    q: "听一句，他几点出门？（复习 Día 20）",
    say: { latam: "Salgo de casa a las ocho." },
    opts: ["8:00", "7:00", "9:00", "8:30"], answer: 0
  },
  dialog: [
    { who: "小林", latam: "Hola, me llamo Lin. Soy de China, pero ahora vivo aquí.", zh: "大家好，我叫小林。我是中国人，但现在住在这里。" },
    { who: "小林", latam: "Trabajo en una empresa de comercio. Empiezo a las nueve.", zh: "我在一家贸易公司工作，九点上班。" },
    { who: "小林", latam: "Normalmente vengo en metro. No tengo carro.", es: "Normalmente vengo en metro. No tengo coche.", zh: "我通常坐地铁来。我没有车。" },
    { who: "小林", latam: "Siempre como con mis compañeros de trabajo.", zh: "我总是和同事一起吃饭。" },
    { who: "小林", latam: "Después del trabajo, a veces voy al gimnasio.", zh: "下班后，我有时候去健身房。" },
    { who: "小林", latam: "Me gusta caminar y me gustan mucho las películas.", zh: "我喜欢散步，也很喜欢电影。" },
    { who: "小林", latam: "Pero no me gusta la comida muy picante.", zh: "但是我不喜欢太辣的菜。" },
    { who: "小林", latam: "Los sábados limpio la casa y hablo con mi familia.", zh: "每个星期六我打扫房子，和家人聊天。" },
    { who: "小林", latam: "Tengo un celular nuevo. Recargo el saldo en la aplicación.", es: "Tengo un móvil nuevo. Recargo el saldo en la aplicación.", zh: "我有一部新手机，在App上充话费。" },
    { who: "小林", latam: "Mi español no es perfecto, pero quiero hablar más.", zh: "我的西班牙语还不完美，但我想多说。" }
  ],
  check: { q: "小林怎么去上班？", opts: ["开车", "坐地铁", "走路", "骑车"], answer: 1 },
  chunks: [
    { latam: "Soy de … , pero ahora vivo …", zh: "我是……人，但现在住在……",
      note: { latam: "自述的开头：ser 说来自哪里，vivir 说住在哪里。用 pero（但是）连起来，听起来就不像在背单句。" } },
    { latam: "Trabajo en … Empiezo a las …", zh: "我在……工作，……点上班",
      note: { latam: "第二部分说工作。都是“我”形：trabajo, empiezo, vengo。" } },
    { latam: "Normalmente … / A veces … / Los sábados …", zh: "通常…… / 有时候…… / 每个星期六……",
      note: { latam: "第三部分说日程。每句开头放一个频率词，自述就有了节奏。" } },
    { latam: "Me gusta … , pero no me gusta …", zh: "我喜欢……，但不喜欢……",
      note: { latam: "第四部分说喜好。记住：复数名词用 me gustan。" } }
  ],
  tip: { latam: "说长段话时把词连起来：vivo aquí 读成 vi-voa-quí，voy al 读成 vo-yal。句号处停一下换气。" },
  tasks: [
    { zh: "第 1 步：我是中国人，但现在住在这里。", cue: "ser + vivir，用 pero 连", skill: "conj", latam: "Soy de China, pero ahora vivo aquí." },
    { zh: "第 2 步：我在一家贸易公司工作。", cue: "说工作", skill: "conj", latam: "Trabajo en una empresa de comercio." },
    { zh: "第 3 步：我通常坐地铁来。", cue: "频率词 + venir 的“我”形", skill: "conj", latam: "Normalmente vengo en metro." },
    { zh: "第 4 步：下班后，我有时候去健身房。", cue: "说下班后", skill: "phrase", latam: "Después del trabajo, a veces voy al gimnasio." },
    { zh: "第 5 步：我很喜欢电影。", cue: "电影是复数", skill: "conj", latam: "Me gustan mucho las películas." },
    { zh: "第 6 步：我的西班牙语还不完美，但我想多说。", cue: "收尾", skill: "phrase", latam: "Mi español no es perfecto, pero quiero hablar más." }
  ],
  drill: {
    title: "自述里的连读",
    items: [
      { latam: "vivo aquí", tip: "vi-voa-quí：o 和 a 连在一起" },
      { latam: "voy al gimnasio", tip: "vo-yal-gim-na-sio：gi 读喉音" },
      { latam: "me gustan mucho", tip: "gustan 的 n 读清楚，再接 mucho" },
      { latam: "empiezo a las nueve", tip: { latam: "em-pie-soa-las：z 读 s，连读", es: "em-pie-θoa-las：z 读 θ，连读" } }
    ]
  }
});
