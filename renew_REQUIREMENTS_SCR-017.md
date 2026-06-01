# [要件詳細] SCR-016: 棚ロケ移動登録

> 非機能要件・プロジェクト概要は [renew_REQUIREMENTS.md](renew_REQUIREMENTS.md) を参照すること。

---

## 機能概要

棚ロケ間の在庫移動を手動入力で1件ずつ登録する画面。移動元棚ロケを入力すると該当在庫が一覧表示され、対象行を選択後に移動先棚ロケと移動数量を入力して登録する。

---

## 操作フロー

```text
[1] 移動元棚ロケを入力
    ↓ 入力値でリアルタイムにテーブルを絞り込み
[2] 在庫テーブルから対象行をクリックして選択
    ↓ 選択情報が「移動内容入力フォーム」に反映され、入力フィールドが有効化される
[3] 移動先棚ロケ・移動数量を入力
[4] 「登録」ボタンをクリック
    ↓
[5] 確認ダイアログ表示（移動内容の概要を表示）
    ↓ OK
[6] フラッシュメッセージ「移動登録が完了しました」を表示
    フォームをリセット（テーブル選択解除・入力値クリア）
```

---

## 機能詳細

### 機能1: 移動元棚ロケ検索

- [ ] 移動元棚ロケを入力するテキストフィールドを配置する
- [ ] 入力値の前方一致で在庫テーブルの表示行をリアルタイムにフィルタリングする
- [ ] フィールドをクリアすると全件表示に戻る
- [ ] 検索は大文字・小文字を区別しない
- [ ] 「移動元棚ロケ」ラベルを付与する

### 機能2: 在庫テーブル

- [ ] 移動元の在庫データをテーブル形式で表示する（モックアップのためダミーデータをハードコードで表示、計25件）
- [ ] テーブルヘッダーはスクロール時も常に表示する（sticky）
- [ ] テーブルのカラム:
  - `棚ロケ`
  - `商品コード`
  - `商品名`
  - `ロット番号`
  - `数量`
  - `単位区分`
  - `特記事項`
- [ ] 行をクリックすると選択状態になる（単一選択。再クリックで選択解除）
- [ ] 選択行はハイライト表示する（背景色: `color.background.selected`）
- [ ] 選択時、選択行の内容（棚ロケ・商品コード・商品名・ロット番号・数量）を移動内容入力フォームに反映する

### 機能3: 移動内容入力フォーム

- [ ] 移動対象行を選択した後に入力可能となるフォームを配置する
- [ ] 行未選択時はフォーム全体を無効化（`disabled`）する
- [ ] フォームのフィールド:

| フィールド名     | 種別           | 備考                                                                         |
| ---------------- | -------------- | ---------------------------------------------------------------------------- |
| 棚ロケ（元）     | テキスト表示   | 選択行から自動反映。編集不可（`readonly`）                                   |
| 商品コード       | テキスト表示   | 選択行から自動反映。編集不可（`readonly`）                                   |
| 商品名           | テキスト表示   | 選択行から自動反映。編集不可（`readonly`）                                   |
| ロット番号       | テキスト表示   | 選択行から自動反映。編集不可（`readonly`）                                   |
| 在庫数量         | テキスト表示   | 選択行から自動反映。編集不可（`readonly`）。参照用として表示                 |
| 移動数量         | 数値入力       | 1以上・在庫数量以下の整数。未入力または範囲外は登録ボタンを無効化            |
| 棚ロケ（先）     | テキスト入力   | 移動先棚ロケ。未入力は登録ボタンを無効化。棚ロケ（元）と同値は登録ボタンを無効化 |

- [ ] 「登録」ボタンを配置する
- [ ] 下記いずれかの条件を満たさない場合、「登録」ボタンを無効化する:
  - 在庫テーブルの行が選択されていること
  - 移動数量が 1 以上・在庫数量以下の整数であること
  - 棚ロケ（先）が入力されており、棚ロケ（元）と異なること

### 機能4: 確認ダイアログ

- [ ] 「登録」ボタンクリック時にダイアログを表示する
- [ ] ダイアログに表示する内容:
  - 「以下の内容で棚ロケ移動を登録しますか？」
  - 棚ロケ（元）・商品コード・商品名・ロット番号・移動数量・棚ロケ（先）
- [ ] 「OK」「キャンセル」の2ボタンを配置する
- [ ] 「OK」クリックで登録完了処理を実行する
- [ ] 「キャンセル」クリックでダイアログを閉じ、フォームの状態を保持する

### 機能5: 登録完了処理

- [ ] ダイアログ「OK」クリック後、フラッシュメッセージ「移動登録が完了しました」を画面上部に表示する（Success: `color.background.success`）
- [ ] フラッシュメッセージは3秒後に自動消去する
- [ ] フォームをリセットする:
  - 在庫テーブルの選択を解除する
  - 移動内容入力フォームの入力値をクリアし、無効化（`disabled`）状態に戻す
  - 移動元棚ロケ入力フィールドはクリアしない（同一棚ロケへの連続操作に備える）

---

## 画面設計

> 技術スタック・共通設計は renew_REQUIREMENTS.md を参照すること。

### ファイル

- **HTML**: `renew_templates/016_location_transfer.html`
- **CSS**: `static/css/style.css`（流用・追記）
- **JS**: `static/js/main.js`（流用・追記）

---

### レイアウト構成

```text
┌──────────────────────────────────────── viewport ────┐
│ [ヘッダー 固定]                                       │
├────────┬─────────────────────────────────────────────┤
│ サイド  │ [移動元棚ロケ: ___________]                  │← 検索行
│ バー    │                                             │
│        ├─────────────────────────────────────────────┤
│        │ 移動元在庫                         全 XX 件  │← セクション見出し
│        │  棚ロケ │ 商品コード │ … ← sticky           │
│        │  td    │ td        │ …                     │ ← クリックで選択
│        │  [選択行ハイライト]                          │
│        ├─────────────────────────────────────────────┤
│        │ 移動内容                                     │← セクション見出し
│        │  棚ロケ（元）: [-----]  商品コード: [-----]   │
│        │  商品名: [-----]         ロット番号: [-----] │
│        │  在庫数量: [-----]       移動数量: [____]    │
│        │  棚ロケ（先）: [____________________]        │
│        │                              [登録] ボタン   │
└────────┴─────────────────────────────────────────────┘
```

ページは通常スクロール。

---

### レイアウト実現方式

| 要素                      | 設定                           | 備考                          |
| ------------------------- | ------------------------------ | ----------------------------- |
| `<body>`                  | クラス追加なし                 | `.schedule-page` は適用しない |
| `<main class="app-main">` | 通常フロー                     | `overflow: visible`           |
| `.transfer-table-wrapper` | `overflow-x: auto` のみ        | 縦は制限しない                |
| `thead th`                | `position: sticky; top: 0`     | 横スクロール時もヘッダー固定  |

---

### 使用コンポーネント（Atlassian Design System）

| コンポーネント | 用途                                       | トークン・備考                                                                 |
| -------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| Page header    | ページ見出し「棚ロケ移動登録」             | `heading-xl` (1.75rem)                                                         |
| Text input     | 移動元棚ロケ検索・棚ロケ（先）入力         | `placeholder="棚ロケを入力"`                                                   |
| Number input   | 移動数量入力                               | `min="1"`                                                                      |
| Card (Raised)  | 各セクション外枠（在庫テーブル・入力フォーム） | 既存 `.section-card` 流用                                                  |
| Section heading | カード内見出し                            | `heading-m` (1.25rem)                                                          |
| Table          | 移動元在庫一覧                             | ヘッダー `text-subtle`・sticky・横スクロール対応・行クリック選択               |
| Form fields    | 移動内容入力フォーム                       | `readonly` フィールドはフォーカス無効、`disabled` 時は全フィールドに適用       |
| Button (Primary) | 登録ボタン                               | 無効条件を満たさない場合 `disabled`                                            |
| Modal dialog   | 確認ダイアログ                             | 既存 `.modal-overlay` 流用。ボタン: 「OK」（Primary）・「キャンセル」（Subtle） |
| Flag / Banner  | フラッシュメッセージ                       | 成功時: `color.background.success`・3秒後自動消去                              |

---

### フォームフィールドレイアウト

移動内容入力フォームは2カラムグリッドで配置する。棚ロケ（先）のみ全幅。

| 左カラム     | 右カラム   |
| ------------ | ---------- |
| 棚ロケ（元） | 商品コード |
| 商品名       | ロット番号 |
| 在庫数量     | 移動数量   |
| 棚ロケ（先）（全幅） | — |

---

### HTML 要素 ID

| id                        | フィールド               | 要素種別                                |
| ------------------------- | ------------------------ | --------------------------------------- |
| `transferLocationSearch`  | 移動元棚ロケ（検索）     | `<input type="text">`                   |
| `transferTableBody`       | 在庫テーブル tbody       | `<tbody>`                               |
| `transferTotalCount`      | 全 XX 件 表示            | `<span>`                                |
| `transferForm`            | 移動内容フォーム全体     | `<fieldset>`（`disabled` 制御に使用）   |
| `transferSrcLocation`     | 棚ロケ（元）             | `<input type="text" readonly>`          |
| `transferItemCode`        | 商品コード               | `<input type="text" readonly>`          |
| `transferItemName`        | 商品名                   | `<input type="text" readonly>`          |
| `transferLotNo`           | ロット番号               | `<input type="text" readonly>`          |
| `transferStockQty`        | 在庫数量                 | `<input type="text" readonly>`          |
| `transferQty`             | 移動数量                 | `<input type="number" min="1">`         |
| `transferDestLocation`    | 棚ロケ（先）             | `<input type="text">`                   |
| `transferRegisterBtn`     | 登録ボタン               | `<button type="button">`                |
| `transferConfirmModal`    | 確認ダイアログ           | `<div class="modal-overlay">`           |
| `transferConfirmBody`     | 確認内容テキスト領域     | `<div>`（移動内容を動的に埋め込む）     |
| `transferConfirmOk`       | ダイアログ「OK」ボタン   | `<button type="button">`                |
| `transferConfirmCancel`   | ダイアログ「キャンセル」 | `<button type="button">`                |
| `transferFlash`           | フラッシュメッセージ     | `<div class="flash-message is-success">` |

---

### テーブルカラム定義

| #   | カラム名   | 幅の目安 | 備考           |
| --- | ---------- | -------- | -------------- |
| 1   | 棚ロケ     | 8rem     |                |
| 2   | 商品コード | 6rem     |                |
| 3   | 商品名     | auto     |                |
| 4   | ロット番号 | 7rem     |                |
| 5   | 数量       | 4rem     | 右揃え         |
| 6   | 単位区分   | 5rem     | 未定義は `‐`   |
| 7   | 特記事項   | 10rem    |                |

---

### ダミーデータ（25件）

> SCR-014 の在庫明細データと共通。ソート順: 棚ロケ ASC → 商品コード ASC → ロット番号 ASC

| 行  | 棚ロケ  | 商品コード | 商品名 | ロット番号 | 数量 | 単位区分 | 特記事項 |
| --- | ------- | ---------- | ------ | ---------- | ---- | -------- | -------- |
| 1   | A-01-01 | P-001      | 商品A  | LOT-001    | 100  | パレット |          |
| 2   | A-01-01 | P-001      | 商品A  | LOT-002    | 80   | パレット |          |
| 3   | A-01-02 | P-002      | 商品B  | LOT-003    | 60   | ケース   |          |
| 4   | A-02-01 | P-001      | 商品A  | LOT-004    | 120  | パレット |          |
| 5   | A-02-02 | P-002      | 商品B  | LOT-005    | 45   | ケース   |          |
| 6   | B-01-01 | P-003      | 商品C  | LOT-006    | 300  | ピース   |          |
| 7   | B-01-02 | P-004      | 商品D  | LOT-007    | 50   | ボール   |          |
| 8   | B-02-01 | P-003      | 商品C  | LOT-008    | 150  | ピース   |          |
| 9   | B-02-02 | P-004      | 商品D  | LOT-009    | 30   | ボール   |          |
| 10  | C-01-01 | P-005      | 商品E  | LOT-010    | 80   | ケース   |          |
| 11  | C-01-02 | P-006      | 商品F  | LOT-011    | 200  | パレット |          |
| 12  | C-02-01 | P-005      | 商品E  | LOT-012    | 60   | ケース   |          |
| 13  | C-02-02 | P-006      | 商品F  | LOT-013    | 180  | パレット |          |
| 14  | C-03-01 | P-005      | 商品E  | LOT-014    | 100  | ケース   |          |
| 15  | C-03-02 | P-006      | 商品F  | LOT-015    | 120  | パレット |          |
| 16  | D-01-01 | P-009      | 商品I  | LOT-016    | 90   | ボール   |          |
| 17  | D-01-02 | P-010      | 商品J  | LOT-017    | 110  | ピース   | 要冷蔵   |
| 18  | D-02-01 | P-007      | 商品G  | LOT-018    | 250  | ピース   |          |
| 19  | D-02-02 | P-008      | 商品H  | LOT-019    | 70   | ‐        |          |
| 20  | D-03-01 | P-009      | 商品I  | LOT-020    | 50   | ボール   |          |
| 21  | D-03-02 | P-010      | 商品J  | LOT-021    | 75   | ピース   | 要冷蔵   |
| 22  | D-04-01 | P-007      | 商品G  | LOT-022    | 150  | ピース   |          |
| 23  | D-04-01 | P-007      | 商品G  | LOT-023    | 80   | ピース   |          |
| 24  | D-04-02 | P-008      | 商品H  | LOT-024    | 55   | ‐        |          |
| 25  | D-04-03 | P-010      | 商品J  | LOT-025    | 130  | ピース   | 要冷蔵   |

---

### CSS クラス

| クラス名                         | 流用/新規 | 用途・主要プロパティ                                                                                              |
| -------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| `.section-card-header`           | 流用      | セクション見出し行のラッパー（`display: flex; justify-content: space-between; align-items: center`）             |
| `.transfer-control-row`          | 新規      | 移動元棚ロケ検索行（`display: flex; align-items: center; gap: var(--ds-space-150)`）                             |
| `.transfer-table-wrapper`        | 新規      | テーブル横スクロールコンテナ（`overflow-x: auto`）                                                               |
| `.schedule-table`                | 流用      | 在庫テーブル（`white-space: nowrap; width: 100%; border-collapse: collapse`）                                    |
| `.schedule-table thead th`       | 流用      | sticky ヘッダー（`position: sticky; top: 0; background: var(--ds-surface-raised); z-index: 1`）                  |
| `.schedule-table tbody tr`       | 流用      | 行クリックカーソル（`cursor: pointer`）                                                                           |
| `.schedule-table tbody tr.is-selected` | 新規 | 選択行ハイライト（`background: var(--ds-background-selected)`）                                                  |
| `.schedule-table tbody tr:hover:not(.is-selected)` | 新規 | ホバー時（`background: var(--ds-background-neutral-hovered)`）                                   |
| `.transfer-form`                 | 新規      | 移動内容フォームの `<fieldset>` ラッパー（`border: none; padding: 0; margin: 0`）                                |
| `.transfer-form-grid`            | 新規      | フォームフィールドのグリッド（`display: grid; grid-template-columns: 1fr 1fr; gap: var(--ds-space-200)`）        |
| `.transfer-form-field`           | 新規      | フィールドラベル + 入力欄のペア（`display: flex; flex-direction: column; gap: var(--ds-space-075)`）             |
| `.transfer-form-field--full`     | 新規      | 棚ロケ（先）全幅フィールド（`grid-column: 1 / -1`）                                                              |
| `.transfer-form-label`           | 新規      | フィールドラベル（`font-size: 0.75rem; font-weight: 600; color: var(--ds-text-subtle)`）                         |
| `.transfer-form-input--readonly` | 新規      | `readonly` 入力欄（`background: var(--ds-background-disabled); color: var(--ds-text-disabled); cursor: default`）|
| `.transfer-form-actions`         | 新規      | ボタン行（`display: flex; justify-content: flex-end; margin-top: var(--ds-space-300)`）                          |
| `.flash-message`                 | 流用      | フラッシュメッセージ外枠（`position: fixed; top: var(--ds-space-200); right: var(--ds-space-200); z-index: 100`）|
| `.flash-message.is-success`      | 流用      | 成功バリアント（`background: var(--ds-background-success); border: 1px solid var(--ds-border-success)`）         |

---

### JS 関数

#### 状態変数

| 変数名                | 初期値 | 型           | 用途                                         |
| --------------------- | ------ | ------------ | -------------------------------------------- |
| `transferDummyData`   | 25件配列 | `Array<Object>` | ダミーデータ（ページ読み込み時に定義）     |
| `currentFilteredRows` | `[]`   | `Array<Object>` | フィルタリング後の表示行（全件表示時は全25件）|
| `selectedRow`         | `null` | `Object\|null`  | 現在選択中の行データ                        |

各行オブジェクトのプロパティ: `{ location, itemCode, itemName, lotNo, qty, unit, note }`

---

#### 関数

| 関数名                            | 流用/新規 | 概要                                                                                              |
| --------------------------------- | --------- | ------------------------------------------------------------------------------------------------- |
| `initTransferTable()`             | 新規      | `transferDummyData` を `currentFilteredRows` にセット、`renderTransferTable()` と `updateTotalCount()` を呼ぶ |
| `filterTransferTable(keyword)`    | 新規      | 移動元棚ロケ入力値の前方一致で `currentFilteredRows` を更新し再描画する                           |
| `renderTransferTable(rows)`       | 新規      | 渡された行データをテーブルに描画する（行クリックイベントを付与）                                  |
| `selectTransferRow(rowData, tr)`  | 新規      | 行選択時の処理。`selectedRow` にセット・ハイライト付与・フォームに値反映・`fieldset` を有効化     |
| `deselectTransferRow()`           | 新規      | `selectedRow = null`・ハイライト除去・フォーム値クリア・`fieldset` を `disabled` に戻す           |
| `validateTransferForm()`          | 新規      | 登録ボタンの有効/無効を判定する                                                                   |
| `showTransferConfirmDialog()`     | 新規      | `#transferConfirmBody` に移動内容を埋め込み `#transferConfirmModal` を表示する                    |
| `executeTransfer()`               | 新規      | ダイアログ「OK」後の完了処理（詳細は下記）                                                        |
| `showFlashMessage(message, type)` | 流用      | フラッシュメッセージを表示し、3秒後に自動消去する                                                 |
| `updateTotalCount(count)`         | 流用      | `#transferTotalCount` に件数を表示する                                                            |

#### イベントハンドラ

| 要素ID                   | イベント  | 呼び出し                                              |
| ------------------------ | --------- | ----------------------------------------------------- |
| `#transferLocationSearch`| `input`   | `filterTransferTable(value)`（リアルタイム）           |
| テーブル行               | `click`   | `selectTransferRow(rowData)` / `deselectTransferRow()` |
| `#transferQty`           | `input`   | `validateTransferForm()`                              |
| `#transferDestLocation`  | `input`   | `validateTransferForm()`                              |
| `#transferRegisterBtn`   | `click`   | `showTransferConfirmDialog()`                         |
| `#transferConfirmOk`     | `click`   | `executeTransfer()`                                   |
| `#transferConfirmCancel` | `click`   | ダイアログを閉じる                                    |

#### `filterTransferTable` のロジック

1. `#transferLocationSearch` のキーワードを取得
2. ダミーデータ全25件に対して:
   - キーワードが入力済み → `棚ロケ` が前方一致する行のみ残す（大文字・小文字を区別しない）
3. 結果を `currentFilteredRows` に保持し、`renderTransferTable(currentFilteredRows)` を呼ぶ
4. `updateTotalCount(currentFilteredRows.length)` を呼ぶ
5. テーブル再描画時は行選択を解除する（`deselectTransferRow()`）

#### 初期化トリガー

```js
if (document.getElementById('transferTableBody')) {
  initTransferTable();
}
```

#### `filterTransferTable` のロジック

1. `#transferLocationSearch` のキーワードを取得
2. ダミーデータ全25件に対して:
   - キーワードが入力済み → `location` が前方一致する行のみ残す（大文字・小文字を区別しない）
   - キーワードが空 → 全件
3. 結果を `currentFilteredRows` に保持し、`renderTransferTable(currentFilteredRows)` を呼ぶ
4. `updateTotalCount(currentFilteredRows.length)` を呼ぶ
5. `deselectTransferRow()` を呼ぶ（再描画時に選択を解除）

#### `validateTransferForm` のロジック

以下の**全条件**を満たす場合に `#transferRegisterBtn` を有効化する：

1. `selectedRow` が `null` でない
2. `#transferQty` の値が整数かつ `1 ≤ 値 ≤ selectedRow.qty`
3. `#transferDestLocation` の値が空でなく `selectedRow.location` と異なる（大文字・小文字を区別しない）

#### `showTransferConfirmDialog` のロジック

`#transferConfirmBody` に以下のHTMLを生成して表示する：

```text
棚ロケ（元）: {selectedRow.location}
商品コード : {selectedRow.itemCode}
商品名    : {selectedRow.itemName}
ロット番号 : {selectedRow.lotNo}
移動数量  : {#transferQty の値} {selectedRow.unit}
棚ロケ（先）: {#transferDestLocation の値}
```

その後 `#transferConfirmModal` に `is-open` クラスを付与してダイアログを表示する。

#### `executeTransfer` のロジック

1. `#transferConfirmModal` の `is-open` クラスを除去してダイアログを閉じる
2. `showFlashMessage('移動登録が完了しました', 'success')` を呼ぶ
3. フォームをリセットする:
   - `deselectTransferRow()` を呼ぶ（選択解除・フォームクリア・`fieldset` 無効化）
   - `#transferQty` と `#transferDestLocation` の値をクリアする（`deselectTransferRow` 内でクリアされない場合に備える）
   - `#transferLocationSearch` はクリアしない

---

### スペーシング規則

| 箇所                                         | トークン    | px相当 |
| -------------------------------------------- | ----------- | ------ |
| 検索行とテーブルセクションの間               | `space.300` | 24px   |
| テーブルセクションとフォームセクションの間   | `space.300` | 24px   |
| テーブルヘッダー・セルの上下パディング       | `space.100` | 8px    |
| テーブルヘッダー・セルの左右パディング       | `space.150` | 12px   |
| フォームグリッドの列間・行間                 | `space.200` | 16px   |
| フォームセクション内・ボタン行の上マージン   | `space.300` | 24px   |
| フィールドラベルと入力欄の間隔               | `space.075` | 6px    |
| カード内パディング                           | `space.300` | 24px   |

---

## 変更履歴

| 日時       | 変更者 | 変更内容                   |
| ---------- | ------ | -------------------------- |
| 2026/05/19 | -      | 新規作成（要件定義）                                                                                     |
| 2026/05/19 | -      | 画面設計セクション追加（フォームフィールドレイアウト・HTML要素ID・CSSクラス詳細・JS状態変数・ロジック詳細） |
