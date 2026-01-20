---
title: nixdots
description: My Nix-based dotfiles configuration using home-manager.
techStack:
  - Nix
  - Home Manager
  - Nix Flakes
  - Shell
  - TypeScript
category: geek
github: https://github.com/inogai/nixdots
featured: false
status: maintained
order: 1
---

My personal dotfiles for MacOS, managed with Nix and Home Manager for
reproducible system configuration.

## Features

- **Nix Flakes**: Modern, reproducible package management
- **Home Manager**: Declarative user configuration
- **Modular Structure**: Organized modules for easy management
- **Cross-platform**: Works across different machines with consistent setup

## Tech Stack

- **System**: NixOS with Nix Flakes
- **User Config**: Home Manager for dotfile management
- **Languages**: Nix, Shell, TypeScript
- **Structure**: Modular configuration with lib and modules directories

## Structure

```
nixdots/
├── lib/           # Utility functions and libraries
├── modules/        # Configuration modules
├── flake.nix      # Nix flake entry point
├── flake.lock     # Lock file for reproducibility
└── home.nix       # Home Manager configuration
```
