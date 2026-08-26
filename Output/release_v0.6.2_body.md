## MathematicsWeb v0.6.2

**行星轨道改为太阳系版** · Sun + 6 行星 + 月球绕地球 + 土星环

### 改动

场景 `viewer/scenes/02_planetary-orbits.js` 从 4 颗通用椭圆,改为真实太阳系:

- **Sun**:中心,固定,带光晕
- **6 颗行星**(真实名称+相对压缩轨道):
  - 水星 a=1.5 T=1.0 e=0.21
  - 金星 a=2.0 T=1.9 e=0.01
  - 地球 a=2.7 T=3.0 e=0.02
  - 火星 a=3.5 T=4.8 e=0.09
  - 木星 a=5.5 T=14  e=0.05
  - 土星 a=7.5 T=25  e=0.06 + **星环**
- **月球**:绕地球转(相对地球 a=0.4,周期 0.10,真实 ≈ 27 天)
- **800 颗星空背景**
- 每颗带 Sprite 中文名字标签
- 8 颗各自轨迹拖尾

### 物理(简化开普勒)

- 椭圆位置:`r = a(1-e²) / (1 + e·cosθ)`
- 周期关系:`T² ∝ a³`(每颗 T 由 a 算出)
- 月球是相对坐标:`earthPos + moonOrbit`
- 视化压缩:Mercury 1.5, Saturn 7.5(否则画不下)

### 交互

- 时间倍率 0.1x-5x(看外圈行星跑得慢 — 开普勒第三定律直观体验)
- 暂停/重置
- **新增 聚焦地球 按钮**(相机平滑切到地球附近看月球)

### 验证

- Chrome headless 20/20 场景 0 错误
- 行星位置 + 月球轨迹 + 拖尾全部按真实公式计算
- 双平台同步(GitHub + Gitee)

### 仓库
- GitHub: https://github.com/1500385678/MathematicsWeb
- Gitee: https://gitee.com/architectzy/MathematicsWeb
