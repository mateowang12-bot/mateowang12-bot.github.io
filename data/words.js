// 单词卡片 —— 由 content-writer 编写
// 数据变量：window.WORD_LESSONS（课程数组，从简到难排列）
// 每课字段：id, titleZh, titleEn, words
// 每个词字段：id（全站唯一）, es, zh, en, note, example { es, zh, en }
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
        note: "h 不发音，读作 ola。",
        example: { es: "¡Hola! ¿Qué tal?", zh: "你好！怎么样？", en: "Hi! How's it going?" }
      },
      {
        id: "buenos-dias",
        es: "buenos días",
        zh: "早上好；上午好",
        en: "good morning",
        note: "在西班牙一般用到吃午饭前（约下午两点）。",
        example: { es: "¡Hola, buenos días!", zh: "你好，早上好！", en: "Hello, good morning!" }
      },
      {
        id: "buenas-tardes",
        es: "buenas tardes",
        zh: "下午好",
        en: "good afternoon",
        note: "从午饭后用到天黑。",
        example: { es: "¡Buenas tardes! ¿Qué tal?", zh: "下午好！怎么样？", en: "Good afternoon! How's it going?" }
      },
      {
        id: "buenas-noches",
        es: "buenas noches",
        zh: "晚上好；晚安",
        en: "good evening / good night",
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
        note: "带重音的 sí 是“是”；不带重音的 si 是“如果”。",
        example: { es: "Sí, gracias.", zh: "好的，谢谢。", en: "Yes, thank you." }
      },
      {
        id: "no",
        es: "no",
        zh: "不；不是",
        en: "no",
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
        note: "muchas gracias = 非常感谢。ci 里的 c 在西班牙读得像英语 th，拉美读 s。",
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
        note: "在西班牙 ce 的 c 读得像英语 th，拉美读 s。",
        example: { es: "Cero, uno, dos.", zh: "零、一、二。", en: "Zero, one, two." }
      },
      {
        id: "uno",
        es: "uno",
        zh: "一",
        en: "one",
        note: "放在阳性名词前变 un，放在阴性名词前变 una。",
        example: { es: "Uno, por favor.", zh: "请给我一个。", en: "One, please." }
      },
      {
        id: "dos",
        es: "dos",
        zh: "二",
        en: "two",
        note: "",
        example: { es: "Dos, por favor.", zh: "请给我两个。", en: "Two, please." }
      },
      {
        id: "tres",
        es: "tres",
        zh: "三",
        en: "three",
        note: "r 要轻轻弹一下舌头。",
        example: { es: "Uno, dos, tres.", zh: "一、二、三。", en: "One, two, three." }
      },
      {
        id: "cuatro",
        es: "cuatro",
        zh: "四",
        en: "four",
        note: "",
        example: { es: "Dos y dos son cuatro.", zh: "二加二等于四。", en: "Two and two make four." }
      },
      {
        id: "cinco",
        es: "cinco",
        zh: "五",
        en: "five",
        note: "在西班牙 ci 的 c 读得像英语 th，拉美读 s。",
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
        note: "",
        example: { es: "Cinco, seis, siete.", zh: "五、六、七。", en: "Five, six, seven." }
      },
      {
        id: "siete",
        es: "siete",
        zh: "七",
        en: "seven",
        note: "",
        example: { es: "Tres y cuatro son siete.", zh: "三加四等于七。", en: "Three and four make seven." }
      },
      {
        id: "ocho",
        es: "ocho",
        zh: "八",
        en: "eight",
        note: "ch 读音近似英语 church 的 ch（只是近似）。",
        example: { es: "Seis, siete, ocho.", zh: "六、七、八。", en: "Six, seven, eight." }
      },
      {
        id: "nueve",
        es: "nueve",
        zh: "九",
        en: "nine",
        note: "",
        example: { es: "Cinco y cuatro son nueve.", zh: "五加四等于九。", en: "Five and four make nine." }
      },
      {
        id: "diez",
        es: "diez",
        zh: "十",
        en: "ten",
        note: "在西班牙 z 读得像英语 th，拉美读 s。",
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
        note: "阳性形式；修饰阴性名词变 roja。例句里的 es = “是”。",
        example: { es: "El tomate es rojo.", zh: "西红柿是红色的。", en: "The tomato is red." }
      },
      {
        id: "amarillo",
        es: "amarillo",
        zh: "黄色（的）",
        en: "yellow",
        note: "阴性：amarilla。ll 在大多数地区读音近似 y。",
        example: { es: "El sol es amarillo.", zh: "太阳是黄色的。", en: "The sun is yellow." }
      },
      {
        id: "azul",
        es: "azul",
        zh: "蓝色（的）",
        en: "blue",
        note: "阴阳性同形（复数 azules）。",
        example: { es: "El mar es azul.", zh: "大海是蓝色的。", en: "The sea is blue." }
      },
      {
        id: "verde",
        es: "verde",
        zh: "绿色（的）",
        en: "green",
        note: "阴阳性同形。",
        example: { es: "La planta es verde.", zh: "这棵植物是绿色的。", en: "The plant is green." }
      },
      {
        id: "blanco",
        es: "blanco",
        zh: "白色（的）",
        en: "white",
        note: "阴性：blanca。",
        example: { es: "El papel es blanco.", zh: "纸是白色的。", en: "The paper is white." }
      },
      {
        id: "negro",
        es: "negro",
        zh: "黑色（的）",
        en: "black",
        note: "阴性：negra。",
        example: { es: "El café es negro.", zh: "咖啡是黑色的。", en: "The coffee is black." }
      },
      {
        id: "gris",
        es: "gris",
        zh: "灰色（的）",
        en: "gray",
        note: "阴阳性同形（复数 grises）。",
        example: { es: "El elefante es gris.", zh: "大象是灰色的。", en: "The elephant is gray." }
      },
      {
        id: "naranja",
        es: "naranja",
        zh: "橙色（的）",
        en: "orange",
        note: "作颜色时一般不变阴阳性。la naranja 也是“橙子”。也可以说 anaranjado。",
        example: { es: "La naranja es naranja.", zh: "橙子是橙色的。", en: "The orange is orange." }
      },
      {
        id: "rosa",
        es: "rosa",
        zh: "粉色（的）",
        en: "pink",
        note: "作颜色时一般不变阴阳性。la rosa 也是“玫瑰”。拉美多说 rosado。",
        example: { es: "La flor es rosa.", zh: "这朵花是粉色的。", en: "The flower is pink." }
      },
      {
        id: "marron",
        es: "marrón",
        zh: "棕色（的）",
        en: "brown",
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
        note: "例句里的 mi = “我的”，es = “是”。",
        example: { es: "Es mi familia.", zh: "这是我的家人。", en: "This is my family." }
      },
      {
        id: "madre",
        es: "la madre",
        zh: "母亲；妈妈",
        en: "mother",
        note: "口语常说 mamá（注意重音在后面）。",
        example: { es: "Es mi madre.", zh: "这是我妈妈。", en: "This is my mother." }
      },
      {
        id: "padre",
        es: "el padre",
        zh: "父亲；爸爸",
        en: "father",
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
        note: "h 不发音，j 读音近似汉语 h（只是近似）。复数 los hijos 也可以指“子女”。",
        example: { es: "Es mi hijo.", zh: "这是我儿子。", en: "This is my son." }
      },
      {
        id: "hija",
        es: "la hija",
        zh: "女儿",
        en: "daughter",
        note: "h 不发音，j 读音近似汉语 h（只是近似）。",
        example: { es: "Mi hijo y mi hija.", zh: "我儿子和我女儿。", en: "My son and my daughter." }
      },
      {
        id: "abuelo",
        es: "el abuelo",
        zh: "爷爷；外公",
        en: "grandfather",
        note: "西语不分爷爷和外公。复数 los abuelos = 祖父母。",
        example: { es: "Es mi abuelo.", zh: "这是我爷爷。", en: "This is my grandfather." }
      },
      {
        id: "abuela",
        es: "la abuela",
        zh: "奶奶；外婆",
        en: "grandmother",
        note: "西语不分奶奶和外婆。",
        example: { es: "Buenos días, abuela.", zh: "早上好，奶奶。", en: "Good morning, grandma." }
      }
    ]
  }
];
