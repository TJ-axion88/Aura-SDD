# Roadmap: Aura-SDD v3.0

## Specs（依存順）

1. `001-workflow-bugs` — ワークフローエンジンの重大バグ5件を修正 [_Depends:_ なし]
2. `002-workflow-enhancements` — switch/fan_in/while_loop/do_while ステップ型追加 [_Depends:_ 001-workflow-bugs]
3. `003-spec-refine-skill` — /aura-spec-refine スキル実装（Aura-SDD 独自機能） [_Depends:_ なし]
4. `004-spec-intelligence` — spec-batch 境界衝突検出 + spec-status ヘルス指標 + discovery from-git [_Depends:_ なし]

## 優先度マトリクス

| Spec | 影響 | 実装コスト | 優先度 |
|------|------|-----------|--------|
| 001-workflow-bugs | 高（ワークフロー機能全体が破損） | 低 | P0 |
| 003-spec-refine-skill | 高（競合差別化） | 中 | P1 |
| 002-workflow-enhancements | 中（spec-kit との機能パリティ） | 中 | P1 |
| 004-spec-intelligence | 高（競合超越） | 中 | P1 |

## v3.0 で達成する競合優位性

| 機能 | cc-sdd v3.0 | spec-kit v0.9 | Aura-SDD v3.0 |
|------|------------|---------------|----------------|
| ワークフローステップ型 | なし | 10種 | 8種（修正後） |
| スペック段階的精緻化 | なし | なし | ✓ /aura-spec-refine |
| 境界衝突検出 | なし | なし | ✓ spec-batch |
| git差分からブリーフ生成 | なし | なし | ✓ discovery --from-git |
| スペックヘルス指標 | なし | なし | ✓ spec-status |
| ゼロ実行時依存 | ✓ | ✗（Python deps） | ✓ |
| 多言語対応 | 13言語 | 英語主体 | 13言語+ |
| 対立的レビュー | ✓ | ✗ | ✓ |
