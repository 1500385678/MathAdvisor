// viewer/scenes/31_triangle-congruence.js
// MathematicsWeb v0.6.36 — 三角形全等判定(人教版 7 年级 · MATH-016 第 1 弹)
// 2D Canvas:画 2 个三角形 ΔABC 和 ΔA'B'C',按 5 种判定法分别高亮对应边/角,
// 验证对应元素相等 ⇒ 两三角形全等 (ΔABC ≅ ΔA'B'C')
//
// 判定法:
//   SSS 三边对应相等
//   SAS 两边及其夹角对应相等
//   ASA 两角及其夹边对应相等
//   AAS 两角及其中一角的对边对应相等
//   HL  斜边与一直角边对应相等(只限直角三角形)
//
// 应用:建筑工程结构校验 · 测绘定位 · 装配尺寸链

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
    <div class="mathw-lesson-title">数学 · 三角形全等判定</div>
    <div class="mathw-lesson-content">
      <div class="mathw-lesson-headline">ΔABC ≅ ΔA'B'C' · 5 种判定法</div>
      <div class="mathw-lesson-formula">SSS | SAS | ASA | AAS | HL(直角)</div>
      <div class="mathw-lesson-text">
        两个三角形若有 <strong>3 组对应元素相等</strong>(且判定法有效),则它们<strong>全等</strong>。
        切记 <span style="color:#f87171">SSA / ASS</span> 不是判定法(歧义情形)。
        切换按钮看每种判定法高亮哪 3 组元素。
      </div>
    </div>
  `;
  host.appendChild(lesson);
  lesson.querySelector('[data-toggle]').addEventListener('click', () => {
    lesson.classList.toggle('collapsed');
    lesson.querySelector('[data-toggle]').textContent = lesson.classList.contains('collapsed') ? '+' : '−';
  });

  const ctrls = document.createElement('div');
  ctrls.innerHTML = `
    <div class="mathw-controls-title">判定法 · 5 选 1</div>
    <div class="mathw-control-row">
      <button data-method="SSS" style="flex:1;margin:2px;padding:6px;font-size:12px">SSS</button>
      <button data-method="SAS" style="flex:1;margin:2px;padding:6px;font-size:12px">SAS</button>
      <button data-method="ASA" style="flex:1;margin:2px;padding:6px;font-size:12px">ASA</button>
      <button data-method="AAS" style="flex:1;margin:2px;padding:6px;font-size:12px">AAS</button>
      <button data-method="HL"  style="flex:1;margin:2px;padding:6px;font-size:12px">HL</button>
    </div>
    <div class="mathw-control-row" style="font-size:11px;color:var(--mathw-muted)">
      当前: <span data-cur-method style="color:#fbbf24">SSS</span>
    </div>
    <div class="mathw-control-row" data-explainer style="font-size:11px;color:#a3a3a3;line-height:1.5"></div>
  `;
  ctrls.className = 'mathw-controls';
  host.appendChild(ctrls);

  // ---------- 状态 ----------
  let method = 'SSS';

  // 两个固定三角形(画在画布左右半边),元素值设计成"全等"以便高亮对比
  // ΔABC (左):边 AB=3, BC=4, CA=5(默认 3-4-5 直角);A=(0,0) B=(3,0) C=(3,4)
  // ΔA'B'C' (右):旋转 + 平移,保证 A'B'=3, B'C'=4, C'A'=5
  const tri1 = {
    name: 'ABC',
    pts: [{ x: 0, y: 0, label: 'A' }, { x: 3, y: 0, label: 'B' }, { x: 3, y: 4, label: 'C' }],
  };
  // 右侧三角形:绕中心旋转 30° 再平移
  const tri2Base = [{ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 3, y: 4 }];
  const ang = Math.PI / 6;  // 30°
  const tri2 = {
    name: "A'B'C'",
    pts: tri2Base.map(p => ({
      x: p.x * Math.cos(ang) - p.y * Math.sin(ang),
      y: p.x * Math.sin(ang) + p.y * Math.cos(ang),
      label: '',
    })),
  };
  // 补 label
  tri2.pts[0].label = "A'";
  tri2.pts[1].label = "B'";
  tri2.pts[2].label = "C'";

  // 边长与角:全等的两三角形,边相等、角相等
  const sides1 = [
    { from: 0, to: 1, name: 'AB', length: 3 },
    { from: 1, to: 2, name: 'BC', length: 4 },
    { from: 2, to: 0, name: 'CA', length: 5 },
  ];
  const sides2 = [
    { from: 0, to: 1, name: "A'B'", length: 3 },
    { from: 1, to: 2, name: "B'C'", length: 4 },
    { from: 2, to: 0, name: "C'A'", length: 5 },
  ];
  // 角:对位角 A↔A', B↔B', C↔C'(顶点索引 0,1,2)
  // A = 36.87°(arctan(3/4)), B = 53.13°(arctan(4/3)), C = 90°
  const angDeg = [Math.atan2(4, 3) * 180 / Math.PI, Math.atan2(3, 4) * 180 / Math.PI, 90];

  // 各判定法对应"哪 3 组元素"
  // 注:角用顶点索引;边用 sides 数组的索引
  const METHODS = {
    SSS: {
      sides: [0, 1, 2],  // AB, BC, CA(全 3 边)
      angles: [],        // 不用角
      desc: '三边对应相等(SSS) — 最基本的判定,无需角信息。',
    },
    SAS: {
      sides: [0, 1],      // AB, BC(夹角 B 的两边)
      angles: [1],        // ∠B(夹角)
      desc: '两边及其夹角对应相等(SAS) — 角必须在两边的中间。',
    },
    ASA: {
      sides: [1],         // BC(两角夹的边)
      angles: [0, 2],     // ∠A, ∠C(夹边)
      desc: '两角及其夹边对应相等(ASA) — 边必须在两角的中间。',
    },
    AAS: {
      sides: [1],         // BC(任一已知角的对边)
      angles: [0, 2],     // ∠A, ∠C
      desc: '两角及其中一角的对边对应相等(AAS) — 边只需对着任一角。',
    },
    HL:  {
      sides: [1, 2],      // 斜边 CA + 直角边 BC
      angles: [2],        // ∠C = 90°
      desc: '斜边 + 一直角边(HL) — 仅限直角三角形(这里 C=90°)。',
    },
  };

  // ---------- 渲染 ----------
  const ctx = canvas.getContext('2d');

  function drawSegment(p1, p2, color, lw) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  function draw(elapsed, dt) {
    const { w, h, dpr } = fitCanvas(canvas, host);
    const W = w, H = h;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#0e1116';
    ctx.fillRect(0, 0, W, H);

    // 两个三角形的"画布坐标":先 scale + 平移到画布内
    const scale = Math.min(W, H) * 0.13;  // 边 3~5 在画布占 39~65px
    const cx1 = W * 0.28, cy1 = H * 0.58;
    const cx2 = W * 0.72, cy2 = H * 0.58;
    const t1 = tri1.pts.map(p => ({ x: cx1 + p.x * scale, y: cy1 - p.y * scale, label: p.label }));
    const t2 = tri2.pts.map(p => ({ x: cx2 + p.x * scale, y: cy2 - p.y * scale, label: p.label }));

    // 网格底纹(浅)
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
    }
    for (let j = 0; j < H; j += 40) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke();
    }

    const cur = METHODS[method];

    // ---- 三角形 1(左)----
    // 默认画所有边(暗灰)
    sides1.forEach((s, i) => {
      const hi = cur.sides.includes(i);
      drawSegment(t1[s.from], t1[s.to], hi ? '#fbbf24' : '#4ea1ff', hi ? 4 : 2);
    });
    // 角弧:用顶角处的弧
    for (let v = 0; v < 3; v++) {
      const prev = t1[(v + 2) % 3], cur_ = t1[v], next = t1[(v + 1) % 3];
      const a1 = Math.atan2(prev.y - cur_.y, prev.x - cur_.x);
      const a2 = Math.atan2(next.y - cur_.y, next.x - cur_.x);
      const hi = cur.angles.includes(v);
      ctx.strokeStyle = hi ? '#f59e0b' : '#94a3b8';
      ctx.lineWidth = hi ? 3 : 1.5;
      ctx.beginPath();
      // 取顺时针方向的较小弧
      let aS = a1, aE = a2;
      while (aE < aS) aE += Math.PI * 2;
      if (aE - aS > Math.PI) { aS = a2; aE = a1; while (aE < aS) aE += Math.PI * 2; }
      ctx.arc(cur_.x, cur_.y, 22, aS, aE);
      ctx.stroke();
      // 顶点标签
      ctx.fillStyle = '#e6e8ec';
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t1[v].label, cur_.x - 14, cur_.y - 12);
    }
    // 边长标签
    sides1.forEach((s, i) => {
      const mx = (t1[s.from].x + t1[s.to].x) / 2;
      const my = (t1[s.from].y + t1[s.to].y) / 2;
      const hi = cur.sides.includes(i);
      ctx.fillStyle = hi ? '#fbbf24' : '#a3a3a3';
      ctx.font = hi ? 'bold 13px -apple-system, sans-serif' : '12px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${s.name}=${s.length}`, mx, my - 6);
    });

    // ---- 三角形 2(右)----
    sides2.forEach((s, i) => {
      const hi = cur.sides.includes(i);
      drawSegment(t2[s.from], t2[s.to], hi ? '#fbbf24' : '#34d399', hi ? 4 : 2);
    });
    for (let v = 0; v < 3; v++) {
      const prev = t2[(v + 2) % 3], cur_ = t2[v], next = t2[(v + 1) % 3];
      const a1 = Math.atan2(prev.y - cur_.y, prev.x - cur_.x);
      const a2 = Math.atan2(next.y - cur_.y, next.x - cur_.x);
      const hi = cur.angles.includes(v);
      ctx.strokeStyle = hi ? '#f59e0b' : '#94a3b8';
      ctx.lineWidth = hi ? 3 : 1.5;
      ctx.beginPath();
      let aS = a1, aE = a2;
      while (aE < aS) aE += Math.PI * 2;
      if (aE - aS > Math.PI) { aS = a2; aE = a1; while (aE < aS) aE += Math.PI * 2; }
      ctx.arc(cur_.x, cur_.y, 22, aS, aE);
      ctx.stroke();
      ctx.fillStyle = '#e6e8ec';
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t2[v].label, cur_.x + 14, cur_.y - 12);
    }
    sides2.forEach((s, i) => {
      const mx = (t2[s.from].x + t2[s.to].x) / 2;
      const my = (t2[s.from].y + t2[s.to].y) / 2;
      const hi = cur.sides.includes(i);
      ctx.fillStyle = hi ? '#fbbf24' : '#a3a3a3';
      ctx.font = hi ? 'bold 13px -apple-system, sans-serif' : '12px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${s.name}=${s.length}`, mx, my - 6);
    });

    // 顶角度数(只在 highlight 时显示)
    cur.angles.forEach(v => {
      [t1, t2].forEach((tri, idx) => {
        const p = tri[v];
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 13px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${angDeg[v].toFixed(1)}°`, p.x, p.y + 30);
      });
    });

    // 标题
    ctx.fillStyle = '#e6e8ec';
    ctx.font = 'bold 16px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`三角形全等判定 · ${method}`, W / 2, 28);
    ctx.font = '12px -apple-system, sans-serif';
    ctx.fillStyle = '#a3a3a3';
    ctx.fillText(`ΔABC ≅ ΔA'B'C' · 高亮 = 判定法所需对应元素`, W / 2, 48);

    // 全等勾
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('≅', W / 2, H * 0.45);

    ctx.restore();
  }

  const loop = makeLoop(draw, { maxFps: 30 });

  // ---------- 交互 ----------
  const _cur = ctrls.querySelector('[data-cur-method]');
  const _exp = ctrls.querySelector('[data-explainer]');
  function setMethod(m) {
    method = m;
    _cur.textContent = m;
    _exp.textContent = METHODS[m].desc;
    // 按钮高亮
    ctrls.querySelectorAll('button[data-method]').forEach(b => {
      b.style.background = b.dataset.method === m ? '#fbbf24' : '';
      b.style.color = b.dataset.method === m ? '#0e1116' : '';
    });
  }
  ctrls.querySelectorAll('button[data-method]').forEach(b => {
    b.addEventListener('click', () => setMethod(b.dataset.method));
  });
  setMethod('SSS');

  return {
    sceneId: 'triangle-congruence',
    getFormula() {
      return METHODS[method].desc;
    },
    getLesson() {
      const c = lesson.querySelector('.mathw-lesson-content');
      return c ? c.textContent.replace(/\s+/g, ' ').trim() : '';
    },
    getState() { return { method }; },
    setState(s) {
      if (s && METHODS[s.method]) setMethod(s.method);
    },
    destroy() {
      loop.stop();
      wrap.remove();
      lesson.remove();
      ctrls.remove();
    },
  };
}
