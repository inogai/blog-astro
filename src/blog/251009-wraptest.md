---
id: wraptest
title: 換行測試
description:
  這是一個測試頁面，用於檢查部落格的 remark plugin 能否正確處理 CJK 文字的換行。
aliases: []
tags: []
created: 2025-10-09
updated: 2025-10-12
published: true
---

<!-- prettier-ignore-start -->

## Test Two CJK Char

It should display `我我` in the same line, without any extra space.

我我

## Test CJK Char + Punctuation

It should display `。我。` in the same line, without any extra space.

。我。

## Test CJK Char + Quotes

It should display `“ 我 ”` and `‘ 我 ’` in the same line, with spaces included.

This is because we cannot determine whether the quotes are CJK style or English
style.

“ 我 ” ‘ 我 ’

## Test CJK Char + English

It should display `a 我 a` in the same line, with spaces included.

This is a.k.a.「盤古之白」

a 我 a

## Test English Punctuation + CJK Char

It should display `, 我 ,` in the same line, with spaces included.

, 我 ,
