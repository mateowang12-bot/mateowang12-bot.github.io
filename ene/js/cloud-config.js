// Eñe 西语单词 —— 云同步设置（邮箱 + 密码登录，Supabase）
// 和旧网站用同一个 Supabase 项目（同一个邮箱账号两边都能登录），但进度存在新表 public.ene_progress。
// anonKey 本来就是公开的，可以放在网页里；真正的保护是数据表的 RLS（每个人只能读写自己的那一行）。
// 建表的 SQL 在 tools/supabase-ene.sql。
window.ENE_CLOUD = {
  url: "https://svajinibqgrtekgogysj.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YWppbmlicWdydGVrZ29neXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyOTE3OTgsImV4cCI6MjEwODg2Nzc5OH0.wdZQt1k-Mo_C70Xmd9sQ8paZgTKnzs4qhzNgkvp77zY",
  table: "ene_progress"
};
