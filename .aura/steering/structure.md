# Structure Steering

## Directory Philosophy

`src/` はインストールロジック（CLI・マニフェスト処理・テンプレートレンダリング）のみを持つ。
スキルの本文・テンプレートはすべて `templates/` に格納し、コードとコンテンツを分離する。
新しいエージェントやスキルは `templates/` と `src/agents/registry.ts` の変更だけで追加できる設計。

## Key Directories

```
src/
  agents/         エージェント定義（registry.ts）
  cli/            引数パース・設定解決・ポリシー・UI・Store
  extension/      Extension の管理・レジストリ
  manifest/       マニフェスト読み込み・処理・インストール計画
  preset/         Preset の管理
  template/       テンプレートコンテキスト・レンダリング・変数解決
  utils/          共通ユーティリティ（fs・pathSafety・languages）
  workflow/       ワークフローエンジン・状態管理・各ステップ実装

templates/
  agents/
    <agent>/      エージェントごとのスキル・ドキュメントテンプレート
      skills/     Claude Code・Codex・OpenCode 用（SKILL.md 形式）
      commands/   Cursor・Windsurf・Antigravity・Kiro 用（.md 形式）
      docs/       エージェントのクイックスタートドキュメント
  manifests/      エージェントごとのインストール定義（JSON）
  shared/
    settings/
      rules/      AI 生成ルール（10ファイル）
      templates/  仕様書テンプレート（spec/plan/tasks/constitution 等）
    workflows/    ビルトインワークフロー定義（full-sdd/tdd/lean-sdd）

test/             Vitest テストファイル（src/ の各モジュールに対応）
dist/             ビルド成果物（git 管理外、npm 配布用）

.aura/            Aura-SDD 自身の設定（ドッグフーディング）
  constitution.md
  steering/
  settings/
  workflows/
  specs/
```

## Naming Conventions

- **ファイル名**: ケバブケース（`my-module.ts`）
- **クラス名**: パスカルケース（`ExtensionManager`）
- **関数名**: キャメルケース（`resolveConfig`）
- **型・インターフェース名**: パスカルケース（`ResolvedConfig`）
- **定数**: アッパースネークケース（`DEFAULT_LANG`）
- **テンプレート変数**: アッパースネークケース（`{{AGENT_LABEL}}`）
- **スキルディレクトリ**: ケバブケース・`aura-` プレフィックス（`aura-spec-batch`）
- **エージェントキー**: ケバブケース（`claude-code`、`opencode`）

## Code Principles

- 1ファイル1責務。`src/index.ts` はオーケストレーターのみ（ロジックを持たない）
- `src/` のモジュールは互いに循環参照しない
- エラーメッセージは `formatError()` を通して色付きで出力
- 新しい CLI フラグを追加したら `printHelp()` も必ず更新する
- マニフェスト JSON の `version` フィールドは必ず `1` から始める
