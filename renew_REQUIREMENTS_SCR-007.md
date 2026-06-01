# [要件詳細] SCR-006: 入荷登録

> 非機能要件・プロジェクト概要は [renew_REQUIREMENTS.md](renew_REQUIREMENTS.md) を参照すること。

---

## 機能概要

実際の入荷情報（確定情報）を手動入力で登録する画面。在庫に直接影響するため、棚ロケの指定が必須となる。SCR-003（入荷予定一覧）とは独立した単独登録画面。

> **モックアップ方針**: 登録後のフィードバックメッセージは表示しない。

---

## 機能詳細

### 機能0: 警告バナー

- [ ] ページタイトル直下に警告バナーを表示する
- [ ] 文言: 「この画面で入力したデータは**確定情報**として在庫へ直接反映されます。内容をよく確認してから登録してください。」
- [ ] バナーの配色は `warning` ロール（黄系）を使用する

---

### 機能1: 手動入力フォーム

- [ ] フォームのフィールド構成:

| フィールド | 入力種別 | 必須 | 備考 |
| --- | --- | --- | --- |
| 入荷日 | date | ○ | |
| 入荷時刻 | time | | |
| 伝票No | text | ○ | |
| 入荷元 | text | | |
| 商品コード | text | ○ | |
| 商品名 | text | ○ | |
| 棚ロケ | select | ○ | SCR-001の登録済み棚ロケ一覧から選択。未選択可（プレースホルダー「棚ロケを選択」） |
| 数量 | number | ○ | 1以上の整数 |
| 単位区分 | select | | パレット・ケース・ボール・ピース。未選択可 |
| ロット番号 | text | | |
| 賞味期限 | date | | |
| 特記事項 | text | | |

- [ ] ボタンを2種類表示する:
  - **「登録して続ける」**: フォームを部分的にリセットし、同画面に留まる
  - **「登録する」**: フォームを送信後、SCR-003（入荷予定一覧）へ遷移する
- [ ] 「登録して続ける」押下後の引き継ぎ挙動:
  - 引き継ぐ項目: 入荷日・入荷時刻・伝票No・入荷元
  - クリアする項目: 商品コード・商品名・棚ロケ・数量・単位区分・ロット番号・賞味期限・特記事項

---

## 画面設計

> 技術スタック・共通設計は renew_REQUIREMENTS.md を参照すること。

### ファイル

- **HTML**: `renew_templates/006_inbound_register.html`
- **CSS**: `static/css/style.css`（流用・追記）
- **JS**: `static/js/main.js`（流用・追記）

---

### レイアウト構成

```text
+--------------------------------------------+
| ページ見出し: 入荷登録                   |
+--------------------------------------------+
| ⚠ この画面で入力したデータは確定情報として   |
|   在庫へ直接反映されます。内容をよく確認し   |
|   てから登録してください。                   |
+--------------------------------------------+
| [セクション] 入荷情報入力                    |
|  入荷日   [____]  入荷時刻  [____]          |
|  伝票No   [____]  入荷元    [____]          |
|  商品コード[____]  商品名   [____]          |
|  棚ロケ   [▼___]  数量      [____]          |
|  単位区分 [▼___]  ロット番号 [____]          |
|  賞味期限 [____]                            |
|  特記事項 [____________________________]    |
|              [登録して続ける] [登録する]     |
+--------------------------------------------+
```

---

### 使用コンポーネント（Atlassian Design System）

| コンポーネント | 用途 | トークン・備考 |
| --- | --- | --- |
| Page header | ページ見出し「入荷登録」 | `heading-xl` (1.75rem) |
| Warning Banner | 警告バナー（ページタイトル直下） | `.warning-banner`。`background-warning` + `icon-warning` |
| Card (Raised) | セクション外枠 | `elevation.surface.raised` + `elevation.shadow.raised` |
| Section heading | カード内の機能名見出し | `heading-m` (1.25rem) |
| Text field | 各テキスト・数値・日付フィールド | `<input type="text/number/date/time">` |
| Select | 棚ロケ選択・単位区分選択 | `<select>` + `background-input` + `border-input` |
| Button (Primary) | 「登録する」ボタン | `background-brand-bold` |
| Button (Default) | 「登録して続ける」ボタン | `background-neutral` |

---

### フォームフィールドレイアウト

手動入力フォームは2カラムグリッドで配置する。特記事項のみ全幅。

| 左カラム | 右カラム |
| --- | --- |
| 入荷日 | 入荷時刻 |
| 伝票No | 入荷元 |
| 商品コード | 商品名 |
| 棚ロケ | 数量 |
| 単位区分 | ロット番号 |
| 賞味期限 | （空白） |
| 特記事項（全幅） | — |

---

### HTML 要素 ID

| id | フィールド | 「登録して続ける」後 |
| --- | --- | --- |
| `inboundDate` | 入荷日 | 引き継ぎ |
| `inboundTime` | 入荷時刻 | 引き継ぎ |
| `slipNo` | 伝票No | 引き継ぎ |
| `supplier` | 入荷元 | 引き継ぎ |
| `itemCode` | 商品コード | クリア |
| `itemName` | 商品名 | クリア |
| `shelfLocation` | 棚ロケ | クリア |
| `quantity` | 数量 | クリア |
| `unitType` | 単位区分 | クリア |
| `lotNo` | ロット番号 | クリア |
| `expiryDate` | 賞味期限 | クリア |
| `note` | 特記事項 | クリア |

---

### CSSクラス

`.warning-banner` のみ新規追加。その他は SCR-004 で実装済みのクラスを流用する。

| クラス名 | 流用/新規 | 用途 |
| --- | --- | --- |
| `.warning-banner` | **新規** | 警告バナー外枠。`display: flex; align-items: flex-start; gap: space.100; background: var(--ds-background-warning); border: 1px solid var(--ds-border-warning); border-radius: 3px; padding: space.150 space.200; margin-bottom: space.300` |
| `.warning-banner svg` | **新規** | 警告アイコン色。`color: var(--ds-icon-warning); flex-shrink: 0; margin-top: 1px` |
| `.warning-banner p` | **新規** | バナー本文。`margin: 0; line-height: 1.5` |
| `.section-card` | 流用 | Card (Raised) のセクション外枠 |
| `.section-heading` | 流用 | カード内の機能名見出し |
| `.manual-form-grid` | 流用 | 手動入力フォームの2カラムグリッド（`display: grid; grid-template-columns: 1fr 1fr`） |
| `.manual-form-field` | 流用 | フィールドラベル + inputのペア（`display: flex; flex-direction: column`） |
| `.manual-form-field--full` | 流用 | 特記事項など全幅フィールド（`grid-column: 1 / -1`） |
| `.manual-form-label` | 流用 | フィールドラベル（`font-size: 0.75rem; font-weight: 600`） |
| `.manual-form-required` | 流用 | 必須マーク `*`（`color: var(--ds-text-danger)`） |
| `.manual-form-qty` | 流用 | 数量フィールド幅制限（`max-width: 8rem`） |
| `.manual-form-actions` | 流用 | ボタン行（`display: flex; justify-content: flex-end`） |

---

### JS 関数

#### 定数

| 定数名 | 内容 |
| --- | --- |
| `INBOUND_REGISTER_KEEP` | 引き継ぎ項目のIDリスト: `['inboundDate', 'inboundTime', 'slipNo', 'supplier']` |
| `INBOUND_REGISTER_CLEAR` | クリア項目のIDリスト: `['itemCode', 'itemName', 'shelfLocation', 'quantity', 'unitType', 'lotNo', 'expiryDate', 'note']` |

#### 関数

| 関数名 | 概要 |
| --- | --- |
| `initInboundRegister()` | フォームの初期化。`#inboundDate` のデフォルト値を本日に設定し、`populateShelfSelect()` を呼ぶ |
| `populateShelfSelect()` | `shelfLocations`（グローバル変数）を参照し、`#shelfLocation` の `<option>` を動的生成する |
| `submitInboundAndContinue()` | `INBOUND_REGISTER_CLEAR` の各IDをリセット後、最初のクリアフィールドにフォーカスする |
| `submitInboundAndNavigate()` | `003_inbound_schedule_list.html` へ遷移する |

#### 初期化トリガー

```js
if (document.getElementById('inboundRegisterForm')) {
  initInboundRegister();
}
```

#### HTML側で必要な要素ID

| id | 用途 |
| --- | --- |
| `inboundRegisterForm` | フォーム全体（初期化トリガー） |
| `inboundDate` | 入荷日 `<input type="date">` |
| `inboundTime` | 入荷時刻 `<input type="time">` |
| `slipNo` | 伝票No `<input type="text">` |
| `supplier` | 入荷元 `<input type="text">` |
| `itemCode` | 商品コード `<input type="text">` |
| `itemName` | 商品名 `<input type="text">` |
| `shelfLocation` | 棚ロケ `<select>` |
| `quantity` | 数量 `<input type="number" min="1">` + `.manual-form-qty` |
| `unitType` | 単位区分 `<select>` |
| `lotNo` | ロット番号 `<input type="text">` |
| `expiryDate` | 賞味期限 `<input type="date">` |
| `note` | 特記事項 `<input type="text">` |

#### 棚ロケ選択肢の生成

`shelfLocations` はSCR-001用にグローバル定義済みの配列（`[{ code: 'A-01-01-1' }, ...]`）。`populateShelfSelect()` でこの配列をループし `<option value="code">code</option>` を `#shelfLocation` に追加する。先頭に未選択用 `<option value="">棚ロケを選択</option>` を配置する。

---

### スペーシング規則

SCR-004 の手動入力フォームと同一のスペーシングを適用する。

| 箇所 | トークン | px相当 |
| --- | --- | --- |
| カード内パディング | `space.300` | 24px |
| セクション見出しとコンテンツの間隔 | `space.150` | 12px |
| フォームグリッドの列間隔 | `space.200` | 16px |
| フォームグリッドの行間隔 | `space.200` | 16px |
| フィールドラベルとinputの間隔 | `space.075` | 6px |

---

## ダミーデータ定義

棚ロケのセレクトボックスには SCR-001 のダミーデータ（`shelfLocations` 変数）を流用する。

---

## 変更履歴

| 日時 | 変更者 | 変更内容 |
| --- | --- | --- |
| 2026/05/12 | - | 新規作成（renew体系） |
| 2026/05/12 | - | 画面設計セクション追加（CSS・JS・HTML要素ID詳細化） |
| 2026/05/12 | - | 警告バナー（機能0）を追加。要件・レイアウト・コンポーネント・CSS設計を更新 |
| 2026/05/12 | - | 画面タイトルを「入荷情報登録」→「入荷登録」に変更 |
