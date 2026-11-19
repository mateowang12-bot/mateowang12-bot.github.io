// data/speak4.js —— 开口 30 天 · 第 4 周「能办事」（Día 22–28）。格式见 data/SPEAK.md
window.ENE_SPEAK = window.ENE_SPEAK || [];

// ---------- Día 22 第一周工作：现在完成时 ----------
window.ENE_SPEAK.push({
  day: 22, week: 4, title: "第一周过得怎么样",
  cando: "能说出自己已经做过、还没做过和从没做过的事",
  candoItems: ["用“已经做了”说完成的事", "用“还没”回答", "用“从没……过”说经历"],
  canSay: { latam: "Ya he conocido a casi todos.", zh: "我已经认识了几乎所有人。" },
  warm: {
    q: "听一句，选出中文意思（复习 Día 21）",
    say: { latam: "Normalmente vengo en metro." },
    opts: ["我通常坐地铁来。", "我从来不坐地铁。", "我今天坐地铁来。", "我住在地铁站旁边。"], answer: 0
  },
  dialog: [
    { who: "同事", latam: "¿Qué tal tu primera semana? ¿Has conocido a todo el equipo?", zh: "第一周怎么样？整个团队你都认识了吗？" },
    { who: "你", latam: "Sí, ya he conocido a casi todos.", zh: "是的，我已经认识了几乎所有人。" },
    { who: "同事", latam: "¿Y ya has probado la comida de la cafetería?", zh: "那你尝过食堂的饭了吗？" },
    { who: "你", latam: "Todavía no. Esta semana he traído comida de casa.", zh: "还没有。这周我都是从家里带饭。" },
    { who: "同事", latam: "¿Has estado en el centro histórico?", zh: "你去过历史老城区吗？" },
    { who: "你", latam: "No, nunca he ido. ¿Es bonito?", zh: "没有，从来没去过。漂亮吗？" },
    { who: "同事", latam: "Sí, mucho. Yo he ido muchas veces. Este fin de semana podemos ir.", zh: "很漂亮。我去过很多次。这个周末我们可以去。" },
    { who: "你", latam: "¡Genial! Y hoy he terminado mi primer proyecto.", zh: "太好了！还有，我今天完成了我的第一个项目。" },
    { who: "同事", latam: "¡Felicidades!", zh: "恭喜！" }
  ],
  check: { q: "“你”去过历史老城区吗？", opts: ["去过很多次", "去过一次", "从来没去过"], answer: 2 },
  chunks: [
    { latam: "he / has / ha + -ado / -ido", zh: "已经做了……（现在完成时）",
      note: { latam: "haber 的变位 + 过去分词。haber：he, has, ha, hemos, han。过去分词：-ar → -ado（terminado, probado），-er / -ir → -ido（conocido, traído）。常见不规则：hacer → hecho，ver → visto，abrir → abierto。",
              es: "西班牙“你们”形：habéis（habéis terminado）。" } },
    { latam: "Ya … / Todavía no.", zh: "已经…… / 还没有。",
      note: { latam: "ya 放在 he 前面：Ya he comido. 只回答“还没有”就说 Todavía no。" } },
    { latam: "¿Has estado en …? — Nunca he ido.", zh: "你去过……吗？——我从没去过。",
      note: { latam: "问经历用 ¿Has estado en …? 或 ¿Alguna vez has …?。nunca 放在 he 前面，不用再加 no。" } },
    { latam: "Hoy he terminado … / Esta semana he …", zh: "我今天完成了…… / 这周我……",
      note: { latam: "注意：很多拉美地区说“今天、刚刚”发生的事，更常用简单过去时，比如 Hoy terminé el proyecto。听到这种说法别慌，意思一样。这一课先学 he + 过去分词，拉美和西班牙都听得懂，说“经历”（nunca he ido）时拉美也常用。",
              es: "在西班牙，“今天、这周、今年”里发生的事几乎都用 he hecho 这种说法：Hoy he terminado el proyecto。很自然。" } }
  ],
  tip: { latam: "he 和 has 的 h 不发音：he 读“诶”，has 读“阿斯”。he ido 连起来读成 e-i-do。" },
  tasks: [
    { zh: "我已经认识了几乎所有人。", cue: "ya + he + 过去分词", skill: "conj", latam: "Ya he conocido a casi todos." },
    { zh: "还没有。", cue: "两个词", skill: "phrase", latam: "Todavía no." },
    { zh: "我从来没去过。", cue: "nunca 放在 he 前面", skill: "conj", latam: "Nunca he ido." },
    { zh: "我今天完成了我的第一个项目。", cue: "terminar 的过去分词", skill: "conj", latam: "Hoy he terminado mi primer proyecto." },
    { zh: "你去过历史老城区吗？", cue: "问经历用 estar 的过去分词", skill: "conj", latam: "¿Has estado en el centro histórico?" }
  ],
  drill: {
    title: "he + 过去分词",
    items: [
      { latam: "he conocido", tip: "e-co-no-ci-do：h 不发音，c 在 i 前读 s（西班牙读 θ）" },
      { latam: "nunca he ido", tip: "nun-ca-e-i-do：连成一串" },
      { latam: "¿has probado?", tip: "as-pro-ba-do：has 的 h 不发音，句尾上扬" },
      { latam: "he terminado", tip: "-ado 结尾，重音在 na" },
      { latam: "todavía no", tip: "to-da-ví-a：重音在 ví，í 和 a 分开读" }
    ]
  }
});

// ---------- Día 23 约周末：ir a + 动词原形 ----------
window.ENE_SPEAK.push({
  day: 23, week: 4, title: "约周末",
  cando: "能说出自己的计划并和朋友约好时间地点",
  candoItems: ["用“打算做……”说计划", "问对方打算做什么", "约时间和地点"],
  canSay: { latam: "¿Qué vas a hacer este sábado?", zh: "这个星期六你打算做什么？" },
  warm: {
    q: "听一句，选出中文意思（复习 Día 22）",
    say: { latam: "No, nunca he ido." },
    opts: ["没有，我从来没去过。", "不，我今天不去。", "我去过很多次。", "我还没到。"], answer: 0
  },
  dialog: [
    { who: "同事", latam: "¿Qué vas a hacer este sábado?", zh: "这个星期六你打算做什么？" },
    { who: "你", latam: "Todavía no sé. ¿Tú vas a ir al centro histórico?", zh: "还不知道。你要去历史老城区吗？" },
    { who: "同事", latam: "Sí, voy a ir con unos amigos. ¿Quieres venir?", zh: "是的，我要和几个朋友去。你想来吗？" },
    { who: "你", latam: "¡Claro! ¿A qué hora nos vemos?", es: "¡Claro! ¿A qué hora quedamos?", zh: "当然！我们几点见？" },
    { who: "同事", latam: "A las diez. Vamos a desayunar primero.", zh: "十点。我们先去吃早饭。" },
    { who: "你", latam: "Perfecto. ¿Dónde nos vemos?", es: "Perfecto. ¿Dónde quedamos?", zh: "好的。我们在哪儿见？" },
    { who: "同事", latam: "En la estación de metro. Te voy a mandar la ubicación.", zh: "在地铁站。我会把位置发给你。" },
    { who: "你", latam: "Muy bien. Voy a llevar mi cámara.", zh: "好的。我会带上我的相机。" },
    { who: "同事", latam: "¡Va a ser un día genial!", zh: "一定会是很棒的一天！" }
  ],
  check: { q: "他们在哪儿见面？", opts: ["地铁站", "咖啡店", "公司门口"], answer: 0 },
  chunks: [
    { latam: "voy / vas / va / vamos / van + a + 原形", zh: "我 / 你 / 他 / 我们 / 他们打算……",
      note: { latam: "ir 的现在时 + a + 动词原形 = 将要、打算。Voy a ir. Vamos a desayunar. 拉美“你们”用 ustedes van a …。", es: "西班牙“你们”说 vosotros vais a …。" } },
    { latam: "¿Qué vas a hacer …?", zh: "你打算做什么？",
      note: { latam: "后面加时间：este sábado（这个星期六）、mañana（明天）、la próxima semana（下周）。" } },
    { latam: "¿A qué hora nos vemos? / ¿Dónde nos vemos?", es: "¿A qué hora quedamos? / ¿Dónde quedamos?", zh: "我们几点见？/ 在哪儿见？",
      note: { latam: "nos vemos = 我们见面。拉美约人最常这样说。", es: "西班牙约人最常用 quedar：¿Quedamos a las diez?" } },
    { latam: "Te voy a mandar la ubicación.", zh: "我会把位置发给你。",
      note: { latam: "te 放在 voy 前面。mandar = 发送，也可以说 enviar。" } }
  ],
  tip: { latam: "voy a 连读成 vo-ya，vamos a 连读成 va-mo-sa，中间不要停。" },
  tasks: [
    { zh: "这个星期六你打算做什么？", cue: "ir 对“你”+ a + hacer", skill: "conj", latam: "¿Qué vas a hacer este sábado?" },
    { zh: "我要和几个朋友去。", cue: "ir 的“我”形 + a + ir", skill: "conj", latam: "Voy a ir con unos amigos." },
    { zh: "我们几点见？", cue: "约时间", skill: "phrase", latam: "¿A qué hora nos vemos?", es: "¿A qué hora quedamos?" },
    { zh: "我们先去吃早饭。", cue: "ir 的“我们”形", skill: "conj", latam: "Vamos a desayunar primero." },
    { zh: "我会带上我的相机。", cue: "带东西用 llevar", skill: "conj", latam: "Voy a llevar mi cámara." }
  ],
  drill: {
    title: "voy a 的连读",
    items: [
      { latam: "voy a ir", tip: "vo-ya-ir：三个词连成一口气" },
      { latam: "vamos a desayunar", tip: "va-mo-sa-de-sa-yu-nar：y 读得像“耶”" },
      { latam: "¿qué vas a hacer?", tip: "va-sa-a-cer：h 不发音" },
      { latam: "¿dónde nos vemos?", es: "¿dónde quedamos?", tip: { latam: "句尾上扬，vemos 的 v 读 b", es: "que-da-mos：句尾上扬" } }
    ]
  }
});

// ---------- Día 24 下班前的嘱咐和祝福：虚拟式初见 ----------
window.ENE_SPEAK.push({
  day: 24, week: 4, title: "嘱咐和祝福",
  cando: "能用“我希望、我需要、但愿”等说法提要求和送祝福",
  candoItems: ["请别人做事", "表达希望", "说祝福语"],
  canSay: { latam: "Espero que tenga un buen fin de semana.", es: "Espero que tengas un buen fin de semana.", zh: "祝您周末愉快。" },
  warm: {
    q: "听一句，选出中文意思（复习 Día 23）",
    say: { latam: "Vamos a desayunar primero." },
    opts: ["我们先去吃早饭。", "我们已经吃过早饭了。", "我们不吃早饭。", "早饭在第一层。"], answer: 0
  },
  dialog: [
    { who: "老板", latam: "Antes de irte: necesito que me mandes el informe hoy.", zh: "走之前：我需要你今天把报告发给我。" },
    { who: "你", latam: "Claro. ¿Prefiere que lo mande por correo?", es: "Claro. ¿Prefieres que lo mande por correo?", zh: "好的。您希望我用邮件发吗？" },
    { who: "老板", latam: "Sí, por correo. Y quiero que vengas a la reunión del lunes.", zh: "对，用邮件。还有，我想让你来参加周一的会。" },
    { who: "你", latam: "Muy bien. Espero que la reunión no sea muy larga.", zh: "好的。希望会议不要太长。" },
    { who: "老板", latam: "Ojalá. ¿Qué vas a hacer el fin de semana?", zh: "但愿吧。你周末打算做什么？" },
    { who: "你", latam: "Voy a ir al centro histórico. Ojalá haga buen tiempo.", zh: "我要去历史老城区。但愿天气好。" },
    { who: "老板", latam: "Es mejor que lleves un paraguas. Puede llover.", zh: "最好带把伞，可能会下雨。" },
    { who: "你", latam: "Gracias. Espero que tenga un buen fin de semana.", es: "Gracias. Espero que tengas un buen fin de semana.", zh: "谢谢。祝您周末愉快。" },
    { who: "老板", latam: "Igualmente. ¡Que descanses!", zh: "你也是。好好休息！" }
  ],
  check: { q: "老板要你什么时候发报告？", opts: ["今天", "周一", "周末"], answer: 0 },
  chunks: [
    { latam: "Quiero que … / Necesito que …", zh: "我想让（你）…… / 我需要（你）……",
      note: { latam: "只要前面是这 6 个开头：quiero que、necesito que、prefiero que、espero que、es mejor que、ojalá，后面的动词就要换成“虚拟式”。规则：-ar 动词的 a 换成 e（mandar → mandes），-er / -ir 动词换成 a（venir → vengas）。" } },
    { latam: "Espero que … / Ojalá …", zh: "我希望…… / 但愿……",
      note: { latam: "从“我”形变来：去掉 -o，加 -a。hago → haga，tengo → tenga，vengo → venga。ser 特殊：sea。Ojalá 后面可以直接接动词：Ojalá haga buen tiempo。" } },
    { latam: "¿Prefiere que …? / Es mejor que …", es: "¿Prefieres que …? / Es mejor que …", zh: "您希望我……吗？/ 最好……",
      note: { latam: "这里对老板用 usted（prefiere），老板对你用 tú（vengas, lleves），拉美办公室常这样。", es: "西班牙办公室里员工和老板一般互相用 tú，所以说 prefieres、tengas。" } },
    { latam: "¡Que descanses! / ¡Que te vaya bien!", zh: "好好休息！/ 一切顺利！",
      note: { latam: "que + 虚拟式也能单独当祝福语用。对“您”说：¡Que descanse! ¡Que le vaya bien!" } }
  ],
  tip: { latam: "ojalá 的重音在最后：o-ja-LÁ，j 从喉咙送气。" },
  tasks: [
    { zh: "希望会议不要太长。", cue: "espero que + ser 的虚拟式", skill: "conj", latam: "Espero que la reunión no sea muy larga." },
    { zh: "但愿天气好。", cue: "ojalá + hacer 的虚拟式", skill: "conj", latam: "Ojalá haga buen tiempo." },
    { zh: "我需要你今天把报告发给我。", cue: "necesito que + mandar 的虚拟式", skill: "conj", latam: "Necesito que me mandes el informe hoy." },
    { zh: "最好带把伞。", cue: "es mejor que + llevar 的虚拟式", skill: "conj", latam: "Es mejor que lleves un paraguas." },
    { zh: "祝您周末愉快。", cue: "espero que + tener 的虚拟式", skill: "phrase",
      latam: "Espero que tenga un buen fin de semana.", es: "Espero que tengas un buen fin de semana." }
  ],
  drill: {
    title: "虚拟式的“反元音”",
    items: [
      { latam: "que no sea muy larga", tip: "se-a：两个元音分开读，不是 si" },
      { latam: "ojalá haga buen tiempo", tip: "a-ga：h 不发音，结尾是 a" },
      { latam: "que me mandes", tip: "man-des：-ar 动词换成 e" },
      { latam: "que tenga", es: "que tengas", tip: "从 tengo 变来：ten-ga" },
      { latam: "que vengas a la reunión", tip: "从 vengo 变来：ven-gas" }
    ]
  }
});

// ---------- Día 25 药店买药：症状描述 ----------
window.ENE_SPEAK.push({
  day: 25, week: 4, title: "药店买药",
  cando: "能说清自己哪里不舒服、多久了，并买到合适的药",
  candoItems: ["说哪里疼", "说发烧、咳嗽", "说从什么时候开始", "问药怎么吃"],
  canSay: { latam: "Me duele la cabeza y tengo fiebre.", zh: "我头疼，还发烧。" },
  warm: {
    q: "听一句，选出中文意思（复习 Día 24）",
    say: { latam: "Ojalá haga buen tiempo." },
    opts: ["但愿天气好。", "今天天气很好。", "天气不太好。", "我没时间。"], answer: 0
  },
  dialog: [
    { who: "药剂师", latam: "Buenas tardes. ¿En qué le puedo ayudar?", zh: "下午好，有什么可以帮您？" },
    { who: "顾客", latam: "Me duele la cabeza y tengo fiebre.", zh: "我头疼，还发烧。" },
    { who: "药剂师", latam: "¿Desde cuándo?", zh: "从什么时候开始的？" },
    { who: "顾客", latam: "Desde hace dos días. También me duele la garganta.", zh: "两天前开始的。我嗓子也疼。" },
    { who: "药剂师", latam: "¿Tiene tos?", zh: "您咳嗽吗？" },
    { who: "顾客", latam: "Sí, un poco. ¿Tiene algo para el dolor de garganta?", zh: "有一点。您有治嗓子疼的药吗？" },
    { who: "药剂师", latam: "Tome estas pastillas cada ocho horas. Si no mejora, vaya al médico.", zh: "这种药片每八小时吃一次。如果不见好，就去看医生。" },
    { who: "顾客", latam: "¿Las tomo antes o después de comer?", zh: "饭前吃还是饭后吃？" },
    { who: "药剂师", latam: "Después de comer. ¡Que se mejore!", zh: "饭后吃。祝您早日康复！" }
  ],
  check: { q: "药应该什么时候吃？", opts: ["饭前", "饭后", "睡前"], answer: 1 },
  chunks: [
    { latam: "Me duele … / Me duelen …", zh: "我……疼",
      note: { latam: "和 me gusta 一样（Día 18）：单数用 duele（me duele la cabeza），复数用 duelen（me duelen los ojos）。身体部位前用 la / el，不用“我的”。" } },
    { latam: "Tengo fiebre / tos / gripa.", es: "Tengo fiebre / tos / gripe.", zh: "我发烧 / 咳嗽 / 感冒了。",
      note: { latam: "用 tener（有）说症状。感冒在墨西哥、哥伦比亚常说 gripa，很多其他拉美国家说 gripe。", es: "西班牙说 gripe；轻微感冒也说 Estoy resfriado / resfriada。" } },
    { latam: "Desde hace dos días.", zh: "从两天前开始。",
      note: { latam: "desde hace + 时间 = 从……之前开始（到现在还在）。desde hace una semana = 一个星期了。" } },
    { latam: "¿Tiene algo para …?", zh: "您有治……的药吗？",
      note: { latam: "para 后面接症状：para el dolor de cabeza（头疼）、para la tos（咳嗽）、para la fiebre（发烧）。" } }
  ],
  tip: { latam: "duele 里的 ue 读得像“喂”，du-e 要连成一拍：dwe-le，不要读成 du-e-le 三拍。" },
  tasks: [
    { zh: "我头疼，还发烧。", cue: "头是单数", skill: "conj", latam: "Me duele la cabeza y tengo fiebre." },
    { zh: "从两天前开始的。", cue: "desde hace + 时间", skill: "phrase", latam: "Desde hace dos días." },
    { zh: "我嗓子也疼。", cue: "también 放在最前面", skill: "conj", latam: "También me duele la garganta." },
    { zh: "您有治嗓子疼的药吗？", cue: "用今天第 4 个语块", skill: "phrase", latam: "¿Tiene algo para el dolor de garganta?" },
    { zh: "饭前吃还是饭后吃？", cue: "antes o después", skill: "phrase", latam: "¿Las tomo antes o después de comer?" }
  ],
  drill: {
    title: "药店里的 ue 和 r",
    items: [
      { latam: "me duele", tip: "dwe-le：ue 连成一拍" },
      { latam: "me duelen los ojos", tip: "复数：duelen，结尾 n 读清楚；ojos 的 j 从喉咙送气" },
      { latam: "garganta", tip: "gar-gan-ta：r 只弹一下，两个 g 都是普通 g" },
      { latam: "fiebre", tip: "fie-bre：br 连在一起，r 只弹一下" },
      { latam: "desde hace", tip: { latam: "des-dea-se：h 不发音，c 读 s", es: "des-dea-θe：h 不发音，c 读 θ" } }
    ]
  }
});

// ---------- Día 26 银行开户：填表 ----------
window.ENE_SPEAK.push({
  day: 26, week: 4, title: "银行开户填表",
  cando: "能看懂表格里常见的栏目，并在银行开一个账户",
  candoItems: ["说要开账户", "看懂姓名、地址、生日等栏目", "问这一栏填什么"],
  canSay: { latam: "Quiero abrir una cuenta.", zh: "我想开一个账户。" },
  warm: {
    q: "听一句，选出中文意思（复习 Día 25）",
    say: { latam: "Me duele la garganta." },
    opts: ["我嗓子疼。", "我头疼。", "我发烧了。", "我肚子疼。"], answer: 0
  },
  dialog: [
    { who: "职员", latam: "Buenos días. ¿En qué le puedo ayudar?", zh: "早上好，有什么可以帮您？" },
    { who: "顾客", latam: "Quiero abrir una cuenta.", zh: "我想开一个账户。" },
    { who: "职员", latam: "Muy bien. Tiene que llenar este formulario.", es: "Muy bien. Tiene que rellenar este formulario.", zh: "好的。您得填一下这张表。" },
    { who: "顾客", latam: "¿Qué pongo aquí, en domicilio?", zh: "这一栏“住址”填什么？" },
    { who: "职员", latam: "Su dirección: la calle, el número y el código postal.", zh: "您的地址：街道、门牌号和邮编。" },
    { who: "顾客", latam: "¿Y aquí pongo mi nombre o mi apellido?", zh: "这里写我的名还是姓？" },
    { who: "职员", latam: "Primero el nombre, después el apellido. Y aquí, su fecha de nacimiento.", zh: "先写名，再写姓。这里写您的出生日期。" },
    { who: "顾客", latam: "Listo. Aquí tiene mi pasaporte y el contrato de alquiler.", zh: "好了。这是我的护照和租房合同。" },
    { who: "职员", latam: "Perfecto. Su firma aquí abajo, por favor. ¡Ya está!", zh: "好的。请在下面这里签名。办好了！" }
  ],
  check: { q: "“住址”这一栏要写什么？", opts: ["街道、门牌号和邮编", "电话号码", "出生日期", "护照号"], answer: 0 },
  chunks: [
    { latam: "nombre / apellido / domicilio / fecha de nacimiento", zh: "名 / 姓 / 住址 / 出生日期",
      note: { latam: "表格常见栏目：nombre（名）、apellido 或 apellidos（姓，西语国家很多人有两个姓）、domicilio 或 dirección（住址）、código postal（邮编）、fecha de nacimiento（出生日期）、nacionalidad（国籍）、teléfono（电话）、correo electrónico（邮箱）、firma（签名）。日期一般按“日 / 月 / 年”写。" } },
    { latam: "Quiero abrir una cuenta.", zh: "我想开一个账户。",
      note: { latam: "abrir（开）。银行常用词：cuenta（账户）、tarjeta（卡）、depositar（存钱）、retirar（取钱）。", es: "西班牙“存钱”多说 ingresar，“取钱”说 sacar dinero。" } },
    { latam: "Tiene que llenar …", es: "Tiene que rellenar …", zh: "您得填……",
      note: { latam: "tener que + 动词原形 = 必须、得。填表在拉美说 llenar。", es: "西班牙填表说 rellenar。" } },
    { latam: "¿Qué pongo aquí?", zh: "这里填什么？",
      note: { latam: "pongo 是 poner（放、写上）的“我”形，又是 go 家族。拿着表格指着一栏问就行。" } }
  ],
  tip: { latam: "domicilio 里的 c 读 s（seseo）：do-mi-si-lio；apellido 的 ll 读“ye”：a-pe-yi-do。", es: "domicilio 里的 c 读 θ：do-mi-θi-lio；apellido 的 ll 读“ye”：a-pe-yi-do。" },
  tasks: [
    { zh: "我想开一个账户。", cue: "用今天第 2 个语块", skill: "phrase", latam: "Quiero abrir una cuenta." },
    { zh: "这里填什么？", cue: "poner 的“我”形", skill: "conj", latam: "¿Qué pongo aquí?" },
    { zh: "我得填这张表吗？", cue: "tener que + 原形", skill: "conj", latam: "¿Tengo que llenar este formulario?", es: "¿Tengo que rellenar este formulario?" },
    { zh: "先写名，再写姓。", cue: "primero … después …", skill: "phrase", latam: "Primero el nombre, después el apellido." },
    { zh: "这是我的护照和租房合同。", cue: "递东西时说", skill: "phrase", latam: "Aquí tiene mi pasaporte y el contrato de alquiler." }
  ],
  drill: {
    title: "表格栏目的读音",
    items: [
      { latam: "domicilio", tip: { latam: "do-mi-si-lio：重音在 si", es: "do-mi-θi-lio：重音在 θi" } },
      { latam: "apellido", tip: "a-pe-yi-do：ll 读 ye，重音在 lli" },
      { latam: "fecha de nacimiento", tip: { latam: "ch 像“吃”，ci 读 si", es: "ch 像“吃”，ci 读 θi" } },
      { latam: "llenar este formulario", es: "rellenar este formulario", tip: { latam: "ye-nar：ll 读 ye", es: "re-ye-nar：开头 r 多弹几下" } }
    ]
  }
});

// ---------- Día 27 面试：介绍自己的工作 ----------
window.ENE_SPEAK.push({
  day: 27, week: 4, title: "工作面试",
  cando: "能在面试中介绍自己的经验、职责和语言能力",
  candoItems: ["说工作年限", "说自己负责什么", "说会哪些语言", "说为什么想来"],
  canSay: { latam: "Tengo tres años de experiencia en comercio exterior.", zh: "我在外贸方面有三年经验。" },
  warm: {
    q: "听一句，选出中文意思（复习 Día 26）",
    say: { latam: "¿Qué pongo aquí?" },
    opts: ["这里填什么？", "我放在哪儿？", "这是什么？", "我能坐这儿吗？"], answer: 0
  },
  dialog: [
    { who: "面试官", latam: "Buenos días. Cuénteme un poco sobre usted.", zh: "早上好。请简单介绍一下您自己。" },
    { who: "你", latam: "Soy de China. Tengo tres años de experiencia en comercio exterior.", zh: "我是中国人。我在外贸方面有三年经验。" },
    { who: "面试官", latam: "¿Qué hace en su trabajo actual?", zh: "您现在的工作做些什么？" },
    { who: "你", latam: "Me encargo de las compras con proveedores chinos.", zh: "我负责和中国供应商的采购。" },
    { who: "面试官", latam: "¿Qué idiomas habla?", zh: "您会说哪些语言？" },
    { who: "你", latam: "Hablo chino, inglés y un poco de español. Estudio español todos los días.", zh: "我会说中文、英文和一点西班牙语。我每天都学西班牙语。" },
    { who: "面试官", latam: "¿Por qué quiere trabajar con nosotros?", zh: "您为什么想来我们公司？" },
    { who: "你", latam: "Porque quiero trabajar entre China y América Latina.", es: "Porque quiero trabajar entre China y España.", zh: "因为我想做连接中国和拉美的工作。（西班牙版：连接中国和西班牙）" },
    { who: "面试官", latam: "Muy bien. Le vamos a escribir la próxima semana.", zh: "很好。我们下周会给您写信通知。" }
  ],
  check: { q: "应聘者现在负责什么？", opts: ["采购", "财务", "翻译", "开车"], answer: 0 },
  chunks: [
    { latam: "Tengo … años de experiencia en …", zh: "我在……方面有……年经验",
      note: { latam: "用 tener（有）说经验。数字说成西语：dos años, tres años, cinco años。comercio exterior = 外贸。" } },
    { latam: "Me encargo de …", zh: "我负责……",
      note: { latam: "encargarse de（负责）。me 不能丢：Me encargo de las ventas（我负责销售）。也可以说 Soy responsable de …。" } },
    { latam: "Hablo chino, inglés y un poco de español.", zh: "我会说中文、英文和一点西班牙语。",
      note: { latam: "语言名小写：chino, inglés, español。un poco de = 一点。" } },
    { latam: "Porque quiero …", zh: "因为我想……",
      note: { latam: "回答 ¿Por qué …?（为什么）用 porque（因为）。注意：问的是分开的两个词 por qué，答的是一个词 porque。面试官对你用 usted，你也要用 usted 回答他。" } }
  ],
  tip: { latam: "experiencia：x 读 ks，ci 读 si：eks-pe-rien-sia。", es: "experiencia：x 读 ks，ci 读 θi：eks-pe-rien-θia。" },
  tasks: [
    { zh: "我在外贸方面有三年经验。", cue: "tener + 年数", skill: "phrase", latam: "Tengo tres años de experiencia en comercio exterior." },
    { zh: "我负责和中国供应商的采购。", cue: "me 不能丢", skill: "conj", latam: "Me encargo de las compras con proveedores chinos." },
    { zh: "我会说中文、英文和一点西班牙语。", cue: "hablar 的“我”形", skill: "conj", latam: "Hablo chino, inglés y un poco de español." },
    { zh: "因为我想做连接中国和拉美（或西班牙）的工作。", cue: "porque 开头", skill: "phrase",
      latam: "Porque quiero trabajar entre China y América Latina.", es: "Porque quiero trabajar entre China y España." },
    { zh: "我每天都学西班牙语。", cue: "estudiar 的“我”形 + 频率", skill: "conj", latam: "Estudio español todos los días." }
  ],
  drill: {
    title: "面试里的长单词",
    items: [
      { latam: "experiencia", tip: { latam: "eks-pe-rien-sia：重音在 rien", es: "eks-pe-rien-θia：重音在 rien" } },
      { latam: "me encargo", tip: "me-en-car-go：r 只弹一下，别丢 me" },
      { latam: "proveedores", tip: "pro-ve-e-do-res：两个 e 分开读" },
      { latam: "comercio exterior", tip: { latam: "co-mer-sio eks-te-rior", es: "co-mer-θio eks-te-rior" } }
    ]
  }
});

// ---------- Día 28 第 4 周复盘：打电话约看房 ----------
window.ENE_SPEAK.push({
  day: 28, week: 4, title: "复盘：约看房",
  cando: "能打电话完成一次约看房：说明情况、约时间、问清要带什么",
  candoItems: ["说自己看到了什么", "说接下来的计划", "改约时间", "问要准备什么"],
  canSay: { latam: "He visto un departamento en internet y quiero verlo.", es: "He visto un piso en internet y quiero verlo.", zh: "我在网上看到一套公寓，想去看看。" },
  warm: {
    q: "听一句，他有几年经验？（复习 Día 27）",
    say: { latam: "Tengo tres años de experiencia." },
    opts: ["三年", "两年", "十三年", "三个月"], answer: 0
  },
  dialog: [
    { who: "中介", latam: "Hola, buenos días. ¿En qué le puedo ayudar?", zh: "你好，早上好。有什么可以帮您？" },
    { who: "你", latam: "Hola. He visto un departamento en internet y quiero verlo.", es: "Hola. He visto un piso en internet y quiero verlo.", zh: "你好。我在网上看到一套公寓，想去看看。" },
    { who: "中介", latam: "Claro. ¿Para cuándo lo necesita?", zh: "好的。您什么时候要住？" },
    { who: "你", latam: "Voy a empezar un trabajo nuevo el mes que viene. Lo necesito pronto.", zh: "我下个月要开始一份新工作，很快就需要。" },
    { who: "中介", latam: "Muy bien. ¿Puede venir mañana a las cinco?", zh: "好的。您明天五点能来吗？" },
    { who: "你", latam: "Mañana no puedo, tengo cita con el médico. ¿El jueves?", zh: "明天我不行，我要去看医生。星期四可以吗？" },
    { who: "中介", latam: "El jueves a las cinco, perfecto. Necesito que traiga su pasaporte.", zh: "星期四五点，没问题。我需要您带上护照。" },
    { who: "你", latam: "De acuerdo. ¿Tengo que llenar algún formulario?", es: "De acuerdo. ¿Tengo que rellenar algún formulario?", zh: "好的。我需要填什么表吗？" },
    { who: "中介", latam: "Sí, con su nombre, apellido y fecha de nacimiento.", zh: "要，写上您的名、姓和出生日期。" },
    { who: "你", latam: "Perfecto. ¿El departamento tiene internet?", es: "Perfecto. ¿El piso tiene internet?", zh: "好的。公寓有网吗？" },
    { who: "中介", latam: "Sí, ya tiene wifi. Espero que le guste.", zh: "有，已经装了无线网。希望您喜欢。" },
    { who: "你", latam: "Yo también. ¡Hasta el jueves!", zh: "我也希望。星期四见！" }
  ],
  check: { q: "最后约在什么时候看房？", opts: ["明天五点", "星期四五点", "下个月"], answer: 1 },
  chunks: [
    { latam: "He visto …", zh: "我看到了……（复习 Día 22）",
      note: { latam: "ver 的过去分词不规则：visto。", es: "公寓在西班牙叫 piso。" } },
    { latam: "Voy a empezar …", zh: "我要开始……（复习 Día 23）",
      note: { latam: "el mes que viene = 下个月，也可以说 el próximo mes。" } },
    { latam: "Necesito que traiga … / Espero que le guste.", zh: "我需要您带…… / 希望您喜欢。（复习 Día 24）",
      note: { latam: "traer（带来）的“我”形是 traigo，所以虚拟式是 traiga。le guste 是 le gusta 的虚拟式。" } },
    { latam: "Tengo cita con el médico. / ¿Tengo que llenar …?", es: "Tengo cita con el médico. / ¿Tengo que rellenar …?", zh: "我约了医生。/ 我得填……吗？（复习 Día 25–26）",
      note: { latam: "tener cita = 有预约。tener que + 原形 = 必须。两个都用 tengo，意思不一样。" } }
  ],
  tip: { latam: "departamento 的重音在 men：de-par-ta-MEN-to，打电话时说慢一点。", es: "piso 的重音在 pi：PI-so，打电话时说慢一点。" },
  tasks: [
    { zh: "我在网上看到了一套公寓。", cue: "he + ver 的过去分词", skill: "conj", latam: "He visto un departamento en internet.", es: "He visto un piso en internet." },
    { zh: "我下个月要开始一份新工作。", cue: "voy a + 原形", skill: "conj", latam: "Voy a empezar un trabajo nuevo el mes que viene." },
    { zh: "明天我不行，我约了医生。", cue: "poder 和 tener 的“我”形", skill: "phrase", latam: "Mañana no puedo, tengo cita con el médico." },
    { zh: "我需要填什么表吗？", cue: "tener que + 原形", skill: "conj", latam: "¿Tengo que llenar algún formulario?", es: "¿Tengo que rellenar algún formulario?" },
    { zh: "公寓有网吗？", cue: "问房子的条件", skill: "phrase", latam: "¿El departamento tiene internet?", es: "¿El piso tiene internet?" },
    { zh: "星期四见！", cue: "hasta + 日子", skill: "phrase", latam: "¡Hasta el jueves!" }
  ],
  drill: {
    title: "电话里的关键变位",
    items: [
      { latam: "he visto", tip: "e-vis-to：h 不发音" },
      { latam: "voy a empezar", tip: { latam: "vo-ya-em-pe-sar：z 读 s", es: "vo-ya-em-pe-θar：z 读 θ" } },
      { latam: "necesito que traiga", tip: "trai-ga：ai 连成一拍" },
      { latam: "departamento", es: "piso", tip: { latam: "de-par-ta-men-to：重音在 men", es: "pi-so：重音在 pi" } }
    ]
  }
});
