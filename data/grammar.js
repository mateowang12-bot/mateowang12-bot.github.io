// 基础语法 —— 由 content-writer 编写
// 数据变量：window.GRAMMAR_LESSONS（课程数组，从简到难排列）
// 每课字段：id, titleZh, titleEn, introZh, introEn, tables, points, exercises
//   tables[]:    { captionZh, captionEn, headers[], rows[][] }
//   points[]:    { zh, en, examples[ { es, zh, en } ] }
//   exercises[]: { prompt（含 ___）, promptZh, promptEn, options[], answer（下标，从 0 开始）, explainZh, explainEn }
window.GRAMMAR_LESSONS = [
  {
    id: "pronouns",
    titleZh: "人称代词",
    titleEn: "Subject pronouns",
    introZh: "人称代词就是“我、你、他、她、我们……”。它们是造句的第一步，后面学动词变位时，每个动词都要跟着人称变化。例句里的 soy（我是）、eres（你是）、estás（你……）在第 3、4 课会详细学，现在看中文意思就行。",
    introEn: "Subject pronouns are words like \"I, you, he, she, we\". They are the first step to making sentences: every verb changes its form depending on the person. The verbs in the examples, such as soy (I am), eres (you are) and estás (you are…), are covered in detail in Lessons 3 and 4; for now, just follow the translations.",
    tables: [
      {
        captionZh: "人称代词一览",
        captionEn: "Subject pronouns at a glance",
        headers: ["西语 Español", "中文", "English"],
        rows: [
          ["yo", "我", "I"],
          ["tú", "你（熟人之间）", "you (informal)"],
          ["él", "他", "he"],
          ["ella", "她", "she"],
          ["usted", "您（尊称）", "you (formal)"],
          ["nosotros", "我们（全是男性，或男女都有）", "we (masculine / mixed group)"],
          ["nosotras", "我们（全是女性）", "we (all female)"],
          ["vosotros", "你们（全是男性，或男女都有；主要在西班牙用）", "you all (masculine / mixed; mainly Spain)"],
          ["vosotras", "你们（全是女性；主要在西班牙用）", "you all (all female; mainly Spain)"],
          ["ellos", "他们（全是男性，或男女都有）", "they (masculine / mixed group)"],
          ["ellas", "她们（全是女性）", "they (all female)"],
          ["ustedes", "诸位、你们（尊称；拉美所有场合都用）", "you all (formal; in Latin America for everyone)"]
        ]
      }
    ],
    points: [
      {
        zh: "tú 和 usted 都是“你”。tú 用于朋友、家人、小孩；usted 是尊称，相当于“您”，用于长辈、陌生人或正式场合。注意：usted 后面的动词和 él / ella 用同一个形式。在西班牙，tú 用得很广，年轻人对陌生人也常说 tú。",
        en: "Both tú and usted mean \"you\". Use tú with friends, family and children; usted is the polite form for older people, strangers and formal situations. Note: usted takes the same verb form as él / ella. In Spain, tú is used very widely, even with strangers among young people.",
        examples: [
          { es: "¿Cómo estás?", zh: "你好吗？（对熟人，用 tú）", en: "How are you? (informal, tú)" },
          { es: "¿Cómo está usted?", zh: "您好吗？（尊称，用 usted）", en: "How are you? (formal, usted)" }
        ]
      },
      {
        zh: "复数的“我们、你们、他们”分阳性和阴性：全是女性用 -as（nosotras, vosotras, ellas）；全是男性，或者男女都有，用 -os（nosotros, vosotros, ellos）。哪怕一群女生里只有一个男生，也用 -os。",
        en: "The plural pronouns have masculine and feminine forms: use -as (nosotras, vosotras, ellas) for an all-female group, and -os (nosotros, vosotros, ellos) for an all-male or mixed group. Even one man in a group of women makes it -os.",
        examples: [
          { es: "Mi hermano y yo: nosotros.", zh: "我哥哥和我：我们（男女都有，用 nosotros）。", en: "My brother and I: we (mixed, nosotros)." },
          { es: "Mi madre y mi hermana: ellas.", zh: "我妈妈和我姐姐：她们（全是女性，用 ellas）。", en: "My mother and my sister: they (all female, ellas)." }
        ]
      },
      {
        zh: "“你们”有两个词：在西班牙，熟人用 vosotros / vosotras，正式场合用 ustedes。在拉丁美洲几乎不用 vosotros，不管熟不熟都说 ustedes。另外，阿根廷等地常用 vos 代替 tú。本网站以西班牙用法为准。",
        en: "There are two words for \"you all\": in Spain, vosotros / vosotras is informal and ustedes is formal. In Latin America vosotros is hardly used; people say ustedes to everyone. Also, in Argentina and some other countries, vos is used instead of tú. This site follows the usage of Spain.",
        examples: [
          { es: "¿Cómo estáis vosotros?", zh: "你们好吗？（西班牙，对熟人）", en: "How are you all? (Spain, informal)" },
          { es: "¿Cómo están ustedes?", zh: "你们好吗？/ 诸位好吗？（正式；拉美对所有人）", en: "How are you all? (formal; in Latin America for everyone)" }
        ]
      },
      {
        zh: "西语常常省略主语！因为动词的词尾已经说明了是谁在做事。比如 soy 只能是“我是”，所以直接说 Soy Ana. 就够了。只有想强调、对比，或者分不清是“他、她、您”时，才把代词说出来。",
        en: "Spanish often leaves out the subject! The verb ending already tells you who is doing the action. For example, soy can only mean \"I am\", so Soy Ana. is enough. Say the pronoun only for emphasis, contrast, or when it's unclear whether you mean he, she or you (formal).",
        examples: [
          { es: "Soy Ana.", zh: "我是安娜。（省略了 yo）", en: "I'm Ana. (yo is left out)" },
          { es: "Yo soy Ana, ¿y tú?", zh: "我是安娜，你呢？（对比时说出代词）", en: "I'm Ana, and you? (pronoun used for contrast)" }
        ]
      },
      {
        zh: "小心重音符号：tú（你）和 tu（你的）不一样；él（他）和 el（定冠词，相当于英语 the）不一样。",
        en: "Watch the accent marks: tú (you) is different from tu (your); él (he) is different from el (the).",
        examples: [
          { es: "Tú eres mi hermano.", zh: "你是我的兄弟。", en: "You are my brother." },
          { es: "Él es el padre de Ana.", zh: "他是安娜的爸爸。（Él = 他，el = 定冠词）", en: "He is Ana's father. (Él = he, el = the)" }
        ]
      }
    ],
    exercises: [
      {
        prompt: "___ soy Ana.",
        promptZh: "我是安娜。", promptEn: "I am Ana.",
        options: ["Tú", "Yo", "Él"],
        answer: 1,
        explainZh: "“我”是 yo。soy 也只和 yo 搭配。",
        explainEn: "\"I\" is yo. The verb form soy also goes only with yo."
      },
      {
        prompt: "___ eres mi hermano.",
        promptZh: "你是我的兄弟。", promptEn: "You are my brother.",
        options: ["Yo", "Ella", "Tú"],
        answer: 2,
        explainZh: "“你”是 tú（带重音）。eres 是和 tú 搭配的形式。",
        explainEn: "\"You\" (informal) is tú, with an accent. eres is the form that goes with tú."
      },
      {
        prompt: "Buenos días, señor. ¿Cómo está ___?",
        promptZh: "先生，早上好。您好吗？", promptEn: "Good morning, sir. How are you?",
        options: ["usted", "tú", "yo"],
        answer: 0,
        explainZh: "对陌生的先生要用尊称 usted（您）。",
        explainEn: "With a man you don't know, use the polite form usted."
      },
      {
        prompt: "Mi hermano y yo = ___",
        promptZh: "我哥哥和我 = 我们", promptEn: "My brother and I = we",
        options: ["ellos", "nosotros", "vosotros"],
        answer: 1,
        explainZh: "包括“我”在内就是“我们”；男女都有，用阳性 nosotros。",
        explainEn: "A group that includes \"I\" is \"we\"; it's mixed, so use the masculine nosotros."
      },
      {
        prompt: "Mi madre y mi hermana = ___",
        promptZh: "我妈妈和我姐姐 = 她们", promptEn: "My mother and my sister = they",
        options: ["ellos", "ellas", "nosotras"],
        answer: 1,
        explainZh: "两个人都是女性，所以用 ellas。",
        explainEn: "Both are female, so use ellas."
      },
      {
        prompt: "Mi padre y mi madre = ___",
        promptZh: "我爸爸和我妈妈 = 他们", promptEn: "My father and my mother = they",
        options: ["ellas", "ustedes", "ellos"],
        answer: 2,
        explainZh: "男女都有时用阳性 ellos。",
        explainEn: "For a mixed group, use the masculine ellos."
      },
      {
        prompt: "___ es mi abuela.",
        promptZh: "她是我奶奶。", promptEn: "She is my grandmother.",
        options: ["Ella", "Él", "Yo"],
        answer: 0,
        explainZh: "“她”是 ella。él 是“他”。",
        explainEn: "\"She\" is ella. él means \"he\"."
      },
      {
        prompt: "¿Y ___? ¿Cómo estáis?",
        promptZh: "你们呢？你们好吗？（在西班牙对两个朋友说）", promptEn: "And you guys? How are you? (to two friends, in Spain)",
        options: ["ustedes", "vosotros", "nosotros"],
        answer: 1,
        explainZh: "在西班牙，对熟悉的一群人用 vosotros，动词是 estáis。ustedes 要配 están。",
        explainEn: "In Spain, use vosotros for a group of friends; its verb form is estáis. ustedes would take están."
      }
    ]
  },
  {
    id: "gender-articles",
    titleZh: "名词的阴阳性和冠词",
    titleEn: "Noun gender and articles",
    introZh: "西语的每个名词都有“性别”：阳性或阴性。名词前面的冠词（相当于英语的 the 和 a）要跟着名词的阴阳性和单复数变化。",
    introEn: "Every Spanish noun has a gender: masculine or feminine. The article in front of it (like English \"the\" and \"a\") changes to match the noun's gender and number.",
    tables: [
      {
        captionZh: "冠词表",
        captionEn: "Articles",
        headers: ["", "阳性 Masculine", "阴性 Feminine"],
        rows: [
          ["定冠词·单数（中文常不翻译）the", "el", "la"],
          ["定冠词·复数（中文常不翻译）the", "los", "las"],
          ["不定冠词·单数（一个）a / an", "un", "una"],
          ["不定冠词·复数（一些）some", "unos", "unas"]
        ]
      },
      {
        captionZh: "例词（记名词时连冠词一起记）",
        captionEn: "Example words (learn each noun with its article)",
        headers: ["西语 Español", "中文", "English"],
        rows: [
          ["el hermano", "兄弟", "the brother"],
          ["la hermana", "姐妹", "the sister"],
          ["los hijos", "儿子们；子女", "the sons / the children"],
          ["las hijas", "女儿们", "the daughters"],
          ["el padre", "父亲（-e 结尾，要单独记）", "the father (ends in -e: memorize)"],
          ["la flor", "花（辅音结尾，要单独记）", "the flower (ends in a consonant: memorize)"],
          ["el día", "天；白天（例外：-a 结尾但是阳性）", "the day (exception: masculine)"],
          ["la mano", "手（例外：-o 结尾但是阴性）", "the hand (exception: feminine)"]
        ]
      }
    ],
    points: [
      {
        zh: "简单规律：以 -o 结尾的名词大多是阳性，用 el / un；以 -a 结尾的名词大多是阴性，用 la / una。",
        en: "Simple rule: nouns ending in -o are usually masculine (el / un); nouns ending in -a are usually feminine (la / una).",
        examples: [
          { es: "el hijo, la hija", zh: "儿子，女儿", en: "the son, the daughter" },
          { es: "un abuelo, una abuela", zh: "一位爷爷，一位奶奶", en: "a grandfather, a grandmother" }
        ]
      },
      {
        zh: "有例外！比如 el día（天）是阳性，la mano（手）是阴性。以 -e 或辅音结尾的名词没有固定规律，如 el padre、la madre、la flor。最好的办法：每学一个名词，就连冠词一起背。",
        en: "There are exceptions! For example, el día (day) is masculine and la mano (hand) is feminine. Nouns ending in -e or a consonant have no fixed rule, e.g. el padre, la madre, la flor. Best tip: always learn a noun together with its article.",
        examples: [
          { es: "Buenos días.", zh: "早上好。（día 是阳性，所以形容词用 buenos）", en: "Good morning. (día is masculine, so it's buenos)" },
          { es: "la madre y el padre", zh: "妈妈和爸爸", en: "the mother and the father" }
        ]
      },
      {
        zh: "变复数：元音结尾加 -s，辅音结尾加 -es；冠词 el → los，la → las。男女混合时用阳性复数：los padres = 父母，los hermanos = 兄弟姐妹。",
        en: "Making plurals: add -s after a vowel, -es after a consonant; the article changes el → los, la → las. A mixed group uses the masculine plural: los padres = parents, los hermanos = brothers and sisters.",
        examples: [
          { es: "la flor → las flores", zh: "花 → 那些花", en: "the flower → the flowers" },
          { es: "Son mis padres.", zh: "这是我的父母。", en: "These are my parents." }
        ]
      },
      {
        zh: "un / una 表示“一个”。数字 uno 放在阳性名词前要变成 un，放在阴性名词前要变成 una。",
        en: "un / una mean \"a / one\". The number uno becomes un before a masculine noun and una before a feminine noun.",
        examples: [
          { es: "Tengo un hermano y una hermana.", zh: "我有一个哥哥和一个姐姐。", en: "I have a brother and a sister." }
        ]
      },
      {
        zh: "形容词（比如颜色）也要跟名词的阴阳性一致：-o 结尾的变成 -a；azul、verde 这类不分阴阳性（但复数仍要加 -s / -es：azules, verdes）。",
        en: "Adjectives (such as colors) also agree with the noun's gender: -o changes to -a; words like azul and verde have the same form for masculine and feminine (but still add -s / -es in the plural: azules, verdes).",
        examples: [
          { es: "El tomate es rojo. La casa es roja.", zh: "西红柿是红色的。房子是红色的。", en: "The tomato is red. The house is red." },
          { es: "El mar es azul. La flor es azul.", zh: "大海是蓝色的。花是蓝色的。", en: "The sea is blue. The flower is blue." }
        ]
      }
    ],
    exercises: [
      {
        prompt: "___ hermano",
        promptZh: "（这个）兄弟", promptEn: "the brother",
        options: ["la", "el", "las"],
        answer: 1,
        explainZh: "hermano 以 -o 结尾，是阳性单数，用 el。",
        explainEn: "hermano ends in -o: masculine singular, so el."
      },
      {
        prompt: "___ hermanas",
        promptZh: "（这些）姐妹", promptEn: "the sisters",
        options: ["las", "los", "la"],
        answer: 0,
        explainZh: "hermanas 是阴性复数，用 las。",
        explainEn: "hermanas is feminine plural, so las."
      },
      {
        prompt: "___ día",
        promptZh: "（这一）天", promptEn: "the day",
        options: ["la", "los", "el"],
        answer: 2,
        explainZh: "día 是例外：虽然以 -a 结尾，却是阳性，所以用 el（想想 buenos días）。",
        explainEn: "día is an exception: it ends in -a but is masculine, so el (think of buenos días)."
      },
      {
        prompt: "___ mano",
        promptZh: "（这只）手", promptEn: "the hand",
        options: ["el", "la", "los"],
        answer: 1,
        explainZh: "mano 是例外：虽然以 -o 结尾，却是阴性，所以用 la。",
        explainEn: "mano is an exception: it ends in -o but is feminine, so la."
      },
      {
        prompt: "Tengo ___ hija.",
        promptZh: "我有一个女儿。", promptEn: "I have a daughter.",
        options: ["un", "una", "unos"],
        answer: 1,
        explainZh: "hija 是阴性单数，“一个”用 una。",
        explainEn: "hija is feminine singular, so \"a\" is una."
      },
      {
        prompt: "Tengo ___ hermano.",
        promptZh: "我有一个哥哥。", promptEn: "I have a brother.",
        options: ["una", "uno", "un"],
        answer: 2,
        explainZh: "uno 放在阳性名词前要变成 un，不能说 uno hermano。",
        explainEn: "uno becomes un before a masculine noun; you can't say uno hermano."
      },
      {
        prompt: "___ padres",
        promptZh: "父母", promptEn: "the parents",
        options: ["los", "las", "el"],
        answer: 0,
        explainZh: "padres 是复数；爸爸和妈妈男女混合，用阳性复数 los。",
        explainEn: "padres is plural; a mixed group (father and mother) uses the masculine plural los."
      },
      {
        prompt: "La casa es ___.",
        promptZh: "房子是红色的。", promptEn: "The house is red.",
        options: ["rojo", "roja", "rojos"],
        answer: 1,
        explainZh: "casa 是阴性单数，颜色 rojo 要变成 roja。",
        explainEn: "casa is feminine singular, so rojo becomes roja."
      }
    ]
  },
  {
    id: "ser",
    titleZh: "动词 ser（是）",
    titleEn: "The verb ser (to be)",
    introZh: "ser 相当于中文的“是”，是西语里最常用的动词之一。它是不规则动词，六种形式要直接背下来。",
    introEn: "ser means \"to be\" and is one of the most common Spanish verbs. It is irregular, so its six forms need to be memorized.",
    tables: [
      {
        captionZh: "ser 现在时变位",
        captionEn: "ser: present tense",
        headers: ["人称 Person", "ser", "中文", "English"],
        rows: [
          ["yo", "soy", "我是", "I am"],
          ["tú", "eres", "你是", "you are"],
          ["él / ella / usted", "es", "他/她是；您是", "he / she is; you (formal) are"],
          ["nosotros / nosotras", "somos", "我们是", "we are"],
          ["vosotros / vosotras", "sois", "你们是", "you all are"],
          ["ellos / ellas / ustedes", "son", "他们/她们是；诸位是", "they are; you all (formal) are"]
        ]
      }
    ],
    points: [
      {
        zh: "说身份、名字、关系：我是谁、他是谁。",
        en: "Use ser for identity, names and relationships: who someone is.",
        examples: [
          { es: "Soy Ana.", zh: "我是安娜。", en: "I'm Ana." },
          { es: "Es mi madre.", zh: "这是我妈妈。", en: "This is my mother." }
        ]
      },
      {
        zh: "说国籍和来自哪里：ser + 国籍形容词，或 ser de + 地方。国籍形容词也分阴阳性：chino / china，español / española。",
        en: "Use ser for nationality and origin: ser + nationality, or ser de + place. Nationalities also have masculine and feminine forms: chino / china, español / española.",
        examples: [
          { es: "Soy de China. Soy chino.", zh: "我来自中国。我是中国人（男）。", en: "I'm from China. I'm Chinese (male)." },
          { es: "Ella es española.", zh: "她是西班牙人。", en: "She is Spanish." }
        ]
      },
      {
        zh: "说职业：注意职业前面一般不加 un / una。说“我是学生”是 Soy estudiante.，不说 Soy un estudiante.",
        en: "Use ser for professions. Note: no un / una before the profession. \"I am a student\" is Soy estudiante., not Soy un estudiante.",
        examples: [
          { es: "Soy estudiante.", zh: "我是学生。", en: "I'm a student." },
          { es: "Mi padre es médico.", zh: "我爸爸是医生。", en: "My father is a doctor." }
        ]
      },
      {
        zh: "说性格、外貌、颜色等本来的特点（不容易变的特征）。",
        en: "Use ser for personality, appearance, color and other basic characteristics (things that don't change easily).",
        examples: [
          { es: "Mi hermana es simpática.", zh: "我姐姐人很好（很和善）。", en: "My sister is nice." },
          { es: "El sol es amarillo.", zh: "太阳是黄色的。", en: "The sun is yellow." }
        ]
      },
      {
        zh: "否定句：把 no 放在动词前面。另外记住：usted 用 es，ustedes 用 son（和“他/他们”一样）；在拉美，“你们是”一律说 ustedes son，不说 vosotros sois。",
        en: "Negative sentences: put no before the verb. Also remember: usted takes es and ustedes takes son (same as he / they). In Latin America, \"you all are\" is always ustedes son, not vosotros sois.",
        examples: [
          { es: "No soy médico.", zh: "我不是医生。", en: "I'm not a doctor." },
          { es: "¿Ustedes son de Madrid?", zh: "你们（诸位）是马德里人吗？", en: "Are you (all) from Madrid?" }
        ]
      }
    ],
    exercises: [
      {
        prompt: "Yo ___ estudiante.",
        promptZh: "我是学生。", promptEn: "I am a student.",
        options: ["eres", "soy", "es"],
        answer: 1,
        explainZh: "yo 对应 soy。",
        explainEn: "yo goes with soy."
      },
      {
        prompt: "Tú ___ de China.",
        promptZh: "你来自中国。", promptEn: "You are from China.",
        options: ["eres", "son", "soy"],
        answer: 0,
        explainZh: "tú 对应 eres。说“来自哪里”用 ser de。",
        explainEn: "tú goes with eres. Origin uses ser de."
      },
      {
        prompt: "Ella ___ española.",
        promptZh: "她是西班牙人。", promptEn: "She is Spanish.",
        options: ["somos", "sois", "es"],
        answer: 2,
        explainZh: "ella 对应 es。国籍用 ser。",
        explainEn: "ella goes with es. Nationality uses ser."
      },
      {
        prompt: "Nosotros ___ hermanos.",
        promptZh: "我们是兄弟（兄弟姐妹）。", promptEn: "We are brothers (siblings).",
        options: ["son", "somos", "sois"],
        answer: 1,
        explainZh: "nosotros 对应 somos。",
        explainEn: "nosotros goes with somos."
      },
      {
        prompt: "Vosotros ___ simpáticos.",
        promptZh: "你们人很好。", promptEn: "You guys are nice.",
        options: ["sois", "son", "somos"],
        answer: 0,
        explainZh: "vosotros 对应 sois。性格用 ser。",
        explainEn: "vosotros goes with sois. Personality uses ser."
      },
      {
        prompt: "Mis padres ___ profesores.",
        promptZh: "我的父母是老师。", promptEn: "My parents are teachers.",
        options: ["es", "somos", "son"],
        answer: 2,
        explainZh: "mis padres（我的父母）= ellos，对应 son。职业用 ser，且不加 unos。",
        explainEn: "mis padres (my parents) = ellos, so son. Professions use ser, with no article."
      },
      {
        prompt: "Usted ___ muy amable.",
        promptZh: "您非常客气（友善）。", promptEn: "You are very kind.",
        options: ["eres", "es", "sois"],
        answer: 1,
        explainZh: "usted 虽然意思是“您”，但动词和 él / ella 一样，用 es。",
        explainEn: "usted means \"you\", but it takes the same verb form as él / ella: es."
      }
    ]
  },
  {
    id: "estar",
    titleZh: "动词 estar（在；处于……状态）",
    titleEn: "The verb estar (to be: location and state)",
    introZh: "estar 也翻译成“是”或“在”，但它和 ser 分工不同：ser 说本质，estar 说状态和位置。这一课学 estar 的变位，并学会区分 ser 和 estar。",
    introEn: "estar also means \"to be\", but it has a different job from ser: ser describes what something is, estar describes its state or location. In this lesson you'll learn estar and how to tell ser and estar apart.",
    tables: [
      {
        captionZh: "estar 现在时变位（注意重音）",
        captionEn: "estar: present tense (watch the accents)",
        headers: ["人称 Person", "estar", "中文", "English"],
        rows: [
          ["yo", "estoy", "我在/我（处于）", "I am"],
          ["tú", "estás", "你在/你（处于）", "you are"],
          ["él / ella / usted", "está", "他/她在；您在", "he / she is; you (formal) are"],
          ["nosotros / nosotras", "estamos", "我们在", "we are"],
          ["vosotros / vosotras", "estáis", "你们在", "you all are"],
          ["ellos / ellas / ustedes", "están", "他们/她们在；诸位在", "they are; you all (formal) are"]
        ]
      },
      {
        captionZh: "ser 和 estar 对比：ser 说本质，estar 说状态/位置",
        captionEn: "ser vs. estar: ser = what it is, estar = how / where it is",
        headers: ["", "ser", "estar"],
        rows: [
          ["说什么 What it tells", "本质：身份、国籍、职业、性格（不容易变）Identity, nationality, job, personality", "状态和位置：现在怎么样、在哪儿（会变）Current state, mood, location"],
          ["例 Example", "Soy Ana.（我是安娜。）", "Estoy bien.（我挺好。）"],
          ["例 Example", "Soy de Madrid.（我是马德里人。）", "Estoy en Madrid.（我在马德里。）"],
          ["例 Example", "Mi hermano es alegre.（我哥哥性格开朗。）", "Mi hermano está triste hoy.（我哥哥今天很难过。）"]
        ]
      }
    ],
    points: [
      {
        zh: "说位置：某人或某物在哪里，用 estar + en + 地方。",
        en: "Use estar for location: where someone or something is, with estar + en + place.",
        examples: [
          { es: "Estoy en casa.", zh: "我在家。", en: "I'm at home." },
          { es: "Madrid está en España.", zh: "马德里在西班牙。", en: "Madrid is in Spain." },
          { es: "¿Dónde está mi madre?", zh: "我妈妈在哪儿？", en: "Where is my mother?" }
        ]
      },
      {
        zh: "说状态和心情：现在感觉怎么样。¿Cómo estás? 里就是 estar。形容词也要和人的阴阳性一致：cansado（男）/ cansada（女）。",
        en: "Use estar for states and moods: how someone feels right now. ¿Cómo estás? uses estar. Adjectives agree in gender: cansado (male) / cansada (female).",
        examples: [
          { es: "Estoy bien, gracias.", zh: "我挺好，谢谢。", en: "I'm fine, thank you." },
          { es: "Estoy cansada.", zh: "我累了。（说话人是女性）", en: "I'm tired. (female speaker)" },
          { es: "Estamos contentos.", zh: "我们很高兴。", en: "We're happy." }
        ]
      },
      {
        zh: "ser 和 estar 怎么分？记一句话：ser 说本质，estar 说状态/位置。“他是什么样的人”用 ser；“他今天怎么样、他在哪儿”用 estar。同一个人，性格开朗（ser alegre），今天也可以心情不好（estar triste）。",
        en: "How to choose? Remember: ser = what something is, estar = its state or location. \"What kind of person he is\" uses ser; \"how he is today, where he is\" uses estar. A cheerful person (ser alegre) can still be sad today (estar triste).",
        examples: [
          { es: "Mi hermano es alegre, pero hoy está triste.", zh: "我哥哥性格开朗，但今天很难过。", en: "My brother is cheerful, but today he's sad." },
          { es: "Soy de China, pero estoy en España.", zh: "我是中国人，但我现在在西班牙。", en: "I'm from China, but I'm in Spain." }
        ]
      },
      {
        zh: "小窍门：问“怎么样”（¿Cómo estás?）和“在哪儿”（¿Dónde estás?）一般用 estar；问“是谁”（¿Quién es?）和“从哪儿来”（¿De dónde eres?）用 ser。（进阶：活动在哪里举行要用 ser，以后再学。）",
        en: "Tip: \"how are you\" (¿Cómo estás?) and \"where are you\" (¿Dónde estás?) usually use estar; \"who is it\" (¿Quién es?) and \"where are you from\" (¿De dónde eres?) use ser. (Advanced: the location of an event uses ser; you'll learn that later.)",
        examples: [
          { es: "¿De dónde eres? ¿Dónde estás?", zh: "你是哪里人？你在哪儿？", en: "Where are you from? Where are you?" }
        ]
      }
    ],
    exercises: [
      {
        prompt: "Yo ___ en casa.",
        promptZh: "我在家。", promptEn: "I am at home.",
        options: ["soy", "estoy", "está"],
        answer: 1,
        explainZh: "说位置用 estar；yo 对应 estoy。",
        explainEn: "Location uses estar; yo goes with estoy."
      },
      {
        prompt: "¿Cómo ___ tú? — Bien, gracias.",
        promptZh: "你好吗？——挺好，谢谢。", promptEn: "How are you? — Fine, thanks.",
        options: ["estás", "eres", "está"],
        answer: 0,
        explainZh: "回答是“挺好，谢谢”，说明问的是现在的状态，用 estar；tú 对应 estás。（¿Cómo eres? 是问“你是个什么样的人？”，不会回答 Bien, gracias。）",
        explainEn: "The answer \"Fine, thanks\" shows the question is about the current state, so estar; tú goes with estás. (¿Cómo eres? means \"What are you like?\", which you wouldn't answer with Bien, gracias.)"
      },
      {
        prompt: "Madrid ___ en España.",
        promptZh: "马德里在西班牙。", promptEn: "Madrid is in Spain.",
        options: ["es", "está", "están"],
        answer: 1,
        explainZh: "说地点位置用 estar；Madrid 是单数，用 está。",
        explainEn: "Location uses estar; Madrid is singular, so está."
      },
      {
        prompt: "Nosotros ___ cansados.",
        promptZh: "我们累了。", promptEn: "We are tired.",
        options: ["estamos", "somos", "están"],
        answer: 0,
        explainZh: "“累”是暂时的状态，用 estar；nosotros 对应 estamos。",
        explainEn: "Being tired is a temporary state, so estar; nosotros goes with estamos."
      },
      {
        prompt: "Ella ___ profesora.",
        promptZh: "她是老师。", promptEn: "She is a teacher.",
        options: ["está", "estás", "es"],
        answer: 2,
        explainZh: "职业用 ser；ella 对应 es。",
        explainEn: "Professions use ser; ella goes with es."
      },
      {
        prompt: "Mi madre ___ triste hoy.",
        promptZh: "我妈妈今天很难过。", promptEn: "My mother is sad today.",
        options: ["es", "están", "está"],
        answer: 2,
        explainZh: "今天的心情是状态，用 estar；mi madre = ella，对应 está。",
        explainEn: "Today's mood is a state, so estar; mi madre = ella, so está."
      },
      {
        prompt: "Mis padres ___ de China.",
        promptZh: "我父母是中国人（来自中国）。", promptEn: "My parents are from China.",
        options: ["están", "son", "estáis"],
        answer: 1,
        explainZh: "来自哪里是本质，用 ser de；mis padres = ellos，对应 son。",
        explainEn: "Origin is part of who you are: ser de; mis padres = ellos, so son."
      },
      {
        prompt: "Vosotros ___ en Madrid.",
        promptZh: "你们在马德里。", promptEn: "You guys are in Madrid.",
        options: ["sois", "están", "estáis"],
        answer: 2,
        explainZh: "说位置用 estar；vosotros 对应 estáis。",
        explainEn: "Location uses estar; vosotros goes with estáis."
      }
    ]
  },
  {
    id: "regular-verbs",
    titleZh: "规则动词现在时",
    titleEn: "Regular verbs: present tense",
    introZh: "西语动词原形分三类：-ar、-er、-ir 结尾。规则动词只要去掉词尾，再按人称加上新词尾就行。学会这三个例子，就能变位成百上千个动词。",
    introEn: "Spanish verbs come in three groups, ending in -ar, -er or -ir. For regular verbs, drop the ending and add a new one for each person. Learn these three models and you can conjugate hundreds of verbs.",
    tables: [
      {
        captionZh: "三个例子：hablar（说）、comer（吃）、vivir（住；生活）",
        captionEn: "Three models: hablar (to speak), comer (to eat), vivir (to live)",
        headers: ["人称 Person", "hablar 说 speak", "comer 吃 eat", "vivir 住 live"],
        rows: [
          ["yo", "hablo", "como", "vivo"],
          ["tú", "hablas", "comes", "vives"],
          ["él / ella / usted", "habla", "come", "vive"],
          ["nosotros / nosotras", "hablamos", "comemos", "vivimos"],
          ["vosotros / vosotras", "habláis", "coméis", "vivís"],
          ["ellos / ellas / ustedes", "hablan", "comen", "viven"]
        ]
      },
      {
        captionZh: "词尾规律（去掉 -ar / -er / -ir 后加上）",
        captionEn: "Endings (added after dropping -ar / -er / -ir)",
        headers: ["人称 Person", "-ar", "-er", "-ir"],
        rows: [
          ["yo", "-o", "-o", "-o"],
          ["tú", "-as", "-es", "-es"],
          ["él / ella / usted", "-a", "-e", "-e"],
          ["nosotros / nosotras", "-amos", "-emos", "-imos"],
          ["vosotros / vosotras", "-áis", "-éis", "-ís"],
          ["ellos / ellas / ustedes", "-an", "-en", "-en"]
        ]
      }
    ],
    points: [
      {
        zh: "变位方法：先去掉原形的词尾，留下词根，再加上人称词尾。例如 hablar → habl- → hablo（我说）。",
        en: "How to conjugate: drop the infinitive ending to get the stem, then add the personal ending. For example, hablar → habl- → hablo (I speak).",
        examples: [
          { es: "Hablo español.", zh: "我说西班牙语。", en: "I speak Spanish." },
          { es: "Mi madre habla chino.", zh: "我妈妈说中文。", en: "My mother speaks Chinese." }
        ]
      },
      {
        zh: "-er 和 -ir 动词的词尾几乎一样，只有“我们”和“你们”不同：comemos / coméis，vivimos / vivís。",
        en: "-er and -ir verbs have almost the same endings; only \"we\" and \"you all\" differ: comemos / coméis, vivimos / vivís.",
        examples: [
          { es: "Comemos en casa.", zh: "我们在家吃饭。", en: "We eat at home." },
          { es: "Vivimos en China.", zh: "我们住在中国。", en: "We live in China." }
        ]
      },
      {
        zh: "因为词尾已经说明了人称，主语通常省略。否定还是把 no 放在动词前。注意 vosotros 的词尾有重音：habláis、coméis、vivís。",
        en: "Because the ending shows the person, the subject is usually left out. For negatives, put no before the verb. Note the accents in the vosotros forms: habláis, coméis, vivís.",
        examples: [
          { es: "No como carne.", zh: "我不吃肉。", en: "I don't eat meat." },
          { es: "¿Habláis español?", zh: "你们说西班牙语吗？", en: "Do you guys speak Spanish?" }
        ]
      },
      {
        zh: "拉美差异：拉美不用 vosotros 的形式，“你们说”一律是 ustedes hablan，“你们住”是 ustedes viven。",
        en: "Latin American difference: the vosotros forms aren't used; \"you all speak\" is always ustedes hablan, and \"you all live\" is ustedes viven.",
        examples: [
          { es: "¿Ustedes viven en Madrid?", zh: "你们住在马德里吗？", en: "Do you (all) live in Madrid?" }
        ]
      }
    ],
    exercises: [
      {
        prompt: "Yo ___ español.",
        promptZh: "我说西班牙语。", promptEn: "I speak Spanish.",
        options: ["hablas", "hablo", "habla"],
        answer: 1,
        explainZh: "yo 的词尾是 -o：habl + o = hablo。",
        explainEn: "The yo ending is -o: habl + o = hablo."
      },
      {
        prompt: "Tú ___ en Madrid.",
        promptZh: "你住在马德里。", promptEn: "You live in Madrid.",
        options: ["vives", "vive", "vivo"],
        answer: 0,
        explainZh: "vivir 是 -ir 动词，tú 的词尾是 -es：viv + es = vives。",
        explainEn: "vivir is an -ir verb; the tú ending is -es: viv + es = vives."
      },
      {
        prompt: "Nosotros ___ pan.",
        promptZh: "我们吃面包。", promptEn: "We eat bread.",
        options: ["comen", "coméis", "comemos"],
        answer: 2,
        explainZh: "comer 是 -er 动词，nosotros 的词尾是 -emos：comemos。",
        explainEn: "comer is an -er verb; the nosotros ending is -emos: comemos."
      },
      {
        prompt: "Mi hermana ___ chino.",
        promptZh: "我姐姐说中文。", promptEn: "My sister speaks Chinese.",
        options: ["hablan", "habla", "hablas"],
        answer: 1,
        explainZh: "mi hermana = ella，-ar 动词 ella 的词尾是 -a：habla。",
        explainEn: "mi hermana = ella; for -ar verbs the ella ending is -a: habla."
      },
      {
        prompt: "Vosotros ___ en España.",
        promptZh: "你们住在西班牙。", promptEn: "You guys live in Spain.",
        options: ["vivís", "vivéis", "viven"],
        answer: 0,
        explainZh: "-ir 动词 vosotros 的词尾是 -ís：vivís。vivéis 是错的（-éis 是 -er 动词的词尾）。",
        explainEn: "The vosotros ending for -ir verbs is -ís: vivís. vivéis is wrong (-éis is the -er ending)."
      },
      {
        prompt: "Ellos ___ mucho.",
        promptZh: "他们吃得很多。", promptEn: "They eat a lot.",
        options: ["como", "comes", "comen"],
        answer: 2,
        explainZh: "ellos 的 -er 词尾是 -en：comen。",
        explainEn: "The ellos ending for -er verbs is -en: comen."
      },
      {
        prompt: "Nosotros ___ en China.",
        promptZh: "我们住在中国。", promptEn: "We live in China.",
        options: ["vivemos", "vivimos", "viven"],
        answer: 1,
        explainZh: "-ir 动词 nosotros 的词尾是 -imos：vivimos。vivemos 是错的。",
        explainEn: "The nosotros ending for -ir verbs is -imos: vivimos. vivemos is wrong."
      },
      {
        prompt: "Usted ___ muy bien.",
        promptZh: "您说得很好。", promptEn: "You speak very well.",
        options: ["hablas", "habláis", "habla"],
        answer: 2,
        explainZh: "usted 的动词形式和 él / ella 一样：habla。",
        explainEn: "usted takes the same verb form as él / ella: habla."
      }
    ]
  }
];
