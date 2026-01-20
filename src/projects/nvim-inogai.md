---
title: nvim-inogai
description: A personal neovim config based on nixCats. Available as a flake.
techStack:
  - Lua
  - Neovim
  - Nix
category: geek
github: https://github.com/inogai/nvim-inogai
featured: true
status: maintained
order: 1
---

My daily-driver Neovim configuration, built with Nix flakes using nixCats for reproducible plugin management.

## Features

- **Nix-based**: Fully reproducible configuration using Nix flakes
- **nixCats**: Uses nixCats for elegant plugin management
- **LSP**: Full language server support with completion
- **Treesitter**: Syntax highlighting and code navigation
- **Custom keybindings**: Ergonomic mappings for efficient editing

## Installation

```bash
# Run directly with nix
nix run github:inogai/nvim-inogai

# Or add to your flake inputs
{
  inputs.nvim-inogai.url = "github:inogai/nvim-inogai";
}
```
