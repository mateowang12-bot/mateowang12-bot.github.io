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
        note: "h 不发音。复数 los hermanos 也可以指“兄弟姐妹”。",
        example: { es: "Es mi hermano.", zh: "这是我的哥哥（弟弟）。", en: "This is my brother." }
      },
      {
        id: "hermana",
        es: "la hermana",
        zh: "姐妹（姐姐/妹妹）",
        en: "sister",
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
        note: "阴性：cara。",
        example: { es: "El hotel es caro.", zh: "这家酒店很贵。", en: "The hotel is expensive." }
      },
      {
        id: "barato",
        es: "barato",
        zh: "便宜；便宜的",
        en: "cheap",
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
  }
];
