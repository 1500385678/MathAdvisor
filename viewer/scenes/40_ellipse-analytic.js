// viewer/scenes/40_ellipse-analytic.js
// MathematicsWeb v0.6.43 — 椭圆解析几何 (数学 × 高中解析几何 · 人教版选择性必修第一册)
// 2D Canvas 场景:标准方程 x²/a² + y²/b² = 1 + 焦点 + 参数方程 + 离心率
//
// 数学(王炸定理):
//   标准方程(中心在原点,焦点在 x 轴):x²/a² + y²/b² = 1  (a > b > 0)
//   关键量:
//     a — 长半轴(semi-major)
//     b — 短半轴(semi-minor)
//     c = √(a²-b²)  — 半焦距
//     e = c/a       — 离心率(0 ≤ e < 1)
//     p = b²/a      — 半通径(焦点到准线距)
//   焦点:F₁(-c, 0), F₂(+c, 0)
//   准线:x = ±a/e = ±a²/c
//   焦半径公式:P(x, y) 在椭圆上 → PF₁ = a + ex, PF₂ = a - ex
//   第一定义:任一点 P → PF₁ + PF₂ = 2a  (王炸)
//   第二定义:任一点 P → PF₁ / Pd₁ = PF₂ / Pd₂ = e  (与 39 conic-unified 一致,离心率等价)
//
// 参数方程:
//   x = a·cosθ, y = b·sinθ   θ ∈ [0, 2π)
//   对应单位圆 (cosθ, sinθ) 在 x 方向缩 a, y 方向缩 b
//   椭圆面积 = πab(微积分基本公式)
//
// 焦点弦(过焦点的弦):
//   通径(垂直长轴过焦点):长 = 2b²/a = 2p
//   一般焦点弦长:2ab²/(a²-c²·cos²α)(α 是弦与长轴夹角)
//
// 历史:
//   - 公元前 4 世纪 Menaechmus 用圆锥截线解立方方程 x³=2a³ (倍立方问题)
//   - 公元前 200 年 Apollonius 系统研究 8 卷《圆锥曲线论》
//   - 1609 年开普勒第一定律:行星轨道是椭圆,太阳在焦点
//   - 1687 牛顿《原理》用万有引力证明开普勒定律 → 椭圆轨道
//   - 1809 年高斯用最小二乘法估算谷神星轨道(第一批非抛物线椭圆轨道计算)
//
// 应用:
//   - 天文:行星轨道(地球 e=0.0167,水星 e=0.2056,冥王星 e=0.2488)
//   - 工程:拱形结构(半椭圆)· 椭圆餐桌设计 · 麦克风聚音
//   - 光学:反射式望远镜(从一焦点发射→反射汇聚另一焦点,见 23_ellipse-reflection)
//   - 医学:体外冲击波碎石(肾结石聚焦)
//
// 与 39_conic-unified 关系:
//   - 39 用极坐标统一表达三种圆锥曲线(王炸 e 公式)
//   - 40 用标准方程深入椭圆(高中解析几何必修,人教版选必一)
//
// 与 23_ellipse-reflection 关系:
//   - 23 演示椭圆光学反射性质(从一焦点发必到另一焦点)
//   - 40 演示椭圆代数 + 几何关系(第一/第二定义 + 参数方程 + 离心率)

import { makeLoop, fitCanvas } from '../../kernel/02_animation.js';

export function createScene(host, opts = {}) {
  // ---------- DOM ----------
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:absolute;inset:0;';
  host.appendChild(wrap);

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%;';
  wrap.appendChild(canvas);

  const lesson = document.createElement('div');
  lesson.className = 'mathw-lesson';
  lesson.innerHTML = `
    <button class="mathw-lesson-toggle" data-toggle>−</button>
    <div class="mathw-lesson-title">数学 × 高中解析几何 · 椭圆解析几何</div>
    <div class="mathw-lesson-content">
      <div class="mathw-lesson-headline">x²/a² + y²/b² = 1 · 第一定义 PF₁+PF₂=2a</div>
      <div class="mathw-lesson-formula">x²/a² + y²/b² = 1, c = √(a²-b²), e = c/a, p = b²/a</div>
      <div class="mathw-lesson-text">
        <strong>标准方程</strong>(王炸):<strong>x²/a² + y²/b² = 1</strong>(a &gt; b &gt; 0,中心在原点,焦点在 x 轴)。
        关键量 — <strong>a</strong>(长半轴)· <strong>b</strong>(短半轴)· <strong>c = √(a²-b²)</strong>(半焦距)· <strong>e = c/a</strong>(离心率,0 ≤ e &lt; 1)。<br>
        <strong>第一定义</strong>(王炸):椭圆上任一点 P → <strong>PF₁ + PF₂ = 2a</strong>(两焦点距之和恒定)。<br>
        <strong>第二定义</strong>(王炸):<strong>PF = e × Pd</strong> — 焦距 = e × 准线距(与 39 conic-unified 一致,见 39)。<br>
        <strong>参数方程</strong>:<strong>x = a·cosθ, y = b·sinθ</strong> — 单位圆在 x/a、y/b 缩放。面积 = πab。<br>
        拖动 <strong>a/b</strong> 看椭圆拉长压扁;切"参数"看 P 沿椭圆循环动画 + 单位圆映射;<strong>e 模式</strong> 拖 e 看从圆(e→0)到扁(e→0.95)。<br>
        <strong>历史</strong>:1609 开普勒第一定律(行星椭圆轨道,太阳在焦点)· 1687 牛顿万有引力证明 · 1809 高斯谷神星轨道(首批椭圆计算)。<br>
        <strong>应用</strong>:行星轨道(地球 e=0.017)· 反射望远镜(见 23)· 体外冲击波碎石 · 半椭圆拱。
      </div>
    </div>
  `;
  host.appendChild(lesson);
  lesson.querySelector('[data-toggle]').addEventListener('click', () => {
    lesson.classList.toggle('collapsed');
    lesson.querySelector('[data-toggle]').textContent = lesson.classList.contains('collapsed') ? '+' : '−';
  });

  const ctrls = document.createElement('div');
  ctrls.className = 'mathw-controls';
  ctrls.innerHTML = `
    <div class="mathw-controls-title">参数 · 椭圆</div>
    <div class="mathw-control-row">
      <span class="mathw-control-label">视图模式</span>
      <select data-mode>
        <option value="basic" selected>标准方程 · 拖 a/b 看椭圆</option>
        <option value="parametric">参数方程 · 单位圆缩放</option>
        <option value="e-mode">离心率 e · 从圆到扁</option>
      </select>
    </div>
    <div class="mathw-control-row" data-row-a>
      <span class="mathw-control-label">长半轴 a</span>
      <input type="range" min="100" max="320" step="10" value="240" data-a />
      <span class="mathw-control-value" data-a-v>240</span>
    </div>
    <div class="mathw-control-row" data-row-b>
      <span class="mathw-control-label">短半轴 b</span>
      <input type="range" min="60" max="240" step="10" value="160" data-b />
      <span class="mathw-control-value" data-b-v>160</span>
    </div>
    <div class="mathw-control-row" data-row-e style="display:none">
      <span class="mathw-control-label">离心率 e</span>
      <input type="range" min="0.05" max="0.95" step="0.02" value="0.6" data-e />
      <span class="mathw-control-value" data-e-v>0.60</span>
    </div>
    <div class="mathw-control-row" data-row-fixed style="display:none">
      <span class="mathw-control-label">固定 a</span>
      <input type="range" min="100" max="320" step="10" value="240" data-a-fixed />
      <span class="mathw-control-value" data-a-fixed-v>240</span>
    </div>
    <div class="mathw-control-row">
      <span class="mathw-control-label">预设</span>
      <button data-p-circ>e≈0 圆</button>
      <button data-p-earth>e=0.017 地球</button>
      <button data-p-mercury>e=0.206 水星</button>
      <button data-p-pluto>e=0.249 冥王星</button>
    </div>
    <div class="mathw-control-row" style="font-size:11px;color:var(--mathw-muted)">
      提示:动点 P(高亮黄)实时验证 PF₁+PF₂=2a
    </div>
  `;
  host.appendChild(ctrls);

  // ---------- 状态 ----------
  let params = { mode: 'basic', a: 240, b: 160, e: 0.6, aFixed: 240 };
  let tAnim = 0;     // 动点 P 沿椭圆动画相位

  // ---------- 渲染 ----------
  const ctx = canvas.getContext('2d');

  // 椭圆参数 → 渲染尺度
  // mode=basic: 直接用 a, b 像素
  // mode=parametric: a, b 像素
  // mode=e-mode: 固定 a = aFixed,b = a * sqrt(1-e²)
  function getEllipse() {
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const cx = W / 2;
    const cy = H / 2;
    let a, b, c, e;
    if (params.mode === 'e-mode') {
      a = params.aFixed;
      e = params.e;
      b = a * Math.sqrt(Math.max(0, 1 - e * e));
      c = a * e;
    } else {
      a = params.a;
      b = params.b;
      const cSq = Math.max(0, a * a - b * b);
      c = Math.sqrt(cSq);
      e = c / a;
    }
    return { cx, cy, a, b, c, e, p: (b * b) / a };
  }

  // 画椭圆
  function drawEllipse(cx, cy, a, b, color, lineW = 2) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineW;
    ctx.beginPath();
    // 椭圆参数化:x = cx + a·cosθ, y = cy + b·sinθ
    for (let i = 0; i <= 360; i += 1) {
      const theta = (i * Math.PI) / 180;
      const x = cx + a * Math.cos(theta);
      const y = cy + b * Math.sin(theta);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // 画焦点 F1, F2 + 准线 + 长短轴端点
  function drawFociAxes(cx, cy, a, b, c) {
    ctx.save();
    // 长轴端点(±a, 0)
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(cx - a, cy); ctx.lineTo(cx + a, cy);
    ctx.stroke();
    // 短轴端点(0, ±b)
    ctx.beginPath();
    ctx.moveTo(cx, cy - b); ctx.lineTo(cx, cy + b);
    ctx.stroke();
    ctx.setLineDash([]);

    // 焦点 F1, F2
    ctx.fillStyle = '#ff3b30';
    [[cx - c, cy, 'F₁'], [cx + c, cy, 'F₂']].forEach(([x, y, label]) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    // 焦点标签
    ctx.fillStyle = '#ff3b30';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('F₁', cx - c, cy + 20);
    ctx.fillText('F₂', cx + c, cy + 20);

    // 顶点(±a, 0)
    ctx.fillStyle = '#5e5ce6';
    [[cx - a, cy, 'A₁'], [cx + a, cy, 'A₂']].forEach(([x, y, label]) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#5e5ce6';
    ctx.font = '12px sans-serif';
    ctx.fillText('A₁', cx - a, cy + 20);
    ctx.fillText('A₂', cx + a, cy + 20);

    // 准线 x = ±a²/c(只在 c>0 时画)
    if (c > 5) {
      const xDir = (a * a) / c;
      ctx.strokeStyle = '#3a86ff';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx - xDir, cy - 80);
      ctx.lineTo(cx - xDir, cy + 80);
      ctx.moveTo(cx + xDir, cy - 80);
      ctx.lineTo(cx + xDir, cy + 80);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#3a86ff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('l₁', cx - xDir, cy - 84);
      ctx.fillText('l₂', cx + xDir, cy - 84);
    }
    ctx.restore();
  }

  // 画动点 P + PF1 + PF2 验证 2a
  function drawMovingPoint(cx, cy, a, b, c, theta) {
    const px = cx + a * Math.cos(theta);
    const py = cy + b * Math.sin(theta);
    const f1x = cx - c, f1y = cy;
    const f2x = cx + c, f2y = cy;
    const pf1 = Math.hypot(px - f1x, py - f1y);
    const pf2 = Math.hypot(px - f2x, py - f2y);
    const sum = pf1 + pf2;
    const expected = 2 * a;
    const ok = Math.abs(sum - expected) < 0.5;

    ctx.save();
    // PF1 线
    ctx.strokeStyle = '#ff9f0a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(f1x, f1y);
    ctx.lineTo(px, py);
    ctx.stroke();
    // PF2 线
    ctx.strokeStyle = '#34c759';
    ctx.beginPath();
    ctx.moveTo(f2x, f2y);
    ctx.lineTo(px, py);
    ctx.stroke();

    // 动点 P
    ctx.fillStyle = ok ? '#ffd60a' : '#ff453a';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();

    // 数值
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    const yOff = (py < cy) ? -20 : 26;
    ctx.fillText(`PF₁ = ${pf1.toFixed(1)}`, px + 10, py + yOff);
    ctx.fillText(`PF₂ = ${pf2.toFixed(1)}`, px + 10, py + yOff + 14);
    ctx.fillStyle = ok ? '#ffd60a' : '#ff453a';
    ctx.fillText(`PF₁+PF₂ = ${sum.toFixed(1)} (2a=${expected.toFixed(0)})`, px + 10, py + yOff + 28);
    ctx.restore();
  }

  // 参数模式:画单位圆 + 椭圆 + 映射箭头
  function drawParametricView(cx, cy, a, b) {
    ctx.save();
    // 单位参考圆(虚线,在 b/a 缩放)
    ctx.strokeStyle = '#5e5ce6';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(cx, cy, b, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, a, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 椭圆
    drawEllipse(cx, cy, a, b, '#ffd60a', 2.5);

    // 动点 P(沿椭圆)
    const theta = tAnim % (2 * Math.PI);
    const px = cx + a * Math.cos(theta);
    const py = cy + b * Math.sin(theta);
    // 单位圆上的对应点 (b·cosθ, b·sinθ)
    const ux = cx + b * Math.cos(theta);
    const uy = cy + b * Math.sin(theta);
    // x 轴投影 (a·cosθ, 0)
    const xproj = cx + a * Math.cos(theta);
    const yproj = cy + b * Math.sin(theta);

    // 单位圆点
    ctx.fillStyle = '#5e5ce6';
    ctx.beginPath();
    ctx.arc(ux, uy, 4, 0, Math.PI * 2);
    ctx.fill();
    // 椭圆动点
    ctx.fillStyle = '#ffd60a';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();

    // 映射线
    ctx.strokeStyle = '#34c759';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    // 单位圆点 → 椭圆点(y 缩 b → a)
    ctx.beginPath();
    ctx.moveTo(ux, uy);
    ctx.lineTo(px, py);
    ctx.stroke();
    // 椭圆点 → x 轴
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(xproj, cy);
    ctx.stroke();
    // 单位圆点 → y 轴
    ctx.beginPath();
    ctx.moveTo(ux, uy);
    ctx.lineTo(cx, uy);
    ctx.stroke();
    ctx.setLineDash([]);

    // 角度 θ
    ctx.strokeStyle = '#ff9f0a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(b * 0.5 * Math.cos(theta), cy + b * 0.5 * Math.sin(theta));
    ctx.stroke();
    ctx.fillStyle = '#ff9f0a';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`θ = ${(theta * 180 / Math.PI).toFixed(0)}°`, 12, 30);
    ctx.fillStyle = '#aaa';
    ctx.fillText(`P(a·cosθ, b·sinθ) = (${(a * Math.cos(theta)).toFixed(0)}, ${(b * Math.sin(theta)).toFixed(0)})`, 12, 48);

    ctx.restore();
  }

  function draw(elapsed, dt) {
    const { w, h, dpr } = fitCanvas(canvas, host);
    const W = w, H = h;
    const { cx, cy, a, b, c, e, p } = getEllipse();
    tAnim += dt * 0.0006;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#0e1116';
    ctx.fillRect(0, 0, W, H);
    // 坐标轴
    ctx.strokeStyle = '#1c1f26';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(W, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, H);
    ctx.stroke();

    if (params.mode === 'basic') {
      drawFociAxes(cx, cy, a, b, c);
      drawEllipse(cx, cy, a, b, '#ffd60a', 2.5);
      drawMovingPoint(cx, cy, a, b, c, tAnim % (2 * Math.PI));
      // 标题
      ctx.fillStyle = '#ffd60a';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('标准方程 · 椭圆', cx, 30);
      ctx.fillStyle = '#aaa';
      ctx.font = '12px sans-serif';
      ctx.fillText(`a = ${a.toFixed(0)} · b = ${b.toFixed(0)} · c = ${c.toFixed(1)} · e = ${e.toFixed(3)} · 2a = ${(2 * a).toFixed(0)}`, cx, 50);
    } else if (params.mode === 'parametric') {
      drawParametricView(cx, cy, a, b);
      ctx.fillStyle = '#ffd60a';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('参数方程 · x = a·cosθ, y = b·sinθ', cx, 30);
    } else {
      // e-mode
      drawFociAxes(cx, cy, a, b, c);
      drawEllipse(cx, cy, a, b, '#ffd60a', 2.5);
      drawMovingPoint(cx, cy, a, b, c, tAnim % (2 * Math.PI));
      ctx.fillStyle = '#ffd60a';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`离心率模式 · e = ${e.toFixed(3)}`, cx, 30);
      ctx.fillStyle = '#aaa';
      ctx.font = '12px sans-serif';
      const aPct = a.toFixed(0);
      const bPct = b.toFixed(0);
      const cPct = c.toFixed(0);
      ctx.fillText(`a = ${aPct} · b = a·√(1-e²) = ${bPct} · c = a·e = ${cPct} · p = b²/a = ${p.toFixed(1)}`, cx, 50);
    }
    ctx.restore();
  }

  // ---------- 控件事件 ----------
  function showRows() {
    const mode = params.mode;
    ctrls.querySelector('[data-row-a]').style.display = (mode === 'basic' || mode === 'parametric') ? '' : 'none';
    ctrls.querySelector('[data-row-b]').style.display = (mode === 'basic' || mode === 'parametric') ? '' : 'none';
    ctrls.querySelector('[data-row-e]').style.display = (mode === 'e-mode') ? '' : 'none';
    ctrls.querySelector('[data-row-fixed]').style.display = (mode === 'e-mode') ? '' : 'none';
  }
  ctrls.querySelector('[data-mode]').addEventListener('change', e => {
    params.mode = e.target.value;
    showRows();
  });
  ctrls.querySelector('[data-a]').addEventListener('input', e => {
    params.a = parseFloat(e.target.value);
    ctrls.querySelector('[data-a-v]').textContent = params.a;
  });
  ctrls.querySelector('[data-b]').addEventListener('input', e => {
    params.b = parseFloat(e.target.value);
    ctrls.querySelector('[data-b-v]').textContent = params.b;
  });
  ctrls.querySelector('[data-e]').addEventListener('input', e => {
    params.e = parseFloat(e.target.value);
    ctrls.querySelector('[data-e-v]').textContent = params.e.toFixed(2);
  });
  ctrls.querySelector('[data-a-fixed]').addEventListener('input', e => {
    params.aFixed = parseFloat(e.target.value);
    ctrls.querySelector('[data-a-fixed-v]').textContent = params.aFixed;
  });

  // 预设:e 模式专属
  function setE(eVal) {
    params.mode = 'e-mode';
    ctrls.querySelector('[data-mode]').value = 'e-mode';
    params.e = eVal;
    ctrls.querySelector('[data-e]').value = String(eVal);
    ctrls.querySelector('[data-e-v]').textContent = eVal.toFixed(2);
    showRows();
  }
  ctrls.querySelector('[data-p-circ]').addEventListener('click', () => setE(0.05));
  ctrls.querySelector('[data-p-earth]').addEventListener('click', () => setE(0.017));
  ctrls.querySelector('[data-p-mercury]').addEventListener('click', () => setE(0.2056));
  ctrls.querySelector('[data-p-pluto]').addEventListener('click', () => setE(0.2488));

  const loop = makeLoop(draw);
  loop.start();

  return {
    sceneId: 'ellipse-analytic',
    getFormula() { return 'x²/a² + y²/b² = 1, c = √(a²-b²), e = c/a, p = b²/a;  参数方程 x = a·cosθ, y = b·sinθ;  PF₁ + PF₂ = 2a'; },
    getLesson() {
      return [
        '核心:椭圆标准方程 x²/a² + y²/b² = 1 (a > b > 0)',
        '关键量:a(长半轴)· b(短半轴)· c = √(a²-b²)(半焦距)· e = c/a(离心率,0≤e<1)· p = b²/a(半通径)',
        '第一定义(王炸):PF₁ + PF₂ = 2a(两焦点距之和恒定)',
        '第二定义(王炸):PF = e × Pd(与 39 conic-unified 等价,离心率公式)',
        '参数方程:x = a·cosθ, y = b·sinθ(单位圆在 x/a、y/b 缩放),面积 = πab',
        '通径(过焦点垂直长轴的弦)长 = 2b²/a = 2p',
        '历史:1609 开普勒第一定律(行星椭圆轨道,太阳在焦点)· 1687 牛顿万有引力证明 · 1809 高斯谷神星轨道',
        '应用:行星轨道(地球 e=0.017)· 反射望远镜(见 23)· 体外冲击波碎石 · 半椭圆拱',
      ].join('\n');
    },
    destroy() {
      loop.stop();
      wrap.remove();
      lesson.remove();
      ctrls.remove();
    },
  };
}
