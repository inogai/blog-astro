---
id: cli-tools
title: 有趣的命令行工具
description: 一個關於有趣命令行工具的列表。持續更新。
aliases: []
tags: []
created: 2025-12-19
updated: 2025-12-29
published: true
---

> [!quote]- Changelog
>
> 2525-12-29: Added supergateway to LLM Tools section.

## LLM Tools

### supergateway

See: [[251229-supergateway]]

## Trash

### trash-cli

[Github Repo](https://github.com/andreafrancia/trash-cli)

Written in Python, `trash` provides a CLI interface to the FreeDesktop.org
Trashcan.

```bash
trash <file1> <file2> ...
```

The trashed files are moved to `~/.local/share/Trash/files/` by default.

> [!tip]- To MacOS Users
>
> On MacOS, the system Trash folder is `~/.Trash`, but `trash-cli` still uses
> `~/.local/share/Trash`.
>
> You don't want to use `~/.Trash` directly, because reading the system trash is
> forbidden, and Finder intepret trash entries in a different way.

### Trash as a Shell Function

If you do not need the full features of `trash-cli`, or you want to be MacOS
native, you can define a simple function to move files to your Trash folder.

```bash
trash() {
    mv "$@" ~/.Trash # Or any other trash location
}
```
