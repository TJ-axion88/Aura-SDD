[English](README.md) | **日本語**

# Aura-SDD v3.0

**AIコーディングエージェント向け Spec-Driven Development フレームワーク**

Aura-SDD は `npx aura-sdd@latest` 一発で、**22のスキル・12のエージェント対応・Constitutional Enforcement・ワークフロー自動化**を、あなたのプロジェクトにインストールします。Claude Code・Cursor・GitHub Copilot・Codex・Windsurf・Gemini・OpenCode・Cline・Roo Code・Devin など主要 AI エージェントすべてに対応。

---

## クイックスタート

```bash
# Claude Code（デフォルト、日本語）
npx aura-sdd@latest --lang ja

# Cursor IDE
npx aura-sdd@latest --cursor --lang ja

# Cline
npx aura-sdd@latest --cline --lang ja

# Amazon Kiro（既存の .kiro/specs/ と共存可能）
npx aura-sdd@latest --kiro --lang ja

# 書き込まずプレビューのみ
npx aura-sdd@latest --dry-run --lang ja

# Lean プロファイル（Discovery/Planning フェーズなし）
npx aura-sdd@latest --profile lean --lang ja
```

---

## インストールされるもの

```
.claude/skills/          ← 22のAIスキル（Claude Code の場合）
CLAUDE.md                ← クイックスタートガイド
.aura/
  settings/rules/        ← 10のAI生成ルール
  settings/templates/    ← ドキュメントテンプレート
  workflows/definitions/ ← 3つのビルトインワークフロー
  presets/               ← lean プリセット（すぐに適用可能）
```

---

## スキル一覧（22種）

### Discovery & Steering
| スキル | 用途 |
|--------|------|
| `/aura-discovery` | 新しい作業の起点 — アイデアを適切なルートへ振り分け |
| `/aura-constitution` | プロジェクト不変原則（Constitutional Enforcement）を確立 |
| `/aura-steering` | プロジェクトメモリ（product / tech / structure）を構築・更新 |
| `/aura-steering-custom` | 目的別ステアリングドキュメントを作成（APIコントラクト・セキュリティ等） |

### 仕様（Specification）
| スキル | 用途 |
|--------|------|
| `/aura-spec` | EARS形式の要求仕様を作成 |
| `/aura-spec-quick` | 高速モード：仕様＋タスクを一括作成 |
| `/aura-spec-batch` | ロードマップから複数仕様を並列作成 |
| `/aura-spec-refine` | 仕様を段階的に精緻化（quick → full） |
| `/aura-spec-status` | 全スペックの進捗・健全性スコアをダッシュボード表示 |
| `/aura-clarify` | 曖昧な要求事項を対話的に解決 |

### アーキテクチャ & 計画
| スキル | 用途 |
|--------|------|
| `/aura-plan` | アーキテクチャ + 境界コミットメントを作成（Constitutional Gates チェック付き） |
| `/aura-tasks` | 承認済み計画をタスクへ分解（波構造・依存関係付き） |

### 実装
| スキル | 用途 |
|--------|------|
| `/aura-impl` | 自律TDD実装（1タスク1イテレーション、サブエージェントトリオ） |
| `/aura-review` | 独立した対立的コードレビュー（12項目チェック） |
| `/aura-debug` | 根本原因ファースト自動デバッグ（10カテゴリ・CONFIDENCE評価） |
| `/aura-verify-completion` | 完了前の証拠確認ゲート（実ファイルを読んで確認） |

### 検証（Validation）
| スキル | 用途 |
|--------|------|
| `/aura-validate` | GO / NO-GO 統合検証 |
| `/aura-validate-gap` | 既存コードベースとのギャップ分析 |
| `/aura-validate-design` | 実装前の設計レビュー（10点チェック） |
| `/aura-sync` | Spec ↔ 実装の乖離検出（DRIFT_DETECTED / IN_SYNC / SPEC_BEHIND） |

### 運用
| スキル | 用途 |
|--------|------|
| `/aura-workflow` | 自動パイプラインの実行・再開・管理 |
| `/aura-issues` | タスクを GitHub Issues へエクスポート |

---

## ワークフロー自動化

```bash
# フルSDDパイプライン（Discovery → Spec → Plan → Tasks → Impl → Validate）
aura-sdd workflow run full-sdd --input feature="写真アルバム機能"

# TDDパイプライン（Spec → RED→GREEN→REFACTOR → Validate）
aura-sdd workflow run tdd --input feature="ユーザー認証"

# Leanパイプライン（Spec → Tasks → Impl → Validate、Discoveryなし）
aura-sdd workflow run lean-sdd --input feature="通知設定"

# 中断したワークフローを再開
aura-sdd workflow resume run-abc123

# ワークフロー一覧
aura-sdd workflow list
```

---

## コア規律

| 規律 | 説明 |
|------|------|
| **Boundary-First** | 実装前に境界（どのファイルを触るか）を宣言・コミット |
| **Constitutional Enforcement** | プロジェクト原則を Articles で明文化、/aura-plan 時に自動ゲートチェック |
| **1-task-per-iteration** | 各タスクを独立した新鮮なコンテキストで実行（コンテキスト汚染防止） |
| **Adversarial Review** | 実装とは独立したレビュアーサブエージェントが毎回チェック |
| **EARS形式** | `WHEN/IF/WHILE/WHERE/THE SYSTEM SHALL` で検証可能なAC を記述 |
| **aura-sync** | Spec のACと実装ファイルを突き合わせ、乖離をリアルタイム検出 |

---

## フェーズゲート（人間の承認が必要）

```
/aura-spec  →  spec.md 承認  →  /aura-plan
/aura-plan  →  plan.md 承認  →  /aura-tasks
/aura-tasks →  tasks.md 承認 →  /aura-impl
```

---

## 対応エージェント（12種・全Stable）

| エージェント | フラグ | インストール先 |
|------------|--------|--------------|
| Claude Code | `--claude-code`（デフォルト） | `.claude/skills/` |
| Cursor | `--cursor` | `.cursor/rules/aura/` |
| GitHub Copilot | `--copilot` | `.github/prompts/aura/` |
| OpenAI Codex | `--codex` | `.codex/skills/` |
| Windsurf | `--windsurf` | `.windsurf/rules/aura/` |
| Google Gemini | `--gemini` | `.gemini/commands/aura/` |
| OpenCode | `--opencode` | `.opencode/skills/` |
| Antigravity | `--antigravity` | `.antigravity/rules/aura/` |
| Amazon Kiro | `--kiro` | `.kiro/hooks/aura/` |
| Cline | `--cline` | `.clinerules/aura/` |
| Roo Code | `--roo` | `.roo/rules/aura/` |
| Devin | `--devin` | `.devin/skills/` |

---

## ワークフローステップ型（9種）

`skill` / `shell` / `gate` / `if_then` / `fan_out` / `fan_in` / `switch` / `while_loop` / `do_while`

---

## オプション

```
--lang <code>        言語: en, ja, zh, zh-TW, es, pt, de, fr, ru, it, ko, ar, el
--profile <name>     full（デフォルト）| lean | minimal
--os <target>        auto（デフォルト）| mac | windows | linux
--dry-run            書き込まずプレビュー
--overwrite <policy> prompt（デフォルト）| skip | force
--backup [dir]       既存ファイルをバックアップ
--aura-dir <path>    設定ディレクトリ（デフォルト: .aura）
-y, --yes            確認を省略して自動承認
-v, --version        バージョン表示
-h, --help           ヘルプ表示
```

---

## プロジェクト構造（インストール後）

```
.aura/
├── constitution.md          # プロジェクト不変原則（Constitutional Gates）
├── steering/
│   ├── product.md           # 製品目標・制約・ペルソナ
│   ├── tech.md              # 技術スタック・アーキテクチャ判断
│   ├── structure.md         # ディレクトリ構成・命名規則
│   └── <custom>.md          # カスタムステアリング（/aura-steering-custom）
├── settings/
│   ├── rules/               # 10のAI生成ルール
│   └── templates/           # ドキュメントテンプレート
├── specs/
│   └── NNN-機能名/
│       ├── spec.json        # ステータス・メタデータ
│       ├── spec.md          # EARS形式の要求仕様
│       ├── plan.md          # アーキテクチャ + 境界コミットメント
│       ├── tasks.md         # タスクリスト（波構造・依存関係付き）
│       └── notes.md         # 実装メモ（後続タスクへ伝播）
├── discovery/
│   ├── brief.md             # 機能ブリーフ
│   └── roadmap.md           # マルチスペックロードマップ
├── extensions/              # インストール済みエクステンション
├── presets/                 # インストール済みプリセット（lean を含む）
└── workflows/
    ├── definitions/         # ワークフロー定義（JSON）
    └── runs/                # 実行状態（resume 用）
```

---

## プリセット・エクステンション

```bash
# インストール済みプリセットを確認
aura-sdd preset list

# lean プリセットを適用（constitution テンプレート + spec テンプレート + ガイド）
aura-sdd preset apply lean

# エクステンションをインストール
aura-sdd extension add <id>

# エクステンション一覧
aura-sdd extension list
```

---

## 推奨モデル

| 用途 | モデル |
|------|--------|
| Planning / Review | Claude Opus 4.8 以上 |
| Implementation | Claude Sonnet 4.6 以上 |

---

## ライセンス

MIT — 詳細は [LICENSE](LICENSE) を参照
