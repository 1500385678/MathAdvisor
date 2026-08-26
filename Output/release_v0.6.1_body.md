## MathematicsWeb v0.6.1

**真正接入 M3** · Python 后端代理 · key 不暴露到浏览器

### 架构改

之前浏览器直连 api.minimaxi.com → key 暴露在浏览器/前端文件里,危险。

v0.6.1 改:
- 新增 `server.py`(Python 一体化服务器)
- 浏览器调本地 `http://localhost:8765/api/chat`
- 后端 `server.py` 持有 M3 key,转发到 `api.minimaxi.com`
- 优先用 `M3_API_KEY` 环境变量(推荐,安全)
- 次选 `_llm_config.json`(本地文件,gitignore)
- 没 key 时 server 返回 mock 风格回复(app 仍能用,断网能跑不破)

### 启动

```powershell
# Windows PowerShell
$env:M3_API_KEY = "sk-cp-..."          # 配 M3 key
.\start.ps1                            # 起 http://localhost:8765
```

```bash
# macOS/Linux
export M3_API_KEY="sk-cp-..."
./start.ps1
```

或直接:
```bash
python server.py                       # 不依赖 start 脚本
```

### API

| 端点 | 方法 | 作用 |
|---|---|---|
| `/` | GET | 静态首页 |
| `/api/health` | GET | `{ok, m3_enabled, m3_model, m3_has_key, version}` |
| `/api/chat` | POST | `{prompt, system, scene_context, temperature, max_tokens}` → `{text, formula, source: 'm3'\|'mock'}` |

### 端到端验证

- `GET /api/health` → 200,m3 状态
- `POST /api/chat`(无 key)→ mock 风格回复 + 智能公式
- `POST /api/chat`(有 key)→ 直调 api.minimaxi.com + 自动剥 ```formula``` 块
- Chrome headless 20 场景 0 错误

### 仓库
- GitHub: https://github.com/1500385678/MathematicsWeb
- Gitee: https://gitee.com/architectzy/MathematicsWeb
