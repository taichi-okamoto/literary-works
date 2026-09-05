# 文学作品サイト 初期版仕様

## 目的

既存のエンジニア向けポートフォリオから分離し、文学活動全体の入口となる静的サイトを提供する。

## 技術構成

- Astro
- GitHub Pages project site
- GitHub Actionsによる自動デプロイ
- `site`: `https://taichi-okamoto.github.io`
- `base`: `/literary-works`
- trailing slashあり

## ページ

- `/`: 公開トップ
- `/reader/8seconds-k7m4q2/`: 購入者向け作品入口
- `/reader/8seconds-k7m4q2/read/`: Web版本文
- `/go/8seconds/`: 冊子QR用の安定した中継URL

reader系と中継ページは `noindex, nofollow` とし、公開トップ、sitemap、robots.txtから秘密URLを露出しない。

## デザイン

「シンプルで静か」を最上位方針とする。公開トップと作品入口は黒から濃紺、本文は生成りの明るい背景を使う。明朝体、広めの余白、控えめな罫線を中心に構成し、カジノ的な配色・装飾は使用しない。

## 完了条件

- production build成功
- PC・スマホ表示が正常
- 主要ページと内部リンクが正常
- reader系のnoindexを確認
- QR中継先を確認
- GitHub PagesでHTTPS公開
