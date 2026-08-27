// viewer/scenes/39_conic-unified.js
// MathematicsWeb v0.6.42 — 圆锥曲线统一定义 (数学 × 高中解析几何 · 人教版选择性必修第一册)
// 2D Canvas 场景:焦点 F + 准线 l + 圆锥曲线 (e<1 椭圆 / e=1 抛物线 / e>1 双曲线)
//
// 数学(王炸定理):
//   定义:曲线上任意点 P 到焦点 F 的距离 PF = e × P 到准线 l 的距离 Pd
//   离心率 e:
//     0 ≤ e < 1  →  椭圆
//     e = 1      →  抛物线
//     e > 1      →  双曲线
//   极坐标方程(焦点在原点,准线 x = -d):
//     r = ed / (1 + e·cosθ)            焦点在极坐标原点,准线 x = -d (d > 0)
//     → 当 e < 1,1 + e·cosθ > 0 恒成立 → 闭合曲线(椭圆)
//     → 当 e = 1,分母可 = 0 → 抛物线张开
//     → 当 e > 1,分母可 < 0 → 双曲线,1 + e·cosθ = 0 时 θ = arccos(-1/e)
//   半通径(通径之半):p = ed = 半焦弦(过焦点垂直主轴的弦长之半)
//
// 焦点-准线等价性(对偶):
//   椭圆两个焦点 F1, F2 + 两条准线 l1, l2(对应)
//   对椭圆上 P:PF1 = e × Pd1,  PF2 = e × Pd2
//   双曲线同理(取同支)
//
// 历史:
//   - Menaechmus ~350BC 最早发现圆锥曲线(用圆锥截得)
//   - Apollonius of Perga ~200BC 《Conics》8 卷集大成,引入 ellipse/parabola/hyperbola 命名
//     ellipse  来自 ἔλλειψις (elleipsis, 不足)  →  e < 1
//     parabola 来自 παραβολή (parabolē, 齐次)    →  e = 1
//     hyperbola 来自 ὑπερβολή (hyperbolē, 超出)  →  e > 1
//   - Pappus of Alexandria ~300AD 给出焦点-准线等价定义
//   - 1609 开普勒第一定律:行星轨道是椭圆,太阳在焦点
//   - 1715 哈雷用对数螺线 + 圆锥曲线拟合彗星轨道
//
// 应用:
//   - 天文:开普勒椭圆轨道 · 彗星抛物/双曲轨道(逃逸)
//   - 工程:抛物面天线 · 探照灯反光镜 · 太阳灶聚光
//   - 导航:双曲线 LORAN-C / Omega 系统(船到 2 固定点距离差恒定 → 双曲线)
//   - 建筑:埃菲尔铁塔底部双曲轮廓(抗风)

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
    <div class="mathw-lesson-title">数学 × 高中解析几何 · 圆锥曲线统一定义</div>
    <div class="mathw-lesson-content">
      <div class="mathw-lesson-headline">R = e·d · 一个公式串起三种曲线</div>
      <div class="mathw-lesson-formula">极坐标:r = ed / (1 + e·cosθ),  e &lt; 1 椭圆 / e = 1 抛物线 / e &gt; 1 双曲线</div>
      <div class="mathw-lesson-text">
        <strong>圆锥曲线统一定义</strong>(王炸):<strong>R = e·d</strong>,曲线上任一点 P 到焦点 F 的距离 = e × P 到准线 l 的距离。
        离心率 <strong>e</strong> 决定曲线类型:<br>
        ① <strong>e &lt; 1</strong>:椭圆(0=e 是圆的极限情形) — 闭合曲线。<br>
        ② <strong>e = 1</strong>:抛物线 — 张开到无穷远。<br>
        ③ <strong>e &gt; 1</strong>:双曲线 — 两条分支,中间断开。<br>
        <strong>极坐标方程</strong>:<strong>r = ed / (1 + e·cosθ)</strong>(焦点在原点,准线 x = −d)。<br>
        <strong>历史</strong>:Apollonius ~200BC《Conics》8 卷命名 ellipse/parabola/hyperbola(希腊语"不足/齐次/超出")。
        Pappus ~300AD 给出焦点-准线等价定义。1609 开普勒第一定律:行星椭圆轨道,太阳在焦点。<br>
        拖动 <strong>e</strong> 滑块看曲线在椭圆 ↔ 抛物线 ↔ 双曲线 间连续变化;切"三种对比"看 e=0.5/1/1.5 同焦点叠图。<br>
        <strong>应用</strong>:开普勒椭圆轨道 · 抛物面卫星天线 · 双曲线 LORAN-C 导航 · 探照灯反光镜。
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
    <div class="mathw-controls-title">参数 · 圆锥曲线</div>
    <div class="mathw-control-row">
      <span class="mathw-control-label">视图模式</span>
      <select data-mode>
        <option value="basic" selected>单曲线 · 拖 e 变类型</option>
        <option value="compare">三曲线叠对比 (e=0.5/1/1.5)</option>
        <option value="drag-d">拖焦点-准线距 d</option>
      </select>
    </div>
    <div class="mathw-control-row">
      <span class="mathw-control-label">离心率 e</span>
      <input type="range" min="0" max="2.5" step="0.05" value="0.7" data-e />
      <span class="mathw-control-value" data-e-v>0.70</span>
    </div>
    <div class="mathw-control-row">
      <span class="mathw-control-label">焦准距 d</span>
      <input type="range" min="40" max="200" step="5" value="120" data-d />
      <span class="mathw-control-value" data-d-v>120</span>
    </div>
    <div class="mathw-control-row">
      <span class="mathw-control-label">预设</span>
      <button data-pe05>e=0.5 椭圆</button>
      <button data-pe10>e=1.0 抛物线</button>
      <button data-pe15>e=1.5 双曲线</button>
    </div>
    <div class="mathw-control-row" style="font-size:11px;color:var(--mathw-muted)">
      提示:动点 P(高亮黄)始终满足 PF = e × Pd
    </div>
  `;
  host.appendChild(ctrls);

  // ---------- 状态 ----------
  let params = { mode: 'basic', e: 0.7, d: 120 };
  let tAnim = 0;     // 动点 P 沿曲线动画相位

  // ---------- 渲染 ----------
  const ctx = canvas.getContext('2d');

  // 极坐标 → 屏幕坐标(焦点在 cx,cy)
  function polarXY(cx, cy, e, d, theta) {
    // r = ed / (1 + e*cosθ)
    const denom = 1 + e * Math.cos(theta);
    if (Math.abs(denom) < 1e-6) return null;       // 渐近方向(双曲线)
    const r = (e * d) / denom;
    if (!isFinite(r)) return null;
    return { x: cx + r * Math.cos(theta), y: cy - r * Math.sin(theta) };  // canvas y 向下 → 减
  }

  // 画一条圆锥曲线
  function drawConic(cx, cy, e, d, color, lineW = 2, dashed = false) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineW;
    if (dashed) ctx.setLineDash([6, 4]);
    ctx.beginPath();
    let started = false;
    // θ 扫描:-π ~ π(避开 denom=0 双曲线渐近方向)
    const skipAngles = [];
    if (e > 1) {
      // 1 + e·cosθ = 0  →  cosθ = -1/e  →  θ = ± arccos(-1/e)
      const acosVal = Math.acos(-1 / e);
      skipAngles.push(acosVal, -acosVal);
    }
    for (let i = -180; i <= 180; i += 1) {
      const theta = (i * Math.PI) / 180;
      // 双曲线:跳过分母接近 0 的小邻域
      if (skipAngles.some(a => Math.abs(theta - a) < 0.04)) {
        started = false;
        continue;
      }
      const p = polarXY(cx, cy, e, d, theta);
      if (!p) { started = false; continue; }
      if (!started) { ctx.moveTo(p.x, p.y); started = true; }
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // 画焦点 + 准线 + 标注
  function drawFocusDirectrix(cx, cy, d, color) {
    ctx.save();
    // 准线 x = -d (屏幕坐标:cx - d)
    ctx.strokeStyle = color || '#3a86ff';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx - d, cy - 60);
    ctx.lineTo(cx - d, cy + 60);
    ctx.stroke();
    ctx.setLineDash([]);
    // 准线标签
    ctx.fillStyle = color || '#3a86ff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('准线 l', cx - d - 4, cy - 64);
    // 焦点
    ctx.fillStyle = '#ff3b30';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('焦点 F', cx + 8, cy - 6);
    ctx.restore();
  }

  // 画动点 P + PF + Pd
  function drawMovingPoint(cx, cy, e, d, theta) {
    const p = polarXY(cx, cy, e, d, theta);
    if (!p) return;
    const r = Math.hypot(p.x - cx, p.y - cy);
    const pd = Math.abs(p.x - (cx - d));   // 到准线垂直距离
    const rExpected = e * pd;
    const ok = Math.abs(r - rExpected) < 0.5;
    ctx.save();
    // PF 线
    ctx.strokeStyle = '#ff9f0a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    // P-准线垂直虚线
    ctx.strokeStyle = '#3a86ff';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(cx - d, p.y);
    ctx.stroke();
    ctx.setLineDash([]);
    // 动点 P(高亮)
    ctx.fillStyle = ok ? '#ffd60a' : '#ff453a';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fill();
    // 数值
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';
    const yOff = (p.y < cy) ? -12 : 18;
    ctx.fillText(`PF = ${r.toFixed(1)}`, p.x + 10, p.y + yOff);
    ctx.fillText(`e·Pd = ${rExpected.toFixed(1)}`, p.x + 10, p.y + yOff + 16);
    ctx.restore();
  }

  // 类型标签
  function typeLabel(e) {
    if (e < 0.999) return { text: '椭圆 (e<1)', color: '#34c759' };
    if (e > 1.001) return { text: '双曲线 (e>1)', color: '#ff453a' };
    return { text: '抛物线 (e=1)', color: '#ff9f0a' };
  }

  function draw(elapsed, dt) {
    const { w, h, dpr } = fitCanvas(canvas, host);
    const W = w, H = h;
    const cx = W / 2 + 60;       // 焦点偏右,给准线留位置
    const cy = H / 2;
    const { mode, e, d } = params;
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

    if (mode === 'basic') {
      // 单曲线
      const tl = typeLabel(e);
      drawConic(cx, cy, e, d, tl.color, 2.5);
      drawFocusDirectrix(cx, cy, d);
      drawMovingPoint(cx, cy, e, d, tAnim % (2 * Math.PI));
      // 类型标签
      ctx.fillStyle = tl.color;
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tl.text, cx, 30);
      ctx.fillStyle = '#aaa';
      ctx.font = '12px sans-serif';
      ctx.fillText(`e = ${e.toFixed(2)} · d = ${d} · ed = ${(e * d).toFixed(1)} (半通径 p)`, cx, 50);
    } else if (mode === 'compare') {
      // 三曲线叠图(同焦点,同 d)
      drawConic(cx, cy, 0.5, d, '#34c759', 2);   // 椭圆
      drawConic(cx, cy, 1.0, d, '#ff9f0a', 2);   // 抛物线
      drawConic(cx, cy, 1.5, d, '#ff453a', 2);   // 双曲线
      drawFocusDirectrix(cx, cy, d);
      // 动点:e=0.5 椭圆
      drawMovingPoint(cx, cy, 0.5, d, tAnim % (2 * Math.PI));
      // 图例
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#34c759'; ctx.fillText('● e=0.5 椭圆', 16, 30);
      ctx.fillStyle = '#ff9f0a'; ctx.fillText('● e=1.0 抛物线', 16, 48);
      ctx.fillStyle = '#ff453a'; ctx.fillText('● e=1.5 双曲线', 16, 66);
      ctx.fillStyle = '#aaa';
      ctx.fillText('同焦点 F + 同准线 l:验证 R = ed 决定曲线类型', 16, 88);
    } else {
      // drag-d 模式:固定 e, 拖 d 看 R = ed 同比缩放
      const tl = typeLabel(e);
      drawConic(cx, cy, e, d, tl.color, 2.5);
      drawFocusDirectrix(cx, cy, d);
      drawMovingPoint(cx, cy, e, d, tAnim % (2 * Math.PI));
      ctx.fillStyle = tl.color;
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tl.text, cx, 30);
      ctx.fillStyle = '#aaa';
      ctx.font = '12px sans-serif';
      ctx.fillText(`固定 e = ${e.toFixed(2)},拖 d 看曲线整体缩放(比例 R/d = e 不变)`, cx, 50);
    }
    ctx.restore();
  }

  // ---------- 控件事件 ----------
  ctrls.querySelector('[data-mode]').addEventListener('change', e => {
    params.mode = e.target.value;
  });
  ctrls.querySelector('[data-e]').addEventListener('input', e => {
    params.e = parseFloat(e.target.value);
    ctrls.querySelector('[data-e-v]').textContent = params.e.toFixed(2);
  });
  ctrls.querySelector('[data-d]').addEventListener('input', e => {
    params.d = parseFloat(e.target.value);
    ctrls.querySelector('[data-d-v]').textContent = params.d;
  });
  ctrls.querySelector('[data-pe05]').addEventListener('click', () => {
    params.e = 0.5;
    ctrls.querySelector('[data-e]').value = '0.5';
    ctrls.querySelector('[data-e-v]').textContent = '0.50';
  });
  ctrls.querySelector('[data-pe10]').addEventListener('click', () => {
    params.e = 1.0;
    ctrls.querySelector('[data-e]').value = '1';
    ctrls.querySelector('[data-e-v]').textContent = '1.00';
  });
  ctrls.querySelector('[data-pe15]').addEventListener('click', () => {
    params.e = 1.5;
    ctrls.querySelector('[data-e]').value = '1.5';
    ctrls.querySelector('[data-e-v]').textContent = '1.50';
  });

  const loop = makeLoop(draw);
  loop.start();

  return {
    sceneId: 'conic-unified',
    getFormula() { return 'R = ed, 极坐标 r = ed/(1 + e·cosθ), e<1 椭圆/e=1 抛物线/e>1 双曲线'; },
    getLesson() {
      return [
        '核心:圆锥曲线统一定义 R = e·d — 任一点 P 到焦点 F 的距离 = e × P 到准线 l 的距离',
        '离心率 e 决定曲线类型:0≤e<1 椭圆 · e=1 抛物线 · e>1 双曲线',
        '极坐标方程(焦点在原点,准线 x = -d):r = ed/(1 + e·cosθ)',
        '半通径(过焦点垂直主轴的弦长之半)p = ed',
        '历史:Apollonius of Perga ~200BC《Conics》8 卷命名 ellipse/parabola/hyperbola(希腊语"不足/齐次/超出");Pappus ~300AD 给出焦点-准线等价定义',
        '应用:开普勒椭圆轨道(1609) · 抛物面卫星天线 · 双曲线 LORAN-C 导航 · 探照灯反光镜 · 太阳灶聚光',
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
