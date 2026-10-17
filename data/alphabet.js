// 西班牙语字母表 —— 由 content-writer 编写
// 以西班牙标准西语为准；拉美读法不同时在说明里加备注。
// 中文近似音只是帮助理解的“近似”，并不完全相同。
window.ALPHABET = [
  {
    letter: "A",
    lower: "a",
    name: "a",
    speak: "a.",
    soundZh: "近似汉语的“啊”，嘴张大，短而清楚，不拖长",
    soundEn: "Like the 'a' in 'father', but short and clear",
    example: { es: "agua", zh: "水", en: "water" }
  },
  {
    letter: "B",
    lower: "b",
    name: "be",
    speak: "be",
    soundZh: "近似拼音 b，但声带要振动（浊音），比拼音 b 更“浊”；夹在两个元音之间时，双唇不完全闭合，声音更轻。和 V 读音完全一样",
    soundEn: "Like 'b' in 'boy', voiced (vocal cords vibrate), so 'heavier' than pinyin b; softer between vowels (lips don't fully close). Sounds exactly the same as V",
    example: { es: "boca", zh: "嘴", en: "mouth" }
  },
  {
    letter: "C",
    lower: "c",
    name: "ce",
    speak: "ce",
    soundZh: "在 a、o、u 前读 k，近似拼音 g（不送气），别读成送气的拼音 k；在 e、i 前，西班牙读咬舌音，像英语 think 里的 th。拉美在 e、i 前读 s",
    soundEn: "Before a, o, u: like 'k' (no puff of air). Before e, i: in Spain like 'th' in 'think'. Latin America: like 's' before e, i",
    example: { es: "casa", zh: "房子", en: "house" }
  },
  {
    letter: "D",
    lower: "d",
    name: "de",
    speak: "de",
    soundZh: "近似拼音 d，但声带要振动（浊音），比拼音 d 更“浊”；舌尖碰上门牙背面；在两个元音之间或词尾时变轻，接近英语 this 里的 th（近似）",
    soundEn: "Like 'd', voiced (vocal cords vibrate), so 'heavier' than pinyin d, with the tongue touching the upper teeth; softer between vowels or at the end of a word, close to 'th' in 'this'",
    example: { es: "dedo", zh: "手指", en: "finger" }
  },
  {
    letter: "E",
    lower: "e",
    name: "e",
    speak: "e.",
    soundZh: "近似汉语“诶”的开头部分，短而干净，不要滑成 ei",
    soundEn: "Like the 'e' in 'bed', short and pure, not 'ay'",
    example: { es: "elefante", zh: "大象", en: "elephant" }
  },
  {
    letter: "F",
    lower: "f",
    name: "efe",
    speak: "efe",
    soundZh: "和拼音 f 一样，上齿轻咬下唇",
    soundEn: "Like 'f' in 'fun'",
    example: { es: "flor", zh: "花", en: "flower" }
  },
  {
    letter: "G",
    lower: "g",
    name: "ge",
    speak: "ge",
    soundZh: "在 a、o、u 前近似拼音 g，但声带要振动（浊音），比拼音 g 更“浊”；在 e、i 前读法和 J 一样（像用力的 h，近似）",
    soundEn: "Before a, o, u: like 'g' in 'go', voiced (vocal cords vibrate), so 'heavier' than pinyin g. Before e, i: same as Spanish J (a strong, throaty 'h')",
    example: { es: "gato", zh: "猫", en: "cat" }
  },
  {
    letter: "H",
    lower: "h",
    name: "hache",
    speak: "hache",
    soundZh: "不发音！看到 h 直接跳过（ch 组合除外，读音像英语 church 的 ch）",
    soundEn: "Silent! Just skip it (except in 'ch', which sounds like 'ch' in 'church')",
    example: { es: "hola", zh: "你好", en: "hello" }
  },
  {
    letter: "I",
    lower: "i",
    name: "i",
    speak: "i.",
    soundZh: "近似汉语的“衣”，短而清楚",
    soundEn: "Like the 'ee' in 'see', but short",
    example: { es: "isla", zh: "岛", en: "island" }
  },
  {
    letter: "J",
    lower: "j",
    name: "jota",
    speak: "jota",
    soundZh: "近似拼音 h，但更靠喉咙、更用力，带一点摩擦声。拉美很多地区读得较轻，接近英语 h",
    soundEn: "A strong, throaty 'h' (like Scottish 'loch'). In much of Latin America it is softer, like English 'h'",
    example: { es: "jamón", zh: "火腿", en: "ham" }
  },
  {
    letter: "K",
    lower: "k",
    name: "ka",
    speak: "ka",
    soundZh: "近似拼音 g（不送气），别读成送气的拼音 k；只出现在少数外来词里",
    soundEn: "Close to pinyin g (unaspirated) — a 'k' with no puff of air, not aspirated pinyin k; only used in a few borrowed words",
    example: { es: "kilo", zh: "公斤", en: "kilo" }
  },
  {
    letter: "L",
    lower: "l",
    name: "ele",
    speak: "ele",
    soundZh: "和拼音 l 一样，在词尾也要清楚地发出来",
    soundEn: "Like 'l' in 'love', always clear, even at the end of a word",
    example: { es: "luna", zh: "月亮", en: "moon" }
  },
  {
    letter: "M",
    lower: "m",
    name: "eme",
    speak: "eme",
    soundZh: "和拼音 m 一样",
    soundEn: "Like 'm' in 'mom'",
    example: { es: "mamá", zh: "妈妈", en: "mom" }
  },
  {
    letter: "N",
    lower: "n",
    name: "ene",
    speak: "ene",
    soundZh: "和拼音 n 一样",
    soundEn: "Like 'n' in 'no'",
    example: { es: "noche", zh: "夜晚", en: "night" }
  },
  {
    letter: "Ñ",
    lower: "ñ",
    name: "eñe",
    speak: "eñe",
    soundZh: "近似拼音 ny 连读，像“尼呀”快速合成一个音（近似）",
    soundEn: "Like 'ny' in 'canyon'",
    example: { es: "niño", zh: "男孩；孩子", en: "boy; child" }
  },
  {
    letter: "O",
    lower: "o",
    name: "o",
    speak: "o.",
    soundZh: "近似汉语的“哦”，嘴唇圆，短而干净，不要滑成 ou",
    soundEn: "Like the 'o' in 'or' (without the r), short and pure, not 'oh-oo'",
    example: { es: "ojo", zh: "眼睛", en: "eye" }
  },
  {
    letter: "P",
    lower: "p",
    name: "pe",
    speak: "pe",
    soundZh: "近似拼音 b（不送气），别读成送气的拼音 p",
    soundEn: "Close to pinyin b (unaspirated) — like 'p' in 'spin', with no puff of air; not aspirated pinyin p",
    example: { es: "pan", zh: "面包", en: "bread" }
  },
  {
    letter: "Q",
    lower: "q",
    name: "cu",
    speak: "cu",
    soundZh: "只出现在 que、qui 里，读 k，近似拼音 g（不送气），后面的 u 不发音：que 读 ke，qui 读 ki",
    soundEn: "Only in 'que' and 'qui'; sounds like 'k' and the 'u' is silent ('que' = 'ke', 'qui' = 'ki')",
    example: { es: "queso", zh: "奶酪", en: "cheese" }
  },
  {
    letter: "R",
    lower: "r",
    name: "erre",
    speak: "erre",
    soundZh: "在词中间时，舌尖在上齿龈轻弹一下；在词首（以及 n、l、s 后面）要发大舌音，舌尖连续颤动",
    soundEn: "In the middle of a word: one quick tap of the tongue (like 'tt' in American 'butter'). At the start of a word (and after n, l, s): a rolled (trilled) 'r'",
    example: { es: "rojo", zh: "红色", en: "red" }
  },
  {
    letter: "S",
    lower: "s",
    name: "ese",
    speak: "ese",
    soundZh: "近似拼音 s",
    soundEn: "Like 's' in 'sun'",
    example: { es: "sol", zh: "太阳", en: "sun" }
  },
  {
    letter: "T",
    lower: "t",
    name: "te",
    speak: "te",
    soundZh: "近似拼音 d（不送气），别读成送气的拼音 t；舌尖碰上门牙背面",
    soundEn: "Close to pinyin d (unaspirated) — like 't' in 'stop', with no puff of air; not aspirated pinyin t. Tongue touches the upper teeth",
    example: { es: "tomate", zh: "西红柿", en: "tomato" }
  },
  {
    letter: "U",
    lower: "u",
    name: "u",
    speak: "u.",
    soundZh: "近似汉语的“乌”，嘴唇圆而向前",
    soundEn: "Like the 'oo' in 'food', but short",
    example: { es: "uva", zh: "葡萄", en: "grape" }
  },
  {
    letter: "V",
    lower: "v",
    name: "uve",
    speak: "uve",
    soundZh: "和 B 读音完全一样（近似拼音 b），不要像英语 v 那样咬下唇。拉美很多地方把这个字母叫 “ve” 或 “ve corta”",
    soundEn: "Sounds exactly like Spanish B, not like English 'v'. In much of Latin America the letter is called 've' or 've corta'",
    example: { es: "vaca", zh: "奶牛", en: "cow" }
  },
  {
    letter: "W",
    lower: "w",
    name: "uve doble",
    speak: "uve doble",
    soundZh: "只出现在外来词里，通常读成类似“乌”的 w 音；少数早期外来词里读得像 b，例如 wáter（厕所）。拉美常把这个字母叫 “doble ve” 或 “doble u”",
    soundEn: "Only in borrowed words, usually like English 'w'; in a few older borrowings it sounds like 'b', e.g. 'wáter' (toilet). In Latin America the letter is often called 'doble ve' or 'doble u'",
    example: { es: "kiwi", zh: "猕猴桃", en: "kiwi" }
  },
  {
    letter: "X",
    lower: "x",
    name: "equis",
    speak: "equis",
    soundZh: "通常读 ks；在词首常读 s。少数专有名词里读得像 J，例如 México",
    soundEn: "Usually 'ks'; often 's' at the start of a word. In a few names it sounds like Spanish J, e.g. 'México'",
    example: { es: "taxi", zh: "出租车", en: "taxi" }
  },
  {
    letter: "Y",
    lower: "y",
    name: "ye",
    speak: "ye",
    soundZh: "在元音前近似拼音 y，比汉语稍重一点；单独的 y（意思是“和”）读“衣”；在词尾也读“衣”，比如 hoy、muy。字母名传统上叫 “i griega”。阿根廷、乌拉圭常读得像 sh",
    soundEn: "Before a vowel, like 'y' in 'yes' (a bit stronger); alone ('and') and at the end of a word it sounds like 'ee', e.g. 'hoy', 'muy'. Also traditionally called 'i griega'. In Argentina and Uruguay often like 'sh'",
    example: { es: "yo", zh: "我", en: "I" }
  },
  {
    letter: "Z",
    lower: "z",
    name: "zeta",
    speak: "zeta",
    soundZh: "西班牙读咬舌音：舌尖轻放在上下齿之间，像英语 think 里的 th。拉美读 s",
    soundEn: "In Spain like 'th' in 'think'. In Latin America like 's'",
    example: { es: "zapato", zh: "鞋", en: "shoe" }
  }
];

window.ALPHABET_TIPS = [
  {
    titleZh: "五个元音读法固定",
    titleEn: "The five vowels always sound the same",
    zh: "西语只有五个元音 a、e、i、o、u，在任何词里读音都不变，近似“啊、诶、衣、哦、乌”。每个元音都短而干净，不要拖长或滑成两个音。",
    en: "Spanish has only five vowels: a, e, i, o, u. They always sound the same in every word. Keep them short and pure, never glide them.",
    examples: [
      { es: "casa", zh: "房子", en: "house" },
      { es: "mesa", zh: "桌子", en: "table" },
      { es: "uno", zh: "一", en: "one" }
    ]
  },
  {
    titleZh: "h 不发音",
    titleEn: "The letter h is silent",
    zh: "h 永远不发音，hola 读作“o-la”。唯一的例外是 ch 组合，读音像英语 church 里的 ch。",
    en: "The letter h is never pronounced: 'hola' sounds like 'o-la'. The only exception is 'ch', which sounds like 'ch' in 'church'.",
    examples: [
      { es: "hola", zh: "你好", en: "hello" },
      { es: "hoy", zh: "今天", en: "today" },
      { es: "hermano", zh: "兄弟", en: "brother" }
    ]
  },
  {
    titleZh: "j 读成用力的 h",
    titleEn: "J sounds like a strong h",
    zh: "j 近似拼音 h，但更靠喉咙、更用力，带一点摩擦声（近似）。拉美很多地区读得较轻，接近英语 h。",
    en: "J is a strong, throaty 'h', like Scottish 'loch'. In much of Latin America it is softer, like English 'h'.",
    examples: [
      { es: "jamón", zh: "火腿", en: "ham" },
      { es: "ojo", zh: "眼睛", en: "eye" },
      { es: "rojo", zh: "红色", en: "red" }
    ]
  },
  {
    titleZh: "ll 和 y 读音一样",
    titleEn: "LL and Y sound the same",
    zh: "ll 是两个 l 连写，现在大多数人（包括西班牙大部分地区）把 ll 和元音前的 y 读成一样的音，近似拼音 y，但稍重一点。阿根廷、乌拉圭常读得像 sh。",
    en: "Most speakers (including most of Spain) pronounce 'll' and 'y' (before a vowel) the same, like 'y' in 'yes' but a bit stronger. In Argentina and Uruguay they often sound like 'sh'.",
    examples: [
      { es: "llave", zh: "钥匙", en: "key" },
      { es: "calle", zh: "街道", en: "street" },
      { es: "yo", zh: "我", en: "I" }
    ]
  },
  {
    titleZh: "r 和 rr：轻弹与大舌音",
    titleEn: "R and RR: tap and trill",
    zh: "词中间的单个 r：舌尖在上齿龈轻弹一下。rr，以及词首的 r（和 n、l、s 后面的 r）：舌尖连续颤动，就是“大舌音”。pero（但是）和 perro（狗）意思完全不同，要分清。",
    en: "A single 'r' in the middle of a word is one quick tap of the tongue. 'rr', and 'r' at the start of a word (or after n, l, s), is a rolled trill. 'pero' (but) and 'perro' (dog) are different words.",
    examples: [
      { es: "pero", zh: "但是", en: "but" },
      { es: "perro", zh: "狗", en: "dog" },
      { es: "rosa", zh: "玫瑰", en: "rose" }
    ]
  },
  {
    titleZh: "c 和 z 的读法",
    titleEn: "How to say C and Z",
    zh: "c 在 a、o、u 前读 k。c 在 e、i 前，以及所有的 z，在西班牙读咬舌音（像英语 think 的 th）。拉美这些地方都读 s。",
    en: "C before a, o, u sounds like 'k'. C before e, i, and every Z, sound like 'th' in 'think' in Spain. In Latin America they sound like 's'.",
    examples: [
      { es: "casa", zh: "房子", en: "house" },
      { es: "cinco", zh: "五", en: "five" },
      { es: "zapato", zh: "鞋", en: "shoe" }
    ]
  },
  {
    titleZh: "g 在 e、i 前读得像 j",
    titleEn: "G before E and I sounds like J",
    zh: "g 在 a、o、u 前读 g；在 e、i 前读得和 j 一样。如果想在 e、i 前保留 g 的音，就写成 gue、gui，这时 u 不发音（例如 guitarra 读 gi-ta-rra）。",
    en: "G before a, o, u sounds like 'g' in 'go'; before e, i it sounds like Spanish J. To keep the hard 'g' before e, i, Spanish writes 'gue' and 'gui', where the 'u' is silent.",
    examples: [
      { es: "gato", zh: "猫", en: "cat" },
      { es: "gente", zh: "人们", en: "people" },
      { es: "guitarra", zh: "吉他", en: "guitar" }
    ]
  },
  {
    titleZh: "重音与重音符号",
    titleEn: "Stress and accent marks",
    zh: "以元音、n 或 s 结尾的词，重读倒数第二个音节（CA-sa）；以其他辅音结尾的词，重读最后一个音节（ciu-DAD）。如果有重音符号（á é í ó ú），就重读带符号的那个音节（ca-FÉ）。",
    en: "Words ending in a vowel, n or s are stressed on the second-to-last syllable (CA-sa). Words ending in other consonants are stressed on the last syllable (ciu-DAD). An accent mark (á é í ó ú) shows the stressed syllable (ca-FÉ).",
    examples: [
      { es: "casa", zh: "房子", en: "house" },
      { es: "ciudad", zh: "城市", en: "city" },
      { es: "café", zh: "咖啡", en: "coffee" }
    ]
  }
];
