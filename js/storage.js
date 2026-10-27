// ============================================
// 学习进度记录（storage.js）
// 所有进度都存在浏览器的 localStorage 里，只用一个 key：
//   "es-study-progress-v1" → { version, words, grammar, dialogues, alphabetSeen, alphabetAt, alphabetLetters, lastQuiz?, games, days, xp, settings, resetAt }
//   （句子和单词共用 words：句子的 id 以 "ph-" 开头；games、days 是阶段 9 加的，xp、settings 是阶段 10 加的，
//    旧数据没有时当作空的 / 默认值，version 仍是 1）
// localStorage 不可用（被禁用、隐私模式、出错）时，自动改用内存保存：
// 网站照样能用，只是关掉页面后进度会丢失（页面顶部会有一行小字提示）。
//
// 单词用简单的“莱特纳盒子”法记熟练度：
//   box 0–5。答对 / 认识 → box + 1（最多 5）；
//   答错 / 不认识 → box 直接回到 0（像卡片退回第一个盒子，下次优先复习）；
//   “模糊” → box 不变，只更新时间。
//   box ≥ 3 视为“已掌握”。
//
// 用法（页面里直接调用 window.Progress）：
//   Progress.markWord(id, true/false)   记一次答对 / 答错
//   Progress.touchWord(id)              “模糊”：box 不变，只更新时间
//   Progress.getWord(id)                → { box, correct, wrong, lastSeen } 或 null（新词）
//   Progress.wordStatus(id)             → "new" / "learning" / "mastered"
//   Progress.getBox(id)                 → 盒子号 0–5（新词 = 0）；页面用它画掌握进度的 3 个小圆点
//   Progress.masteredCount(ids?)        已掌握个数（可只数一部分 id）
//   Progress.learningCount(ids)         学习中的个数（学过、还没掌握；只数传入的 id）
//   Progress.isDue(id)                  这个词现在该不该复习
//   Progress.reviewQueue(words, max)    把单词排成复习顺序（不熟的在前，新词最后）
//   Progress.wordCounts(ids)            → { seen, due, mastered }
//   Progress.recordGrammar(lessonId, score, total)  记一课的成绩（best 取最高分）
//   Progress.getGrammar(lessonId)       → { best, total, done } 或 null
//   Progress.recordDialogue(id, score, total)  记一个情景对话的成绩（答对几轮；best 取最高分）
//   Progress.getDialogue(id)            → { best, total, done } 或 null（还没练过）
//   Progress.recordQuiz(score, total)   记最近一次小测验成绩（只留最近一次）
//   Progress.lastQuiz()                 → { score, total, time } 或 null（还没做过）
//   Progress.markAlphabetSeen(letter?)  打开过字母页 / 听过某个字母
//   Progress.recordGame(gameId, score, lowerIsBetter)  记一局小游戏的成绩
//                                       → { best, plays, lastSeen, lowerIsBetter, isRecord, first, previous }
//                                       lowerIsBetter = true：分数越小越好（例如翻牌配对的步数）；false：越大越好
//   Progress.getGame(gameId)            → { best, plays, lastSeen, lowerIsBetter } 或 null（还没玩过）
//   Progress.streak()                   连续学习天数（从今天往回数；今天还没学就从昨天往回数）
//   Progress.studiedToday()             今天学过没有（true / false）
//   Progress.studyDays()                一共学习过几天（最多记最近 400 天）
//   Progress.dayKey(time?)              本地日期 "YYYY-MM-DD"
//   “学习日”：markWord / touchWord / recordGrammar / touchGrammar / recordDialogue / recordQuiz / recordGame /
//   markAlphabetSeen(字母) 时自动记下今天（本地日期）。
//   Progress.reset()                  清除全部学习记录（同步时其他设备也会清除）
//   Progress.isAvailable()              true = 能保存；false = 只在内存里
//
// ---------- 跨设备同步（Progress.sync） ----------
// 只在 claude.ai 上打开时有效（window.getClaude() 能拿到 claude：本页的 window.claude，
// 或外壳页面的 window.parent.claude，见 js/claude-bridge.js）；本地双击打开时完全不起作用。
// localStorage 仍然是主存储，所有读写都是同步的、马上生效；同步层在后台：
//   1) 页面加载后连接 claude.ai 的数据库（db）和用户（user），拿不到就安静放弃；
//   2) 连上后：读远端 → 和本地合并 → 写回本地；合并结果和远端不同才写远端；
//   3) 本地每次变化，约 2 秒后合并写一次远端（写之前先读远端再合并，不会盖掉另一台设备的新进度）；
//      页面隐藏 / 离开时立刻写一次；同一份文档一次只写一个（排队）；
//   4) 另一台设备写入时（onSnapshot）只合并进本地，然后派发 window 事件 "progress-synced"，页面据此刷新数字；
//   5) 状态变化时派发 "progress-sync-status"；Progress.sync.status() →
//      "local"（只存在本机）/ "connecting"（正在同步）/ "synced"（已同步）/ "failed"（同步出错，只存本机）。
// 合并规则：words 取 lastSeen 新的（相同取 box 大的）；grammar 和 dialogues 一样：best 取最大、done 任一为真、total 取新的；
//   lastQuiz 取 time 新的；alphabetSeen 任一为真；alphabetLetters 取并集；
//   games：best 按方向取更好的（lowerIsBetter 取最小，否则取最大）、plays 取最大、lastSeen 取最大；
//   days：取并集，只留最近 400 天；
//   resetAt 取较大的，早于 resetAt 的记录全部丢弃（这样“清除记录”能跨设备生效；days 丢掉 resetAt 那天之前的日期）。
//   xp（阶段 10）：{ "YYYY-MM-DD": 当天经验值 }，同一天取较大值（两台设备不会重复相加），日期取并集，只留最近 400 天；
//     resetAt 那天之前的丢掉；resetAt 当天只认“已经知道这次清除”的那一边（它的 resetAt 等于合并后的 resetAt），
//     免得清除前上午的经验值又从另一台设备合并回来。
//   settings（阶段 10）：{ dailyGoal: 10/20/50/100, sound: true/false, vibrate: true/false, updatedAt }，整组取 updatedAt 新的那边
//     （时间一样：目标大的；再一样：sound 开的；再一样：vibrate 开的，结果和合并顺序无关）；清除学习记录时保留设置。
//     sound / vibrate 是阶段 12 加的（音效、震动开关，默认都开，js/sfx.js 用）。
//
// ---------- 经验值（XP）和每日目标（阶段 10） ----------
//   Progress.XP                         每种学习行为加多少经验值（常量都在下面的 XP_RULES，改数值只改那里）
//   Progress.award(kind)                按 XP_RULES 加经验值；字母“每个字母每天只算一次”、AI 对话“每天最多 20 句”在这里判断
//                                       → { gained, today, goal, reachedGoal } 或 null（没加）
//   Progress.addXp(n)                   加 n 点到今天（也算“学过一天”），派发 window 事件 "progress-xp"（detail 同上）
//   Progress.xpToday() / xpTotal()      今天的 / 最近 400 天总共的经验值
//   Progress.xpWeek()                   最近 7 天 → [{ day, xp, weekday(0=周日), today }]（从早到晚）
//   Progress.xpByDay()                  { "YYYY-MM-DD": xp } 的副本
//   Progress.dailyGoal() / setDailyGoal(n)  每日目标（10 / 20 / 50 / 100，默认 20；存在 settings 里，跟着同步）
//   Progress.soundOn() / setSound(bool)      音效开关（阶段 12，默认开；存在 settings 里，跟着同步）
//   Progress.vibrateOn() / setVibrate(bool)  震动开关（阶段 12，默认开；同上）
//   Progress.speechRate() / setSpeechRate(v) 西语朗读语速（阶段 12）："slower" 很慢 / "slow" 慢（默认）/ "normal" 正常；js/speak.js 读它
//   Progress.studyDayKeys()             学过的日期列表（排好序）
//
// ---------- 冒险闯关（阶段 11；关卡数据和奖励清单在 js/world.js） ----------
// 新字段：
//   levels:  { 关卡id: { stars 0–3, best（最好正确率 0–100）, plays, lastSeen, since } }
//   chests:  { opened（已开宝箱数）, since }
//   owned:   { avatars: { 头像id: 时间 }, skins: { 主题id: 时间 } }（🧳 和默认主题不用存，总是拥有）
//   profile: { avatar, skin, updatedAt }
//   stamps:  { 区域id: 时间 }（护照邮票）
//   daily:   { "YYYY-MM-DD": { done, stars, at, since } }（每日挑战）
// 合并：levels 各项取较大；chests.opened 取较大；owned / stamps 并集（时间取较晚）；profile 取 updatedAt 新的
//   （一样新按“头像|主题”文字取大的）；daily 按日期并集、done 或运算、stars 取较大；
//   都按 resetAt 丢掉清除以前的记录：owned / stamps / profile 看时间；levels、chests、daily 的每条记录带 since
//   （写的时候那台设备知道的 resetAt），since < resetAt 的整条丢掉（这样几个字段“各取较大”也和合并顺序无关）。
// 清除记录：这些全部清空，头像回到 🧳、主题回到默认（profile.updatedAt = 清除时间）。
//   Progress.recordLevel(id, stars, best) / getLevel(id) / levelsAll()
//   Progress.awardLevel(id, stars)      过关经验值：同一关每天第一次 ⭐10 / ⭐⭐15 / ⭐⭐⭐20，再过 +5；失败不给
//   Progress.recordDaily(day) / getDaily(day)   每日挑战（一天只领一次 +30 XP、+3 ⭐）
//   Progress.dailyPick(day, items?)     今天每日挑战选中的内容（存在本机的 caps key：c.daily = { day, items }，当天不变）
//   Progress.starsTotal()               星星总数 = 关卡星星 + 每日挑战星星
//   Progress.chestsAvailable() / chestsOpened() / openChest(kind, id)   每 10 颗星一个宝箱
//   Progress.owned() / profile() / setProfile({ avatar?, skin? })      （换了会派发 "profile-changed"）
//   Progress.addStamp(regionId) / stamps()
// ============================================
(function () {
  var KEY = "es-study-progress-v1";
  var VERSION = 1;
  var MAX_BOX = 5;
  var MASTERED_BOX = 3;
  var DAY = 24 * 60 * 60 * 1000;
  // 已掌握的词隔多久要再复习一次（按 box）：box 3 → 3 天，box 4 → 7 天，box 5 → 14 天
  var REVIEW_AFTER = { 3: 3 * DAY, 4: 7 * DAY, 5: 14 * DAY };

  var storageOk = true;   // localStorage 能不能用
  var memory = null;      // 不能用时的内存备份（也作为最近一次读到的数据）

  // ---------- 经验值规则（想调整数值只改这里） ----------
  var XP_RULES = {
    wordGot: 5,        // 单词卡片 / 句子点“记住了”
    wordNotYet: 2,     // 单词卡片 / 句子点“还不熟”
    review: 3,         // 复习打分（认识 / 模糊 / 不认识都算）
    quizRight: 2,      // 小测验答对一题
    grammarRight: 2,   // 语法练习答对一题
    dialogueDone: 15,  // 完成一个情景对话（同一个情景每天第一次）
    dialogueRepeat: 5, // 同一个情景当天再练一次
    gameDone: 10,      // 小游戏完成一局
    letter: 1,         // 字母点一个（每个字母每天最多算一次）
    chatMsg: 2,        // AI 对话发一句（每天最多算 20 句）
    // ---- 阶段 11：冒险闯关 ----
    learnDone: 5,      // 阶段 12：背单词关学完（同一关每天第一次才给；不给星星）
    level1: 10,        // 过关 ⭐（同一关每天第一次过关）
    level2: 15,        // 过关 ⭐⭐（同一关每天第一次过关）
    level3: 20,        // 过关 ⭐⭐⭐（同一关每天第一次过关）
    levelRepeat: 5,    // 同一关当天再过一次（不管几颗星）；失败不给
    dailyDone: 30,     // 每日挑战通关（每天只领一次，另外 +3 ⭐，见 DAILY_STARS）
    chestXp: 20        // 宝箱里的头像和主题都拿完以后，开宝箱改给经验值
  };
  var DAILY_STARS = 3;          // 每日挑战通关额外给的星星
  var DEFAULT_AVATAR = "suitcase"; // 一开始就拥有的头像（🧳，头像清单在 js/world.js）
  var DEFAULT_SKIN = "default";    // 默认界面主题（绿色）
  var CHAT_XP_DAILY_MAX = 20;
  var GOALS = [10, 20, 50, 100];
  var DEFAULT_GOAL = 20;
  var RATES = ["slower", "slow", "normal"]; // 朗读语速三档（具体数值在 js/speak.js）
  var DEFAULT_RATE = "slow";

  function defaultSettings() {
    return { dailyGoal: DEFAULT_GOAL, sound: true, vibrate: true, speechRate: DEFAULT_RATE, updatedAt: 0 };
  }

  function emptyState() {
    return { version: VERSION, words: {}, grammar: {}, dialogues: {}, alphabetSeen: false, alphabetAt: 0, alphabetLetters: {}, games: {}, days: {}, xp: {}, badges: {}, settings: defaultSettings(),
      levels: {}, chests: { opened: 0, since: 0 }, owned: { avatars: {}, skins: {} }, profile: defaultProfile(), stamps: {}, daily: {}, resetAt: 0 };
  }
  function defaultProfile() {
    return { avatar: DEFAULT_AVATAR, skin: DEFAULT_SKIN, updatedAt: 0 };
  }
  var ID_RE = /^[A-Za-z0-9_\-:.]{1,80}$/;
  // { id: 时间 } 这种“拥有 / 获得”的记录：只留合法的 id 和正数时间
  function cleanTimes(src) {
    var out = {};
    var s = src && typeof src === "object" ? src : {};
    for (var k in s) {
      if (!has(s, k) || !ID_RE.test(k)) continue;
      var t = num(s[k], 0);
      if (t > 0) out[k] = t;
    }
    return out;
  }
  function cleanProfile(p) {
    var out = defaultProfile();
    if (!p || typeof p !== "object") return out;
    if (typeof p.avatar === "string" && ID_RE.test(p.avatar)) out.avatar = p.avatar;
    if (typeof p.skin === "string" && ID_RE.test(p.skin)) out.skin = p.skin;
    out.updatedAt = Math.max(0, num(p.updatedAt, 0));
    return out;
  }

  // ---------- 学习日（本地日期） ----------
  var MAX_DAYS = 400;
  var DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }
  // 本地日期 "YYYY-MM-DD"（不用 toISOString：那是 UTC，中国晚上 8 点前会算成前一天）
  function dayKey(t) {
    var d = new Date(t === undefined ? Date.now() : t);
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }
  // 只留最近的 MAX_DAYS 个日期（按日期排序取最新的，结果和合并顺序无关）
  function trimDays(days) {
    var keys = [];
    for (var k in days) if (has(days, k) && DAY_RE.test(k) && days[k]) keys.push(k);
    keys.sort();
    var out = {};
    for (var i = Math.max(0, keys.length - MAX_DAYS); i < keys.length; i++) out[keys[i]] = 1;
    return out;
  }
  function markDay(st) {
    st.days[dayKey()] = 1;
    st.days = trimDays(st.days);
  }
  // 经验值：{ "YYYY-MM-DD": 正整数 }，只留最近 MAX_DAYS 天
  function trimXp(xp) {
    var keys = [];
    var src = xp && typeof xp === "object" ? xp : {};
    for (var k in src) {
      if (!has(src, k) || !DAY_RE.test(k)) continue;
      var v = Math.floor(num(src[k], 0));
      if (v > 0) keys.push(k);
    }
    keys.sort();
    var out = {};
    for (var i = Math.max(0, keys.length - MAX_DAYS); i < keys.length; i++) out[keys[i]] = Math.floor(num(src[keys[i]], 0));
    return out;
  }
  function cleanSettings(s) {
    var out = defaultSettings();
    if (!s || typeof s !== "object") return out;
    var g = Math.floor(num(s.dailyGoal, DEFAULT_GOAL));
    out.dailyGoal = GOALS.indexOf(g) !== -1 ? g : DEFAULT_GOAL;
    out.sound = s.sound !== false;
    out.vibrate = s.vibrate !== false;
    out.speechRate = RATES.indexOf(s.speechRate) !== -1 ? s.speechRate : DEFAULT_RATE;
    out.updatedAt = Math.max(0, num(s.updatedAt, 0));
    return out;
  }

  function getStorage() {
    try {
      var s = window.localStorage;
      if (!s) return null;
      return s;
    } catch (e) {
      return null;
    }
  }

  // 先试一下能不能写
  (function testStorage() {
    try {
      var s = getStorage();
      if (!s) { storageOk = false; return; }
      var t = KEY + "-test";
      s.setItem(t, "1");
      s.removeItem(t);
    } catch (e) {
      storageOk = false;
    }
  })();

  function num(v, def) {
    v = Number(v);
    return isFinite(v) ? v : def;
  }
  function has(o, k) {
    return Object.prototype.hasOwnProperty.call(o, k);
  }

  // 整理一组“成绩”记录：{ id: { best, total, done, lastSeen } }，坏的条目丢掉
  function cleanScores(src, dest) {
    var g = src && typeof src === "object" ? src : {};
    for (var gid in g) {
      if (!has(g, gid) || !g[gid] || typeof g[gid] !== "object") continue;
      dest[gid] = {
        best: Math.max(0, num(g[gid].best, 0)),
        total: Math.max(0, num(g[gid].total, 0)),
        done: !!g[gid].done,
        lastSeen: num(g[gid].lastSeen, 0)
      };
    }
  }

  // 把读到的数据整理干净（防止被改坏的数据让页面出错）
  function clean(raw) {
    var st = emptyState();
    if (!raw || typeof raw !== "object" || raw.version !== VERSION) return st;
    var w = raw.words && typeof raw.words === "object" ? raw.words : {};
    for (var id in w) {
      if (!has(w, id) || !w[id] || typeof w[id] !== "object") continue;
      var r = w[id];
      st.words[id] = {
        box: Math.max(0, Math.min(MAX_BOX, Math.floor(num(r.box, 0)))),
        correct: Math.max(0, Math.floor(num(r.correct, 0))),
        wrong: Math.max(0, Math.floor(num(r.wrong, 0))),
        lastSeen: num(r.lastSeen, 0)
      };
    }
    // 语法课、情景对话：同样的 { best, total, done, lastSeen }
    cleanScores(raw.grammar, st.grammar);
    cleanScores(raw.dialogues, st.dialogues);
    if (raw.lastQuiz && typeof raw.lastQuiz === "object") {
      var lq = raw.lastQuiz;
      var lqTotal = Math.max(0, Math.floor(num(lq.total, 0)));
      if (lqTotal > 0) {
        st.lastQuiz = {
          score: Math.max(0, Math.min(lqTotal, Math.floor(num(lq.score, 0)))),
          total: lqTotal,
          time: num(lq.time, 0)
        };
      }
    }
    st.alphabetSeen = !!raw.alphabetSeen;
    st.alphabetAt = Math.max(0, num(raw.alphabetAt, 0));
    // 听过的字母：{ "A": 时间 }（旧数据是 { "A": true }，当作时间 1）
    var al = raw.alphabetLetters && typeof raw.alphabetLetters === "object" ? raw.alphabetLetters : {};
    for (var k in al) {
      if (has(al, k) && al[k]) st.alphabetLetters[k] = al[k] === true ? 1 : Math.max(1, num(al[k], 1));
    }
    // 小游戏：{ gameId: { best, plays, lastSeen, lowerIsBetter } }（旧数据没有 → 空）
    var gm = raw.games && typeof raw.games === "object" ? raw.games : {};
    for (var gid in gm) {
      if (!has(gm, gid) || !gm[gid] || typeof gm[gid] !== "object") continue;
      var gb = Number(gm[gid].best);
      if (gm[gid].best === null || gm[gid].best === undefined || !isFinite(gb)) continue;
      st.games[gid] = {
        best: Math.max(0, gb),
        plays: Math.max(1, Math.floor(num(gm[gid].plays, 1))),
        lastSeen: Math.max(0, num(gm[gid].lastSeen, 0)),
        lowerIsBetter: !!gm[gid].lowerIsBetter
      };
    }
    // 学习日：{ "YYYY-MM-DD": 1 }（旧数据没有 → 空）
    st.days = trimDays(raw.days && typeof raw.days === "object" ? raw.days : {});
    // 经验值、设置（阶段 10；旧数据没有 → 空 / 默认）
    st.xp = trimXp(raw.xp);
    var bd = raw.badges && typeof raw.badges === "object" ? raw.badges : {};
    for (var bk in bd) {
      if (has(bd, bk) && num(bd[bk], 0) > 0) st.badges[bk] = num(bd[bk], 0);
    }
    st.settings = cleanSettings(raw.settings);
    // 阶段 11：关卡、宝箱、拥有的头像 / 主题、个人形象、护照邮票、每日挑战（旧数据没有 → 空 / 默认）
    var lv = raw.levels && typeof raw.levels === "object" ? raw.levels : {};
    for (var lid in lv) {
      if (!has(lv, lid) || !ID_RE.test(lid) || !lv[lid] || typeof lv[lid] !== "object") continue;
      st.levels[lid] = {
        stars: Math.max(0, Math.min(3, Math.floor(num(lv[lid].stars, 0)))),
        best: Math.max(0, Math.min(100, Math.floor(num(lv[lid].best, 0)))),
        plays: Math.max(0, Math.floor(num(lv[lid].plays, 0))),
        lastSeen: Math.max(0, num(lv[lid].lastSeen, 0)),
        since: Math.max(0, num(lv[lid].since, 0))
      };
    }
    var ch = raw.chests && typeof raw.chests === "object" ? raw.chests : {};
    st.chests = { opened: Math.max(0, Math.floor(num(ch.opened, 0))), since: Math.max(0, num(ch.since, 0)) };
    var ow = raw.owned && typeof raw.owned === "object" ? raw.owned : {};
    st.owned = { avatars: cleanTimes(ow.avatars), skins: cleanTimes(ow.skins) };
    st.profile = cleanProfile(raw.profile);
    st.stamps = cleanTimes(raw.stamps);
    var dl = raw.daily && typeof raw.daily === "object" ? raw.daily : {};
    var dkeys = [];
    for (var dk in dl) {
      if (has(dl, dk) && DAY_RE.test(dk) && dl[dk] && typeof dl[dk] === "object") dkeys.push(dk);
    }
    dkeys.sort();
    for (var di = Math.max(0, dkeys.length - MAX_DAYS); di < dkeys.length; di++) {
      var dv = dl[dkeys[di]];
      st.daily[dkeys[di]] = {
        done: !!dv.done,
        stars: Math.max(0, Math.min(DAILY_STARS, Math.floor(num(dv.stars, 0)))),
        at: Math.max(0, num(dv.at, 0)),
        since: Math.max(0, num(dv.since, 0))
      };
    }
    st.resetAt = Math.max(0, num(raw.resetAt, 0));
    return st;
  }

  // 读取：每次都重新读，这样另一个页面刚存的进度也能看到
  function load() {
    if (storageOk) {
      try {
        var text = getStorage().getItem(KEY);
        memory = text ? clean(JSON.parse(text)) : emptyState();
        return memory;
      } catch (e) {
        // 读不了或数据坏了：读失败就改用内存；JSON 坏了就当作空记录
        if (e && e.name === "SyntaxError") {
          memory = emptyState();
          return memory;
        }
        storageOk = false;
        showWarning(); // 读不了：之后只存在内存里，提示一下
      }
    }
    if (!memory) memory = emptyState();
    return memory;
  }

  // 只写本地（同步层合并远端数据时用，不会再触发上传）
  function saveLocal(st) {
    memory = st;
    if (!storageOk) return false;
    try {
      getStorage().setItem(KEY, JSON.stringify(st));
      return true;
    } catch (e) {
      storageOk = false; // 写不进去（例如空间满了）：之后只存在内存里
      showWarning();
      return false;
    }
  }

  // 页面改了进度：写本地，并告诉同步层“有变化”
  function save(st) {
    var ok = saveLocal(st);
    sync.changed();
    return ok;
  }

  // ---------- 单词 ----------
  function getWord(id) {
    var r = load().words[id];
    return r ? { box: r.box, correct: r.correct, wrong: r.wrong, lastSeen: r.lastSeen } : null;
  }

  function markWord(id, correct) {
    if (!id) return null;
    var st = load();
    var r = st.words[id] || { box: 0, correct: 0, wrong: 0, lastSeen: 0 };
    if (correct) {
      r.box = Math.min(MAX_BOX, r.box + 1);
      r.correct++;
    } else {
      r.box = 0; // 答错：回到第一个盒子（不是降 1），保证不熟的词马上回到复习队列最前面
      r.wrong++;
    }
    r.lastSeen = Date.now();
    st.words[id] = r;
    markDay(st);
    save(st);
    return getWord(id);
  }

  // “模糊”：box 不变，只更新最近见过的时间（新词则建一条 box 0 的记录）
  function touchWord(id) {
    if (!id) return null;
    var st = load();
    var r = st.words[id] || { box: 0, correct: 0, wrong: 0, lastSeen: 0 };
    r.lastSeen = Date.now();
    st.words[id] = r;
    markDay(st);
    save(st);
    return getWord(id);
  }

  function wordStatus(id) {
    var r = load().words[id];
    if (!r) return "new";
    return r.box >= MASTERED_BOX ? "mastered" : "learning";
  }

  // 盒子号（新词 = 0）
  function getBox(id) {
    var r = load().words[id];
    return r ? r.box : 0;
  }

  // 学习中的个数：有记录、但 box 还不到“已掌握”
  function learningCount(ids) {
    var w = load().words;
    var n = 0;
    for (var i = 0; i < (ids || []).length; i++) {
      if (has(w, ids[i]) && w[ids[i]].box < MASTERED_BOX) n++;
    }
    return n;
  }

  // 已掌握的个数；传入 id 数组时只数这些词（例如一课的词、或数据里现有的词）
  function masteredCount(ids) {
    var w = load().words;
    var n = 0;
    if (ids && ids.length !== undefined) {
      for (var i = 0; i < ids.length; i++) {
        if (w[ids[i]] && w[ids[i]].box >= MASTERED_BOX) n++;
      }
      return n;
    }
    for (var id in w) {
      if (has(w, id) && w[id].box >= MASTERED_BOX) n++;
    }
    return n;
  }

  // 该不该复习：学过、而且（还没掌握，或者掌握了但很久没见）
  function isDue(id, now) {
    var r = load().words[id];
    if (!r) return false;
    if (r.box < MASTERED_BOX) return true;
    now = now || Date.now();
    return now - r.lastSeen >= (REVIEW_AFTER[r.box] || 14 * DAY);
  }

  // 复习顺序：把一组单词（每个要有 id）排好队，返回前 max 个
  //   1) 学过的词在前，没学过的新词放最后（按原来的顺序）；
  //   2) 学过的词里：该复习的（isDue）在前 → box 低的在前 → 错得多的在前 → 很久没见的在前。
  function reviewQueue(words, max) {
    var st = load();
    var now = Date.now();
    var seen = [], fresh = [];
    for (var i = 0; i < (words || []).length; i++) {
      var w = words[i];
      if (!w || !w.id) continue;
      var r = st.words[w.id];
      if (r) seen.push({ w: w, r: r, due: isDue(w.id, now), order: i });
      else fresh.push(w);
    }
    seen.sort(function (a, b) {
      if (a.due !== b.due) return a.due ? -1 : 1;
      if (a.r.box !== b.r.box) return a.r.box - b.r.box;
      if (a.r.wrong !== b.r.wrong) return b.r.wrong - a.r.wrong;
      if (a.r.lastSeen !== b.r.lastSeen) return a.r.lastSeen - b.r.lastSeen;
      return a.order - b.order;
    });
    var out = [];
    for (var j = 0; j < seen.length; j++) out.push(seen[j].w);
    out = out.concat(fresh);
    return typeof max === "number" ? out.slice(0, max) : out;
  }

  // 学过的词个数、该复习的词个数（只数传入的 id）
  function wordCounts(ids) {
    var w = load().words;
    var now = Date.now();
    var res = { seen: 0, due: 0, mastered: 0 };
    for (var i = 0; i < (ids || []).length; i++) {
      var r = w[ids[i]];
      if (!r) continue;
      res.seen++;
      if (r.box >= MASTERED_BOX) res.mastered++;
      if (isDue(ids[i], now)) res.due++;
    }
    return res;
  }

  // ---------- 语法 ----------
  // 记一次“完成”的成绩（语法课和情景对话共用）；field = "grammar" / "dialogues"
  function recordScore(field, id, score, total) {
    var st = load();
    var g = st[field][id] || { best: 0, total: 0, done: false, lastSeen: 0 };
    score = Math.max(0, num(score, 0));
    total = Math.max(0, num(total, 0));
    // 题目数量变了（内容编写员加减了题）就以新的总数为准
    if (total !== g.total) {
      g.best = score;
    } else {
      g.best = Math.max(g.best, score);
    }
    g.total = total;
    g.done = true;
    g.lastSeen = Date.now();
    st[field][id] = g;
    markDay(st);
    save(st);
  }

  function recordGrammar(lessonId, score, total) {
    if (!lessonId) return null;
    recordScore("grammar", lessonId, score, total);
    return getGrammar(lessonId);
  }

  // 答了一道题（只更新时间，不算完成）
  function touchGrammar(lessonId) {
    if (!lessonId) return;
    var st = load();
    var g = st.grammar[lessonId] || { best: 0, total: 0, done: false, lastSeen: 0 };
    g.lastSeen = Date.now();
    st.grammar[lessonId] = g;
    markDay(st);
    save(st);
  }

  function getGrammar(lessonId) {
    var g = load().grammar[lessonId];
    return g ? { best: g.best, total: g.total, done: g.done } : null;
  }

  // ---------- 情景对话 ----------
  // 练完一个情景时调用：score = 第一次就答对的轮数，total = 一共要“我”说几轮
  function recordDialogue(id, score, total) {
    if (!id) return null;
    recordScore("dialogues", id, score, total);
    return getDialogue(id);
  }

  function getDialogue(id) {
    var d = load().dialogues[id];
    return d ? { best: d.best, total: d.total, done: d.done } : null;
  }

  // ---------- 小测验：最近一次成绩 ----------
  function recordQuiz(score, total) {
    total = Math.max(0, Math.floor(num(total, 0)));
    if (!total) return null;
    score = Math.max(0, Math.min(total, Math.floor(num(score, 0))));
    var st = load();
    st.lastQuiz = { score: score, total: total, time: Date.now() };
    markDay(st);
    save(st);
    return lastQuiz();
  }

  function lastQuiz() {
    var q = load().lastQuiz;
    return q ? { score: q.score, total: q.total, time: q.time } : null;
  }

  // ---------- 字母 ----------
  function markAlphabetSeen(letter) {
    var st = load();
    var now = Date.now();
    st.alphabetSeen = true;
    st.alphabetAt = now;
    if (letter) {
      st.alphabetLetters[String(letter)] = now;
      markDay(st); // 听了字母才算“学了”；只是打开字母页不算
    }
    save(st);
  }

  // ---------- 小游戏 ----------
  // 记一局的成绩。lowerIsBetter：这个游戏是不是“分数越小越好”（同一个游戏方向固定，由页面定义）
  function recordGame(gameId, score, lowerIsBetter) {
    if (!gameId) return null;
    score = Number(score);
    if (!isFinite(score)) return null;
    score = Math.max(0, score);
    var lib = !!lowerIsBetter;
    var st = load();
    var g = st.games[gameId];
    var prev = null;
    if (!g || g.lowerIsBetter !== lib) {
      // 第一次玩（或者页面改了计分方向）：这一局就是纪录
      g = { best: score, plays: g ? g.plays : 0, lastSeen: 0, lowerIsBetter: lib };
    } else {
      prev = g.best;
      g.best = lib ? Math.min(g.best, score) : Math.max(g.best, score);
    }
    g.plays++;
    g.lastSeen = Date.now();
    st.games[gameId] = g;
    markDay(st);
    save(st);
    var out = getGame(gameId);
    out.first = prev === null;
    out.previous = prev;
    out.isRecord = prev === null || (lib ? score < prev : score > prev);
    return out;
  }

  function getGame(gameId) {
    var g = load().games[gameId];
    return g ? { best: g.best, plays: g.plays, lastSeen: g.lastSeen, lowerIsBetter: g.lowerIsBetter } : null;
  }

  // ---------- 连续学习天数 ----------
  function studiedToday() {
    return !!load().days[dayKey()];
  }
  function streak() {
    var days = load().days;
    var d = new Date();
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (!days[dayKey(d.getTime())]) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1); // 今天还没学：从昨天数
    var n = 0;
    while (days[dayKey(d.getTime())] && n <= MAX_DAYS) {
      n++;
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1); // 用“日期减一”，夏令时也不会出错
    }
    return n;
  }
  function studyDays() {
    var days = load().days, n = 0;
    for (var k in days) if (has(days, k)) n++;
    return n;
  }
  function studyDayKeys() {
    var days = load().days, out = [];
    for (var k in days) if (has(days, k)) out.push(k);
    out.sort();
    return out;
  }

  // ---------- 经验值（XP）和每日目标 ----------
  function fireEvent(name, detail) {
    try {
      var ev;
      if (typeof CustomEvent === "function") {
        ev = new CustomEvent(name, { detail: detail });
      } else {
        ev = document.createEvent("CustomEvent");
        ev.initCustomEvent(name, false, false, detail);
      }
      window.dispatchEvent(ev);
    } catch (e) {}
  }

  function addXp(n) {
    n = Math.floor(num(n, 0));
    if (n <= 0) return null;
    var st = load();
    var k = dayKey();
    var before = st.xp[k] || 0;
    var after = before + n;
    st.xp[k] = after;
    st.xp = trimXp(st.xp);
    markDay(st); // 得到经验值也算“学过一天”
    var goal = st.settings.dailyGoal;
    // “完成目标”徽章：按当时的目标判断，解锁后永久记住（以后改目标也不会变回锁着）
    if (after >= goal && !st.badges.goalDay) st.badges.goalDay = Date.now();
    save(st);
    var info = { gained: n, today: after, goal: goal, reachedGoal: before < goal && after >= goal };
    fireEvent("progress-xp", info);
    return info;
  }

  // 每天的上限（字母每个只算一次、AI 对话最多 20 句）：单独存一个小 key，只在本机，第二天自动重新开始
  var CAPS_KEY = "es-study-xp-caps-v1";
  var capsMemory = null;
  function loadCaps() {
    var today = dayKey();
    var c = null;
    try {
      var s = getStorage();
      var t = s && storageOk ? s.getItem(CAPS_KEY) : null;
      c = t ? JSON.parse(t) : capsMemory;
    } catch (e) {
      c = capsMemory;
    }
    if (!c || typeof c !== "object" || c.day !== today) c = { day: today, chat: 0, letters: {}, items: {}, dialogues: {}, levels: {} };
    if (!c.levels || typeof c.levels !== "object") c.levels = {};
    if (!c.letters || typeof c.letters !== "object") c.letters = {};
    if (!c.items || typeof c.items !== "object") c.items = {};
    if (!c.dialogues || typeof c.dialogues !== "object") c.dialogues = {};
    c.chat = Math.max(0, Math.floor(num(c.chat, 0)));
    return c;
  }
  function saveCaps(c) {
    capsMemory = c;
    try {
      var s = getStorage();
      if (s) s.setItem(CAPS_KEY, JSON.stringify(c));
    } catch (e) {}
  }

  // 按规则加经验值（防刷分的每日规则都在这里）：
  //   letter：key = 字母，同一个字母一天只算一次
  //   chatMsg：一天最多算 CHAT_XP_DAILY_MAX 句
  //   wordGot / wordNotYet：key = 单词或句子的 id，同一个词（句）一天只有第一次给经验值（熟练度照常记录）
  //   dialogueDone：key = 情景 id，同一个情景一天第一次完成给 dialogueDone，之后再练给 dialogueRepeat
  function award(kind, key) {
    var n = XP_RULES[kind];
    if (!n) return null;
    var k = key === undefined || key === null ? "" : String(key);
    if (kind === "letter" || kind === "chatMsg" || ((kind === "wordGot" || kind === "wordNotYet" || kind === "dialogueDone") && k)) {
      var c = loadCaps();
      if (kind === "letter") {
        if (!k || c.letters[k]) return null;
        c.letters[k] = 1;
      } else if (kind === "chatMsg") {
        if (c.chat >= CHAT_XP_DAILY_MAX) return null;
        c.chat++;
      } else if (kind === "dialogueDone") {
        if (c.dialogues[k]) n = XP_RULES.dialogueRepeat;
        c.dialogues[k] = 1;
      } else {
        if (c.items[k]) return null;
        c.items[k] = 1;
      }
      saveCaps(c);
    }
    return addXp(n);
  }

  // ---------- 成就徽章：解锁后永久记住 { 徽章id: 解锁时间 } ----------
  function unlockBadge(id) {
    if (!id) return false;
    var st = load();
    if (st.badges[id]) return false;
    st.badges[id] = Date.now();
    save(st);
    return true;
  }
  function badges() {
    var b = load().badges, out = {};
    for (var k in b) if (has(b, k)) out[k] = b[k];
    return out;
  }

  function xpToday() {
    return load().xp[dayKey()] || 0;
  }
  function xpTotal() {
    var xp = load().xp, n = 0;
    for (var k in xp) if (has(xp, k)) n += xp[k];
    return n;
  }
  function xpByDay() {
    var xp = load().xp, out = {};
    for (var k in xp) if (has(xp, k)) out[k] = xp[k];
    return out;
  }
  // 最近 7 天（从 6 天前到今天）
  function xpWeek() {
    var xp = load().xp;
    var now = new Date();
    var out = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      var k = dayKey(d.getTime());
      out.push({ day: k, xp: xp[k] || 0, weekday: d.getDay(), today: i === 0 });
    }
    return out;
  }
  function dailyGoal() {
    return load().settings.dailyGoal;
  }
  function setDailyGoal(g) {
    g = Math.floor(num(g, DEFAULT_GOAL));
    if (GOALS.indexOf(g) === -1) return dailyGoal();
    var st = load();
    st.settings = { dailyGoal: g, sound: st.settings.sound, vibrate: st.settings.vibrate, speechRate: st.settings.speechRate, updatedAt: Math.max(Date.now(), st.settings.updatedAt + 1) };
    save(st);
    return g;
  }
  // 音效 / 震动开关（阶段 12）：和每日目标一样存在 settings 里（整组取较新的那边）
  function soundOn() {
    return load().settings.sound !== false;
  }
  function vibrateOn() {
    return load().settings.vibrate !== false;
  }
  function setSwitch(name, on) {
    var st = load();
    var s = st.settings;
    var next = { dailyGoal: s.dailyGoal, sound: s.sound !== false, vibrate: s.vibrate !== false, speechRate: s.speechRate, updatedAt: Math.max(Date.now(), s.updatedAt + 1) };
    next[name] = name === "speechRate" ? on : !!on;
    st.settings = next;
    save(st);
    try { window.dispatchEvent(new Event("settings-changed")); } catch (e) {}
    return next[name];
  }
  function setSound(on) { return setSwitch("sound", on); }
  function speechRate() {
    return load().settings.speechRate || DEFAULT_RATE;
  }
  function setSpeechRate(v) {
    if (RATES.indexOf(v) === -1) return speechRate();
    return setSwitch("speechRate", v);
  }
  function setVibrate(on) { return setSwitch("vibrate", on); }

  function alphabetInfo() {
    var st = load();
    var n = 0;
    for (var k in st.alphabetLetters) {
      if (has(st.alphabetLetters, k)) n++;
    }
    return { seen: st.alphabetSeen, letters: n };
  }

  // ---------- 阶段 11：冒险闯关（关卡、宝箱、头像 / 主题、护照邮票、每日挑战） ----------
  function getLevel(id) {
    var r = load().levels[id];
    return r ? { stars: r.stars, best: r.best, plays: r.plays, lastSeen: r.lastSeen } : null;
  }
  function levelsAll() {
    var lv = load().levels, out = {};
    for (var k in lv) if (has(lv, k)) out[k] = { stars: lv[k].stars, best: lv[k].best, plays: lv[k].plays, lastSeen: lv[k].lastSeen };
    return out;
  }
  // 玩完一关（过关或失败都调用）：stars 0–3（0 = 失败），best = 这次的正确率 0–100
  // → { stars, best, plays, previous（之前的星星）, improved（星星变多了）, first（第一次过关） }
  function recordLevel(id, stars, best) {
    if (!id || !ID_RE.test(String(id))) return null;
    stars = Math.max(0, Math.min(3, Math.floor(num(stars, 0))));
    best = Math.max(0, Math.min(100, Math.floor(num(best, 0))));
    var st = load();
    var r = st.levels[id];
    if (!r || r.since < st.resetAt) r = { stars: 0, best: 0, plays: 0, lastSeen: 0, since: st.resetAt };
    r.since = st.resetAt;
    var prev = r.stars;
    r.stars = Math.max(r.stars, stars);
    if (stars > 0) r.best = Math.max(r.best, best); // 失败的那次不算“最好成绩”
    r.plays++;
    r.lastSeen = Date.now();
    st.levels[id] = r;
    markDay(st);
    save(st);
    var out = getLevel(id);
    out.previous = prev;
    out.improved = stars > prev;
    out.first = prev === 0 && stars > 0;
    return out;
  }
  // 过关给经验值：同一关每天第一次按星星给（level1/2/3），之后再过给 levelRepeat；stars = 0（失败）不给
  // 背单词关（阶段 12）：同一关每天第一次学完 +learnDone，之后不再给（用和关卡一样的每日 caps 防刷分）
  function awardLearn(id) {
    if (!id) return null;
    var c = loadCaps();
    var k = "learn:" + String(id);
    if (c.levels[k]) return null;
    c.levels[k] = 1;
    saveCaps(c);
    return addXp(XP_RULES.learnDone);
  }
  function awardLevel(id, stars) {
    stars = Math.floor(num(stars, 0));
    if (!id || stars < 1) return null;
    var c = loadCaps();
    var k = String(id);
    var n = c.levels[k] ? XP_RULES.levelRepeat : XP_RULES["level" + Math.min(3, stars)];
    c.levels[k] = 1;
    saveCaps(c);
    return addXp(n);
  }

  // 每日挑战：{ "YYYY-MM-DD": { done, stars, at } }。一天只领一次奖励（+dailyDone XP、+DAILY_STARS ⭐）
  // → { first: 这次是不是今天第一次通关（第一次才给奖励）, xp: addXp 的结果或 null }
  function recordDaily(day) {
    day = DAY_RE.test(String(day || "")) ? String(day) : dayKey();
    var st = load();
    var d = st.daily[day];
    if (d && d.done && d.since >= st.resetAt) return { first: false, xp: null };
    st.daily[day] = { done: true, stars: DAILY_STARS, at: Date.now(), since: st.resetAt };
    markDay(st);
    save(st);
    return { first: true, xp: addXp(XP_RULES.dailyDone) };
  }
  // 今天每日挑战选中的内容（只存在本机的小 key 里，第二天自动作废）：
  //   dailyPick(day) → 存过的 items 或 null；dailyPick(day, items) → 今天还没存就存下 items，返回今天的那一份
  //   （当天第一次打开时定下来，之后学了新词、状态变了，题目也不会变）
  function dailyPick(day, items) {
    var c = loadCaps();
    day = String(day || dayKey());
    if (c.daily && c.daily.day === day && c.daily.items && typeof c.daily.items === "object") return c.daily.items;
    if (!items || day !== c.day) return items || null;
    c.daily = { day: day, items: items };
    saveCaps(c);
    return items;
  }
  function getDaily(day) {
    var d = load().daily[day || dayKey()];
    return d ? { done: d.done, stars: d.stars, at: d.at } : null;
  }
  // 星星总数 = 所有关卡的星星 + 每日挑战的额外星星
  function starsTotal() {
    var st = load(), n = 0, k;
    for (k in st.levels) if (has(st.levels, k)) n += st.levels[k].stars;
    for (k in st.daily) if (has(st.daily, k)) n += st.daily[k].stars;
    return n;
  }
  // 宝箱：每 10 颗星一个；能开的个数 = floor(星星 / 10) − 已开的（不会是负数）
  var STARS_PER_CHEST = 10;
  function chestsOpened() {
    var st = load();
    return st.chests.since >= st.resetAt ? st.chests.opened : 0;
  }
  function chestsAvailable() {
    return Math.max(0, Math.floor(starsTotal() / STARS_PER_CHEST) - chestsOpened());
  }
  // 开一个宝箱。kind = "avatar" / "skin"（id = 头像或主题的 id）/ "xp"（全部拿完以后改给经验值）
  // 没有能开的宝箱 → null；→ { kind, id, xp }
  function openChest(kind, id) {
    if (chestsAvailable() < 1) return null;
    var st = load();
    var now = Date.now();
    st.chests = { opened: (st.chests.since >= st.resetAt ? st.chests.opened : 0) + 1, since: st.resetAt };
    if ((kind === "avatar" || kind === "skin") && id && ID_RE.test(String(id))) {
      var field = kind === "avatar" ? "avatars" : "skins";
      if (!st.owned[field][id]) st.owned[field][id] = now;
    }
    save(st);
    var xp = null;
    if (kind === "xp") xp = addXp(XP_RULES.chestXp);
    return { kind: kind, id: id || null, xp: xp };
  }
  // 拥有的头像 / 主题（一开始的 🧳 和默认绿色主题总是拥有）
  function owned() {
    var o = load().owned, out = { avatars: {}, skins: {} }, k;
    out.avatars[DEFAULT_AVATAR] = 1;
    out.skins[DEFAULT_SKIN] = 1;
    for (k in o.avatars) if (has(o.avatars, k)) out.avatars[k] = o.avatars[k];
    for (k in o.skins) if (has(o.skins, k)) out.skins[k] = o.skins[k];
    return out;
  }
  function profile() {
    var p = load().profile;
    var o = owned();
    // 万一选中的东西不再拥有（例如清除记录后另一台设备合并过来）：退回默认
    return {
      avatar: o.avatars[p.avatar] ? p.avatar : DEFAULT_AVATAR,
      skin: o.skins[p.skin] ? p.skin : DEFAULT_SKIN,
      updatedAt: p.updatedAt
    };
  }
  // 换头像 / 主题：只能选已经拥有的。changes = { avatar?, skin? }
  function setProfile(changes) {
    changes = changes || {};
    var o = owned();
    var st = load();
    var cur = profile();
    var p = { avatar: cur.avatar, skin: cur.skin, updatedAt: Math.max(Date.now(), st.profile.updatedAt + 1) };
    if (changes.avatar && o.avatars[changes.avatar]) p.avatar = changes.avatar;
    if (changes.skin && o.skins[changes.skin]) p.skin = changes.skin;
    st.profile = p;
    save(st);
    fireEvent("profile-changed", { avatar: p.avatar, skin: p.skin });
    return profile();
  }
  // 护照邮票：区域 boss 过关得一枚 → true = 这次是新得到的
  function addStamp(regionId) {
    if (!regionId || !ID_RE.test(String(regionId))) return false;
    var st = load();
    if (st.stamps[regionId]) return false;
    st.stamps[regionId] = Date.now();
    save(st);
    return true;
  }
  function stamps() {
    var s = load().stamps, out = {};
    for (var k in s) if (has(s, k)) out[k] = s[k];
    return out;
  }

  // ---------- 清除 ----------
  // 不直接删掉 key，而是存一份空记录 + resetAt（清除的时间）：
  // 同步时其他设备上早于这个时间的记录也会被丢弃。
  function reset() {
    var old = load();
    var st = emptyState();
    st.resetAt = Math.max(Date.now(), old.resetAt + 1);
    st.settings = cleanSettings(old.settings); // 设置（每日目标）不是学习记录：保留
    // 关卡、宝箱、拥有的东西（只留初始头像）、邮票、每日挑战都清空；头像改回 🧳、主题改回默认（时间 = 清除时间，跨设备生效）
    st.profile = { avatar: DEFAULT_AVATAR, skin: DEFAULT_SKIN, updatedAt: st.resetAt };
    saveCaps({ day: dayKey(), chat: 0, letters: {}, items: {}, dialogues: {}, levels: {} });
    saveLocal(st);
    sync.changed(true); // 马上写到远端
    fireEvent("profile-changed", { avatar: DEFAULT_AVATAR, skin: DEFAULT_SKIN });
  }

  // ---------- 合并两份进度（同步用） ----------
  function merge(a, b) {
    a = clean(a);
    b = clean(b);
    var out = emptyState();
    var R = Math.max(a.resetAt, b.resetAt);
    out.resetAt = R;
    var id, x, y;

    // 单词：取 lastSeen 新的；一样新取 box 大的；早于 resetAt 的丢掉
    var ids = {};
    for (id in a.words) if (has(a.words, id)) ids[id] = true;
    for (id in b.words) if (has(b.words, id)) ids[id] = true;
    for (id in ids) {
      if (!has(ids, id)) continue;
      x = has(a.words, id) && a.words[id].lastSeen >= R ? a.words[id] : null;
      y = has(b.words, id) && b.words[id].lastSeen >= R ? b.words[id] : null;
      var pick = !x ? y : !y ? x :
        (x.lastSeen !== y.lastSeen ? (x.lastSeen > y.lastSeen ? x : y) : (x.box >= y.box ? x : y));
      if (pick) out.words[id] = { box: pick.box, correct: pick.correct, wrong: pick.wrong, lastSeen: pick.lastSeen };
    }

    // 语法、情景对话：best 取最大（总题数不同时以新的为准）、done 任一为真、total 取新的
    mergeScores(a.grammar, b.grammar, out.grammar, R);
    mergeScores(a.dialogues, b.dialogues, out.dialogues, R);

    // 小测验：取 time 新的
    var qa = a.lastQuiz && a.lastQuiz.time >= R ? a.lastQuiz : null;
    var qb = b.lastQuiz && b.lastQuiz.time >= R ? b.lastQuiz : null;
    var q = !qa ? qb : !qb ? qa : (qa.time >= qb.time ? qa : qb);
    if (q) out.lastQuiz = { score: q.score, total: q.total, time: q.time };

    // 字母：任一为真；听过的字母取并集
    var aOk = a.alphabetSeen && a.alphabetAt >= R;
    var bOk = b.alphabetSeen && b.alphabetAt >= R;
    out.alphabetSeen = aOk || bOk;
    out.alphabetAt = Math.max(aOk ? a.alphabetAt : 0, bOk ? b.alphabetAt : 0);
    var sides = [a.alphabetLetters, b.alphabetLetters];
    for (var s = 0; s < 2; s++) {
      for (var k in sides[s]) {
        if (!has(sides[s], k) || sides[s][k] < R) continue;
        out.alphabetLetters[k] = Math.max(out.alphabetLetters[k] || 0, sides[s][k]);
      }
    }
    if (!out.alphabetSeen && hasKeys(out.alphabetLetters)) {
      out.alphabetSeen = true;
    }

    // 小游戏：best 按方向取更好的、plays 取最大、lastSeen 取最大
    var gids = {};
    for (id in a.games) if (has(a.games, id)) gids[id] = true;
    for (id in b.games) if (has(b.games, id)) gids[id] = true;
    for (id in gids) {
      if (!has(gids, id)) continue;
      x = has(a.games, id) && a.games[id].lastSeen >= R ? a.games[id] : null;
      y = has(b.games, id) && b.games[id].lastSeen >= R ? b.games[id] : null;
      if (!x && !y) continue;
      if (!x || !y) {
        var one = x || y;
        out.games[id] = { best: one.best, plays: one.plays, lastSeen: one.lastSeen, lowerIsBetter: one.lowerIsBetter };
        continue;
      }
      var lib, best;
      if (x.lowerIsBetter === y.lowerIsBetter) {
        lib = x.lowerIsBetter;
        best = lib ? Math.min(x.best, y.best) : Math.max(x.best, y.best);
      } else {
        // 方向不一样（页面改过计分方式）：以新的那边为准；时间一样时取“越小越好”那边，保证结果和顺序无关
        var nw = x.lastSeen !== y.lastSeen ? (x.lastSeen > y.lastSeen ? x : y) : (x.lowerIsBetter ? x : y);
        lib = nw.lowerIsBetter;
        best = nw.best;
      }
      out.games[id] = { best: best, plays: Math.max(x.plays, y.plays), lastSeen: Math.max(x.lastSeen, y.lastSeen), lowerIsBetter: lib };
    }

    // 学习日：并集；清除记录那天之前的日期丢掉；只留最近 400 天
    var minDay = R > 0 ? dayKey(R) : "";
    var dsides = [a.days, b.days];
    var days = {};
    for (var ds = 0; ds < 2; ds++) {
      for (var dk in dsides[ds]) {
        if (has(dsides[ds], dk) && dk >= minDay) days[dk] = 1;
      }
    }
    out.days = trimDays(days);

    // 经验值：同一天取较大值；清除那天之前的丢掉；清除当天只认 resetAt 等于 R 的那边
    var resetDay = R > 0 ? dayKey(R) : "";
    var xsides = [a, b];
    var xp = {};
    for (var xs = 0; xs < 2; xs++) {
      var sx = xsides[xs].xp;
      for (var xk in sx) {
        if (!has(sx, xk) || xk < minDay) continue;
        if (xk === resetDay && xsides[xs].resetAt !== R) continue;
        xp[xk] = Math.max(xp[xk] || 0, sx[xk]);
      }
    }
    out.xp = trimXp(xp);

    // 徽章：并集，同一个取较晚的解锁时间；清除记录之前解锁的丢掉
    // （取较晚的：先过滤再取最大和先取最大再过滤结果一样，所以和合并顺序无关；取较早的会让清除后解锁的徽章在某些顺序下被丢掉）
    var bsides = [a.badges, b.badges];
    for (var bs = 0; bs < 2; bs++) {
      for (var bkey in bsides[bs]) {
        if (!has(bsides[bs], bkey) || bsides[bs][bkey] < R) continue;
        out.badges[bkey] = out.badges[bkey] ? Math.max(out.badges[bkey], bsides[bs][bkey]) : bsides[bs][bkey];
      }
    }

    // ---- 阶段 11 ----
    // 关卡：stars / best / plays / lastSeen 都取较大。
    // 清除记录：关卡、宝箱、每日挑战的记录带 since（写的时候那台设备知道的 resetAt），since 早于合并后的 resetAt 的整条丢掉。
    // （不用 lastSeen 过滤：几个字段各取较大以后再按时间过滤，结果会和合并顺序有关；用 since 和顺序无关）
    var lids = {};
    for (id in a.levels) if (has(a.levels, id)) lids[id] = true;
    for (id in b.levels) if (has(b.levels, id)) lids[id] = true;
    for (id in lids) {
      if (!has(lids, id)) continue;
      x = has(a.levels, id) && a.levels[id].since >= R ? a.levels[id] : null;
      y = has(b.levels, id) && b.levels[id].since >= R ? b.levels[id] : null;
      if (!x && !y) continue;
      if (!x || !y) {
        var lo = x || y;
        out.levels[id] = { stars: lo.stars, best: lo.best, plays: lo.plays, lastSeen: lo.lastSeen, since: R };
        continue;
      }
      out.levels[id] = { stars: Math.max(x.stars, y.stars), best: Math.max(x.best, y.best), plays: Math.max(x.plays, y.plays), lastSeen: Math.max(x.lastSeen, y.lastSeen), since: R };
    }
    // 宝箱：已开的个数取较大（since 早于 resetAt = 清除记录之前开的，不算）
    out.chests = { opened: Math.max(a.chests.since >= R ? a.chests.opened : 0, b.chests.since >= R ? b.chests.opened : 0), since: R };
    // 拥有的头像 / 主题、护照邮票：并集，时间取较晚；早于 resetAt 的丢掉
    out.owned = { avatars: unionTimes(a.owned.avatars, b.owned.avatars, R), skins: unionTimes(a.owned.skins, b.owned.skins, R) };
    out.stamps = unionTimes(a.stamps, b.stamps, R);
    // 个人形象：取 updatedAt 较新的；时间一样按“头像|主题”的文字取较大的（和顺序无关）；早于 resetAt 的当作默认
    var pa = a.profile.updatedAt >= R ? a.profile : null;
    var pb = b.profile.updatedAt >= R ? b.profile : null;
    var pp = !pa ? pb : !pb ? pa :
      (pa.updatedAt !== pb.updatedAt ? (pa.updatedAt > pb.updatedAt ? pa : pb) : ((pa.avatar + "|" + pa.skin) >= (pb.avatar + "|" + pb.skin) ? pa : pb));
    out.profile = pp ? { avatar: pp.avatar, skin: pp.skin, updatedAt: pp.updatedAt } : defaultProfile();
    // 每日挑战：按日期并集，done 取“或”，stars 取较大，at 取较晚；since 早于 resetAt 的丢掉
    var dsd = [a.daily, b.daily];
    for (var dd = 0; dd < 2; dd++) {
      for (var dkey in dsd[dd]) {
        if (!has(dsd[dd], dkey)) continue;
        var e = dsd[dd][dkey];
        if (e.since < R) continue;
        var o = out.daily[dkey];
        out.daily[dkey] = o ? { done: o.done || e.done, stars: Math.max(o.stars, e.stars), at: Math.max(o.at, e.at), since: R } : { done: e.done, stars: e.stars, at: e.at, since: R };
      }
    }

    // 设置：取较新的；时间一样取目标大的（结果和合并顺序无关）
    var sa = a.settings, sb = b.settings;
    var rankS = function (x) { return x.dailyGoal * 16 + RATES.indexOf(x.speechRate) * 4 + (x.sound ? 2 : 0) + (x.vibrate ? 1 : 0); };
    var sp = sa.updatedAt !== sb.updatedAt ? (sa.updatedAt > sb.updatedAt ? sa : sb) : (rankS(sa) >= rankS(sb) ? sa : sb);
    out.settings = { dailyGoal: sp.dailyGoal, sound: sp.sound, vibrate: sp.vibrate, speechRate: sp.speechRate, updatedAt: sp.updatedAt };
    return out;
  }
  // 合并两组“成绩”记录（语法课 / 情景对话），结果写进 out；早于 R（resetAt）的丢掉
  function mergeScores(am, bm, out, R) {
    var id, x, y;
    var gids = {};
    for (id in am) if (has(am, id)) gids[id] = true;
    for (id in bm) if (has(bm, id)) gids[id] = true;
    for (id in gids) {
      if (!has(gids, id)) continue;
      x = has(am, id) && am[id].lastSeen >= R ? am[id] : null;
      y = has(bm, id) && bm[id].lastSeen >= R ? bm[id] : null;
      if (!x && !y) continue;
      if (!x || !y) {
        var one = x || y;
        out[id] = { best: one.best, total: one.total, done: one.done, lastSeen: one.lastSeen };
        continue;
      }
      // 时间一样时取总题数多的那边，保证合并顺序不影响结果
      var newer = x.lastSeen !== y.lastSeen ? (x.lastSeen > y.lastSeen ? x : y) : (x.total >= y.total ? x : y);
      // 只有一边真正做完过：用做完那边的 total / best（另一边只是“答过几题”）
      var best, total;
      if (x.done && y.done && x.total !== y.total) {
        best = newer.best;
        total = newer.total;
      } else if (x.done !== y.done) {
        var d = x.done ? x : y;
        best = d.best;
        total = d.total;
      } else {
        best = Math.max(x.best, y.best);
        total = newer.total;
      }
      out[id] = { best: best, total: total, done: x.done || y.done, lastSeen: Math.max(x.lastSeen, y.lastSeen) };
    }
  }

  function unionTimes(x, y, R) {
    var out = {}, sides = [x, y];
    for (var s = 0; s < 2; s++) {
      for (var k in sides[s]) {
        if (!has(sides[s], k) || sides[s][k] < R) continue;
        out[k] = Math.max(out[k] || 0, sides[s][k]);
      }
    }
    return out;
  }

  function hasKeys(o) {
    for (var k in o) if (has(o, k)) return true;
    return false;
  }

  // 固定顺序的 JSON（用来比较两份数据是不是一样）
  function stable(v) {
    if (v === null || typeof v !== "object") return JSON.stringify(v);
    if (v instanceof Array) {
      var arr = [];
      for (var i = 0; i < v.length; i++) arr.push(stable(v[i]));
      return "[" + arr.join(",") + "]";
    }
    var keys = [];
    for (var k in v) if (has(v, k) && v[k] !== undefined) keys.push(k);
    keys.sort();
    var parts = [];
    for (var j = 0; j < keys.length; j++) parts.push(JSON.stringify(keys[j]) + ":" + stable(v[keys[j]]));
    return "{" + parts.join(",") + "}";
  }
  function same(a, b) {
    return stable(clean(a)) === stable(clean(b));
  }

  // ---------- 同步层 ----------
  var sync = (function () {
    var status = "local";   // local / connecting / synced / failed
    var ref = null;         // 远端文档
    var started = false;
    var dirty = false;      // 本地有还没上传的变化
    var timer = null;       // 防抖计时器
    var writing = null;     // 正在进行的上传（Promise），同一时间只有一个
    var again = false;      // 上传期间又有变化：上传完再来一次
    var unsub = null;
    var DEBOUNCE = 2000;

    function fire(name) {
      try {
        var ev;
        if (typeof Event === "function") {
          ev = new Event(name);
        } else {
          ev = document.createEvent("Event");
          ev.initEvent(name, false, false);
        }
        window.dispatchEvent(ev);
      } catch (e) {}
    }
    function setStatus(s) {
      if (s === status) return;
      status = s;
      fire("progress-sync-status");
    }
    function fail() {
      ref = null;
      if (timer) { clearTimeout(timer); timer = null; }
      if (unsub) { try { unsub(); } catch (e) {} unsub = null; }
      setStatus("failed");
    }
    function isUnavailable(err) {
      return !!err && err.code === "unavailable";
    }
    function wait(ms) {
      return new Promise(function (res) { setTimeout(res, ms); });
    }
    // 出错是 'unavailable' 时等一下再试一次
    function retryOnce(fn) {
      return Promise.resolve().then(fn).then(null, function (err) {
        if (!isUnavailable(err)) throw err;
        return wait(1500).then(fn);
      });
    }
    function exists(snap) {
      if (!snap) return false;
      return typeof snap.exists === "function" ? !!snap.exists() : !!snap.exists;
    }
    function snapData(snap) {
      if (!exists(snap)) return null;
      try {
        var d = typeof snap.data === "function" ? snap.data() : null;
        return d ? JSON.parse(JSON.stringify(d)) : null; // 远端对象是冻结的：先深拷贝
      } catch (e) {
        return null;
      }
    }

    // 把远端数据合并进本地；本地有变化就通知页面刷新
    function absorb(remote) {
      var local = load();
      var merged = merge(local, remote);
      if (!same(merged, local)) {
        saveLocal(merged);
        fire("progress-synced");
      }
      return merged;
    }

    // 上传一次：先读远端 → 合并 → 写回本地 → 和远端不同才写远端
    function pushOnce() {
      if (!ref) return Promise.resolve();
      dirty = false;
      return retryOnce(function () { return ref.get(); }).then(function (snap) {
        if (!ref) return;
        var remote = snapData(snap);
        var merged = absorb(remote);
        if (remote && same(merged, remote)) return;
        // 远端读到“没有”、本地也是空的：不写（防止读取出错时用空进度盖掉账号里的进度）
        if (!remote && !hasKeys(merged.words) && !hasKeys(merged.grammar) && !hasKeys(merged.dialogues) && !merged.lastQuiz && !merged.alphabetSeen &&
            !hasKeys(merged.games) && !hasKeys(merged.days) && !hasKeys(merged.xp) && !hasKeys(merged.badges) && !merged.settings.updatedAt && !merged.resetAt &&
            !hasKeys(merged.levels) && !merged.chests.opened && !hasKeys(merged.owned.avatars) && !hasKeys(merged.owned.skins) &&
            !merged.profile.updatedAt && !hasKeys(merged.stamps) && !hasKeys(merged.daily)) return;
        var body = JSON.parse(JSON.stringify(merged));
        return retryOnce(function () { return ref.set(body); });
      });
    }

    // 排队上传：同一份文档一次只写一个
    function flush() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (!ref) return Promise.resolve();
      if (writing) {
        again = true;
        return writing;
      }
      writing = pushOnce().then(function () {
        if (ref) setStatus("synced");
      }, function () {
        fail(); // 其他错误：放弃同步，本地照常能用
      }).then(function () {
        writing = null;
        if (again && ref) {
          again = false;
          return flush();
        }
        again = false;
      });
      return writing;
    }

    // 本地进度变了（save / reset 调用）
    function changed(now) {
      dirty = true;
      if (!ref) return; // 还没连上：连上后的第一次同步会带上
      if (timer) clearTimeout(timer);
      // localStorage 不能用时进度只在内存里：马上上传，免得离开页面就丢
      if (now || !storageOk) flush();
      else timer = setTimeout(flush, DEBOUNCE);
    }

    function onRemote(snap) {
      if (!ref) return;
      var remote = snapData(snap);
      if (!remote) return;
      // 只合并进本地；如果本地有远端没有的进度（两台设备同时写），安排一次稍后的上传（不在这里直接写）
      var m = absorb(remote);
      if (!same(m, remote)) changed();
    }

    function connect() {
      if (started) return;
      // 本页的 window.claude，或外壳的 window.parent.claude（js/claude-bridge.js；没引入时只看本页）
      var c = typeof window.getClaude === "function" ? window.getClaude() : window.claude;
      if (!c || typeof c.use !== "function") return; // 本地 file:// 打开：只用本地存储
      started = true;
      setStatus("connecting");
      var db = null;
      // 最多等 12 秒，连不上就当作“只存本机”
      var timeout = new Promise(function (res) { setTimeout(function () { res([null, null]); }, 12000); });
      Promise.race([Promise.all([
        Promise.resolve(c.use("db")).then(null, function () { return null; }),
        Promise.resolve(c.use("user")).then(null, function () { return null; })
      ]), timeout]).then(function (r) {
        db = r[0];
        var user = r[1];
        if (!db || !user || typeof user.id !== "function") return null;
        return user.id();
      }).then(function (uid) {
        if (!uid || !db) {
          setStatus("local"); // 没登录 / 不支持：只存本机
          return;
        }
        ref = db.doc("data/users/" + uid + "/progress");
        // 第一次同步也走 flush 排队（读远端 → 合并 → 需要时写远端），保证不会和后面的写入并发
        return flush().then(function () {
          if (!ref) return;
          if (typeof ref.onSnapshot === "function") {
            try {
              var u = ref.onSnapshot(onRemote, function () { /* 订阅出错：保留本地，不再接收 */ });
              if (typeof u === "function") unsub = u;
            } catch (e) {}
          }
          // 连接期间页面又改了进度：补传一次
          if (dirty) changed();
        });
      }).then(null, function () {
        fail();
      });
    }

    // 页面隐藏 / 离开：有没上传的变化就马上写一次
    function onHide() {
      if (ref && (dirty || timer)) flush();
    }
    try {
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") onHide();
      });
      window.addEventListener("pagehide", onHide);
    } catch (e) {}

    // 页面先显示，同步在后台开始（window.claude 可能稍后才注入，load 时再试一次）
    function start() {
      if (typeof Promise === "undefined") return;
      try { connect(); } catch (e) { fail(); }
    }
    setTimeout(start, 0);
    try { window.addEventListener("load", start); } catch (e) {}

    return {
      changed: changed,
      api: {
        status: function () { return status; },
        flush: flush,
        start: start
      }
    };
  })();

  // ---------- 不能保存时的小字提示 ----------
  var warned = false;
  function showWarning() {
    if (warned || storageOk) return;
    function put() {
      if (warned) return;
      warned = true;
      var p = document.createElement("p");
      p.className = "progress-warn";
      p.setAttribute("role", "status");
      p.textContent = "提示：浏览器不允许保存数据，学习进度只在本次打开时有效，关闭页面后不会保存。";
      var place = document.querySelector(".container") || document.body;
      if (place) place.insertBefore(p, place.firstChild);
    }
    // 页面主体已经在了（storage.js 放在 body 末尾时）就马上显示，否则等页面加载完
    if (document.readyState !== "loading" || document.querySelector(".container")) {
      put();
    } else {
      document.addEventListener("DOMContentLoaded", put);
    }
  }
  if (!storageOk) showWarning();

  // ---------- 请浏览器不要自动清掉进度 ----------
  // iPhone Safari 等在空间紧张或很久没打开时可能清掉网站数据；persist() 是“请求长期保存”。
  // 页面加载后调用一次，不管结果（不支持、被拒绝都没关系）。
  function askPersist() {
    try {
      var ns = navigator.storage;
      if (!ns || typeof ns.persist !== "function") return;
      var ask = function (already) {
        if (already) return;
        try {
          var p = ns.persist();
          if (p && typeof p.then === "function") p.then(null, function () {});
        } catch (e) {}
      };
      if (typeof ns.persisted === "function") {
        var q = ns.persisted();
        if (q && typeof q.then === "function") q.then(ask, function () {});
        else ask(false);
      } else {
        ask(false);
      }
    } catch (e) {}
  }
  try {
    if (document.readyState === "complete") setTimeout(askPersist, 0);
    else window.addEventListener("load", askPersist);
  } catch (e) {}

  window.Progress = {
    MASTERED_BOX: MASTERED_BOX,
    MAX_BOX: MAX_BOX,
    isAvailable: function () { return storageOk; },
    load: function () { return clean(JSON.parse(JSON.stringify(load()))); }, // 返回一份副本
    getWord: getWord,
    markWord: markWord,
    touchWord: touchWord,
    wordStatus: wordStatus,
    getBox: getBox,
    masteredCount: masteredCount,
    learningCount: learningCount,
    isDue: isDue,
    reviewQueue: reviewQueue,
    wordCounts: wordCounts,
    recordGrammar: recordGrammar,
    touchGrammar: touchGrammar,
    getGrammar: getGrammar,
    recordDialogue: recordDialogue,
    getDialogue: getDialogue,
    recordQuiz: recordQuiz,
    lastQuiz: lastQuiz,
    markAlphabetSeen: markAlphabetSeen,
    alphabetInfo: alphabetInfo,
    recordGame: recordGame,
    getGame: getGame,
    streak: streak,
    studiedToday: studiedToday,
    studyDays: studyDays,
    studyDayKeys: studyDayKeys,
    dayKey: dayKey,
    XP: XP_RULES,
    GOALS: GOALS,
    award: award,
    addXp: addXp,
    xpToday: xpToday,
    xpTotal: xpTotal,
    xpWeek: xpWeek,
    xpByDay: xpByDay,
    dailyGoal: dailyGoal,
    soundOn: soundOn,
    setSound: setSound,
    vibrateOn: vibrateOn,
    setVibrate: setVibrate,
    awardLearn: awardLearn,
    speechRate: speechRate,
    setSpeechRate: setSpeechRate,
    RATES: RATES,
    setDailyGoal: setDailyGoal,
    unlockBadge: unlockBadge,
    badges: badges,
    // 阶段 11：冒险闯关
    DAILY_STARS: DAILY_STARS,
    STARS_PER_CHEST: STARS_PER_CHEST,
    DEFAULT_AVATAR: DEFAULT_AVATAR,
    DEFAULT_SKIN: DEFAULT_SKIN,
    getLevel: getLevel,
    levelsAll: levelsAll,
    recordLevel: recordLevel,
    awardLevel: awardLevel,
    recordDaily: recordDaily,
    getDaily: getDaily,
    dailyPick: dailyPick,
    starsTotal: starsTotal,
    chestsOpened: chestsOpened,
    chestsAvailable: chestsAvailable,
    openChest: openChest,
    owned: owned,
    profile: profile,
    setProfile: setProfile,
    addStamp: addStamp,
    stamps: stamps,
    reset: reset,
    merge: merge,       // 合并两份进度（测试用）
    sync: sync.api
  };
})();
