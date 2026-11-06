// 单词卡片 —— 由 content-writer 编写
// 数据变量：window.WORD_LESSONS（课程数组，从简到难排列）
// 每课字段：id, titleZh, titleEn, words
// 每个词字段：id（全站唯一）, es, zh, en, emoji（可选，用于“听音选图”，不重复）, note, example { es, zh, en }
window.WORD_LESSONS = [
  {
    id: "greetings",
    titleZh: "打招呼",
    titleEn: "Greetings",
    words: [
      {
        id: "hola",
        es: "hola",
        zh: "你好",
        en: "hello / hi",
        emoji: "👋",
        note: "h 不发音，读作 ola。",
        example: { es: "¡Hola! ¿Qué tal?", zh: "你好！怎么样？", en: "Hi! How's it going?" }
      },
      {
        id: "buenos-dias",
        es: "buenos días",
        zh: "早上好；上午好",
        en: "good morning",
        emoji: "🌅",
        note: "在西班牙一般用到吃午饭前（约下午两点）。",
        example: { es: "¡Hola, buenos días!", zh: "你好，早上好！", en: "Hello, good morning!" }
      },
      {
        id: "buenas-tardes",
        es: "buenas tardes",
        zh: "下午好",
        en: "good afternoon",
        emoji: "🌇",
        note: "从午饭后用到天黑。",
        example: { es: "¡Buenas tardes! ¿Qué tal?", zh: "下午好！怎么样？", en: "Good afternoon! How's it going?" }
      },
      {
        id: "buenas-noches",
        es: "buenas noches",
        zh: "晚上好；晚安",
        en: "good evening / good night",
        emoji: "🌙",
        note: "见面和睡前告别都可以用。",
        example: { es: "¡Hola, buenas noches!", zh: "你好，晚上好！", en: "Hello, good evening!" }
      },
      {
        id: "que-tal",
        es: "¿Qué tal?",
        zh: "怎么样；你好吗？",
        en: "How's it going?",
        note: "口语，很随意。注意开头的倒问号 ¿。",
        example: { es: "—¿Qué tal? —Bien.", zh: "——怎么样？——挺好。", en: "—How's it going? —Fine." }
      },
      {
        id: "como-estas",
        es: "¿Cómo estás?",
        zh: "你好吗？",
        en: "How are you?",
        note: "对熟人说（用 tú）。对长辈、陌生人说 ¿Cómo está usted?",
        example: { es: "¡Hola! ¿Cómo estás?", zh: "你好！你好吗？", en: "Hi! How are you?" }
      },
      {
        id: "bien",
        es: "bien",
        zh: "好；挺好",
        en: "well / fine",
        emoji: "👍",
        note: "muy bien = 很好。",
        example: { es: "—¿Cómo estás? —Bien.", zh: "——你好吗？——挺好。", en: "—How are you? —Fine." }
      },
      {
        id: "y-tu",
        es: "¿Y tú?",
        zh: "你呢？",
        en: "And you?",
        note: "tú（你）带重音；不带重音的 tu 是“你的”。",
        example: { es: "Bien, ¿y tú?", zh: "挺好，你呢？", en: "Fine, and you?" }
      },
      {
        id: "adios",
        es: "adiós",
        zh: "再见",
        en: "goodbye",
        note: "重音在 ó 上：a-DIÓS。",
        example: { es: "¡Adiós! ¡Buenas noches!", zh: "再见！晚安！", en: "Goodbye! Good night!" }
      },
      {
        id: "hasta-luego",
        es: "hasta luego",
        zh: "回头见",
        en: "see you later",
        note: "h 不发音。在西班牙很常用，即使不一定很快再见也这么说。",
        example: { es: "¡Adiós, hasta luego!", zh: "再见，回头见！", en: "Bye, see you later!" }
      }
    ]
  },
  {
    id: "courtesy",
    titleZh: "礼貌用语",
    titleEn: "Polite Words",
    words: [
      {
        id: "si",
        es: "sí",
        zh: "是；对",
        en: "yes",
        emoji: "✅",
        note: "带重音的 sí 是“是”；不带重音的 si 是“如果”。",
        example: { es: "Sí, gracias.", zh: "好的，谢谢。", en: "Yes, thank you." }
      },
      {
        id: "no",
        es: "no",
        zh: "不；不是",
        en: "no",
        emoji: "❌",
        note: "",
        example: { es: "No, gracias.", zh: "不用了，谢谢。", en: "No, thank you." }
      },
      {
        id: "por-favor",
        es: "por favor",
        zh: "请",
        en: "please",
        note: "",
        example: { es: "Sí, por favor.", zh: "好的，麻烦了。", en: "Yes, please." }
      },
      {
        id: "gracias",
        es: "gracias",
        zh: "谢谢",
        en: "thank you / thanks",
        emoji: "🙏",
        note: "muchas gracias = 非常感谢。ci 里的 c 在西班牙读咬舌音（舌尖轻轻放在上下门牙之间，往外送气，近似“丝”但舌头要伸出来），拉美读 s。",
        example: { es: "¡Muchas gracias!", zh: "非常感谢！", en: "Thank you very much!" }
      },
      {
        id: "de-nada",
        es: "de nada",
        zh: "不客气",
        en: "you're welcome",
        note: "",
        example: { es: "—Gracias. —De nada.", zh: "——谢谢。——不客气。", en: "—Thanks. —You're welcome." }
      },
      {
        id: "perdon",
        es: "perdón",
        zh: "对不起；打扰一下",
        en: "sorry / excuse me",
        note: "小失误或想引起别人注意时用。",
        example: { es: "Perdón, señor.", zh: "打扰一下，先生。", en: "Excuse me, sir." }
      },
      {
        id: "lo-siento",
        es: "lo siento",
        zh: "对不起；很抱歉",
        en: "I'm sorry",
        note: "比 perdón 更真诚、更正式的道歉。",
        example: { es: "Lo siento mucho.", zh: "非常抱歉。", en: "I'm very sorry." }
      },
      {
        id: "mucho-gusto",
        es: "mucho gusto",
        zh: "很高兴认识你",
        en: "nice to meet you",
        emoji: "🤝",
        note: "在西班牙更常说 encantado（男）/ encantada（女）；mucho gusto 在拉美更常用。",
        example: { es: "Hola, mucho gusto.", zh: "你好，很高兴认识你。", en: "Hi, nice to meet you." }
      },
      {
        id: "senor",
        es: "el señor",
        zh: "先生",
        en: "sir / Mr.",
        note: "直接称呼对方时不加冠词：Buenos días, señor。缩写 Sr.",
        example: { es: "Buenos días, señor.", zh: "早上好，先生。", en: "Good morning, sir." }
      },
      {
        id: "senora",
        es: "la señora",
        zh: "女士；夫人",
        en: "madam / Mrs.",
        note: "直接称呼对方时不加冠词。缩写 Sra.",
        example: { es: "Buenas tardes, señora.", zh: "下午好，女士。", en: "Good afternoon, madam." }
      }
    ]
  },
  {
    id: "numbers-0-5",
    titleZh: "数字 0–5",
    titleEn: "Numbers 0–5",
    words: [
      {
        id: "cero",
        es: "cero",
        zh: "零",
        en: "zero",
        emoji: "0️⃣",
        note: "在西班牙 ce 的 c 读咬舌音（舌尖轻轻放在上下门牙之间，往外送气，近似“丝”但舌头要伸出来），拉美读 s。",
        example: { es: "Cero, uno, dos.", zh: "零、一、二。", en: "Zero, one, two." }
      },
      {
        id: "uno",
        es: "uno",
        zh: "一",
        en: "one",
        emoji: "1️⃣",
        note: "放在阳性名词前变 un，放在阴性名词前变 una。",
        example: { es: "Uno, por favor.", zh: "请给我一个。", en: "One, please." }
      },
      {
        id: "dos",
        es: "dos",
        zh: "二",
        en: "two",
        emoji: "2️⃣",
        note: "",
        example: { es: "Dos, por favor.", zh: "请给我两个。", en: "Two, please." }
      },
      {
        id: "tres",
        es: "tres",
        zh: "三",
        en: "three",
        emoji: "3️⃣",
        note: "r 要轻轻弹一下舌头。",
        example: { es: "Uno, dos, tres.", zh: "一、二、三。", en: "One, two, three." }
      },
      {
        id: "cuatro",
        es: "cuatro",
        zh: "四",
        en: "four",
        emoji: "4️⃣",
        note: "",
        example: { es: "Dos y dos son cuatro.", zh: "二加二等于四。", en: "Two and two make four." }
      },
      {
        id: "cinco",
        es: "cinco",
        zh: "五",
        en: "five",
        emoji: "5️⃣",
        note: "在西班牙 ci 的 c 读咬舌音（舌尖轻轻放在上下门牙之间，往外送气，近似“丝”但舌头要伸出来），拉美读 s。",
        example: { es: "Tres, cuatro, cinco.", zh: "三、四、五。", en: "Three, four, five." }
      }
    ]
  },
  {
    id: "numbers-6-10",
    titleZh: "数字 6–10",
    titleEn: "Numbers 6–10",
    words: [
      {
        id: "seis",
        es: "seis",
        zh: "六",
        en: "six",
        emoji: "6️⃣",
        note: "",
        example: { es: "Cinco, seis, siete.", zh: "五、六、七。", en: "Five, six, seven." }
      },
      {
        id: "siete",
        es: "siete",
        zh: "七",
        en: "seven",
        emoji: "7️⃣",
        note: "",
        example: { es: "Tres y cuatro son siete.", zh: "三加四等于七。", en: "Three and four make seven." }
      },
      {
        id: "ocho",
        es: "ocho",
        zh: "八",
        en: "eight",
        emoji: "8️⃣",
        note: "ch 读音近似拼音 ch（“吃”的声母），但舌头不卷（只是近似）。",
        example: { es: "Seis, siete, ocho.", zh: "六、七、八。", en: "Six, seven, eight." }
      },
      {
        id: "nueve",
        es: "nueve",
        zh: "九",
        en: "nine",
        emoji: "9️⃣",
        note: "",
        example: { es: "Cinco y cuatro son nueve.", zh: "五加四等于九。", en: "Five and four make nine." }
      },
      {
        id: "diez",
        es: "diez",
        zh: "十",
        en: "ten",
        emoji: "🔟",
        note: "在西班牙 z 读咬舌音（舌尖轻轻放在上下门牙之间，往外送气，近似“丝”但舌头要伸出来），拉美读 s。",
        example: { es: "Cinco y cinco son diez.", zh: "五加五等于十。", en: "Five and five make ten." }
      }
    ]
  },
  {
    id: "colors",
    titleZh: "颜色",
    titleEn: "Colors",
    words: [
      {
        id: "rojo",
        es: "rojo",
        zh: "红色（的）",
        en: "red",
        emoji: "🟥",
        note: "阳性形式；修饰阴性名词变 roja。例句里的 es = “是”。",
        example: { es: "El tomate es rojo.", zh: "西红柿是红色的。", en: "The tomato is red." }
      },
      {
        id: "amarillo",
        es: "amarillo",
        zh: "黄色（的）",
        en: "yellow",
        emoji: "🟨",
        note: "阴性：amarilla。ll 在大多数地区读音近似 y。",
        example: { es: "El sol es amarillo.", zh: "太阳是黄色的。", en: "The sun is yellow." }
      },
      {
        id: "azul",
        es: "azul",
        zh: "蓝色（的）",
        en: "blue",
        emoji: "🟦",
        note: "阴阳性同形（复数 azules）。",
        example: { es: "El mar es azul.", zh: "大海是蓝色的。", en: "The sea is blue." }
      },
      {
        id: "verde",
        es: "verde",
        zh: "绿色（的）",
        en: "green",
        emoji: "🟩",
        note: "阴阳性同形。",
        example: { es: "La planta es verde.", zh: "这棵植物是绿色的。", en: "The plant is green." }
      },
      {
        id: "blanco",
        es: "blanco",
        zh: "白色（的）",
        en: "white",
        emoji: "⬜",
        note: "阴性：blanca。",
        example: { es: "El papel es blanco.", zh: "纸是白色的。", en: "The paper is white." }
      },
      {
        id: "negro",
        es: "negro",
        zh: "黑色（的）",
        en: "black",
        emoji: "⬛",
        note: "阴性：negra。",
        example: { es: "El café es negro.", zh: "咖啡是黑色的。", en: "The coffee is black." }
      },
      {
        id: "gris",
        es: "gris",
        zh: "灰色（的）",
        en: "gray",
        emoji: "🩶",
        note: "阴阳性同形（复数 grises）。",
        example: { es: "El elefante es gris.", zh: "大象是灰色的。", en: "The elephant is gray." }
      },
      {
        id: "naranja",
        es: "naranja",
        zh: "橙色（的）",
        en: "orange",
        emoji: "🟧",
        note: "作颜色时一般不变阴阳性。la naranja 也是“橙子”。也可以说 anaranjado。",
        example: { es: "La naranja es naranja.", zh: "橙子是橙色的。", en: "The orange is orange." }
      },
      {
        id: "rosa",
        es: "rosa",
        zh: "粉色（的）",
        en: "pink",
        emoji: "🩷",
        note: "作颜色时一般不变阴阳性。la rosa 也是“玫瑰”。拉美多说 rosado。",
        example: { es: "La flor es rosa.", zh: "这朵花是粉色的。", en: "The flower is pink." }
      },
      {
        id: "marron",
        es: "marrón",
        zh: "棕色（的）",
        en: "brown",
        emoji: "🟫",
        note: "阴阳性同形（复数 marrones，没有重音）。拉美很多地方说 café。",
        example: { es: "El chocolate es marrón.", zh: "巧克力是棕色的。", en: "Chocolate is brown." }
      }
    ]
  },
  {
    id: "family",
    titleZh: "家人",
    titleEn: "Family",
    words: [
      {
        id: "familia",
        es: "la familia",
        zh: "家人；家庭",
        en: "family",
        emoji: "👨‍👩‍👧",
        note: "例句里的 mi = “我的”，es = “是”。",
        example: { es: "Es mi familia.", zh: "这是我的家人。", en: "This is my family." }
      },
      {
        id: "madre",
        es: "la madre",
        zh: "母亲；妈妈",
        en: "mother",
        emoji: "👩",
        note: "口语常说 mamá（注意重音在后面）。",
        example: { es: "Es mi madre.", zh: "这是我妈妈。", en: "This is my mother." }
      },
      {
        id: "padre",
        es: "el padre",
        zh: "父亲；爸爸",
        en: "father",
        emoji: "👨",
        note: "口语常说 papá。复数 los padres = 父母。",
        example: { es: "Mi padre y mi madre.", zh: "我爸爸和我妈妈。", en: "My father and my mother." }
      },
      {
        id: "hermano",
        es: "el hermano",
        zh: "兄弟（哥哥/弟弟）",
        en: "brother",
        emoji: "👬",
        note: "h 不发音。复数 los hermanos 也可以指“兄弟姐妹”。",
        example: { es: "Es mi hermano.", zh: "这是我的哥哥（弟弟）。", en: "This is my brother." }
      },
      {
        id: "hermana",
        es: "la hermana",
        zh: "姐妹（姐姐/妹妹）",
        en: "sister",
        emoji: "👭",
        note: "h 不发音。",
        example: { es: "Mi hermano y mi hermana.", zh: "我的兄弟和姐妹。", en: "My brother and my sister." }
      },
      {
        id: "hijo",
        es: "el hijo",
        zh: "儿子",
        en: "son",
        emoji: "👦",
        note: "h 不发音，j 读音近似汉语 h（只是近似）。复数 los hijos 也可以指“子女”。",
        example: { es: "Es mi hijo.", zh: "这是我儿子。", en: "This is my son." }
      },
      {
        id: "hija",
        es: "la hija",
        zh: "女儿",
        en: "daughter",
        emoji: "👧",
        note: "h 不发音，j 读音近似汉语 h（只是近似）。",
        example: { es: "Mi hijo y mi hija.", zh: "我儿子和我女儿。", en: "My son and my daughter." }
      },
      {
        id: "abuelo",
        es: "el abuelo",
        zh: "爷爷；外公",
        en: "grandfather",
        emoji: "👴",
        note: "西语不分爷爷和外公。复数 los abuelos = 祖父母。",
        example: { es: "Es mi abuelo.", zh: "这是我爷爷。", en: "This is my grandfather." }
      },
      {
        id: "abuela",
        es: "la abuela",
        zh: "奶奶；外婆",
        en: "grandmother",
        emoji: "👵",
        note: "西语不分奶奶和外婆。",
        example: { es: "Buenos días, abuela.", zh: "早上好，奶奶。", en: "Good morning, grandma." }
      }
    ]
  },
  // ===== 阶段 9 新增（从这里往下）=====
  {
    id: "food",
    titleZh: "食物和饮料",
    titleEn: "Food & Drinks",
    words: [
      {
        id: "agua",
        es: "el agua",
        zh: "水",
        en: "water",
        emoji: "💧",
        note: "agua 其实是阴性名词，但因为开头是重读的 a，单数时前面用 el（形容词仍用阴性：el agua fría）。",
        example: { es: "Agua, por favor.", zh: "请给我水。", en: "Water, please." }
      },
      {
        id: "pan",
        es: "el pan",
        zh: "面包",
        en: "bread",
        emoji: "🍞",
        note: "",
        example: { es: "Pan y agua, por favor.", zh: "请给我面包和水。", en: "Bread and water, please." }
      },
      {
        id: "cafe",
        es: "el café",
        zh: "咖啡；咖啡馆",
        en: "coffee / café",
        emoji: "☕",
        note: "重音在 é：ca-FÉ。café con leche（牛奶咖啡）在西班牙很常见。",
        example: { es: "Un café, por favor.", zh: "请来一杯咖啡。", en: "A coffee, please." }
      },
      {
        id: "leche",
        es: "la leche",
        zh: "牛奶",
        en: "milk",
        emoji: "🥛",
        note: "ch 读音近似拼音 ch（“吃”的声母），但舌头不卷（只是近似）。",
        example: { es: "Un café con leche, por favor.", zh: "请来一杯牛奶咖啡。", en: "A coffee with milk, please." }
      },
      {
        id: "fruta",
        es: "la fruta",
        zh: "水果",
        en: "fruit",
        emoji: "🍇",
        note: "",
        example: { es: "Fruta y agua, por favor.", zh: "请给我水果和水。", en: "Fruit and water, please." }
      },
      {
        id: "manzana",
        es: "la manzana",
        zh: "苹果",
        en: "apple",
        emoji: "🍎",
        note: "在西班牙 z 读咬舌音（舌尖轻轻放在上下门牙之间，往外送气，近似“丝”但舌头要伸出来），拉美读 s。",
        example: { es: "La manzana es roja.", zh: "苹果是红色的。", en: "The apple is red." }
      },
      {
        id: "arroz",
        es: "el arroz",
        zh: "米饭；大米",
        en: "rice",
        emoji: "🍚",
        note: "rr 要连续弹舌（“打嘟噜”）。z 在西班牙读咬舌音（舌尖轻轻放在上下门牙之间，往外送气，近似“丝”但舌头要伸出来），拉美读 s。",
        example: { es: "Arroz con pollo, por favor.", zh: "请来一份鸡肉饭。", en: "Chicken with rice, please." }
      },
      {
        id: "pollo",
        es: "el pollo",
        zh: "鸡肉",
        en: "chicken",
        emoji: "🍗",
        note: "ll 在大多数地区读音近似 y：PO-yo。",
        example: { es: "Pollo y arroz, por favor.", zh: "请来鸡肉和米饭。", en: "Chicken and rice, please." }
      },
      {
        id: "pescado",
        es: "el pescado",
        zh: "鱼（食物）；鱼肉",
        en: "fish (as food)",
        emoji: "🐟",
        note: "做成菜的鱼叫 pescado；水里活的鱼叫 el pez。",
        example: { es: "Pescado y pan, por favor.", zh: "请来鱼和面包。", en: "Fish and bread, please." }
      },
      {
        id: "carne",
        es: "la carne",
        zh: "肉",
        en: "meat",
        emoji: "🥩",
        note: "西班牙的菜单常分成 carne（肉类）和 pescado（鱼类）。",
        example: { es: "¿Carne o pescado?", zh: "要肉还是要鱼？", en: "Meat or fish?" }
      }
    ]
  },
  {
    id: "days-time",
    titleZh: "星期和时间",
    titleEn: "Days & Time",
    words: [
      {
        id: "lunes",
        es: "el lunes",
        zh: "星期一",
        en: "Monday",
        note: "西语的星期名称首字母小写。el lunes = 在（这个）星期一；los lunes = 每个星期一。",
        example: { es: "Lunes, martes, miércoles.", zh: "星期一、星期二、星期三。", en: "Monday, Tuesday, Wednesday." }
      },
      {
        id: "martes",
        es: "el martes",
        zh: "星期二",
        en: "Tuesday",
        note: "例句里的 hoy = 今天，es = “是”。",
        example: { es: "Hoy es martes.", zh: "今天星期二。", en: "Today is Tuesday." }
      },
      {
        id: "miercoles",
        es: "el miércoles",
        zh: "星期三",
        en: "Wednesday",
        note: "注意 é 上的重音：MIÉR-co-les。",
        example: { es: "Mañana es miércoles.", zh: "明天星期三。", en: "Tomorrow is Wednesday." }
      },
      {
        id: "jueves",
        es: "el jueves",
        zh: "星期四",
        en: "Thursday",
        note: "j 读音近似汉语 h（只是近似）。",
        example: { es: "Hoy es jueves.", zh: "今天星期四。", en: "Today is Thursday." }
      },
      {
        id: "viernes",
        es: "el viernes",
        zh: "星期五",
        en: "Friday",
        note: "",
        example: { es: "¡Hoy es viernes!", zh: "今天星期五！", en: "Today is Friday!" }
      },
      {
        id: "sabado",
        es: "el sábado",
        zh: "星期六",
        en: "Saturday",
        note: "重音在第一个 á：SÁ-ba-do。",
        example: { es: "Mañana es sábado.", zh: "明天星期六。", en: "Tomorrow is Saturday." }
      },
      {
        id: "domingo",
        es: "el domingo",
        zh: "星期日；星期天",
        en: "Sunday",
        note: "",
        example: { es: "Sábado y domingo.", zh: "星期六和星期天。", en: "Saturday and Sunday." }
      },
      {
        id: "hoy",
        es: "hoy",
        zh: "今天",
        en: "today",
        note: "h 不发音，读作 oy。",
        example: { es: "¿Qué día es hoy?", zh: "今天星期几？", en: "What day is it today?" }
      },
      {
        id: "manana",
        es: "mañana",
        zh: "明天",
        en: "tomorrow",
        note: "mañana 还有“上午”的意思（la mañana），这里只学“明天”。hasta mañana = 明天见。",
        example: { es: "¡Hasta mañana!", zh: "明天见！", en: "See you tomorrow!" }
      },
      {
        id: "ayer",
        es: "ayer",
        zh: "昨天",
        en: "yesterday",
        note: "例句里的 fue 是“是”的过去式，先认识就好。",
        example: { es: "Ayer fue domingo.", zh: "昨天是星期天。", en: "Yesterday was Sunday." }
      }
    ]
  },
  {
    id: "numbers-11-20",
    titleZh: "数字 11–20",
    titleEn: "Numbers 11–20",
    words: [
      {
        id: "once",
        es: "once",
        zh: "十一",
        en: "eleven",
        note: "读作 ON-ce，两个音节，重音在 ON。ce 在西班牙读咬舌音（舌尖轻轻放在上下门牙之间，往外送气，近似“丝”但舌头要伸出来），拉美读 s。例句里的 más = 加。",
        example: { es: "Diez más uno son once.", zh: "十加一等于十一。", en: "Ten plus one is eleven." }
      },
      {
        id: "doce",
        es: "doce",
        zh: "十二",
        en: "twelve",
        note: "",
        example: { es: "Seis más seis son doce.", zh: "六加六等于十二。", en: "Six plus six is twelve." }
      },
      {
        id: "trece",
        es: "trece",
        zh: "十三",
        en: "thirteen",
        note: "",
        example: { es: "Diez más tres son trece.", zh: "十加三等于十三。", en: "Ten plus three is thirteen." }
      },
      {
        id: "catorce",
        es: "catorce",
        zh: "十四",
        en: "fourteen",
        note: "",
        example: { es: "Siete más siete son catorce.", zh: "七加七等于十四。", en: "Seven plus seven is fourteen." }
      },
      {
        id: "quince",
        es: "quince",
        zh: "十五",
        en: "fifteen",
        note: "qu 读 k，u 不发音：KIN-ce。",
        example: { es: "Diez más cinco son quince.", zh: "十加五等于十五。", en: "Ten plus five is fifteen." }
      },
      {
        id: "dieciseis",
        es: "dieciséis",
        zh: "十六",
        en: "sixteen",
        note: "dieci- + seis（diez y 合写成 dieci-）。dieciséis 一定要带重音。",
        example: { es: "Ocho más ocho son dieciséis.", zh: "八加八等于十六。", en: "Eight plus eight is sixteen." }
      },
      {
        id: "diecisiete",
        es: "diecisiete",
        zh: "十七",
        en: "seventeen",
        note: "",
        example: { es: "Diez más siete son diecisiete.", zh: "十加七等于十七。", en: "Ten plus seven is seventeen." }
      },
      {
        id: "dieciocho",
        es: "dieciocho",
        zh: "十八",
        en: "eighteen",
        note: "",
        example: { es: "Nueve más nueve son dieciocho.", zh: "九加九等于十八。", en: "Nine plus nine is eighteen." }
      },
      {
        id: "diecinueve",
        es: "diecinueve",
        zh: "十九",
        en: "nineteen",
        note: "",
        example: { es: "Diez más nueve son diecinueve.", zh: "十加九等于十九。", en: "Ten plus nine is nineteen." }
      },
      {
        id: "veinte",
        es: "veinte",
        zh: "二十",
        en: "twenty",
        note: "21–29 也连起来写：veintiuno, veintidós, veintitrés…",
        example: { es: "Diez más diez son veinte.", zh: "十加十等于二十。", en: "Ten plus ten is twenty." }
      }
    ]
  },
  {
    id: "numbers-tens",
    titleZh: "整十和一百",
    titleEn: "Tens & One Hundred",
    words: [
      {
        id: "treinta",
        es: "treinta",
        zh: "三十",
        en: "thirty",
        note: "从 31 开始分开写，中间加 y：treinta y uno（三十一）。",
        example: { es: "Treinta y uno.", zh: "三十一。", en: "Thirty-one." }
      },
      {
        id: "cuarenta",
        es: "cuarenta",
        zh: "四十",
        en: "forty",
        note: "",
        example: { es: "Cuarenta y cuatro.", zh: "四十四。", en: "Forty-four." }
      },
      {
        id: "cincuenta",
        es: "cincuenta",
        zh: "五十",
        en: "fifty",
        note: "",
        example: { es: "Cincuenta y cinco.", zh: "五十五。", en: "Fifty-five." }
      },
      {
        id: "sesenta",
        es: "sesenta",
        zh: "六十",
        en: "sixty",
        note: "注意别和 setenta（七十）弄混：六十是 se-SEN-ta。",
        example: { es: "Sesenta y seis.", zh: "六十六。", en: "Sixty-six." }
      },
      {
        id: "setenta",
        es: "setenta",
        zh: "七十",
        en: "seventy",
        note: "七十是 se-TEN-ta（中间是 t）。",
        example: { es: "Setenta y siete.", zh: "七十七。", en: "Seventy-seven." }
      },
      {
        id: "ochenta",
        es: "ochenta",
        zh: "八十",
        en: "eighty",
        note: "",
        example: { es: "Ochenta y ocho.", zh: "八十八。", en: "Eighty-eight." }
      },
      {
        id: "noventa",
        es: "noventa",
        zh: "九十",
        en: "ninety",
        note: "",
        example: { es: "Noventa y nueve.", zh: "九十九。", en: "Ninety-nine." }
      },
      {
        id: "cien",
        es: "cien",
        zh: "一百",
        en: "one hundred",
        emoji: "💯",
        note: "正好 100 说 cien；101 起变成 ciento：ciento uno（一百零一）。",
        example: { es: "Noventa más diez son cien.", zh: "九十加十等于一百。", en: "Ninety plus ten is one hundred." }
      }
    ]
  },
  {
    id: "weather",
    titleZh: "天气和季节",
    titleEn: "Weather & Seasons",
    words: [
      {
        id: "tiempo",
        es: "el tiempo",
        zh: "天气；时间",
        en: "weather / time",
        emoji: "⛅",
        note: "问天气：¿Qué tiempo hace? 回答常用 hace…（hace 来自 hacer“做”）。",
        example: { es: "¿Qué tiempo hace?", zh: "天气怎么样？", en: "What's the weather like?" }
      },
      {
        id: "hace-calor",
        es: "hace calor",
        zh: "天气热",
        en: "it's hot (weather)",
        emoji: "🌡️",
        note: "h 不发音。说“我觉得热”要用 tengo calor。",
        example: { es: "Hoy hace calor.", zh: "今天很热。", en: "It's hot today." }
      },
      {
        id: "hace-frio",
        es: "hace frío",
        zh: "天气冷",
        en: "it's cold (weather)",
        emoji: "❄️",
        note: "说“我觉得冷”要用 tengo frío。mucho frío = 很冷。",
        example: { es: "Hoy hace mucho frío.", zh: "今天很冷。", en: "It's very cold today." }
      },
      {
        id: "hace-sol",
        es: "hace sol",
        zh: "出太阳；晴天",
        en: "it's sunny",
        emoji: "☀️",
        note: "el sol = 太阳。",
        example: { es: "Hoy hace sol.", zh: "今天出太阳了。", en: "It's sunny today." }
      },
      {
        id: "llueve",
        es: "llueve",
        zh: "下雨",
        en: "it's raining / it rains",
        emoji: "🌧️",
        note: "来自动词 llover（下雨），ll 读音近似 y。“正在下雨”也常说 está lloviendo。",
        example: { es: "Hoy llueve mucho.", zh: "今天雨下得很大。", en: "It's raining a lot today." }
      },
      {
        id: "primavera",
        es: "la primavera",
        zh: "春天",
        en: "spring",
        emoji: "🌸",
        note: "南半球（阿根廷、智利等）季节和中国、西班牙相反。",
        example: { es: "Primavera, verano, otoño, invierno.", zh: "春、夏、秋、冬。", en: "Spring, summer, autumn, winter." }
      },
      {
        id: "verano",
        es: "el verano",
        zh: "夏天",
        en: "summer",
        emoji: "🏖️",
        note: "例句里的 en = 在。",
        example: { es: "En verano hace calor.", zh: "夏天很热。", en: "It's hot in summer." }
      },
      {
        id: "otono",
        es: "el otoño",
        zh: "秋天",
        en: "autumn / fall",
        emoji: "🍂",
        note: "注意 ñ：o-TO-ño。",
        example: { es: "En otoño llueve.", zh: "秋天会下雨。", en: "It rains in autumn." }
      },
      {
        id: "invierno",
        es: "el invierno",
        zh: "冬天",
        en: "winter",
        emoji: "⛄",
        note: "",
        example: { es: "En invierno hace frío.", zh: "冬天很冷。", en: "It's cold in winter." }
      }
    ]
  },
  {
    id: "places",
    titleZh: "常见地点",
    titleEn: "Places",
    words: [
      {
        id: "casa",
        es: "la casa",
        zh: "房子；家",
        en: "house / home",
        emoji: "🏠",
        note: "en casa = 在家；a casa = 回家。",
        example: { es: "Mi casa es blanca.", zh: "我家（的房子）是白色的。", en: "My house is white." }
      },
      {
        id: "escuela",
        es: "la escuela",
        zh: "学校",
        en: "school",
        emoji: "🏫",
        note: "",
        example: { es: "Es mi escuela.", zh: "这是我的学校。", en: "This is my school." }
      },
      {
        id: "restaurante",
        es: "el restaurante",
        zh: "餐厅；饭馆",
        en: "restaurant",
        emoji: "🍽️",
        note: "例句里的 dónde = 哪里，hay = 有。",
        example: { es: "¿Dónde hay un restaurante?", zh: "哪里有餐厅？", en: "Where is there a restaurant?" }
      },
      {
        id: "hospital",
        es: "el hospital",
        zh: "医院",
        en: "hospital",
        emoji: "🏥",
        note: "h 不发音：os-pi-TAL。",
        example: { es: "El hospital es blanco.", zh: "医院是白色的。", en: "The hospital is white." }
      },
      {
        id: "tienda",
        es: "la tienda",
        zh: "商店",
        en: "shop / store",
        emoji: "🏪",
        note: "",
        example: { es: "Es una tienda.", zh: "这是一家商店。", en: "It's a shop." }
      },
      {
        id: "bano",
        es: "el baño",
        zh: "厕所；卫生间；浴室",
        en: "bathroom / toilet",
        emoji: "🚻",
        note: "ñ 读音近似“尼”很快滑到后面的元音（只是近似）。西班牙的餐厅等公共场所也常说 los servicios 或 el aseo。",
        example: { es: "¿El baño, por favor?", zh: "请问厕所在哪儿？", en: "The bathroom, please?" }
      },
      {
        id: "hotel",
        es: "el hotel",
        zh: "酒店；宾馆",
        en: "hotel",
        emoji: "🏨",
        note: "h 不发音，重音在后面：o-TEL。",
        example: { es: "Es un hotel.", zh: "这是一家酒店。", en: "It's a hotel." }
      },
      {
        id: "calle",
        es: "la calle",
        zh: "街道；马路",
        en: "street",
        emoji: "🛣️",
        note: "ll 读音近似 y：CA-ye。",
        example: { es: "Es mi calle.", zh: "这是我住的那条街。", en: "This is my street." }
      },
      {
        id: "supermercado",
        es: "el supermercado",
        zh: "超市",
        en: "supermarket",
        emoji: "🛒",
        note: "例句里的 voy = 我去，al = a + el。",
        example: { es: "Voy al supermercado.", zh: "我去超市。", en: "I'm going to the supermarket." }
      },
      {
        id: "estacion",
        es: "la estación",
        zh: "车站",
        en: "station",
        emoji: "🚉",
        note: "-ción 结尾的词都是阴性，重音在 ó。火车站 = la estación de tren。",
        example: { es: "La estación de tren.", zh: "火车站。", en: "The train station." }
      }
    ]
  },
  {
    id: "verbs-basic",
    titleZh: "常用动词",
    titleEn: "Common Verbs",
    words: [
      {
        id: "hablar",
        es: "hablar",
        zh: "说；讲",
        en: "to speak / to talk",
        emoji: "🗣️",
        note: "规则 -ar 动词：hablo, hablas, habla… h 不发音。",
        example: { es: "Hablo español.", zh: "我说西班牙语。", en: "I speak Spanish." }
      },
      {
        id: "comer",
        es: "comer",
        zh: "吃；吃饭",
        en: "to eat",
        emoji: "😋",
        note: "规则 -er 动词：como, comes, come… 在西班牙 comer 也特指“吃午饭”。",
        example: { es: "Como arroz y pollo.", zh: "我吃米饭和鸡肉。", en: "I eat rice and chicken." }
      },
      {
        id: "beber",
        es: "beber",
        zh: "喝",
        en: "to drink",
        emoji: "🥤",
        note: "规则 -er 动词：bebo, bebes, bebe… tomar（喝）在西班牙和拉美都很常用。",
        example: { es: "Bebo agua.", zh: "我喝水。", en: "I drink water." }
      },
      {
        id: "vivir",
        es: "vivir",
        zh: "住；生活",
        en: "to live",
        note: "规则 -ir 动词：vivo, vives, vive…",
        example: { es: "Vivo en Madrid.", zh: "我住在马德里。", en: "I live in Madrid." }
      },
      {
        id: "trabajar",
        es: "trabajar",
        zh: "工作",
        en: "to work",
        emoji: "💼",
        note: "规则 -ar 动词：trabajo, trabajas, trabaja… j 读音近似汉语 h（只是近似）。",
        example: { es: "Trabajo en un hospital.", zh: "我在一家医院工作。", en: "I work in a hospital." }
      },
      {
        id: "necesitar",
        es: "necesitar",
        zh: "需要",
        en: "to need",
        note: "规则 -ar 动词：necesito, necesitas, necesita…",
        example: { es: "Necesito agua.", zh: "我需要水。", en: "I need water." }
      },
      {
        id: "ir",
        es: "ir",
        zh: "去",
        en: "to go",
        emoji: "🚶",
        note: "不规则！voy, vas, va, vamos, vais, van。去某地用 ir a…（a + el 合成 al）。",
        example: { es: "Voy a casa.", zh: "我回家。", en: "I'm going home." }
      },
      {
        id: "tener",
        es: "tener",
        zh: "有",
        en: "to have",
        note: "不规则！tengo, tienes, tiene, tenemos, tenéis, tienen。也用来说年龄和感觉：tengo hambre（我饿了）。",
        example: { es: "Tengo dos hermanos.", zh: "我有两个兄弟。", en: "I have two brothers." }
      },
      {
        id: "querer",
        es: "querer",
        zh: "想要；爱",
        en: "to want / to love",
        note: "不规则（e 变 ie）：quiero, quieres, quiere, queremos, queréis, quieren。",
        example: { es: "Quiero un café.", zh: "我想要一杯咖啡。", en: "I want a coffee." }
      },
      {
        id: "gustar",
        es: "gustar",
        zh: "喜欢",
        en: "to like",
        note: "被喜欢的东西是主语，me = 对我：Me gusta el café（咖啡让我喜欢）；喜欢的东西是复数时用 gustan：Me gustan las manzanas。",
        example: { es: "Me gusta el café.", zh: "我喜欢咖啡。", en: "I like coffee." }
      }
    ]
  },
  {
    id: "adjectives",
    titleZh: "常用形容词",
    titleEn: "Common Adjectives",
    words: [
      {
        id: "grande",
        es: "grande",
        zh: "大；大的",
        en: "big / large",
        note: "阴阳性同形。放在单数名词前面常变成 gran，意思变成“伟大的”。",
        example: { es: "La casa es grande.", zh: "这房子很大。", en: "The house is big." }
      },
      {
        id: "pequeno",
        es: "pequeño",
        zh: "小；小的",
        en: "small / little",
        note: "阴性：pequeña。注意 ñ。",
        example: { es: "La tienda es pequeña.", zh: "这家商店很小。", en: "The shop is small." }
      },
      {
        id: "bueno",
        es: "bueno",
        zh: "好；好的",
        en: "good",
        note: "阴性：buena。放在阳性单数名词前变 buen：buen día。bueno 形容东西“好”，bien 说状态“好”。",
        example: { es: "El pan es bueno.", zh: "这面包很好。", en: "The bread is good." }
      },
      {
        id: "malo",
        es: "malo",
        zh: "坏；不好",
        en: "bad",
        emoji: "👎",
        note: "阴性：mala。放在阳性单数名词前变 mal。说“味道不好”在西班牙常用 está malo。",
        example: { es: "El café es malo.", zh: "这咖啡不好（质量差）。", en: "The coffee is bad." }
      },
      {
        id: "caro",
        es: "caro",
        zh: "贵；贵的",
        en: "expensive",
        emoji: "💰",
        note: "阴性：cara。",
        example: { es: "El hotel es caro.", zh: "这家酒店很贵。", en: "The hotel is expensive." }
      },
      {
        id: "barato",
        es: "barato",
        zh: "便宜；便宜的",
        en: "cheap",
        emoji: "🏷️",
        note: "阴性：barata。",
        example: { es: "La fruta es barata.", zh: "水果很便宜。", en: "The fruit is cheap." }
      },
      {
        id: "bonito",
        es: "bonito",
        zh: "漂亮；好看",
        en: "pretty / nice",
        note: "阴性：bonita。拉美很多地方更常说 lindo。",
        example: { es: "La calle es bonita.", zh: "这条街很漂亮。", en: "The street is pretty." }
      },
      {
        id: "feo",
        es: "feo",
        zh: "丑；难看",
        en: "ugly",
        note: "阴性：fea。",
        example: { es: "El restaurante es feo.", zh: "这家餐厅很难看。", en: "The restaurant is ugly." }
      },
      {
        id: "nuevo",
        es: "nuevo",
        zh: "新；新的",
        en: "new",
        emoji: "🆕",
        note: "阴性：nueva。",
        example: { es: "Mi casa es nueva.", zh: "我的房子是新的。", en: "My house is new." }
      },
      {
        id: "viejo",
        es: "viejo",
        zh: "旧；老",
        en: "old",
        note: "阴性：vieja。说人“老”不太礼貌，常用 mayor（年纪大的）。",
        example: { es: "El hospital es viejo.", zh: "这家医院很旧。", en: "The hospital is old." }
      }
    ]
  },
  {
    id: "animals",
    titleZh: "动物",
    titleEn: "Animals",
    words: [
      {
        id: "perro",
        es: "el perro",
        zh: "狗",
        en: "dog",
        emoji: "🐶",
        note: "rr 要连续弹舌（“打嘟噜”）。母狗：la perra。",
        example: { es: "Mi perro es negro.", zh: "我的狗是黑色的。", en: "My dog is black." }
      },
      {
        id: "gato",
        es: "el gato",
        zh: "猫",
        en: "cat",
        emoji: "🐱",
        note: "母猫：la gata。",
        example: { es: "El gato es blanco.", zh: "这只猫是白色的。", en: "The cat is white." }
      },
      {
        id: "pajaro",
        es: "el pájaro",
        zh: "鸟",
        en: "bird",
        emoji: "🐦",
        note: "重音在第一个 á：PÁ-ja-ro。j 读音近似汉语 h（只是近似）。",
        example: { es: "El pájaro es azul.", zh: "这只鸟是蓝色的。", en: "The bird is blue." }
      },
      {
        id: "pez",
        es: "el pez",
        zh: "鱼（活的）",
        en: "fish (alive)",
        emoji: "🐠",
        note: "复数 los peces。做成菜的鱼叫 el pescado。",
        example: { es: "El pez es naranja.", zh: "这条鱼是橙色的。", en: "The fish is orange." }
      },
      {
        id: "caballo",
        es: "el caballo",
        zh: "马",
        en: "horse",
        emoji: "🐴",
        note: "ll 读音近似 y：ca-BA-yo。",
        example: { es: "El caballo es grande.", zh: "这匹马很大。", en: "The horse is big." }
      },
      {
        id: "vaca",
        es: "la vaca",
        zh: "奶牛；母牛",
        en: "cow",
        emoji: "🐄",
        note: "b 和 v 在西语里读音一样。",
        example: { es: "La vaca es blanca y negra.", zh: "这头奶牛是黑白色的。", en: "The cow is black and white." }
      },
      {
        id: "cerdo",
        es: "el cerdo",
        zh: "猪",
        en: "pig",
        emoji: "🐷",
        note: "猪肉 = la carne de cerdo。拉美有些地方说 el chancho 或 el puerco。",
        example: { es: "El cerdo es rosa.", zh: "这头猪是粉色的。", en: "The pig is pink." }
      },
      {
        id: "raton",
        es: "el ratón",
        zh: "老鼠；鼠标",
        en: "mouse",
        emoji: "🐭",
        note: "复数 los ratones（没有重音符号）。也指电脑鼠标。",
        example: { es: "El ratón es pequeño.", zh: "这只老鼠很小。", en: "The mouse is small." }
      }
    ]
  },
  {
    id: "clothes",
    titleZh: "衣服",
    titleEn: "Clothes",
    words: [
      {
        id: "ropa",
        es: "la ropa",
        zh: "衣服（总称）",
        en: "clothes",
        emoji: "👚",
        note: "单数就表示“所有衣服”，一般不用复数。",
        example: { es: "La ropa es cara.", zh: "衣服很贵。", en: "The clothes are expensive." }
      },
      {
        id: "camisa",
        es: "la camisa",
        zh: "衬衫",
        en: "shirt",
        emoji: "👔",
        note: "颜色等形容词放在名词后面：una camisa blanca。",
        example: { es: "Una camisa blanca.", zh: "一件白衬衫。", en: "A white shirt." }
      },
      {
        id: "camiseta",
        es: "la camiseta",
        zh: "T恤",
        en: "T-shirt",
        emoji: "👕",
        note: "拉美有些地方说 la playera（墨西哥）或 la remera（阿根廷）。",
        example: { es: "La camiseta es roja.", zh: "这件T恤是红色的。", en: "The T-shirt is red." }
      },
      {
        id: "pantalones",
        es: "los pantalones",
        zh: "裤子",
        en: "trousers / pants",
        emoji: "👖",
        note: "西班牙也常用单数 el pantalón 指一条裤子。例句里的 son = “是”（复数）。",
        example: { es: "Los pantalones son negros.", zh: "这条裤子是黑色的。", en: "The trousers are black." }
      },
      {
        id: "vestido",
        es: "el vestido",
        zh: "连衣裙",
        en: "dress",
        emoji: "👗",
        note: "",
        example: { es: "El vestido es rosa.", zh: "这条连衣裙是粉色的。", en: "The dress is pink." }
      },
      {
        id: "falda",
        es: "la falda",
        zh: "半身裙；裙子",
        en: "skirt",
        note: "阿根廷等地也说 la pollera。",
        example: { es: "La falda es azul.", zh: "这条裙子是蓝色的。", en: "The skirt is blue." }
      },
      {
        id: "zapatos",
        es: "los zapatos",
        zh: "鞋",
        en: "shoes",
        emoji: "👞",
        note: "单数 el zapato = 一只鞋。z 在西班牙读咬舌音（舌尖轻轻放在上下门牙之间，往外送气，近似“丝”但舌头要伸出来），拉美读 s。",
        example: { es: "Los zapatos son nuevos.", zh: "这双鞋是新的。", en: "The shoes are new." }
      },
      {
        id: "chaqueta",
        es: "la chaqueta",
        zh: "夹克；短外套",
        en: "jacket",
        emoji: "🧥",
        note: "qu 读 k。拉美有些地方说 la chamarra（墨西哥）或 la campera（阿根廷）。",
        example: { es: "La chaqueta es barata.", zh: "这件夹克很便宜。", en: "The jacket is cheap." }
      },
      {
        id: "abrigo",
        es: "el abrigo",
        zh: "大衣",
        en: "coat",
        note: "冬天穿的厚外套。",
        example: { es: "Necesito un abrigo.", zh: "我需要一件大衣。", en: "I need a coat." }
      }
    ]
  },
  {
    id: "body",
    titleZh: "身体部位",
    titleEn: "Body Parts",
    words: [
      {
        id: "cabeza",
        es: "la cabeza",
        zh: "头",
        en: "head",
        note: "me duele… = 我……疼，看病时非常有用。doler 和 gustar 一样，疼的部位是主语；部位是复数时用 duelen：Me duelen los pies。部位前面用 el / la，不用 mi。",
        example: { es: "Me duele la cabeza.", zh: "我头疼。", en: "I have a headache." }
      },
      {
        id: "ojo",
        es: "el ojo",
        zh: "眼睛",
        en: "eye",
        emoji: "👁️",
        note: "复数 los ojos。j 读音近似汉语 h（只是近似）。",
        example: { es: "Tengo los ojos marrones.", zh: "我的眼睛是棕色的。", en: "I have brown eyes." }
      },
      {
        id: "boca",
        es: "la boca",
        zh: "嘴",
        en: "mouth",
        emoji: "👄",
        note: "",
        example: { es: "La boca y los ojos.", zh: "嘴和眼睛。", en: "The mouth and the eyes." }
      },
      {
        id: "nariz",
        es: "la nariz",
        zh: "鼻子",
        en: "nose",
        emoji: "👃",
        note: "复数 las narices。z 在西班牙读咬舌音（舌尖轻轻放在上下门牙之间，往外送气，近似“丝”但舌头要伸出来），拉美读 s。",
        example: { es: "Tengo la nariz roja.", zh: "我的鼻子红了。", en: "My nose is red." }
      },
      {
        id: "oreja",
        es: "la oreja",
        zh: "耳朵",
        en: "ear",
        emoji: "👂",
        note: "指外面看得见的耳朵。例句里的 del = de + el（……的）。",
        example: { es: "Las orejas del gato.", zh: "猫的耳朵。", en: "The cat's ears." }
      },
      {
        id: "mano",
        es: "la mano",
        zh: "手",
        en: "hand",
        emoji: "✋",
        note: "以 -o 结尾，却是阴性：la mano。",
        example: { es: "Tengo dos manos.", zh: "我有两只手。", en: "I have two hands." }
      },
      {
        id: "brazo",
        es: "el brazo",
        zh: "胳膊；手臂",
        en: "arm",
        emoji: "💪",
        note: "",
        example: { es: "Me duele el brazo.", zh: "我胳膊疼。", en: "My arm hurts." }
      },
      {
        id: "pierna",
        es: "la pierna",
        zh: "腿",
        en: "leg",
        emoji: "🦵",
        note: "",
        example: { es: "Me duele la pierna.", zh: "我腿疼。", en: "My leg hurts." }
      },
      {
        id: "pie",
        es: "el pie",
        zh: "脚",
        en: "foot",
        emoji: "🦶",
        note: "a pie = 步行、走路。",
        example: { es: "Voy a pie.", zh: "我走路去。", en: "I'm going on foot." }
      }
    ]
  },

  // ===== 阶段 19 新增（只写西语 + 中文）=====
  {
    id: "drinks-meals",
    titleZh: "饮料和三餐",
    words: [
      { id: "zumo", es: "el zumo", zh: "果汁", emoji: "🧃",
        note: "西班牙说 zumo；拉美说 jugo。z 在西班牙读“咬舌音”：舌尖轻放在上下牙之间送气（中文没有这个音；拉美读 s）。",
        example: { es: "Un zumo de naranja, por favor.", zh: "请来一杯橙汁。" } },
      { id: "cerveza", es: "la cerveza", zh: "啤酒", emoji: "🍺",
        note: "ce 和 za 里的 c、z 在西班牙都读咬舌音：cer-VE-za（拉美读 s）。",
        example: { es: "Una cerveza, por favor.", zh: "请来一杯啤酒。" } },
      { id: "vino", es: "el vino", zh: "葡萄酒", emoji: "🍷",
        note: "vino tinto = 红葡萄酒，vino blanco = 白葡萄酒。v 和 b 读音一样。",
        example: { es: "Un vino tinto, por favor.", zh: "请来一杯红葡萄酒。" } },
      { id: "te", es: "el té", zh: "茶", emoji: "🍵",
        note: "带重音的 té 是“茶”；不带重音的 te 是“你（宾语）”，例如 te llamo（我给你打电话）。",
        example: { es: "Un té con leche, por favor.", zh: "请来一杯加奶的茶。" } },
      { id: "refresco", es: "el refresco", zh: "汽水；软饮料",
        note: "指可乐、橙味汽水这一类甜饮料。",
        example: { es: "Quiero un refresco.", zh: "我想要一杯汽水。" } },
      { id: "desayuno", es: "el desayuno", zh: "早饭", emoji: "🥐",
        note: "动词 desayunar = 吃早饭。西班牙的早饭常是咖啡加面包或小甜点。",
        example: { es: "El desayuno es a las ocho.", zh: "早饭八点开始。" } },
      { id: "comida", es: "la comida", zh: "午饭；饭菜", emoji: "🥘",
        note: "在西班牙，la comida 常指午饭（下午两点左右），是一天里最重要的一顿；也可以泛指饭菜、食物。",
        example: { es: "La comida está muy buena.", zh: "饭菜很好吃。" } },
      { id: "cena", es: "la cena", zh: "晚饭", emoji: "🍝",
        note: "西班牙人晚饭吃得很晚，常在晚上九点以后。动词 cenar = 吃晚饭。c 在 e 前读咬舌音（拉美读 s）。",
        example: { es: "La cena es a las nueve.", zh: "晚饭九点吃。" } },
      { id: "sopa", es: "la sopa", zh: "汤", emoji: "🍲",
        note: "",
        example: { es: "La sopa está caliente.", zh: "汤是热的。" } },
      { id: "ensalada", es: "la ensalada", zh: "沙拉", emoji: "🥗",
        note: "",
        example: { es: "Una ensalada sin cebolla.", zh: "一份不放洋葱的沙拉。" } },
      { id: "postre", es: "el postre", zh: "甜点；饭后甜食", emoji: "🍰",
        note: "点菜时说 de postre…（甜点要……）。",
        example: { es: "¿Qué hay de postre?", zh: "甜点有什么？" } },
      { id: "camarero", es: "el camarero", zh: "服务员", emoji: "🤵",
        note: "女服务员是 la camarera。拉美常说 mesero / mesera。",
        example: { es: "El camarero es muy amable.", zh: "服务员很亲切。" } }
    ]
  },
  {
    id: "fruit-veg",
    titleZh: "水果和蔬菜",
    words: [
      { id: "platano", es: "el plátano", zh: "香蕉", emoji: "🍌",
        note: "重音在 plá：PLÁ-ta-no。拉美很多地方说 banana。",
        example: { es: "Me gusta el plátano.", zh: "我喜欢香蕉。" } },
      { id: "fresa", es: "la fresa", zh: "草莓", emoji: "🍓",
        note: "阿根廷等地说 frutilla。",
        example: { es: "Las fresas son rojas.", zh: "草莓是红色的。" } },
      { id: "pera", es: "la pera", zh: "梨", emoji: "🍐",
        note: "中间的 r 轻轻弹一下舌头：PE-ra。",
        example: { es: "Quiero una pera.", zh: "我想要一个梨。" } },
      { id: "limon", es: "el limón", zh: "柠檬", emoji: "🍋",
        note: "重音在 ó：li-MÓN。复数 limones（不再写重音符号）。",
        example: { es: "Agua con limón, por favor.", zh: "请来一杯加柠檬的水。" } },
      { id: "sandia", es: "la sandía", zh: "西瓜", emoji: "🍉",
        note: "重音在 í：san-DÍ-a。",
        example: { es: "La sandía es muy grande.", zh: "西瓜很大。" } },
      { id: "melocoton", es: "el melocotón", zh: "桃子", emoji: "🍑",
        note: "西班牙说 melocotón；拉美说 durazno。重音在最后的 ó。",
        example: { es: "El melocotón es muy dulce.", zh: "桃子很甜。" } },
      { id: "tomate", es: "el tomate", zh: "西红柿", emoji: "🍅",
        note: "",
        example: { es: "Una ensalada de tomate.", zh: "一份西红柿沙拉。" } },
      { id: "patata", es: "la patata", zh: "土豆", emoji: "🥔",
        note: "西班牙说 patata；拉美说 papa。patatas fritas = 炸薯条（也指薯片）。",
        example: { es: "Me gustan las patatas fritas.", zh: "我喜欢炸薯条。" } },
      { id: "zanahoria", es: "la zanahoria", zh: "胡萝卜", emoji: "🥕",
        note: "h 不发音：za-na-O-ria；z 读咬舌音（拉美读 s）。",
        example: { es: "El conejo come zanahorias.", zh: "兔子吃胡萝卜。" } },
      { id: "cebolla", es: "la cebolla", zh: "洋葱", emoji: "🧅",
        note: "ll 读音近似 y：ce-BO-ya（只是近似）；c 在 e 前读咬舌音。",
        example: { es: "No me gusta la cebolla.", zh: "我不喜欢洋葱。" } },
      { id: "lechuga", es: "la lechuga", zh: "生菜", emoji: "🥬",
        note: "ch 读音近似汉语“吃”的声母（只是近似）：le-CHU-ga。",
        example: { es: "La lechuga es verde.", zh: "生菜是绿色的。" } },
      { id: "verduras", es: "las verduras", zh: "蔬菜", emoji: "🥦",
        note: "一般用复数。单数是 la verdura。",
        example: { es: "Como verduras todos los días.", zh: "我每天都吃蔬菜。" } }
    ]
  },
  {
    id: "adjectives-2",
    titleZh: "常用形容词 2",
    words: [
      { id: "caliente", es: "caliente", zh: "热的；烫的", emoji: "♨️",
        note: "说东西热、烫：el café está caliente。说天气热用 hace calor，说人觉得热用 tengo calor。阴阳性一样。",
        example: { es: "El café está caliente.", zh: "咖啡是热的。" } },
      { id: "frio", es: "frío", zh: "冷的；凉的", emoji: "🧊",
        note: "阴性 fría。说天气冷用 hace frío；说人觉得冷用 tengo frío。重音在 í：FRÍ-o。",
        example: { es: "La cerveza está fría.", zh: "啤酒是冰的。" } },
      { id: "alto", es: "alto", zh: "高的",
        note: "阴性 alta。说人个子高、楼高都用它。",
        example: { es: "Mi hermano es muy alto.", zh: "我的兄弟个子很高。" } },
      { id: "bajo", es: "bajo", zh: "矮的；低的",
        note: "阴性 baja。j 读音近似汉语的 h（只是近似）：BA-ho。",
        example: { es: "Mi abuela es baja.", zh: "我奶奶个子矮。" } },
      { id: "largo", es: "largo", zh: "长的", emoji: "📏",
        note: "阴性 larga。注意：largo 是“长”，不是“大”（大是 grande）。",
        example: { es: "El río es muy largo.", zh: "这条河很长。" } },
      { id: "corto", es: "corto", zh: "短的",
        note: "阴性 corta。",
        example: { es: "La falda es corta.", zh: "这条裙子很短。" } },
      { id: "rapido", es: "rápido", zh: "快的", emoji: "🚀",
        note: "重音在 rá：RÁ-pi-do。阴性 rápida。单说 ¡Rápido! = 快点！",
        example: { es: "El avión es muy rápido.", zh: "飞机很快。" } },
      { id: "lento", es: "lento", zh: "慢的", emoji: "🐌",
        note: "阴性 lenta。说“慢慢地（做）”用 despacio。",
        example: { es: "El autobús es lento.", zh: "公交车很慢。" } },
      { id: "facil", es: "fácil", zh: "容易的；简单的",
        note: "重音在 fá：FÁ-cil。阴阳性一样。",
        example: { es: "El español es fácil.", zh: "西班牙语很容易。" } },
      { id: "dificil", es: "difícil", zh: "难的",
        note: "重音在 fí：di-FÍ-cil。阴阳性一样。",
        example: { es: "El examen es difícil.", zh: "考试很难。" } },
      { id: "limpio", es: "limpio", zh: "干净的", emoji: "✨",
        note: "阴性 limpia。",
        example: { es: "La habitación está limpia.", zh: "房间很干净。" } },
      { id: "sucio", es: "sucio", zh: "脏的",
        note: "阴性 sucia。c 在 i 前读咬舌音（拉美读 s）。",
        example: { es: "La mesa está sucia.", zh: "桌子很脏。" } }
    ]
  },
  {
    id: "market-money",
    titleZh: "超市和钱",
    words: [
      { id: "dinero", es: "el dinero", zh: "钱", emoji: "💵",
        note: "",
        example: { es: "No tengo dinero.", zh: "我没有钱。" } },
      { id: "euro", es: "el euro", zh: "欧元", emoji: "💶",
        note: "复数 euros。价格这样读：3,50 € = tres euros con cincuenta（三欧元五十分）。eu 两个元音连着快读。",
        example: { es: "Son tres euros.", zh: "一共三欧元。" } },
      { id: "precio", es: "el precio", zh: "价格；价钱",
        note: "c 在 i 前读咬舌音（拉美读 s）。",
        example: { es: "El precio es muy bueno.", zh: "价格很划算。" } },
      { id: "caja", es: "la caja", zh: "收银台；盒子",
        note: "在超市，la caja 是付钱的地方。j 读音近似汉语的 h（只是近似）：CA-ha。",
        example: { es: "Pague en la caja, por favor.", zh: "请在收银台付款。" } },
      { id: "bolsa", es: "la bolsa", zh: "袋子", emoji: "🛍️",
        note: "西班牙的超市袋子一般要另外付钱。",
        example: { es: "Una bolsa, por favor.", zh: "请给我一个袋子。" } },
      { id: "tarjeta", es: "la tarjeta", zh: "卡；银行卡", emoji: "💳",
        note: "pagar con tarjeta = 刷卡付款。j 读音近似汉语的 h（只是近似）。",
        example: { es: "Pago con tarjeta.", zh: "我刷卡付款。" } },
      { id: "efectivo", es: "el efectivo", zh: "现金",
        note: "en efectivo = 用现金。",
        example: { es: "¿Paga en efectivo?", zh: "您付现金吗？" } },
      { id: "cambio", es: "el cambio", zh: "零钱；找的钱", emoji: "🪙",
        note: "也有“变化、兑换”的意思。",
        example: { es: "No tengo cambio.", zh: "我没有零钱。" } },
      { id: "botella", es: "la botella", zh: "瓶子", emoji: "🍾",
        note: "ll 读音近似 y：bo-TE-ya（只是近似）。",
        example: { es: "Una botella de agua, por favor.", zh: "请给我一瓶水。" } },
      { id: "huevo", es: "el huevo", zh: "鸡蛋", emoji: "🥚",
        note: "h 不发音，hue 读音近似“维”（只是近似）：HUE-vo。",
        example: { es: "Una docena de huevos.", zh: "一打鸡蛋（十二个）。" } },
      { id: "queso", es: "el queso", zh: "奶酪", emoji: "🧀",
        note: "qu 读 k：KE-so。",
        example: { es: "Me gusta mucho el queso.", zh: "我很喜欢奶酪。" } },
      { id: "jamon", es: "el jamón", zh: "火腿", emoji: "🍖",
        note: "j 读音近似汉语的 h（只是近似）：ha-MÓN。jamón serrano、jamón ibérico 是西班牙特产。",
        example: { es: "Un bocadillo de jamón.", zh: "一个火腿三明治。" } }
    ]
  },
  {
    id: "house",
    titleZh: "房子和家具",
    words: [
      { id: "piso", es: "el piso", zh: "公寓；楼层", emoji: "🏢",
        note: "在西班牙，piso 指一套公寓房，也指楼层（el tercer piso = 四楼，西班牙一楼叫 planta baja）。拉美常说 apartamento / departamento。",
        example: { es: "Vivo en un piso pequeño.", zh: "我住在一套小公寓里。" } },
      { id: "cocina", es: "la cocina", zh: "厨房", emoji: "🍳",
        note: "也指“菜系”：la cocina española = 西班牙菜。",
        example: { es: "Mamá está en la cocina.", zh: "妈妈在厨房。" } },
      { id: "dormitorio", es: "el dormitorio", zh: "卧室",
        note: "也常说 la habitación。",
        example: { es: "Mi dormitorio es pequeño.", zh: "我的卧室很小。" } },
      { id: "salon", es: "el salón", zh: "客厅",
        note: "重音在 ó：sa-LÓN。拉美常说 la sala。",
        example: { es: "La tele está en el salón.", zh: "电视在客厅。" } },
      { id: "cama", es: "la cama", zh: "床", emoji: "🛏️",
        note: "",
        example: { es: "La cama es muy grande.", zh: "床很大。" } },
      { id: "sofa", es: "el sofá", zh: "沙发", emoji: "🛋️",
        note: "重音在 á：so-FÁ。",
        example: { es: "El gato duerme en el sofá.", zh: "猫在沙发上睡觉。" } },
      { id: "mesa", es: "la mesa", zh: "桌子",
        note: "在餐厅里也指“桌位”：una mesa para dos = 一张两人桌。",
        example: { es: "Las llaves están en la mesa.", zh: "钥匙在桌子上。" } },
      { id: "silla", es: "la silla", zh: "椅子", emoji: "🪑",
        note: "ll 读音近似 y：SI-ya（只是近似）。",
        example: { es: "Hay cuatro sillas.", zh: "有四把椅子。" } },
      { id: "puerta", es: "la puerta", zh: "门", emoji: "🚪",
        note: "",
        example: { es: "Cierra la puerta, por favor.", zh: "请关上门。" } },
      { id: "ventana", es: "la ventana", zh: "窗户", emoji: "🪟",
        note: "",
        example: { es: "La ventana está abierta.", zh: "窗户开着。" } },
      { id: "llave", es: "la llave", zh: "钥匙", emoji: "🔑",
        note: "ll 读音近似 y：YA-ve（只是近似）。复数 llaves。",
        example: { es: "¿Dónde está la llave?", zh: "钥匙在哪儿？" } },
      { id: "nevera", es: "la nevera", zh: "冰箱",
        note: "西班牙也说 el frigorífico；拉美常说 el refrigerador。",
        example: { es: "La leche está en la nevera.", zh: "牛奶在冰箱里。" } }
    ]
  },
  {
    id: "question-words",
    titleZh: "疑问词和常用小词",
    words: [
      { id: "q-que", es: "¿qué?", zh: "什么",
        note: "疑问词都带重音：qué。问句开头要加倒问号 ¿。qu 读 k。",
        example: { es: "¿Qué es esto?", zh: "这是什么？" } },
      { id: "q-quien", es: "¿quién?", zh: "谁",
        note: "qu 读 k：KIÉN。问好几个人用 ¿quiénes?",
        example: { es: "¿Quién es ella?", zh: "她是谁？" } },
      { id: "q-donde", es: "¿dónde?", zh: "哪里；在哪儿",
        note: "重音在 dón。",
        example: { es: "¿Dónde está el metro?", zh: "地铁站在哪儿？" } },
      { id: "q-cuando", es: "¿cuándo?", zh: "什么时候",
        note: "重音在 cuán。",
        example: { es: "¿Cuándo es el examen?", zh: "考试是什么时候？" } },
      { id: "q-como", es: "¿cómo?", zh: "怎么；怎样",
        note: "没听清的时候，单说一句 ¿Cómo? 就是“什么？您说什么？”。",
        example: { es: "¿Cómo se llama tu perro?", zh: "你的狗叫什么名字？" } },
      { id: "q-cuanto", es: "¿cuánto?", zh: "多少",
        note: "跟阴性名词用 cuánta，复数是 cuántos / cuántas。",
        example: { es: "¿Cuánto cuesta el pan?", zh: "面包多少钱？" } },
      { id: "q-por-que", es: "¿por qué?", zh: "为什么",
        note: "问“为什么”是分开写、带重音的 por qué；回答“因为”是连在一起、不带重音的 porque。",
        example: { es: "¿Por qué no comes?", zh: "你为什么不吃？" } },
      { id: "tambien", es: "también", zh: "也",
        note: "重音在 bién：tam-BIÉN。",
        example: { es: "Yo también quiero café.", zh: "我也想要咖啡。" } },
      { id: "siempre", es: "siempre", zh: "总是；一直",
        note: "",
        example: { es: "Siempre como a las dos.", zh: "我总是两点吃午饭。" } },
      { id: "nunca", es: "nunca", zh: "从来不",
        note: "放在动词前面：nunca bebo = 我从来不喝。",
        example: { es: "Nunca bebo café.", zh: "我从来不喝咖啡。" } },
      { id: "aqui", es: "aquí", zh: "这里",
        note: "重音在 í；qu 读 k：a-KÍ。",
        example: { es: "El baño está aquí.", zh: "洗手间在这里。" } },
      { id: "alli", es: "allí", zh: "那里",
        note: "ll 读音近似 y：a-YÍ（只是近似）。",
        example: { es: "Mi casa está allí.", zh: "我家在那里。" } }
    ]
  },
  {
    id: "school",
    titleZh: "学校和文具",
    words: [
      { id: "clase", es: "la clase", zh: "课；班级",
        note: "la clase de español = 西班牙语课。",
        example: { es: "La clase empieza a las nueve.", zh: "课九点开始。" } },
      { id: "profesor", es: "el profesor", zh: "男老师", emoji: "👨‍🏫",
        note: "叫老师时可以直接说 profesor。在西班牙，学生常用 tú 和老师说话。",
        example: { es: "El profesor es muy simpático.", zh: "老师人很好。" } },
      { id: "profesora", es: "la profesora", zh: "女老师", emoji: "👩‍🏫",
        note: "",
        example: { es: "La profesora habla despacio.", zh: "老师说得很慢。" } },
      { id: "libro", es: "el libro", zh: "书", emoji: "📖",
        note: "",
        example: { es: "Abre el libro, por favor.", zh: "请打开书。" } },
      { id: "cuaderno", es: "el cuaderno", zh: "本子；练习本", emoji: "📓",
        note: "",
        example: { es: "Mi cuaderno es azul.", zh: "我的本子是蓝色的。" } },
      { id: "boligrafo", es: "el bolígrafo", zh: "圆珠笔", emoji: "🖊️",
        note: "重音在 lí：bo-LÍ-gra-fo。口语常说 el boli。拉美有的地方说 la pluma、el lapicero。",
        example: { es: "¿Tienes un bolígrafo?", zh: "你有圆珠笔吗？" } },
      { id: "lapiz", es: "el lápiz", zh: "铅笔", emoji: "✏️",
        note: "重音在 lá：LÁ-piz。复数 lápices（z 变成 c）。",
        example: { es: "Escribo con lápiz.", zh: "我用铅笔写。" } },
      { id: "mochila", es: "la mochila", zh: "书包；背包", emoji: "🎒",
        note: "ch 读音近似汉语“吃”的声母（只是近似）：mo-CHI-la。",
        example: { es: "Mi mochila es negra.", zh: "我的书包是黑色的。" } },
      { id: "pizarra", es: "la pizarra", zh: "黑板",
        note: "rr 要多弹几下舌头：pi-ZA-rra。拉美常说 el pizarrón。",
        example: { es: "Mira la pizarra.", zh: "看黑板。" } },
      { id: "ordenador", es: "el ordenador", zh: "电脑", emoji: "💻",
        note: "西班牙说 el ordenador；拉美说 la computadora。",
        example: { es: "Trabajo con el ordenador.", zh: "我用电脑工作。" } },
      { id: "examen", es: "el examen", zh: "考试", emoji: "📝",
        note: "x 读 ks：ek-SA-men。复数 exámenes 要加重音符号。",
        example: { es: "Mañana tengo un examen.", zh: "我明天有一场考试。" } },
      { id: "deberes", es: "los deberes", zh: "作业",
        note: "西班牙说 los deberes（一般用复数）；拉美说 la tarea。",
        example: { es: "Hoy no tengo deberes.", zh: "我今天没有作业。" } }
    ]
  },
  {
    id: "verbs-2",
    titleZh: "常用动词 2",
    words: [
      { id: "ser", es: "ser", zh: "是",
        note: "不规则：soy, eres, es, somos, sois, son。说身份、国籍、特点（见语法课 ser）。",
        example: { es: "Soy de China.", zh: "我来自中国。" } },
      { id: "estar", es: "estar", zh: "在；处于（某种状态）",
        note: "不规则：estoy, estás, está, estamos, estáis, están。说位置和暂时的状态（见语法课 estar）。",
        example: { es: "Estoy en casa.", zh: "我在家。" } },
      { id: "hacer", es: "hacer", zh: "做；干",
        note: "不规则：hago, haces, hace… h 不发音。说天气也用它：hace calor。",
        example: { es: "¿Qué haces hoy?", zh: "你今天做什么？" } },
      { id: "poder", es: "poder", zh: "能；可以",
        note: "不规则：puedo, puedes, puede… ¿Puedo…? = 我可以……吗？",
        example: { es: "Hoy no puedo ir.", zh: "我今天去不了。" } },
      { id: "ver", es: "ver", zh: "看见；看", emoji: "👀",
        note: "veo, ves, ve… ver la tele = 看电视。",
        example: { es: "Veo la tele en el salón.", zh: "我在客厅看电视。" } },
      { id: "escuchar", es: "escuchar", zh: "听", emoji: "🎧",
        note: "规则 -ar 动词：escucho, escuchas… ch 读音近似汉语“吃”的声母（只是近似）。",
        example: { es: "Escucho música en casa.", zh: "我在家听音乐。" } },
      { id: "leer", es: "leer", zh: "读；看（书）", emoji: "📚",
        note: "两个 e 都要读出来：le-ER。leo, lees, lee…",
        example: { es: "Leo un libro.", zh: "我在看一本书。" } },
      { id: "escribir", es: "escribir", zh: "写", emoji: "✍️",
        note: "规则 -ir 动词：escribo, escribes, escribe…",
        example: { es: "Escribo en el cuaderno.", zh: "我在本子上写字。" } },
      { id: "estudiar", es: "estudiar", zh: "学习",
        note: "规则 -ar 动词：estudio, estudias, estudia…",
        example: { es: "Estudio español en Madrid.", zh: "我在马德里学西班牙语。" } },
      { id: "comprar", es: "comprar", zh: "买",
        note: "规则 -ar 动词：compro, compras, compra…",
        example: { es: "Compro pan y leche.", zh: "我买面包和牛奶。" } },
      { id: "dormir", es: "dormir", zh: "睡觉", emoji: "😴",
        note: "不规则：duermo, duermes, duerme…",
        example: { es: "Duermo ocho horas.", zh: "我睡八个小时。" } },
      { id: "nadar", es: "nadar", zh: "游泳", emoji: "🏊",
        note: "规则 -ar 动词：nado, nadas, nada…",
        example: { es: "Nado en el mar.", zh: "我在海里游泳。" } }
    ]
  },
  {
    id: "months",
    titleZh: "十二个月",
    words: [
      { id: "enero", es: "enero", zh: "一月",
        note: "西语的月份都用小写字母开头。",
        example: { es: "En enero hace frío.", zh: "一月天气冷。" } },
      { id: "febrero", es: "febrero", zh: "二月",
        note: "br 连读，r 轻弹：fe-BRE-ro。",
        example: { es: "Mi cumpleaños es en febrero.", zh: "我的生日在二月。" } },
      { id: "marzo", es: "marzo", zh: "三月",
        note: "z 读咬舌音（拉美读 s）。",
        example: { es: "En marzo llueve mucho.", zh: "三月常常下雨。" } },
      { id: "abril", es: "abril", zh: "四月",
        note: "",
        example: { es: "Hoy es el uno de abril.", zh: "今天是四月一日。" } },
      { id: "mayo", es: "mayo", zh: "五月",
        note: "",
        example: { es: "En mayo hay muchas flores.", zh: "五月有很多花。" } },
      { id: "junio", es: "junio", zh: "六月",
        note: "j 读音近似汉语的 h（只是近似）：HU-nio。",
        example: { es: "El curso termina en junio.", zh: "学年六月结束。" } },
      { id: "julio", es: "julio", zh: "七月",
        note: "j 读音近似汉语的 h（只是近似）：HU-lio。别和 junio 弄混。",
        example: { es: "En julio hace mucho calor.", zh: "七月很热。" } },
      { id: "agosto", es: "agosto", zh: "八月",
        note: "西班牙人很多在八月放暑假、去海边。",
        example: { es: "En agosto voy a la playa.", zh: "八月我去海边。" } },
      { id: "septiembre", es: "septiembre", zh: "九月",
        note: "也可以写 setiembre，但 septiembre 最常用。",
        example: { es: "Las clases empiezan en septiembre.", zh: "九月开学。" } },
      { id: "octubre", es: "octubre", zh: "十月",
        note: "",
        example: { es: "En octubre hace fresco.", zh: "十月天气凉快。" } },
      { id: "noviembre", es: "noviembre", zh: "十一月",
        note: "",
        example: { es: "Noviembre tiene treinta días.", zh: "十一月有三十天。" } },
      { id: "diciembre", es: "diciembre", zh: "十二月",
        note: "c 在 i 前读咬舌音（拉美读 s）：di-CIEM-bre。",
        example: { es: "La Navidad es en diciembre.", zh: "圣诞节在十二月。" } }
    ]
  },
  {
    id: "beach-nature",
    titleZh: "海滩和大自然",
    words: [
      { id: "playa", es: "la playa", zh: "海滩", emoji: "🏝️",
        note: "y 读音近似汉语的 y（只是近似）：PLA-ya。",
        example: { es: "La playa está cerca.", zh: "海滩很近。" } },
      { id: "mar", es: "el mar", zh: "大海", emoji: "🌊",
        note: "一般用阳性 el mar。",
        example: { es: "El mar es azul.", zh: "大海是蓝色的。" } },
      { id: "arena", es: "la arena", zh: "沙子",
        note: "",
        example: { es: "La arena está caliente.", zh: "沙子很烫。" } },
      { id: "sol", es: "el sol", zh: "太阳", emoji: "🌞",
        note: "tomar el sol = 晒太阳。",
        example: { es: "Me gusta tomar el sol.", zh: "我喜欢晒太阳。" } },
      { id: "montana", es: "la montaña", zh: "山", emoji: "⛰️",
        note: "ña 读音近似“尼亚”连起来快读（只是近似）：mon-TA-ña。",
        example: { es: "La montaña es muy alta.", zh: "这座山很高。" } },
      { id: "rio", es: "el río", zh: "河", emoji: "🏞️",
        note: "重音在 í：RÍ-o；开头的 r 要多弹几下舌头。",
        example: { es: "El río está lejos.", zh: "那条河很远。" } },
      { id: "arbol", es: "el árbol", zh: "树", emoji: "🌳",
        note: "重音在 á：ÁR-bol。",
        example: { es: "Hay un árbol grande.", zh: "有一棵大树。" } },
      { id: "flor", es: "la flor", zh: "花", emoji: "🌺",
        note: "复数 flores。",
        example: { es: "Las flores son bonitas.", zh: "花很漂亮。" } },
      { id: "nube", es: "la nube", zh: "云", emoji: "☁️",
        note: "",
        example: { es: "Hoy hay muchas nubes.", zh: "今天云很多。" } },
      { id: "piscina", es: "la piscina", zh: "游泳池",
        note: "sc 在西班牙读 s + 咬舌音：pis-CI-na（拉美读 pi-SI-na）。墨西哥说 la alberca，阿根廷说 la pileta。",
        example: { es: "La piscina está abierta.", zh: "游泳池开着。" } },
      { id: "toalla", es: "la toalla", zh: "毛巾",
        note: "ll 读音近似 y：to-A-ya（只是近似）。",
        example: { es: "Necesito una toalla.", zh: "我需要一条毛巾。" } },
      { id: "banador", es: "el bañador", zh: "泳衣", emoji: "🩱",
        note: "西班牙说 el bañador；拉美常说 el traje de baño。ña 读音近似“尼亚”连读（只是近似）。",
        example: { es: "¿Dónde está mi bañador?", zh: "我的泳衣在哪儿？" } }
    ]
  },
  {
    id: "transport",
    titleZh: "交通工具",
    words: [
      { id: "coche", es: "el coche", zh: "汽车", emoji: "🚗",
        note: "西班牙说 el coche；拉美说 el carro 或 el auto。",
        example: { es: "Voy en coche.", zh: "我坐车去。" } },
      { id: "moto", es: "la moto", zh: "摩托车", emoji: "🏍️",
        note: "是 la motocicleta 的简称，所以是阴性 la moto。",
        example: { es: "Mi hermano tiene una moto.", zh: "我的兄弟有一辆摩托车。" } },
      { id: "bicicleta", es: "la bicicleta", zh: "自行车", emoji: "🚲",
        note: "口语常说 la bici。",
        example: { es: "Voy a la escuela en bicicleta.", zh: "我骑自行车去学校。" } },
      { id: "metro", es: "el metro", zh: "地铁", emoji: "🚇",
        note: "",
        example: { es: "Voy al trabajo en metro.", zh: "我坐地铁去上班。" } },
      { id: "avion", es: "el avión", zh: "飞机", emoji: "✈️",
        note: "重音在 ó：a-VIÓN。",
        example: { es: "El avión sale a las diez.", zh: "飞机十点起飞。" } },
      { id: "barco", es: "el barco", zh: "船", emoji: "🚢",
        note: "",
        example: { es: "Vamos a la isla en barco.", zh: "我们坐船去岛上。" } },
      { id: "tren", es: "el tren", zh: "火车", emoji: "🚆",
        note: "tr 连读，r 轻弹一下舌头。",
        example: { es: "El tren llega a las cinco.", zh: "火车五点到。" } },
      { id: "autobus", es: "el autobús", zh: "公交车；大巴", emoji: "🚌",
        note: "重音在 ú：au-to-BÚS。口语也说 el bus。拉美各地说法很多，例如墨西哥说 camión，阿根廷说 colectivo。",
        example: { es: "Espero el autobús.", zh: "我在等公交车。" } },
      { id: "taxi", es: "el taxi", zh: "出租车", emoji: "🚕",
        note: "x 读 ks：TAK-si。",
        example: { es: "Voy al hotel en taxi.", zh: "我坐出租车去酒店。" } },
      { id: "billete", es: "el billete", zh: "车票；机票", emoji: "🎫",
        note: "西班牙说 el billete；拉美常说 el boleto。billete 也指“纸币”。ll 读音近似 y。",
        example: { es: "Ya tengo el billete.", zh: "我已经买好票了。" } },
      { id: "maleta", es: "la maleta", zh: "行李箱", emoji: "🧳",
        note: "",
        example: { es: "Mi maleta es roja.", zh: "我的行李箱是红色的。" } },
      { id: "aeropuerto", es: "el aeropuerto", zh: "机场", emoji: "🛫",
        note: "a 和 e 都要读出来：a-e-ro-PUER-to。",
        example: { es: "Voy al aeropuerto.", zh: "我去机场。" } }
    ]
  },
  {
    id: "feelings",
    titleZh: "心情和感受",
    words: [
      { id: "feliz", es: "feliz", zh: "开心的；幸福的", emoji: "😄",
        note: "阴阳性一样；复数 felices（z 变成 c）。",
        example: { es: "Hoy estoy muy feliz.", zh: "我今天很开心。" } },
      { id: "contento", es: "contento", zh: "开心的；高兴的", emoji: "😊",
        note: "阴性 contenta。常和 estar 一起用：estoy contento / contenta。",
        example: { es: "Mi madre está contenta.", zh: "我妈妈很高兴。" } },
      { id: "triste", es: "triste", zh: "难过的；伤心的", emoji: "😢",
        note: "阴阳性一样。",
        example: { es: "Hoy estoy un poco triste.", zh: "我今天有点难过。" } },
      { id: "cansado", es: "cansado", zh: "累的", emoji: "🥱",
        note: "阴性 cansada。",
        example: { es: "Después del trabajo estoy cansado.", zh: "下班以后我很累。" } },
      { id: "nervioso", es: "nervioso", zh: "紧张的", emoji: "😬",
        note: "阴性 nerviosa。意思就是“紧张、不安”。",
        example: { es: "Estoy nervioso por el examen.", zh: "因为考试，我很紧张。" } },
      { id: "enfadado", es: "enfadado", zh: "生气的", emoji: "😠",
        note: "阴性 enfadada。西班牙说 enfadado；拉美常说 enojado。",
        example: { es: "Mi padre está enfadado.", zh: "我爸爸生气了。" } },
      { id: "aburrido", es: "aburrido", zh: "无聊的", emoji: "😑",
        note: "阴性 aburrida。estar aburrido = 觉得无聊；ser aburrido = （人或事）很无聊。rr 要多弹几下舌头。",
        example: { es: "Esta película es aburrida.", zh: "这部电影很无聊。" } },
      { id: "tranquilo", es: "tranquilo", zh: "平静的；安心的", emoji: "😌",
        note: "阴性 tranquila。¡Tranquilo! / ¡Tranquila! = 别着急！别担心！",
        example: { es: "¡Tranquilo, no pasa nada!", zh: "别担心，没事的！" } },
      { id: "preocupado", es: "preocupado", zh: "担心的", emoji: "😟",
        note: "阴性 preocupada。",
        example: { es: "Estoy preocupado por mi perro.", zh: "我担心我的狗。" } },
      { id: "ocupado", es: "ocupado", zh: "忙的；（座位）有人的",
        note: "阴性 ocupada。¿Está ocupado? 也可以用来问“这个座位有人吗？”",
        example: { es: "Hoy estoy muy ocupado.", zh: "我今天很忙。" } },
      { id: "enfermo", es: "enfermo", zh: "生病的", emoji: "🤒",
        note: "阴性 enferma。",
        example: { es: "Mi hija está enferma.", zh: "我女儿病了。" } },
      { id: "sorprendido", es: "sorprendido", zh: "吃惊的", emoji: "😮",
        note: "阴性 sorprendida。",
        example: { es: "¡Estoy muy sorprendido!", zh: "我太吃惊了！" } }
    ]
  }
];
