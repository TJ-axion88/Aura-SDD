# Tech Steering

## Stack

- **Runtime**: Node.js (ES2022+)
- **Language**: TypeScript 5.6+（strict mode 必須）
- **Module System**: ESM ネイティブ（`"type": "module"`）
- **Testing**: Vitest 2.x
- **Build**: `tsc`（TypeScript コンパイラのみ）
- **実行時依存**: なし（ゼロ）

## Development Commands

```bash
npm run build      # TypeScript → dist/ にコンパイル
npm test           # Vitest でテスト実行
npm run test:watch # ウォッチモード
node ./dist/cli.js # ローカルビルドを直接実行
```

## Key Standards

- `strict: true` を `tsconfig.json` で常に維持
- `@ts-ignore` / `as any` 禁止（型安全を保証）
- `require()` / `createRequire` 禁止（ESM 維持）
- ファイル書き込みは必ず `assertSafePath()` を通す
- `console.error` → `stderr`、それ以外 → `stdout`
- テンプレート変数は `{{VARIABLE_NAME}}` 形式（大文字スネークケース）

## Key Architectural Decisions

| 決定 | 理由 |
|------|------|
| ゼロ実行時依存 | ユーザー環境への副作用を完全排除。インストールサイズを最小化 |
| テンプレート駆動のスキル管理 | `src/` を変更せずにエージェント追加・スキル追加が可能 |
| JSON マニフェストによるインストール定義 | どのファイルをどこに置くかを宣言的に管理 |
| ESM ネイティブ | Node.js の標準に準拠。将来の互換性を確保 |
| Vitest（Jest 互換） | 設定ゼロで ESM ネイティブテストが可能 |
| `dist/` を配布 | TypeScript ソースをそのまま配布しない。ビルド済みを `npm publish` |

## Template Variable Reference

| 変数 | 内容 |
|------|------|
| `{{AGENT}}` | エージェントキー（例: `claude-code`） |
| `{{AGENT_LABEL}}` | エージェント表示名（例: `Claude Code`） |
| `{{AGENT_DIR}}` | エージェント設定ディレクトリ（例: `.claude`） |
| `{{AGENT_COMMANDS_DIR}}` | スキルインストール先（例: `.claude/skills`） |
| `{{LANG}}` | 言語コード（例: `ja`） |
| `{{AURA_DIR}}` | Aura 設定ディレクトリ（デフォルト: `.aura`） |
| `{{PROFILE}}` | プロファイル（`full` / `lean` / `minimal`） |
| `{{VERSION}}` | フレームワークバージョン（例: `2.0.0`） |
| `{{OS}}` | OS（`mac` / `windows` / `linux`） |
