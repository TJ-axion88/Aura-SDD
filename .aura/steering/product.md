# Product Steering

## Core Purpose

AIコーディングエージェント向けの Spec-Driven Development フレームワーク。
`npx aura-sdd@latest` 一発でスキル・設定・テンプレートをプロジェクトにインストールし、仕様駆動の開発ワークフローを即座に使えるようにする。

## Primary Users

- **ソフトウェア開発者（個人）**: Claude Code・Cursor などの AI エージェントを使って開発している人。SDD の規律を導入したいが、ゼロから設計するコストを払いたくない。
- **開発チーム**: AI エージェントを複数人で使う場合に、仕様・設計・タスクの共通フォーマットを揃えたい。
- **フレームワーク開発者（本リポジトリ）**: Aura-SDD 自身を Aura-SDD で開発するドッグフーディング環境。

## Key Capabilities

- **20スキル**: discovery → spec → plan → tasks → impl → validate の完全パイプライン
- **9エージェント対応**: Claude Code・Cursor・Copilot・Codex・Windsurf・Gemini・OpenCode・Antigravity・Kiro
- **Constitutional Enforcement**: プロジェクト原則をゲートとして実装フェーズに強制
- **Workflow Automation**: `full-sdd` / `tdd` / `lean-sdd` の3ビルトインワークフロー（再開可能）
- **Extension/Preset System**: コミュニティ拡張とプリセットによるカスタマイズ
- **ゼロ実行時依存**: インストール後はユーザー環境に副作用なし

## Non-goals

- クラウドサービス・ダッシュボードの提供
- 特定の言語・フレームワークへの依存（言語非依存を維持）
- AI モデルの直接呼び出し（エージェントが行う）
- CI/CD パイプラインの自動実行（スキルはエージェントが手動起動）
- 有料機能・サブスクリプションモデル
