# Brief: Aura-SDD v3.0 — Bug Fixes + 競合超越

## Problem

Aura-SDD v2.0 はアーキテクチャとして完成しているが、以下の重大バグと機能ギャップが存在する：

**重大バグ（動作不能レベル）**:
1. `aura-sdd workflow resume` が `__resume__.yml` を探して必ずクラッシュする
2. ワークフロー定義ファイルの拡張子が `.yml` で構築されるが `parseYamlWorkflow` は YAML をパースできない
3. `if_then` ステップがジャンプ先を検出するが実際にはジャンプしない（逐次実行のまま）
4. `fan_out` ステップがアイテムを「完了済み」とマークするだけで入れ子ステップを実行しない
5. `aura-sdd extension add` CLI コマンドが存在しない（`ExtensionManager.install()` はあるが CLI 未接続）

**spec-kit / cc-sdd に対する機能ギャップ**:
- ワークフローステップ型が 5 種（spec-kit は 10 種）。`switch`, `while_loop`, `fan_in` が欠如
- ユニークな差別化機能がない（競合と同等の機能セットのみ）
- スペック進化の仕組みが未実装（quick spec → full spec への段階的精緻化）
- スペック間の境界衝突検出がない

## Proposed approach

1. 全重大バグを修正する（ワークフローエンジンを正常動作させる）
2. ワークフローステップ型を 8 種に拡張（`switch`, `fan_in`, `while_loop`, `do_while` を追加）
3. 競合が持たない 3 つのユニーク機能を実装：
   - `/aura-spec-refine` — スペックの段階的精緻化（quick → standard → full）
   - spec-batch の境界衝突検出 — 並列スペックがファイルの所有権を重複していないか警告
   - aura-discovery の `--from-git` モード — 未コミット変更からブリーフを自動生成

## Scope

- `src/workflow/` — バグ修正 + 新ステップ型実装
- `src/index.ts` — resume バグ修正 + extension add 追加
- `templates/agents/claude-code/skills/` — 新スキル + 既存スキル改善
- `templates/agents/*/skills/` — 全エージェントへの新スキル展開
- `test/` — 新機能のテスト追加

## Out of scope

- YAML ネイティブパーサーの実装（ゼロ依存制約により JSON ワークフローを正式仕様とする）
- MCP 統合
- クラウドダッシュボード

## Boundary Candidates

- `src/workflow/engine.ts` — if_then ジャンプ修正、resume 修正、新ステップ dispatch
- `src/workflow/steps/` — fan_out 修正、新ステップ型ファイル追加
- `src/workflow/state.ts` — resume に必要な状態読み込み
- `src/index.ts` — resume バグ修正、extension add コマンド追加
- `templates/agents/claude-code/skills/aura-spec-refine/` — 新スキル
- `templates/agents/claude-code/skills/aura-discovery/SKILL.md` — from-git モード追加
- `templates/agents/claude-code/skills/aura-spec-batch/SKILL.md` — 衝突検出追加
- `templates/agents/claude-code/skills/aura-spec-status/SKILL.md` — ヘルス指標追加

## Constraints

- ゼロ実行時依存（Article 1 厳守）
- TypeScript strict mode（Article 2 厳守）
- 全新モジュールにテストファイル必須（Article 6 厳守）
- ESM ネイティブ（Article 7 厳守）

## Open questions

- [ ] ワークフロー定義は JSON 専用とするか、YAML パーサー（ゼロ依存ミニマル実装）を追加するか？
- [ ] `fan_out` の入れ子ステップ実行はシリアルのみとするか、真の並列実行（Promise.all）を許可するか？
