# [要件詳細] SCR-015: 在庫調整

> 非機能要件・プロジェクト概要は [renew_REQUIREMENTS.md](renew_REQUIREMENTS.md) を参照すること。

---

## 機能概要

入出荷フローでは管理しきれなかった在庫の差異（棚卸差異・破損・紛失・数量修正など）を手動で強制的に適用する画面。  
対象商品・棚ロケ・数量（増減）を指定し、確認モーダルを経て在庫へ直接反映する。

> **モックアップ方針**: 登録後のフィードバックメッセージは表示しない。

---

## 機能詳細

### 機能0: 警告バナー

- [ ] ページタイトル直下に警告バナーを表示する
- [ ] 文言: 「この画面で入力したデータは**確定情報**として在庫へ直接反映されます。内容をよく確認してから登録してください。」
- [ ] バナーの配色は `warning` ロール（黄系）を使用する（SCR-006 の `.warning-banner` を流用）

---

### 機能1: 在庫調整フォーム

- [ ] フォームのフィールド構成:

| フィールド | 入力種別 | 必須 | 備考                                                                              |
| ---------- | -------- | ---- | --------------------------------------------------------------------------------- |
| 商品コード | select   | ○    | ダミーデータの商品一覧から選択。選択すると商品名・単位区分を自動補完              |
| 商品名     | select   | ○    | 商品コードと同じ候補から商品名で選択。選択すると商品コード・単位区分を自動補完    |
| 単位区分   | select   | ○    | 商品コードまたは商品名選択により自動補完（編集不可）。商品1件につき1種類          |
| ロット番号 | text     |      |                                                                                   |
| 賞味期限   | date     |      |                                                                                   |
| 棚ロケ     | select   | ○    | SCR-001の登録済み棚ロケ一覧から選択。未選択可（プレースホルダー「棚ロケを選択」） |
| 数量       | number   | ○    | 符号付き整数（正=増加、負=減少）。0以外の整数                                     |

- [ ] 商品コード・商品名・単位区分の補間挙動:
  - 商品コードを選択 → 商品名・単位区分を自動セット
  - 商品名を選択 → 商品コード・単位区分を自動セット
  - 単位区分は常に読み取り専用（`readonly` または `disabled`）
- [ ] ボタンを1種類表示する:
  - **「登録する」**: 確認モーダルを表示する

---

### 機能2: 確認モーダル

- [ ] 「登録する」ボタン押下で確認モーダルを表示する
- [ ] モーダルのタイトル: 「在庫調整の確認」
- [ ] モーダル内に入力内容の全項目を一覧表示する:

| 表示ラベル | 値                        |
| ---------- | ------------------------- |
| 商品コード | 選択値                    |
| 商品名     | 選択値                    |
| 単位区分   | 選択値                    |
| ロット番号 | 入力値（未入力時は「—」） |
| 賞味期限   | 入力値（未入力時は「—」） |
| 棚ロケ     | 選択値                    |
| 数量       | 入力値（例: `+10`・`-5`） |

- [ ] モーダルのボタンを2種類表示する:
  - **「キャンセル」**: モーダルを閉じてフォームに戻る
  - **「確認して登録」**: モーダルを閉じる（登録確定のイメージ）

---

## 画面設計

> 技術スタック・共通設計は renew_REQUIREMENTS.md を参照すること。

### ファイル

- **HTML**: `renew_templates/015_inventory_adjustment.html`
- **CSS**: `static/css/style.css`（流用・追記）
- **JS**: `static/js/main.js`（流用・追記）

---

### レイアウト構成

```text
+--------------------------------------------+
| ページ見出し: 在庫調整                       |
+--------------------------------------------+
| ⚠ この画面で入力したデータは確定情報として   |
|   在庫へ直接反映されます。内容をよく確認し   |
|   てから登録してください。                   |
+--------------------------------------------+
| [セクション] 在庫調整情報入力                |
|  商品コード[▼___]  商品名    [▼___]          |
|  単位区分  [____]（自動補完・読取専用）      |
|  ロット番号[____]  賞味期限  [____]          |
|  棚ロケ   [▼___]  数量       [±___]          |
|                          [登録する]          |
+--------------------------------------------+

--- 「登録する」押下後 ---

+--------------------------------------------+
|  [モーダル] 在庫調整の確認                  |
|  商品コード : XXXXX                         |
|  商品名     : XXXXX                         |
|  単位区分   : XXXXX                         |
|  ロット番号 : XXXXX / —                     |
|  賞味期限   : XXXXX / —                     |
|  棚ロケ     : XXXXX                         |
|  数量       : +10 / -5                      |
|         [キャンセル] [確認して登録]          |
+--------------------------------------------+
```

---

### 使用コンポーネント（Atlassian Design System）

| コンポーネント   | 用途                                 | トークン・備考                                         |
| ---------------- | ------------------------------------ | ------------------------------------------------------ |
| Page header      | ページ見出し「在庫調整」             | `heading-xl` (1.75rem)                                 |
| Warning Banner   | 警告バナー（ページタイトル直下）     | SCR-006 の `.warning-banner` を流用                    |
| Card (Raised)    | セクション外枠                       | `elevation.surface.raised` + `elevation.shadow.raised` |
| Section heading  | カード内の機能名見出し               | `heading-m` (1.25rem)                                  |
| Select           | 商品コード・商品名・単位区分・棚ロケ | `<select>` + `background-input` + `border-input`       |
| Text field       | ロット番号                           | `<input type="text">`                                  |
| Date field       | 賞味期限                             | `<input type="date">`                                  |
| Number field     | 数量（符号付き整数）                 | `<input type="number">`                                |
| Button (Primary) | 「登録する」・「確認して登録」ボタン | `background-brand-bold`                                |
| Button (Default) | 「キャンセル」ボタン                 | `background-neutral`                                   |
| Modal            | 確認モーダル                         | SCR-007 等の既存 `.modal-overlay` を流用               |

---

### フォームフィールドレイアウト

2カラムグリッドで配置する。

| 左カラム             | 右カラム |
| -------------------- | -------- |
| 商品コード           | 商品名   |
| 単位区分（読取専用） | （空白） |
| ロット番号           | 賞味期限 |
| 棚ロケ               | 数量     |

---

### HTML 要素 ID

| id                   | フィールド                       | 備考                       |
| -------------------- | -------------------------------- | -------------------------- |
| `adjustmentForm`     | フォーム全体（初期化トリガー）   |                            |
| `adjItemCode`        | 商品コード `<select>`            |                            |
| `adjItemName`        | 商品名 `<select>`                |                            |
| `adjUnitType`        | 単位区分 `<select>`              | `disabled`（自動補完のみ） |
| `adjLotNo`           | ロット番号 `<input type="text">` |                            |
| `adjExpiryDate`      | 賞味期限 `<input type="date">`   |                            |
| `adjShelfLocation`   | 棚ロケ `<select>`                |                            |
| `adjQuantity`        | 数量 `<input type="number">`     | step=1、0以外              |
| `adjustmentModal`    | 確認モーダル外枠                 |                            |
| `modalItemCode`      | モーダル内：商品コード表示       |                            |
| `modalItemName`      | モーダル内：商品名表示           |                            |
| `modalUnitType`      | モーダル内：単位区分表示         |                            |
| `modalLotNo`         | モーダル内：ロット番号表示       |                            |
| `modalExpiryDate`    | モーダル内：賞味期限表示         |                            |
| `modalShelfLocation` | モーダル内：棚ロケ表示           |                            |
| `modalQuantity`      | モーダル内：数量表示             |                            |

---

### CSSクラス

| クラス名                  | 流用/新規       | 用途                                                                                                                                        |
| ------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `.warning-banner`         | 流用（SCR-006） | 警告バナー外枠                                                                                                                              |
| `.section-card`           | 流用            | Card (Raised) のセクション外枠                                                                                                              |
| `.section-heading`        | 流用            | カード内の機能名見出し                                                                                                                      |
| `.manual-form-grid`       | 流用            | 2カラムグリッド                                                                                                                             |
| `.manual-form-field`      | 流用            | フィールドラベル + inputのペア                                                                                                              |
| `.manual-form-label`      | 流用            | フィールドラベル                                                                                                                            |
| `.manual-form-required`   | 流用            | 必須マーク `*`                                                                                                                              |
| `.manual-form-actions`    | 流用            | ボタン行                                                                                                                                    |
| `.modal-overlay`          | 流用            | モーダル背景オーバーレイ                                                                                                                    |
| `.modal-content`          | 流用            | モーダル本体カード                                                                                                                          |
| `.modal-confirm-table`    | **新規**        | モーダル内確認項目テーブル。`width: 100%; border-collapse: collapse; margin: space.200 0`                                                   |
| `.modal-confirm-table th` | **新規**        | ラベル列。`text-align: left; width: 8rem; padding: space.075 space.100; font-size: 0.75rem; font-weight: 600; color: var(--ds-text-subtle)` |
| `.modal-confirm-table td` | **新規**        | 値列。`padding: space.075 space.100; font-size: 0.875rem; color: var(--ds-text)`                                                            |
| `.modal-confirm-table tr` | **新規**        | 行区切り。`border-bottom: 1px solid var(--ds-border)`                                                                                       |
| `.modal-actions`          | **新規**        | モーダルのボタン行。`display: flex; justify-content: flex-end; gap: space.100; margin-top: space.300`                                       |

---

### JS 関数

#### 定数

| 定数名             | 内容                                                                                |
| ------------------ | ----------------------------------------------------------------------------------- |
| `ADJUSTMENT_ITEMS` | 商品マスタダミーデータ: `[{ code: 'ITM-001', name: '商品A', unit: 'ケース' }, ...]` |

#### 関数

| 関数名                     | 概要                                                                              |
| -------------------------- | --------------------------------------------------------------------------------- |
| `initAdjustmentForm()`     | フォームの初期化。商品コード・商品名・棚ロケのセレクトを動的生成する              |
| `populateAdjItemSelects()` | `ADJUSTMENT_ITEMS` から `#adjItemCode` と `#adjItemName` の `<option>` を生成する |
| `onAdjItemCodeChange()`    | `#adjItemCode` 変更時に `#adjItemName` と `#adjUnitType` を自動セットする         |
| `onAdjItemNameChange()`    | `#adjItemName` 変更時に `#adjItemCode` と `#adjUnitType` を自動セットする         |
| `openAdjustmentModal()`    | フォームの入力値を検証し、モーダルに各値をセットして表示する                      |
| `closeAdjustmentModal()`   | モーダルを非表示にする                                                            |
| `confirmAdjustment()`      | モーダルの「確認して登録」押下時。モーダルを閉じる（登録確定のモックアップ動作）  |

#### 初期化トリガー

```js
if (document.getElementById("adjustmentForm")) {
  initAdjustmentForm();
}
```

#### 各関数の詳細動作

**`populateAdjItemSelects()`**

`ADJUSTMENT_ITEMS` をループし、`#adjItemCode` と `#adjItemName` の両方に `<option>` を生成する。先頭に未選択用 `<option value="">選択してください</option>` を配置する。

```text
adjItemCode: <option value="ITM-001">ITM-001</option> ...
adjItemName: <option value="ITM-001">商品A</option>  ...
※ value には商品コードを統一して使用する
```

**`onAdjItemCodeChange()`**

`#adjItemCode` の選択値（商品コード）をキーに `ADJUSTMENT_ITEMS` を検索し、該当商品の `name` を `#adjItemName` に、`unit` を `#adjUnitType` にセットする。未選択時はいずれもリセットする。

**`onAdjItemNameChange()`**

`#adjItemName` の選択値（商品コード）をキーに `ADJUSTMENT_ITEMS` を検索し、同商品の `code` を `#adjItemCode` に、`unit` を `#adjUnitType` にセットする。未選択時はいずれもリセットする。

**`openAdjustmentModal()`**

1. 必須項目（商品コード・棚ロケ・数量）の未入力を検証する。不備があれば処理中断
2. 数量が `0` の場合も検証エラーとする
3. 各入力値をモーダル内の対応要素（`#modalItemCode` 等）にセットする
4. 未入力の任意項目は `「—」` を表示する
5. 数量は符号を明示して表示する（例: `+10`・`-5`）
6. `#adjustmentModal` を表示する（`display: flex` 等）

**`closeAdjustmentModal()`**

`#adjustmentModal` を非表示にする（`display: none`）。フォームの値は変更しない。

**`confirmAdjustment()`**

`closeAdjustmentModal()` を呼び出してモーダルを閉じる（モックアップのため実際のAPI送信は行わない）。

#### HTML側で必要な要素ID（全体）

| id                   | 要素                    | 属性・備考                                                                 |
| -------------------- | ----------------------- | -------------------------------------------------------------------------- |
| `adjustmentForm`     | `<form>`                | 初期化トリガー                                                             |
| `adjItemCode`        | `<select>`              | `required`。`onchange="onAdjItemCodeChange()"`                             |
| `adjItemName`        | `<select>`              | `required`。`onchange="onAdjItemNameChange()"`                             |
| `adjUnitType`        | `<select>`              | `disabled`。選択肢はパレット・ケース・ボール・ピース（自動補完用）         |
| `adjLotNo`           | `<input type="text">`   |                                                                            |
| `adjExpiryDate`      | `<input type="date">`   |                                                                            |
| `adjShelfLocation`   | `<select>`              | `required`。先頭に `<option value="">棚ロケを選択</option>`                |
| `adjQuantity`        | `<input type="number">` | `required`・`step="1"`・`placeholder="+10 または -5"`（0以外を JS で検証） |
| `adjustmentModal`    | `<div>`                 | モーダル外枠。初期状態 `display: none`。`.modal-overlay`                   |
| `modalItemCode`      | `<td>`                  | モーダル確認テーブルの値セル                                               |
| `modalItemName`      | `<td>`                  | 同上                                                                       |
| `modalUnitType`      | `<td>`                  | 同上                                                                       |
| `modalLotNo`         | `<td>`                  | 同上                                                                       |
| `modalExpiryDate`    | `<td>`                  | 同上                                                                       |
| `modalShelfLocation` | `<td>`                  | 同上                                                                       |
| `modalQuantity`      | `<td>`                  | 同上。符号付きで表示（例: `+10`）                                          |

---

### スペーシング規則

SCR-006 の手動入力フォームと同一のスペーシングを適用する。

| 箇所                               | トークン    | px相当 |
| ---------------------------------- | ----------- | ------ |
| カード内パディング                 | `space.300` | 24px   |
| セクション見出しとコンテンツの間隔 | `space.150` | 12px   |
| フォームグリッドの列間隔           | `space.200` | 16px   |
| フォームグリッドの行間隔           | `space.200` | 16px   |
| フィールドラベルとinputの間隔      | `space.075` | 6px    |

---

## ダミーデータ定義

### 商品マスタ（`ADJUSTMENT_ITEMS`）

```js
const ADJUSTMENT_ITEMS = [
  { code: "ITM-001", name: "商品A", unit: "ケース" },
  { code: "ITM-002", name: "商品B", unit: "ピース" },
  { code: "ITM-003", name: "商品C", unit: "パレット" },
  { code: "ITM-004", name: "商品D", unit: "ボール" },
  { code: "ITM-005", name: "商品E", unit: "ケース" },
];
```

棚ロケのセレクトボックスには SCR-001 のダミーデータ（`shelfLocations` 変数）を流用する。

---

## 変更履歴

| 日時       | 変更者 | 変更内容                                                                          |
| ---------- | ------ | --------------------------------------------------------------------------------- |
| 2026/05/25 | -      | ファイル新規作成（要件定義前）                                                    |
| 2026/05/25 | -      | 要件定義（機能概要・機能詳細・画面設計・ダミーデータ）を追加                      |
| 2026/05/25 | -      | 画面設計を詳細化（CSS新規クラスのプロパティ・JS関数詳細動作・HTML要素属性）を追加 |
