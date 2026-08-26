## MathematicsWeb v0.5.0

**v0.5 重大升级** · 收藏 / 进度 / 参数持久化 · 双摆相空间 · Momentum + Adam

### 新增

#### UI & 持久化
- ⭐ **场景收藏**:点星星收藏,左侧过滤只看收藏
- ✓ **访问进度**:自动记录已访问,顶部状态栏 `进度 X/10`
- 💾 **场景参数持久化**:每个场景的 getState/setState 写 IndexedDB,刷新不丢调好的参数
- 📂 **最后访问恢复**:刷新自动跳回上次看的场景
- 🔍 **过滤器**:全部 / 收藏 / 未访问 3 种

#### 场景优化
- 🌀 **双摆混沌**:加相空间图 (θ₁ vs ω₁) 展示混沌的分形-like 填充
- ⛰️ **梯度下降**:支持 **朴素 GD / Momentum / Adam** 三种优化器切换,直观对比收敛行为

#### AI 面板
- ⚡ **测 LLM 连通按钮**:一键 ping LLM,显示延迟和连通状态

### 验证

- ✅ Chrome headless 10/10 场景 0 错误
- ✅ IndexedDB 持久化所有用户数据
- ✅ 双平台同步(GitHub + Gitee)

### 跑起来

```
.\start.ps1
# 或 python -m http.server 8765
```

### GitHub

https://github.com/1500385678/MathematicsWeb
