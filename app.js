const capabilities = [
  { name: "Agent配置", score: 85, priority: "P0", status: "进行中", detail: "沙箱环境、Skill 配置与调度" },
  { name: "知识沉淀", score: 70, priority: "P0", status: "已跑通", detail: "对话沉淀知识，去重、更新与下线" },
  { name: "项目管理", score: 80, priority: "P1", status: "稳定", detail: "需求进展查询与每周项目周报" },
  { name: "需求澄清", score: 60, priority: "P1", status: "已跑通", detail: "基于标准框架输出可执行需求文档" },
  { name: "取数 Skill", score: 15, priority: "P2", status: "待建设", detail: "标准化与非标 SQL 取数" },
  { name: "分析归因", score: 0, priority: "P2", status: "远期", detail: "异动发现与归因分析" },
  { name: "数仓开发", score: 0, priority: "P2", status: "远期", detail: "从需求调研到 ETL 的全流程辅助" },
];

const skillGroups = [
  { name: "取数", progress: 15, skills: ["bi-data-query", "bi-data-query-chat", "bi-query-dashboard", "bi-query-sql", "cube-table-query", "data-gap-checker"] },
  { name: "需求澄清", progress: 60, skills: ["demand-management", "demand-tracker", "search-prd-writer", "bi-01-scope", "bi-02-plan"] },
  { name: "项目管理", progress: 80, skills: ["sou-shu-jun-report", "xinfanshi-daily-report", "monthly-ops-cron", "project-management", "quality-assurance"] },
  { name: "数据分析", progress: 0, skills: ["bi-analysis-dashboard", "data-analysis", "data-consulting", "data-viz-pro", "data-anomaly-analysis"] },
];

const documents = [
  ["实验领域相关", 12, "Arena 实验 · 数据集 · 分流", "#2563eb"],
  ["埋点规范与 QV 口径", 8, "埋点 SOP · QV 口径", "#7c3aed"],
  ["数聚导入资产", 6, "指标 · 用表 · 实时流", "#0891b2"],
  ["业务知识与工具", 10, "指标 · 工具 · 咨询", "#059669"],
  ["质量监控", 2, "质量发现沉淀", "#ea580c"],
  ["问答知识库", 4, "FAQ · 数据常识", "#db2777"],
  ["其他文档", 4, "参考文档", "#64748b"],
];

const sessions = [
  { type: "私聊", role: "管理员", topic: "数据咨询", count: 72, accuracy: 92 },
  { type: "私聊", role: "非管理员", topic: "指标口径", count: 64, accuracy: 86 },
  { type: "群聊", role: "非管理员", topic: "项目进展", count: 46, accuracy: 89 },
  { type: "定时触发", role: "管理员", topic: "日报周报", count: 35, accuracy: 100 },
  { type: "私聊", role: "管理员", topic: "需求澄清", count: 28, accuracy: 90 },
];

const monitors = [
  { title: "索引巡检", interval: "每 30 分钟", detail: "检查向量索引完整性、Embedding 维度与检索响应时间。", result: "68 个文档索引全部可用" },
  { title: "Git 仓库巡检", interval: "每 60 分钟", detail: "检查代码仓库同步状态、分支健康度与自动化流程。", result: "3 个仓库均已同步" },
  { title: "健康检查", interval: "每 30 分钟", detail: "检查 Agent 服务存活、响应能力与心跳信号。", result: "进程正常，响应延迟 < 200ms" },
];

const navItems = [
  ["/", "◎", "能力图谱"], ["/observe", "⌁", "可观测"], ["/knowledge", "▤", "知识库"],
  ["/sessions", "◫", "Session"], ["/monitor", "◉", "监控"], ["/weekly-summary", "▥", "周总结"],
];

const pageTitles = { "/": "能力图谱", "/observe": "能力可观测", "/knowledge": "知识库概况", "/sessions": "Session 分析", "/monitor": "运行监控", "/weekly-summary": "每周总结" };

const icons = {
  pulse: '<svg viewBox="0 0 24 24"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>',
  database: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
};

function route() {
  const value = location.hash.replace(/^#/, "") || "/";
  return pageTitles[value] ? value : "/";
}

function card(title, content, extra = "") {
  return `<section class="card ${extra}"><div class="card-title">${icons.pulse}<h2>${title}</h2><span></span></div>${content}</section>`;
}

function radarSvg(items) {
  const cx = 160, cy = 155, radius = 104, n = items.length;
  const point = (i, ratio) => {
    const a = -Math.PI / 2 + (Math.PI * 2 * i) / n;
    return [cx + Math.cos(a) * radius * ratio, cy + Math.sin(a) * radius * ratio];
  };
  const polygon = (ratio) => items.map((_, i) => point(i, ratio).join(",")).join(" ");
  const dataPoints = items.map((item, i) => point(i, item.score / 100));
  return `<svg class="radar" viewBox="0 0 320 320" role="img" aria-label="Agent 能力雷达图">
    ${[.2,.4,.6,.8,1].map(r => `<polygon points="${polygon(r)}" class="radar-grid"/>`).join("")}
    ${items.map((_, i) => { const p = point(i, 1); return `<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" class="radar-grid"/>`; }).join("")}
    <polygon points="${dataPoints.map(p => p.join(",")).join(" ")}" class="radar-data"/>
    ${dataPoints.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4" class="radar-dot"/>`).join("")}
    ${items.map((item, i) => { const p = point(i, 1.25); const anchor = p[0] < 145 ? "end" : p[0] > 175 ? "start" : "middle"; return `<text x="${p[0]}" y="${p[1]}" text-anchor="${anchor}">${item.name}<tspan x="${p[0]}" dy="14">${item.score} / 100</tspan></text>`; }).join("")}
  </svg>`;
}

function mapPage() {
  const list = capabilities.map(item => `<article class="capability-row">
    <span class="priority ${item.priority.toLowerCase()}">${item.priority}</span>
    <div class="capability-name">${item.name}</div><p>${item.detail}</p>
    <span class="status ${item.status === "远期" ? "muted" : ""}">${item.status}</span>
  </article>`).join("");
  return `<div class="page-head"><div><span class="eyebrow">Agent Capability Map</span><h1>搜数君 DataAgent · 能力图谱</h1><p>从能力建设到稳定运行，一眼看清 Agent 的当前进展与下一步目标。</p></div><span class="live"><i></i>系统运行中</span></div>
    <section class="intro"><div class="agent-mark">A</div><div><h2>关于搜数君 DataAgent</h2><p>面向搜索数据领域的 AI 员工，支持数据咨询、需求澄清、归因分析与取数生产等核心场景，承接可标准化的执行工作。</p><div class="chips"><span>OpenClaw 平台</span><span>@搜数君</span><span>数据咨询</span><span>SQL 生成</span></div></div></section>
    <div class="two-col">${card("核心能力清单", `<div class="capability-list">${list}</div>`)}${card("能力雷达", `${radarSvg(capabilities)}<div class="legend"><i></i>当前现状 <b></b>今年目标</div>`, "radar-card")}</div>`;
}

function observePage() {
  const metrics = [["84","技能总数","Total Skills"],["35","Cron 任务","Cron Jobs"],["31","启用中","Enabled Jobs"],["0","失败任务","Failed Jobs"]];
  return `<div class="page-head"><div><span class="eyebrow">Observability</span><h1>能力可观测</h1><p>集中查看技能、调度任务和运行质量。</p></div><button class="button" data-refresh>↻ 刷新</button></div>
    <div class="metric-grid">${metrics.map(([v,l,e]) => `<article class="metric"><strong>${v}</strong><span>${l}</span><small>${e}</small></article>`).join("")}</div>
    ${card("Skill 分类与完成度", `<div class="skill-grid">${skillGroups.map((g,i) => `<article class="skill-group"><div class="skill-head"><div><h3>${g.name}</h3><span>${g.skills.length} 个技能</span></div><strong>${g.progress}%</strong></div><div class="progress"><i style="width:${g.progress}%"></i></div><div class="skill-list">${g.skills.slice(0,3).map(s=>`<code>${s}</code>`).join("")}<div class="more-skills" id="skills-${i}" hidden>${g.skills.slice(3).map(s=>`<code>${s}</code>`).join("")}</div></div><button class="text-button" data-expand="skills-${i}">展开全部</button></article>`).join("")}</div>`)}
    ${card("执行埋点指标", `<div class="empty-chart"><div class="bars">${[34,52,46,78,62,88,70].map(h=>`<i style="height:${h}%"></i>`).join("")}</div><p>演示数据 · 接入埋点服务后可展示实时调用趋势</p></div>`)}`;
}

function knowledgePage() {
  return `<div class="page-head"><div><span class="eyebrow">Knowledge Base</span><h1>知识库概况</h1><p>46 份知识文件，覆盖业务口径、数据资产与问答经验。</p></div><label class="search">⌕<input placeholder="搜索知识类型" data-knowledge-search></label></div>
    <div class="document-grid">${documents.map(([name,count,detail,color]) => `<article class="document" data-document="${name} ${detail}"><i style="background:${color}"></i><span>${detail}</span><strong>${count}</strong><h3>${name}</h3><small>${(count/46*100).toFixed(1)}%</small></article>`).join("")}</div>
    ${card("每日自动更新流程", `<div class="timeline">${[["11:00","学城文档增量同步","抓取新增或修改页面，更新向量索引。"],["20:00","知识库全量重建","清除过期内容，保证检索数据一致。"],["22:00","质量检查与报告","检查索引完整性并生成同步报告。"]].map(x=>`<article><time>${x[0]}</time><div><h3>${x[1]} <span class="status">正常运行</span></h3><p>${x[2]}</p></div></article>`).join("")}</div>`)}`;
}

function sessionsPage() {
  return `<div class="page-head"><div><span class="eyebrow">Session Analytics</span><h1>Session 分析</h1><p>通过会话数据识别真实需求与服务质量。</p></div><button class="button" data-refresh>↻ 刷新</button></div>
    <section class="filters"><label>类型<select data-session-type><option>全部</option><option>私聊</option><option>群聊</option><option>定时触发</option></select></label><label>身份<select data-session-role><option>全部</option><option>管理员</option><option>非管理员</option></select></label><label>日期<input type="date" value="2026-08-18"></label></section>
    <div class="metric-grid" id="session-metrics"></div>
    <div class="two-col session-layout">${card("需求类型分布", `<div id="session-chart" class="topic-chart"></div>`)}${card("访问明细", `<div id="session-table"></div>`)}</div>`;
}

function monitorPage() {
  return `<div class="page-head"><div><span class="eyebrow">Runtime Monitor</span><h1>运行监控</h1><p>巡检任务、配置文件与运行健康度。</p></div><span class="live"><i></i>监控运行中</span></div>
    <section class="health"><div class="health-score">✓</div><div><span>所有巡检项目正常运行</span><h2>系统健康</h2><p>共 3 项巡检任务 · 全部通过</p></div></section>
    <div class="monitor-grid">${monitors.map(m=>`<article class="monitor"><div class="monitor-title"><span>${icons.pulse}</span><div><h3>${m.title}</h3><small>${m.interval}</small></div><b>正常</b></div><p>${m.detail}</p><div class="result">✓ ${m.result}</div><footer>上次：15 分钟前 <span>下次：15 分钟后</span></footer></article>`).join("")}</div>
    ${card("质量文件状态", `<div class="file-table">${[["openclaw.json","Agent 主配置文件","正常","2 天前"],["skills.json","技能配置清单","正常","5 天前"],["cron_config.yaml","定时任务配置","正常","1 天前"],["knowledge_index.bin","向量索引文件","正常","6 小时前"],["error.log","错误日志","注意","3 小时前"]].map(x=>`<div><code>${x[0]}</code><span>${x[1]}</span><b class="${x[2]==="注意"?"warning":""}">${x[2]}</b><time>${x[3]}</time></div>`).join("")}</div>`)}`;
}

function weeklyPage() {
  return `<div class="page-head"><div><span class="eyebrow">Weekly Summary</span><h1>每周总结</h1><p>2026.08.17 — 2026.08.23 · 每周一更新</p></div><div class="score"><strong>92</strong><span>/ 100<br>综合评分</span></div></div>
    <div class="metric-grid">${[["62","来访人数","人"],["255","来访次数","次"],["97","高频需求 · 问数","次"],["66.8%","回答准确率","本周"]].map(x=>`<article class="metric"><strong>${x[0]}</strong><span>${x[1]}</span><small>${x[2]}</small></article>`).join("")}</div>
    <div class="two-col summary-grid">${card("做得好", `<ul class="summary-list good"><li>权限安全体系完成代码级加固</li><li>数据分析能力通过真实业务交付验证</li><li>广告红线监测与数据推送实现自动闭环</li><li>建立可量化的周度服务指标</li></ul>`)}${card("待改进", `<ul class="summary-list improve"><li>补充搜索埋点、实验方法等领域知识</li><li>标准化实验统计与归因分析流程</li><li>为外部依赖增加失败告警</li><li>继续提升问答准确率与知识命中率</li></ul>`)}</div>
    ${card("本周亮点 / 重点事项", `<div class="highlights">${["权限校验三层防御体系", "BR 归因分析落地", "实验巡查异常识别", "服务运营数据量化", "知识库治理闭环", "Cron 异常修复"].map((x,i)=>`<span><b>${String(i+1).padStart(2,"0")}</b>${x}</span>`).join("")}</div>`)}`;
}

const renderers = { "/": mapPage, "/observe": observePage, "/knowledge": knowledgePage, "/sessions": sessionsPage, "/monitor": monitorPage, "/weekly-summary": weeklyPage };

function renderSessions() {
  const type = document.querySelector("[data-session-type]")?.value || "全部";
  const role = document.querySelector("[data-session-role]")?.value || "全部";
  const filtered = sessions.filter(s => (type === "全部" || s.type === type) && (role === "全部" || s.role === role));
  const visits = filtered.reduce((sum,s)=>sum+s.count,0);
  const accuracy = filtered.length ? Math.round(filtered.reduce((sum,s)=>sum+s.accuracy*s.count,0)/visits) : 0;
  document.querySelector("#session-metrics").innerHTML = [[Math.ceil(visits/4),"来访人数","Unique Visitors"],[visits,"来访次数","Total Sessions"],[`${accuracy}%`,"回答准确率","Accuracy Rate"],[Math.max(0,Math.round(visits*(100-accuracy)/100)),"人工纠错","Corrections"]].map(x=>`<article class="metric"><strong>${x[0]}</strong><span>${x[1]}</span><small>${x[2]}</small></article>`).join("");
  document.querySelector("#session-chart").innerHTML = filtered.length ? filtered.map(s=>`<div><span>${s.topic}</span><i><b style="width:${Math.max(8,s.count/visits*100)}%"></b></i><strong>${s.count}</strong></div>`).join("") : '<p class="empty">暂无符合条件的数据</p>';
  document.querySelector("#session-table").innerHTML = filtered.length ? `<div class="session-table">${filtered.map(s=>`<div><b>${s.topic}</b><span>${s.type}</span><span>${s.role}</span><strong>${s.accuracy}%</strong></div>`).join("")}</div>` : '<p class="empty">暂无符合条件的数据</p>';
}

function bindEvents() {
  document.querySelectorAll("[data-refresh]").forEach(btn => btn.addEventListener("click", () => {
    btn.textContent = "✓ 已同步"; btn.classList.add("success");
    setTimeout(()=>{ btn.textContent = "↻ 刷新"; btn.classList.remove("success"); }, 1800);
  }));
  document.querySelectorAll("[data-expand]").forEach(btn => btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.expand); target.hidden = !target.hidden; btn.textContent = target.hidden ? "展开全部" : "收起";
  }));
  document.querySelector("[data-knowledge-search]")?.addEventListener("input", event => {
    const q = event.target.value.trim().toLowerCase();
    document.querySelectorAll("[data-document]").forEach(item => item.hidden = !item.dataset.document.toLowerCase().includes(q));
  });
  document.querySelectorAll("[data-session-type],[data-session-role]").forEach(el => el.addEventListener("change", renderSessions));
  if (route() === "/sessions") renderSessions();
  document.querySelector("[data-menu]")?.addEventListener("click", ()=>document.body.classList.toggle("menu-open"));
}

function render() {
  const current = route();
  document.title = `${pageTitles[current]} · Agent能力看板`;
  document.querySelector("#app").innerHTML = `<div class="shell">
    <aside class="sidebar"><a href="#/" class="brand"><span>A</span><div><strong>Agent能力看板</strong><small>CAPABILITY CENTER</small></div></a><nav>${navItems.map(([path,icon,label])=>`<a href="#${path}" class="${current===path?"active":""}"><i>${icon}</i><span>${label}</span></a>`).join("")}</nav><div class="sidebar-foot"><i></i><div><strong>服务在线</strong><small>最近检查：刚刚</small></div></div></aside>
    <header class="mobile-head"><button data-menu aria-label="展开导航">☰</button><strong>Agent能力看板</strong><span class="live-dot"></span></header>
    <main>${renderers[current]()}<footer class="page-footer">Agent 能力看板 · 独立源码版 <span>数据为展示样例，可替换为真实 API</span></footer></main>
  </div>`;
  bindEvents();
}

window.addEventListener("hashchange", () => { document.body.classList.remove("menu-open"); render(); });
render();
