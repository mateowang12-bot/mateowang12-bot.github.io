// data/speak2.js —— 开口 30 天 · 第 2 周「能生存」（Día 8–14）。格式见 data/SPEAK.md
window.ENE_SPEAK = window.ENE_SPEAK || [];

window.ENE_SPEAK.push({
  day: 8, week: 2, title: "时间与日期",
  cando: "能问时间，说出几点几分和星期几",
  candoItems: ["问现在几点", "说出几点几分", "说出星期几和日期"],
  canSay: { latam: "¿Qué hora es? — Son las tres y media.", zh: "现在几点？——三点半。" },
  warm: {
    q: "听价钱，选出你听到的数字（复习 Día 7）",
    say: { latam: "Son seis dólares con cuarenta.", es: "Son seis euros con cuarenta." },
    opts: ["6.40", "7.40", "6.14", "16.40"], answer: 0
  },
  dialog: [
    { who: "安娜", latam: "Oye, ¿qué hora es?", zh: "哎，现在几点？" },
    { who: "伟", latam: "Son las tres y media.", zh: "三点半。" },
    { who: "安娜", latam: "¿Y qué día es hoy?", zh: "今天星期几？" },
    { who: "伟", latam: "Hoy es jueves, doce de marzo.", zh: "今天星期四，三月十二号。" },
    { who: "安娜", latam: "¿A qué hora es la clase mañana?", zh: "明天的课几点？" },
    { who: "伟", latam: "A las nueve y cuarto.", zh: "九点一刻。" },
    { who: "安娜", latam: "¿Y el examen?", zh: "那考试呢？" },
    { who: "伟", latam: "El lunes a la una.", zh: "星期一一点。" },
    { who: "安娜", latam: "Perfecto. ¡Nos vemos mañana!", zh: "好。明天见！" }
  ],
  check: { q: "明天的课几点？", opts: ["9:15", "9:30", "3:30", "1:00"], answer: 0 },
  chunks: [
    { latam: "¿Qué hora es? — Es la una. / Son las …", zh: "现在几点？——一点。/ ……点。",
      note: { latam: "一点用单数：Es la una；两点以后用复数：Son las dos、Son las tres。这里的“是”还是 Día 2 的 ser（es / son）。拉美也常听到 ¿Qué horas son?，意思一样。" } },
    { latam: "y cuarto / y media / menos cuarto", zh: "一刻 / 半 / 差一刻",
      note: { latam: "las tres y diez = 3:10，las tres y cuarto = 3:15，las tres y media = 3:30，las cuatro menos cuarto = 3:45（四点差一刻）。拉美很多人也直接说 las tres cuarenta y cinco，同样对。" } },
    { latam: "¿A qué hora …? — A las …", zh: "几点……？——……点。",
      note: { latam: "问“某件事几点”要在前面加 a：¿A qué hora es la clase? — A las nueve。一点就是 a la una。" } },
    { latam: "Hoy es jueves, doce de marzo.", zh: "今天星期四，三月十二号。",
      note: { latam: "星期：lunes 一、martes 二、miércoles 三、jueves 四、viernes 五、sábado 六、domingo 日。日期 = 数字 + de + 月份，星期和月份都小写。“在星期一”说 el lunes，不加 en。" } }
  ],
  tip: { latam: "jueves 的 j 从喉咙送气，像轻一点的“h”；miércoles 的重音在 ér。" },
  tasks: [
    { zh: "现在几点？", cue: "问时间", skill: "phrase",
      latam: "¿Qué hora es?" },
    { zh: "三点半。", cue: "两点以后用 son las", skill: "conj",
      latam: "Son las tres y media." },
    { zh: "一点。", cue: "一点用单数", skill: "conj",
      latam: "Es la una." },
    { zh: "课几点？", cue: "¿A qué hora …?", skill: "phrase",
      latam: "¿A qué hora es la clase?" },
    { zh: "今天星期四。", cue: "jueves 的 j 送气", skill: "pron",
      latam: "Hoy es jueves." }
  ],
  drill: {
    title: "说时间最容易错的地方",
    items: [
      { latam: "es la una", tip: "一点：单数 es la" },
      { latam: "son las dos", tip: "两点以后：复数 son las" },
      { latam: "y media", tip: "y ME-dia：重音在 me" },
      { latam: "menos cuarto", tip: "CUAR-to：r 弹一下；四点差一刻 = 3:45" },
      { latam: "jueves / miércoles", tip: "JUE-ves：j 送气；MIÉR-co-les：重音在 ér" }
    ]
  }
});

window.ENE_SPEAK.push({
  day: 9, week: 2, title: "问路与交通",
  cando: "能问路，听懂直走、左转、右转",
  candoItems: ["问某个地方在哪儿", "听懂左右和直走", "问远不远、坐哪路车"],
  canSay: { latam: "Perdone, ¿dónde queda la estación de metro?", es: "Perdone, ¿dónde está la estación de metro?", zh: "打扰一下，地铁站在哪儿？" },
  warm: {
    q: "听时间，选出你听到的（复习 Día 8）",
    say: { latam: "Son las nueve y cuarto." },
    opts: ["9:15", "9:45", "9:30", "4:15"], answer: 0
  },
  dialog: [
    { who: "游客", latam: "Perdone, ¿dónde queda la estación de metro?", es: "Perdone, ¿dónde está la estación de metro?", zh: "打扰一下，地铁站在哪儿？" },
    { who: "路人", latam: "Siga derecho dos cuadras y gire a la izquierda.", es: "Siga recto dos calles y gire a la izquierda.", zh: "直走两个路口，然后左转。" },
    { who: "游客", latam: "¿Está lejos?", zh: "远吗？" },
    { who: "路人", latam: "No, está cerca. A cinco minutos a pie.", zh: "不远，很近。走路五分钟。" },
    { who: "游客", latam: "¿Y qué autobús va al centro?", zh: "那去市中心坐哪路公交车？" },
    { who: "路人", latam: "El diez. La parada está a la derecha.", zh: "十路。车站在右边。" },
    { who: "游客", latam: "¿A la derecha o a la izquierda?", zh: "右边还是左边？" },
    { who: "路人", latam: "A la derecha, enfrente del banco.", zh: "右边，银行对面。" },
    { who: "游客", latam: "Muchas gracias, muy amable.", zh: "非常感谢，您真好。" }
  ],
  check: { q: "地铁站远吗？", opts: ["很近，走路五分钟", "很远，要坐车", "走路十五分钟"], answer: 0 },
  chunks: [
    { latam: "¿Dónde queda …? / ¿Dónde está …?", zh: "……在哪儿？",
      note: { latam: "queda 是 quedar（位于）的形式，拉美问地点很常用；¿Dónde está …? 意思一样，到处都能用。说位置用 estar（está），不用 ser。", es: "西班牙更常说 ¿Dónde está …?，queda 也听得懂。" } },
    { latam: "Siga derecho / a la derecha / a la izquierda", es: "Siga recto / a la derecha / a la izquierda", zh: "直走 / 在右边 / 在左边",
      note: { latam: "derecho（直走）和 derecha（右边）只差最后一个字母，千万别弄混！siga（请继续走）、gire（请转弯）是对“您”说的请求形式。", es: "西班牙“直走”说 recto 或 todo recto，不用 derecho，这样就不会和 derecha（右边）混。" } },
    { latam: "dos cuadras", es: "dos calles", zh: "两个路口（两个街区）",
      note: { latam: "cuadra = 一个街区，就是两个路口之间的那一段。", es: "西班牙不说 cuadra，说 calle：dos calles。" } },
    { latam: "¿Está lejos? — No, está cerca.", zh: "远吗？——不远，很近。",
      note: { latam: "lejos 远，cerca 近，前面都用 está。A cinco minutos a pie = 走路五分钟。autobús（公交车）到处都懂；墨西哥口语叫 camión，阿根廷叫 colectivo。" } }
  ],
  tip: { latam: "izquierda 的 z 读 s：is-KIER-da；derecha 的 r 只弹一下。", es: "izquierda 的 z 读 θ（舌尖在上下齿之间）：iθ-KIER-da。" },
  tasks: [
    { zh: "打扰一下，地铁站在哪儿？", cue: "用今天第 1 个语块", skill: "phrase",
      latam: "Perdone, ¿dónde queda la estación de metro?", es: "Perdone, ¿dónde está la estación de metro?" },
    { zh: "远吗？", cue: "说距离用 está", skill: "conj",
      latam: "¿Está lejos?" },
    { zh: "右边还是左边？", cue: "derecha 和 izquierda", skill: "pron",
      latam: "¿A la derecha o a la izquierda?" },
    { zh: "直走两个路口。", cue: "对“您”说：siga", skill: "phrase",
      latam: "Siga derecho dos cuadras.", es: "Siga recto dos calles." },
    { zh: "哪路公交车去市中心？", cue: "a + el = al", skill: "phrase",
      latam: "¿Qué autobús va al centro?" }
  ],
  drill: {
    title: "方向词别弄混",
    items: [
      { latam: "derecho / derecha", es: "recto / derecha", tip: { latam: "de-RE-cho 直走，de-RE-cha 右边：只差最后一个元音", es: "REC-to 直走，de-RE-cha 右边" } },
      { latam: "izquierda", tip: { latam: "iz-QUIER-da：z 读 s，qu 读 k", es: "iz-QUIER-da：z 读 θ，qu 读 k" } },
      { latam: "¿Dónde queda?", es: "¿Dónde está?", tip: { latam: "DÓN-de QUE-da：qu 读 k，u 不发音", es: "DÓN-de es-TÁ：重音在最后的 á" } },
      { latam: "cuadra", es: "calle", tip: { latam: "CUA-dra：dr 连在一起，r 弹一下", es: "CA-lle：ll 读 y" } },
      { latam: "cerca / lejos", tip: { latam: "CER-ca：第一个 c 读 s；LE-jos：j 送气", es: "CER-ca：第一个 c 读 θ；LE-jos：j 送气" } }
    ]
  }
});

window.ENE_SPEAK.push({
  day: 10, week: 2, title: "购物与讲价",
  cando: "能问价、找合适的尺码，讲一次价",
  candoItems: ["问价钱", "说太贵了并讲价", "问有没有大一点 / 小一点的", "决定买几个"],
  canSay: { latam: "Es muy caro. ¿Me hace un descuento?", zh: "太贵了。能便宜点吗？" },
  warm: {
    q: "听路人指路，选出意思（复习 Día 9）",
    say: { latam: "Siga derecho y gire a la derecha.", es: "Siga recto y gire a la derecha." },
    opts: ["直走，然后右转", "直走，然后左转", "右转，然后直走", "往回走"], answer: 0
  },
  dialog: [
    { who: "顾客", latam: "Buenas tardes. ¿Cuánto cuesta este sombrero?", zh: "下午好。这顶帽子多少钱？" },
    { who: "摊主", latam: "Veinticinco dólares.", es: "Veinticinco euros.", zh: "二十五块。" },
    { who: "顾客", latam: "Uy, es muy caro. ¿Me hace un descuento?", zh: "哎，太贵了。能便宜点吗？" },
    { who: "摊主", latam: "Se lo dejo en veinte.", zh: "二十块卖给您。" },
    { who: "顾客", latam: "¿Y si compro dos?", zh: "如果我买两个呢？" },
    { who: "摊主", latam: "Dos por treinta y cinco.", zh: "两个三十五。" },
    { who: "顾客", latam: "¿Tiene uno más grande?", zh: "有大一点的吗？" },
    { who: "摊主", latam: "Sí, aquí tiene. Pruébeselo.", zh: "有，给您。您试试。" },
    { who: "顾客", latam: "Me queda bien. Me llevo dos.", zh: "合适。我买两个。" }
  ],
  check: { q: "顾客最后一共花多少钱？", opts: ["35", "25", "40", "20"], answer: 0 },
  chunks: [
    { latam: "¿Cuánto cuesta este sombrero? — Es muy caro.", zh: "这顶帽子多少钱？——太贵了。",
      note: { latam: "este 配阳性名词（este sombrero 这顶帽子），esta 配阴性名词（esta camisa 这件衬衫）。caro 也跟着变：La camisa es cara。" } },
    { latam: "¿Me hace un descuento? / ¿Me lo deja en …?", zh: "能便宜点吗？/ ……块卖给我行吗？",
      note: { latam: "hace、deja 都是对“您”的形式。拉美的市场、小摊讲价很常见，商场和超市一般不讲价。", es: "西班牙的商店基本不讲价，跳蚤市场（el rastro）可以试试。" } },
    { latam: "¿Tiene uno más grande / más pequeño?", zh: "有大一点 / 小一点的吗？",
      note: { latam: "uno 指前面说过的那个东西（阳性，比如帽子）；阴性的东西用 una：¿Tiene una más grande?（衬衫）。más = 更。" } },
    { latam: "Me queda bien. Me llevo …", zh: "合适。我买……",
      note: { latam: "queda 在这里是“穿戴合适”；不合适说 No me queda bien。Me llevo dos = 我买两个（我拿走两个）。不想买就说 Gracias, lo voy a pensar（谢谢，我再想想）。" } }
  ],
  tip: { latam: "descuento 的 s 和 c 都读 s，听起来像“des-KUEN-to”；caro 的 r 只弹一下，别说成 carro（汽车）。" },
  tasks: [
    { zh: "这顶帽子多少钱？", cue: "这顶 = este（阳性）", skill: "phrase",
      latam: "¿Cuánto cuesta este sombrero?" },
    { zh: "太贵了。能便宜点吗？", cue: "caro 的 r 弹一下", skill: "phrase",
      latam: "Es muy caro. ¿Me hace un descuento?" },
    { zh: "二十块卖给我行吗？", cue: "对摊主用“您”：deja", skill: "conj",
      latam: "¿Me lo deja en veinte?" },
    { zh: "有大一点的吗？", cue: "对摊主用“您”：tiene", skill: "conj",
      latam: "¿Tiene uno más grande?" },
    { zh: "合适。我买两个。", cue: "今天第 4 个语块", skill: "phrase",
      latam: "Me queda bien. Me llevo dos." }
  ],
  drill: {
    title: "讲价时的关键音",
    items: [
      { latam: "caro", tip: "CA-ro：r 只弹一下（carro 是汽车）" },
      { latam: "descuento", tip: { latam: "des-CUEN-to：c 在 u 前读 k", es: "des-CUEN-to：c 在 u 前读 k，s 照常读" } },
      { latam: "veinticinco", tip: { latam: "vein-ti-CIN-co：一个词，重音在 cin，c 读 s", es: "vein-ti-CIN-co：一个词，重音在 cin，c 读 θ" } },
      { latam: "¿Me hace un descuento?", tip: { latam: "hace 的 h 不发音，读“A-se”", es: "hace 的 h 不发音，读“A-θe”" } },
      { latam: "más grande", tip: "más 有重音符号，意思是“更”；gr 连在一起，r 弹一下" }
    ]
  }
});

window.ENE_SPEAK.push({
  day: 11, week: 2, title: "点餐升级",
  cando: "能在餐厅点两道菜，说清不吃什么",
  candoItems: ["点第一道和第二道菜", "说不要什么", "问菜里有没有某样东西、说自己过敏", "点饮料"],
  canSay: { latam: "El pollo con arroz, sin cebolla, por favor.", zh: "请给我鸡肉饭，不要洋葱。" },
  warm: {
    q: "听顾客的话，选出意思（复习 Día 10）",
    say: { latam: "Es muy caro. ¿Me hace un descuento?" },
    opts: ["太贵了，能便宜点吗？", "太大了，有小一点的吗？", "很合适，我买两个。", "这个多少钱？"], answer: 0
  },
  dialog: [
    { who: "服务员", latam: "Buenas noches. ¿Ya saben qué van a pedir?", es: "Buenas noches. ¿Ya sabéis qué vais a pedir?", zh: "晚上好。你们想好点什么了吗？" },
    { who: "顾客", latam: "Sí. Para mí, de primero, una sopa de verduras.", zh: "想好了。我的第一道要蔬菜汤。" },
    { who: "服务员", latam: "¿Y de segundo?", zh: "第二道呢？" },
    { who: "顾客", latam: "El pollo con arroz, pero sin cebolla, por favor.", zh: "鸡肉饭，但是不要洋葱，谢谢。" },
    { who: "服务员", latam: "Muy bien. ¿Algo más?", zh: "好的。还要别的吗？" },
    { who: "顾客", latam: "Una pregunta: ¿la sopa lleva maní? Soy alérgico.", es: "Una pregunta: ¿la sopa lleva cacahuete? Soy alérgico.", zh: "问一下：汤里有花生吗？我过敏。" },
    { who: "服务员", latam: "No, no lleva. ¿Y para tomar?", es: "No, no lleva. ¿Y para beber?", zh: "没有。喝点什么？" },
    { who: "顾客", latam: "Una limonada, por favor.", zh: "一杯柠檬水，谢谢。" },
    { who: "服务员", latam: "Perfecto. Enseguida se lo traigo.", zh: "好的，马上给您拿来。" }
  ],
  check: { q: "顾客不要什么？", opts: ["洋葱", "米饭", "鸡肉", "柠檬水"], answer: 0 },
  chunks: [
    { latam: "Para mí, de primero … / de segundo …", zh: "我要……第一道……/ 第二道……",
      note: { latam: "很多拉美餐厅的午餐套餐（menú del día，墨西哥叫 comida corrida）分 primero（汤或前菜）和 segundo（主菜）。Para mí = 我要（给我的）。", es: "西班牙午餐的 menú del día 也这样分，最后还有 postre（甜点）。" } },
    { latam: "sin …, por favor", zh: "不要……，谢谢",
      note: { latam: "sin = 不加 / 没有：sin cebolla 不要洋葱，sin picante 不要辣，sin carne 不要肉。Día 5 的 sin azúcar 也是这个。" } },
    { latam: "¿Lleva maní? — Soy alérgico / alérgica.", es: "¿Lleva cacahuete? — Soy alérgico / alérgica.", zh: "里面有花生吗？——我过敏。",
      note: { latam: "lleva 在这里是“含有”。过敏：男生说 alérgico，女生说 alérgica。“对花生过敏”：Soy alérgico al maní（a + el = al）。花生在拉美多说 maní，墨西哥说 cacahuate。", es: "西班牙花生说 cacahuete：Soy alérgico al cacahuete。" } },
    { latam: "¿Y para tomar? — Una limonada.", es: "¿Y para beber? — Una limonada.", zh: "喝点什么？——一杯柠檬水。",
      note: { latam: "拉美“喝”常说 tomar。", es: "西班牙“喝”多说 beber。服务员对一桌朋友常用 vosotros：¿Ya sabéis …?（你们想好了吗）。" } }
  ],
  tip: { latam: "cebolla 的 c 读 s，ll 读 y：se-BO-ya；arroz 的 rr 要颤，z 读 s。", es: "cebolla 的 c 读 θ：θe-BO-ya；arroz 的 rr 要颤，z 读 θ。" },
  tasks: [
    { zh: "我的第一道要蔬菜汤。", cue: "para mí + de primero", skill: "phrase",
      latam: "Para mí, de primero, una sopa de verduras." },
    { zh: "鸡肉饭，不要洋葱。", cue: "arroz 的 rr 要颤", skill: "pron",
      latam: "El pollo con arroz, sin cebolla." },
    { zh: "汤里有花生吗？", cue: "lleva = 含有", skill: "phrase",
      latam: "¿La sopa lleva maní?", es: "¿La sopa lleva cacahuete?" },
    { zh: "我过敏。", cue: "男生说 alérgico，女生说 alérgica，两种都算对", skill: "conj",
      latam: "Soy alérgico.", alt: ["Soy alérgica."] },
    { zh: "一杯柠檬水，谢谢。", cue: "点饮料", skill: "phrase",
      latam: "Una limonada, por favor." }
  ],
  drill: {
    title: "点餐里的 rr 和 ll",
    items: [
      { latam: "arroz", tip: { latam: "a-RROZ：rr 连续颤，z 读 s", es: "a-RROZ：rr 连续颤，z 读 θ" } },
      { latam: "pollo", tip: "PO-llo：ll 读 y，像“波哟”（只是近似）" },
      { latam: "sin cebolla", tip: { latam: "ce-BO-lla：c 读 s，ll 读 y", es: "ce-BO-lla：c 读 θ，ll 读 y" } },
      { latam: "verduras", tip: "ver-DU-ras：两个 r 都只弹一下" },
      { latam: "alérgico", tip: "a-LÉR-gi-co：重音在 lér，g 在 i 前读喉音" }
    ]
  }
});

window.ENE_SPEAK.push({
  day: 12, week: 2, title: "住宿",
  cando: "能自己在酒店办入住和退房",
  candoItems: ["说有预订、住几晚", "问早餐时间", "退房并付钱"],
  canSay: { latam: "Buenas noches. Tengo una reserva.", zh: "晚上好。我有预订。" },
  warm: {
    q: "听顾客的话，选出意思（复习 Día 11）",
    say: { latam: "Sin cebolla, por favor." },
    opts: ["请不要洋葱。", "请多放洋葱。", "请不要辣。", "请给我米饭。"], answer: 0
  },
  dialog: [
    { who: "客人", latam: "Buenas noches. Tengo una reserva.", zh: "晚上好。我有预订。" },
    { who: "前台", latam: "¿A nombre de quién?", zh: "预订人叫什么名字？" },
    { who: "客人", latam: "A nombre de Wang. Por dos noches.", zh: "名字是王。住两晚。" },
    { who: "前台", latam: "Muy bien. ¿Me permite su pasaporte, por favor?", zh: "好的。请出示一下您的护照。" },
    { who: "客人", latam: "Aquí tiene. ¿A qué hora es el desayuno?", zh: "给您。早餐几点？" },
    { who: "前台", latam: "De siete a diez. Su habitación es la treinta y cinco.", zh: "七点到十点。您的房间是三十五号。" },
    { who: "客人（两天后）", latam: "Buenos días. Quiero dejar la habitación, por favor.", zh: "早上好。我要退房。" },
    { who: "前台", latam: "Claro. Son noventa dólares.", es: "Claro. Son noventa euros.", zh: "好的。一共九十块。" },
    { who: "前台", latam: "¿Con tarjeta o en efectivo?", zh: "刷卡还是付现金？" }
  ],
  check: { q: "早餐几点？", opts: ["七点到十点", "七点到九点", "八点到十点"], answer: 0 },
  chunks: [
    { latam: "Tengo una reserva a nombre de … Por dos noches.", zh: "我有预订，名字是……住两晚。",
      note: { latam: "tengo 是 tener（有）对“我”的形式。por dos noches = 住两晚。墨西哥也常说 reservación，意思一样。" } },
    { latam: "¿A qué hora es el desayuno?", zh: "早餐几点？",
      note: { latam: "Día 8 的 ¿A qué hora …? 又用上了。回答 De siete a diez = 从七点到十点。问 wifi 密码可以说 ¿Cuál es la contraseña del wifi?（拉美 wifi 多读“wai-fai”）。", es: "问 wifi 密码：¿Cuál es la contraseña del wifi?（西班牙 wifi 多读“wi-fi”）。" } },
    { latam: "Quiero dejar la habitación.", zh: "我要退房。",
      note: { latam: "quiero 是 querer（想要）对“我”的形式，在前台说很自然。很多酒店也直接说 el check-out。habitación 的 h 不发音。" } },
    { latam: "¿Con tarjeta o en efectivo? — Con tarjeta, por favor.", zh: "刷卡还是现金？——刷卡，谢谢。",
      note: { latam: "tarjeta = 银行卡，efectivo = 现金。付现金就说 En efectivo。" } }
  ],
  tip: { latam: "habitación：h 不发音，c 读 s，重音在最后的 ó：a-bi-ta-SIÓN。", es: "habitación：h 不发音，c 读 θ，重音在最后的 ó：a-bi-ta-θIÓN。" },
  tasks: [
    { zh: "晚上好。我有预订。", cue: "tengo = 我有", skill: "conj",
      latam: "Buenas noches. Tengo una reserva." },
    { zh: "住两晚。", cue: "por + 几晚", skill: "phrase",
      latam: "Por dos noches." },
    { zh: "早餐几点？", cue: "¿A qué hora …?", skill: "phrase",
      latam: "¿A qué hora es el desayuno?" },
    { zh: "我要退房。", cue: "quiero = 我想要", skill: "conj",
      latam: "Quiero dejar la habitación." },
    { zh: "刷卡，谢谢。", cue: "回答“刷卡还是现金”", skill: "phrase",
      latam: "Con tarjeta, por favor." }
  ],
  drill: {
    title: "前台对话里的难音",
    items: [
      { latam: "habitación", tip: { latam: "a-bi-ta-SIÓN：h 不发音，c 读 s", es: "a-bi-ta-θIÓN：h 不发音，c 读 θ" } },
      { latam: "reserva", tip: "re-SER-va：词首的 r 要颤（像 rr），v 读得像 b" },
      { latam: "desayuno", tip: "de-sa-YU-no：重音在 yu" },
      { latam: "tarjeta", tip: "tar-JE-ta：r 弹一下，j 从喉咙送气" },
      { latam: "efectivo", tip: "e-fec-TI-vo：重音在 ti" }
    ]
  }
});

window.ENE_SPEAK.push({
  day: 13, week: 2, title: "求助与数字复诵",
  cando: "能开口求助，并把对方说的号码复述确认",
  candoItems: ["问厕所在哪儿", "说丢了东西并请人帮忙", "复述号码确认"],
  canSay: { latam: "Perdí mi celular. ¿Me puede ayudar?", es: "He perdido mi móvil. ¿Me puede ayudar?", zh: "我的手机丢了。您能帮我吗？" },
  warm: {
    q: "听客人的话，选出意思（复习 Día 12）",
    say: { latam: "Tengo una reserva por dos noches." },
    opts: ["我有预订，住两晚。", "我有预订，住三晚。", "我要退房。", "早餐几点？"], answer: 0
  },
  dialog: [
    { who: "游客", latam: "Perdone, ¿dónde está el baño?", es: "Perdone, ¿dónde están los servicios?", zh: "打扰一下，厕所在哪儿？" },
    { who: "店员", latam: "Al fondo, a la derecha.", zh: "在最里面，右边。" },
    { who: "游客", latam: "Gracias. Otra cosa: perdí mi celular. ¿Me puede ayudar?", es: "Gracias. Otra cosa: he perdido mi móvil. ¿Me puede ayudar?", zh: "谢谢。还有一件事：我的手机丢了。您能帮我吗？" },
    { who: "店员", latam: "Claro. Lo llamo. ¿Cuál es su número?", zh: "当然。我打一下。您的号码是多少？" },
    { who: "游客", latam: "Es el nueve, ocho, siete, tres, cinco, dos, uno, cero.", zh: "是 9873 5210。" },
    { who: "店员", latam: "A ver… nueve, ocho, siete, tres, cinco, dos, uno, cero. ¿Correcto?", zh: "我看看……9873 5210，对吗？" },
    { who: "游客", latam: "Sí, correcto.", zh: "对。" },
    { who: "店员", latam: "Está sonando… ¡Aquí está, debajo de la mesa!", zh: "响了……在这儿，在桌子底下！" },
    { who: "游客", latam: "¡Qué alivio! Muchísimas gracias.", zh: "太好了，松了口气！太感谢了。" }
  ],
  check: { q: "手机最后在哪里找到？", opts: ["桌子底下", "厕所里", "包里", "前台"], answer: 0 },
  chunks: [
    { latam: "¿Dónde está el baño?", es: "¿Dónde están los servicios?", zh: "厕所在哪儿？",
      note: { latam: "baño 最通用。al fondo = 在最里面。", es: "西班牙在餐厅、商场常说 los servicios 或 el aseo；家里的才叫 el baño（说 baño 大家也懂）。" } },
    { latam: "Perdí mi … ¿Me puede ayudar?", es: "He perdido mi … ¿Me puede ayudar?", zh: "我把……丢了。您能帮我吗？",
      note: { latam: "perdí 是 perder（丢）的过去式，“我丢了”。常丢的东西：el celular（手机）、la cartera（钱包）、el pasaporte（护照）、las llaves（钥匙）。¿Me puede ayudar? 是 Día 6 学的。", es: "西班牙说刚刚发生的事常用 he perdido（我刚丢了）。手机说 el móvil。" } },
    { latam: "A ver… ¿Correcto? — Sí, correcto.", zh: "我看看……对吗？——对。",
      note: { latam: "复诵号码：对方说完，你一个数字一个数字重复一遍，最后问 ¿Correcto?。不对就说 No, es el … 再说一遍。" } },
    { latam: "¡Ayuda! / ¡Llame a la policía!", zh: "救命！/ 请叫警察！",
      note: { latam: "紧急时用。llame 是对“您”的请求形式。很多拉美国家的紧急电话是 911。", es: "西班牙和整个欧洲的紧急电话是 112。" } }
  ],
  tip: { latam: "celular 的 c 读 s：se-lu-LAR；ayuda 的 y 读得像“衣呀”连读：a-YU-da。", es: "móvil 重音在 mó：MÓ-vil，v 读得像 b。" },
  tasks: [
    { zh: "打扰一下，厕所在哪儿？", cue: "对陌生人用 perdone", skill: "phrase",
      latam: "Perdone, ¿dónde está el baño?", es: "Perdone, ¿dónde están los servicios?" },
    { zh: "我的手机丢了。您能帮我吗？", cue: "我丢了 = perdí", skill: "conj",
      latam: "Perdí mi celular. ¿Me puede ayudar?", es: "He perdido mi móvil. ¿Me puede ayudar?" },
    { zh: "我的护照丢了。", cue: "换一样东西", skill: "conj",
      latam: "Perdí mi pasaporte.", es: "He perdido mi pasaporte." },
    { zh: "九、八、七、三，对吗？", cue: "复诵号码再确认", skill: "pron",
      latam: "Nueve, ocho, siete, tres. ¿Correcto?" },
    { zh: "请叫警察！", cue: "对“您”说：llame", skill: "phrase",
      latam: "¡Llame a la policía!" }
  ],
  drill: {
    title: "求助时要说清楚",
    items: [
      { latam: "perdí", es: "he perdido", tip: { latam: "per-DÍ：重音在最后的 í，r 弹一下", es: "he per-DI-do：h 不发音" } },
      { latam: "¿Me puede ayudar?", tip: "a-yu-DAR：y 读“衣”带一点摩擦，词尾 r 弹一下" },
      { latam: "policía", tip: { latam: "po-li-CÍ-a：重音在 í，c 读 s", es: "po-li-CÍ-a：重音在 í，c 读 θ" } },
      { latam: "correcto", tip: "co-RREC-to：rr 要颤" },
      { latam: "siete / seis", tip: "SIE-te（7）两拍，seis（6）一拍，复诵时别混" }
    ]
  }
});

window.ENE_SPEAK.push({
  day: 14, week: 2, title: "第二周复盘",
  cando: "能独立完成一次“到店、点单、结账”",
  candoItems: ["进店说几位", "点两道菜并说不要什么", "问厕所、几点关门这类小问题", "结账并听懂价钱"],
  canSay: { latam: "La cuenta, por favor. ¿Cuánto es?", zh: "请结账。多少钱？" },
  warm: {
    q: "听号码，选出你听到的（复习 Día 13）",
    say: { latam: "Es el nueve, ocho, siete, tres." },
    opts: ["9873", "9837", "8973", "9763"], answer: 0
  },
  dialog: [
    { who: "服务员", latam: "Buenas tardes. ¿Cuántas personas?", zh: "下午好。几位？" },
    { who: "顾客", latam: "Una mesa para dos, por favor.", zh: "两位，谢谢。" },
    { who: "服务员", latam: "Por aquí. Aquí tienen la carta.", zh: "这边请。这是菜单。" },
    { who: "顾客", latam: "Gracias. Perdone, ¿dónde está el baño?", es: "Gracias. Perdone, ¿dónde están los servicios?", zh: "谢谢。打扰一下，厕所在哪儿？" },
    { who: "服务员", latam: "Al fondo, a la izquierda. ¿Ya saben qué van a pedir?", es: "Al fondo, a la izquierda. ¿Ya sabéis qué vais a pedir?", zh: "在最里面，左边。你们想好点什么了吗？" },
    { who: "顾客", latam: "Sí. De primero, una sopa, y de segundo, pescado con arroz.", zh: "想好了。第一道要汤，第二道要鱼配米饭。" },
    { who: "顾客", latam: "Sin picante, por favor.", zh: "不要辣，谢谢。" },
    { who: "服务员", latam: "Muy bien. ¿Y para tomar?", es: "Muy bien. ¿Y para beber?", zh: "好的。喝点什么？" },
    { who: "顾客", latam: "Dos limonadas. ¿A qué hora cierran?", zh: "两杯柠檬水。你们几点关门？" },
    { who: "服务员", latam: "A las once.", zh: "十一点。" },
    { who: "顾客（吃完）", latam: "La cuenta, por favor. ¿Cuánto es?", zh: "请结账。多少钱？" },
    { who: "服务员", latam: "Son treinta y ocho dólares. ¿Con tarjeta o en efectivo?", es: "Son treinta y ocho euros. ¿Con tarjeta o en efectivo?", zh: "一共三十八块。刷卡还是现金？" }
  ],
  check: { q: "这家餐厅几点关门？", opts: ["十一点", "一点", "十点", "七点"], answer: 0 },
  chunks: [
    { latam: "¿Cuántas personas? — Una mesa para dos, por favor.", zh: "几位？——两位，谢谢。",
      note: { latam: "回答用 para + 人数：para uno、para dos、para cuatro。la carta = 菜单（拉美也常说 el menú）。" } },
    { latam: "De primero … y de segundo … Sin …", zh: "第一道……第二道……不要……",
      note: { latam: "Día 11 的点餐语块。pescado = 鱼（做成菜的鱼），sin picante = 不要辣。" } },
    { latam: "¿Dónde está el baño? / ¿A qué hora cierran?", es: "¿Dónde están los servicios? / ¿A qué hora cierran?", zh: "厕所在哪儿？/ 你们几点关门？",
      note: { latam: "cierran 是 cerrar（关门）对“他们 / 你们（ustedes）”的形式。Día 8 的 ¿A qué hora …? 后面可以接任何事。", es: "西班牙餐厅里厕所多说 los servicios。" } },
    { latam: "La cuenta, por favor. — ¿Con tarjeta o en efectivo?", zh: "请结账。——刷卡还是现金？",
      note: { latam: "餐厅结账说 la cuenta。小费各国不同，墨西哥一般给 10%–15%。", es: "西班牙小费不是必须的，满意的话留点零钱就行。" } }
  ],
  tip: { latam: "picante、cuenta 的 c 在 a、u 前读 k；只有在 e、i 前才读 s（cierran ≈“SIE-rran”）。", es: "picante、cuenta 的 c 在 a、u 前读 k；在 e、i 前读 θ（cierran ≈“θIE-rran”）。" },
  tasks: [
    { zh: "两位，谢谢。", cue: "para + 人数", skill: "phrase",
      latam: "Una mesa para dos, por favor." },
    { zh: "打扰一下，厕所在哪儿？", cue: "Día 13 学的", skill: "phrase",
      latam: "Perdone, ¿dónde está el baño?", es: "Perdone, ¿dónde están los servicios?" },
    { zh: "第一道要汤，第二道要鱼配米饭。", cue: "de primero … de segundo …", skill: "phrase",
      latam: "De primero, una sopa, y de segundo, pescado con arroz." },
    { zh: "不要辣，谢谢。", cue: "sin + 不要的东西", skill: "phrase",
      latam: "Sin picante, por favor." },
    { zh: "你们几点关门？", cue: "关门 = cierran（对“你们”）", skill: "conj",
      latam: "¿A qué hora cierran?" },
    { zh: "请结账。多少钱？", cue: "两个短句", skill: "phrase",
      latam: "La cuenta, por favor. ¿Cuánto es?" }
  ],
  drill: {
    title: "第二周最容易错的地方",
    items: [
      { latam: "la cuenta", tip: "CUEN-ta：c 在 u 前读 k" },
      { latam: "cierran", tip: { latam: "CIE-rran：c 读 s，rr 要颤", es: "CIE-rran：c 读 θ，rr 要颤" } },
      { latam: "pescado con arroz", tip: "pes-CA-do：c 读 k；a-RROZ：rr 要颤" },
      { latam: "a la izquierda", tip: { latam: "iz-QUIER-da：z 读 s，别和 derecha（右）弄混", es: "iz-QUIER-da：z 读 θ，别和 derecha（右）弄混" } },
      { latam: "es la una / son las once", tip: "一点用 es la，其他点数用 son las" }
    ]
  }
});
