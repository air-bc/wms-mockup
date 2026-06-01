# [要件詳細] SCR-010: 引き当てチェック

> 非機能要件・プロジェクト概要は [renew_REQUIREMENTS.md](renew_REQUIREMENTS.md) を参照すること。

---

## 機能概要

出荷予定に対する在庫引き当てを実行・確認する画面。SCR-008（出荷予定一覧）のサブ画面として独立したフローで呼び出される。コントロール行の「引き当て実行」ボタンをクリックすることで引き当てチェックを実行し、結果をテーブルに表示する。

テーブルは**受注ID単位のサマリー行**を表示し、クリックするとその受注内の商品明細がアコーディオン展開される。明細では商品コード・商品名・ロット番号・数量・残在庫数（全受注IDをまたいだ引き当て前残在庫）と引き当て結果を確認できる。

<!-- [2026/05/25 変更] 商品・ロット番号単位 → 受注ID単位のグルーピングに変更 -->

---

## 機能詳細

### 機能1: 日付フィルタ・最終更新日時表示

- [ ] 開始日・終了日を選択できる日付範囲入力フォームを表示する（デフォルト値はどちらも今日）
- [ ] 日付フィルタの右に「引き当て実行」ボタンを配置する
- [ ] 画面初期表示時はテーブルセクションを非表示にする
- [ ] 「引き当て実行」ボタンをクリックすると、テーブルセクションを表示し最終更新日時を現在時刻に更新する（モックアップのためデータは固定）
- [ ] 最終更新日時はボタン押下前は空欄、押下後に現在日時を `yyyy/mm/dd hh:mm:ss` 形式で表示する

### 機能2: キーワード検索

- [ ] 日付フィルタの近くにキーワード入力フィールドを1つ配置する
- [ ] 入力値による部分一致で、サマリー行の表示をリアルタイムにフィルタリングする
- [ ] 検索対象: 受注ID・受注日時・受注先<!-- [2026/05/25 変更] 商品コード・商品名・ロット番号 → 受注ID・受注日時・受注先 -->
- [ ] 検索は大文字・小文字を区別しない
- [ ] 入力フィールドをクリアすると全件表示に戻る
- [ ] フィルタリング時、展開中のアコーディオンは閉じる

### 機能3: 引き当て結果テーブル（サマリー行）

<!-- [2026/05/25 変更] 商品・ロット番号単位 → 受注ID単位に変更。在庫数・出荷予定数合計カラムを削除し、受注ID・受注日時・受注先に変更 -->

テーブルは受注IDごとに1行表示する。並び順は出荷日の昇順。<!-- [2026/05/25 変更] 受注日時昇順 → 出荷日昇順に変更 -->

**カラム構成**:

<!-- [2026/05/25 変更] チェックボックス列・出荷日列・ステータス列を追加。5列 → 8列 -->
<!-- [2026/05/25 変更] 操作列（引き当て表印刷）を追加。8列 → 9列 -->

| #   | カラム名         | 幅の目安 | 備考                                                                                  |
| --- | ---------------- | -------- | ------------------------------------------------------------------------------------- |
| —   | チェックボックス | 2rem     | 中央揃え。引き当て結果 OK かつステータスが「なし」の行のみ有効。それ以外は `disabled` |
| —   | 展開アイコン     | 2rem     | ▶ / ▼。中央揃え。クリック領域はセル全体                                               |
| 1   | 出荷日           | 7rem     | 読み取り専用                                                                          |
| 2   | 受注ID           | 8rem     | 読み取り専用                                                                          |
| 3   | 受注日時         | 11rem    | 読み取り専用                                                                          |
| 4   | 受注先           | auto     | 読み取り専用                                                                          |
| 5   | 引き当て結果     | 6rem     | バッジ表示。中央揃え                                                                  |
| 6   | ステータス       | 8rem     | バッジ表示。中央揃え。「なし」または「引き当て済み」の2種類                           |
| 7   | 操作             | 10rem    | 中央揃え。ステータスが「引き当て済み」の行にのみ「引き当て表印刷」ボタンを表示        |

**引き当て結果の判定**:

| 結果 | 表示ラベル | バッジロール | 条件                  |
| ---- | ---------- | ------------ | --------------------- |
| OK   | OK         | `success`    | 明細にNGが1件もない   |
| NG   | NG         | `danger`     | 明細にNGが1件以上ある |

**チェックボックスの仕様**:

<!-- [2026/05/25 変更] チェックボックスを追加 -->
<!-- [2026/05/25 変更] ステータスが「引き当て済み」の行も disabled に変更 -->

| 条件                                    | 状態                           |
| --------------------------------------- | ------------------------------ |
| 引き当て結果 OK かつ ステータス「なし」 | 有効（チェック可）             |
| 引き当て結果 NG                         | `disabled`（グレーアウト表示） |
| ステータス「引き当て済み」              | `disabled`（グレーアウト表示） |

**ステータスの表示値**:

<!-- [2026/05/25 変更] ステータス列を追加 -->

| 値           | バッジクラス            | 備考         |
| ------------ | ----------------------- | ------------ |
| なし         | `status-badge--subtle`  | 未引き当て   |
| 引き当て済み | `status-badge--success` | 引き当て完了 |

**行の操作**:

- [ ] サマリー行の一番左にチェックボックスを表示する<!-- [2026/05/25 変更] チェックボックス追加 -->
- [ ] 引き当て結果 NG の行のチェックボックスは `disabled` にする<!-- [2026/05/25 変更] 同上 -->
- [ ] ステータスが「引き当て済み」の行のチェックボックスも `disabled` にする<!-- [2026/05/25 変更] 引き当て済み行も disabled に変更 -->
- [ ] サマリー行の左端（チェックボックスの右隣）に展開アイコン（▶）を表示する
- [ ] サマリー行をクリックすると対応する商品明細をアコーディオン展開する<!-- [2026/05/25 変更] 出荷予定明細 → 商品明細 -->
- [ ] 展開中の行は展開アイコンを ▼ に切り替える
- [ ] テーブルヘッダーはスクロール時も常に表示する（sticky）

### 機能4: アコーディオン明細行

<!-- [2026/05/25 変更] 出荷予定日/伝票No/出荷先/累計数 → 商品コード/商品名/ロット番号/残在庫数に変更。累計ロジックを全受注IDまたぎの残在庫方式に変更 -->

サマリー行の展開時に、その受注IDに含まれる商品明細を登録日時の昇順で一覧表示する。

**カラム構成**:

明細行はサマリー行の全9列に `colspan="9"` で入れたセル内に、独立したレイアウトで表示する。これによりヘッダーとの列幅不一致を回避する。<!-- [2026/05/25 変更] colspan 5 → 8 に変更（チェックボックス・出荷日・ステータス列追加に伴う） --><!-- [2026/05/25 変更] colspan 8 → 9 に変更（操作列追加に伴う） -->

| カラム名   | 幅の目安 | 備考                                                                           |
| ---------- | -------- | ------------------------------------------------------------------------------ |
| 商品コード | 7rem     | 読み取り専用                                                                   |
| 商品名     | auto     | 読み取り専用                                                                   |
| ロット番号 | 9rem     | 読み取り専用。指定なしの場合は `‐`                                             |
| 数量       | 6rem     | 右揃え・読み取り専用                                                           |
| 残在庫数   | 6rem     | 右揃え。この明細処理前の残り在庫（受注日時昇順で前受注の消費分を差し引いた値） |
| 結果       | 5rem     | バッジ表示。中央揃え                                                           |

**結果の判定（行単位）**:

| 状態 | 表示ラベル | バッジロール | 条件            |
| ---- | ---------- | ------------ | --------------- |
| OK   | OK         | `success`    | 数量 ≤ 残在庫数 |
| NG   | NG         | `danger`     | 数量 > 残在庫数 |

**残在庫数の計算ロジック**:

- 全受注を受注日時の昇順で処理する
- ある明細行の残在庫数 = その商品+ロットの初期在庫 − この受注より前の全受注での同商品+ロットの消費数量合計
- 同一受注ID内での消費は相互に影響しない（受注グループ単位で処理）

- [ ] 明細エリアの背景色はサマリー行と区別するため `background-input` を使用する
- [ ] NG になる明細行に視覚的な強調（左ボーダー: `border-danger-bold`）を付ける

### 機能5: 引き当て済みに変更ボタン・確認モーダル

<!-- [2026/05/25 変更] 追加 -->

- [ ] テーブルセクションの見出し行（「引き当て結果」テキストの右端）に「引き当て済みに変更」ボタン（Primary）を表示する
- [ ] ボタンをクリックすると確認モーダルを表示する
- [ ] モーダルは `.ds-modal-overlay` / `.ds-modal` 共通設計を使用する（`ui_components.md` 参照）
- [ ] モーダルタイトル: 「確認」、本文: 「引き当て済みに変更しますか？」
- [ ] モーダルのボタン構成: 「キャンセル」（`btn-default`）、「確定」（`btn-primary`）
- [ ] モックアップのため、確定ボタンクリック時の処理は不要（モーダルを閉じるだけでよい）

### 機能6: 引き当て表印刷ボタン

<!-- [2026/05/25 変更] 追加 -->

- [ ] テーブル右端に「操作」列を追加する
- [ ] ステータスが「引き当て済み」の行のみ「引き当て表印刷」ボタンを表示する（それ以外の行は空白）
- [ ] ボタンの下に「印刷済み」ステータステキストを表示する（モックアップのため固定表示）
- [ ] ボタン: `btn btn-default` クラス
- [ ] 「印刷済み」テキスト: `body-s text-subtle` クラス

---

## 画面設計

> 技術スタック・共通設計は renew_REQUIREMENTS.md を参照すること。

### ファイル

- **HTML**: `renew_templates/010_allocation_check.html`
- **CSS**: `static/css/style.css`（流用・追記）
- **JS**: `static/js/main.js`（流用・追記）

---

### レイアウト構成

SCR-011 と同じ Flexbox + `<body class="schedule-page">` スコープ方式を踏襲する。

**初期表示（ボタン押下前）**:

```text
┌──────────────────────────────────────────────────────── viewport ────┐
│ [ヘッダー 固定]                                                        │
├────────┬──────────────────────────────────────────────────────────────┤
│ サイド  │ 開始日 [____] 〜 終了日 [____]  [引き当て実行]  [🔍 検索___] │← コントロール行
│ バー    │                                                              │
│        │  （テーブル非表示）                                           │
└────────┴──────────────────────────────────────────────────────────────┘
```

**ボタン押下後**:

<!-- [2026/05/25 変更] サマリー行を受注IDグループ、明細行を商品明細に変更 -->
<!-- [2026/05/25 変更] チェックボックス列・出荷日列・ステータス列を追加したレイアウト図に更新 -->
<!-- [2026/05/25 変更] 操作列・「引き当て済みに変更」ボタンを追加したレイアウト図に更新 -->

```text
┌──────────────────────────────────────────────────────────────── viewport ──────┐
│ [ヘッダー 固定]                                                                  │
├────────┬────────────────────────────────────────────────────────────────────────┤
│ サイド  │ 開始日[____]〜終了日[____] [引き当て実行] [🔍検索___] 更新:xx:xx        │← コントロール行
│ バー    ├────────────────────────────────────────────────────────────────────────┤
│        │ 引き当て結果                          [引き当て済みに変更]              │← セクション見出し
│        │□│  │出荷日    │受注ID│受注日時         │受注先  │結果│ステータス  │操作    ← sticky
│        │-│▶│2026/05/21│O-001│2026/05/18 09:00 │佐々木商│[OK]│[引き当て済]│[印刷] ↑残り
│        │                                                               印刷済み  │
│        │□│▶│2026/05/22│O-002│2026/05/19 10:30 │田中物産│[OK]│[なし]      │       ↓scroll
│        │-│▼│2026/05/24│O-003│2026/05/21 14:00 │鈴木運輸│[NG]│[なし]      │
│        │   └─ P-001 商品A LOT-2025-001  60  40 [NG]
│        │   └─ P-002 商品B ‐             30 120 [OK]
│        │   └─ P-003 商品C LOT-2025-003  50  40 [NG]
│        │□│▶│2026/05/27│O-004│2026/05/24 11:00 │伊藤商店│[OK]│[なし]      │
└────────┴────────────────────────────────────────────────────────────────────────┘
```

---

### レイアウト実現方式（CSS Flexbox + ページ固有クラス）

SCR-011 と同じ実現方式を流用する。

| セレクタ                                | 設定値                                                    | 目的                                          |
| --------------------------------------- | --------------------------------------------------------- | --------------------------------------------- |
| `html, .schedule-page`                  | `height: 100%; overflow: hidden`                          | ページスクロール抑制                          |
| `.schedule-page .app-layout`            | `height: 100%`                                            | `.app-layout` の `min-height: 100vh` を上書き |
| `.schedule-page .app-body`              | `overflow: hidden`                                        | 縦方向伸張防止                                |
| `<main class="app-main schedule-main">` | `display: flex; flex-direction: column; overflow: hidden` | 縦 Flex コンテナ化                            |
| コントロール行                          | `flex-shrink: 0`                                          | 高さ固定                                      |
| `.schedule-table-wrapper`               | `flex: 1; overflow: auto; min-height: 0`                  | テーブル部分のみスクロール                    |
| `thead th`                              | `position: sticky; top: 0; z-index: 1`                    | ヘッダー固定                                  |

---

### 使用コンポーネント（Atlassian Design System）

<!-- [2026/05/25 変更] Checkbox・Lozenge (Subtle)・Lozenge (Success / ステータス用) を追加 -->
<!-- [2026/05/25 変更] 「引き当て済みに変更」ボタン・Modal・「引き当て表印刷」ボタンを追加 -->

| コンポーネント                | 用途                                          | トークン・備考                                                  |
| ----------------------------- | --------------------------------------------- | --------------------------------------------------------------- |
| Page header                   | ページ見出し「引き当てチェック」              | `heading-xl` (1.75rem)                                          |
| Date picker                   | 開始日・終了日選択                            | `<input type="date">` + `background-input` + `border-input`     |
| Button (Primary)              | 引き当て実行                                  | `btn btn-primary`。クリックで引き当て処理を実行                 |
| Button (Primary)              | 引き当て済みに変更                            | `btn btn-primary`。セクション見出し右端。クリックでモーダル表示 |
| Button (Default)              | 引き当て表印刷                                | `btn btn-default`。「引き当て済み」行の操作列にのみ表示         |
| Text input                    | キーワード検索                                | `placeholder="検索"`                                            |
| Body text (subtle)            | 最終更新日時・印刷済みテキスト                | `body-s` + `text-subtle`                                        |
| Card (Raised)                 | コントロール行・テーブルセクション外枠        | 既存 `.section-card` 流用                                       |
| Section heading               | カード内見出し「引き当て結果」                | `heading-m` (1.25rem)                                           |
| Modal                         | 引き当て済みへの変更確認                      | `.ds-modal-overlay` / `.ds-modal` 共通設計                      |
| Table                         | 引き当て結果テーブル                          | sticky ヘッダー・縦スクロール対応                               |
| Checkbox                      | 引き当て結果OK かつステータス「なし」行の選択 | `<input type="checkbox">`。NG行・引き当て済み行は `disabled`    |
| Lozenge (Success) ※引き当て   | 引き当てバッジ「OK」                          | `.allocation-badge--ok`（`background-success-bold`）            |
| Lozenge (Danger) ※引き当て    | 引き当てバッジ「NG」                          | `.allocation-badge--ng`（`background-danger-bold`）             |
| Lozenge (Success) ※ステータス | ステータス「引き当て済み」                    | `.status-badge--success`                                        |
| Lozenge (Subtle) ※ステータス  | ステータス「なし」                            | `.status-badge--subtle`                                         |

---

### ダミーデータ

<!-- [2026/05/25 変更] 商品・ロット単位のサマリー → 受注ID単位のサマリーに全面変更 -->

デフォルトの日付範囲は今日（2026/05/25）〜今日（2026/05/25）。サンプルは 1 週間分（2026/05/18〜2026/05/24）の受注データを用意する。

#### 在庫マスタ

| 商品コード | 商品名 | ロット番号   | 在庫数 |
| ---------- | ------ | ------------ | ------ |
| P-001      | 商品A  | LOT-2025-001 | 150    |
| P-002      | 商品B  | ‐            | 200    |
| P-003      | 商品C  | LOT-2025-003 | 100    |

#### サマリーデータ（受注一覧、出荷日昇順）

<!-- [2026/05/25 変更] 出荷日列・ステータス列を追加。並び順を出荷日昇順に変更 -->

| 出荷日     | 受注ID | 受注日時         | 受注先     | 引き当て結果 | ステータス   |
| ---------- | ------ | ---------------- | ---------- | ------------ | ------------ | ----------------------------------------------------- |
| 2026/05/21 | O-001  | 2026/05/18 09:00 | 佐々木商事 | OK           | 引き当て済み |
| 2026/05/22 | O-002  | 2026/05/19 10:30 | 田中物産   | OK           | 引き当て済み | <!-- [2026/05/25 変更] なし → 引き当て済み に変更 --> |
| 2026/05/24 | O-003  | 2026/05/21 14:00 | 鈴木運輸   | NG           | なし         |
| 2026/05/27 | O-004  | 2026/05/24 11:00 | 伊藤商店   | OK           | なし         |

#### 明細データ（O-001: 佐々木商事 / 2026/05/18 09:00）

| 商品コード | 商品名 | ロット番号   | 数量 | 残在庫数 | 結果 |
| ---------- | ------ | ------------ | ---- | -------- | ---- |
| P-001      | 商品A  | LOT-2025-001 | 50   | 150      | OK   |
| P-002      | 商品B  | ‐            | 80   | 200      | OK   |

#### 明細データ（O-002: 田中物産 / 2026/05/19 10:30）

| 商品コード | 商品名 | ロット番号   | 数量 | 残在庫数 | 結果 |
| ---------- | ------ | ------------ | ---- | -------- | ---- |
| P-001      | 商品A  | LOT-2025-001 | 60   | 100      | OK   |
| P-003      | 商品C  | LOT-2025-003 | 60   | 100      | OK   |

> 残在庫数: P-001=150-50=100、P-003=100（O-001での消費なし）

#### 明細データ（O-003: 鈴木運輸 / 2026/05/21 14:00）

| 商品コード | 商品名 | ロット番号   | 数量 | 残在庫数 | 結果 |
| ---------- | ------ | ------------ | ---- | -------- | ---- |
| P-001      | 商品A  | LOT-2025-001 | 60   | 40       | NG   |
| P-002      | 商品B  | ‐            | 30   | 120      | OK   |
| P-003      | 商品C  | LOT-2025-003 | 50   | 40       | NG   |

> 残在庫数: P-001=150-50-60=40、P-002=200-80=120、P-003=100-60=40

#### 明細データ（O-004: 伊藤商店 / 2026/05/24 11:00）

| 商品コード | 商品名 | ロット番号 | 数量 | 残在庫数 | 結果 |
| ---------- | ------ | ---------- | ---- | -------- | ---- |
| P-002      | 商品B  | ‐          | 70   | 90       | OK   |

> 残在庫数: P-002=200-80-30=90（O-003でNGとなった消費分も前受注として控除）

---

### HTML 骨格

<!-- [2026/05/25 変更] サマリー行を8列（チェックボックス/展開アイコン/出荷日/受注ID/受注日時/受注先/引き当て結果/ステータス）に変更。明細行 colspan="8" に変更 -->
<!-- [2026/05/25 変更] 操作列を追加し9列化。明細行 colspan="8" → colspan="9" に変更。「引き当て済みに変更」ボタン・確認モーダルを追加 -->

```html
<body class="app-layout schedule-page">
  <header class="app-header"><!-- 共通ヘッダー --></header>
  <div class="app-body">
    <nav class="app-sidebar"><!-- 共通サイドバー --></nav>
    <main class="app-main schedule-main">
      <!-- コントロール行 -->
      <div class="schedule-control-row section-card">
        <div class="schedule-date-group">
          <label class="schedule-date-label" for="scheduleDateFrom"
            >開始日</label
          >
          <input class="date-input" type="date" id="scheduleDateFrom" />
        </div>
        <span class="schedule-date-separator">〜</span>
        <div class="schedule-date-group">
          <label class="schedule-date-label" for="scheduleDateTo">終了日</label>
          <input class="date-input" type="date" id="scheduleDateTo" />
        </div>
        <button
          type="button"
          id="allocationRunBtn"
          class="btn btn-primary"
          onclick="runAllocationCheck()"
        >
          引き当て実行
        </button>
        <input
          class="schedule-search-input"
          type="text"
          id="allocationSearch"
          placeholder="検索"
        />
        <span class="schedule-updated-at">
          最終更新: <span id="scheduleUpdatedAt"></span>
        </span>
      </div>

      <!-- テーブルセクション（初期非表示） -->
      <div
        id="allocationTableSection"
        class="section-card schedule-table-wrapper"
        style="display:none"
      >
        <div class="section-card-header">
          <span class="heading-m">引き当て結果</span>
          <button
            type="button"
            class="btn btn-primary"
            onclick="openModal('allocationConfirmModal')"
          >
            引き当て済みに変更
          </button>
        </div>
        <table id="allocationTable" class="schedule-table">
          <thead>
            <tr>
              <th style="width:2rem"></th>
              <!-- チェックボックス列 -->
              <th style="width:2rem"></th>
              <!-- 展開アイコン列 -->
              <th style="width:7rem">出荷日</th>
              <th style="width:8rem">受注ID</th>
              <th style="width:11rem">受注日時</th>
              <th>受注先</th>
              <th style="width:6rem;text-align:center">引き当て結果</th>
              <th style="width:8rem;text-align:center">ステータス</th>
              <th style="width:10rem;text-align:center">操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- ★ サマリー行（OK / 引き当て済み例）→ チェックボックスは disabled（引き当て済みのため） -->
            <tr
              class="allocation-summary-row"
              data-group-id="O-001"
              onclick="toggleAllocationDetail('O-001', this)"
            >
              <td class="allocation-checkbox-cell">
                <input type="checkbox" disabled />
              </td>
              <td class="allocation-expand-cell">
                <span class="allocation-expand-icon">▶</span>
              </td>
              <td>2026/05/21</td>
              <td>O-001</td>
              <td>2026/05/18 09:00</td>
              <td>佐々木商事</td>
              <td class="text-center">
                <span class="allocation-badge allocation-badge--ok">OK</span>
              </td>
              <td class="text-center">
                <span class="status-badge status-badge--success"
                  >引き当て済み</span
                >
              </td>
              <td class="text-center allocation-print-cell">
                <button type="button" class="btn btn-default">
                  引き当て表印刷
                </button>
                <div class="body-s text-subtle">印刷済み</div>
              </td>
            </tr>
            <!-- ★ 明細行（初期非表示）-->
            <tr
              class="allocation-detail-row"
              id="detail-O-001"
              style="display: none;"
            >
              <td colspan="9" class="allocation-detail-cell">
                <div class="allocation-detail-inner">
                  <!-- 明細ヘッダー -->
                  <div class="allocation-detail-header">
                    <span>商品コード</span>
                    <span>商品名</span>
                    <span>ロット番号</span>
                    <span class="text-right">数量</span>
                    <span class="text-right">残在庫数</span>
                    <span class="text-center">結果</span>
                  </div>
                  <!-- 明細行: OK -->
                  <div class="allocation-detail-item">
                    <span>P-001</span>
                    <span>商品A</span>
                    <span>LOT-2025-001</span>
                    <span class="text-right">50</span>
                    <span class="text-right">150</span>
                    <span class="text-center">
                      <span class="allocation-badge allocation-badge--ok"
                        >OK</span
                      >
                    </span>
                  </div>
                  <!-- 明細行: OK -->
                  <div class="allocation-detail-item">
                    <span>P-002</span>
                    <span>商品B</span>
                    <span>‐</span>
                    <span class="text-right">80</span>
                    <span class="text-right">200</span>
                    <span class="text-center">
                      <span class="allocation-badge allocation-badge--ok"
                        >OK</span
                      >
                    </span>
                  </div>
                </div>
              </td>
            </tr>
            <!-- ★ サマリー行（NG例） -->
            <tr
              class="allocation-summary-row"
              data-group-id="O-003"
              onclick="toggleAllocationDetail('O-003', this)"
            >
              <td class="allocation-checkbox-cell">
                <input type="checkbox" disabled />
              </td>
              <td class="allocation-expand-cell">
                <span class="allocation-expand-icon">▶</span>
              </td>
              <td>2026/05/24</td>
              <td>O-003</td>
              <td>2026/05/21 14:00</td>
              <td>鈴木運輸</td>
              <td class="text-center">
                <span class="allocation-badge allocation-badge--ng">NG</span>
              </td>
              <td class="text-center">
                <span class="status-badge status-badge--subtle">なし</span>
              </td>
              <td class="text-center allocation-print-cell">
                <!-- 操作列: NGのためボタンなし -->
              </td>
            </tr>
            <!-- ★ 明細行（NG含む）-->
            <tr
              class="allocation-detail-row"
              id="detail-O-003"
              style="display: none;"
            >
              <td colspan="9" class="allocation-detail-cell">
                <div class="allocation-detail-inner">
                  <div class="allocation-detail-header">
                    <span>商品コード</span>
                    <span>商品名</span>
                    <span>ロット番号</span>
                    <span class="text-right">数量</span>
                    <span class="text-right">残在庫数</span>
                    <span class="text-center">結果</span>
                  </div>
                  <!-- 明細行: NG -->
                  <div
                    class="allocation-detail-item allocation-detail-item--ng-boundary"
                  >
                    <span>P-001</span>
                    <span>商品A</span>
                    <span>LOT-2025-001</span>
                    <span class="text-right">60</span>
                    <span class="text-right">40</span>
                    <span class="text-center">
                      <span class="allocation-badge allocation-badge--ng"
                        >NG</span
                      >
                    </span>
                  </div>
                  <!-- 明細行: OK -->
                  <div class="allocation-detail-item">
                    <span>P-002</span>
                    <span>商品B</span>
                    <span>‐</span>
                    <span class="text-right">30</span>
                    <span class="text-right">120</span>
                    <span class="text-center">
                      <span class="allocation-badge allocation-badge--ok"
                        >OK</span
                      >
                    </span>
                  </div>
                  <!-- 明細行: NG -->
                  <div
                    class="allocation-detail-item allocation-detail-item--ng-boundary"
                  >
                    <span>P-003</span>
                    <span>商品C</span>
                    <span>LOT-2025-003</span>
                    <span class="text-right">50</span>
                    <span class="text-right">40</span>
                    <span class="text-center">
                      <span class="allocation-badge allocation-badge--ng"
                        >NG</span
                      >
                    </span>
                  </div>
                </div>
              </td>
            </tr>
            <!-- 以降、他の受注も同パターンで繰り返し -->
          </tbody>
        </table>
      </div>
    </main>
  </div>

  <!-- 引き当て済みに変更 確認モーダル -->
  <div
    id="allocationConfirmModal"
    class="ds-modal-overlay"
    style="display: none;"
    role="dialog"
    aria-modal="true"
    aria-labelledby="allocationConfirmModalTitle"
  >
    <div class="ds-modal">
      <div class="ds-modal-header">
        <h2 class="heading-s" id="allocationConfirmModalTitle">確認</h2>
      </div>
      <div class="ds-modal-body">
        <p class="body-m">引き当て済みに変更しますか？</p>
      </div>
      <div class="ds-modal-footer">
        <button
          type="button"
          class="btn btn-default"
          onclick="closeModal('allocationConfirmModal')"
        >
          キャンセル
        </button>
        <button
          type="button"
          class="btn btn-primary"
          onclick="closeModal('allocationConfirmModal')"
        >
          確定
        </button>
      </div>
    </div>
  </div>
</body>
```

---

### アコーディオン状態遷移

| 状態       | サマリー行クラス          | 展開アイコン | 明細行 `display` |
| ---------- | ------------------------- | ------------ | ---------------- |
| 閉じている | `.allocation-summary-row` | `▶`          | `none`           |
| 開いている | `.allocation-summary-row` | `▼`（回転）  | `table-row`      |

アイコン切り替えは CSS クラス `.allocation-expand-icon--open` の付け外しで実現する（`transform: rotate(90deg)`）。

---

### CSS クラス

| クラス名                               | 流用/新規 | 用途・設定値                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.schedule-page`                       | 流用      | `<body>` 追加クラス。ページスクロール抑制スコープ                                                                                                                                                                                                                                                                                                                                                                                                            |
| `.schedule-control-row`                | 流用      | コントロール行の横並び行（`display: flex; align-items: center; gap: var(--ds-space-200)`）                                                                                                                                                                                                                                                                                                                                                                   |
| `.schedule-date-group`                 | 流用      | ラベル + 日付 `<input>` のペア（`display: flex; align-items: center; gap: var(--ds-space-100)`）                                                                                                                                                                                                                                                                                                                                                             |
| `.schedule-date-label`                 | 流用      | 「開始日」「終了日」ラベル（`font-size: var(--ds-font-size-075); color: var(--ds-text-subtle)`）                                                                                                                                                                                                                                                                                                                                                             |
| `.schedule-date-separator`             | 新規      | 開始日〜終了日間の「〜」区切り文字（`color: var(--ds-text-subtle); font-size: var(--ds-font-size-075)`）                                                                                                                                                                                                                                                                                                                                                     |
| `.date-input`                          | 流用      | 日付入力 `<input>`（`background: var(--ds-background-input); border: 2px solid var(--ds-border-input); border-radius: var(--ds-border-radius-100); padding: var(--ds-space-075) var(--ds-space-100)`）                                                                                                                                                                                                                                                       |
| `.schedule-search-input`               | 流用      | キーワード検索 `<input>`（`placeholder="検索"`）                                                                                                                                                                                                                                                                                                                                                                                                             |
| `.schedule-updated-at`                 | 流用      | 最終更新日時テキスト（`margin-left: auto; font-size: var(--ds-font-size-075); color: var(--ds-text-subtle)`）                                                                                                                                                                                                                                                                                                                                                |
| `.schedule-main`                       | 流用      | `<main>` 追加クラス（`display: flex; flex-direction: column; overflow: hidden; gap: var(--ds-space-300)`）                                                                                                                                                                                                                                                                                                                                                   |
| `.schedule-table-wrapper`              | 流用      | テーブル縦スクロールコンテナ（`flex: 1; overflow: auto; min-height: 0`）                                                                                                                                                                                                                                                                                                                                                                                     |
| `.schedule-table`                      | 流用      | 引き当て結果テーブル（`white-space: nowrap; border-collapse: collapse; width: 100%`）                                                                                                                                                                                                                                                                                                                                                                        |
| `.schedule-table thead th`             | 流用      | sticky ヘッダー（`position: sticky; top: 0; z-index: 1; background: var(--ds-elevation-surface-raised); padding: var(--ds-space-100) var(--ds-space-150)`）                                                                                                                                                                                                                                                                                                  |
| `.allocation-badge`                    | 新規      | 引き当てステータスバッジ基底（`display: inline-block; padding: var(--ds-space-025) var(--ds-space-100); border-radius: var(--ds-border-radius-100); font-size: var(--ds-font-size-050); font-weight: var(--ds-font-weight-bold)`）                                                                                                                                                                                                                           |
| `.allocation-badge--ok`                | 新規      | OKバッジ（`background: var(--ds-background-success-bold); color: var(--ds-text-inverse)`）                                                                                                                                                                                                                                                                                                                                                                   |
| `.allocation-badge--ng`                | 新規      | NGバッジ（`background: var(--ds-background-danger-bold); color: var(--ds-text-inverse)`）                                                                                                                                                                                                                                                                                                                                                                    |
| `.allocation-summary-row`              | 新規      | サマリー行（`cursor: pointer`）                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `.allocation-summary-row:hover`        | 新規      | サマリー行ホバー（`background: var(--ds-background-neutral-hovered)`）                                                                                                                                                                                                                                                                                                                                                                                       |
| `.allocation-checkbox-cell`            | 新規      | チェックボックスセル（`width: 2rem; text-align: center; padding: var(--ds-space-100) var(--ds-space-075)`）<!-- [2026/05/25 変更] 追加 -->                                                                                                                                                                                                                                                                                                                   |
| `.allocation-expand-cell`              | 新規      | 展開アイコンセル（`width: 2rem; text-align: center; padding: var(--ds-space-100) var(--ds-space-075)`）                                                                                                                                                                                                                                                                                                                                                      |
| `.allocation-expand-icon`              | 新規      | 展開アイコン span（`display: inline-block; transition: transform 0.15s ease; font-size: 0.6rem; color: var(--ds-text-subtle)`）                                                                                                                                                                                                                                                                                                                              |
| `.allocation-expand-icon--open`        | 新規      | 展開中のアイコン（`transform: rotate(90deg)`）                                                                                                                                                                                                                                                                                                                                                                                                               |
| `.allocation-detail-row`               | 新規      | 明細行（`<tr>`。`padding: 0`）                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `.allocation-detail-cell`              | 新規      | 明細行の `<td>`（`padding: 0; background: var(--ds-background-input)`）                                                                                                                                                                                                                                                                                                                                                                                      |
| `.allocation-detail-inner`             | 新規      | 明細行の内部コンテナ（`padding: var(--ds-space-100) var(--ds-space-300)`）                                                                                                                                                                                                                                                                                                                                                                                   |
| `.allocation-detail-header`            | 新規      | 明細の列ヘッダー行（`display: grid; grid-template-columns: 7rem auto 9rem 6rem 6rem 5rem; gap: var(--ds-space-150); font-size: var(--ds-font-size-050); color: var(--ds-text-subtle); font-weight: var(--ds-font-weight-semibold); padding-bottom: var(--ds-space-075); border-bottom: 1px solid var(--ds-border-default)`）<!-- [2026/05/25 変更] 列幅を商品コード/商品名/ロット番号/数量/残在庫数/結果 に対応した 7rem auto 9rem 6rem 6rem 5rem に変更 --> |
| `.allocation-detail-item`              | 新規      | 明細の1行（`display: grid; grid-template-columns: 7rem auto 9rem 6rem 6rem 5rem; gap: var(--ds-space-150); font-size: var(--ds-font-size-075); padding: var(--ds-space-075) 0; border-bottom: 1px solid var(--ds-border-default)`）<!-- [2026/05/25 変更] 同上 -->                                                                                                                                                                                           |
| `.allocation-detail-item--ng-boundary` | 新規      | NG の明細行（`border-left: 3px solid var(--ds-border-danger-bold); padding-left: calc(var(--ds-space-075) - 3px)`）<!-- [2026/05/25 変更] 「最初のNG行のみ」→「NGの明細行すべてに適用」 -->                                                                                                                                                                                                                                                                  |
| `.allocation-print-cell`               | 新規      | 操作列セル（`width: 10rem; text-align: center; padding: var(--ds-space-100) var(--ds-space-150); vertical-align: middle`）<!-- [2026/05/25 変更] 追加 -->                                                                                                                                                                                                                                                                                                    |

---

### DOM ID 一覧

| ID                       | 要素                  | 用途                                                          |
| ------------------------ | --------------------- | ------------------------------------------------------------- |
| `scheduleDateFrom`       | `<input type="date">` | 開始日入力（デフォルト: 今日）                                |
| `scheduleDateTo`         | `<input type="date">` | 終了日入力（デフォルト: 今日）                                |
| `allocationRunBtn`       | `<button>`            | 引き当て実行ボタン                                            |
| `scheduleUpdatedAt`      | `<span>`              | 最終更新日時表示（初期値: 空欄）                              |
| `allocationSearch`       | `<input type="text">` | キーワード検索入力                                            |
| `allocationTableSection` | `<div>`               | テーブルセクション外枠（初期: `display:none`）                |
| `allocationTable`        | `<table>`             | 引き当て結果テーブル                                          |
| `allocationConfirmModal` | `<div>`               | 引き当て済みに変更確認モーダル<!-- [2026/05/25 変更] 追加 --> |

<!-- [2026/05/25 変更] 明細行IDを商品コード+ロット番号 → 受注IDに変更 -->

明細行 `<tr>` のIDは `detail-{受注ID}` の形式とする。

| 例             | 対象         |
| -------------- | ------------ |
| `detail-O-001` | 受注ID O-001 |
| `detail-O-003` | 受注ID O-003 |

---

### JS 関数

| 関数名                                          | 流用/新規 | 概要                                                                                                                                                                                                            |
| ----------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initAllocationDateRange()`                     | 新規      | `#scheduleDateFrom` / `#scheduleDateTo` の `value` を今日の日付（`yyyy-mm-dd`）に設定する                                                                                                                       |
| `initScheduleUpdatedAt()`                       | 流用      | `#scheduleUpdatedAt` に現在日時を `yyyy/mm/dd hh:mm:ss` 形式でセットする                                                                                                                                        |
| `runAllocationCheck()`                          | 新規      | `#allocationRunBtn` クリック時に呼び出す。`#allocationTableSection` を表示し、`initScheduleUpdatedAt()` を呼び出して最終更新日時を現在時刻に更新する（モックアップのためデータは固定）                          |
| `filterAllocationTable(query)`                  | 新規      | `#allocationTable` の `.allocation-summary-row` を受注ID・受注日時・受注先で部分一致フィルタする。ヒットしない行と対応する `.allocation-detail-row` を `display: none` にする。展開状態のアイコンもリセットする |
| `toggleAllocationDetail(groupId, summaryRowEl)` | 新規      | `#detail-{groupId}` の `display` を `none` ↔ `table-row` でトグルする。`summaryRowEl` 内の `.allocation-expand-icon` に `.allocation-expand-icon--open` を付け外しする                                          |
| `openModal(id)` / `closeModal(id)`              | 流用      | `#allocationConfirmModal` の表示・非表示を制御する（`ui_components.md` 共通実装）<!-- [2026/05/25 変更] 追加 -->                                                                                                |

#### `filterAllocationTable` のロジック

<!-- [2026/05/25 変更] 検索対象を 商品コード/商品名/ロット番号(列1-3) → 受注ID/受注日時/受注先(列1-3) に変更 -->
<!-- [2026/05/25 変更] 列インデックスを cells[1,2,3] → cells[3,4,5] に変更（チェックボックス・展開アイコン・出荷日列追加に伴う） -->

```text
query = #allocationSearch の入力値を小文字化

for each .allocation-summary-row:
  cells = [受注ID(3), 受注日時(4), 受注先(5)] の textContent を小文字化した配列
  hit   = cells.some(c => c.includes(query))
  summaryRow.style.display = hit ? '' : 'none'

  // 対応する明細行も非表示（フィルタ中は閉じる）
  detailId  = summaryRow に設定した data-group-id
  detailRow = document.getElementById('detail-' + detailId)
  if detailRow:
    detailRow.style.display = 'none'
    summaryRow 内の .allocation-expand-icon から --open クラスを除去
```

---

### スペーシング規則

| 箇所                                   | トークン    | px相当 |
| -------------------------------------- | ----------- | ------ |
| コントロール行とテーブルセクションの間 | `space.300` | 24px   |
| テーブルヘッダー・セルの上下パディング | `space.100` | 8px    |
| テーブルヘッダー・セルの左右パディング | `space.150` | 12px   |
| 明細エリアの左右パディング             | `space.300` | 24px   |
| 明細行の上下パディング                 | `space.075` | 6px    |
| 明細グリッドの列間隔                   | `space.150` | 12px   |

---

## 変更履歴

| 日時       | 変更者 | 変更内容                                                                                                                                                                                                                                                                                                                                                     |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026/05/18 | -      | 新規作成                                                                                                                                                                                                                                                                                                                                                     |
| 2026/05/18 | -      | 日付フィルタを単一日付から日付範囲（開始日〜終了日）に変更。デフォルト値を翌日→今日に変更                                                                                                                                                                                                                                                                    |
| 2026/05/18 | -      | テーブル構造を出荷予定単位から商品・ロット単位のサマリー＋アコーディオン明細に変更。引き当て結果をOK/NGの2値に変更。ダミーデータを1週間分に更新                                                                                                                                                                                                              |
| 2026/05/18 | -      | 画面設計を追記（HTML骨格・アコーディオン状態遷移・CSSクラス詳細・JS関数ロジック）                                                                                                                                                                                                                                                                            |
| 2026/05/18 | -      | 引き当て実行ボタンを追加。機能概要・機能1・レイアウト図・使用コンポーネント・DOM ID・JS関数を更新                                                                                                                                                                                                                                                            |
| 2026/05/18 | -      | ボタン押下時にテーブル表示する仕様に変更。初期状態はテーブル非表示。機能1・レイアウト図・DOM ID・JS関数・HTML骨格を更新                                                                                                                                                                                                                                      |
| 2026/05/25 | -      | グルーピング単位を商品・ロット番号 → 受注IDに変更。サマリー行カラムを受注ID/受注日時/受注先/引き当て結果に変更。明細行カラムを商品コード/商品名/ロット番号/数量/残在庫数/結果に変更。引き当てロジックを全受注IDまたぎの残在庫方式に変更。ダミーデータ・HTML骨格・CSSクラス・DOM ID・JS関数を更新                                                             |
| 2026/05/25 | -      | サマリー行に出荷日列・チェックボックス列・ステータス列を追加（8列化）。並び順を受注日時昇順→出荷日昇順に変更。NG行チェックボックスを disabled に変更。ステータス値「なし」「引き当て済み」をダミーデータに追加。filterAllocationTable の検索列インデックスを cells[1,2,3] → cells[3,4,5] に変更。レイアウト図・使用コンポーネント・HTML骨格・CSSクラスを更新 |
| 2026/05/25 | -      | ステータス「引き当て済み」行のチェックボックスも disabled に変更。「引き当て済みに変更」ボタン＋確認モーダルをセクションヘッダーに追加。操作列（引き当て表印刷ボタン・印刷済みテキスト）を追加し9列化。colspan を 8 → 9 に変更。機能5・機能6・CSSクラス・DOM ID・JS関数・レイアウト図・使用コンポーネント・HTML骨格を更新                                    |
| 2026/05/25 | -      | ダミーデータ O-002（田中物産）のステータスを「なし」→「引き当て済み」に変更。操作列は「引き当て表印刷」ボタンのみ表示（「印刷済み」テキストなし＝印刷前状態）。ダミーデータ・HTML骨格を更新                                                                                                                                                                  |
