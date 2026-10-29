// 云同步（邮箱 + 密码登录，Supabase）的设置：只放这两项。
// url：Supabase 项目地址；anonKey：项目的 anon public key（本来就是公开的，可以放在网页里；真正的保护是数据表的 RLS：每个用户只能读写自己的那一行）。
// 两项都是空的时候，“我的”页显示“还没配置云同步”，网站其他功能照常。
// 这个项目开着“邮箱确认”：注册后要先去邮箱点确认链接；确认链接会跳回 https://mateowang12-bot.github.io/#access_token=…（js/cloud.js 会接住，直接登录）。
window.CLOUD_CONFIG = {
  url: "https://svajinibqgrtekgogysj.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YWppbmlicWdydGVrZ29neXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyOTE3OTgsImV4cCI6MjEwODg2Nzc5OH0.wdZQt1k-Mo_C70Xmd9sQ8paZgTKnzs4qhzNgkvp77zY"
};
