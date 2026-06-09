# Aura-SDD 完全ガイド

> **Spec-Driven Development フレームワーク** — CC-SDD と spec-kit の最良部分を統合し、両者の弱点を解消した次世代 SDD ツール

---

## 目次

1. [Aura-SDD とは何か](#1-aura-sdd-とは何か)
2. [なぜ Aura-SDD が必要か — 既存ツールの限界](#2-なぜ-aura-sdd-が必要か--既存ツールの限界)
3. [機能比較：CC-SDD / spec-kit / Aura-SDD](#3-機能比較cc-sdd--spec-kit--aura-sdd)
4. [コア概念の解説](#4-コア概念の解説)
5. [インストール](#5-インストール)
6. [はじめてのワークフロー（ステップバイステップ）](#6-はじめてのワークフローステップバイステップ)
7. [スキルリファレンス](#7-スキルリファレンス)
8. [自動化ワークフロー](#8-自動化ワークフロー)
9. [エージェント別ガイド](#9-エージェント別ガイド)
10. [よくある質問](#10-よくある質問)

---

## 1. Aura-SDD とは何か

**Spec-Driven Development（SDD）** は、実装の前に仕様を書く開発手法です。AI コーディングエージェントが登場した現代において、「AI に何を作らせるか」を明確に定義することが品質の鍵になります。

Aura-SDD は、SDD の実践を AI エージェントと共に実行するためのフレームワークです。プロジェクトに以下をインストールします：

- **13 のスキル** — AI エージェントへの指示書（スラッシュコマンド形式）
- **10 の AI 生成ルール** — AI が守るべき規律を明文化したルールセット
- **ドキュメントテンプレート** — spec.md / plan.md / tasks.md 等の標準フォーマット
- **ワークフロー定義** — Discovery→実装までのパイプラインを自動化

```
あなたのプロジェクト/
├── .claude/skills/          ← AI が /aura-* で呼び出せるスキル（Claude Code）
├── .aura/
│   ├── constitution.md      ← プロジェクトの不変原則
│   ├── steering/            ← プロジェクト横断の技術判断記録
│   ├── settings/rules/      ← AI 生成ルール（EARS, Boundary, 等）
│   ├── settings/templates/  ← 標準ドキュメントテンプレート
│   ├── specs/               ← 各機能の仕様書群
│   └── workflows/           ← 自動ワークフロー定義＋実行履歴
└── CLAUDE.md                ← クイックスタートガイド
```

---

## 2. なぜ Aura-SDD が必要か — 既存ツールの限界

### CC-SDD の強みと弱点

**CC-SDD**（Kiro Spec-Driven Development）は Claude Code 専用の SDD フレームワークです。  
TypeScript/Node.js で実装され、ゼロランタイム依存、17 のスキル、優れた Boundary-First 規律を持ちます。

| 強み | 弱点 |
|------|------|
| TypeScript ゼロ依存 | 8 エージェント対応中 Stable は 2 つのみ |
| Boundary-First 規律 | **ワークフロー自動化なし** — 各スキルを手動で呼ぶ必要がある |
| 対立的レビュー（Adversarial Review）| **拡張システムなし** — カスタムスキルを追加できない |
| 13 言語対応 | **プリセットなし** — テンプレートをプロジェクトごとに書き直す必要がある |
| | `.kiro/` 命名が AWS Kiro CLI と衝突リスク |
| | Constitutional Enforcement なし — 原則の定義と遵守チェックが別々 |

**致命的な問題：** 「Discovery → spec → plan → tasks → impl → validate」という 6 フェーズを毎回手動で繋ぐ必要があります。実際の開発では、どこまで進んだか管理するだけで認知負荷になります。

---

### spec-kit の強みと弱点

**spec-kit**（v0.9.6.dev0）は Python/Typer 製のエージェント非依存 SDD ツールキットです。  
30 以上のエージェント対応、105 以上の拡張、22 以上のプリセット、Constitutional Enforcement、10 ステップ型のワークフローエンジンを持ちます。

| 強み | 弱点 |
|------|------|
| Constitutional Enforcement | **v0.9.6.dev — プロダクション未対応** |
| 豊富なエクステンション（105+）| **Python 必須** — 非エンジニアが使いにくい |
| ワークフローエンジン（自動化）| テンプレート解決が **Python/Bash/PowerShell の三重実装** |
| プリセットシステム | 10 ステップ型は**習得コストが高い** |
| 30 以上のエージェント対応 | Boundary-First 規律なし |
| | 対立的レビューなし |
| | 日本語等のマルチ言語サポートが弱い |

**致命的な問題：** `pip install spec-kit` が必要で、CI/CD でも Python 環境を用意しなければなりません。また、dev バージョンのため API が安定していません。

---

### Aura-SDD — 両者の限界を超えた設計

```
CC-SDD の「何が良いか」:
  ✓ TypeScript ゼロ依存
  ✓ Boundary-First 規律
  ✓ 対立的レビュー（Adversarial Review）
  ✓ 13 言語対応

spec-kit の「何が良いか」:
  ✓ Constitutional Enforcement
  ✓ ワークフロー自動化
  ✓ 拡張システム
  ✓ プリセットシステム

Aura-SDD = CC-SDD の良い部分 + spec-kit の良い部分
         + 両者の弱点を解消した独自設計
```

---

## 3. 機能比較：CC-SDD / spec-kit / Aura-SDD

### 3.1 インフラ・技術スタック

| 項目 | CC-SDD | spec-kit | **Aura-SDD** |
|------|--------|----------|--------------|
| 言語 | TypeScript | Python | **TypeScript** |
| ランタイム依存 | ゼロ | Python 必須 | **ゼロ** |
| バージョン | v3.0.2（安定）| v0.9.6.dev（開発中）| **v1.0.0（安定）** |
| インストール | `npx cc-sdd` | `pip install` | **`npx aura-sdd`** |
| 設定ディレクトリ | `.kiro/`（AWS 衝突リスク）| `.speckit/` | **`.aura/`（衝突なし）** |
| 言語対応 | 13 言語 | 英語中心 | **13 言語** |

### 3.2 エージェント対応

| エージェント | CC-SDD | spec-kit | **Aura-SDD** |
|------------|--------|----------|--------------|
| Claude Code | ✅ Stable | ✅ | **✅ Stable** |
| Cursor | ⚠️ Beta | ✅ | **✅ Stable** |
| GitHub Copilot | ❌ なし | ✅ | **✅ Stable** |
| OpenAI Codex | ❌ なし | ✅ | **✅ Stable** |
| Windsurf | ❌ なし | ✅ | **✅ Stable** |
| Google Gemini | ❌ なし | ✅ | **✅ Stable** |
| **Stable 数** | **2/8** | **30+（dev）** | **6/6** |

### 3.3 SDD 規律

| 規律 | CC-SDD | spec-kit | **Aura-SDD** |
|------|--------|----------|--------------|
| Boundary-First | ✅ | ❌ | **✅** |
| Constitutional Enforcement | ❌ | ✅ | **✅** |
| EARS フォーマット | ✅ | △（部分）| **✅** |
| 対立的レビュー | ✅ | ❌ | **✅** |
| 1-task-per-iteration | ✅ | ❌ | **✅** |
| Implementation Notes 伝播 | ✅ | ❌ | **✅** |
| TDD（RED→GREEN→REFACTOR）| ✅ | △ | **✅** |
| フェーズゲート（人間承認）| ✅ | ✅ | **✅** |

### 3.4 自動化

| 機能 | CC-SDD | spec-kit | **Aura-SDD** |
|------|--------|----------|--------------|
| ワークフローエンジン | ❌ | ✅（10 型）| **✅（5 型、シンプル）** |
| fan_out 並列実装 | ❌ | ✅ | **✅** |
| 状態永続化（再開）| ❌ | ✅ | **✅** |
| ビルトインワークフロー数 | 0 | 5+ | **3（full-sdd / tdd / lean-sdd）** |
| 拡張システム | ❌ | ✅（105+）| **✅（枠組み完成）** |
| プリセットシステム | ❌ | ✅（22+）| **✅（枠組み完成）** |
| GitHub Issues 連携 | ❌ | ✅ | **✅** |

### 3.5 テンプレート解決

| 項目 | CC-SDD | spec-kit | **Aura-SDD** |
|------|--------|----------|--------------|
| 実装数 | 1（TypeScript）| **3（Python + Bash + PowerShell）** | **1（TypeScript）** |
| 優先スタック | ❌ | ✅ | **✅（local > preset > extension > built-in）** |
| 合成戦略 | ❌ | replace / prepend / append | **replace / prepend / append** |

---

## 4. コア概念の解説

### 4.1 Boundary-First（境界優先）

> *「実装前に、何と何の間に境界を引くかを決める」*

CC-SDD から継承した Aura-SDD 最大の規律です。

**なぜ重要か：**  
AI が実装を始めると、責務が曖昧なまま巨大なモジュールが生まれがちです。Boundary-First は「どのモジュールが何の責任を持つか」を仕様フェーズで明文化します。

**具体例：**

```markdown
## Boundary Candidates（spec.md に記載）
- UserRepository: データアクセスのみ（ビジネスロジックなし）
- AuthService: 認証ロジックのみ（セッション管理は除外）
- SessionStore: セッションの CRUD のみ（認証判定は除外）

## Boundary Commitments（plan.md に記載）
1. AuthService は UserRepository のインターフェースのみに依存する
2. HTTP リクエスト/レスポンスの変換は AuthService に含めない
3. セッションの有効期限ロジックは SessionStore が持つ
```

`/aura-plan` はこれらの境界を Mermaid 図として可視化し、`/aura-tasks` ではタスクに `_Boundary:_` アノテーションで境界への影響を明示します。

---

### 4.2 Constitutional Enforcement（原則遵守）

> *「プロジェクトの不変原則を定義し、計画フェーズで自動チェックする」*

spec-kit から継承・改良した概念です。

**CC-SDD との違い：** CC-SDD にはルールファイルはありますが、Constitutional Enforcement（原則を Gates として計画時に強制チェック）がありません。

**Constitution の例（`.aura/constitution.md`）：**

```markdown
# Constitution: MyApp
Version: 1.2
Date: 2026-06-07

## Articles

### Article 1 — ゼロランタイム依存
外部ランタイム依存はゼロを維持する。npm devDependencies は許可するが、
runtime dependencies はゼロとする。
_Rationale:_ サーバーレス環境での cold start を最小化するため

### Article 2 — API 後方互換性
公開 API は semver に従い、マイナーバージョンでは破壊的変更を行わない。

## Constitutional Gates
Gate 1: このプランは外部ランタイム依存を追加するか？（Article 1）
Gate 2: このプランは既存 API の破壊的変更を含むか？（Article 2）
```

`/aura-plan` を実行すると、全ての Constitutional Gates を自動チェックし、違反があれば計画を **BLOCKED** 扱いにします。

---

### 4.3 EARS フォーマット

> *「受け入れ基準を曖昧さなく記述する構文」*

**EARS**（Easy Approach to Requirements Syntax）は航空宇宙産業で生まれた要件記述手法です。

| パターン | 構文 | 使用場面 |
|---------|------|---------|
| Event | WHEN \<trigger\>, THE SYSTEM SHALL \<response\> | 特定のイベントに反応する |
| Condition | IF \<condition\>, THE SYSTEM SHALL \<response\> | 前提条件がある場合 |
| State | WHILE \<state\>, THE SYSTEM SHALL \<response\> | 継続状態の振る舞い |
| Feature | WHERE \<feature\>, THE SYSTEM SHALL \<response\> | 特定機能の存在条件 |

**悪い例（曖昧）：**
```
- ユーザーはログインできること
- エラーは適切に処理すること
```

**良い例（EARS）：**
```
- WHEN ユーザーが正しい認証情報を送信したとき、
  THE SYSTEM SHALL JWT トークンを発行し、有効期限を 1 時間に設定する。

- IF 認証試行が 5 回連続で失敗した場合、
  THE SYSTEM SHALL アカウントを 15 分間ロックし、
  登録済みメールアドレスに通知を送信する。

- WHILE セッションが有効な間、
  THE SYSTEM SHALL 最終アクセスから 30 分ごとにトークンを自動更新する。
```

---

### 4.4 Adversarial Review（対立的レビュー）

> *「自分以外の独立したサブエージェントが実装をレビューする」*

CC-SDD の最も革新的な機能の一つです。

**通常の AI レビューの問題：**  
AI が実装したコードを同じ AI にレビューさせると、自分が書いたコードを正当化する傾向があります（自己肯定バイアス）。

**Aura-SDD の解決策：**

```
タスク実装の流れ：
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Implementer │ --> │  Reviewer   │ --> │  Debugger   │
│  サブエージェント  │     │（独立）サブエージェント│     │ （必要時）   │
└─────────────┘     └─────────────┘     └─────────────┘
  コードを書く    12チェックで検証    失敗時のみ介入
```

`/aura-review` の 12 チェック項目：
1. ファイルが実際に存在するか
2. コードが構文的に正しいか
3. テストが書かれているか
4. テストが通るか
5. spec.md の受け入れ基準を満たしているか
6. Boundary Commitments を遵守しているか
7. Constitutional Articles に違反していないか
8. エラーハンドリングが適切か
9. セキュリティ上の問題がないか
10. パフォーマンス上の問題がないか
11. 前のタスクの実装ノートを参照したか
12. 次のタスクのためのノートを残したか

---

### 4.5 1-task-per-iteration（タスク単位コンテキスト）

> *「1 タスクごとに新しいサブエージェントコンテキストで実装する」*

**なぜ重要か：**  
大きな機能を 1 つの AI セッションで実装すると、コンテキストウィンドウが汚染され、後半のタスクで前半の決定が忘れられたり、矛盾した実装が生まれたりします。

**Aura-SDD の解決策：**  
各タスクを独立したサブエージェントに割り当て、必要な情報は **Implementation Notes**（`notes.md`）として明示的に伝播します。

```
タスク 1 実装 → notes.md に「UserRepository のインターフェース確定」を記録
タスク 2 実装 → notes.md を読んで上記インターフェースに合わせて実装
タスク 3 実装 → 前の 2 タスクのノートを参照してテストを書く
```

---

## 5. インストール

### 前提条件

- Node.js 18 以上
- 対応 AI エージェントのいずれか

### インストールコマンド

```bash
# Claude Code（デフォルト、日本語）
npx aura-sdd@latest --lang ja

# Cursor IDE
npx aura-sdd@latest --cursor --lang ja

# GitHub Copilot
npx aura-sdd@latest --copilot --lang ja

# OpenAI Codex
npx aura-sdd@latest --codex

# Windsurf IDE
npx aura-sdd@latest --windsurf

# Google Gemini
npx aura-sdd@latest --gemini

# インストール内容のプレビュー（実際には書き込まない）
npx aura-sdd@latest --dry-run --lang ja
```

### インストール結果

```
Aura-SDD v1.0.0 — Claude Code install

  Agent:    Claude Code
  Language: ja
  Aura dir: .aura
  Profile:  full
  Files:    34 new

✓ Done: 34 file(s) written, 0 skipped.

Next steps:
  1. Set up project constitution: /aura-constitution
  2. Start with discovery: /aura-discovery
  3. Create a spec: /aura-spec
  4. Implement: /aura-impl
  5. Build project memory: /aura-steering
```

---

## 6. はじめてのワークフロー（ステップバイステップ）

以下は「ユーザー認証機能」を実装する例です。

### Step 0: セットアップ（初回のみ）

```
/aura-constitution
```

プロジェクトの不変原則を定義します。例：

```markdown
Article 1 — TypeScript Strict モード
全ファイルは TypeScript strict モードで記述する。

Article 2 — テストカバレッジ
新機能は 80% 以上のテストカバレッジを維持する。

Article 3 — 外部サービス依存の分離
外部サービス（DB, メール等）はインターフェースで抽象化し、
実装詳細をビジネスロジックから隔離する。
```

---

### Step 1: Discovery（何を作るか整理する）

```
/aura-discovery ユーザー認証機能（JWT + リフレッシュトークン）
```

AI が以下を判定します：
- これは新機能か、既存 spec の拡張か
- 単一 spec か、複数 spec が必要か
- 直接実装すべきか、spec が必要か

出力例（`.aura/discovery/brief.md`）：
```markdown
## ルーティング結果: single-spec

## 機能概要
JWT を使った認証システム。アクセストークン（1h）+ リフレッシュトークン（7d）の二層構造。

## Boundary Candidates
- AuthController: HTTP レイヤー
- AuthService: 認証ビジネスロジック
- UserRepository: ユーザーデータアクセス
- TokenStore: トークン管理

## 推奨次アクション
→ /aura-spec user-auth
```

---

### Step 2: Spec（受け入れ基準を書く）

```
/aura-spec user-auth
```

AI が EARS フォーマットで仕様書を生成します。

生成例（`.aura/specs/001-user-auth/spec.md`）：

```markdown
# Spec: ユーザー認証

## Boundary Candidates
- AuthService（認証ロジック）
- TokenService（JWT 生成/検証）
- UserRepository（ユーザー検索）

## User Scenarios

### Scenario 1 — ログイン成功（Priority: P1）
WHEN ユーザーが有効なメールアドレスとパスワードを POST /auth/login に送信したとき、
THE SYSTEM SHALL アクセストークン（有効期限 1 時間）と
リフレッシュトークン（有効期限 7 日）を返す。

### Scenario 2 — ログイン失敗（Priority: P1）
IF パスワードが一致しない場合、
THE SYSTEM SHALL 401 Unauthorized を返し、
失敗回数をインクリメントする。

### Scenario 3 — アカウントロック（Priority: P1）
IF 認証失敗が 5 回連続した場合、
THE SYSTEM SHALL アカウントを 15 分間ロックし、
以降のログイン試行に 423 Locked を返す。
```

**人間承認ゲート：** spec.md を確認して `y` を入力すると次フェーズへ。

---

### Step 3: Plan（アーキテクチャを設計する）

```
/aura-plan user-auth
```

AI が Constitutional Gates をチェックした後、アーキテクチャを設計します。

```
Constitutional Gate チェック:
Gate 1: TypeScript strict 違反？ → No ✓
Gate 2: テストカバレッジ低下？  → No ✓
Gate 3: 外部サービス依存が隔離されているか？ → Yes ✓
→ 全ゲート通過。計画を続行します。
```

生成例（`.aura/specs/001-user-auth/plan.md`）：

```markdown
## Mermaid アーキテクチャ図

graph TD
  POST[POST /auth/login] --> AC[AuthController]
  AC --> AS[AuthService]
  AS --> UR[UserRepository]
  AS --> TS[TokenService]
  TS --> JWT[jwt library]
  UR --> DB[Database]

## Boundary Commitments

1. AuthController は HTTP の変換のみ担う。ビジネスロジックを含めない。
2. AuthService は UserRepository のインターフェースのみに依存する。
3. TokenService はトークンの生成・検証のみ担う。
```

**人間承認ゲート：** plan.md を確認して承認。

---

### Step 4: Tasks（タスクを分解する）

```
/aura-tasks user-auth
```

生成例（`.aura/specs/001-user-auth/tasks.md`）：

```markdown
## Wave 0 — 基盤（並列化不可）

### Task 0.1 — UserRepository インターフェース定義
_Boundary:_ UserRepository の公開 API を確定する
_Files:_ src/repositories/UserRepository.interface.ts

### Task 0.2 — TokenService インターフェース定義
_Boundary:_ TokenService の公開 API を確定する
_Files:_ src/services/TokenService.interface.ts

## Wave 1 — 実装（並列化可能）

### [P] Task 1.1 — UserRepository 実装
_Depends:_ Task 0.1
_Boundary:_ UserRepository インターフェースを実装
_Files:_ src/repositories/UserRepository.ts, tests/UserRepository.test.ts

### [P] Task 1.2 — TokenService 実装
_Depends:_ Task 0.2
_Boundary:_ TokenService インターフェースを実装
_Files:_ src/services/TokenService.ts, tests/TokenService.test.ts

## Wave 2 — 統合

### Task 2.1 — AuthService 実装
_Depends:_ Task 1.1, Task 1.2
_Boundary:_ AuthService が両インターフェースを組み合わせる
_Files:_ src/services/AuthService.ts, tests/AuthService.test.ts
```

**`[P]` マーカー** は並列実装可能なタスクを意味します。

---

### Step 5: Implementation（実装する）

```
/aura-impl user-auth
```

各タスクに対して以下のトリオが実行されます：

```
Task 0.1:
  Implementer → インターフェース定義を書く
  Reviewer   → 12 チェックで検証（APPROVED）
  → notes.md に「UserRepository.interface.ts の型定義確定」を記録

Task 1.1（波 1、並列）:
  notes.md を読む → Task 0.1 のインターフェースを参照
  Implementer → TDD: まず失敗テストを書く（RED）
             → 最小実装で通す（GREEN）
             → リファクタリング（REFACTOR）
  Reviewer   → 12 チェックで検証
```

---

### Step 6: Validate（検証する）

```
/aura-validate user-auth
```

出力例：

```
✓ 全タスク完了（6/6）
✓ spec.md の全受け入れ基準にテストが対応している
✓ Constitutional Articles 違反なし
✓ Boundary Commitments 遵守
✓ テストカバレッジ: 94%（閾値 80% 以上）

VERDICT: GO ✅
→ 実装をマージしてください。
```

---

## 7. スキルリファレンス

### メインパイプライン

| スキル | 用途 | 入力 | 出力 |
|--------|------|------|------|
| `/aura-discovery` | 新しい作業の種別判定 | `<アイデア>` | `brief.md`（+ 必要なら `roadmap.md`）|
| `/aura-constitution` | プロジェクト原則の確立 | — | `.aura/constitution.md` |
| `/aura-spec` | EARS 形式の要件定義 | `<機能名>` | `spec.md`, `spec.json` |
| `/aura-clarify` | 曖昧点の解消 | `<機能名>` | 更新された `spec.md` |
| `/aura-plan` | アーキテクチャ設計 | `<機能名>` | `plan.md`（Mermaid 図 + 境界コミットメント）|
| `/aura-tasks` | タスク分解 | `<機能名>` | `tasks.md`（波構造 + P マーカー）|
| `/aura-impl` | 自律実装（TDD）| `<機能名>` | 実装コード + 更新された `notes.md` |
| `/aura-validate` | 統合検証 | `<機能名>` | GO/NO-GO/MANUAL_VERIFY 判定 |

### サポートスキル

| スキル | 用途 |
|--------|------|
| `/aura-review` | 独立した 12 チェックレビュー（`/aura-impl` から自動呼び出し）|
| `/aura-debug` | ルート原因優先デバッグ（失敗分類ツリー付き）|
| `/aura-steering` | プロジェクトメモリ管理（product.md / tech.md / structure.md）|
| `/aura-workflow` | ワークフローの実行・再開・状態確認 |
| `/aura-issues` | tasks.md を GitHub Issues に変換 |

### フェーズゲート（人間承認が必要）

```
/aura-spec   →【承認】→ /aura-plan
/aura-plan   →【承認】→ /aura-tasks
/aura-tasks  →【承認】→ /aura-impl
```

各ゲートで AI は「承認しますか？ [y/N/edit]」と確認を求めます。

---

## 8. 自動化ワークフロー

### 3 つのビルトインワークフロー

#### full-sdd — フル SDD パイプライン

最も包括的なワークフロー。大規模機能や複数人が関わる機能に最適。

```bash
aura-sdd workflow run full-sdd --input feature="写真アルバム機能"
```

```
discovery → [承認] → spec → [承認] → plan → [承認] → tasks → [承認] → impl → validate
```

#### tdd — TDD 特化パイプライン

テスト駆動開発を強制するワークフロー。品質を最優先する場面に。

```bash
aura-sdd workflow run tdd --input feature="決済 API 統合"
```

```
spec（テストケース優先）→ [承認] → tasks（RED ステップ必須）→ [承認] → impl（RED→GREEN→REFACTOR）→ validate
```

**CC-SDD / spec-kit にない特徴：** 各タスクが必ず「失敗テストを書く → 最小実装で通す → リファクタリング」の順序で進むことを強制します。

#### lean-sdd — ソロ開発者向け軽量パイプライン

Discovery・Planning フェーズを省略した高速サイクル。個人プロジェクトや小規模機能に。

```bash
aura-sdd workflow run lean-sdd --input feature="プロフィール編集"
```

```
spec → [承認] → tasks → [承認] → impl → validate
```

---

### ワークフローの再開

ゲートでワークフローが一時停止した場合、後で再開できます：

```bash
# 一覧表示（実行履歴 + 利用可能なワークフロー）
aura-sdd workflow list

# 特定の run-id から再開
aura-sdd workflow resume run-1a2b3c-4d5e
```

---

### カスタムワークフローの作成

`.aura/workflows/definitions/` にカスタム JSON を置くだけで利用可能になります。

```json
{
  "name": "my-hotfix",
  "description": "緊急修正用の軽量パイプライン",
  "inputs": {
    "bug": { "type": "string", "required": true }
  },
  "steps": [
    {
      "id": "debug",
      "type": "skill",
      "skill": "aura-debug",
      "input": "{{ inputs.bug }}"
    },
    {
      "id": "impl",
      "type": "skill",
      "skill": "aura-impl"
    },
    {
      "id": "gate_review",
      "type": "gate",
      "message": "修正内容を確認してください。リリースしますか？",
      "options": ["approve", "reject"]
    }
  ]
}
```

**5 ステップ型（spec-kit の 10 型から本質のみに絞り込み）：**

| 型 | 用途 | spec-kit 対応 |
|----|------|--------------|
| `skill` | AI スキルを呼び出す | `skill` |
| `shell` | シェルコマンドを実行 | `shell` |
| `gate` | 人間の確認を求めて一時停止 | `prompt` |
| `fan_out` | 複数アイテムを並列処理 | `fan_out` |
| `if_then` | 条件による分岐 | `switch` / `if_then` |

---

## 9. エージェント別ガイド

### Claude Code（推奨）

スキルを `/aura-*` コマンドとして呼び出します。

```bash
# インストール
npx aura-sdd@latest --lang ja

# 使用例
/aura-discovery 新機能のアイデア
/aura-spec feature-name
/aura-impl feature-name
```

インストール先: `.claude/skills/aura-*/SKILL.md`  
推奨モデル: 計画・レビューに Opus 4.8、実装に Sonnet 4.6

---

### Cursor IDE

ルールファイルとして `.cursor/rules/aura/` に配置されます。

```bash
npx aura-sdd@latest --cursor --lang ja
```

Cursor の「@Rules」や「Composer」から `@aura-discovery` 等で参照できます。

---

### GitHub Copilot

`.github/` に `.prompt.md` 形式で配置されます。

```bash
npx aura-sdd@latest --copilot
```

Copilot Chat で `#aura-spec` のように参照できます。

---

### Windsurf / Gemini / Codex

```bash
npx aura-sdd@latest --windsurf
npx aura-sdd@latest --gemini
npx aura-sdd@latest --codex
```

各エージェントのネイティブフォーマットでスキルが配置されます。

---

## 10. よくある質問

### Q: CC-SDD を既に使っている場合、移行は必要ですか？

A: `.kiro/` ディレクトリは `.aura/` とは別なので、並存できます。段階的な移行として、まず `npx aura-sdd@latest --dry-run` でプレビューし、既存の `.kiro/specs/` は手動で `.aura/specs/` にコピーできます。

### Q: spec-kit との比較でエクステンション数が少ないのでは？

A: spec-kit は 105+ エクステクションを持ちますが、v0.9.x.dev でコミュニティエコシステムが未成熟です。Aura-SDD はまず**枠組みを安定させ**（v1.0 で達成）、エクステクションはコミュニティが構築します。インターフェースは今すぐ使用可能です：

```bash
aura-sdd extension add my-git-workflow  # エクステクションをインストール
aura-sdd extension list                 # 一覧
aura-sdd extension remove my-git-workflow
```

### Q: チームで使う場合、`.aura/` はリポジトリに含めますか？

A: はい、全て含めることを推奨します：
- `.aura/constitution.md` — プロジェクト原則の共有
- `.aura/steering/` — 技術判断の記録
- `.aura/settings/` — AI 生成ルールの統一
- `.aura/specs/` — 仕様書の履歴管理
- `.aura/workflows/definitions/` — ワークフロー定義
- `.aura/workflows/runs/` — これは `.gitignore` 推奨（実行状態は個人ローカル）

### Q: 日本語でスキルを使えますか？

A: `--lang ja` でインストールすることで、CLAUDE.md やドキュメントテンプレートが日本語に設定されます。スキル自体（SKILL.md）は英語で書かれていますが、AI への指示として機能するため、`/aura-spec ユーザー認証機能` のように日本語で機能名を渡せます。

### Q: ワークフロー実行中に中断した場合は？

A: ゲートステップで自然に一時停止します。実行状態は `.aura/workflows/runs/<run-id>/state.json` に自動保存されます。

```bash
aura-sdd workflow list    # 実行中 or 一時停止中の run-id を確認
aura-sdd workflow resume run-1a2b3c4d
```

### Q: TDD ワークフローは通常の full-sdd ワークフローと何が違いますか？

A: `tdd` ワークフローには 2 つの違いがあります：
1. `spec` ステップで「各受け入れ基準が独立してテスト可能か」をゲートで確認
2. `tasks` ステップで「各タスクが RED ステップ（失敗テストを書くステップ）から始まるか」をゲートで確認

これにより、実装前にテストの設計が完了していることが保証されます。

---

## まとめ：Aura-SDD の位置づけ

```
                開発速度
                   ↑
lean-sdd ──────────┤ ソロ・小規模機能向け
（計画フェーズ省略）  │
                   │
tdd ───────────────┤ 品質最優先
（テスト強制）        │
                   │
full-sdd ──────────┤ 大規模・チーム開発向け
（全フェーズ）        │
                   └──────────────→ 品質・規律
```

**Aura-SDD が最も力を発揮する場面：**
- AI エージェントに複数フェーズにわたる開発を任せたいとき
- チームで AI 生成コードの品質基準を統一したいとき
- 仕様を書かずに実装を始めて後悔した経験があるとき
- CI/CD に Python を追加したくないとき（ゼロランタイム依存）

---

*Aura-SDD v1.0.0 — [GitHub](https://github.com/aura-sdd/aura-sdd) | `npx aura-sdd@latest --help`*
