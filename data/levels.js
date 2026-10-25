// 冒险地图 —— 由 content-writer 编写
// 数据变量：window.WORLD = { regions: [...], tasks: [...] }
// regions[]：id, titleZh, titleEn, emoji, storyZh, storyEn, npc { name, emoji, roleZh, roleEn }, stampZh, stampEn, levels[]
// levels[]：id（全站唯一）, type（"normal" / "task" / "boss"）, titleZh, titleEn, introZh, introEn,
//           items { letters, words, phrases, grammar[{ lesson, ex }], dialogue }, modes[], count
//   items 里全部是已有数据的 id：ALPHABET 的 letter、WORD_LESSONS 的单词 id、PHRASE_LESSONS 的句子 id、
//   GRAMMAR_LESSONS 的 lesson id + exercises 下标、DIALOGUES 的 id 或下面 tasks 的 id。
//   task 关的 count = 这段对话里“我”要说的轮数（整段对话都要做完）。
// tasks[]：新写的对话任务，格式和 data/dialogues.js 完全一样。
// 学习者在对话里叫 Lin，来自中国，是学生（不分性别）。
window.WORLD = {
  regions: [
    // ===== 1 马德里机场 =====
    {
      id: "airport",
      titleZh: "马德里机场", titleEn: "Madrid Airport", emoji: "✈️",
      storyZh: "飞机终于降落在马德里！一走出机舱，机场工作人员 Carmen 就冲你挥手：“¡Hola!” 先认识西语的 27 个字母，再学会打招呼，才能顺利通过入境检查。",
      storyEn: "Your plane has landed in Madrid! As you step off, airport officer Carmen waves at you: \"¡Hola!\" Learn the 27 letters of the Spanish alphabet and how to say hello, so you can get through passport control.",
      npc: { name: "Carmen", emoji: "👩‍💼", roleZh: "机场工作人员", roleEn: "airport staff" },
      stampZh: "马德里机场邮票", stampEn: "Madrid Airport stamp",
      levels: [
        {
          id: "airport-1", type: "normal",
          titleZh: "五个元音", titleEn: "The five vowels",
          introZh: "西语只有 5 个元音：a e i o u。读音短而清楚，而且永远不变。",
          introEn: "Spanish has only 5 vowels: a e i o u. They are short, clear and never change.",
          items: { letters: ["A", "E", "I", "O", "U"] },
          modes: ["listen"],
          count: 5
        },
        {
          id: "airport-2", type: "normal",
          titleZh: "辅音（一）：B 到 M", titleEn: "Consonants 1: B to M",
          introZh: "认识 B 到 M 的辅音。小提示：H 不发音，J 读音近似汉语的 h（只是近似）。",
          introEn: "Meet the consonants from B to M. Tip: H is silent, and J sounds roughly like Chinese h.",
          items: { letters: ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M"] },
          modes: ["listen"],
          count: 8
        },
        {
          id: "airport-3", type: "normal",
          titleZh: "辅音（二）：N 到 Z", titleEn: "Consonants 2: N to Z",
          introZh: "认识 N 到 Z，还有西语特有的 Ñ！R 要轻轻弹舌，V 和 B 读音一样。",
          introEn: "Meet N to Z, including the special Spanish letter Ñ! R is a light tap of the tongue, and V sounds the same as B.",
          items: { letters: ["N", "Ñ", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"] },
          modes: ["listen"],
          count: 8
        },
        {
          id: "airport-4", type: "normal",
          titleZh: "打招呼", titleEn: "Saying hello",
          introZh: "早上、下午、晚上分别怎么打招呼？问一句“怎么样”，再学会说再见。",
          introEn: "How to say hello in the morning, afternoon and evening, ask \"how's it going?\", and say goodbye.",
          items: { words: ["hola", "buenos-dias", "buenas-tardes", "buenas-noches", "que-tal", "bien", "adios", "hasta-luego"] },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "airport-5", type: "task",
          titleZh: "入境检查", titleEn: "Passport control",
          introZh: "Carmen 要检查你的护照。用刚学的招呼语和她说几句话吧！",
          introEn: "Carmen needs to check your passport. Use your new greetings to talk with her!",
          items: { dialogue: "task-airport" },
          modes: ["dialogue"],
          count: 5
        },
        {
          id: "airport-6", type: "boss",
          titleZh: "大关：走出机场", titleEn: "Boss: Out of the airport",
          introZh: "字母和招呼语大混战，还有限时快答！闯过去就能拿到第一枚护照邮票。",
          introEn: "Letters and greetings all mixed up, plus a speed round! Win to get your first passport stamp.",
          items: {
            letters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
            words: ["hola", "buenos-dias", "buenas-tardes", "buenas-noches", "que-tal", "bien", "adios", "hasta-luego"]
          },
          modes: ["listen", "match", "guess", "speed"],
          count: 10
        }
      ]
    },

    // ===== 2 酒店 =====
    {
      id: "hotel",
      titleZh: "酒店", titleEn: "The Hotel", emoji: "🏨",
      storyZh: "你拖着行李来到酒店。前台的 Hugo 笑着说：“¡Buenas tardes!” 这里要学礼貌用语和数字 0–10——不然连房间号都听不懂！听不懂也别慌，再学几句“救命”的话。",
      storyEn: "You drag your suitcase into the hotel. Hugo at the front desk smiles: \"¡Buenas tardes!\" Learn polite words and the numbers 0–10, or you won't even understand your room number! And learn a few lifesaving phrases for when you don't understand.",
      npc: { name: "Hugo", emoji: "🧑‍💼", roleZh: "酒店前台", roleEn: "hotel receptionist" },
      stampZh: "酒店邮票", stampEn: "Hotel stamp",
      levels: [
        {
          id: "hotel-1", type: "normal",
          titleZh: "请和谢谢", titleEn: "Please & thank you",
          introZh: "是、不是、请、谢谢、不客气、对不起——最常用的礼貌小词。",
          introEn: "Yes, no, please, thank you, you're welcome, sorry: the most useful polite words.",
          items: { words: ["si", "no", "por-favor", "gracias", "de-nada", "perdon", "lo-siento"] },
          modes: ["listen", "match"],
          count: 7
        },
        {
          id: "hotel-2", type: "normal",
          titleZh: "称呼和求助", titleEn: "Polite greetings & asking for help",
          introZh: "怎么称呼先生、女士，怎么问候对方，还有请别人帮忙的几句话。",
          introEn: "How to address a man or a woman, how to ask how someone is, and how to ask for help.",
          items: {
            words: ["senor", "senora", "mucho-gusto", "como-estas", "y-tu"],
            phrases: ["ph-disculpe-pregunta", "ph-me-puede-ayudar", "ph-no-pasa-nada", "ph-habla-ingles", "ph-no-hablo-bien"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "hotel-3", type: "normal",
          titleZh: "房间号 0–5", titleEn: "Room numbers 0–5",
          introZh: "数字 0 到 5，再加上“酒店”和“卫生间”两个很有用的词。",
          introEn: "Numbers 0 to 5, plus two very useful words: \"hotel\" and \"bathroom\".",
          items: { words: ["cero", "uno", "dos", "tres", "cuatro", "cinco", "hotel", "bano"] },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "hotel-4", type: "normal",
          titleZh: "数到 10 和求助", titleEn: "Numbers 6–10 & when you don't understand",
          introZh: "数到 10，再学几句救命的话：我听不懂、请再说一遍、请说慢一点。",
          introEn: "Count to 10 and learn lifesaving phrases: I don't understand, please repeat, slower please.",
          items: {
            words: ["seis", "siete", "ocho", "nueve", "diez"],
            phrases: ["ph-no-entiendo", "ph-puede-repetir", "ph-mas-despacio", "ph-como-se-dice", "ph-que-significa"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "hotel-5", type: "task",
          titleZh: "办理入住", titleEn: "Checking in",
          introZh: "Hugo 要登记你的名字、告诉你房间号。听不清就请他再说一遍！",
          introEn: "Hugo needs your name and will tell you your room number. If you don't catch it, ask him to repeat!",
          items: { dialogue: "task-hotel" },
          modes: ["dialogue"],
          count: 5
        },
        {
          id: "hotel-6", type: "boss",
          titleZh: "大关：拿到房卡", titleEn: "Boss: Get your room key",
          introZh: "礼貌用语、数字 0–10、救命句子全部混在一起。会拼、会排，才能拿到房卡！",
          introEn: "Polite words, numbers 0–10 and lifesaving phrases all together. Spell and build sentences to get your key!",
          items: {
            words: ["si", "no", "por-favor", "gracias", "de-nada", "perdon", "lo-siento", "senor", "senora", "mucho-gusto", "como-estas", "y-tu",
                    "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "hotel", "bano"],
            phrases: ["ph-no-entiendo", "ph-puede-repetir", "ph-mas-despacio", "ph-como-se-dice", "ph-que-significa",
                      "ph-habla-ingles", "ph-no-hablo-bien", "ph-disculpe-pregunta", "ph-me-puede-ayudar", "ph-no-pasa-nada"]
          },
          modes: ["listen", "match", "guess", "order", "speed"],
          count: 12
        }
      ]
    },

    // ===== 3 咖啡馆 =====
    {
      id: "cafe",
      titleZh: "咖啡馆", titleEn: "The Café", emoji: "☕",
      storyZh: "第二天早上，你走进街角的咖啡馆，满屋都是咖啡香。服务员 Luis 问你：“¿Qué va a tomar?” 学会食物、饮料和点餐的句子，好好吃一顿西班牙早餐！",
      storyEn: "The next morning you walk into a corner café that smells of fresh coffee. Luis the waiter asks: \"¿Qué va a tomar?\" Learn food, drinks and ordering phrases, and enjoy a Spanish breakfast!",
      npc: { name: "Luis", emoji: "🤵", roleZh: "咖啡馆服务员", roleEn: "café waiter" },
      stampZh: "咖啡馆邮票", stampEn: "Café stamp",
      levels: [
        {
          id: "cafe-1", type: "normal",
          titleZh: "咖啡和面包", titleEn: "Coffee & bread",
          introZh: "水、咖啡、牛奶、面包，还有怎么要座位、要菜单、点一杯咖啡。",
          introEn: "Water, coffee, milk and bread, plus how to ask for a table, the menu and a coffee.",
          items: {
            words: ["agua", "cafe", "leche", "pan", "restaurante"],
            phrases: ["ph-mesa-para-dos", "ph-la-carta", "ph-me-pone-un-cafe"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "cafe-2", type: "normal",
          titleZh: "主菜和水果", titleEn: "Main dishes & fruit",
          introZh: "肉、鸡肉、鱼、米饭、水果——再学会跟服务员说“我要……”。",
          introEn: "Meat, chicken, fish, rice and fruit, and how to tell the waiter what you'd like.",
          items: {
            words: ["fruta", "manzana", "arroz", "pollo", "pescado", "carne"],
            phrases: ["ph-que-va-a-tomar", "ph-agua-sin-gas", "ph-para-mi-pollo"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "cafe-3", type: "normal",
          titleZh: "真好吃！买单！", titleEn: "Delicious! The bill!",
          introZh: "说好吃不好吃，回答“还要别的吗”，最后结账、刷卡。",
          introEn: "Say whether food is good, answer \"anything else?\", then ask for the bill and pay by card.",
          items: {
            words: ["bueno", "malo", "cafe", "pan", "pollo"],
            phrases: ["ph-algo-mas", "ph-esta-muy-bueno", "ph-la-cuenta", "ph-pagar-con-tarjeta"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "cafe-4", type: "normal",
          titleZh: "复习：会拼又会说", titleEn: "Review: spell it, say it",
          introZh: "刚认识的食物，这次要自己拼出来；点餐的句子，要自己排好顺序。",
          introEn: "Now spell the food words yourself and put the ordering phrases in the right order.",
          items: {
            words: ["cafe", "leche", "agua", "pan", "pollo", "arroz", "carne", "manzana"],
            phrases: ["ph-me-pone-un-cafe", "ph-la-carta", "ph-la-cuenta", "ph-mesa-para-dos"]
          },
          modes: ["guess", "order", "match"],
          count: 8
        },
        {
          id: "cafe-5", type: "task",
          titleZh: "礼貌地点咖啡", titleEn: "Ordering politely",
          introZh: "Luis 来招呼你了：点咖啡、道谢、叫住他，他洒了咖啡还要说“没关系”。",
          introEn: "Luis comes to serve you: order, say thanks, call him over, and tell him it's OK when he spills a little coffee.",
          items: { dialogue: "polite" },
          modes: ["dialogue"],
          count: 5
        },
        {
          id: "cafe-6", type: "boss",
          titleZh: "大关：早餐大考验", titleEn: "Boss: The breakfast challenge",
          introZh: "食物、饮料和所有点餐句子一起上！限时快答别手软。",
          introEn: "All the food, drinks and ordering phrases at once, including a speed round!",
          items: {
            words: ["agua", "pan", "cafe", "leche", "fruta", "manzana", "arroz", "pollo", "pescado", "carne", "restaurante", "bueno", "malo"],
            phrases: ["ph-mesa-para-dos", "ph-la-carta", "ph-que-va-a-tomar", "ph-me-pone-un-cafe", "ph-agua-sin-gas",
                      "ph-para-mi-pollo", "ph-algo-mas", "ph-esta-muy-bueno", "ph-la-cuenta", "ph-pagar-con-tarjeta"]
          },
          modes: ["listen", "match", "guess", "order", "speed"],
          count: 12
        }
      ]
    },

    // ===== 4 公园广场 =====
    {
      id: "park",
      titleZh: "公园广场", titleEn: "Park & Square", emoji: "🌳",
      storyZh: "吃饱了，去公园和广场走走吧！蓝天、红花、绿树，到处都是颜色。小朋友 Sofía 抱着图画书跑过来：“¡Mira!”（你看！）学颜色、天气和季节。",
      storyEn: "Full and happy, you stroll through the park and the square. Blue sky, red flowers, green trees: colors everywhere! Little Sofía runs up with a picture book: \"¡Mira!\" (Look!) Learn colors, weather and seasons.",
      npc: { name: "Sofía", emoji: "👧", roleZh: "公园里认识的小朋友", roleEn: "a girl you meet in the park" },
      stampZh: "公园广场邮票", stampEn: "Park & Square stamp",
      levels: [
        {
          id: "park-1", type: "normal",
          titleZh: "红黄蓝绿白", titleEn: "Red, yellow, blue, green, white",
          introZh: "先学 5 种最常见的颜色。",
          introEn: "Start with the 5 most common colors.",
          items: { words: ["rojo", "amarillo", "azul", "verde", "blanco"] },
          modes: ["listen", "match"],
          count: 5
        },
        {
          id: "park-2", type: "normal",
          titleZh: "更多颜色", titleEn: "More colors",
          introZh: "黑、灰、橙、粉、棕，再加上“街道”这个词。",
          introEn: "Black, gray, orange, pink and brown, plus the word for \"street\".",
          items: { words: ["negro", "gris", "naranja", "rosa", "marron", "calle"] },
          modes: ["listen", "match"],
          count: 6
        },
        {
          id: "park-3", type: "normal",
          titleZh: "今天天气怎么样？", titleEn: "What's the weather like?",
          introZh: "热、冷、出太阳、下雨——西语说天气多用 hace…（h 不发音）。",
          introEn: "Hot, cold, sunny, rainy: Spanish uses hace… for most weather (the h is silent).",
          items: { words: ["tiempo", "hace-calor", "hace-frio", "hace-sol", "llueve"] },
          modes: ["listen", "match"],
          count: 5
        },
        {
          id: "park-4", type: "normal",
          titleZh: "四季和美景", titleEn: "Seasons & pretty views",
          introZh: "春夏秋冬、“今天”，还有“漂亮”和“难看”。",
          introEn: "Spring, summer, autumn, winter, \"today\", plus \"pretty\" and \"ugly\".",
          items: { words: ["primavera", "verano", "otono", "invierno", "hoy", "bonito", "feo"] },
          modes: ["listen", "match"],
          count: 7
        },
        {
          id: "park-5", type: "task",
          titleZh: "和 Sofía 看图画书", titleEn: "A picture book with Sofía",
          introZh: "Sofía 指着书上的画问你是什么颜色。注意颜色的阴阳性和单复数！",
          introEn: "Sofía points at the pictures and asks about colors. Watch gender and plural!",
          items: { dialogue: "colors" },
          modes: ["dialogue"],
          count: 5
        },
        {
          id: "park-6", type: "boss",
          titleZh: "大关：彩虹广场", titleEn: "Boss: Rainbow square",
          introZh: "颜色、天气、季节一起考。拼单词、排句子、限时快答，全都来！",
          introEn: "Colors, weather and seasons together: spelling, sentence building and a speed round!",
          items: {
            words: ["rojo", "amarillo", "azul", "verde", "blanco", "negro", "gris", "naranja", "rosa", "marron", "calle",
                    "tiempo", "hace-calor", "hace-frio", "hace-sol", "llueve", "primavera", "verano", "otono", "invierno", "hoy", "bonito", "feo"]
          },
          modes: ["listen", "match", "guess", "order", "speed"],
          count: 12
        }
      ]
    },

    // ===== 5 朋友家做客 =====
    {
      id: "home",
      titleZh: "朋友家做客", titleEn: "Visiting a Friend", emoji: "🏠",
      storyZh: "新朋友 Lucía 请你去她家做客！你拿出手机给她看你的全家福，她六岁的儿子 Pablo 也跑过来凑热闹。学家人的叫法、“我、你、他”和 ser（是），再学会介绍自己。",
      storyEn: "Your new friend Lucía invites you to her home! You show her a family photo on your phone, and her six-year-old son Pablo runs over to join in. Learn family words, \"I / you / he\", the verb ser (to be), and how to introduce yourself.",
      npc: { name: "Lucía", emoji: "👩", roleZh: "西班牙朋友", roleEn: "Spanish friend" },
      stampZh: "朋友家邮票", stampEn: "Friend's Home stamp",
      levels: [
        {
          id: "home-1", type: "normal",
          titleZh: "我的家人", titleEn: "My family",
          introZh: "爸爸、妈妈、兄弟、姐妹，再学“我、你、他、她”这些人称代词。",
          introEn: "Mother, father, brother, sister, plus the subject pronouns: I, you, he, she…",
          items: {
            words: ["familia", "madre", "padre", "hermano", "hermana"],
            grammar: [{ lesson: "pronouns", ex: [0, 1, 2, 3, 4, 5, 6, 7] }]
          },
          modes: ["listen", "match", "fill"],
          count: 8
        },
        {
          id: "home-2", type: "normal",
          titleZh: "爷爷奶奶和孩子们", titleEn: "Grandparents & children",
          introZh: "爷爷奶奶、儿子女儿、家，还有“你叫什么名字”“我是中国人”。",
          introEn: "Grandparents, son, daughter, home, plus \"What's your name?\" and \"I'm Chinese\".",
          items: {
            words: ["hijo", "hija", "abuelo", "abuela", "casa"],
            phrases: ["ph-como-te-llamas", "ph-me-llamo", "ph-encantado", "ph-de-donde-eres", "ph-soy-chino"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "home-3", type: "normal",
          titleZh: "自我介绍和 ser", titleEn: "Introducing yourself with ser",
          introZh: "住在哪儿、几岁、做什么工作，再练 ser（是）的变位：soy, eres, es…",
          introEn: "Where you live, how old you are, what you do, and the forms of ser: soy, eres, es…",
          items: {
            words: ["escuela", "familia", "padre", "madre", "hermano"],
            phrases: ["ph-donde-vives", "ph-cuantos-anos", "ph-a-que-te-dedicas", "ph-soy-estudiante", "ph-hablo-un-poco"],
            grammar: [{ lesson: "ser", ex: [0, 1, 2, 3, 4, 5, 6] }]
          },
          modes: ["listen", "match", "fill"],
          count: 8
        },
        {
          id: "home-4", type: "task",
          titleZh: "看全家福", titleEn: "The family photo",
          introZh: "Lucía 在看你手机里的全家福，给她介绍你的家人吧。",
          introEn: "Lucía is looking at your family photo. Tell her who everyone is.",
          items: { dialogue: "family" },
          modes: ["dialogue"],
          count: 5
        },
        {
          id: "home-5", type: "task",
          titleZh: "和 Pablo 数数", titleEn: "Counting with Pablo",
          introZh: "Pablo 要和你玩数数游戏，还出了几道加法题！",
          introEn: "Pablo wants to play a counting game, with a few sums too!",
          items: { dialogue: "numbers" },
          modes: ["dialogue"],
          count: 5
        },
        {
          id: "home-6", type: "boss",
          titleZh: "大关：家庭大聚会", titleEn: "Boss: Big family gathering",
          introZh: "家人、自我介绍、人称代词和 ser 一起考，看你能不能记住每个人！",
          introEn: "Family words, introductions, pronouns and ser all together. Can you remember everyone?",
          items: {
            words: ["familia", "madre", "padre", "hermano", "hermana", "hijo", "hija", "abuelo", "abuela", "casa", "escuela"],
            phrases: ["ph-como-te-llamas", "ph-me-llamo", "ph-encantado", "ph-de-donde-eres", "ph-soy-chino",
                      "ph-donde-vives", "ph-cuantos-anos", "ph-a-que-te-dedicas", "ph-soy-estudiante", "ph-hablo-un-poco"],
            grammar: [{ lesson: "pronouns", ex: [0, 1, 3, 6] }, { lesson: "ser", ex: [0, 1, 2, 5] }]
          },
          modes: ["listen", "match", "guess", "order", "fill", "speed"],
          count: 12
        }
      ]
    },

    // ===== 6 商店 =====
    {
      id: "shop",
      titleZh: "商店", titleEn: "The Shop", emoji: "🛍️",
      storyZh: "Lucía 说：“¡Vamos de compras!”（我们去购物吧！）你们走进一家服装店。店员 Nuria 很热情，可价格要用到三十、四十这样的大数字……学衣服、整十的数字、形容词、购物的句子，还有名词的阴阳性。",
      storyEn: "Lucía says: \"¡Vamos de compras!\" (Let's go shopping!) You walk into a clothes shop. Nuria the shop assistant is very friendly, but the prices use big numbers like thirty and forty… Learn clothes, tens, adjectives, shopping phrases and noun gender.",
      npc: { name: "Nuria", emoji: "💁‍♀️", roleZh: "服装店店员", roleEn: "shop assistant" },
      stampZh: "商店邮票", stampEn: "Shop stamp",
      levels: [
        {
          id: "shop-1", type: "normal",
          titleZh: "衣服（一）", titleEn: "Clothes 1",
          introZh: "衬衫、T恤、裤子、连衣裙，再学“我只是看看”“我能试一下吗”。",
          introEn: "Shirt, T-shirt, trousers, dress, plus \"I'm just looking\" and \"Can I try it on?\".",
          items: {
            words: ["ropa", "camisa", "camiseta", "pantalones", "vestido", "tienda"],
            phrases: ["ph-solo-estoy-mirando", "ph-tiene-otra-talla", "ph-puedo-probarmelo"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "shop-2", type: "normal",
          titleZh: "衣服（二）：贵还是便宜？", titleEn: "Clothes 2: Expensive or cheap?",
          introZh: "裙子、鞋、外套，还有“多少钱”“太贵了”“有便宜点的吗”。",
          introEn: "Skirt, shoes, jacket and coat, plus \"How much?\", \"It's too expensive\" and \"Anything cheaper?\".",
          items: {
            words: ["falda", "zapatos", "chaqueta", "abrigo", "supermercado", "caro", "barato"],
            phrases: ["ph-cuanto-cuesta", "ph-es-muy-caro", "ph-algo-mas-barato"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "shop-3", type: "normal",
          titleZh: "价格：三十到一百", titleEn: "Prices: thirty to one hundred",
          introZh: "整十的数字：30、40……一直到 100。看价格、结账都离不开它们。",
          introEn: "The tens: 30, 40… up to 100. You need them for prices and paying.",
          items: {
            words: ["treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa", "cien"],
            phrases: ["ph-cuanto-es"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "shop-4", type: "normal",
          titleZh: "新的旧的，阴性阳性", titleEn: "New or old, masculine or feminine",
          introZh: "“新、旧”，“我要这个”“我买了”，再练名词的阴阳性和冠词 el / la / un / una。",
          introEn: "New and old, \"I'd like this\", \"I'll take it\", and practice noun gender with el / la / un / una.",
          items: {
            words: ["nuevo", "viejo", "camisa", "vestido", "zapatos"],
            phrases: ["ph-quiero-esto", "ph-me-lo-llevo", "ph-me-da-una-bolsa"],
            grammar: [{ lesson: "gender-articles", ex: [0, 1, 2, 3, 4, 5, 6, 7] }]
          },
          modes: ["listen", "match", "fill"],
          count: 8
        },
        {
          id: "shop-5", type: "task",
          titleZh: "买一件T恤", titleEn: "Buying a T-shirt",
          introZh: "问价格、嫌贵、试穿、买下、刷卡——注意 camiseta 是阴性！",
          introEn: "Ask the price, say it's too expensive, try it on, buy it and pay by card. Remember camiseta is feminine!",
          items: { dialogue: "task-shop" },
          modes: ["dialogue"],
          count: 6
        },
        {
          id: "shop-6", type: "boss",
          titleZh: "大关：大减价", titleEn: "Boss: The big sale",
          introZh: "衣服、价格、形容词、购物句子和阴阳性全部上阵，抢到最划算的那件！",
          introEn: "Clothes, prices, adjectives, shopping phrases and gender all at once. Grab the best bargain!",
          items: {
            words: ["ropa", "camisa", "camiseta", "pantalones", "vestido", "falda", "zapatos", "chaqueta", "abrigo",
                    "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa", "cien",
                    "caro", "barato", "nuevo", "viejo", "tienda", "supermercado"],
            phrases: ["ph-cuanto-cuesta", "ph-cuanto-es", "ph-solo-estoy-mirando", "ph-quiero-esto", "ph-tiene-otra-talla",
                      "ph-puedo-probarmelo", "ph-es-muy-caro", "ph-algo-mas-barato", "ph-me-lo-llevo", "ph-me-da-una-bolsa"],
            grammar: [{ lesson: "gender-articles", ex: [0, 3, 4, 7] }]
          },
          modes: ["listen", "match", "guess", "order", "fill", "speed"],
          count: 12
        }
      ]
    },

    // ===== 7 火车站 =====
    {
      id: "train",
      titleZh: "火车站", titleEn: "The Train Station", emoji: "🚉",
      storyZh: "你想去古城 Toledo 玩一天。来到火车站，大屏幕上全是星期、时间和站台号！售票员 Diego 在窗口等你。学星期、数字 11–20、坐车出行和约时间的句子。",
      storyEn: "You want a day trip to the old city of Toledo. At the station, the big screen is full of days, times and platform numbers! Diego is waiting at the ticket window. Learn the days of the week, numbers 11–20, and phrases for travel and making plans.",
      npc: { name: "Diego", emoji: "👨‍💼", roleZh: "火车站售票员", roleEn: "ticket clerk" },
      stampZh: "火车站邮票", stampEn: "Train Station stamp",
      levels: [
        {
          id: "train-1", type: "normal",
          titleZh: "星期一到星期天", titleEn: "Monday to Sunday",
          introZh: "一个星期的七天，还有“明天”。再学“今天星期几”“我们明天见吗”。",
          introEn: "The seven days of the week and \"tomorrow\", plus \"What day is it?\" and \"Shall we meet tomorrow?\".",
          items: {
            words: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo", "manana"],
            phrases: ["ph-que-dia-es-hoy", "ph-quedamos-manana"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "train-2", type: "normal",
          titleZh: "车站和站台号", titleEn: "Stations & platform numbers",
          introZh: "数字 11–15、“车站”“昨天”，再学买票、要往返票、问火车几点开。",
          introEn: "Numbers 11–15, \"station\" and \"yesterday\", plus buying a (return) ticket and asking when the train leaves.",
          items: {
            words: ["once", "doce", "trece", "catorce", "quince", "estacion", "ayer"],
            phrases: ["ph-un-billete-para", "ph-ida-y-vuelta", "ph-a-que-hora-sale"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "train-3", type: "normal",
          titleZh: "几点了？", titleEn: "What time is it?",
          introZh: "数字 16–20，问现在几点、约几点见面，说“好的”和“请稍等”。",
          introEn: "Numbers 16–20, asking the time, agreeing on a time to meet, saying \"OK\" and \"one moment\".",
          items: {
            words: ["dieciseis", "diecisiete", "dieciocho", "diecinueve", "veinte"],
            phrases: ["ph-que-hora-es", "ph-es-la-una-y-media", "ph-a-que-hora-quedamos", "ph-vale-perfecto", "ph-un-momento"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "train-4", type: "normal",
          titleZh: "出行和约人的小句子", titleEn: "Little phrases for travel & plans",
          introZh: "问站台、找公交车站、问路上要多久、打车、请司机停车；约朋友时说“你有空吗”“今天不行”“我要迟到了”。",
          introEn: "Ask about platforms, find the bus stop, ask how long the trip takes, take a taxi and ask the driver to stop; and for plans: \"Are you free?\", \"I can't today\", \"I'm running late\".",
          items: {
            phrases: ["ph-de-que-anden", "ph-este-autobus", "ph-parada-de-autobus", "ph-al-aeropuerto", "ph-cuanto-tarda",
                      "ph-se-puede-ir-a-pie", "ph-pare-aqui", "ph-estas-libre", "ph-hoy-no-puedo", "ph-llego-tarde"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "train-5", type: "task",
          titleZh: "买火车票", titleEn: "Buying a train ticket",
          introZh: "在窗口跟 Diego 买一张去 Toledo 的往返票，问清楚几点开、几号站台。",
          introEn: "Buy a return ticket to Toledo from Diego, and find out the time and the platform.",
          items: { dialogue: "task-train" },
          modes: ["dialogue"],
          count: 6
        },
        {
          id: "train-6", type: "boss",
          titleZh: "大关：赶上火车", titleEn: "Boss: Catch the train",
          introZh: "火车马上要开了！星期、数字、时间和出行句子全部混在一起，快！",
          introEn: "The train is about to leave! Days, numbers, times and travel phrases all mixed up. Hurry!",
          items: {
            words: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo", "manana", "ayer", "estacion",
                    "once", "doce", "trece", "catorce", "quince", "dieciseis", "diecisiete", "dieciocho", "diecinueve", "veinte"],
            phrases: ["ph-un-billete-para", "ph-ida-y-vuelta", "ph-a-que-hora-sale", "ph-de-que-anden", "ph-este-autobus",
                      "ph-parada-de-autobus", "ph-al-aeropuerto", "ph-cuanto-tarda", "ph-se-puede-ir-a-pie", "ph-pare-aqui",
                      "ph-que-hora-es", "ph-es-la-una-y-media", "ph-que-dia-es-hoy", "ph-quedamos-manana", "ph-a-que-hora-quedamos",
                      "ph-estas-libre", "ph-vale-perfecto", "ph-hoy-no-puedo", "ph-llego-tarde", "ph-un-momento"]
          },
          modes: ["listen", "match", "guess", "order", "speed"],
          count: 12
        }
      ]
    },

    // ===== 8 药店 =====
    {
      id: "pharmacy",
      titleZh: "药店", titleEn: "The Pharmacy", emoji: "💊",
      storyZh: "在 Toledo 逛了一整天，你突然头疼、浑身发冷……得赶快找药店！先学会问路，再学会说哪儿不舒服，药剂师 Teresa 会帮你。学身体部位、感受和需要的句子，还有 estar（在；处于某种状态）。",
      storyEn: "After a long day in Toledo, you suddenly have a headache and feel cold… You need a pharmacy, fast! First learn to ask for directions, then say what's wrong, and pharmacist Teresa will help you. Learn body parts, feelings and needs, and the verb estar (to be somewhere / to be in a state).",
      npc: { name: "Teresa", emoji: "👩‍⚕️", roleZh: "药剂师", roleEn: "pharmacist" },
      stampZh: "药店邮票", stampEn: "Pharmacy stamp",
      levels: [
        {
          id: "pharmacy-1", type: "normal",
          titleZh: "药店在哪儿？", titleEn: "Where's the pharmacy?",
          introZh: "问附近有没有某个地方、远不远，听懂“右边、左转、一直走”。",
          introEn: "Ask if a place is nearby and if it's far, and understand \"on the right\", \"turn left\", \"straight ahead\".",
          items: {
            phrases: ["ph-hay-un-supermercado", "ph-esta-lejos", "ph-esta-a-la-derecha", "ph-gire-a-la-izquierda", "ph-siga-todo-recto"]
          },
          modes: ["listen", "match"],
          count: 5
        },
        {
          id: "pharmacy-2", type: "normal",
          titleZh: "estar：在哪儿", titleEn: "estar: where things are",
          introZh: "“……在哪里？”“我迷路了”，再练 estar 的变位：estoy, estás, está…",
          introEn: "\"Where is…?\" and \"I'm lost\", plus the forms of estar: estoy, estás, está…",
          items: {
            phrases: ["ph-donde-esta-el-bano", "ph-estoy-perdido", "ph-como-llego-estacion", "ph-en-el-mapa"],
            grammar: [{ lesson: "estar", ex: [0, 1, 2, 3, 4, 5, 6, 7] }]
          },
          modes: ["listen", "match", "fill"],
          count: 8
        },
        {
          id: "pharmacy-3", type: "normal",
          titleZh: "头和脸", titleEn: "Head & face",
          introZh: "头、眼睛、嘴、鼻子、耳朵，再学“我头疼”“我生病了”“我需要帮助”。",
          introEn: "Head, eyes, mouth, nose, ears, plus \"I have a headache\", \"I'm sick\" and \"I need help\".",
          items: {
            words: ["cabeza", "ojo", "boca", "nariz", "oreja"],
            phrases: ["ph-me-duele-la-cabeza", "ph-estoy-enfermo", "ph-estoy-cansado", "ph-tengo-frio", "ph-necesito-ayuda"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "pharmacy-4", type: "normal",
          titleZh: "手和脚", titleEn: "Hands & feet",
          introZh: "手、胳膊、腿、脚、医院，还有饿了、渴了、喜欢不喜欢、快叫医生。",
          introEn: "Hand, arm, leg, foot, hospital, plus hungry, thirsty, likes and dislikes, and \"Call a doctor!\".",
          items: {
            words: ["mano", "brazo", "pierna", "pie", "hospital"],
            phrases: ["ph-tengo-hambre", "ph-tengo-sed", "ph-me-gusta-mucho", "ph-no-me-gusta", "ph-llame-a-un-medico"]
          },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "pharmacy-5", type: "task",
          titleZh: "在药店买药", titleEn: "At the pharmacy",
          introZh: "告诉 Teresa 你哪里不舒服，听懂怎么吃药，再付钱道谢。",
          introEn: "Tell Teresa what's wrong, understand how to take the medicine, then pay and say thanks.",
          items: { dialogue: "task-pharmacy" },
          modes: ["dialogue"],
          count: 6
        },
        {
          id: "pharmacy-6", type: "boss",
          titleZh: "大关：快点好起来", titleEn: "Boss: Get well soon",
          introZh: "身体部位、问路、感受和 estar 一起考。答对了，病就好了！",
          introEn: "Body parts, directions, feelings and estar all together. Get them right and you'll feel better!",
          items: {
            words: ["cabeza", "ojo", "boca", "nariz", "oreja", "mano", "brazo", "pierna", "pie", "hospital"],
            phrases: ["ph-donde-esta-el-bano", "ph-hay-un-supermercado", "ph-esta-lejos", "ph-esta-a-la-derecha", "ph-gire-a-la-izquierda",
                      "ph-siga-todo-recto", "ph-estoy-perdido", "ph-como-llego-estacion", "ph-en-el-mapa",
                      "ph-tengo-hambre", "ph-tengo-sed", "ph-tengo-frio", "ph-estoy-cansado", "ph-estoy-enfermo",
                      "ph-me-duele-la-cabeza", "ph-me-gusta-mucho", "ph-no-me-gusta", "ph-necesito-ayuda", "ph-llame-a-un-medico"],
            grammar: [{ lesson: "estar", ex: [0, 1, 3, 5] }]
          },
          modes: ["listen", "match", "guess", "order", "fill", "speed"],
          count: 12
        }
      ]
    },

    // ===== 9 乡下农场 =====
    {
      id: "farm",
      titleZh: "乡下农场", titleEn: "The Farm", emoji: "🐄",
      storyZh: "病好啦！Lucía 的叔叔 Paco 请你去乡下的农场住两天。狗在叫，牛在吃草，Paco 一边干活一边跟你聊天。学动物、常用动词，还有规则动词的变位（我说、你吃、他住……）。",
      storyEn: "You're feeling better! Lucía's uncle Paco invites you to stay on his farm in the countryside. Dogs bark, cows graze, and Paco chats with you while he works. Learn animals, common verbs and regular verb endings (I speak, you eat, he lives…).",
      npc: { name: "Paco", emoji: "👨‍🌾", roleZh: "农场主", roleEn: "farmer" },
      stampZh: "农场邮票", stampEn: "Farm stamp",
      levels: [
        {
          id: "farm-1", type: "normal",
          titleZh: "农场的动物", titleEn: "Farm animals",
          introZh: "狗、猫、鸟、鱼、马、奶牛、猪、老鼠——农场里全都有！",
          introEn: "Dog, cat, bird, fish, horse, cow, pig, mouse: the farm has them all!",
          items: { words: ["perro", "gato", "pajaro", "pez", "caballo", "vaca", "cerdo", "raton"] },
          modes: ["listen", "match"],
          count: 8
        },
        {
          id: "farm-2", type: "normal",
          titleZh: "说、吃、喝、住、工作", titleEn: "Speak, eat, drink, live, work",
          introZh: "五个最常用的规则动词，再加上“大”和“小”。",
          introEn: "Five of the most common regular verbs, plus \"big\" and \"small\".",
          items: { words: ["hablar", "comer", "beber", "vivir", "trabajar", "grande", "pequeno"] },
          modes: ["listen", "match"],
          count: 7
        },
        {
          id: "farm-3", type: "normal",
          titleZh: "需要、去、有、想要、喜欢", titleEn: "Need, go, have, want, like",
          introZh: "再学五个常用动词，然后练规则动词的变位：-o, -as, -a…",
          introEn: "Five more common verbs, then practice regular verb endings: -o, -as, -a…",
          items: {
            words: ["necesitar", "ir", "tener", "querer", "gustar"],
            grammar: [{ lesson: "regular-verbs", ex: [0, 1, 2, 3, 4, 5, 6, 7] }]
          },
          modes: ["listen", "match", "fill"],
          count: 8
        },
        {
          id: "farm-4", type: "normal",
          titleZh: "复习：农场的一天", titleEn: "Review: A day on the farm",
          introZh: "动物和动词，这次要自己拼出来，例句也要自己排好。",
          introEn: "Now spell the animals and verbs yourself, and build the example sentences.",
          items: { words: ["perro", "gato", "caballo", "vaca", "cerdo", "hablar", "comer", "beber"] },
          modes: ["guess", "order", "match"],
          count: 8
        },
        {
          id: "farm-5", type: "task",
          titleZh: "Isabel 来电话", titleEn: "A call from Isabel",
          introZh: "从农场回来的那晚，你刚到家，朋友 Isabel 就打电话来问你近况。用 estar 和规则动词回答她！",
          introEn: "The evening you get back from the farm, just as you get home, your friend Isabel calls to catch up. Answer with estar and regular verbs!",
          items: { dialogue: "phone-call" },
          modes: ["dialogue"],
          count: 6
        },
        {
          id: "farm-6", type: "boss",
          titleZh: "大关：农场大丰收", titleEn: "Boss: Harvest time",
          introZh: "动物、动词和变位全部混在一起，帮 Paco 把活儿干完！",
          introEn: "Animals, verbs and verb endings all mixed up. Help Paco finish the work!",
          items: {
            words: ["perro", "gato", "pajaro", "pez", "caballo", "vaca", "cerdo", "raton",
                    "hablar", "comer", "beber", "vivir", "trabajar", "necesitar", "ir", "tener", "querer", "gustar", "grande", "pequeno"],
            grammar: [{ lesson: "regular-verbs", ex: [0, 2, 3, 6] }]
          },
          modes: ["listen", "match", "guess", "order", "fill", "speed"],
          count: 12
        }
      ]
    },

    // ===== 10 告别派对 =====
    {
      id: "party",
      titleZh: "告别派对", titleEn: "The Farewell Party", emoji: "🎉",
      storyZh: "旅行的最后一天！早上你又碰到了 Carmen——原来机场那位 Carmen 就住在 Lucía 家楼下。晚上，Javier 为你开了一个告别派对。用上这一路学到的所有西语，闯过最后的终极大关，集齐全部邮票！",
      storyEn: "The last day of your trip! In the morning you bump into Carmen again: the Carmen from the airport lives right below Lucía! In the evening Javier throws you a farewell party. Use all the Spanish you've learned, beat the final boss and complete your passport!",
      npc: { name: "Javier", emoji: "🕺", roleZh: "派对主人", roleEn: "party host" },
      stampZh: "告别派对邮票", stampEn: "Farewell Party stamp",
      levels: [
        {
          id: "party-1", type: "task",
          titleZh: "又见 Carmen", titleEn: "Carmen again",
          introZh: "早上在楼下碰到 Carmen，跟她打个招呼、聊两句。",
          introEn: "You meet Carmen downstairs in the morning. Say hello and chat for a moment.",
          items: { dialogue: "greet" },
          modes: ["dialogue"],
          count: 4
        },
        {
          id: "party-2", type: "task",
          titleZh: "派对上的新朋友", titleEn: "A new friend at the party",
          introZh: "派对开始了！Javier 走过来跟你说话，还介绍他妹妹给你认识。",
          introEn: "The party starts! Javier comes over to talk and introduces his sister.",
          items: { dialogue: "meet" },
          modes: ["dialogue"],
          count: 5
        },
        {
          id: "party-3", type: "task",
          titleZh: "你来自哪里？", titleEn: "Where are you from?",
          introZh: "派对上也有语言交流活动认识的朋友！西班牙人 Elena 想知道你从哪里来、做什么，还问起你的爸爸妈妈。",
          introEn: "Some guests are friends from a language exchange! Elena, who is Spanish, wants to know where you're from, what you do, and about your parents.",
          items: { dialogue: "origin-job" },
          modes: ["dialogue"],
          count: 5
        },
        {
          id: "party-4", type: "normal",
          titleZh: "旅行回忆", titleEn: "Trip memories",
          introZh: "翻翻旅行照片：一路上学过的词和句子，还会拼、会排吗？",
          introEn: "Look back at your trip photos: can you still spell the words and build the sentences?",
          items: {
            words: ["hola", "gracias", "cafe", "manzana", "verde", "madre", "camisa", "perro"],
            phrases: ["ph-me-llamo", "ph-cuanto-cuesta", "ph-donde-esta-el-bano", "ph-tengo-hambre"]
          },
          modes: ["guess", "order", "match"],
          count: 8
        },
        {
          id: "party-5", type: "boss",
          titleZh: "终极大关：告别派对", titleEn: "Final Boss: The farewell party",
          introZh: "整个旅行的内容大混战！单词、句子、语法、限时快答全来。打赢它，护照就集满啦！",
          introEn: "Everything from the whole trip! Words, phrases, grammar and a speed round. Win it to complete your passport!",
          items: {
            words: ["hola", "buenos-dias", "gracias", "por-favor", "siete", "cafe", "pan", "rojo", "azul", "hace-sol",
                    "madre", "hermano", "camisa", "cincuenta", "lunes", "quince", "cabeza", "mano", "perro", "vaca",
                    "comer", "hablar", "grande", "barato"],
            phrases: ["ph-no-entiendo", "ph-la-cuenta", "ph-me-llamo", "ph-cuanto-cuesta", "ph-a-que-hora-sale",
                      "ph-me-duele-la-cabeza", "ph-donde-esta-el-bano", "ph-necesito-ayuda"],
            grammar: [
              { lesson: "pronouns", ex: [0, 1] },
              { lesson: "gender-articles", ex: [0, 4] },
              { lesson: "ser", ex: [0, 1] },
              { lesson: "estar", ex: [0, 1] },
              { lesson: "regular-verbs", ex: [0, 2] }
            ]
          },
          modes: ["listen", "match", "guess", "order", "fill", "speed"],
          count: 12
        }
      ]
    }
  ],

  // ===== 新写的对话任务（格式和 data/dialogues.js 一样）=====
  tasks: [
    // 机场入境（区域 1：只用到字母和打招呼）
    {
      id: "task-airport",
      titleZh: "入境检查", titleEn: "Passport control",
      sceneZh: "你刚下飞机，来到入境窗口。工作人员 Carmen 要检查你的护照。", sceneEn: "You've just landed. At passport control, officer Carmen needs to check your passport.",
      partner: "Carmen",
      lines: [
        { who: "them", es: "¡Hola! ¡Buenos días!", zh: "你好！早上好！", en: "Hi! Good morning!" },
        { who: "me",
          hintZh: "也跟她说你好、早上好。", hintEn: "Say hello and good morning back.",
          options: [
            { es: "¡Buenas noches!", zh: "晚上好！", en: "Good evening!", correct: false, whyZh: "现在是早上，buenas noches 是晚上说的。" },
            { es: "¡Hola, buenos días!", zh: "你好，早上好！", en: "Hi, good morning!", correct: true },
            { es: "¡Adiós!", zh: "再见！", en: "Goodbye!", correct: false, whyZh: "刚见面不说再见。" }
          ],
          alsoOk: ["¡Buenos días!", "¡Hola!", "¡Hola, Carmen, buenos días!"],
          note: ""
        },
        { who: "them", es: "¿Qué tal el viaje?", zh: "旅途怎么样？", en: "How was the trip?",
          note: "新词：el viaje = 旅行；旅途。" },
        { who: "me",
          hintZh: "告诉她很好。", hintEn: "Tell her it was very good.",
          options: [
            { es: "¡Hasta luego!", zh: "回头见！", en: "See you later!", correct: false, whyZh: "hasta luego 是告别时说的；她在问你旅途怎么样。" },
            { es: "Muy bien.", zh: "很好。", en: "Very good.", correct: true },
            { es: "Buenas tardes.", zh: "下午好。", en: "Good afternoon.", correct: false, whyZh: "你们已经打过招呼了，而且现在是早上；她问的是“怎么样”。" }
          ],
          alsoOk: ["Bien.", "Muy bien, gracias.", "Bien, gracias."],
          note: "muy = 很，muy bien = 很好。"
        },
        { who: "them", es: "El pasaporte, por favor.", zh: "请出示护照。", en: "Your passport, please.",
          note: "新词：el pasaporte = 护照；por favor = 请，下一站酒店会正式学。" },
        { who: "me",
          hintZh: "把护照递给她，说一句“给您”。", hintEn: "Hand over your passport and say \"Here you are\".",
          options: [
            { es: "¿Qué tal?", zh: "怎么样？", en: "How's it going?", correct: false, whyZh: "她要看你的护照，这时要一边递护照一边说 aquí tiene（给您）。" },
            { es: "Adiós.", zh: "再见。", en: "Goodbye.", correct: false, whyZh: "检查还没结束，现在不能走。" },
            { es: "Aquí tiene.", zh: "给您。", en: "Here you are.", correct: true }
          ],
          alsoOk: ["Sí, aquí tiene.", "Aquí tiene, señora."],
          note: "新词：Aquí tiene = 给您，递东西给别人时说。qu 读 k：a-KÍ TIE-ne。"
        },
        { who: "them", es: "¿Es usted Lin?", zh: "您是 Lin 吗？", en: "Are you Lin?",
          note: "新词：usted = 您（尊称）；es = 是。" },
        { who: "me",
          hintZh: "你就是 Lin，说“是”。", hintEn: "You are Lin. Say yes.",
          options: [
            { es: "Sí.", zh: "是。", en: "Yes.", correct: true },
            { es: "No.", zh: "不是。", en: "No.", correct: false, whyZh: "你就是 Lin，要说 sí（是）。" },
            { es: "Buenas noches.", zh: "晚上好。", en: "Good evening.", correct: false, whyZh: "她问你是不是 Lin，要回答“是”或“不是”。" }
          ],
          alsoOk: ["Sí, soy Lin.", "Sí, señora."],
          note: "新词：sí = 是，一定要带重音；no = 不；不是。"
        },
        { who: "them", es: "Muy bien, todo bien. ¡Hasta luego!", zh: "很好，没问题。回头见！", en: "Very good, everything's fine. See you!",
          note: "todo bien = 一切都好；没问题。" },
        { who: "me",
          hintZh: "跟她道别。", hintEn: "Say goodbye to her.",
          options: [
            { es: "¡Hola, buenos días!", zh: "你好，早上好！", en: "Hi, good morning!", correct: false, whyZh: "hola 是见面时说的，告别要说 adiós。" },
            { es: "¿Qué tal el viaje?", zh: "旅途怎么样？", en: "How was the trip?", correct: false, whyZh: "这是她刚才问你的话，现在要和她道别。" },
            { es: "¡Adiós, hasta luego!", zh: "再见，回头见！", en: "Bye, see you later!", correct: true }
          ],
          alsoOk: ["¡Adiós!", "¡Hasta luego!", "¡Adiós, Carmen!"],
          note: ""
        },
        { who: "them", es: "¡Adiós! ¡Buen viaje!", zh: "再见！旅途愉快！", en: "Bye! Have a good trip!",
          note: "buen viaje = 旅途愉快。" }
      ]
    },

    // 酒店入住（区域 2：打招呼 + 礼貌用语 + 数字 0–10 + 救命句子）
    {
      id: "task-hotel",
      titleZh: "办理入住", titleEn: "Checking in",
      sceneZh: "下午，你拖着行李来到酒店前台，接待员 Hugo 正在等你。", sceneEn: "In the afternoon you arrive at the hotel front desk with your suitcase. Hugo the receptionist is waiting.",
      partner: "Hugo",
      lines: [
        { who: "them", es: "¡Buenas tardes! ¿Qué tal?", zh: "下午好！您好吗？", en: "Good afternoon! How are you?" },
        { who: "me",
          hintZh: "回他下午好，说你挺好，谢谢。", hintEn: "Say good afternoon back, and that you're fine, thanks.",
          options: [
            { es: "Buenos días. Bien, gracias.", zh: "早上好。挺好，谢谢。", en: "Good morning. Fine, thanks.", correct: false, whyZh: "现在是下午，要说 buenas tardes。" },
            { es: "Buenas tardes. De nada.", zh: "下午好。不客气。", en: "Good afternoon. You're welcome.", correct: false, whyZh: "de nada 是回答 gracias 的，他没有谢你。" },
            { es: "Buenas tardes. Bien, gracias.", zh: "下午好。挺好，谢谢。", en: "Good afternoon. Fine, thanks.", correct: true }
          ],
          alsoOk: ["Bien, gracias.", "Buenas tardes. Muy bien, gracias.", "Buenas tardes. Bien, gracias, ¿y usted?"],
          note: ""
        },
        { who: "them", es: "¿Su nombre, por favor?", zh: "请问您叫什么名字？", en: "Your name, please?",
          note: "新词：su nombre = 您的名字。" },
        { who: "me",
          hintZh: "告诉他你叫 Lin。", hintEn: "Tell him your name is Lin.",
          options: [
            { es: "Lin.", zh: "Lin。", en: "Lin.", correct: true },
            { es: "Hugo.", zh: "Hugo。", en: "Hugo.", correct: false, whyZh: "Hugo 是前台的名字，不是你的。" },
            { es: "Gracias.", zh: "谢谢。", en: "Thank you.", correct: false, whyZh: "他问的是你的名字，要回答名字。" }
          ],
          alsoOk: ["Me llamo Lin.", "Soy Lin."],
          note: "也可以说 Me llamo Lin（我叫 Lin），在“朋友家做客”那一站会学到。"
        },
        { who: "them", es: "¿Cómo se escribe?", zh: "怎么拼写？", en: "How do you spell it?",
          note: "新词：¿Cómo se escribe? = 怎么拼写？报字母时要用字母的名字：L 叫 ele，N 叫 ene。" },
        { who: "me",
          hintZh: "用字母的名字拼出 L-I-N。", hintEn: "Spell L-I-N using the letter names.",
          options: [
            { es: "Ele, e, ene.", zh: "L、E、N。", en: "L, E, N.", correct: false, whyZh: "字母 I 读 i；e 是字母 E。" },
            { es: "Ele, i, ene.", zh: "L、I、N。", en: "L, I, N.", correct: true },
            { es: "Ene, i, ele.", zh: "N、I、L。", en: "N, I, L.", correct: false, whyZh: "顺序反了：Lin 是 L-I-N。" }
          ],
          alsoOk: ["L, I, N.", "Ele, i, ene. Lin."],
          note: ""
        },
        { who: "them", es: "Gracias. Su habitación es la siete.", zh: "谢谢。您的房间是七号。", en: "Thank you. Your room is number seven.",
          note: "新词：la habitación = 房间，h 不发音。" },
        { who: "me",
          hintZh: "你没听清，请他再说一遍。", hintEn: "You didn't catch it. Ask him to repeat.",
          options: [
            { es: "¿Puede repetir, por favor?", zh: "您能再说一遍吗？", en: "Can you repeat, please?", correct: true },
            { es: "No pasa nada.", zh: "没关系。", en: "It's OK.", correct: false, whyZh: "no pasa nada 是“没关系”，用来回答别人的道歉。" },
            { es: "De nada.", zh: "不客气。", en: "You're welcome.", correct: false, whyZh: "de nada 是“不客气”，用来回答 gracias。" }
          ],
          alsoOk: ["¿Puede repetir?", "Perdón, ¿puede repetir, por favor?", "Más despacio, por favor."],
          note: ""
        },
        { who: "them", es: "Sí, claro. La siete.", zh: "好的，当然。七号。", en: "Yes, of course. Number seven.",
          note: "claro = 当然。" },
        { who: "me",
          hintZh: "确认一下房间号是七，再谢谢他。", hintEn: "Confirm the room is seven, and thank him.",
          options: [
            { es: "Seis. Muchas gracias.", zh: "六号。非常感谢。", en: "Six. Thank you very much.", correct: false, whyZh: "seis 是六，他说的是 siete（七）。" },
            { es: "Siete. Muchas gracias.", zh: "七号。非常感谢。", en: "Seven. Thank you very much.", correct: true },
            { es: "Siete. De nada.", zh: "七号。不客气。", en: "Seven. You're welcome.", correct: false, whyZh: "要谢谢他（gracias）；de nada 是“不客气”。" }
          ],
          alsoOk: ["Siete, gracias.", "La siete, muchas gracias.", "Muchas gracias."],
          note: ""
        },
        { who: "them", es: "De nada. ¡Hasta luego!", zh: "不客气。回头见！", en: "You're welcome. See you later!" }
      ]
    },

    // 服装店买 T 恤（区域 6：衣服 + 价格 + 形容词 + 购物句子 + 阴阳性）
    {
      id: "task-shop",
      titleZh: "买一件T恤", titleEn: "Buying a T-shirt",
      sceneZh: "你和 Lucía 走进一家服装店，店员 Nuria 迎了上来。", sceneEn: "You and Lucía walk into a clothes shop. Nuria the shop assistant comes over.",
      partner: "Nuria",
      lines: [
        { who: "them", es: "¡Hola, buenos días! ¿Le ayudo?", zh: "你好，早上好！需要帮忙吗？", en: "Hi, good morning! Can I help you?",
          note: "¿Le ayudo? = 要我帮您吗？，店员常这样问。" },
        { who: "me",
          hintZh: "说你只是看看，谢谢。", hintEn: "Say you're just looking, thanks.",
          options: [
            { es: "Solo estoy mirando, gracias.", zh: "我只是看看，谢谢。", en: "I'm just looking, thanks.", correct: true },
            { es: "Me lo llevo.", zh: "我买了。", en: "I'll take it.", correct: false, whyZh: "你还什么都没挑，不能说“我买了”。" },
            { es: "La cuenta, por favor.", zh: "请结账。", en: "The bill, please.", correct: false, whyZh: "la cuenta 是在餐厅、咖啡馆结账时说的。" }
          ],
          alsoOk: ["Solo estoy mirando.", "No, gracias. Solo estoy mirando."],
          note: ""
        },
        { who: "them", es: "Vale. ¡Mire, esta camiseta roja es nueva!", zh: "好的。您看，这件红T恤是新款！", en: "OK. Look, this red T-shirt is new!",
          note: "mire = 您看；esta = 这（件），后面接阴性名词。" },
        { who: "me",
          hintZh: "问问多少钱。", hintEn: "Ask how much it is.",
          options: [
            { es: "¿Qué hora es?", zh: "现在几点？", en: "What time is it?", correct: false, whyZh: "这是问“现在几点”，不是问价格。" },
            { es: "¿Cuánto cuesta?", zh: "多少钱？", en: "How much is it?", correct: true },
            { es: "¿Cuántos años tienes?", zh: "你多大了？", en: "How old are you?", correct: false, whyZh: "这是问别人的年龄。" }
          ],
          alsoOk: ["¿Cuánto cuesta la camiseta?"],
          note: ""
        },
        { who: "them", es: "Cuesta cuarenta euros.", zh: "四十欧元。", en: "It's forty euros.",
          note: "el euro = 欧元。" },
        { who: "me",
          hintZh: "说这件T恤很贵，再问有没有便宜一点的。", hintEn: "Say the T-shirt is very expensive, and ask for something cheaper.",
          options: [
            { es: "La camiseta es muy caro. ¿Tiene algo más barato?", zh: "（阴阳性错误）", en: "(wrong gender)", correct: false, whyZh: "la camiseta 是阴性名词，要说 cara。" },
            { es: "Es muy barata. ¿Tiene algo más barato?", zh: "很便宜。有便宜一点的吗？", en: "It's very cheap. Anything cheaper?", correct: false, whyZh: "barata 是“便宜”，前后矛盾了。" },
            { es: "La camiseta es muy cara. ¿Tiene algo más barato?", zh: "这件T恤很贵。有便宜一点的吗？", en: "The T-shirt is very expensive. Do you have anything cheaper?", correct: true }
          ],
          alsoOk: ["Es muy cara.", "Es muy cara. ¿Tiene algo más barato?", "La camiseta es muy cara.", "¿Tiene algo más barato?", "Es cara. ¿Tiene algo más barato?"],
          note: "algo（东西）不分阴阳性，所以 algo más barato 里用 -o。"
        },
        { who: "them", es: "Sí. Esta camiseta blanca cuesta treinta euros.", zh: "有。这件白T恤三十欧元。", en: "Yes. This white T-shirt is thirty euros." },
        { who: "me",
          hintZh: "你想试一下这件T恤。", hintEn: "You'd like to try the T-shirt on.",
          options: [
            { es: "¿Puedo probármelo?", zh: "（阴阳性错误）", en: "(wrong gender)", correct: false, whyZh: "camiseta 是阴性，lo 要换成 la：probármela。" },
            { es: "¿Puedo probármela?", zh: "我可以试一下吗？", en: "Can I try it on?", correct: true },
            { es: "¿Puedo pagar con tarjeta?", zh: "我可以刷卡吗？", en: "Can I pay by card?", correct: false, whyZh: "你还没试穿，先问能不能试。" }
          ],
          alsoOk: ["¿Puedo probármela, por favor?", "¿Me la puedo probar?"],
          note: "probármela = probar（试）+ me（我自己）+ la（它，指阴性的 camiseta）。"
        },
        { who: "them", es: "Sí, claro. … ¿Qué tal?", zh: "当然可以。……怎么样？", en: "Yes, of course. … How is it?" },
        { who: "me",
          hintZh: "很合身！告诉她你买了。", hintEn: "It fits! Tell her you'll take it.",
          options: [
            { es: "Me la llevo.", zh: "我买了。", en: "I'll take it.", correct: true },
            { es: "Me lo llevo.", zh: "（阴阳性错误）", en: "(wrong gender)", correct: false, whyZh: "camiseta 是阴性，要说 me la llevo。" },
            { es: "Solo estoy mirando.", zh: "我只是看看。", en: "I'm just looking.", correct: false, whyZh: "你已经决定买了，不是“只是看看”。" }
          ],
          alsoOk: ["Me la llevo, gracias.", "Muy bien, me la llevo."],
          note: ""
        },
        { who: "them", es: "¡Perfecto! Son treinta euros.", zh: "太好了！一共三十欧元。", en: "Perfect! That's thirty euros." },
        { who: "me",
          hintZh: "问问能不能刷卡。", hintEn: "Ask if you can pay by card.",
          options: [
            { es: "¿Tiene otra talla?", zh: "有别的尺码吗？", en: "Do you have another size?", correct: false, whyZh: "衣服很合身，不用换尺码；现在是付钱。" },
            { es: "¿Me pone un café?", zh: "请给我来一杯咖啡。", en: "Can I have a coffee?", correct: false, whyZh: "这是在咖啡馆点咖啡的说法。" },
            { es: "¿Puedo pagar con tarjeta?", zh: "我可以刷卡吗？", en: "Can I pay by card?", correct: true }
          ],
          alsoOk: ["¿Puedo pagar con tarjeta, por favor?"],
          note: ""
        },
        { who: "them", es: "Sí, claro. ¡Muchas gracias y hasta luego!", zh: "当然可以。非常感谢，再见！", en: "Yes, of course. Thank you very much, see you!" }
      ]
    },

    // 火车站买票（区域 7：星期 + 数字 11–20 + 出行和时间句子）
    {
      id: "task-train",
      titleZh: "买火车票", titleEn: "Buying a train ticket",
      sceneZh: "你在马德里火车站的售票窗口，想买去古城 Toledo 的票。售票员是 Diego。", sceneEn: "You're at the ticket window of a Madrid train station, buying a ticket to the old city of Toledo. The clerk is Diego.",
      partner: "Diego",
      lines: [
        { who: "them", es: "Buenas tardes. ¿Adónde va?", zh: "下午好。您去哪儿？", en: "Good afternoon. Where are you going?",
          note: "¿Adónde va? = 您去哪儿？adónde 带重音。" },
        { who: "me",
          hintZh: "说要一张去 Toledo 的票。", hintEn: "Ask for a ticket to Toledo.",
          options: [
            { es: "Al aeropuerto, por favor.", zh: "请去机场。", en: "To the airport, please.", correct: false, whyZh: "这是坐出租车时对司机说的，而且你要去 Toledo。" },
            { es: "Un billete para Toledo, por favor.", zh: "请给我一张去 Toledo 的票。", en: "A ticket to Toledo, please.", correct: true },
            { es: "La carta, por favor.", zh: "请给我菜单。", en: "The menu, please.", correct: false, whyZh: "la carta 是餐厅的菜单。" }
          ],
          alsoOk: ["Un billete para Toledo.", "Para Toledo, por favor."],
          note: "Toledo 是马德里附近的古城，坐高铁大约半小时。拉美说 el boleto（票）。"
        },
        { who: "them", es: "¿Para hoy?", zh: "今天的吗？", en: "For today?" },
        { who: "me",
          hintZh: "说不是，要明天的。", hintEn: "Say no, for tomorrow.",
          options: [
            { es: "No, para ayer.", zh: "不，要昨天的。", en: "No, for yesterday.", correct: false, whyZh: "ayer 是昨天，不能买昨天的票。" },
            { es: "Sí, para hoy.", zh: "对，今天的。", en: "Yes, for today.", correct: false, whyZh: "你要的是明天（mañana）的票。" },
            { es: "No, para mañana.", zh: "不，要明天的。", en: "No, for tomorrow.", correct: true }
          ],
          alsoOk: ["Para mañana.", "No, para mañana, por favor."],
          note: ""
        },
        { who: "them", es: "¿Solo de ida?", zh: "只要单程吗？", en: "One way only?",
          note: "solo de ida = 单程。" },
        { who: "me",
          hintZh: "说不，你要往返票。", hintEn: "Say no, you want a return ticket.",
          options: [
            { es: "No, de ida y vuelta, por favor.", zh: "不，要往返票。", en: "No, a return ticket, please.", correct: true },
            { es: "Sí, de ida y vuelta.", zh: "对，往返。", en: "Yes, return.", correct: false, whyZh: "说 sí 等于同意买单程票；你要往返，应该先说 no。" },
            { es: "Vale, perfecto.", zh: "好的，太好了。", en: "OK, perfect.", correct: false, whyZh: "vale 等于同意只买单程，可你要的是往返票。" }
          ],
          alsoOk: ["De ida y vuelta, por favor.", "No, de ida y vuelta."],
          note: ""
        },
        { who: "them", es: "Son dieciocho euros.", zh: "一共十八欧元。", en: "That's eighteen euros." },
        { who: "me",
          hintZh: "付完钱，问火车几点开。", hintEn: "After paying, ask what time the train leaves.",
          options: [
            { es: "¿Qué hora es?", zh: "现在几点？", en: "What time is it?", correct: false, whyZh: "这是问“现在几点”，不是问火车几点开。" },
            { es: "¿A qué hora sale el tren?", zh: "火车几点开？", en: "What time does the train leave?", correct: true },
            { es: "¿Cuánto tarda el viaje?", zh: "路上要多长时间？", en: "How long does the trip take?", correct: false, whyZh: "这是问路上要多久，不是问几点开。" }
          ],
          alsoOk: ["¿A qué hora sale?"],
          note: ""
        },
        { who: "them", es: "A las once.", zh: "十一点。", en: "At eleven." },
        { who: "me",
          hintZh: "再问从几号站台出发。", hintEn: "Ask which platform it leaves from.",
          options: [
            { es: "¿De qué andén sale?", zh: "从几号站台出发？", en: "Which platform does it leave from?", correct: true },
            { es: "¿Dónde está el baño?", zh: "厕所在哪里？", en: "Where is the bathroom?", correct: false, whyZh: "这是问厕所在哪儿。" },
            { es: "¿Está lejos?", zh: "远吗？", en: "Is it far?", correct: false, whyZh: "这是问“远不远”，不是问站台。" }
          ],
          alsoOk: ["¿De qué andén sale el tren?"],
          note: ""
        },
        { who: "them", es: "Del andén doce.", zh: "十二号站台。", en: "From platform twelve." },
        { who: "me",
          hintZh: "确认一下：十二号站台，再谢谢他。", hintEn: "Confirm: platform twelve, and thank him.",
          options: [
            { es: "Andén dos. ¡Muchas gracias!", zh: "二号站台。非常感谢！", en: "Platform two. Thank you very much!", correct: false, whyZh: "dos 是二，他说的是 doce（十二）。" },
            { es: "Andén diez. ¡Muchas gracias!", zh: "十号站台。非常感谢！", en: "Platform ten. Thank you very much!", correct: false, whyZh: "diez 是十，他说的是 doce（十二）。" },
            { es: "Andén doce. ¡Muchas gracias!", zh: "十二号站台。非常感谢！", en: "Platform twelve. Thank you very much!", correct: true }
          ],
          alsoOk: ["Doce, gracias.", "Andén doce, gracias."],
          note: ""
        },
        { who: "them", es: "De nada. ¡Buen viaje!", zh: "不客气。旅途愉快！", en: "You're welcome. Have a good trip!" }
      ]
    },

    // 药店买药（区域 8：身体 + 感受和需要 + estar）
    {
      id: "task-pharmacy",
      titleZh: "在药店买药", titleEn: "At the pharmacy",
      sceneZh: "你头疼、发冷，终于找到一家药店。药剂师 Teresa 在柜台后面。", sceneEn: "You have a headache and feel cold. You finally find a pharmacy, and pharmacist Teresa is behind the counter.",
      partner: "Teresa",
      lines: [
        { who: "them", es: "Buenas tardes. ¿Qué le pasa?", zh: "下午好。您怎么了？", en: "Good afternoon. What's wrong?",
          note: "¿Qué le pasa? = 您怎么了？" },
        { who: "me",
          hintZh: "说你头疼。", hintEn: "Say you have a headache.",
          options: [
            { es: "Me duele el pie.", zh: "我脚疼。", en: "My foot hurts.", correct: false, whyZh: "el pie 是脚，你是头（la cabeza）疼。" },
            { es: "Me duele la cabeza.", zh: "我头疼。", en: "I have a headache.", correct: true },
            { es: "Me gusta la cabeza.", zh: "我喜欢头。", en: "I like the head.", correct: false, whyZh: "me gusta 是“我喜欢”；说疼要用 me duele。" }
          ],
          alsoOk: ["Me duele mucho la cabeza."],
          note: ""
        },
        { who: "them", es: "¿Tiene fiebre?", zh: "您发烧吗？", en: "Do you have a fever?",
          note: "新词：la fiebre = 发烧。" },
        { who: "me",
          hintZh: "说没有发烧，但是你觉得冷。", hintEn: "Say no fever, but you feel cold.",
          options: [
            { es: "No, pero hace frío.", zh: "没有，但是天气冷。", en: "No, but it's cold (weather).", correct: false, whyZh: "hace frío 是说天气冷；说自己觉得冷要用 tengo frío。" },
            { es: "No, pero soy frío.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "说自己觉得冷要用 tener：tengo frío。soy frío 是“我是个冷淡的人”。" },
            { es: "No, pero tengo frío.", zh: "没有，但是我觉得冷。", en: "No, but I feel cold.", correct: true }
          ],
          alsoOk: ["No. Tengo frío.", "No, pero tengo mucho frío."],
          note: "新词：pero = 但是。"
        },
        { who: "them", es: "¿Le duelen los ojos?", zh: "您眼睛疼吗？", en: "Do your eyes hurt?",
          note: "对 usted（您）说 le duele / le duelen；说自己用 me duele / me duelen。" },
        { who: "me",
          hintZh: "说不疼，眼睛不疼。", hintEn: "Say no, your eyes don't hurt.",
          options: [
            { es: "No, no me duelen los ojos.", zh: "不，我眼睛不疼。", en: "No, my eyes don't hurt.", correct: true },
            { es: "No, no me duele los ojos.", zh: "（错误说法）", en: "(incorrect)", correct: false, whyZh: "los ojos 是复数，要用 duelen。" },
            { es: "Sí, me duelen los ojos.", zh: "对，我眼睛疼。", en: "Yes, my eyes hurt.", correct: false, whyZh: "你的眼睛不疼，要说 no。" }
          ],
          alsoOk: ["No, no me duelen.", "No."],
          note: "第一个 no 是“不”（回答），第二个 no 放在 me 前面表示否定。"
        },
        { who: "them", es: "Tome esta pastilla dos veces al día, después de comer.", zh: "这种药片一天吃两次，饭后吃。", en: "Take this pill twice a day, after meals.",
          note: "新词：tome = 请服用；la pastilla = 药片；dos veces al día = 一天两次；después de comer = 饭后。" },
        { who: "me",
          hintZh: "她说得太快了，请她说慢一点。", hintEn: "She spoke too fast. Ask her to speak more slowly.",
          options: [
            { es: "No pasa nada.", zh: "没关系。", en: "It's OK.", correct: false, whyZh: "no pasa nada 是“没关系”；这里你需要她说慢一点。" },
            { es: "Más despacio, por favor.", zh: "请说慢一点。", en: "Slower, please.", correct: true },
            { es: "Me gusta mucho.", zh: "我很喜欢。", en: "I like it a lot.", correct: false, whyZh: "me gusta mucho 是“我很喜欢”，接不上她的话。" }
          ],
          alsoOk: ["¿Puede repetir, por favor?", "Más despacio, por favor. No entiendo."],
          note: ""
        },
        { who: "them", es: "Una pastilla… dos veces… al día.", zh: "一片……两次……一天。", en: "One pill… twice… a day." },
        { who: "me",
          hintZh: "听懂了！问问多少钱。", hintEn: "Got it! Ask how much it is.",
          options: [
            { es: "¿Está lejos?", zh: "远吗？", en: "Is it far?", correct: false, whyZh: "这是问“远不远”，不是问价格。" },
            { es: "¿Cuánto cuesta?", zh: "多少钱？", en: "How much is it?", correct: true },
            { es: "¿Qué hora es?", zh: "现在几点？", en: "What time is it?", correct: false, whyZh: "这是问“现在几点”，不是问价格。" }
          ],
          alsoOk: ["¿Cuánto es?"],
          note: ""
        },
        { who: "them", es: "Cinco euros. Y beba mucha agua.", zh: "五欧元。还有，要多喝水。", en: "Five euros. And drink lots of water.",
          note: "beba = 请喝，来自 beber；mucha agua = 很多水（agua 是阴性，所以用 mucha）。" },
        { who: "me",
          hintZh: "谢谢她，跟她说再见。", hintEn: "Thank her and say goodbye.",
          options: [
            { es: "Muchas gracias. ¡Adiós!", zh: "非常感谢。再见！", en: "Thank you very much. Goodbye!", correct: true },
            { es: "De nada. ¡Adiós!", zh: "不客气。再见！", en: "You're welcome. Goodbye!", correct: false, whyZh: "她帮了你，要说谢谢；de nada 是回答别人谢你的。" },
            { es: "Lo siento. ¡Adiós!", zh: "对不起。再见！", en: "I'm sorry. Goodbye!", correct: false, whyZh: "你没做错事，不用道歉，应该道谢。" }
          ],
          alsoOk: ["Gracias. ¡Adiós!", "Muchas gracias. ¡Hasta luego!"],
          note: ""
        },
        { who: "them", es: "¡De nada! ¡Que se mejore!", zh: "不客气！祝您早日康复！", en: "You're welcome! Get well soon!",
          note: "¡Que se mejore! = 祝您早日康复，对 usted 说。" }
      ]
    }
  ]
};
