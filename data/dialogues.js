// 情景对话 —— 由 content-writer 编写
// 数据变量：window.DIALOGUES（情景数组，从简到难排列）
// 每个情景字段：id, titleZh, titleEn, sceneZh, sceneEn, partner, lines
//   lines[] 对方：{ who: "them", es, zh, en, note（可选） }
//   lines[] 我：  { who: "me", hintZh, hintEn, options[ { es, zh, en, correct, whyZh（错误选项才有） } ], alsoOk（可选，其他也算对的西语说法，供打字挑战用）, note }
// 学习者的名字在对话里叫 Lin，来自中国，是学生（不分性别，尽量避开需要变阴阳性的形容词）。
window.DIALOGUES = [
  // 1 —— 打招呼
  {
    id: "greet",
    titleZh: "打招呼", titleEn: "Saying hello",
    sceneZh: "早上在楼下遇到邻居 Carmen。", sceneEn: "You meet your neighbor Carmen in the morning.",
    partner: "Carmen",
    lines: [
      { who: "them", es: "¡Hola! ¡Buenos días!", zh: "你好！早上好！", en: "Hi! Good morning!" },
      { who: "me",
        hintZh: "跟她打招呼，也说早上好。", hintEn: "Greet her and say good morning too.",
        options: [
          { es: "¡Buenas noches!", zh: "晚上好！", en: "Good evening!", correct: false, whyZh: "现在是早上，晚上才说 buenas noches。" },
          { es: "¡Hola, buenos días!", zh: "你好，早上好！", en: "Hi, good morning!", correct: true },
          { es: "Adiós.", zh: "再见。", en: "Goodbye.", correct: false, whyZh: "刚见面不说再见。" }
        ],
        alsoOk: ["¡Buenos días!", "¡Hola, Carmen, buenos días!"],
        note: ""
      },
      { who: "them", es: "¿Qué tal?", zh: "怎么样？", en: "How's it going?" },
      { who: "me",
        hintZh: "说你挺好，谢谢，再反问她。", hintEn: "Say you're fine, thank her, and ask her back.",
        options: [
          { es: "Bien, gracias. ¿Y tú?", zh: "挺好，谢谢。你呢？", en: "Fine, thanks. And you?", correct: true },
          { es: "Soy bien, gracias.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "说状态不能用 ser；回答 ¿qué tal? 直接说 Bien 就行（完整说法是 Estoy bien）。（见语法课第 3、4 课 ser / estar）" },
          { es: "Sí, gracias.", zh: "是的，谢谢。", en: "Yes, thanks.", correct: false, whyZh: "答非所问：¿qué tal? 问的是“怎么样”，不能用“是”来回答。" }
        ],
        alsoOk: ["Estoy bien, gracias. ¿Y tú?", "Muy bien, gracias. ¿Y tú?", "Bien, ¿y tú?"],
        note: "¿Y tú? = 你呢？tú 要带重音。"
      },
      { who: "them", es: "Muy bien. ¿Y tu familia?", zh: "很好。你家里人呢？", en: "Very well. And your family?" },
      { who: "me",
        hintZh: "说他们都很好，谢谢。", hintEn: "Say they're very well, thanks.",
        options: [
          { es: "De nada.", zh: "不客气。", en: "You're welcome.", correct: false, whyZh: "de nada 是用来回答 gracias 的，她没有谢你。" },
          { es: "Lo siento.", zh: "对不起。", en: "I'm sorry.", correct: false, whyZh: "你没做错事，不用道歉。" },
          { es: "Muy bien, gracias.", zh: "很好，谢谢。", en: "Very well, thanks.", correct: true }
        ],
        alsoOk: ["Bien, gracias."],
        note: "tu（不带重音）= 你的：tu familia = 你的家人。和 tú（你）不一样。"
      },
      { who: "them", es: "¡Hasta luego!", zh: "回头见！", en: "See you later!" },
      { who: "me",
        hintZh: "跟她说再见。", hintEn: "Say goodbye to her.",
        options: [
          { es: "¡Hola, Carmen!", zh: "你好，Carmen！", en: "Hi, Carmen!", correct: false, whyZh: "hola 是见面时说的，告别要说 adiós。" },
          { es: "¡Adiós, hasta luego!", zh: "再见，回头见！", en: "Bye, see you later!", correct: true },
          { es: "Mucho gusto.", zh: "很高兴认识你。", en: "Nice to meet you.", correct: false, whyZh: "mucho gusto 是第一次认识时说的，Carmen 是老邻居。" }
        ],
        alsoOk: ["¡Adiós!", "¡Hasta luego!", "¡Adiós, Carmen!"],
        note: ""
      }
    ]
  },

  // 2 —— 认识新朋友
  {
    id: "meet",
    titleZh: "认识新朋友", titleEn: "Meeting someone new",
    sceneZh: "在朋友的聚会上，一个男生走过来跟你说话。", sceneEn: "At a friend's party, a young man comes over to talk to you.",
    partner: "Javier",
    lines: [
      { who: "them", es: "¡Hola! Me llamo Javier. ¿Cómo te llamas?", zh: "你好！我叫 Javier。你叫什么名字？", en: "Hi! My name is Javier. What's your name?" },
      { who: "me",
        hintZh: "告诉他你叫 Lin。", hintEn: "Tell him your name is Lin.",
        options: [
          { es: "Me llamo Lin.", zh: "我叫 Lin。", en: "My name is Lin.", correct: true },
          { es: "Te llamas Lin.", zh: "你叫 Lin。", en: "Your name is Lin.", correct: false, whyZh: "te llamas 是“你叫”，说自己要用 me llamo。" },
          { es: "Me llamo Javier.", zh: "我叫 Javier。", en: "My name is Javier.", correct: false, whyZh: "Javier 是他的名字，不是你的。" }
        ],
        alsoOk: ["Soy Lin.", "Hola, me llamo Lin.", "Hola, soy Lin."],
        note: "新词：me llamo = 我叫；¿Cómo te llamas? = 你叫什么名字？。也可以说 Soy Lin.（我是 Lin）。ll 读音近似 y。"
      },
      { who: "them", es: "Mucho gusto, Lin.", zh: "很高兴认识你，Lin。", en: "Nice to meet you, Lin." },
      { who: "me",
        hintZh: "也说很高兴认识他。", hintEn: "Say it's nice to meet him too.",
        options: [
          { es: "De nada.", zh: "不客气。", en: "You're welcome.", correct: false, whyZh: "de nada 是回答 gracias 的，不是回答 mucho gusto。" },
          { es: "Adiós, Javier.", zh: "再见，Javier。", en: "Goodbye, Javier.", correct: false, whyZh: "刚认识就说再见，太突然了。" },
          { es: "Mucho gusto.", zh: "很高兴认识你。", en: "Nice to meet you.", correct: true }
        ],
        alsoOk: ["Encantado.", "Encantada.", "Igualmente.", "Mucho gusto, Javier."],
        note: "在西班牙也常说 encantado（说话人是男性）/ encantada（说话人是女性）。回答时也可以说 Igualmente（我也是）。"
      },
      { who: "them", es: "¿Eres estudiante?", zh: "你是学生吗？", en: "Are you a student?" },
      { who: "me",
        hintZh: "说是的，你是学生。", hintEn: "Say yes, you're a student.",
        options: [
          { es: "Sí, estoy estudiante.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "职业、身份用 ser，不用 estar。" },
          { es: "Sí, soy estudiante.", zh: "是的，我是学生。", en: "Yes, I'm a student.", correct: true },
          { es: "Sí, soy un estudiante.", zh: "（不自然的说法）", en: "(unnatural)", correct: false, whyZh: "说职业时前面一般不加 un / una。" }
        ],
        alsoOk: ["Soy estudiante.", "Sí, yo soy estudiante."],
        note: ""
      },
      { who: "them", es: "Yo no, soy profesor. Y ella es Marta, mi hermana.", zh: "我不是，我是老师。她是 Marta，我妹妹。", en: "I'm not, I'm a teacher. And this is Marta, my sister." },
      { who: "me",
        hintZh: "跟 Marta 打招呼，说很高兴认识她。", hintEn: "Greet Marta and say nice to meet her.",
        options: [
          { es: "Hola, Marta. ¿Cómo te llamas?", zh: "你好，Marta。你叫什么名字？", en: "Hi, Marta. What's your name?", correct: false, whyZh: "Javier 已经告诉你她叫 Marta 了，不用再问名字。" },
          { es: "Hola, Marta. Es mi hermana.", zh: "你好，Marta。这是我妹妹。", en: "Hi, Marta. This is my sister.", correct: false, whyZh: "她是 Javier 的妹妹，不是你的。" },
          { es: "Hola, Marta. Mucho gusto.", zh: "你好，Marta。很高兴认识你。", en: "Hi, Marta. Nice to meet you.", correct: true }
        ],
        alsoOk: ["Hola, Marta. Encantado.", "Hola, Marta. Encantada.", "Mucho gusto, Marta."],
        note: "profesor = 老师（男）；女老师是 profesora。"
      },
      { who: "them", es: "¡Adiós, Lin! ¡Hasta luego!", zh: "再见，Lin！回头见！", en: "Bye, Lin! See you later!" },
      { who: "me",
        hintZh: "跟他们说再见。", hintEn: "Say goodbye to them.",
        options: [
          { es: "¡Adiós, hasta luego!", zh: "再见，回头见！", en: "Bye, see you later!", correct: true },
          { es: "¡Hola, Javier!", zh: "你好，Javier！", en: "Hi, Javier!", correct: false, whyZh: "hola 是见面时说的，告别要说 adiós。" },
          { es: "Me llamo Lin.", zh: "我叫 Lin。", en: "My name is Lin.", correct: false, whyZh: "你已经说过名字了，现在是告别。" }
        ],
        alsoOk: ["¡Adiós!", "¡Hasta luego!", "¡Adiós, Javier! ¡Hasta luego!"],
        note: ""
      }
    ]
  },

  // 3 —— 礼貌用语
  {
    id: "polite",
    titleZh: "礼貌用语", titleEn: "Being polite",
    sceneZh: "在马德里的一家咖啡馆，服务员 Luis 来招呼你。", sceneEn: "In a café in Madrid, the waiter Luis comes to serve you.",
    partner: "Luis",
    lines: [
      { who: "them", es: "Buenos días. ¿Un café?", zh: "早上好。来杯咖啡吗？", en: "Good morning. A coffee?" },
      { who: "me",
        hintZh: "说好的，请来一杯。", hintEn: "Say yes, please.",
        options: [
          { es: "Sí, de nada.", zh: "好的，不客气。", en: "Yes, you're welcome.", correct: false, whyZh: "de nada 是“不客气”，用来回答 gracias；请求时要说 por favor。" },
          { es: "Lo siento.", zh: "对不起。", en: "I'm sorry.", correct: false, whyZh: "你没做错事，不用道歉。" },
          { es: "Sí, por favor.", zh: "好的，麻烦了。", en: "Yes, please.", correct: true }
        ],
        alsoOk: ["Sí, gracias.", "Un café, por favor.", "Sí, un café, por favor."],
        note: ""
      },
      { who: "them", es: "Aquí tiene.", zh: "给您。", en: "Here you are." },
      { who: "me",
        hintZh: "他把咖啡端给你了，谢谢他。", hintEn: "He brings your coffee. Thank him.",
        options: [
          { es: "Muchas gracias.", zh: "非常感谢。", en: "Thank you very much.", correct: true },
          { es: "Por favor.", zh: "请。", en: "Please.", correct: false, whyZh: "咖啡已经给你了，这时要说谢谢，不是“请”。" },
          { es: "Perdón.", zh: "对不起。", en: "Sorry.", correct: false, whyZh: "你没做错事，这时该道谢。" }
        ],
        alsoOk: ["Gracias."],
        note: "新词：Aquí tiene = 给您，递东西给别人时说。"
      },
      { who: "them", es: "De nada.", zh: "不客气。", en: "You're welcome." },
      { who: "me",
        hintZh: "过了一会儿，你想叫住他：“打扰一下！”", hintEn: "A bit later you want to get his attention: \"Excuse me!\"",
        options: [
          { es: "¡Lo siento mucho!", zh: "非常抱歉！", en: "I'm very sorry!", correct: false, whyZh: "lo siento 是真诚的道歉；想引起别人注意要说 perdón。" },
          { es: "¡Perdón!", zh: "打扰一下！", en: "Excuse me!", correct: true },
          { es: "¡De nada!", zh: "不客气！", en: "You're welcome!", correct: false, whyZh: "de nada 是回答 gracias 的，不能用来叫人。" }
        ],
        alsoOk: ["¡Perdón, señor!"],
        note: ""
      },
      { who: "them", es: "¿Sí?", zh: "什么事？", en: "Yes?" },
      { who: "me",
        hintZh: "你的朋友到了，请他再来一杯咖啡。", hintEn: "Your friend has arrived. Ask for another coffee, please.",
        options: [
          { es: "Otra café, por favor.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "café 是阳性（el café），要用 otro，不用 otra。" },
          { es: "Otro café, de nada.", zh: "再来一杯咖啡，不客气。", en: "Another coffee, you're welcome.", correct: false, whyZh: "请求时要说 por favor；de nada 是“不客气”。" },
          { es: "Otro café, por favor.", zh: "请再来一杯咖啡。", en: "Another coffee, please.", correct: true }
        ],
        alsoOk: ["Otro, por favor.", "Un café, por favor."],
        note: "新词：otro / otra = 另一个，要跟名词的阴阳性一致：otro café。"
      },
      { who: "them", es: "Aquí tiene. ¡Ay, perdón!", zh: "给您。哎呀，对不起！", en: "Here you are. Oh, sorry!" },
      { who: "me",
        hintZh: "他不小心洒了一点咖啡，向你道歉。告诉他没关系。", hintEn: "He spilled a little coffee and apologizes. Tell him it's OK.",
        options: [
          { es: "No pasa nada.", zh: "没关系。", en: "It's OK. / No problem.", correct: true },
          { es: "De nada.", zh: "不客气。", en: "You're welcome.", correct: false, whyZh: "de nada 是回答“谢谢”的；别人道歉时要说“没关系”。" },
          { es: "Por favor.", zh: "请。", en: "Please.", correct: false, whyZh: "por favor 用于请求别人做事，这里接不上。" }
        ],
        alsoOk: ["No pasa nada, gracias."],
        note: "新词：No pasa nada = 没关系，西班牙非常常用。"
      },
      { who: "them", es: "Gracias, muy amable.", zh: "谢谢，您真好。", en: "Thank you, that's very kind.",
        note: "muy amable = 您真好；您真客气，感谢别人体贴时常说。" }
    ]
  },

  // 4 —— 介绍家人
  {
    id: "family",
    titleZh: "介绍家人", titleEn: "Talking about your family",
    sceneZh: "朋友 Lucía 在看你手机里的一张全家福。", sceneEn: "Your friend Lucía is looking at a family photo on your phone.",
    partner: "Lucía",
    lines: [
      { who: "them", es: "¡Qué bonita foto! ¿Es tu familia?", zh: "照片真好看！这是你的家人吗？", en: "What a lovely photo! Is this your family?" },
      { who: "me",
        hintZh: "说是的，这是你的家人。", hintEn: "Say yes, this is your family.",
        options: [
          { es: "Sí, soy mi familia.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "soy 是“我是”；说“这是……”要用 es。" },
          { es: "Sí, es mi familia.", zh: "是的，这是我的家人。", en: "Yes, this is my family.", correct: true },
          { es: "Sí, es tu familia.", zh: "是的，这是你的家人。", en: "Yes, this is your family.", correct: false, whyZh: "tu 是“你的”；说自己的家人要用 mi（我的）。" }
        ],
        alsoOk: ["Es mi familia.", "Sí, es mi familia, gracias."],
        note: "新词：bonito / bonita = 好看的；漂亮的。la foto（照片）是阴性，所以说 bonita。¡Qué…! = 真……啊！"
      },
      { who: "them", es: "¿Y ella? ¿Es tu hermana?", zh: "那她呢？是你姐姐吗？", en: "And her? Is she your sister?" },
      { who: "me",
        hintZh: "说不是，她是你妈妈。", hintEn: "Say no, she's your mother.",
        options: [
          { es: "No, es mi padre.", zh: "不是，这是我爸爸。", en: "No, this is my father.", correct: false, whyZh: "padre 是爸爸；她是女性，妈妈是 madre。" },
          { es: "No, soy mi madre.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "soy 是“我是”；说“她是”要用 es。" },
          { es: "No, es mi madre.", zh: "不是，这是我妈妈。", en: "No, this is my mother.", correct: true }
        ],
        alsoOk: ["No, ella es mi madre.", "No, es mi mamá."],
        note: ""
      },
      { who: "them", es: "¡Ah! ¿Y él?", zh: "啊！那他呢？", en: "Oh! And him?" },
      { who: "me",
        hintZh: "说他是你爷爷。", hintEn: "Say he's your grandfather.",
        options: [
          { es: "Es mi abuelo.", zh: "这是我爷爷。", en: "This is my grandfather.", correct: true },
          { es: "Es mi abuela.", zh: "这是我奶奶。", en: "This is my grandmother.", correct: false, whyZh: "abuela 是奶奶；他是男性，要用 -o 结尾的 abuelo。" },
          { es: "Está mi abuelo.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "说身份、关系（他是谁）要用 ser：es，不用 estar。" }
        ],
        alsoOk: ["Él es mi abuelo."],
        note: ""
      },
      { who: "them", es: "¿Tienes hermanos?", zh: "你有兄弟姐妹吗？", en: "Do you have any brothers or sisters?" },
      { who: "me",
        hintZh: "说你有一个哥哥和一个姐姐。", hintEn: "Say you have a brother and a sister.",
        options: [
          { es: "Sí, tengo una hermano y un hermana.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "阴阳性反了：hermano 是阳性用 un，hermana 是阴性用 una。" },
          { es: "Sí, tengo un hermano y una hermana.", zh: "有，我有一个哥哥和一个姐姐。", en: "Yes, I have a brother and a sister.", correct: true },
          { es: "Sí, tengo uno hermano y una hermana.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "uno 放在阳性名词前要变成 un。" }
        ],
        alsoOk: ["Tengo un hermano y una hermana.", "Sí, un hermano y una hermana."],
        note: "新词：¿Tienes…? = 你有……吗？；tengo = 我有。它们来自不规则动词 tener，以后再学。hermanos 在这里指“兄弟姐妹”。"
      },
      { who: "them", es: "¿Y cómo se llama tu hermana?", zh: "那你姐姐叫什么名字？", en: "And what's your sister's name?" },
      { who: "me",
        hintZh: "说她叫 Mei。", hintEn: "Say her name is Mei.",
        options: [
          { es: "Me llamo Mei.", zh: "我叫 Mei。", en: "My name is Mei.", correct: false, whyZh: "me llamo 是“我叫”；说“她叫”要用 se llama。" },
          { es: "Te llamas Mei.", zh: "你叫 Mei。", en: "Your name is Mei.", correct: false, whyZh: "te llamas 是“你叫”；说“她叫”要用 se llama。" },
          { es: "Se llama Mei.", zh: "她叫 Mei。", en: "Her name is Mei.", correct: true }
        ],
        alsoOk: ["Mi hermana se llama Mei."],
        note: "新词：se llama = 他/她叫。me llamo 我叫，te llamas 你叫，se llama 他/她叫。"
      },
      { who: "them", es: "¡Qué bonito nombre!", zh: "名字真好听！", en: "What a pretty name!",
        note: "新词：el nombre = 名字，阳性，所以用 bonito。" }
    ]
  },

  // 5 —— 数字
  {
    id: "numbers",
    titleZh: "数一数", titleEn: "Counting",
    sceneZh: "你在 Lucía 家做客，她六岁的儿子 Pablo 想和你玩数数游戏。", sceneEn: "You're visiting Lucía, and her six-year-old son Pablo wants to play a counting game with you.",
    partner: "Pablo",
    lines: [
      { who: "them", es: "¡Hola! Uno, dos, tres… ¡tú!", zh: "你好！一、二、三……该你了！", en: "Hi! One, two, three… your turn!" },
      { who: "me",
        hintZh: "接着往下数三个数。", hintEn: "Count the next three numbers.",
        options: [
          { es: "Cuatro, cinco, seis.", zh: "四、五、六。", en: "Four, five, six.", correct: true },
          { es: "Cuatro, seis, cinco.", zh: "四、六、五。", en: "Four, six, five.", correct: false, whyZh: "顺序错了：五（cinco）在六（seis）前面。" },
          { es: "Tres, cuatro, cinco.", zh: "三、四、五。", en: "Three, four, five.", correct: false, whyZh: "三（tres）他已经数过了，要从四开始。" }
        ],
        alsoOk: ["Cuatro, cinco y seis."],
        note: ""
      },
      { who: "them", es: "¡Muy bien! ¿Cuántos hermanos tienes?", zh: "真棒！你有几个兄弟姐妹？", en: "Very good! How many brothers and sisters do you have?" },
      { who: "me",
        hintZh: "说你有两个兄弟姐妹。", hintEn: "Say you have two siblings.",
        options: [
          { es: "Tengo dos hermano.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "两个以上要用复数：hermanos。" },
          { es: "Tengo dos hermanos.", zh: "我有两个兄弟姐妹。", en: "I have two siblings.", correct: true },
          { es: "Tengo diez hermanos.", zh: "我有十个兄弟姐妹。", en: "I have ten siblings.", correct: false, whyZh: "diez 是十，你只有两个（dos）。" }
        ],
        alsoOk: ["Dos.", "Tengo dos."],
        note: "新词：¿Cuántos…? = 几个？多少？问阳性名词用 cuántos，阴性名词用 cuántas。"
      },
      { who: "them", es: "Yo tengo una hermana. ¿Dos y tres son…?", zh: "我有一个姐姐。二加三等于……？", en: "I have a sister. Two and three make…?" },
      { who: "me",
        hintZh: "算一算，回答他。", hintEn: "Work it out and answer him.",
        options: [
          { es: "Son seis.", zh: "等于六。", en: "That makes six.", correct: false, whyZh: "二加三等于五（cinco），seis 是六。" },
          { es: "Soy cinco.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "soy 是“我是”，这里说的是算术结果。" },
          { es: "Son cinco.", zh: "等于五。", en: "That makes five.", correct: true }
        ],
        alsoOk: ["Cinco.", "Dos y tres son cinco.", "Es cinco."],
        note: "算术里“等于”一般说 son：Dos y tres son cinco。"
      },
      { who: "them", es: "¡Sí! ¿Y cuatro y cuatro?", zh: "对！那四加四呢？", en: "Yes! And four and four?" },
      { who: "me",
        hintZh: "再算一算。", hintEn: "Work it out again.",
        options: [
          { es: "Son ocho.", zh: "等于八。", en: "That makes eight.", correct: true },
          { es: "Son nueve.", zh: "等于九。", en: "That makes nine.", correct: false, whyZh: "四加四等于八（ocho），nueve 是九。" },
          { es: "Son siete.", zh: "等于七。", en: "That makes seven.", correct: false, whyZh: "四加四等于八（ocho），siete 是七。" }
        ],
        alsoOk: ["Ocho.", "Cuatro y cuatro son ocho.", "Es ocho."],
        note: ""
      },
      { who: "them", es: "¡Bravo! ¿Cuántos dedos hay en una mano?", zh: "太棒了！一只手有几根手指？", en: "Great! How many fingers are there on one hand?" },
      { who: "me",
        hintZh: "告诉他：一只手有五根手指。", hintEn: "Tell him: there are five.",
        options: [
          { es: "Hay diez.", zh: "有十根。", en: "There are ten.", correct: false, whyZh: "两只手才是十根（diez），一只手是五根（cinco）。" },
          { es: "Hay cinco.", zh: "有五根。", en: "There are five.", correct: true },
          { es: "Hay cinco dedo.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "五根要用复数：dedos。" }
        ],
        alsoOk: ["Cinco.", "Hay cinco dedos.", "Hay cinco dedos en una mano."],
        note: "新词：hay = 有，不变位，单数复数都用 hay；el dedo = 手指。la mano（手）是阴性，所以说 una mano。"
      },
      { who: "them", es: "¡Sí! ¡Muy bien!", zh: "对！真棒！", en: "Yes! Very good!" }
    ]
  },

  // 6 —— 颜色
  {
    id: "colors",
    titleZh: "说颜色", titleEn: "Talking about colors",
    sceneZh: "你和朋友 Sofía 一起看一本图画书。", sceneEn: "You and your friend Sofía are looking at a picture book.",
    partner: "Sofía",
    lines: [
      { who: "them", es: "Mira, ¿de qué color es el sol?", zh: "你看，太阳是什么颜色的？", en: "Look, what color is the sun?" },
      { who: "me",
        hintZh: "说太阳是黄色的。", hintEn: "Say the sun is yellow.",
        options: [
          { es: "El sol es amarilla.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "el sol 是阳性，颜色要用阳性 amarillo。" },
          { es: "El sol está amarillo.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "颜色是本来的特点，用 ser（es），不用 estar。" },
          { es: "El sol es amarillo.", zh: "太阳是黄色的。", en: "The sun is yellow.", correct: true }
        ],
        alsoOk: ["Es amarillo.", "Amarillo."],
        note: "新词：¿De qué color es…? = ……是什么颜色？；mira = 你看。"
      },
      { who: "them", es: "¿Y la flor?", zh: "那花呢？", en: "And the flower?" },
      { who: "me",
        hintZh: "图里的花是红色的。", hintEn: "The flower in the picture is red.",
        options: [
          { es: "La flor es roja.", zh: "花是红色的。", en: "The flower is red.", correct: true },
          { es: "La flor es rojo.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "la flor 是阴性，rojo 要变成 roja。" },
          { es: "La flor es verde.", zh: "花是绿色的。", en: "The flower is green.", correct: false, whyZh: "verde 是绿色；图里的花是红色的。" }
        ],
        alsoOk: ["Es roja.", "Roja."],
        note: ""
      },
      { who: "them", es: "¿Y el mar? ¿Es verde?", zh: "那大海呢？是绿色的吗？", en: "And the sea? Is it green?" },
      { who: "me",
        hintZh: "说不是，大海是蓝色的。", hintEn: "Say no, the sea is blue.",
        options: [
          { es: "Sí, el mar es verde.", zh: "是的，大海是绿色的。", en: "Yes, the sea is green.", correct: false, whyZh: "图里的大海是蓝色的，要说 no。" },
          { es: "No, el mar es azul.", zh: "不是，大海是蓝色的。", en: "No, the sea is blue.", correct: true },
          { es: "No, el mar es azula.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "azul 阴阳性同形，没有 azula 这个词。" }
        ],
        alsoOk: ["No, es azul."],
        note: ""
      },
      { who: "them", es: "¿Y los elefantes?", zh: "那些大象呢？", en: "And the elephants?" },
      { who: "me",
        hintZh: "说它们是灰色的。", hintEn: "Say they are gray.",
        options: [
          { es: "Es gris.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "los elefantes 是复数，“是”要用 son。" },
          { es: "Son gris.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "名词是复数，颜色也要变复数：gris → grises。" },
          { es: "Son grises.", zh: "它们是灰色的。", en: "They are gray.", correct: true }
        ],
        alsoOk: ["Los elefantes son grises."],
        note: ""
      },
      { who: "them", es: "¡Muy bien! ¿Y tu color favorito?", zh: "真棒！那你最喜欢什么颜色？", en: "Very good! And your favorite color?" },
      { who: "me",
        hintZh: "说你最喜欢的颜色是蓝色。", hintEn: "Say your favorite color is blue.",
        options: [
          { es: "Mi color favorito es el azul.", zh: "我最喜欢的颜色是蓝色。", en: "My favorite color is blue.", correct: true },
          { es: "Mi color favorita es el azul.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "el color 是阳性，要用 favorito。" },
          { es: "Tu color favorito es el azul.", zh: "你最喜欢的颜色是蓝色。", en: "Your favorite color is blue.", correct: false, whyZh: "tu 是“你的”；说自己的要用 mi。" }
        ],
        alsoOk: ["Mi color favorito es azul.", "El azul."],
        note: "新词：favorito / favorita = 最喜欢的。el color 是阳性。"
      },
      { who: "them", es: "¡Y mi color favorito es el rojo!", zh: "我最喜欢的颜色是红色！", en: "And my favorite color is red!" }
    ]
  },

  // 7 —— 来自哪里、做什么工作
  {
    id: "origin-job",
    titleZh: "你来自哪里？做什么？", titleEn: "Where are you from? What do you do?",
    sceneZh: "在语言交流活动上，你认识了西班牙人 Elena。", sceneEn: "At a language exchange, you meet Elena, who is Spanish.",
    partner: "Elena",
    lines: [
      { who: "them", es: "Hola, soy Elena. ¿De dónde eres?", zh: "你好，我是 Elena。你是哪里人？", en: "Hi, I'm Elena. Where are you from?" },
      { who: "me",
        hintZh: "说你来自中国。", hintEn: "Say you're from China.",
        options: [
          { es: "Estoy de China.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "说来自哪里用 ser de，不用 estar。" },
          { es: "Soy de China.", zh: "我来自中国。", en: "I'm from China.", correct: true },
          { es: "Soy en China.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "“来自”要用 de；en 是“在”。" }
        ],
        alsoOk: ["Soy chino.", "Soy china.", "Soy chino, de China.", "Soy china, de China."],
        note: "新词：¿De dónde eres? = 你是哪里人？dónde 带重音。也可以说 Soy chino（男）/ Soy china（女）。"
      },
      { who: "them", es: "¡Ah, de China! Yo soy española, de Madrid.", zh: "啊，中国！我是西班牙人，马德里的。", en: "Oh, from China! I'm Spanish, from Madrid." },
      { who: "me",
        hintZh: "问她：你是老师吗？", hintEn: "Ask her: are you a teacher?",
        options: [
          { es: "¿Eres profesora?", zh: "你是老师吗？", en: "Are you a teacher?", correct: true },
          { es: "¿Eres profesor?", zh: "你是（男）老师吗？", en: "Are you a (male) teacher?", correct: false, whyZh: "Elena 是女性，要用阴性 profesora。" },
          { es: "¿Estás profesora?", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "职业用 ser（eres），不用 estar。" }
        ],
        alsoOk: ["¿Tú eres profesora?"],
        note: ""
      },
      { who: "them", es: "No, soy médica. ¿Y tú? ¿Eres estudiante?", zh: "不是，我是医生。你呢？你是学生吗？", en: "No, I'm a doctor. And you? Are you a student?" },
      { who: "me",
        hintZh: "说是的，你是学生，在学西班牙语。", hintEn: "Say yes, you're a student and you study Spanish.",
        options: [
          { es: "Sí, estoy estudiante. Estudio español.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "职业、身份用 ser：soy estudiante。" },
          { es: "Sí, soy estudiante. Estudia español.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "estudia 是“他/她/您学”；说“我学”要用 -o 词尾：estudio。" },
          { es: "Sí, soy estudiante. Estudio español.", zh: "是的，我是学生。我学西班牙语。", en: "Yes, I'm a student. I study Spanish.", correct: true }
        ],
        alsoOk: ["Sí, soy estudiante y estudio español.", "Soy estudiante. Estudio español."],
        note: "新词：médico / médica = 医生；estudiar = 学习，规则 -ar 动词，变位和 hablar 一样：estudio 我学。"
      },
      { who: "them", es: "¡Muy bien! ¿Tu padre es médico también?", zh: "真好！你爸爸也是医生吗？", en: "Great! Is your father a doctor too?" },
      { who: "me",
        hintZh: "说不是，你爸爸是老师。", hintEn: "Say no, your father is a teacher.",
        options: [
          { es: "No, mi padre es un profesora.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "说职业不加 un；而且爸爸是男性，要用 profesor。" },
          { es: "No, mi padre es profesor.", zh: "不是，我爸爸是老师。", en: "No, my father is a teacher.", correct: true },
          { es: "No, mi padre está profesor.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "职业用 ser（es），不用 estar。" }
        ],
        alsoOk: ["No, es profesor."],
        note: "新词：también = 也。"
      },
      { who: "them", es: "¿Y tu madre?", zh: "那你妈妈呢？", en: "And your mother?" },
      { who: "me",
        hintZh: "说你妈妈是医生。", hintEn: "Say your mother is a doctor.",
        options: [
          { es: "Mi madre soy médica.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "soy 是“我是”；mi madre = ella，要用 es。" },
          { es: "Mi madre eres médica.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "eres 是“你是”；mi madre = ella，要用 es。" },
          { es: "Mi madre es médica.", zh: "我妈妈是医生。", en: "My mother is a doctor.", correct: true }
        ],
        alsoOk: ["Es médica."],
        note: ""
      },
      { who: "them", es: "¡Como yo!", zh: "和我一样！", en: "Just like me!",
        note: "这里的 como = 像……一样，和 comer 的“我吃”（como）拼写相同，意思不同。" }
    ]
  },

  // 8 —— 你在哪儿、心情、语言、住哪儿（estar + 规则动词）
  {
    id: "phone-call",
    titleZh: "打电话聊近况", titleEn: "A catch-up phone call",
    sceneZh: "晚上，你的西班牙朋友 Isabel 给你打电话。", sceneEn: "In the evening, your Spanish friend Isabel calls you.",
    partner: "Isabel",
    lines: [
      { who: "them", es: "¡Hola, Lin! ¿Dónde estás?", zh: "嗨，Lin！你在哪儿？", en: "Hi, Lin! Where are you?" },
      { who: "me",
        hintZh: "说你在家。", hintEn: "Say you're at home.",
        options: [
          { es: "Estoy en casa.", zh: "我在家。", en: "I'm at home.", correct: true },
          { es: "Soy en casa.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "说位置（在哪儿）用 estar，不用 ser。" },
          { es: "Está en casa.", zh: "他/她在家。", en: "He / She is at home.", correct: false, whyZh: "está 是“他/她在”；说“我在”要用 estoy。" }
        ],
        alsoOk: ["En casa.", "Estoy en casa, ¿y tú?"],
        note: "¿Dónde estás? = 你在哪儿？en casa = 在家。"
      },
      { who: "them", es: "¿Y cómo estás?", zh: "你怎么样？", en: "And how are you?" },
      { who: "me",
        hintZh: "说你今天很难过。", hintEn: "Say you're sad today.",
        options: [
          { es: "Hoy soy triste.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "今天的心情是暂时的状态，用 estar，不用 ser。" },
          { es: "Hoy estás triste.", zh: "你今天很难过。", en: "You're sad today.", correct: false, whyZh: "estás 是“你……”；说自己要用 estoy。" },
          { es: "Hoy estoy triste.", zh: "我今天很难过。", en: "I'm sad today.", correct: true }
        ],
        alsoOk: ["Estoy triste hoy.", "Estoy triste."],
        note: "hoy = 今天；triste = 难过的，阴阳性同形。"
      },
      { who: "them", es: "¡Ay! ¿Por qué?", zh: "哎呀！为什么？", en: "Oh no! Why?" },
      { who: "me",
        hintZh: "说因为你的家人住在中国。", hintEn: "Say it's because your family lives in China.",
        options: [
          { es: "Porque mi familia viven en China.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "mi familia 是单数（= ella），要用 vive，不用 viven。" },
          { es: "Porque mi familia vive en China.", zh: "因为我的家人住在中国。", en: "Because my family lives in China.", correct: true },
          { es: "Por qué mi familia vive en China.", zh: "（拼写错误）", en: "(spelling mistake)", correct: false, whyZh: "回答“因为”要写成 porque（连写、不带重音）；por qué 是“为什么”。" }
        ],
        alsoOk: ["Porque mi familia está en China."],
        note: "新词：¿Por qué? = 为什么？，分开写、带重音；porque = 因为，连写、不带重音。"
      },
      { who: "them", es: "Lo siento. ¿Hablas chino con ellos?", zh: "真遗憾。你和他们说中文吗？", en: "I'm sorry. Do you speak Chinese with them?" },
      { who: "me",
        hintZh: "说是的，你和他们说中文。", hintEn: "Say yes, you speak Chinese with them.",
        options: [
          { es: "Sí, hablo chino con ellos.", zh: "是的，我和他们说中文。", en: "Yes, I speak Chinese with them.", correct: true },
          { es: "Sí, hablas chino con ellos.", zh: "是的，你和他们说中文。", en: "Yes, you speak Chinese with them.", correct: false, whyZh: "hablas 是“你说”；说“我说”要用 -o 词尾：hablo。" },
          { es: "Sí, hablo china con ellos.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "语言名称用阳性：el chino（中文）；china 是“中国女性”。" }
        ],
        alsoOk: ["Sí, hablo chino."],
        note: "新词：con = 和；跟。这里的 lo siento 不是道歉，而是表示同情：“真遗憾”。"
      },
      { who: "them", es: "¿Y dónde comes? ¿En casa?", zh: "那你在哪儿吃饭？在家吗？", en: "And where do you eat? At home?" },
      { who: "me",
        hintZh: "说是的，你在家吃饭。", hintEn: "Say yes, you eat at home.",
        options: [
          { es: "Sí, come en casa.", zh: "是的，他/她在家吃饭。", en: "Yes, he / she eats at home.", correct: false, whyZh: "come 是“他/她/您吃”；说“我吃”要用 como。" },
          { es: "Sí, vivo en casa.", zh: "是的，我住在家里。", en: "Yes, I live at home.", correct: false, whyZh: "vivo 是“我住”；她问的是吃饭（comer），要用 como。" },
          { es: "Sí, como en casa.", zh: "是的，我在家吃饭。", en: "Yes, I eat at home.", correct: true }
        ],
        alsoOk: ["Sí, en casa.", "Como en casa."],
        note: ""
      },
      { who: "them", es: "¿Comemos mañana en mi casa?", zh: "明天来我家一起吃饭吧？", en: "Shall we eat at my place tomorrow?" },
      { who: "me",
        hintZh: "高兴地接受邀请，谢谢她，说明天见。", hintEn: "Happily accept, thank her, and say see you tomorrow.",
        options: [
          { es: "¡De nada! ¡Hasta mañana!", zh: "不客气！明天见！", en: "You're welcome! See you tomorrow!", correct: false, whyZh: "是她在邀请你，你应该说谢谢；de nada 是回答 gracias 的。" },
          { es: "¡Sí, muchas gracias! ¡Hasta mañana!", zh: "好呀，非常感谢！明天见！", en: "Yes, thank you so much! See you tomorrow!", correct: true },
          { es: "¡Lo siento! ¡Hasta mañana!", zh: "对不起！明天见！", en: "Sorry! See you tomorrow!", correct: false, whyZh: "lo siento 听起来像在拒绝邀请，后面又说明天见，前后接不上。" }
        ],
        alsoOk: ["¡Sí, gracias! ¡Hasta mañana!", "¡Muchas gracias! ¡Hasta mañana!"],
        note: "新词：mañana = 明天；hasta mañana = 明天见。（la mañana 还有“上午”的意思。）"
      },
      { who: "them", es: "¡Genial! ¡Hasta mañana, Lin!", zh: "太好了！明天见，Lin！", en: "Great! See you tomorrow, Lin!",
        note: "新词：¡Genial! = 太好了！太棒了！，西班牙口语很常用。" }
    ]
  },

  // ===== 阶段 19 新增（只写西语 + 中文；配合冒险地图的 4 个新地区）=====
  // 9 —— 餐厅点今日套餐
  {
    id: "restaurant-menu",
    titleZh: "点今日套餐",
    sceneZh: "中午，你和朋友走进一家小餐厅。服务员 Manuel 过来招呼你们。",
    partner: "Manuel",
    lines: [
      { who: "them", es: "¡Buenas tardes! ¿Cuántos son?", zh: "下午好！你们几位？",
        note: "¿Cuántos son? = 你们是几个人？" },
      { who: "me",
        hintZh: "你们两个人，要一张两人桌。",
        options: [
          { es: "La cuenta, por favor.", zh: "请买单。", correct: false, whyZh: "还没吃饭呢！la cuenta 是吃完饭买单时说的。" },
          { es: "Una mesa para dos, por favor.", zh: "请给我们一张两人桌。", correct: true },
          { es: "Son dos euros.", zh: "一共两欧元。", correct: false, whyZh: "他问你们几位，不是问价钱。" }
        ],
        alsoOk: ["Para dos, por favor.", "Somos dos.", "Una mesa para dos."],
        note: ""
      },
      { who: "them", es: "Muy bien. Aquí tienen la carta. Hoy tenemos menú del día.", zh: "好的。这是菜单。今天有今日套餐。",
        note: "aquí tienen = 给你们（对两个人以上说）。menú del día = 今日套餐，西班牙午饭时很常见。" },
      { who: "me",
        hintZh: "请他推荐一下。",
        options: [
          { es: "¿Dónde está la estación?", zh: "车站在哪儿？", correct: false, whyZh: "这是问路的话；现在要点菜。" },
          { es: "¡Hasta luego!", zh: "回头见！", correct: false, whyZh: "刚坐下，还不是告别的时候。" },
          { es: "¿Qué me recomienda?", zh: "您推荐什么？", correct: true }
        ],
        alsoOk: ["¿Qué recomienda?", "¿Qué hay de primero?"],
        note: "recomienda = 您推荐（来自 recomendar）。"
      },
      { who: "them", es: "De primero, sopa o ensalada. De segundo, pollo o pescado.", zh: "第一道菜有汤或沙拉。第二道菜有鸡肉或鱼。",
        note: "o = 或者。" },
      { who: "me",
        hintZh: "第一道菜要沙拉。",
        options: [
          { es: "De primero, una ensalada.", zh: "第一道菜我要沙拉。", correct: true },
          { es: "De postre, una ensalada.", zh: "甜点我要沙拉。", correct: false, whyZh: "de postre 是甜点；沙拉是第一道菜，要说 de primero。" },
          { es: "La ensalada está fría.", zh: "沙拉是凉的。", correct: false, whyZh: "菜还没上呢；现在要说你点什么。" }
        ],
        alsoOk: ["Una ensalada, por favor.", "De primero, ensalada.", "De primero, la ensalada."],
        note: ""
      },
      { who: "them", es: "¿Y de segundo?", zh: "第二道菜呢？" },
      { who: "me",
        hintZh: "第二道菜要鱼。",
        options: [
          { es: "De segundo, pez.", zh: "（错误说法）", correct: false, whyZh: "pez 是水里活的鱼；做成菜的鱼要说 pescado。" },
          { es: "Sin cebolla, por favor.", zh: "请不要放洋葱。", correct: false, whyZh: "他在问第二道菜要什么。" },
          { es: "De segundo, pescado.", zh: "第二道菜我要鱼。", correct: true }
        ],
        alsoOk: ["Pescado, por favor.", "De segundo, el pescado."],
        note: ""
      },
      { who: "them", es: "¿Y para beber?", zh: "喝点什么？" },
      { who: "me",
        hintZh: "要一杯橙汁。",
        options: [
          { es: "Un zumo de naranja, por favor.", zh: "请来一杯橙汁。", correct: true },
          { es: "Un zumo de patata, por favor.", zh: "请来一杯土豆汁。", correct: false, whyZh: "patata 是土豆，可没有土豆汁！橙子是 naranja。" },
          { es: "Tengo sed.", zh: "我渴了。", correct: false, whyZh: "他问你喝什么，要直接说出饮料的名字。" }
        ],
        alsoOk: ["Un zumo, por favor.", "Un zumo de naranja."],
        note: "zumo（果汁）是西班牙的说法；拉美说 jugo。"
      },
      { who: "them", es: "Muy bien. ¡Que aproveche!", zh: "好的。祝您胃口好！" },
      { who: "me",
        hintZh: "谢谢他。",
        options: [
          { es: "De nada.", zh: "不客气。", correct: false, whyZh: "de nada 是回答“谢谢”的；他祝你吃好，你要说谢谢。" },
          { es: "Muchas gracias.", zh: "非常感谢。", correct: true },
          { es: "Lo siento.", zh: "对不起。", correct: false, whyZh: "你没做错事，不用道歉。" }
        ],
        alsoOk: ["Gracias.", "¡Gracias!"],
        note: ""
      }
    ]
  },

  // 10 —— 超市付钱
  {
    id: "supermarket-pay",
    titleZh: "在超市付钱",
    sceneZh: "你在超市买好了东西，来到收银台。收银员 Rosa 笑着跟你打招呼。",
    partner: "Rosa",
    lines: [
      { who: "them", es: "¡Buenos días! ¿Necesita bolsa?", zh: "早上好！您要袋子吗？" },
      { who: "me",
        hintZh: "说要，请她给你一个袋子。",
        options: [
          { es: "Sí, una botella, por favor.", zh: "要，请给我一个瓶子。", correct: false, whyZh: "botella 是瓶子；她问的是袋子 bolsa。" },
          { es: "Sí, una bolsa, por favor.", zh: "要，请给我一个袋子。", correct: true },
          { es: "¿Quién es el último?", zh: "谁是最后一位？", correct: false, whyZh: "你已经排到收银台了，不用再问谁是最后一个。" }
        ],
        alsoOk: ["Sí, por favor.", "Sí, gracias.", "Una bolsa, por favor."],
        note: ""
      },
      { who: "them", es: "Son doce euros con cincuenta.", zh: "一共十二欧元五十分。",
        note: "con cincuenta = 五十分（欧分）。价格常常这样说。" },
      { who: "me",
        hintZh: "问能不能刷卡。",
        options: [
          { es: "¿Cuánto cuesta?", zh: "多少钱？", correct: false, whyZh: "她刚刚告诉你一共多少钱了。" },
          { es: "¿Puedo pagar con tarjeta?", zh: "我能刷卡吗？", correct: true },
          { es: "Es muy barato.", zh: "很便宜。", correct: false, whyZh: "你想问能不能刷卡，不是评价价格。" }
        ],
        alsoOk: ["Con tarjeta, por favor.", "¿Con tarjeta?"],
        note: ""
      },
      { who: "them", es: "Lo siento, la máquina no funciona. ¿Tiene efectivo?", zh: "抱歉，刷卡机坏了。您有现金吗？",
        note: "la máquina = 机器；no funciona = 不能用了、坏了。" },
      { who: "me",
        hintZh: "说有，把二十欧元递给她。",
        options: [
          { es: "Tengo una reserva.", zh: "我有预订。", correct: false, whyZh: "这是在酒店、餐厅说的；她问你有没有现金。" },
          { es: "No tengo dinero.", zh: "我没有钱。", correct: false, whyZh: "你钱包里有二十欧元现金，可以付。" },
          { es: "Sí, aquí tiene veinte euros.", zh: "有，给您二十欧元。", correct: true }
        ],
        alsoOk: ["Sí, pago en efectivo.", "Sí, aquí tiene.", "Aquí tiene veinte euros."],
        note: "aquí tiene = 给您（递东西时说）。"
      },
      { who: "them", es: "Gracias. Aquí tiene el cambio: siete euros con cincuenta.", zh: "谢谢。这是找您的钱：七欧元五十分。" },
      { who: "me",
        hintZh: "谢谢她，然后道别。",
        options: [
          { es: "Gracias, ¡hasta luego!", zh: "谢谢，再见！", correct: true },
          { es: "¿Dónde están los huevos?", zh: "鸡蛋在哪儿？", correct: false, whyZh: "钱都付完了，现在该道别了。" },
          { es: "Una mesa para dos.", zh: "一张两人桌。", correct: false, whyZh: "这是在餐厅说的话。" }
        ],
        alsoOk: ["Muchas gracias. ¡Adiós!", "Gracias, adiós.", "¡Gracias!"],
        note: ""
      },
      { who: "them", es: "¡Hasta luego! ¡Que tenga un buen día!", zh: "再见！祝您今天愉快！",
        note: "¡Que tenga un buen día! = 祝您今天过得愉快！（对 usted 说）" }
    ]
  },

  // 11 —— 第一节西语课
  {
    id: "school-class",
    titleZh: "第一节西语课",
    sceneZh: "今天是你在语言学校上的第一节课。老师 Marisa 走进教室。",
    partner: "Marisa",
    lines: [
      { who: "them", es: "¡Buenos días! Tú eres Lin, ¿verdad?", zh: "早上好！你是 Lin，对吧？",
        note: "¿verdad? = 对吧？是不是？放在句子最后。" },
      { who: "me",
        hintZh: "说是的，你就是 Lin，也问声早上好。",
        options: [
          { es: "No, soy profesora.", zh: "不，我是老师。", correct: false, whyZh: "你是学生 Lin，老师是 Marisa。" },
          { es: "Sí, soy Lin. ¡Buenos días!", zh: "是的，我是 Lin。早上好！", correct: true },
          { es: "Me duele la garganta.", zh: "我嗓子疼。", correct: false, whyZh: "答非所问：老师在问你是不是 Lin。" }
        ],
        alsoOk: ["Sí, soy Lin.", "Sí, buenos días.", "Sí, ¡buenos días!"],
        note: ""
      },
      { who: "them", es: "Muy bien. Abre el libro en la página diez, por favor.", zh: "很好。请把书翻到第十页。",
        note: "abre = 打开（对“你”说的命令）；la página = 页。" },
      { who: "me",
        hintZh: "你没听清第几页，问一下老师。",
        options: [
          { es: "¿En qué página estamos?", zh: "我们在第几页？", correct: true },
          { es: "¿Qué hora es?", zh: "几点了？", correct: false, whyZh: "你想问的是第几页，不是时间。" },
          { es: "Tengo sueño.", zh: "我困了。", correct: false, whyZh: "上课第一天可别这么说！你想问第几页。" }
        ],
        alsoOk: ["¿Qué página?", "Perdón, ¿qué página?", "¿Puede repetir, por favor?"],
        note: ""
      },
      { who: "them", es: "En la página diez. ¿Tienes bolígrafo?", zh: "第十页。你有圆珠笔吗？" },
      { who: "me",
        hintZh: "说没有，请老师借你一支。",
        options: [
          { es: "Sí, tengo un libro.", zh: "有，我有一本书。", correct: false, whyZh: "老师问的是圆珠笔 bolígrafo，不是书。" },
          { es: "Tengo un examen.", zh: "我有一场考试。", correct: false, whyZh: "答非所问：老师问你有没有笔。" },
          { es: "No, lo siento. ¿Me prestas uno?", zh: "没有，不好意思。你能借我一支吗？", correct: true }
        ],
        alsoOk: ["No. ¿Me prestas un bolígrafo?", "No, ¿me prestas un bolígrafo, por favor?", "No, lo siento."],
        note: "uno = 一个（这里指一支笔）。在西班牙，学生常用 tú 和老师说话。"
      },
      { who: "them", es: "Claro, toma. Ahora escribe tu nombre en el cuaderno.", zh: "当然，拿着。现在在本子上写下你的名字。",
        note: "toma = 拿着（递东西给对方时说）；ahora = 现在；escribe = 写（对“你”说的命令）。" },
      { who: "me",
        hintZh: "写好了，告诉老师你做完了。",
        options: [
          { es: "No lo sé.", zh: "我不知道。", correct: false, whyZh: "老师让你写名字，写好了就说“我做完了”。" },
          { es: "Ya he terminado.", zh: "我已经做完了。", correct: true },
          { es: "¿Puedo entrar?", zh: "我可以进来吗？", correct: false, whyZh: "你已经在教室里了。" }
        ],
        alsoOk: ["He terminado.", "Ya está."],
        note: ""
      },
      { who: "them", es: "¡Muy bien! ¿Tienes alguna pregunta?", zh: "很好！你有什么问题吗？",
        note: "alguna = 某个、什么（阴性，因为 pregunta 是阴性）。" },
      { who: "me",
        hintZh: "问明天有没有作业。",
        options: [
          { es: "¿Hay un supermercado cerca?", zh: "附近有超市吗？", correct: false, whyZh: "这是问超市；你想问的是作业。" },
          { es: "¿Hay deberes para mañana?", zh: "明天有作业吗？", correct: true },
          { es: "El examen es fácil.", zh: "考试很容易。", correct: false, whyZh: "这不是问题；你想问明天有没有作业。" }
        ],
        alsoOk: ["¿Hay deberes?", "¿Tenemos deberes para mañana?"],
        note: "los deberes = 作业（西班牙的说法；拉美说 la tarea）。"
      },
      { who: "them", es: "Sí, la página once. ¡Hasta mañana!", zh: "有，第十一页。明天见！" },
      { who: "me",
        hintZh: "跟老师说明天见。",
        options: [
          { es: "¡Buenos días!", zh: "早上好！", correct: false, whyZh: "下课了，要道别，不是打招呼。" },
          { es: "Mucho gusto.", zh: "很高兴认识你。", correct: false, whyZh: "这是第一次见面时说的，现在要道别。" },
          { es: "¡Hasta mañana, profesora!", zh: "老师，明天见！", correct: true }
        ],
        alsoOk: ["¡Hasta mañana!", "¡Adiós!", "¡Adiós, profesora!", "¡Hasta mañana, Marisa!"],
        note: ""
      }
    ]
  },

  // 12 —— 海边的一天
  {
    id: "beach-day",
    titleZh: "海边的一天",
    sceneZh: "夏天的上午，你来到海滩。救生员 Álex 坐在高高的椅子上跟你打招呼。",
    partner: "Álex",
    lines: [
      { who: "them", es: "¡Hola! ¡Qué calor hace hoy!", zh: "你好！今天真热啊！",
        note: "¡Qué calor! = 好热啊！" },
      { who: "me",
        hintZh: "同意他：是啊，今天很热。",
        options: [
          { es: "Sí, hace mucho frío.", zh: "是啊，天很冷。", correct: false, whyZh: "calor 是热，frío 是冷，意思反了。" },
          { es: "Sí, hace mucho calor.", zh: "是啊，很热。", correct: true },
          { es: "Está nublado.", zh: "天阴了。", correct: false, whyZh: "今天出大太阳，一片云也没有。" }
        ],
        alsoOk: ["Sí, hoy hace mucho calor.", "¡Sí, mucho calor!", "Sí, hace calor."],
        note: ""
      },
      { who: "them", es: "¿Sabes nadar?", zh: "你会游泳吗？" },
      { who: "me",
        hintZh: "说会一点点。",
        options: [
          { es: "Sí, un poco.", zh: "会，一点点。", correct: true },
          { es: "Me duele el estómago.", zh: "我肚子疼。", correct: false, whyZh: "答非所问：他问你会不会游泳。" },
          { es: "Sí, me gusta leer.", zh: "是的，我喜欢看书。", correct: false, whyZh: "他问的是游泳 nadar，不是看书。" }
        ],
        alsoOk: ["Sí.", "Sí, sé nadar.", "Sí, un poco, gracias."],
        note: "sé nadar = 我会游泳（sé 来自 saber）。"
      },
      { who: "them", es: "¡Cuidado! El agua está fría y hoy hay muchas olas.", zh: "小心！水很凉，今天浪也很大。",
        note: "las olas = 海浪；hay muchas olas = 浪很多、浪很大。" },
      { who: "me",
        hintZh: "那还是去游泳池吧：问他游泳池在哪儿。",
        options: [
          { es: "¿Dónde está la playa?", zh: "海滩在哪儿？", correct: false, whyZh: "你已经在海滩上了；你想去游泳池 piscina。" },
          { es: "¿A qué hora abre el museo?", zh: "博物馆几点开门？", correct: false, whyZh: "你想去游泳，不是去博物馆。" },
          { es: "¿Dónde está la piscina?", zh: "游泳池在哪儿？", correct: true }
        ],
        alsoOk: ["¿Hay una piscina cerca?", "Perdón, ¿dónde está la piscina?"],
        note: ""
      },
      { who: "them", es: "Está allí, a cinco minutos. Y usa crema solar, el sol es muy fuerte.", zh: "在那边，走五分钟就到。还有，抹点防晒霜，太阳很毒。",
        note: "usa = 用（对“你”说的命令）；fuerte = 强烈的。" },
      { who: "me",
        hintZh: "告诉他你没有防晒霜。",
        options: [
          { es: "No tengo toalla.", zh: "我没有毛巾。", correct: false, whyZh: "他说的是防晒霜 crema solar，不是毛巾。" },
          { es: "No tengo crema solar.", zh: "我没有防晒霜。", correct: true },
          { es: "Tengo una reserva.", zh: "我有预订。", correct: false, whyZh: "这是在酒店说的话。" }
        ],
        alsoOk: ["Lo siento, no tengo crema solar.", "No tengo crema."],
        note: ""
      },
      { who: "them", es: "No pasa nada, aquí tienes mi crema.", zh: "没关系，用我的防晒霜吧。",
        note: "aquí tienes = 给你（对朋友说；对“您”说 aquí tiene）。" },
      { who: "me",
        hintZh: "谢谢他，说他人真好。",
        options: [
          { es: "De nada.", zh: "不客气。", correct: false, whyZh: "是他帮了你，你要说谢谢；de nada 是回答谢谢的。" },
          { es: "¡Muchas gracias! Muy amable.", zh: "非常感谢！您真好。", correct: true },
          { es: "¡Qué aburrido!", zh: "真无聊！", correct: false, whyZh: "他帮了你，这样说很没礼貌。" }
        ],
        alsoOk: ["¡Gracias!", "Muchas gracias.", "¡Muchas gracias!"],
        note: "muy amable = 您真好；谢谢您的好意。"
      },
      { who: "them", es: "¡De nada! ¡Que lo pases bien!", zh: "不客气！玩得开心！",
        note: "¡Que lo pases bien! = 祝你玩得开心！" }
    ]
  }
];
