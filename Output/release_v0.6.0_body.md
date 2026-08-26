## MathematicsWeb v0.6.0

20 场景(新增 10 个跨学科) · 总代码量 ~6500 行

### 新增场景(11-20)

| # | 场景 | 学科 | 公式 |
|---|---|---|---|
| 11 | Lissajous 曲线 | 数学×音乐 | x=A·sin(at+δ), y=B·sin(bt) |
| 12 | 中心极限定理 | 数学×概率 | (X₁+...+Xₙ)/n → N(μ, σ²/n) |
| 13 | 黎曼和 | 数学×工程 | ∫f(x)dx ≈ Σf(xᵢ)·Δx |
| 14 | 贝叶斯推断 | 数学×概率 | P(θ\|data) ∝ P(θ)·P(data\|θ) |
| 15 | L-系统植物 | 数学×生物 | axiom + 产生式 → turtle |
| 16 | 波叠加/干涉 | 数学×物理 | P = ΣAᵢ·cos(k·rᵢ−ωt) |
| 17 | 朱利亚集 | 数学×艺术 | z = z² + c (c 固定) |
| 18 | 拉格朗日乘子 | 数学×优化 | ∇f = λ·∇g 切点 |
| 19 | 电场可视化 | 数学×物理 | V = Σqᵢ/rᵢ, E = −∇V |
| 20 | 神经网络 2D 分类 | 数学×机器学习 | y = softmax(W₂·tanh(W₁x+b₁)+b₂) |

### 验证
- Chrome headless 20/20 场景 0 错误
- 双平台同步(GitHub + Gitee)

### 跑起来
`./start.ps1` 或 `python -m http.server 8765`

### 仓库
GitHub: https://github.com/1500385678/MathematicsWeb
Gitee: https://gitee.com/architectzy/MathematicsWeb
