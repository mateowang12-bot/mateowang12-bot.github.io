// data/speak1.js —— 开口 30 天 · 第 1 周「能开口」（Día 1–7）。格式见 data/SPEAK.md
window.ENE_SPEAK = window.ENE_SPEAK || [];

window.ENE_SPEAK.push({
  day: 1, week: 1, title: "见面",
  cando: "三秒内说出完整的问候和自我介绍",
  candoItems: ["读准 a e i o u 五个元音", "知道重音落在哪个音节", "会说三句问候"],
  canSay: { latam: "Hola, buenos días. Me llamo Ana. Mucho gusto.", zh: "你好，早上好。我叫安娜。很高兴认识你。" },
  warm: {
    q: "先猜一猜：听一个词，选出你听到的那个（练元音听辨）",
    say: { latam: "mesa" },
    opts: ["masa", "mesa", "misa", "musa"], answer: 1
  },
  dialog: [
    { who: "路易斯", latam: "¡Hola! Buenos días.", zh: "你好！早上好。" },
    { who: "安娜", latam: "Hola, buenos días. ¿Cómo estás?", zh: "你好，早上好。你好吗？" },
    { who: "路易斯", latam: "Bien, gracias. ¿Y tú?", zh: "很好，谢谢。你呢？" },
    { who: "安娜", latam: "Muy bien. Me llamo Ana. ¿Cómo te llamas?", zh: "非常好。我叫安娜。你叫什么名字？" },
    { who: "路易斯", latam: "Me llamo Luis. Mucho gusto.", zh: "我叫路易斯。很高兴认识你。" },
    { who: "安娜", latam: "Mucho gusto, Luis.", zh: "很高兴认识你，路易斯。" },
    { who: "路易斯", latam: "¡Adiós, hasta luego!", zh: "再见，回头见！" },
    { who: "安娜", latam: "¡Hasta luego!", zh: "回头见！" }
  ],
  check: { q: "安娜今天怎么样？", opts: ["非常好", "一般", "不太好"], answer: 0 },
  chunks: [
    { latam: "a · e · i · o · u", zh: "五个元音",
      note: { latam: "a 像“啊”，e 像“诶”但嘴型不滑动，i 像“衣”，o 像“哦”，u 像“乌”（都只是近似）。西语元音短、干脆、不拖尾，不管在哪个词里读法都一样。重音规则：词尾是元音、n、s → 重读倒数第二个音节（HO-la、BUE-nos）；词尾是其他辅音 → 重读最后一个音节（us-TED）；有重音符号就读那里（a-DIÓS、DÍ-as）。" } },
    { latam: "Hola / Buenos días / Buenas tardes / Buenas noches", zh: "你好 / 早上好 / 下午好 / 晚上好",
      note: { latam: "中午以前说 buenos días；午饭后到天黑说 buenas tardes；天黑以后见面或道别都说 buenas noches。Hola 随时都能用，h 不发音，读“o-la”。" } },
    { latam: "¿Cómo estás? — Bien, gracias. ¿Y tú?", zh: "你好吗？——很好，谢谢。你呢？",
      note: { latam: "这是对朋友、同龄人的说法（tú，你）。对长辈、陌生人要说 ¿Cómo está?（您好吗），Día 6 细讲。" } },
    { latam: "Me llamo … ¿Cómo te llamas? — Mucho gusto.", zh: "我叫……你叫什么名字？——很高兴认识你。",
      note: { latam: "llamo 的 ll 读得像“y”（yeísmo），me llamo 听起来像“me yamo”。", es: "西班牙也说 Mucho gusto，但更常说 Encantado（男生说）/ Encantada（女生说）。" } }
  ],
  tip: { latam: "gracias 里的 c 读 s（seseo），听起来像“gra-sias”。", es: "gracias 里的 c 读 θ：舌尖轻轻放在上下齿之间送气，像英语 think 的 th。" },
  tasks: [
    { zh: "你好，早上好。", cue: "两个问候连着说", skill: "phrase",
      latam: "Hola, buenos días." },
    { zh: "很好，谢谢。你呢？", cue: "回答“你好吗”，再反问对方", skill: "phrase",
      latam: "Bien, gracias. ¿Y tú?" },
    { zh: "你叫什么名字？", cue: "ll 读 y", skill: "pron",
      latam: "¿Cómo te llamas?" },
    { zh: "很高兴认识你。", cue: "u 是圆嘴的“乌”", skill: "pron",
      latam: "Mucho gusto." },
    { zh: "再见，回头见！", cue: "adiós 的重音在 ó", skill: "pron",
      latam: "¡Adiós, hasta luego!" }
  ],
  drill: {
    title: "问候里的元音和重音",
    items: [
      { latam: "hola", tip: "HO-la：h 不发音，重音在 o" },
      { latam: "buenos días", tip: "BUE-nos DÍ-as：días 的 í 有重音符号，要读得重一点" },
      { latam: "gracias", tip: { latam: "GRA-cias：c 读 s，r 舌尖弹一下", es: "GRA-cias：c 读 θ，r 舌尖弹一下" } },
      { latam: "mucho gusto", tip: "MU-cho GUS-to：u 圆嘴，两个词都重读前一个音节" },
      { latam: "adiós", tip: "a-DIÓS：重音落在最后的 ó" }
    ]
  }
});

window.ENE_SPEAK.push({
  day: 2, week: 1, title: "我是谁",
  cando: "能说清“我叫……，来自……，做……”",
  candoItems: ["说出自己来自哪里", "说出职业", "知道名词分阴性和阳性"],
  canSay: { latam: "Soy de China. Soy estudiante.", zh: "我来自中国。我是学生。" },
  warm: {
    q: "听一句话，选出中文意思（复习 Día 1）",
    say: { latam: "¿Cómo te llamas?" },
    opts: ["你叫什么名字？", "你好吗？", "很高兴认识你。", "回头见！"], answer: 0
  },
  dialog: [
    { who: "玛丽亚", latam: "Hola, soy María. ¿Cómo te llamas?", zh: "你好，我是玛丽亚。你叫什么名字？" },
    { who: "伟", latam: "Me llamo Wei. Mucho gusto.", zh: "我叫伟。很高兴认识你。" },
    { who: "玛丽亚", latam: "¿De dónde eres?", zh: "你是哪里人？" },
    { who: "伟", latam: "Soy de China, de Shanghái. Soy chino.", zh: "我来自中国上海。我是中国人。" },
    { who: "玛丽亚", latam: "Yo soy de México. ¿Eres estudiante?", es: "Yo soy de España. ¿Eres estudiante?", zh: "我是墨西哥人。你是学生吗？" },
    { who: "伟", latam: "No, soy ingeniero. ¿Y tú?", zh: "不是，我是工程师。你呢？" },
    { who: "玛丽亚", latam: "Soy profesora de inglés.", zh: "我是英语老师。" },
    { who: "伟", latam: "¡Qué bien!", zh: "真好！" }
  ],
  check: { q: "伟做什么工作？", opts: ["学生", "工程师", "老师", "医生"], answer: 1 },
  chunks: [
    { latam: "¿De dónde eres? — Soy de …", zh: "你是哪里人？——我来自……",
      note: { latam: "soy、eres 都是 ser（是）：yo soy 我是，tú eres 你是，él / ella es 他 / 她是。ser 用来说国籍、职业、身份这些不太会变的东西。de = 来自。" } },
    { latam: "Soy chino / Soy china", zh: "我是中国人（男 / 女）",
      note: { latam: "国籍要分阴阳性：男生 chino，女生 china；mexicano / mexicana；español / española（辅音结尾的加 a）。西语里国籍、语言都小写。" } },
    { latam: "Soy ingeniero. / Ella es profesora.", zh: "我是工程师。/ 她是老师。",
      note: { latam: "说职业不加 un / una：Soy ingeniero，不说 Soy un ingeniero。-o 结尾一般是阳性，-a 结尾一般是阴性：profesor → profesora，ingeniero → ingeniera。-e 结尾男女一样：estudiante。" } },
    { latam: "¿Eres estudiante? — No, soy …", zh: "你是学生吗？——不是，我是……",
      note: { latam: "问句和陈述句用词完全一样，只是句尾语调往上扬。回答“不是”：No + 正确的说法。" } }
  ],
  tip: { latam: "ingeniero 的 g 在 e 前面读喉咙送气的音，像轻一点的“h”；China 的 ch 像“吃”，但舌头不卷。" },
  tasks: [
    { zh: "你是哪里人？", cue: "问对方来自哪里", skill: "phrase",
      latam: "¿De dónde eres?" },
    { zh: "我来自中国。", cue: "soy + de", skill: "conj",
      latam: "Soy de China." },
    { zh: "我是学生。", cue: "职业前面不加 un / una", skill: "conj",
      latam: "Soy estudiante." },
    { zh: "她是老师。", cue: "她 = ella；老师要用阴性", skill: "conj",
      latam: "Ella es profesora." },
    { zh: "你是学生吗？", cue: "和陈述句一样，句尾上扬", skill: "phrase",
      latam: "¿Eres estudiante?" }
  ],
  drill: {
    title: "国籍和职业：阴阳性和难音",
    items: [
      { latam: "chino / china", tip: "ch 像“吃”但不卷舌；词尾 o / a 一定要读清楚" },
      { latam: "profesor / profesora", tip: "pro-fe-SOR / pro-fe-SO-ra：r 都只弹一下" },
      { latam: "ingeniero", tip: "in-ge-NIE-ro：g 读喉音，r 弹一下" },
      { latam: "estudiante", tip: "es-tu-DIAN-te：开头 es 别读成“诶斯”两拍，要短" },
      { latam: "¿De dónde eres?", tip: "DÓN-de E-res：eres 的 r 只弹一下，句尾上扬" }
    ]
  }
});

window.ENE_SPEAK.push({
  day: 3, week: 1, title: "发音攻坚",
  cando: "能分清并读对“弹一下”和“连续颤”两种颤音",
  candoItems: ["分清 r（弹一下）和 rr（连续颤）", "读对 ll 和 ñ", "知道 h 不发音、c 和 g 各有两种读法"],
  canSay: { latam: "El perro corre rápido.", zh: "狗跑得很快。" },
  warm: {
    q: "听一句自我介绍，选出意思（复习 Día 2）",
    say: { latam: "Soy de China. Soy estudiante." },
    opts: ["我来自中国，我是学生。", "我来自中国，我是老师。", "我是中国人，我是工程师。", "我住在中国，我是学生。"], answer: 0
  },
  dialog: [
    { who: "老师", latam: "pero — perro", zh: "但是 —— 狗" },
    { who: "老师", latam: "caro — carro", zh: "贵的 —— 汽车" },
    { who: "老师", latam: "El perro corre rápido.", zh: "狗跑得很快。" },
    { who: "老师", latam: "Pero el perro es caro.", zh: "可是这只狗很贵。" },
    { who: "老师", latam: "calle — llave — pollo", zh: "街道 —— 钥匙 —— 鸡肉" },
    { who: "老师", latam: "año — niño — mañana", zh: "年 —— 孩子 —— 明天" },
    { who: "老师", latam: "El niño come pollo. ¡Hasta mañana!", zh: "孩子在吃鸡肉。明天见！" },
    { who: "老师", latam: "hola — hotel — ahora", zh: "你好 —— 酒店 —— 现在" },
    { who: "老师", latam: "casa — cena · gato — gente", zh: "房子 —— 晚饭 · 猫 —— 人们" }
  ],
  check: { q: "pero 和 perro，哪个是“狗”？", opts: ["pero", "perro"], answer: 1 },
  chunks: [
    { latam: "r — rr：pero / perro", zh: "弹一下 / 连续颤",
      note: { latam: "r 在两个元音中间只弹一下：舌尖在上牙后面轻轻一碰，有点像很快地说“得”。rr 和词首的 r（rápido）要舌尖连续颤 2–3 下。颤不出来先别急：舌头放松，用 tr、dr 带一下（tres、drama），每天练一点就会出来。以上只是近似说明。", es: "西班牙读法一样。另外西班牙“汽车”说 coche，carro 多指手推车，但 caro / carro 这对词照样能练。" } },
    { latam: "ll · ñ：calle / llave / año", zh: "ll 读 y；ñ 像“nya”",
      note: { latam: "ll 和 y 读法一样，像“衣”开头再带一点摩擦：calle ≈“卡耶”，pollo ≈“波哟”（yeísmo；阿根廷人读得像“卡谢”）。ñ 像“尼”和后面的元音连成一拍：año ≈“阿钮”，niño ≈“尼钮”。都只是近似。", es: "西班牙绝大多数人 ll 也读 y；ñ 一样。" } },
    { latam: "h · c · g：hola / cena / gente", zh: "h 不发音；c、g 在 e、i 前变音",
      note: { latam: "h 永远不发音：hola 读“o-la”，ahora 读“a-o-ra”。c 在 e、i 前读 s（seseo：cena ≈“塞纳”），其他时候读 k（casa）。g 在 e、i 前读喉咙送气的音，像轻一点的“h”（gente），其他时候读 g（gato）。", es: "西班牙：c 在 e、i 前（还有字母 z）读 θ，舌尖放在上下齿之间送气，像英语 think 的 th。cena ≈“θe-na”。" } }
  ],
  tip: { latam: "练 rr 时舌头要放松，是气流把舌尖吹得抖起来，不是用力卷舌。" },
  tasks: [
    { zh: "狗跑得很快。", cue: "rr 和词首的 r 都要颤", skill: "pron",
      latam: "El perro corre rápido." },
    { zh: "可是这只狗很贵。", cue: "pero、caro 弹一下，perro 要颤", skill: "pron",
      latam: "Pero el perro es caro." },
    { zh: "孩子在吃鸡肉。", cue: "ñ 和 ll", skill: "pron",
      latam: "El niño come pollo." },
    { zh: "明天见！", cue: "mañana 的 ñ", skill: "pron",
      latam: "¡Hasta mañana!" }
  ],
  drill: {
    title: "r 和 rr",
    items: [
      { latam: "pero", tip: "PE-ro：舌尖只碰一下" },
      { latam: "perro", tip: "PE-rro：舌尖连续颤 2–3 下" },
      { latam: "rápido", tip: "RÁ-pi-do：词首的 r 也要颤，和 rr 一样" },
      { latam: "carro", tip: "CA-rro：先说 caro，再把 r 拉长颤起来" },
      { latam: "corre", tip: "CO-rre：rr 颤完再说 e" }
    ]
  }
});

window.ENE_SPEAK.push({
  day: 4, week: 1, title: "数字",
  cando: "能听懂随机报出的价钱并复述",
  candoItems: ["会数 1 到 100", "会说电话号码", "听懂价钱并复述"],
  canSay: { latam: "Cuesta quince dólares.", es: "Cuesta quince euros.", zh: "十五块。" },
  warm: {
    q: "听一个词，是 pero 还是 perro？（复习 Día 3）",
    say: { latam: "perro" },
    opts: ["pero（但是）", "perro（狗）"], answer: 1
  },
  dialog: [
    { who: "顾客", latam: "Hola. ¿Cuánto cuesta esta camiseta?", zh: "你好，这件 T 恤多少钱？" },
    { who: "店员", latam: "Cuesta quince dólares.", es: "Cuesta quince euros.", zh: "十五块。" },
    { who: "顾客", latam: "¿Quince o cincuenta?", zh: "十五还是五十？" },
    { who: "店员", latam: "Quince. Uno, cinco.", zh: "十五。一、五。" },
    { who: "顾客", latam: "Está bien. ¿Y esta?", es: "Vale. ¿Y esta?", zh: "好的。那这件呢？" },
    { who: "店员", latam: "Esa cuesta veintiocho dólares.", es: "Esa cuesta veintiocho euros.", zh: "那件二十八块。" },
    { who: "店员", latam: "Son cuarenta y tres dólares en total.", es: "Son cuarenta y tres euros en total.", zh: "一共四十三块。" },
    { who: "店员", latam: "¿Me da su número de teléfono, por favor?", zh: "请告诉我您的电话号码。" },
    { who: "顾客", latam: "Sí, es el seis, cinco, dos, ocho, cero, uno, nueve, siete.", zh: "好的，是 6528 0197。" }
  ],
  check: { q: "第一件 T 恤多少钱？", opts: ["15", "50", "5", "51"], answer: 0 },
  chunks: [
    { latam: "uno … quince · dieciséis … veintinueve", zh: "1–29",
      note: { latam: "1–15 要单独记：uno dos tres cuatro cinco seis siete ocho nueve diez, once doce trece catorce quince。16–19 写成一个词：dieciséis, diecisiete, dieciocho, diecinueve。20 是 veinte，21–29 也写成一个词：veintiuno, veintidós … veintinueve。" } },
    { latam: "treinta y uno … cien", zh: "30–100",
      note: { latam: "30 以后：十位 + y + 个位，分开写：treinta y cinco（35）、cuarenta y tres（43）。十位：treinta 30、cuarenta 40、cincuenta 50、sesenta 60、setenta 70、ochenta 80、noventa 90，100 是 cien。小心别混：quince（15）和 cincuenta（50）、seis（6）和 siete（7）。" } },
    { latam: "¿Cuánto cuesta? — Cuesta … dólares.", es: "¿Cuánto cuesta? — Cuesta … euros.", zh: "多少钱？——……块。",
      note: { latam: "cuesta 是 costar（价钱是）的形式：一件东西用 cuesta，几件东西用 cuestan。dólares 是美元；墨西哥用 pesos，各国货币不同，数字说法都一样。", es: "西班牙用欧元：quince euros。" } },
    { latam: "Mi número es el …", zh: "我的号码是……",
      note: { latam: "电话号码一个数字一个数字地读：seis, cinco, dos …，0 读 cero。拉美有些地方两位两位地读（sesenta y cinco …），听不出来就请对方再说一遍。" } }
  ],
  tip: { latam: "cero、cinco、cien 的 c 都读 s（seseo），所以 cien（一百）听起来像 sien。", es: "cero、cinco、cien 的 c 读 θ：舌尖放在上下齿之间。" },
  tasks: [
    { zh: "多少钱？", cue: "问一件东西的价钱", skill: "phrase",
      latam: "¿Cuánto cuesta?" },
    { zh: "十五块。", cue: "一件东西用 cuesta", skill: "conj",
      latam: "Cuesta quince dólares.", es: "Cuesta quince euros." },
    { zh: "一共四十三块。", cue: "十位 + y + 个位", skill: "phrase",
      latam: "Son cuarenta y tres dólares en total.", es: "Son cuarenta y tres euros en total." },
    { zh: "十五还是五十？", cue: "quince 和 cincuenta 别弄混", skill: "pron",
      latam: "¿Quince o cincuenta?" },
    { zh: "我的号码是六、五、二、八。", cue: "一个数字一个数字读", skill: "pron",
      latam: "Mi número es el seis, cinco, dos, ocho." }
  ],
  drill: {
    title: "容易混的数字",
    items: [
      { latam: "quince / cincuenta", tip: { latam: "QUIN-ce（15）/ cin-CUEN-ta（50）：c 读 s，听重音在哪", es: "QUIN-ce（15）/ cin-CUEN-ta（50）：c 读 θ，听重音在哪" } },
      { latam: "seis / siete", tip: "seis（6）一拍；SIE-te（7）两拍" },
      { latam: "doce / dos", tip: "DO-ce（12）有两个音节；dos（2）只有一个" },
      { latam: "veinte / treinta", tip: "VEIN-te（20）/ TREIN-ta（30）：tr 连在一起，r 弹一下" },
      { latam: "cero", tip: { latam: "CE-ro：c 读 s，r 弹一下", es: "CE-ro：c 读 θ，r 弹一下" } }
    ]
  }
});

window.ENE_SPEAK.push({
  day: 5, week: 1, title: "咖啡店",
  cando: "能在咖啡店完整点一次单",
  candoItems: ["点一杯饮品", "说清堂食还是外带", "问价钱"],
  canSay: { latam: "¿Me da un café con leche, por favor?", es: "¿Me pones un café con leche, por favor?", zh: "请给我一杯加奶咖啡。" },
  warm: {
    q: "听价格，选出你听到的数字（复习 Día 4）",
    say: { latam: "Son tres dólares con cincuenta.", es: "Son tres euros con cincuenta." },
    opts: ["3.50", "13.50", "3.15", "30.50"], answer: 0
  },
  dialog: [
    { who: "店员", latam: "Buenos días. ¿Qué le sirvo?", es: "Buenos días. ¿Qué te pongo?", zh: "早上好，您要点什么？" },
    { who: "顾客", latam: "¿Me da un café con leche, por favor?", es: "¿Me pones un café con leche, por favor?", zh: "请给我一杯加奶咖啡。" },
    { who: "店员", latam: "¿Para tomar aquí o para llevar?", zh: "在这儿喝还是带走？" },
    { who: "顾客", latam: "Para llevar. ¿Cuánto es?", zh: "带走。多少钱？" },
    { who: "店员", latam: "Son dos dólares con cincuenta.", es: "Son dos euros con cincuenta.", zh: "两块五。" },
    { who: "顾客", latam: "Aquí tiene. Muchas gracias.", es: "Aquí tienes. Muchas gracias.", zh: "给您。非常感谢。" },
    { who: "店员", latam: "A usted. ¡Que le vaya bien!", es: "A ti. ¡Hasta luego!", zh: "不客气，慢走！" }
  ],
  check: { q: "顾客最后是在店里喝，还是带走？", opts: ["在店里喝", "带走"], answer: 1 },
  chunks: [
    { latam: "¿Me da …, por favor?", es: "¿Me pones …, por favor?", zh: "请给我……（点单）",
      note: { latam: "da 是 dar（给）对“您”的说法。拉美点单很常用，也可以说 Quisiera …", es: "pones 是 poner（放）对“你”的说法，西班牙口语点单最常见。" } },
    { latam: "para llevar / para tomar aquí", zh: "带走 / 在这儿喝",
      note: { latam: "ll 读得像“ye”（yeísmo），llevar 听起来像“yevar”。" } },
    { latam: "¿Cuánto es? — Son … con …", zh: "多少钱？——……块……",
      note: { latam: "dos dólares con cincuenta = 2.50。墨西哥说 pesos，其他国家各有货币。", es: "dos euros con cincuenta = 2.50 欧元。" } }
  ],
  tip: { latam: "azúcar 里的 z 读 s（seseo），和 sin 的 s 一样。", es: "azúcar 里的 z 读 θ：舌尖放在上下齿之间。" },
  tasks: [
    { zh: "请给我一杯加奶咖啡。", cue: "用今天第 1 个语块", skill: "phrase",
      latam: "¿Me da un café con leche, por favor?", es: "¿Me pones un café con leche, por favor?" },
    { zh: "带走。多少钱？", cue: "两个短句就行", skill: "phrase",
      latam: "Para llevar. ¿Cuánto es?" },
    { zh: "请给我一杯不加糖的橙汁。", cue: "果汁是阳性名词", skill: "pron",
      latam: "¿Me da un jugo de naranja sin azúcar?", es: "¿Me pones un zumo de naranja sin azúcar?" }
  ],
  drill: {
    title: "咖啡店里的 r 和 j",
    items: [
      { latam: "para", tip: "pa-ra：r 在两个元音中间，舌尖只弹一下" },
      { latam: "naranja", tip: "na-ran-ja：r 弹一下，j 从喉咙后面送气" },
      { latam: "jugo", es: "zumo", tip: { latam: "ju-go：j 从喉咙送气", es: "zu-mo：z 读 θ" } },
      { latam: "por favor", tip: "两个词尾的 r 都只弹一下" }
    ]
  }
});

window.ENE_SPEAK.push({
  day: 6, week: 1, title: "礼貌公式",
  cando: "对陌生人用“您”，不和“你”混用",
  candoItems: ["礼貌地请人帮忙", "道歉", "道谢和回应", "分清 tú 和 usted"],
  canSay: { latam: "Perdone, ¿me puede ayudar, por favor?", zh: "打扰一下，您能帮我一下吗？" },
  warm: {
    q: "听店员的问题，选出意思（复习 Día 5）",
    say: { latam: "¿Para tomar aquí o para llevar?" },
    opts: ["在这儿喝还是带走？", "要加奶吗？", "多少钱？", "要大杯还是小杯？"], answer: 0
  },
  dialog: [
    { who: "游客", latam: "Perdone, señora. ¿Me puede ayudar, por favor?", zh: "打扰一下，女士。您能帮我一下吗？" },
    { who: "女士", latam: "Sí, claro. Dígame.", zh: "当然，您说。" },
    { who: "游客", latam: "¿Me puede tomar una foto?", es: "¿Me puede hacer una foto?", zh: "您能帮我拍张照片吗？" },
    { who: "女士", latam: "Con mucho gusto.", zh: "很乐意。" },
    { who: "游客", latam: "Muchas gracias, es usted muy amable.", zh: "非常感谢，您真好。" },
    { who: "女士", latam: "De nada.", zh: "不客气。" },
    { who: "游客（不小心撞到朋友）", latam: "¡Ay, perdón! Lo siento.", zh: "哎呀，对不起！真抱歉。" },
    { who: "朋友", latam: "Tranquilo, no pasa nada. ¿Me ayudas con la maleta?", zh: "别担心，没事。你帮我拿一下箱子好吗？" },
    { who: "游客", latam: "Sí, claro.", zh: "好，当然。" }
  ],
  check: { q: "游客对那位女士用的是哪种“你”？", opts: ["usted（您）", "tú（你）"], answer: 0 },
  chunks: [
    { latam: "¿Me puede …, por favor? / ¿Me puedes ayudar?", zh: "您能……吗？/ 你能帮我吗？",
      note: { latam: "puede 配 usted（您），puedes 配 tú（你），只差一个 s。对陌生人：¿Me puede ayudar?；对朋友：¿Me puedes ayudar?，或者更短的 ¿Me ayudas?", es: "西班牙一样。拍照西班牙多说 hacer una foto，拉美多说 tomar una foto。" } },
    { latam: "Perdone / Perdón / Lo siento", zh: "打扰一下 / 对不起 / 真抱歉",
      note: { latam: "Perdone 是对“您”说的“打扰一下”（问路、叫住别人）；对朋友说 Perdona。撞到人、说错话这种小事说 Perdón；真的做错事、表示遗憾说 Lo siento。拉美也很常说 Disculpe（打扰了 / 不好意思）。" } },
    { latam: "Muchas gracias. — De nada. / Con mucho gusto.", zh: "非常感谢。——不客气。/ 很乐意。",
      note: { latam: "De nada 哪里都能用。拉美很多人回答 Con gusto；哥伦比亚、委内瑞拉等地还常说 A la orden。", es: "西班牙最常见 De nada，也说 No hay de qué。" } },
    { latam: "tú / usted", zh: "你 / 您",
      note: { latam: "对陌生人、长辈、店员、警察用 usted，动词用“他 / 她”的形式（usted puede、usted es）；对朋友、家人、孩子用 tú（tú puedes、tú eres）。一句话里别混：开头说了 Perdone，后面就要用 puede，不要突然变成 puedes。“你们”在拉美一律用 ustedes。", es: "西班牙用 usted 少一些：店员、年轻人之间常直接用 tú；但对老人和正式场合还是用 usted。“你们”朋友之间说 vosotros（podéis），正式场合才说 ustedes。" } }
  ],
  tip: { latam: "usted 结尾的 d 很轻，舌尖碰一下牙齿就行，听起来像没读完；perdone 的 r 只弹一下。" },
  tasks: [
    { zh: "打扰一下，您能帮我一下吗？", cue: "对陌生人：perdone + puede", skill: "conj",
      latam: "Perdone, ¿me puede ayudar, por favor?" },
    { zh: "你能帮我吗？（对朋友说）", cue: "对朋友：puedes", skill: "conj",
      latam: "¿Me puedes ayudar?" },
    { zh: "对不起！真抱歉。", cue: "撞到人时", skill: "phrase",
      latam: "¡Perdón! Lo siento." },
    { zh: "非常感谢，您真好。", cue: "“是”用 usted 的形式 es", skill: "conj",
      latam: "Muchas gracias, es usted muy amable." },
    { zh: "很乐意。", cue: "回应别人的请求", skill: "phrase",
      latam: "Con mucho gusto." }
  ],
  drill: {
    title: "usted 和 tú 不混用",
    items: [
      { latam: "¿Me puede ayudar?", tip: "对“您”：puede，没有 s" },
      { latam: "¿Me puedes ayudar?", tip: "对“你”：puedes，有 s" },
      { latam: "perdone / perdona", tip: "对“您”说 perdone，对“你”说 perdona；r 都只弹一下" },
      { latam: "es usted muy amable", tip: "us-TED：重音在后面，d 很轻" },
      { latam: "lo siento", tip: "SIEN-to：重音在 sien" }
    ]
  }
});

window.ENE_SPEAK.push({
  day: 7, week: 1, title: "第一周复盘",
  cando: "不看字幕能听懂一段咖啡店对话",
  candoItems: ["不看字幕听懂整段咖啡店对话", "用“您”礼貌地点单和道谢", "听懂价钱，没听清会再问"],
  canSay: { latam: "Buenos días. ¿Me da un café con leche, por favor?", es: "Buenos días. ¿Me pones un café con leche, por favor?", zh: "早上好。请给我一杯加奶咖啡。" },
  warm: {
    q: "听一句话，说话人用的是“您”还是“你”？（复习 Día 6）",
    say: { latam: "Perdone, ¿me puede ayudar?" },
    opts: ["usted（您）", "tú（你）"], answer: 0
  },
  dialog: [
    { who: "店员", latam: "¡Buenos días! ¿Cómo está?", es: "¡Buenos días! ¿Qué tal?", zh: "早上好！您好吗？" },
    { who: "顾客", latam: "Muy bien, gracias. ¿Me da un café con leche y un jugo de naranja, por favor?", es: "Muy bien, gracias. ¿Me pones un café con leche y un zumo de naranja, por favor?", zh: "很好，谢谢。请给我一杯加奶咖啡和一杯橙汁。" },
    { who: "店员", latam: "Claro. ¿Para tomar aquí o para llevar?", zh: "好的。在这儿喝还是带走？" },
    { who: "顾客", latam: "Para tomar aquí.", zh: "在这儿喝。" },
    { who: "店员", latam: "Usted no es de aquí, ¿verdad? ¿De dónde es?", es: "Tú no eres de aquí, ¿verdad? ¿De dónde eres?", zh: "您不是本地人吧？您是哪里人？" },
    { who: "顾客", latam: "No, soy de China. Soy estudiante.", zh: "不是，我来自中国。我是学生。" },
    { who: "店员", latam: "¡Qué bien! Bienvenido.", zh: "真好！欢迎你来。" },
    { who: "顾客", latam: "Gracias. ¿Cuánto es?", zh: "谢谢。多少钱？" },
    { who: "店员", latam: "Son cuatro dólares con setenta y cinco.", es: "Son cuatro euros con setenta y cinco.", zh: "四块七毛五。" },
    { who: "顾客", latam: "Perdón, ¿cuánto?", zh: "不好意思，多少？" },
    { who: "店员", latam: "Cuatro con setenta y cinco.", zh: "四块七毛五。" },
    { who: "顾客", latam: "Aquí tiene. Muchas gracias.", es: "Aquí tienes. Muchas gracias.", zh: "给您。非常感谢。" }
  ],
  check: { q: "一共多少钱？", opts: ["4.75", "4.65", "14.75", "7.45"], answer: 0 },
  chunks: [
    { latam: "Buenos días. ¿Cómo está? — Muy bien, gracias.", es: "Buenos días. ¿Qué tal? — Muy bien, gracias.", zh: "早上好。您好吗？——很好，谢谢。",
      note: { latam: "Día 1 学的 ¿Cómo estás? 是对“你”；店员对顾客用 ¿Cómo está?（对“您”，没有 s）。", es: "西班牙店员常说 ¿Qué tal?，又短又随意，对谁都能用。" } },
    { latam: "¿Me da …? / Para tomar aquí", es: "¿Me pones …? / Para tomar aquí", zh: "请给我……/ 在这儿喝",
      note: { latam: "Día 5 的点单语块。jugo de naranja = 橙汁。", es: "Día 5 的点单语块。西班牙店员对顾客常用 tú，所以说 ¿Me pones …?、Aquí tienes；橙汁说 zumo de naranja。" } },
    { latam: "Soy de … Soy …", zh: "我来自……我是……",
      note: { latam: "Día 2 的 ser：店员问 ¿De dónde es?（您是哪里人），你答 Soy de China。" } },
    { latam: "¿Cuánto es? — Perdón, ¿cuánto?", zh: "多少钱？——不好意思，多少？",
      note: { latam: "没听清价钱就说 Perdón, ¿cuánto?，对方会再说一遍，常常省掉货币：cuatro con setenta y cinco。Día 4 的数字：setenta 是 70，别和 sesenta（60）混。" } }
  ],
  tip: { latam: "听不懂整句时，先抓数字和关键词（aquí、llevar、cuánto），不用每个词都听懂。" },
  tasks: [
    { zh: "早上好。请给我一杯加奶咖啡。", cue: "问候 + 点单", skill: "phrase",
      latam: "Buenos días. ¿Me da un café con leche, por favor?", es: "Buenos días. ¿Me pones un café con leche, por favor?" },
    { zh: "在这儿喝。", cue: "回答店员“在这儿还是带走”", skill: "phrase",
      latam: "Para tomar aquí." },
    { zh: "我来自中国。我是学生。", cue: "两个 soy", skill: "conj",
      latam: "Soy de China. Soy estudiante." },
    { zh: "不好意思，多少？", cue: "没听清价钱时", skill: "phrase",
      latam: "Perdón, ¿cuánto?" },
    { zh: "四块七毛五。", cue: "setenta 是 70", skill: "pron",
      latam: "Son cuatro dólares con setenta y cinco.", es: "Son cuatro euros con setenta y cinco." },
    { zh: "给您。非常感谢。", cue: "对“您”用 tiene", skill: "conj",
      latam: "Aquí tiene. Muchas gracias.", es: "Aquí tienes. Muchas gracias." }
  ],
  drill: {
    title: "第一周最容易错的音",
    items: [
      { latam: "café con leche", tip: "ca-FÉ：重音在最后的 é" },
      { latam: "para llevar", tip: "r 弹一下，ll 读 y：pa-ra ye-VAR" },
      { latam: "setenta y cinco", tip: { latam: "se-TEN-ta（70），c 读 s", es: "se-TEN-ta（70），c 读 θ" } },
      { latam: "perdón", tip: "per-DÓN：r 弹一下，重音在 ó" },
      { latam: "aquí tiene", tip: "a-QUÍ TIE-ne：qu 读 k，重音在 í" }
    ]
  }
});
