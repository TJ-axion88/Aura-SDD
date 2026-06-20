# Aura-SDD への貢献ガイド

Aura-SDD へのコントリビューションを歓迎します。

---

## 開発環境のセットアップ

```bash
git clone https://github.com/axionsoft88/Aura-SDD.git
cd Aura-SDD
npm install
npm test        # 全テスト実行（60テスト）
npm run build   # TypeScript ビルド
```

---

## プロジェクト構造

```
src/
  agents/       — エージェント定義（registry.ts）
  cli/          — CLI 引数・設定・メイン処理
  manifest/     — マニフェストローダー・プランナー・プロセッサー
  preset/       — プリセット管理
  template/     — テンプレートレンダラー・コンテキスト
  utils/        — ファイル操作・パス安全性・言語サポート
  workflow/     — ワークフローエンジン・ステップ型実装
templates/
  agents/       — 各エージェント向けスキル・コマンドファイル
  manifests/    — エージェントごとのインストール定義（JSON）
  shared/       — 共通設定・テンプレート・ワークフロー・プリセット
test/           — Vitest テストスイート
scripts/        — ビルドスクリプト・フック設定
```

---

## 貢献の種類

### 新しいエージェントの追加

1. `templates/agents/<agent-name>/` にスキル/コマンドファイルを作成
2. `templates/manifests/<agent-name>.json` でインストール定義を記述
3. `src/agents/registry.ts` にエージェント定義を追加
4. `test/agents.test.ts` のアサーションを更新
5. テンプレート純粋性チェック（`npm run check:templates`）を通過させる

**Article 4 原則**: 新エージェントの追加は `templates/` と `src/agents/registry.ts` のみで完結し、`src/` の他コードを変更してはならない。

### 新しいスキルの追加

1. `templates/agents/<agent>/skills/<skill-name>/SKILL.md` を全エージェント分作成
2. スキルには必ず `---\nname: ...\ndescription: ...\n---` フロントマターを記述
3. テンプレートに個人情報（絶対パス・メールアドレス等）を含めない

### バグ修正

1. 再現するテストを先に書く（TDD）
2. 修正を実装
3. `npm test` で全テスト通過を確認

---

## テンプレート純粋性

テンプレートファイルに以下を含めてはならない：

- 絶対ホームパス（`/home/<user>/`、`/Users/<user>/`）
- git no-reply メールアドレス
- プロジェクト固有の SSH 鍵パス

```bash
npm run check:templates  # 純粋性チェック
```

pre-commit フックでも自動実行されます。

---

## テスト

```bash
npm test              # 全テスト実行
npm run test:watch    # ウォッチモード
```

テストスイート構成：
- `workflow.test.ts` — ワークフローステップ型（20テスト）
- `template-purity.test.ts` — テンプレート純粋性（5テスト）
- `agents.test.ts` — エージェント定義（3テスト）
- `args.test.ts` — CLI引数パーサー（10テスト）
- `renderer.test.ts` — テンプレートレンダラー（3テスト）
- `pathSafety.test.ts` — パス安全性（8テスト）

---

## コミットメッセージ規約

```
<type>: <日本語または英語の簡潔な説明>

feat:   新機能追加
fix:    バグ修正
docs:   ドキュメント更新
test:   テスト追加・修正
chore:  ビルド・設定変更
refactor: リファクタリング
security: セキュリティ修正
```

---

## プルリクエスト

- `main` ブランチへの PR を作成
- テンプレート純粋性チェックが通過していること（CI で自動チェック）
- `npm test` が全テスト通過していること
- 変更内容を日本語または英語で説明

---

## ライセンス

コントリビューションは MIT ライセンスの下で提供されたものとみなします。
