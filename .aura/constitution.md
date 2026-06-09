# Constitution: Aura-SDD
Version: 1.1
Date: 2026-06-09

## Preamble

Aura-SDD は AIコーディングエージェント向けの Spec-Driven Development フレームワークである。
NPMパッケージとして配布され、ユーザーのプロジェクトにスキル・設定・テンプレートをインストールする CLI ツールおよびテンプレートコレクションで構成される。
対象ユーザーはソフトウェア開発者・チームであり、Claude Code・Cursor・Copilot など複数の AI エージェント上で動作する。
本フレームワーク自身も Aura-SDD を使って開発される（ドッグフーディング）。

## Articles

### Article 1 — ゼロ実行時依存
本フレームワークの `dependencies`（devDependencies を除く）は常に空でなければならない。
Node.js 標準ライブラリのみを使用し、サードパーティパッケージへの実行時依存を一切持たない。
_Rationale:_ インストール時のサイズ・セキュリティリスク・バージョン衝突をゼロにする。ユーザー環境に副作用を与えない。

### Article 2 — TypeScript strict モード
`tsconfig.json` の `strict: true` を常に維持する。型エラーを無視する `@ts-ignore` / `as any` の使用を禁止する。
_Rationale:_ 型安全性がランタイムエラーを防ぐ。フレームワーク自身が品質の手本でなければならない。

### Article 3 — パストラバーサル防止
ユーザーのファイルシステムに書き込む操作はすべて `assertSafePath` / `isSafePath` を通過しなければならない。
テンプレートのパス変数（`{{AURA_DIR}}` 等）はレンダリング後に必ずバリデーションする。
_Rationale:_ CLI ツールがユーザー環境を破壊することは許されない。セキュリティは最優先事項である。

### Article 4 — エージェント非依存のテンプレート構造
スキルの本文ロジックは `templates/agents/<agent>/skills/<skill>/SKILL.md` に格納し、`src/` のコードに埋め込んではならない。
新しいエージェントの追加はテンプレートとマニフェストの追加のみで完結し、`src/` の変更を必要としない。
_Rationale:_ エージェント対応の拡張コストを最小化する。テンプレートとロジックの関心を分離する。

### Article 5 — 後方互換性の保護
既存インストール済みの `.aura/settings/` および `.aura/workflows/` は、デフォルトポリシーが `skip` であるため上書きされない。
破壊的変更（ファイルの削除・リネーム・フォーマット変更）を行う場合はメジャーバージョンを上げる。
_Rationale:_ ユーザーが既にカスタマイズした設定を無断で破壊しない。信頼性がフレームワークの生命線である。

### Article 6 — 全モジュールにテストを持つ
`src/` に追加されたすべてのモジュールは、対応するテストファイルを `test/` に持たなければならない。
新機能の実装 PR は対応するテストなしにマージしてはならない。
_Rationale:_ フレームワーク自身が TDD を推奨する以上、自分のコードにも同じ規律を適用する。

### Article 7 — ESM ネイティブ
`package.json` の `"type": "module"` を維持し、CommonJS（`require()`）への後退を禁止する。
動的 `import()` は許可するが、`createRequire` の使用は禁止する。
_Rationale:_ Node.js の標準に準拠し、将来の互換性を確保する。

### Article 8 — CLI の出力は人間が読める形式のみ
デフォルト出力は人間が読める形式とする。マシン向けの JSON 出力が必要な場合は明示的な `--json` フラグを設ける。
エラーは `stderr`、通常出力は `stdout` に書く。
_Rationale:_ CLI ツールとして Unix の慣習に従い、パイプやスクリプトとの組み合わせを壊さない。

### Article 9 — テンプレート純粋性（ドッグフーディング汚染防止）
`templates/` ディレクトリには、開発者固有の識別子（ホームパス・ユーザー名・SSH鍵パス・プライベートメール等）を一切含めてはならない。
新しいテンプレートファイルをコミットする前に `npm run check:templates` が合格しなければならない。
ドッグフーディング中に AI が生成したスペック・プラン・実装ノートを `templates/` に直接コピーすることを禁止する。
_Rationale:_ Aura-SDD はドッグフーディング（本フレームワーク自身で開発）を採用しているため、開発コンテキストが配布物に混入するリスクが常に存在する。テンプレートは npm パッケージとして全世界に配布されるため、開発者個人情報の混入は重大なセキュリティ・品質インシデントとなる。

## Constitutional Gates

`/aura-plan` および `/aura-validate-design` は以下のゲートをチェックする：

| Gate | 確認内容 | 対応 Article |
|------|---------|-------------|
| G-1 | この変更は `dependencies` にパッケージを追加するか？ | Article 1 |
| G-2 | `@ts-ignore` / `as any` を使用しているか？ | Article 2 |
| G-3 | ファイル書き込みに `assertSafePath` を通しているか？ | Article 3 |
| G-4 | スキルロジックを `src/` に埋め込んでいないか？ | Article 4 |
| G-5 | 既存の `.aura/settings/` や `.aura/workflows/` を上書きしていないか？ | Article 5 |
| G-6 | 新モジュールに対応するテストファイルがあるか？ | Article 6 |
| G-7 | `require()` / `createRequire` を使用していないか？ | Article 7 |
| G-8 | エラー出力を `stderr` に書いているか？ | Article 8 |
| G-9 | `templates/` に開発者固有の識別子が含まれていないか？（`npm run check:templates` 合格） | Article 9 |

## Amendment Process

Constitution の改訂には以下のプロセスが必要：

1. `/aura-spec` で改訂を名前付きで起票する
2. `spec.md` に改訂の理由・影響範囲を記載する
3. `/aura-plan` 実行時に Constitutional Gate が警告を出す
4. 人間の明示的な承認を得てから実装する

## Amendment History

| Version | Date | Article | Change | Rationale |
|---------|------|---------|--------|-----------|
| 1.0 | 2026-06-09 | All | 初版制定 | プロジェクト開始 |
| 1.1 | 2026-06-09 | Article 9 追加 | テンプレート純粋性条項を追加 | ドッグフーディング中の開発コンテキスト汚染リスクに対応 |
