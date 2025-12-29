---
id: supergateway
title: Supergateway - A One-liner MCP Server Proxy for stdio.
description: >
  Model Context Protocol 是一個開放的協議，旨在標準化 AI
  應用程式與上下文資源之間的通訊。問題在於：許多 MCP 伺服器只提供 stdio
  設定，而某些客戶端（如 n8n）僅支援基於 HTTP
  的傳輸方式。即使伺服器支援多種傳輸方式，它們的設定流程也各不相同。
aliases: []
tags: []
created: 2025-12-29
updated: 2025-12-29
published: true
---

Model Context Protocol ([MCP][mcp]) 是一個開放的協議，旨在標準化 AI 應用程式與上
下文資源之間的通訊。

MCP 定義了三種不同的 API：stdio, StreamableHTTP, SSE (Server-Sent Events, 已棄用
)。

通常而言，stdio 方式通過提供一行 One-liner `npx`/`uvx` 指令從網路拉取代碼執行，
而 StreamableHTTP 在設定伺服器後通過 `/mcp` endpoint 提供服務。( 舊版則使用
`/sse`。)

然而，許多 MCP Server 是針對市面上常見的 AI Agent 工具使用的。它們中的一些只提供
了一行 json 文件，例如官方的[`@modelcontextprotocol/filesystem`][filesystem]

```json title="mcp.json"
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${workspaceFolder}"
      ]
    }
  }
}
```

stdio 形式用於本地開發固然十分方便。然而，有些時候，我們希望 MCP Server 可以與我
們的應用（Client) 在不同機器上（如 Docker 容器部署），或者一些 Client 只支援其中
一部分的形式（如 n8n 不支持 stdio）。

有一些則提供了 StreamableHTTP/SSE 中的一種或多種，但是它們的 setup 各不相同。有
沒有一種簡便的辦法可以統一呢？

## 面臨的挑戰

MCP 伺服器通常支援不同的傳輸方式：

- **stdio**: 透過一行程式碼在本地執行（例如
  ：`npx -y @modelcontextprotocol/server-filesystem`）
- **StreamableHTTP**: 透過 HTTP 端點遠端存取（例如
  ：`http://localhost:8080/mcp`）
- **SSE**: Server-Sent Events（已棄用）

問題在於：許多 MCP 伺服器只提供 stdio 設定，而某些客戶端（如 n8n）僅支援基於
HTTP 的傳輸方式。即使伺服器支援多種傳輸方式，它們的設定流程也各不相同。

## 介紹 Supergateway

Supergateway 提供了一個簡單的方法來轉換這三種傳輸方式。它作為一個代理，將基於
stdio 的 MCP 伺服器轉換為可透過 HTTP 遠端存取的 StreamableHTTP 伺服器。

## 快速開始

這一段命令，可以將 `@modelcontextprotocol/filesystem` 轉換為 StreamableHTTP 伺服
器：

```bash
npx -y supergateway                                                 \
    --stdio             "npx -y @modelcontextprotocol/filesystem"   \
    --outputTransport   streamableHTTP                              \
    --stateful                                                      \
    --port              8080
```

或者作為 One-liner：

```bash
npx -y supergateway --stdio "npx -y @modelcontextprotocol/filesystem" --outputTransport streamableHTTP --stateful --port 8080
```

連接 `http://localhost:8080/mcp` 來存取我們剛才的 MCP Server。

## 更多用途

另一個常見的使用情景是將來自 remote 的 MCP Server 轉換為一個 npx one-liner 供本
地 agent 使用。雖然許多 agent 都支援通過 StreamableHTTP / SSE 存取 MCP 伺服器，
但把它們轉換為 stdio one-liner 可以提升一致性，並容許不支持上述模式的 agent 運行
我們的設定檔案。

```json title="mcp.json"
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "supergateway",
        "--sse",
        "http://link-to-remote-mcp-server/sse"
      ]
    }
  }
}
```

> [!quote]- 碎碎念
>
> I hate having to use JSON for configuration files. Curse nesting `}` and
> escaping every `"` and `\n` I need. Why can't we just use YAML or TOML?
>
> At least with this approach, I avoid figuring out how to configure a remote
> server or determine the required nesting levels by just copying the last
> section.

[官方 Repo](https://github.com/supercorp-ai/supergateway) 還有更多範例和選項的詳
細說明。

## Docker Compose 整合

為了讓部署更簡單，我們可以將 Supergateway 包裝在 Docker Compose 設定中。這對於檔
案系統存取特別有用 —— 我們可以控制要掛載哪些目錄，而不需要 LLM 記住長路徑。

```yaml title="compose.yml"
services:
  filesystem:
    image: supercorp/supergateway
    restart: unless-stopped
    ports:
      - "80"
    volumes:
      - ./projects:/projects
    command:
      --stdio "npx -y @modelcontextprotocol/filesystem" --outputTransport
      streamableHttp --stateful --port 80
```

Docker Compose 會自動建立 bridge 網路，因此同一個 compose 檔案中的其他服務可以透
過 `http://filesystem/mcp` 存取檔案系統服務（由於 HTTP 端口預設為 `:80` ，我們可
以省略）。

## 完整範例：n8n + filesystem MCP

這是一個完整的 compose.yml，它設定了 n8n 和 `filesystem` MCP Server.

```yaml title="compose.yml"
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - GENERIC_TIMEZONE=America/New_York
      - TZ=America/New_York
      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
      - N8N_RUNNERS_ENABLED=true
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_SCHEMA=public
      - DB_POSTGRESDB_PASSWORD=n8n
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres
    networks:
      - n8n_network

  postgres:
    image: postgres:13
    container_name: n8n_postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=n8n
      - POSTGRES_DB=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - n8n_network

  filesystem:
    image: supercorp/supergateway
    restart: unless-stopped
    ports:
      - "80"
    volumes:
      - ./projects:/projects
    command: >
      --stdio "npx -y @modelcontextprotocol/server-filesystem /projects"
      --outputTransport streamableHttp --stateful --port 80
    networks:
      - n8n_network

volumes:
  n8n_data:
  postgres_data:

networks:
  n8n_network:
    driver: bridge
```

要將 n8n 連接到檔案系統 MCP 伺服器，只需在 n8n MCP Server Node 設定中使用
`http://filesystem/mcp`。

## 總結

Supergateway 解決了 MCP 傳輸相容性問題，提供了一種簡單的一行程式碼方式，將基於
stdio 的伺服器轉換為可透過 HTTP 存取的服務。這使得：

- MCP 伺服器的遠端部署（例如：Docker 容器）
- 與僅支援 HTTP 傳輸的客戶端整合
- 跨不同 MCP 伺服器的一致設定
- 透過 Docker Compose 輕鬆設定

[mcp]: https://modelcontextprotocol.io
[filesystem]:
  https://github.com/modelcontextprotocol/servers/tree/dcb47d2d94a3a33340053d2df550ae68d2795a3f/src/filesystem#usage-with-vs-code
