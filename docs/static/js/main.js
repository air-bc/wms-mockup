// WMS Mockup — 共通スクリプト

/**
 * ファイル選択時にラベルのテキストをファイル名に更新する
 * @param {string} inputId  - input[type=file] の id
 * @param {string} labelId  - 表示テキストを持つ span の id
 */
function handleFileChange(inputId, labelId) {
  const input = document.getElementById(inputId);
  const label = document.getElementById(labelId);
  if (!input || !label) return;

  if (input.files.length > 0) {
    label.textContent = input.files[0].name;
    label.classList.add('has-file');
  } else {
    label.textContent = 'ファイルを選択してください (.csv)';
    label.classList.remove('has-file');
  }
}

// === オフキャンバスパネル制御 (SCR-002) ===

function openDefinitionPanel() {
  document.getElementById('definitionOverlay').classList.add('is-open');
  document.getElementById('definitionPanel').classList.add('is-open');
}

function closeDefinitionPanel() {
  document.getElementById('definitionOverlay').classList.remove('is-open');
  document.getElementById('definitionPanel').classList.remove('is-open');
}

/**
 * 定義テーブルをキーワードで絞り込む
 * @param {string} query - 検索文字列（ファイルコード・商品名対象）
 */
function filterDefinitionTable(query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll('#definitionTableBody tr');
  rows.forEach(function (row) {
    const csvCol  = (row.dataset.csvCol  || '').toLowerCase();
    const dbField = (row.dataset.dbField || '').toLowerCase();
    const match = !q || csvCol.includes(q) || dbField.includes(q);
    row.classList.toggle('hidden', !match);
  });
}

// Escape キーでオフキャンバスを閉じる
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeDefinitionPanel();
});

// === 雑コード変換テンプレート エントリ操作 (SCR-002 機能3) ===

/**
 * 雑コード入力行（コード名 + テンプレート + 削除ボタン）を末尾に追加する
 */
function addMiscCodeEntry() {
  var list = document.getElementById('miscCodeList');
  if (!list) return;

  var row = document.createElement('div');
  row.className = 'misc-code-row';
  row.setAttribute('role', 'listitem');
  row.innerHTML =
    '<input type="text" class="misc-code-name-input" placeholder="雑コード名" aria-label="雑コード名">' +
    '<input type="text" class="template-input" placeholder="例: {品番}-{日付}" aria-label="変換テンプレート">' +
    '<button type="button" class="btn btn-icon-subtle" onclick="deleteMiscCodeEntry(this)" aria-label="このエントリを削除">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>' +
      '</svg>' +
    '</button>';

  list.appendChild(row);
  // 追加した行のコード名フィールドにフォーカス
  row.querySelector('.misc-code-name-input').focus();
}

/**
 * 削除ボタンが属する .misc-code-row を DOM から除去する
 * @param {HTMLElement} btn - クリックされた削除ボタン要素
 */
function deleteMiscCodeEntry(btn) {
  var row = btn.closest('.misc-code-row');
  if (row) row.remove();
}

// === 在庫明細フィルタ (SCR-004-1) ===

/**
 * テキスト入力で明細テーブル行を絞り込む（商品コード・商品名詳細 対象、リアルタイム）
 */
function filterDetailTable() {
  var text = (document.getElementById('detailTextFilter') || {}).value || '';
  var q = text.toLowerCase().trim();

  document.querySelectorAll('#detailTableBody tr').forEach(function (row) {
    var code = (row.dataset.code || '').toLowerCase();
    var name = (row.dataset.name || '').toLowerCase();
    var match = !q || code.includes(q) || name.includes(q);
    row.classList.toggle('hidden', !match);
  });
}

// === 移動履歴 CSV出力 (SCR-004-2) ===

/**
 * 移動履歴テーブルの全行を CSV ファイルとしてダウンロードする
 */
function exportHistoryCSV() {
  var table = document.getElementById('inventoryHistoryTable');
  if (!table) return;

  var rows = [];
  table.querySelectorAll('tr').forEach(function (tr) {
    var cells = tr.querySelectorAll('th, td');
    var cols = Array.prototype.map.call(cells, function (cell) {
      var text = cell.textContent.trim().replace(/\s+/g, ' ');
      return '"' + text.replace(/"/g, '""') + '"';
    });
    rows.push(cols.join(','));
  });

  var bom = '﻿';
  var blob = new Blob([bom + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'inventory_history.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// === 入出荷予定情報 日付初期設定 (SCR-003) ===

/**
 * 最終更新日時を現在日時で設定する
 */
function initScheduleUpdatedAt() {
  var el = document.getElementById('scheduleUpdatedAt');
  if (!el) return;
  var now = new Date();
  var y  = now.getFullYear();
  var mo = String(now.getMonth() + 1).padStart(2, '0');
  var d  = String(now.getDate()).padStart(2, '0');
  var h  = String(now.getHours()).padStart(2, '0');
  var mi = String(now.getMinutes()).padStart(2, '0');
  var s  = String(now.getSeconds()).padStart(2, '0');
  el.textContent = '最終更新: ' + y + '/' + mo + '/' + d + ' ' + h + ':' + mi + ':' + s;
}

/**
 * 日付入力フィールドのデフォルト値を翌日に設定する
 */
function initScheduleDate() {
  var input = document.getElementById('scheduleDate');
  if (!input) return;
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var y = tomorrow.getFullYear();
  var m = String(tomorrow.getMonth() + 1).padStart(2, '0');
  var d = String(tomorrow.getDate()).padStart(2, '0');
  input.value = y + '-' + m + '-' + d;
}

// === 在庫一覧フィルタ (SCR-004) ===

/**
 * テキスト入力と状態チェックボックスを AND 条件でテーブル行を絞り込む
 */
function filterInventoryTable() {
  var text = (document.getElementById('inventoryTextFilter') || {}).value || '';
  var q = text.toLowerCase().trim();

  var checkedStatuses = [];
  document.querySelectorAll('.inventory-status-filter input[type="checkbox"]').forEach(function (cb) {
    if (cb.checked) checkedStatuses.push(cb.value);
  });

  document.querySelectorAll('#inventoryTableBody tr').forEach(function (row) {
    var code   = (row.dataset.code   || '').toLowerCase();
    var name   = (row.dataset.name   || '').toLowerCase();
    var status = row.dataset.status  || '';

    var textMatch   = !q || code.includes(q) || name.includes(q);
    var statusMatch = checkedStatuses.indexOf(status) !== -1;

    row.classList.toggle('hidden', !(textMatch && statusMatch));
  });
}

// === 文字列検索 (SCR-003 機能5) ===

function filterScheduleTables(query) {
  var q = query.toLowerCase();
  var SEARCH_INDICES = [2, 3, 4, 6, 9];
  ['inboundScheduleTable', 'outboundScheduleTable'].forEach(function (tableId) {
    var table = document.getElementById(tableId);
    if (!table) return;
    table.querySelectorAll('tbody tr').forEach(function (row) {
      var cells = row.querySelectorAll('td');
      var match = !q || SEARCH_INDICES.some(function (i) {
        return cells[i] && cells[i].textContent.toLowerCase().includes(q);
      });
      row.style.display = match ? '' : 'none';
    });
  });
}

// === 入荷予定一覧 文字列検索 (renew SCR-003) ===

function filterInboundScheduleTable(query) {
  var q = query.toLowerCase();
  var SEARCH_INDICES = [3, 4, 5, 7, 10];
  var table = document.getElementById('inboundScheduleTable');
  if (!table) return;
  table.querySelectorAll('tbody tr').forEach(function (row) {
    var cells = row.querySelectorAll('td');
    var match = !q || SEARCH_INDICES.some(function (i) {
      return cells[i] && cells[i].textContent.toLowerCase().includes(q);
    });
    row.style.display = match ? '' : 'none';
  });
}

// === 出荷予定一覧 文字列検索 (renew SCR-007) ===

function filterOutboundScheduleTable(query) {
  var q = query.toLowerCase();
  var SEARCH_INDICES = [3, 4, 5, 7, 10];
  var table = document.getElementById('outboundScheduleTable');
  if (!table) return;
  table.querySelectorAll('tbody tr').forEach(function (row) {
    var cells = row.querySelectorAll('td');
    var match = !q || SEARCH_INDICES.some(function (i) {
      return cells[i] && cells[i].textContent.toLowerCase().includes(q);
    });
    row.style.display = match ? '' : 'none';
  });
}

// === 特記事項インライン編集 (SCR-003 機能4) ===

/**
 * 特記事項欄の確定処理（Enter押下 or フォーカスアウト時）
 * 値が空でなければ is-confirmed を付与してボーダーを非表示にする。
 * 空の場合は is-confirmed を除去して未入力状態（ボーダー表示）に戻す。
 * @param {HTMLInputElement} input
 */
function confirmRemarksInput(input) {
  if (input.value.trim() !== '') {
    input.classList.add('is-confirmed');
  } else {
    input.classList.remove('is-confirmed');
  }
}

/**
 * 特記事項欄のフォーカス取得時（クリックによる再編集）
 * is-confirmed を除去してボーダーを再表示する。
 * @param {HTMLInputElement} input
 */
function editRemarksInput(input) {
  input.classList.remove('is-confirmed');
}

initScheduleDate();
initScheduleUpdatedAt();

// === 入荷検品・棚入れ検品 (SCR-006) ===

var VEHICLES = [
  { id: 'V001', time: '08:30', remarks: '大阪230 あ 1234',              itemCount: 3, totalQty: 15 },
  { id: 'V002', time: '09:15', remarks: '神戸330 い 5678 / 佐藤 一郎', itemCount: 2, totalQty: 8  },
  { id: 'V003', time: '10:00', remarks: '京都400 う 9012',              itemCount: 5, totalQty: 30 },
  { id: 'V004', time: '11:30', remarks: '',                             itemCount: 1, totalQty: 24 },
  { id: 'V005', time: '13:00', remarks: '兵庫150 お 7890',              itemCount: 4, totalQty: 20 },
];

var INBOUND_PRODUCTS = [
  { code: 'P-10001', name: '電動ドリル 18V',     qty: '5個' },
  { code: 'P-10002', name: '充電バッテリー 18V',  qty: '8個' },
  { code: 'P-10003', name: 'ドリルビットセット',   qty: '2個' },
];

var PUTAWAY_PRODUCTS = [
  { code: 'P-10001', name: '電動ドリル 18V',     qty: '5個' },
  { code: 'P-10002', name: '充電バッテリー 18V',  qty: '8個' },
  { code: 'P-10003', name: 'ドリルビットセット',   qty: '2個' },
];

// 車両ごとのチェック状態。V001・V002 は入荷検品済み（初期ダミー）
var inboundCheckState = {
  vehicles: {
    'V001': { inboundDone: true,  putawayDone: false,
              inboundChecked: { 'P-10001': true, 'P-10002': true, 'P-10003': true },
              putawayChecked: {} },
    'V002': { inboundDone: true,  putawayDone: false,
              inboundChecked: { 'P-10001': true, 'P-10002': true, 'P-10003': true },
              putawayChecked: {} },
    'V003': { inboundDone: false, putawayDone: false, inboundChecked: {}, putawayChecked: {} },
    'V004': { inboundDone: false, putawayDone: false, inboundChecked: {}, putawayChecked: {} },
    'V005': { inboundDone: false, putawayDone: false, inboundChecked: {}, putawayChecked: {} },
  },
  currentVehicleId: null,
  currentTab: 'inbound',
  pendingPutawayCode: null,
};

/**
 * SCR-006 画面初期化。DOMが存在する場合のみ実行する。
 */
function initInboundCheck() {
  if (!document.getElementById('view-inbound-list')) return;
  renderVehicleList('inbound');
  renderVehicleList('putaway');
  showPhoneView('view-inbound-list');
}

/**
 * 指定ビューを表示し他を非表示にする。ヘッダー・タブの表示状態も更新する。
 * @param {string} viewId
 */
function showPhoneView(viewId) {
  var views = ['view-inbound-list', 'view-putaway-list', 'view-inbound-products', 'view-putaway-products'];
  views.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.style.display = (id === viewId) ? '' : 'none';
  });

  var isMainView = (viewId === 'view-inbound-list' || viewId === 'view-putaway-list');
  var tabs    = document.getElementById('phoneTabs');
  var backBtn = document.getElementById('phoneBackBtn');
  var title   = document.getElementById('phoneTitle');

  if (tabs)    tabs.style.display    = isMainView ? '' : 'none';
  if (backBtn) backBtn.style.display = isMainView ? 'none' : '';

  if (title) {
    var titles = {
      'view-inbound-list':     '入荷検品・棚入れ検品',
      'view-putaway-list':     '入荷検品・棚入れ検品',
      'view-inbound-products': '入荷商品一覧',
      'view-putaway-products': '棚入れ商品一覧',
    };
    title.textContent = titles[viewId] || '';
  }
}

/**
 * タブ切り替え
 * @param {'inbound'|'putaway'} tab
 */
function switchInboundTab(tab) {
  inboundCheckState.currentTab = tab;
  var tabInbound = document.getElementById('tabInbound');
  var tabPutaway = document.getElementById('tabPutaway');
  if (tabInbound) tabInbound.classList.toggle('active', tab === 'inbound');
  if (tabPutaway) tabPutaway.classList.toggle('active', tab === 'putaway');
  showPhoneView(tab === 'inbound' ? 'view-inbound-list' : 'view-putaway-list');
}

/**
 * 車両行タップ時: 商品一覧サブ画面へ遷移する
 * @param {string} vehicleId
 * @param {'inbound'|'putaway'} type
 */
function navigateToProducts(vehicleId, type) {
  inboundCheckState.currentVehicleId = vehicleId;
  renderProductList(vehicleId, type);
  showPhoneView(type === 'inbound' ? 'view-inbound-products' : 'view-putaway-products');
}

/**
 * 戻るボタン: 元のリストビューへ戻る
 */
function navigateBack() {
  var tab = inboundCheckState.currentTab;
  showPhoneView(tab === 'inbound' ? 'view-inbound-list' : 'view-putaway-list');
  inboundCheckState.currentVehicleId = null;
}

/**
 * 商品行ダブルクリック時。入荷はそのままチェック、棚入れはモーダルを開く。
 * @param {string} productCode
 * @param {'inbound'|'putaway'} type
 */
function handleProductDblClick(productCode, type) {
  if (type === 'putaway') {
    openPutawayModal(productCode);
    return;
  }

  var vehicleId = inboundCheckState.currentVehicleId;
  if (!vehicleId) return;
  var vState = inboundCheckState.vehicles[vehicleId];
  if (!vState) return;

  if (vState.inboundChecked[productCode]) return;

  vState.inboundChecked[productCode] = true;

  var row = document.querySelector(
    '[data-product-code="' + productCode + '"][data-product-type="inbound"]'
  );
  if (row) row.classList.add('checked');

  var allChecked = INBOUND_PRODUCTS.every(function (p) { return vState.inboundChecked[p.code]; });
  if (allChecked) {
    vState.inboundDone = true;
    renderVehicleList('inbound');
    renderVehicleList('putaway');
  }
}

/**
 * 棚入れモーダルを開く
 * @param {string} productCode
 */
function openPutawayModal(productCode) {
  var vState = inboundCheckState.vehicles[inboundCheckState.currentVehicleId];
  if (!vState) return;
  var entry = vState.putawayChecked[productCode];
  if (entry && entry.checked) return;

  inboundCheckState.pendingPutawayCode = productCode;
  var overlay = document.getElementById('putawayModalOverlay');
  var modal   = document.getElementById('putawayModal');
  if (overlay) overlay.style.display = 'block';
  if (modal)   modal.style.display   = 'flex';
}

/**
 * 棚入れモーダルを閉じる
 */
function closePutawayModal() {
  inboundCheckState.pendingPutawayCode = null;
  var overlay = document.getElementById('putawayModalOverlay');
  var modal   = document.getElementById('putawayModal');
  if (overlay) overlay.style.display = 'none';
  if (modal)   modal.style.display   = 'none';
}

/**
 * モーダル内ダミー棚コードのダブルクリック: 棚コードスキャン完了として処理する
 */
function handleShelfDblClick() {
  var productCode = inboundCheckState.pendingPutawayCode;
  if (!productCode) return;

  var vehicleId = inboundCheckState.currentVehicleId;
  var vState = inboundCheckState.vehicles[vehicleId];
  if (!vState) return;

  var scannedLoc = 'L-99-99';
  vState.putawayChecked[productCode] = { checked: true, scannedLoc: scannedLoc };

  var row = document.querySelector(
    '[data-product-code="' + productCode + '"][data-product-type="putaway"]'
  );
  if (row) {
    row.classList.add('checked');
    var locEl = document.createElement('div');
    locEl.className = 'product-row-loc';
    locEl.textContent = scannedLoc;
    var codeEl = row.querySelector('.product-row-code');
    if (codeEl) row.insertBefore(locEl, codeEl);
  }

  closePutawayModal();

  var allChecked = PUTAWAY_PRODUCTS.every(function (p) {
    var e = vState.putawayChecked[p.code];
    return e && e.checked;
  });
  if (allChecked) {
    vState.putawayDone = true;
    renderVehicleList('putaway');
  }
}

/**
 * 指定タイプの車両リストを再描画する
 * @param {'inbound'|'putaway'} type
 */
function renderVehicleList(type) {
  var containerId = type === 'inbound' ? 'view-inbound-list' : 'view-putaway-list';
  var container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  var vehicles = VEHICLES.filter(function (v) {
    if (type === 'inbound') return true;
    // 棚入れ予定は入荷検品完了済みの車両のみ
    return inboundCheckState.vehicles[v.id] && inboundCheckState.vehicles[v.id].inboundDone;
  });

  vehicles.forEach(function (v) {
    var vState = inboundCheckState.vehicles[v.id];
    var isDone = type === 'inbound' ? vState.inboundDone : vState.putawayDone;

    var row = document.createElement('div');
    row.className = 'vehicle-row' + (isDone ? ' checked' : '');
    var label = (v.remarks && v.remarks.trim()) ? v.remarks : '未割当';
    row.innerHTML =
      '<div class="vehicle-row-top">' +
        '<span class="vehicle-check-icon" aria-hidden="true">✓</span>' +
        '<span>' + v.time + '&ensp;' + label + '</span>' +
      '</div>' +
      '<div class="vehicle-row-bottom">' +
        '<span class="vehicle-row-qty">' + v.itemCount + '品目 / ' + v.totalQty + '個</span>' +
        '<span class="vehicle-row-arrow" aria-hidden="true">›</span>' +
      '</div>';

    if (!isDone) {
      (function (vehicleId, t) {
        row.addEventListener('click', function () { navigateToProducts(vehicleId, t); });
      }(v.id, type));
    }

    container.appendChild(row);
  });
}

/**
 * 指定車両の商品リストを描画する
 * @param {string} vehicleId
 * @param {'inbound'|'putaway'} type
 */
function renderProductList(vehicleId, type) {
  var containerId = type === 'inbound' ? 'view-inbound-products' : 'view-putaway-products';
  var container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  var vState = inboundCheckState.vehicles[vehicleId];
  var checkedMap = type === 'inbound' ? vState.inboundChecked : vState.putawayChecked;
  var products = type === 'inbound' ? INBOUND_PRODUCTS : PUTAWAY_PRODUCTS;

  products.forEach(function (p) {
    var entry = type === 'putaway' ? checkedMap[p.code] : null;
    var isChecked = type === 'inbound' ? !!checkedMap[p.code] : !!(entry && entry.checked);
    var row = document.createElement('div');
    row.className = 'product-row' + (isChecked ? ' checked' : '');
    row.dataset.productCode = p.code;
    row.dataset.productType = type;

    var inner = '';
    if (type === 'putaway' && entry && entry.scannedLoc) {
      inner += '<div class="product-row-loc">' + entry.scannedLoc + '</div>';
    }
    inner +=
      '<div class="product-row-code">' +
        '<span class="product-check-icon" aria-hidden="true">✓</span>' +
        p.code + '&ensp;' + p.name +
      '</div>' +
      '<div class="product-row-qty">' + p.qty + '</div>';
    row.innerHTML = inner;

    (function (code, t) {
      row.addEventListener('dblclick', function () { handleProductDblClick(code, t); });
    }(p.code, type));

    container.appendChild(row);
  });
}

initInboundCheck();

// === 棚ロケ定義 (SCR-005) ===

var shelfLocations = [
  { code: 'A-01-01-1' },
  { code: 'A-01-01-2' },
  { code: 'A-01-02-1' },
  { code: 'A-02-01-1' },
  { code: 'B-01-01-1' },
  { code: 'B-01-02-1' },
  { code: 'C-01-01-1' },
];

var berths = [
  { id: 'B1', name: '第1バース' },
  { id: 'B2', name: '第2バース' },
  { id: 'B3', name: '第3バース' },
];

var dragSrcIndex = -1;

function initShelfLocation() {
  if (!document.getElementById('shelfTableBody')) return;
  renderShelfTable();
  renderPickRouteTable();
  renderBerthTable();
}

function switchShelfTab(tabName) {
  var map = {
    shelf: { panel: 'panelShelf', btn: 'tabShelf' },
    route: { panel: 'panelRoute', btn: 'tabRoute' },
    berth: { panel: 'panelBerth', btn: 'tabBerth' },
  };
  Object.keys(map).forEach(function (t) {
    var isActive = (t === tabName);
    var panel = document.getElementById(map[t].panel);
    var btn   = document.getElementById(map[t].btn);
    if (panel) panel.classList.toggle('active', isActive);
    if (btn) {
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    }
  });
}

function addShelfLocation() {
  var codeEl = document.getElementById('shelfCodeInput');
  var code   = codeEl ? codeEl.value.trim() : '';

  if (!code) {
    alert('棚ロケコードを入力してください。');
    return;
  }
  if (shelfLocations.some(function (s) { return s.code === code; })) {
    alert('棚ロケコード「' + code + '」はすでに登録されています。');
    return;
  }

  shelfLocations.push({ code: code });
  shelfLocations.sort(function (a, b) { return a.code < b.code ? -1 : a.code > b.code ? 1 : 0; });

  if (codeEl) codeEl.value = '';

  renderShelfTable();
  renderPickRouteTable();
}

function deleteShelfLocation(code) {
  if (!confirm('棚ロケ「' + code + '」を削除しますか？')) return;
  shelfLocations = shelfLocations.filter(function (s) { return s.code !== code; });
  renderShelfTable();
  renderPickRouteTable();
}

function renderShelfTable() {
  var tbody = document.getElementById('shelfTableBody');
  if (!tbody) return;
  var showPickOrder = !!document.getElementById('shelfPickOrderHeader');
  tbody.innerHTML = '';
  shelfLocations.forEach(function (s, index) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td style="width:32px"><input type="checkbox" class="shelf-row-check"></td>' +
      '<td>' + s.code + '</td>' +
      (showPickOrder ? '<td style="text-align:center; color:var(--ds-text-subtle)">' + (index + 1) + '</td>' : '') +
      '<td><button class="btn-delete" onclick="deleteShelfLocation(\'' + s.code + '\')">削除</button></td>';
    tbody.appendChild(tr);
  });
}

function toggleAllShelfChecks(masterCb) {
  document.querySelectorAll('.shelf-row-check').forEach(function (cb) {
    cb.checked = masterCb.checked;
  });
}

function printShelfQR() {
  alert('QR印刷（モックアップ）');
}

function renderPickRouteTable() {
  var tbody = document.getElementById('pickRouteTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  shelfLocations.forEach(function (s, index) {
    var tr = document.createElement('tr');
    tr.className = 'pick-route-row';
    tr.draggable = true;
    tr.dataset.index = index;
    tr.innerHTML =
      '<td style="text-align:center; color:var(--ds-text-subtle)">' + (index + 1) + '</td>' +
      '<td>' + s.code + '</td>' +
      '<td class="drag-handle" title="ドラッグして並び替え">&#8801;</td>';
    tbody.appendChild(tr);
  });

  initDragAndDrop();
}

/**
 * ドラッグ&ドロップのイベントを各行に設定する
 */
function initDragAndDrop() {
  var rows = document.querySelectorAll('.pick-route-row');

  rows.forEach(function (row) {
    row.addEventListener('dragstart', function (e) {
      dragSrcIndex = parseInt(row.dataset.index, 10);
      row.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    row.addEventListener('dragend', function () {
      row.classList.remove('dragging');
      document.querySelectorAll('.pick-route-row').forEach(function (r) {
        r.classList.remove('drag-over-top', 'drag-over-bottom');
      });
    });

    row.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      var rect = row.getBoundingClientRect();
      row.classList.remove('drag-over-top', 'drag-over-bottom');
      row.classList.add(e.clientY < rect.top + rect.height / 2 ? 'drag-over-top' : 'drag-over-bottom');
    });

    row.addEventListener('dragleave', function () {
      row.classList.remove('drag-over-top', 'drag-over-bottom');
    });

    row.addEventListener('drop', function (e) {
      e.preventDefault();
      var targetIndex = parseInt(row.dataset.index, 10);
      if (dragSrcIndex === targetIndex) return;

      var rect     = row.getBoundingClientRect();
      var isTop    = e.clientY < rect.top + rect.height / 2;
      var moved    = shelfLocations.splice(dragSrcIndex, 1)[0];
      // splice後のインデックス調整: 元位置より後ろならターゲットが1つ前にずれている
      var adjusted = dragSrcIndex < targetIndex ? targetIndex - 1 : targetIndex;
      shelfLocations.splice(isTop ? adjusted : adjusted + 1, 0, moved);

      renderPickRouteTable();
    });
  });
}

/**
 * バース一覧テーブルを再描画する
 */
function renderBerthTable() {
  var tbody = document.getElementById('berthTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  berths.forEach(function (b) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + b.id + '</td>' +
      '<td>' + b.name + '</td>' +
      '<td><button class="btn-delete" onclick="deleteBerth(\'' + b.id + '\')">削除</button></td>';
    tbody.appendChild(tr);
  });
}

/**
 * バースを追加する
 */
function addBerth() {
  var idEl   = document.getElementById('berthIdInput');
  var nameEl = document.getElementById('berthNameInput');
  var id     = idEl   ? idEl.value.trim()   : '';
  var name   = nameEl ? nameEl.value.trim() : '';

  if (!id) {
    alert('バース番号を入力してください。');
    return;
  }
  if (berths.some(function (b) { return b.id === id; })) {
    alert('バース番号「' + id + '」はすでに登録されています。');
    return;
  }

  berths.push({ id: id, name: name });
  if (idEl)   idEl.value   = '';
  if (nameEl) nameEl.value = '';

  renderBerthTable();
}

/**
 * バースを削除する
 * @param {string} id
 */
function deleteBerth(id) {
  if (!confirm('バース「' + id + '」を削除しますか？')) return;
  berths = berths.filter(function (b) { return b.id !== id; });
  renderBerthTable();
}

initShelfLocation();

// ============================================================
// SCR-008: 棚移動検品
// ============================================================

const PRODUCT_MASTER = {
  'ITM-001': '冷凍食品A',
  'ITM-002': '冷凍食品B',
  'ITM-003': '冷凍食品C',
  'ITM-010': '飲料C',
  'ITM-011': '飲料D',
};

const transferState = {
  sources: [],
  activeSourceIdx: null,
  lastSourceIdx: null,
  lastDestIdx: null,
};

function initShelfTransfer() {
  if (!document.getElementById('transferList')) return;

  transferState.sources = [
    {
      shelfCode: 'S-A01',
      products: [
        { code: 'ITM-001', name: '冷凍食品A', qty: 3 },
        { code: 'ITM-002', name: '冷凍食品B', qty: 1 },
      ],
      active: true,
      dests: [
        {
          shelfCode: 'S-C02',
          products: [
            { code: 'ITM-001', name: '冷凍食品A', qty: 3 },
            { code: 'ITM-002', name: '冷凍食品B', qty: 1 },
          ],
        },
      ],
    },
    {
      shelfCode: 'S-B03',
      products: [
        { code: 'ITM-010', name: '飲料C', qty: 2 },
      ],
      active: false,
      dests: [],
    },
  ];
  transferState.activeSourceIdx = 0;
  transferState.lastSourceIdx = 1;
  transferState.lastDestIdx = 0;

  renderTransfer();
  renderScanBar();

  var input = document.getElementById('scanInput');
  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleScanInput(this.value);
    });
    input.focus();
  }
}

function handleScanInput(value) {
  var v = value.trim();
  if (!v) return;
  if (isShelfCode(v)) {
    processShelfScan(v.toUpperCase());
  } else {
    processProductScan(v.toUpperCase());
  }
  renderScanBar();
  var input = document.getElementById('scanInput');
  if (input) { input.value = ''; input.focus(); }
}

function isShelfCode(value) {
  return value.toUpperCase().startsWith('S-');
}

function getCurrentMode() {
  return transferState.activeSourceIdx !== null ? 'dest' : 'source';
}

function processShelfScan(code) {
  if (getCurrentMode() === 'source') {
    transferState.sources.push({ shelfCode: code, products: [], active: false, dests: [] });
    transferState.lastSourceIdx = transferState.sources.length - 1;
  } else {
    var src = transferState.sources[transferState.activeSourceIdx];
    src.dests.push({ shelfCode: code, products: [] });
    transferState.lastDestIdx = src.dests.length - 1;
  }
  renderTransfer();
}

function processProductScan(code) {
  var name = getProductName(code);
  if (getCurrentMode() === 'source') {
    if (transferState.lastSourceIdx === null) return;
    var src = transferState.sources[transferState.lastSourceIdx];
    var existing = src.products.find(function (p) { return p.code === code; });
    if (existing) { existing.qty++; } else { src.products.push({ code: code, name: name, qty: 1 }); }
  } else {
    if (transferState.lastDestIdx === null) return;
    var src = transferState.sources[transferState.activeSourceIdx];
    var dest = src.dests[transferState.lastDestIdx];
    var existing = dest.products.find(function (p) { return p.code === code; });
    if (existing) { existing.qty++; } else { dest.products.push({ code: code, name: name, qty: 1 }); }
  }
  renderTransfer();
}

function setActiveSource(idx) {
  if (transferState.activeSourceIdx === idx) {
    transferState.sources[idx].active = false;
    transferState.activeSourceIdx = null;
    transferState.lastDestIdx = null;
  } else {
    if (transferState.activeSourceIdx !== null) {
      transferState.sources[transferState.activeSourceIdx].active = false;
    }
    transferState.sources[idx].active = true;
    transferState.activeSourceIdx = idx;
    var dests = transferState.sources[idx].dests;
    transferState.lastDestIdx = dests.length > 0 ? dests.length - 1 : null;
  }
  renderTransfer();
  renderScanBar();
  var input = document.getElementById('scanInput');
  if (input) input.focus();
}

function renderTransfer() {
  var list = document.getElementById('transferList');
  if (!list) return;
  list.innerHTML = '';

  if (transferState.sources.length === 0) {
    list.innerHTML = '<div class="transfer-col-empty">移動元棚QRをスキャンしてください</div>';
    return;
  }

  transferState.sources.forEach(function (src, idx) {
    var row = document.createElement('div');
    row.className = 'transfer-row';

    // 左: 移動元棚枠
    var srcSide = document.createElement('div');
    srcSide.className = 'transfer-row-source';

    var srcFrame = document.createElement('div');
    srcFrame.className = 'shelf-frame' + (src.active ? ' active' : '');
    srcFrame.onclick = function () { setActiveSource(idx); };

    var srcHeader = document.createElement('div');
    srcHeader.className = 'shelf-frame-header';
    var codeSpan = document.createElement('span');
    codeSpan.textContent = src.shelfCode;
    srcHeader.appendChild(codeSpan);
    if (src.active) {
      var badge = document.createElement('span');
      badge.className = 'shelf-frame-active-badge';
      badge.textContent = '選択中';
      srcHeader.appendChild(badge);
    }

    var srcProducts = document.createElement('div');
    srcProducts.className = 'shelf-frame-products';
    src.products.forEach(function (p) {
      var pRow = document.createElement('div');
      pRow.className = 'shelf-product-row';
      pRow.innerHTML = p.code + ' ' + p.name + ' <span class="shelf-product-qty">×' + p.qty + '</span>';
      srcProducts.appendChild(pRow);
    });

    srcFrame.appendChild(srcHeader);
    srcFrame.appendChild(srcProducts);
    srcSide.appendChild(srcFrame);

    // 右: 移動先棚枠（なければ空欄）
    var destSide = document.createElement('div');
    destSide.className = 'transfer-row-dest';

    if (src.dests.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'dest-slot-empty';
      destSide.appendChild(empty);
    } else {
      src.dests.forEach(function (dest) {
        var destFrame = document.createElement('div');
        destFrame.className = 'shelf-frame';

        var destHeader = document.createElement('div');
        destHeader.className = 'shelf-frame-header';
        destHeader.textContent = dest.shelfCode;

        var destProducts = document.createElement('div');
        destProducts.className = 'shelf-frame-products';
        dest.products.forEach(function (p) {
          var pRow = document.createElement('div');
          pRow.className = 'shelf-product-row';
          pRow.innerHTML = p.code + ' ' + p.name + ' <span class="shelf-product-qty">×' + p.qty + '</span>';
          destProducts.appendChild(pRow);
        });

        destFrame.appendChild(destHeader);
        destFrame.appendChild(destProducts);
        destSide.appendChild(destFrame);
      });
    }

    row.appendChild(srcSide);
    row.appendChild(destSide);
    list.appendChild(row);
  });
}

function renderScanBar() {
  var indicator = document.getElementById('scanModeIndicator');
  if (!indicator) return;
  if (getCurrentMode() === 'source') {
    indicator.textContent = '移動元をスキャン中';
    indicator.className = 'scan-mode-indicator mode-source';
  } else {
    indicator.textContent = '移動先をスキャン中';
    indicator.className = 'scan-mode-indicator mode-dest';
  }
}

function getProductName(code) {
  return PRODUCT_MASTER[code] || '(不明商品)';
}

initShelfTransfer();

/* ============================================================
   SCR-009: 差異管理
   ============================================================ */

var DIFF_DATA = [
  { stock: 10, counted: 8,  diff: -2, shelf: 'S-A01', item: 'ITM-001', status: '未確認' },
  { stock: 5,  counted: 5,  diff: 0,  shelf: 'S-A01', item: 'ITM-002', status: '未確認' },
  { stock: 20, counted: 23, diff: 3,  shelf: 'S-B03', item: 'ITM-010', status: '未確認' },
  { stock: 3,  counted: 0,  diff: -3, shelf: 'S-C02', item: 'ITM-003', status: '未確認' },
  { stock: 15, counted: 15, diff: 0,  shelf: 'S-C02', item: 'ITM-011', status: '未確認' },
];

var diffState = {
  filterWarningOnly: false,
  searchQuery: '',
};

function initDiffTable() {
  if (!document.getElementById('diffTableBody')) return;
  renderDiffTable();
}

function renderDiffTable() {
  var tbody = document.getElementById('diffTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  var query = diffState.searchQuery.toLowerCase();

  DIFF_DATA.forEach(function (row) {
    var matchesFilter = !diffState.filterWarningOnly || row.diff !== 0;
    var matchesSearch = !query ||
      row.shelf.toLowerCase().indexOf(query) !== -1 ||
      row.item.toLowerCase().indexOf(query) !== -1;

    var tr = document.createElement('tr');
    if (!matchesFilter || !matchesSearch) {
      tr.className = 'hidden';
    } else if (row.diff !== 0) {
      tr.className = 'diff-row-warning';
    }

    var diffSign = row.diff > 0 ? '+' + row.diff : String(row.diff);
    var badgeClass = row.status === '確認済み' ? 'checked' : 'unchecked';

    tr.innerHTML =
      '<td>' + row.stock + '</td>' +
      '<td>' + row.counted + '</td>' +
      '<td>' + diffSign + '</td>' +
      '<td>' + row.shelf + '</td>' +
      '<td>' + row.item + '</td>' +
      '<td><span class="diff-status-badge ' + badgeClass + '">' + row.status + '</span></td>';

    tbody.appendChild(tr);
  });
}

function toggleDiffFilter() {
  var btn = document.getElementById('diffFilterToggle');
  if (!btn) return;
  diffState.filterWarningOnly = !diffState.filterWarningOnly;
  btn.dataset.active = String(diffState.filterWarningOnly);
  if (diffState.filterWarningOnly) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
  renderDiffTable();
}

function handleDiffSearch(value) {
  diffState.searchQuery = value;
  renderDiffTable();
}

function approveAllDiff() {
  if (!confirm('棚卸数を在庫数として確定します。よろしいですか？')) return;
  DIFF_DATA.forEach(function (row) {
    row.stock = row.counted;
    row.diff = 0;
    row.status = '確認済み';
  });
  renderDiffTable();
}

initDiffTable();

/* ============================================================
   SCR-009-1: 棚卸作業（棚一覧）
   ============================================================ */

var INVENTORY_SHELF_DATA = [
  { code: 'A-01-01-1', total: 5, scanned: 5 },
  { code: 'A-01-01-2', total: 3, scanned: 3 },
  { code: 'A-01-02-1', total: 4, scanned: 2 },
  { code: 'A-01-02-2', total: 2, scanned: 0 },
  { code: 'A-01-03-1', total: 4, scanned: 4 },
  { code: 'A-02-01-1', total: 3, scanned: 1 },
  { code: 'A-02-01-2', total: 3, scanned: 3 },
  { code: 'A-02-02-1', total: 5, scanned: 0 },
  { code: 'A-02-02-2', total: 2, scanned: 2 },
  { code: 'A-02-03-1', total: 4, scanned: 1 },
  { code: 'A-03-01-1', total: 3, scanned: 0 },
  { code: 'A-03-01-2', total: 3, scanned: 3 },
  { code: 'A-03-02-1', total: 6, scanned: 2 },
  { code: 'A-03-02-2', total: 2, scanned: 0 },
  { code: 'A-03-03-1', total: 1, scanned: 1 },
  { code: 'B-01-01-1', total: 4, scanned: 4 },
  { code: 'B-01-02-1', total: 3, scanned: 0 },
  { code: 'B-01-03-1', total: 3, scanned: 2 },
  { code: 'B-02-01-1', total: 4, scanned: 0 },
  { code: 'B-02-02-1', total: 5, scanned: 5 },
];

var inventoryShelfState = {
  filterCompleted: false,
  searchQuery: '',
};

function initInventoryShelfList() {
  if (!document.getElementById('shelfList')) return;
  renderShelfList();
}

function getFilteredShelves() {
  var query = inventoryShelfState.searchQuery.toLowerCase();
  return INVENTORY_SHELF_DATA.filter(function (shelf) {
    var isCompleted = shelf.scanned === shelf.total;
    var matchesFilter = !inventoryShelfState.filterCompleted || !isCompleted;
    var matchesSearch = !query || shelf.code.toLowerCase().indexOf(query) !== -1;
    return matchesFilter && matchesSearch;
  });
}

function createShelfCard(shelf) {
  var isCompleted = shelf.scanned === shelf.total;
  var pct = shelf.total > 0 ? Math.round((shelf.scanned / shelf.total) * 100) : 0;

  var card = document.createElement('div');
  card.className = 'shelf-card' + (isCompleted ? ' completed' : '');

  var badge = isCompleted
    ? '<span class="shelf-card-badge">完了</span>'
    : '';

  var fillClass = isCompleted ? 'fill-complete' : 'fill-incomplete';

  card.innerHTML =
    '<div class="shelf-card-header">' +
      '<span>' + shelf.code + '</span>' +
      badge +
    '</div>' +
    '<div class="shelf-card-progress">' +
      '<div class="shelf-progress-bar">' +
        '<div class="shelf-progress-bar-fill ' + fillClass + '" style="width:' + pct + '%"></div>' +
      '</div>' +
      '<span class="shelf-progress-text">' + shelf.scanned + ' / ' + shelf.total + '</span>' +
    '</div>';

  return card;
}

function renderShelfList() {
  var list = document.getElementById('shelfList');
  if (!list) return;
  list.innerHTML = '';
  var filtered = getFilteredShelves();
  filtered.forEach(function (shelf) {
    list.appendChild(createShelfCard(shelf));
  });
}

function toggleShelfCompletedFilter() {
  inventoryShelfState.filterCompleted = !inventoryShelfState.filterCompleted;
  var btn = document.getElementById('shelfFilterToggle');
  if (btn) {
    btn.classList.toggle('active', inventoryShelfState.filterCompleted);
    btn.setAttribute('aria-pressed', String(inventoryShelfState.filterCompleted));
  }
  renderShelfList();
}

function handleShelfSearchInput(value) {
  inventoryShelfState.searchQuery = value;
  renderShelfList();
}

function handleShelfScan(code) {
  var trimmed = code.trim();
  if (!trimmed) return;
  var shelf = INVENTORY_SHELF_DATA.find(function (s) {
    return s.code === trimmed;
  });
  if (shelf) {
    location.href = 'inventory_count_items.html';
  } else {
    alert('棚コード「' + trimmed + '」が見つかりません');
  }
}

initInventoryShelfList();

/* ============================================================
   SCR-009-1-1: 棚卸作業（商品一覧）
   ============================================================ */

var COUNT_ITEMS_SHELF = 'A-01-01-1';

var COUNT_ITEMS_DATA = [
  { code: 'ITM-001', name: '冷凍食品A', stock: 12, counted: null },
  { code: 'ITM-002', name: '冷凍食品B', stock: 8,  counted: null },
  { code: 'ITM-003', name: '冷凍食品C', stock: 5,  counted: null },
  { code: 'ITM-010', name: '飲料C',     stock: 20, counted: null },
  { code: 'ITM-011', name: '飲料D',     stock: 3,  counted: null },
];

var countItemsState = {
  modalTargetCode: null,
};

function initCountItems() {
  var codeEl = document.getElementById('countShelfCode');
  if (!codeEl) return;
  codeEl.textContent = COUNT_ITEMS_SHELF;
  renderCountItemsTable();
}

function renderCountItemsTable() {
  var tbody = document.getElementById('countItemsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  COUNT_ITEMS_DATA.forEach(function (item) {
    var isEntered = item.counted !== null;
    var tr = document.createElement('tr');
    if (isEntered) tr.classList.add('entered');
    tr.innerHTML =
      '<td class="col-num">' + item.stock + '</td>' +
      '<td class="col-num">' + (isEntered ? item.counted : '-') + '</td>' +
      '<td>' + item.code + '</td>' +
      '<td>' + item.name + '</td>' +
      '<td class="col-status"><span class="count-item-status ' + (isEntered ? 'entered' : 'empty') + '">' +
        (isEntered ? '入力済み' : '未入力') +
      '</span></td>';
    tbody.appendChild(tr);
  });
}

function handleCountItemScan(code) {
  var trimmed = code.trim();
  if (!trimmed) return;
  var item = COUNT_ITEMS_DATA.find(function (d) { return d.code === trimmed; });
  if (item) {
    openCountModal(trimmed);
  } else {
    alert('商品コード「' + trimmed + '」はこの棚に存在しません');
  }
}

function openCountModal(code) {
  var item = COUNT_ITEMS_DATA.find(function (d) { return d.code === code; });
  if (!item) return;
  countItemsState.modalTargetCode = code;
  document.getElementById('countModalCode').textContent = item.code;
  document.getElementById('countModalName').textContent = item.name;
  var input = document.getElementById('countModalInput');
  input.value = item.counted !== null ? item.counted : '';
  document.getElementById('countModalOverlay').style.display = 'flex';
  setTimeout(function () { input.focus(); input.select(); }, 50);
}

function closeCountModal() {
  document.getElementById('countModalOverlay').style.display = 'none';
  countItemsState.modalTargetCode = null;
  document.getElementById('countScanInput').focus();
}

function confirmCountModal() {
  var code = countItemsState.modalTargetCode;
  if (!code) return;
  var input = document.getElementById('countModalInput');
  var val = parseInt(input.value, 10);
  if (isNaN(val) || val < 0) {
    alert('0以上の整数を入力してください');
    return;
  }
  var item = COUNT_ITEMS_DATA.find(function (d) { return d.code === code; });
  if (item) item.counted = val;
  closeCountModal();
  renderCountItemsTable();
}

function completeCountItems() {
  if (!confirm('この棚の棚卸を完了します。よろしいですか？')) return;
  location.href = 'inventory_count_shelf_list.html';
}

initCountItems();

// === 在庫修正 (SCR-004-3) ===

var PRODUCT_CODE_MAP = {
  '電動ドリル 18V':       'P-10001',
  '充電バッテリーパック':   'P-10002',
  'スチールラック 180cm':  'P-20031',
  '作業用手袋 Lサイズ':    'P-30055',
  '安全ヘルメット 白':     'P-40012',
  '防塵マスク 10枚入':     'P-50023',
  'パレット 1100×1100':   'P-60011',
  'パレット 800×1200':    'P-60012',
  '台車 折りたたみ式':     'P-70034',
  '結束バンド 100本入':    'P-80021',
  '緩衝材 ロール':         'P-90005',
  '段ボール箱 Mサイズ':    'P-90010'
};

function onProductNameChange() {
  var select = document.getElementById('editProductName');
  var codeInput = document.getElementById('editProductCode');
  if (!select || !codeInput) return;
  codeInput.value = PRODUCT_CODE_MAP[select.value] || '';
}

// === 入荷予定確定・出荷予定確定 行取り消しトグル (SCR-005 / SCR-011) ===
function toggleRowCancel(btn) {
  var row = btn.closest('tr');
  var cancelling = !row.classList.contains('schedule-row--cancelled');
  row.classList.toggle('schedule-row--cancelled', cancelling);
  row.querySelectorAll('select, input[type="number"]').forEach(function (el) {
    el.disabled = cancelling;
  });
  if (cancelling) {
    btn.textContent = '取消解除';
    btn.classList.remove('btn-danger');
    btn.classList.add('btn-default');
  } else {
    btn.textContent = '取消';
    btn.classList.remove('btn-default');
    btn.classList.add('btn-danger');
  }
  var cb = row.querySelector('.row-checkbox');
  if (cb) onRowCheckboxChange(cb);
}

function onRowCheckboxChange(checkbox) {
  var row = checkbox.closest('tr');
  row.classList.toggle('schedule-row--selected', checkbox.checked);
  updateSelectAllState();
}

function updateSelectAllState() {
  var selectAll = document.getElementById('selectAllRows');
  if (!selectAll) return;
  var table = selectAll.closest('table');
  if (!table) return;
  var checkboxes = Array.from(table.querySelectorAll('tbody .row-checkbox'));
  var checkedCount = checkboxes.filter(function (cb) { return cb.checked; }).length;
  if (checkedCount === 0) {
    selectAll.checked = false;
    selectAll.indeterminate = false;
  } else if (checkedCount === checkboxes.length) {
    selectAll.checked = true;
    selectAll.indeterminate = false;
  } else {
    selectAll.checked = false;
    selectAll.indeterminate = true;
  }
}

function onSelectAllChange() {
  var selectAll = document.getElementById('selectAllRows');
  if (!selectAll) return;
  var table = selectAll.closest('table');
  if (!table) return;
  var checked = selectAll.checked;
  table.querySelectorAll('tbody .row-checkbox').forEach(function (cb) {
    cb.checked = checked;
    cb.closest('tr').classList.toggle('schedule-row--selected', checked);
  });
}

// === SCR-004 手動入力フォーム ===

function initManualForm() {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var yyyy = tomorrow.getFullYear();
  var mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  var dd = String(tomorrow.getDate()).padStart(2, '0');
  var el = document.getElementById('inboundScheduleDate');
  if (el) el.value = yyyy + '-' + mm + '-' + dd;
}

var MANUAL_FORM_KEEP = ['inboundScheduleDate', 'inboundScheduleTime', 'slipNo', 'supplier'];
var MANUAL_FORM_CLEAR = ['itemCode', 'itemName', 'quantity', 'unitType', 'lotNo', 'expiryDate', 'note'];

function submitAndContinue() {
  MANUAL_FORM_CLEAR.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.value = el.tagName === 'SELECT' ? '' : '';
  });
  var first = document.getElementById('itemCode');
  if (first) first.focus();
}

function submitAndNavigate() {
  window.location.href = '003_inbound_schedule_list.html';
}

if (document.getElementById('manualInputForm')) {
  initManualForm();
}

// === SCR-006 入荷情報登録 ===

var INBOUND_REGISTER_KEEP = ['inboundDate', 'inboundTime', 'slipNo', 'supplier'];
var INBOUND_REGISTER_CLEAR = ['itemCode', 'itemName', 'shelfLocation', 'quantity', 'unitType', 'lotNo', 'expiryDate', 'note'];

function populateShelfSelect() {
  var sel = document.getElementById('shelfLocation');
  if (!sel) return;
  sel.innerHTML = '<option value="">棚ロケを選択</option>';
  shelfLocations.forEach(function(s) {
    var opt = document.createElement('option');
    opt.value = s.code;
    opt.textContent = s.code;
    sel.appendChild(opt);
  });
}

function initInboundRegister() {
  var today = new Date();
  var yyyy = today.getFullYear();
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var dd = String(today.getDate()).padStart(2, '0');
  var dateEl = document.getElementById('inboundDate');
  if (dateEl) dateEl.value = yyyy + '-' + mm + '-' + dd;
  populateShelfSelect();
}

function submitInboundAndContinue() {
  INBOUND_REGISTER_CLEAR.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.value = '';
  });
  var first = document.getElementById(INBOUND_REGISTER_CLEAR[0]);
  if (first) first.focus();
}

function submitInboundAndNavigate() {
  window.location.href = '003_inbound_schedule_list.html';
}

if (document.getElementById('inboundRegisterForm')) {
  initInboundRegister();
}

// === SCR-008 出荷予定登録 ===

function initOutboundManualForm() {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var yyyy = tomorrow.getFullYear();
  var mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  var dd = String(tomorrow.getDate()).padStart(2, '0');
  var el = document.getElementById('outboundScheduleDate');
  if (el) el.value = yyyy + '-' + mm + '-' + dd;
}

var OUTBOUND_FORM_KEEP = ['outboundScheduleDate', 'outboundScheduleTime', 'slipNo', 'shipTo'];
var OUTBOUND_FORM_CLEAR = ['itemCode', 'itemName', 'shelfLocation', 'quantity', 'unitType', 'lotNo', 'expiryDate', 'note'];

function outboundSubmitAndContinue() {
  OUTBOUND_FORM_CLEAR.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.value = '';
  });
  var first = document.getElementById('itemCode');
  if (first) first.focus();
}

function outboundSubmitAndNavigate() {
  window.location.href = '007_outbound_schedule_list.html';
}

if (document.getElementById('outboundManualInputForm')) {
  initOutboundManualForm();
}

// === ヘッダー ユーザーメニュー ===

function toggleUserMenu() {
  var dropdown = document.getElementById('userMenuDropdown');
  var btn = document.getElementById('userMenuBtn');
  if (!dropdown) return;
  var isOpen = dropdown.classList.toggle('is-open');
  if (btn) btn.setAttribute('aria-expanded', String(isOpen));
}

document.addEventListener('click', function (e) {
  var menu = document.querySelector('.app-header-user-menu');
  if (menu && !menu.contains(e.target)) {
    var dropdown = document.getElementById('userMenuDropdown');
    var btn = document.getElementById('userMenuBtn');
    if (dropdown) dropdown.classList.remove('is-open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
});

// === ADM-001 ユーザー一覧 ===

var USER_DATA = [
  { loginId: 'admin01', name: '山田 太郎', role: '管理者',       status: 'active',   deleted: false },
  { loginId: 'admin02', name: '鈴木 花子', role: '管理者',       status: 'active',   deleted: false },
  { loginId: 'ope001',  name: '田中 一郎', role: 'オペレーター', status: 'active',   deleted: false },
  { loginId: 'ope002',  name: '佐藤 二郎', role: 'オペレーター', status: 'active',   deleted: false },
  { loginId: 'ope003',  name: '伊藤 三郎', role: 'オペレーター', status: 'active',   deleted: false },
  { loginId: 'ope004',  name: '渡辺 四郎', role: 'オペレーター', status: 'inactive', deleted: false },
  { loginId: 'ope005',  name: '中村 五郎', role: 'オペレーター', status: 'inactive', deleted: false },
  { loginId: 'ope006',  name: '小林 六子', role: 'オペレーター', status: 'active',   deleted: false },
];

function initUserList() {
  if (!document.getElementById('userTableBody')) return;
  renderUserList();
}

function renderUserList() {
  var tbody = document.getElementById('userTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  USER_DATA.filter(function (u) { return !u.deleted; }).forEach(function (u) {
    var isActive = u.status === 'active';
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + u.loginId + '</td>' +
      '<td>' + u.name + '</td>' +
      '<td>' + u.role + '</td>' +
      '<td><span class="user-status-badge user-status-badge--' + u.status + '">' +
        (isActive ? '✓ 有効' : '✕ 無効') +
      '</span></td>' +
      '<td class="user-ops">' +
        '<a href="adm_002_user_form.html?mode=edit&id=' + u.loginId + '" class="btn-edit">編集</a>' +
        '<button class="btn-edit" onclick="toggleUserStatus(\'' + u.loginId + '\')">' +
          (isActive ? '無効にする' : '有効にする') +
        '</button>' +
        '<button class="btn-danger" style="font-size:0.75rem;height:1.75rem;padding:0 var(--ds-space-100);border-radius:3px;border:none;cursor:pointer;white-space:nowrap;" onclick="deleteUser(\'' + u.loginId + '\')">削除</button>' +
      '</td>';
    tbody.appendChild(tr);
  });
}

function toggleUserStatus(loginId) {
  var user = USER_DATA.find(function (u) { return u.loginId === loginId; });
  if (!user) return;
  var next = user.status === 'active' ? '無効' : '有効';
  if (!confirm('このユーザーを' + next + 'にします。よろしいですか？')) return;
  user.status = user.status === 'active' ? 'inactive' : 'active';
  renderUserList();
}

function deleteUser(loginId) {
  var user = USER_DATA.find(function (u) { return u.loginId === loginId; });
  if (!user) return;
  if (!confirm('ユーザー「' + user.name + '」を削除します。よろしいですか？')) return;
  user.deleted = true;
  renderUserList();
}

// === ADM-002 ユーザー登録・編集 ===

function initUserForm() {
  if (!document.getElementById('userForm')) return;
  var params = new URLSearchParams(location.search);
  var mode = params.get('mode');
  var id   = params.get('id');

  if (mode === 'edit' && id) {
    var user = USER_DATA.find(function (u) { return u.loginId === id; });
    if (user) {
      document.getElementById('loginId').value = user.loginId;
      document.getElementById('loginId').readOnly = true;
      document.getElementById('loginId').classList.add('is-readonly');
      document.getElementById('userName').value = user.name;
      document.getElementById('userRole').value = user.role;
    }
    var title = document.getElementById('pageTitle');
    if (title) title.textContent = 'ユーザー編集';
  }
}

function validateUserForm() {
  var valid = true;
  [
    { id: 'loginId',  errorId: 'loginIdError',  msg: 'ログインIDを入力してください' },
    { id: 'userName', errorId: 'userNameError',  msg: '氏名を入力してください' },
    { id: 'userRole', errorId: 'userRoleError',  msg: '権限を選択してください' },
  ].forEach(function (f) {
    var el  = document.getElementById(f.id);
    var err = document.getElementById(f.errorId);
    if (!el || !err) return;
    if (!el.value.trim()) {
      err.classList.add('is-visible');
      valid = false;
    } else {
      err.classList.remove('is-visible');
    }
  });
  return valid;
}

function handleUserSave() {
  if (!validateUserForm()) return;
  window.location.href = 'adm_001_user_list.html';
}

function handleUserCancel() {
  window.location.href = 'adm_001_user_list.html';
}

// === 日付・時刻入力 クリックでピッカー起動（共通） ===
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('input[type="date"], input[type="time"]').forEach(function (el) {
    el.addEventListener('click', function () {
      try { el.showPicker(); } catch (_) {}
    });
  });

  // テーマ初期化（localStorage から復元）
  var savedTheme = localStorage.getItem('wms-theme') || '';
  document.documentElement.setAttribute('data-theme', savedTheme);
  var btn = document.getElementById('themeToggleBtn');
  if (btn) btn.title = savedTheme === 'green' ? 'テーマ: グリーン（クリックで切替）' : 'テーマ: デフォルト（クリックで切替）';
});

// === テーマ切替 ===

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme') || '';
  var next = current === 'green' ? '' : 'green';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('wms-theme', next);
  var btn = document.getElementById('themeToggleBtn');
  if (btn) btn.title = next === 'green' ? 'テーマ: グリーン（クリックで切替）' : 'テーマ: デフォルト（クリックで切替）';
}

// === SCR-007 入荷履歴 ===

var INBOUND_HISTORY_DATA = [
  { datetime: '2026/05/09 17:00', slipNo: 'T-1004', itemCode: 'P-007', itemName: '商品G', shelf: 'D-04-01', supplier: '伊藤商店',   qty: 60,  unit: 'ピース',  lot: 'LOT-001', expiry: '2026/11/30', note: '' },
  { datetime: '2026/05/09 17:00', slipNo: 'T-1004', itemCode: 'P-008', itemName: '商品H', shelf: 'D-04-02', supplier: '伊藤商店',   qty: 40,  unit: '‐',       lot: 'LOT-002', expiry: '2027/01/20', note: '' },
  { datetime: '2026/05/09 15:00', slipNo: 'T-1003', itemCode: 'P-005', itemName: '商品E', shelf: 'C-03-01', supplier: '鈴木運輸',   qty: 80,  unit: 'ケース',  lot: 'LOT-003', expiry: '2026/09/01', note: '' },
  { datetime: '2026/05/09 15:00', slipNo: 'T-1003', itemCode: 'P-006', itemName: '商品F', shelf: 'C-03-02', supplier: '鈴木運輸',   qty: 150, unit: 'パレット', lot: 'LOT-004', expiry: '‐',         note: '' },
  { datetime: '2026/05/09 15:00', slipNo: 'T-1003', itemCode: 'P-006', itemName: '商品F', shelf: 'C-03-02', supplier: '鈴木運輸',   qty: 120, unit: 'パレット', lot: 'LOT-005', expiry: '‐',         note: '' },
  { datetime: '2026/05/09 13:00', slipNo: 'T-1002', itemCode: 'P-003', itemName: '商品C', shelf: 'B-02-01', supplier: '田中物産',   qty: 200, unit: 'ピース',  lot: 'LOT-006', expiry: '‐',         note: '' },
  { datetime: '2026/05/09 13:00', slipNo: 'T-1002', itemCode: 'P-004', itemName: '商品D', shelf: 'B-02-02', supplier: '田中物産',   qty: 30,  unit: 'ボール',  lot: 'LOT-007', expiry: '2027/03/15', note: '' },
  { datetime: '2026/05/09 10:00', slipNo: 'T-1001', itemCode: 'P-001', itemName: '商品A', shelf: 'A-01-01', supplier: '佐々木商事', qty: 100, unit: 'パレット', lot: 'LOT-008', expiry: '2026/12/31', note: '' },
  { datetime: '2026/05/09 10:00', slipNo: 'T-1001', itemCode: 'P-001', itemName: '商品A', shelf: 'A-01-01', supplier: '佐々木商事', qty: 80,  unit: 'パレット', lot: 'LOT-009', expiry: '2026/12/31', note: '' },
  { datetime: '2026/05/09 10:00', slipNo: 'T-1001', itemCode: 'P-002', itemName: '商品B', shelf: 'A-01-02', supplier: '佐々木商事', qty: 50,  unit: 'ケース',  lot: 'LOT-010', expiry: '2026/06/30', note: '' },
  { datetime: '2026/05/08 10:00', slipNo: 'T-0911', itemCode: 'P-009', itemName: '商品I', shelf: 'D-01-01', supplier: '伊藤商店',   qty: 50,  unit: 'ボール',  lot: 'LOT-011', expiry: '2027/02/28', note: '' },
  { datetime: '2026/05/08 10:00', slipNo: 'T-0911', itemCode: 'P-010', itemName: '商品J', shelf: 'D-01-02', supplier: '伊藤商店',   qty: 70,  unit: 'ピース',  lot: 'LOT-012', expiry: '‐',         note: '要冷蔵' },
  { datetime: '2026/05/07 15:00', slipNo: 'T-0910', itemCode: 'P-005', itemName: '商品E', shelf: 'C-03-01', supplier: '鈴木運輸',   qty: 100, unit: 'ケース',  lot: 'LOT-013', expiry: '2026/09/01', note: '' },
  { datetime: '2026/05/07 15:00', slipNo: 'T-0910', itemCode: 'P-006', itemName: '商品F', shelf: 'C-03-03', supplier: '鈴木運輸',   qty: 60,  unit: 'パレット', lot: 'LOT-014', expiry: '‐',         note: '' },
  { datetime: '2026/05/07 09:00', slipNo: 'T-0909', itemCode: 'P-001', itemName: '商品A', shelf: 'A-01-01', supplier: '佐々木商事', qty: 120, unit: 'パレット', lot: 'LOT-015', expiry: '2026/12/31', note: '' },
  { datetime: '2026/05/07 09:00', slipNo: 'T-0909', itemCode: 'P-002', itemName: '商品B', shelf: 'A-02-01', supplier: '佐々木商事', qty: 45,  unit: 'ケース',  lot: 'LOT-016', expiry: '2026/06/30', note: '' },
  { datetime: '2026/05/06 13:00', slipNo: 'T-0908', itemCode: 'P-003', itemName: '商品C', shelf: 'B-02-01', supplier: '田中物産',   qty: 150, unit: 'ピース',  lot: 'LOT-017', expiry: '‐',         note: '' },
  { datetime: '2026/05/06 13:00', slipNo: 'T-0908', itemCode: 'P-003', itemName: '商品C', shelf: 'B-02-02', supplier: '田中物産',   qty: 80,  unit: 'ピース',  lot: 'LOT-018', expiry: '‐',         note: '' },
  { datetime: '2026/05/05 10:00', slipNo: 'T-0907', itemCode: 'P-007', itemName: '商品G', shelf: 'D-04-01', supplier: '山田物流',   qty: 300, unit: 'ピース',  lot: 'LOT-019', expiry: '‐',         note: '要冷蔵' },
  { datetime: '2026/05/05 10:00', slipNo: 'T-0907', itemCode: 'P-008', itemName: '商品H', shelf: 'D-04-01', supplier: '山田物流',   qty: 90,  unit: 'ボール',  lot: 'LOT-020', expiry: '2027/06/30', note: '要冷蔵' },
  { datetime: '2026/05/02 09:30', slipNo: 'T-0906', itemCode: 'P-001', itemName: '商品A', shelf: 'A-01-01', supplier: '佐々木商事', qty: 120, unit: 'パレット', lot: 'LOT-021', expiry: '2026/12/31', note: '' },
  { datetime: '2026/05/02 09:30', slipNo: 'T-0906', itemCode: 'P-001', itemName: '商品A', shelf: 'A-01-02', supplier: '佐々木商事', qty: 75,  unit: 'パレット', lot: 'LOT-022', expiry: '2026/12/31', note: '' },
  { datetime: '2026/04/30 11:00', slipNo: 'T-0905', itemCode: 'P-006', itemName: '商品F', shelf: 'C-03-01', supplier: '鈴木運輸',   qty: 200, unit: 'パレット', lot: 'LOT-023', expiry: '‐',         note: '' },
  { datetime: '2026/04/29 10:00', slipNo: 'T-0903', itemCode: 'P-002', itemName: '商品B', shelf: 'A-01-02', supplier: '佐々木商事', qty: 30,  unit: 'ケース',  lot: 'LOT-024', expiry: '2026/06/30', note: '' },
  { datetime: '2026/04/29 10:00', slipNo: 'T-0903', itemCode: 'P-005', itemName: '商品E', shelf: 'C-03-01', supplier: '鈴木運輸',   qty: 80,  unit: 'ケース',  lot: 'LOT-025', expiry: '2026/09/01', note: '' }
];

var historyFiltered = INBOUND_HISTORY_DATA.slice();
var historyCurrentPage = 1;
var HISTORY_PAGE_SIZE = 20;

function initHistoryTable() {
  if (!document.getElementById('historyTableBody')) return;
  historyFiltered = INBOUND_HISTORY_DATA.slice();
  renderHistoryPage(1);
}

function filterHistory() {
  var startDate = document.getElementById('historyStartDate').value;
  var endDate   = document.getElementById('historyEndDate').value;
  var keyword   = document.getElementById('historySearch').value.toLowerCase();

  historyFiltered = INBOUND_HISTORY_DATA.filter(function (row) {
    if (startDate || endDate) {
      var rowDate = row.datetime.substring(0, 10).replace(/\//g, '-');
      if (startDate && rowDate < startDate) return false;
      if (endDate   && rowDate > endDate)   return false;
    }
    if (keyword) {
      var text = [row.slipNo, row.itemCode, row.itemName, row.supplier, row.lot]
        .join(' ').toLowerCase();
      if (text.indexOf(keyword) === -1) return false;
    }
    return true;
  });

  renderHistoryPage(1);
}

function renderHistoryPage(page) {
  historyCurrentPage = page;
  var start    = (page - 1) * HISTORY_PAGE_SIZE;
  var pageData = historyFiltered.slice(start, start + HISTORY_PAGE_SIZE);

  var tbody = document.getElementById('historyTableBody');
  tbody.innerHTML = '';

  pageData.forEach(function (row) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + row.datetime + '</td>' +
      '<td>' + row.slipNo   + '</td>' +
      '<td>' + row.itemCode + '</td>' +
      '<td>' + row.itemName + '</td>' +
      '<td>' + row.lot    + '</td>' +
      '<td>' + row.shelf    + '</td>' +
      '<td>' + row.supplier + '</td>' +
      '<td style="text-align:right">' + row.qty + '</td>' +
      '<td>' + row.unit   + '</td>' +
      '<td>' + row.expiry + '</td>' +
      '<td>' + row.note   + '</td>';
    tbody.appendChild(tr);
  });

  updateHistoryTotalCount(historyFiltered.length);
  renderHistoryPagination(historyFiltered.length, page);
}

function updateHistoryTotalCount(count) {
  var el = document.getElementById('historyTotalCount');
  if (el) el.textContent = '全 ' + count + ' 件';
}

function renderHistoryPagination(totalCount, page) {
  var totalPages = Math.ceil(totalCount / HISTORY_PAGE_SIZE);
  var container  = document.getElementById('historyPagination');
  if (!container) return;
  container.innerHTML = '';

  var prevBtn = document.createElement('button');
  prevBtn.className = 'history-pagination-btn';
  prevBtn.textContent = '< 前へ';
  prevBtn.disabled = (page === 1);
  prevBtn.setAttribute('aria-label', '前のページ');
  prevBtn.addEventListener('click', function () { renderHistoryPage(page - 1); });
  container.appendChild(prevBtn);

  for (var i = 1; i <= totalPages; i++) {
    (function (p) {
      var btn = document.createElement('button');
      btn.className = 'history-pagination-btn' + (p === page ? ' is-active' : '');
      btn.textContent = p;
      btn.setAttribute('aria-label', p + 'ページ');
      if (p === page) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', function () { renderHistoryPage(p); });
      container.appendChild(btn);
    })(i);
  }

  var nextBtn = document.createElement('button');
  nextBtn.className = 'history-pagination-btn';
  nextBtn.textContent = '次へ >';
  nextBtn.disabled = (page >= totalPages || totalPages === 0);
  nextBtn.setAttribute('aria-label', '次のページ');
  nextBtn.addEventListener('click', function () { renderHistoryPage(page + 1); });
  container.appendChild(nextBtn);
}

// === SCR-012 出荷履歴 ===

var OUTBOUND_HISTORY_DATA = [
  { datetime: '2026/05/09 17:00', slipNo: 'S-2004', itemCode: 'P-007', itemName: '商品G', shelf: 'D-04-01', destination: '東京流通',    qty: 60,  unit: 'ピース',  lot: 'LOT-001', expiry: '2026/11/30', note: '' },
  { datetime: '2026/05/09 17:00', slipNo: 'S-2004', itemCode: 'P-008', itemName: '商品H', shelf: 'D-04-02', destination: '東京流通',    qty: 40,  unit: '‐',       lot: 'LOT-002', expiry: '2027/01/20', note: '' },
  { datetime: '2026/05/09 15:00', slipNo: 'S-2003', itemCode: 'P-005', itemName: '商品E', shelf: 'C-03-01', destination: '大阪物流',    qty: 80,  unit: 'ケース',  lot: 'LOT-003', expiry: '2026/09/01', note: '' },
  { datetime: '2026/05/09 15:00', slipNo: 'S-2003', itemCode: 'P-006', itemName: '商品F', shelf: 'C-03-02', destination: '大阪物流',    qty: 150, unit: 'パレット', lot: 'LOT-004', expiry: '‐',         note: '' },
  { datetime: '2026/05/09 15:00', slipNo: 'S-2003', itemCode: 'P-006', itemName: '商品F', shelf: 'C-03-02', destination: '大阪物流',    qty: 120, unit: 'パレット', lot: 'LOT-005', expiry: '‐',         note: '' },
  { datetime: '2026/05/09 13:00', slipNo: 'S-2002', itemCode: 'P-003', itemName: '商品C', shelf: 'B-02-01', destination: '名古屋商事',  qty: 200, unit: 'ピース',  lot: 'LOT-006', expiry: '‐',         note: '' },
  { datetime: '2026/05/09 13:00', slipNo: 'S-2002', itemCode: 'P-004', itemName: '商品D', shelf: 'B-02-02', destination: '名古屋商事',  qty: 30,  unit: 'ボール',  lot: 'LOT-007', expiry: '2027/03/15', note: '' },
  { datetime: '2026/05/09 10:00', slipNo: 'S-2001', itemCode: 'P-001', itemName: '商品A', shelf: 'A-01-01', destination: '福岡センター', qty: 100, unit: 'パレット', lot: 'LOT-008', expiry: '2026/12/31', note: '' },
  { datetime: '2026/05/09 10:00', slipNo: 'S-2001', itemCode: 'P-001', itemName: '商品A', shelf: 'A-01-01', destination: '福岡センター', qty: 80,  unit: 'パレット', lot: 'LOT-009', expiry: '2026/12/31', note: '' },
  { datetime: '2026/05/09 10:00', slipNo: 'S-2001', itemCode: 'P-002', itemName: '商品B', shelf: 'A-01-02', destination: '福岡センター', qty: 50,  unit: 'ケース',  lot: 'LOT-010', expiry: '2026/06/30', note: '' },
  { datetime: '2026/05/08 10:00', slipNo: 'S-1911', itemCode: 'P-009', itemName: '商品I', shelf: 'D-01-01', destination: '東京流通',    qty: 50,  unit: 'ボール',  lot: 'LOT-011', expiry: '2027/02/28', note: '' },
  { datetime: '2026/05/08 10:00', slipNo: 'S-1911', itemCode: 'P-010', itemName: '商品J', shelf: 'D-01-02', destination: '東京流通',    qty: 70,  unit: 'ピース',  lot: 'LOT-012', expiry: '‐',         note: '要冷蔵' },
  { datetime: '2026/05/07 15:00', slipNo: 'S-1910', itemCode: 'P-005', itemName: '商品E', shelf: 'C-03-01', destination: '大阪物流',    qty: 100, unit: 'ケース',  lot: 'LOT-013', expiry: '2026/09/01', note: '' },
  { datetime: '2026/05/07 15:00', slipNo: 'S-1910', itemCode: 'P-006', itemName: '商品F', shelf: 'C-03-03', destination: '大阪物流',    qty: 60,  unit: 'パレット', lot: 'LOT-014', expiry: '‐',         note: '' },
  { datetime: '2026/05/07 09:00', slipNo: 'S-1909', itemCode: 'P-001', itemName: '商品A', shelf: 'A-01-01', destination: '福岡センター', qty: 120, unit: 'パレット', lot: 'LOT-015', expiry: '2026/12/31', note: '' },
  { datetime: '2026/05/07 09:00', slipNo: 'S-1909', itemCode: 'P-002', itemName: '商品B', shelf: 'A-02-01', destination: '福岡センター', qty: 45,  unit: 'ケース',  lot: 'LOT-016', expiry: '2026/06/30', note: '' },
  { datetime: '2026/05/06 13:00', slipNo: 'S-1908', itemCode: 'P-003', itemName: '商品C', shelf: 'B-02-01', destination: '名古屋商事',  qty: 150, unit: 'ピース',  lot: 'LOT-017', expiry: '‐',         note: '' },
  { datetime: '2026/05/06 13:00', slipNo: 'S-1908', itemCode: 'P-003', itemName: '商品C', shelf: 'B-02-02', destination: '名古屋商事',  qty: 80,  unit: 'ピース',  lot: 'LOT-018', expiry: '‐',         note: '' },
  { datetime: '2026/05/05 10:00', slipNo: 'S-1907', itemCode: 'P-007', itemName: '商品G', shelf: 'D-04-01', destination: '札幌物流',    qty: 300, unit: 'ピース',  lot: 'LOT-019', expiry: '‐',         note: '要冷蔵' },
  { datetime: '2026/05/05 10:00', slipNo: 'S-1907', itemCode: 'P-008', itemName: '商品H', shelf: 'D-04-01', destination: '札幌物流',    qty: 90,  unit: 'ボール',  lot: 'LOT-020', expiry: '2027/06/30', note: '要冷蔵' },
  { datetime: '2026/05/02 09:30', slipNo: 'S-1906', itemCode: 'P-001', itemName: '商品A', shelf: 'A-01-01', destination: '福岡センター', qty: 120, unit: 'パレット', lot: 'LOT-021', expiry: '2026/12/31', note: '' },
  { datetime: '2026/05/02 09:30', slipNo: 'S-1906', itemCode: 'P-001', itemName: '商品A', shelf: 'A-01-02', destination: '福岡センター', qty: 75,  unit: 'パレット', lot: 'LOT-022', expiry: '2026/12/31', note: '' },
  { datetime: '2026/04/30 11:00', slipNo: 'S-1905', itemCode: 'P-006', itemName: '商品F', shelf: 'C-03-01', destination: '大阪物流',    qty: 200, unit: 'パレット', lot: 'LOT-023', expiry: '‐',         note: '' },
  { datetime: '2026/04/29 10:00', slipNo: 'S-1903', itemCode: 'P-002', itemName: '商品B', shelf: 'A-01-02', destination: '福岡センター', qty: 30,  unit: 'ケース',  lot: 'LOT-024', expiry: '2026/06/30', note: '' },
  { datetime: '2026/04/29 10:00', slipNo: 'S-1903', itemCode: 'P-005', itemName: '商品E', shelf: 'C-03-01', destination: '大阪物流',    qty: 80,  unit: 'ケース',  lot: 'LOT-025', expiry: '2026/09/01', note: '' },
];

var outboundHistoryFiltered  = OUTBOUND_HISTORY_DATA.slice();
var outboundHistoryCurrentPage = 1;

function initOutboundHistoryTable() {
  if (!document.getElementById('historyTableBody')) return;
  outboundHistoryFiltered = OUTBOUND_HISTORY_DATA.slice();
  renderOutboundHistoryPage(1);
}

function filterOutboundHistory() {
  var startDate = document.getElementById('historyStartDate').value;
  var endDate   = document.getElementById('historyEndDate').value;
  var keyword   = document.getElementById('historySearch').value.toLowerCase();

  outboundHistoryFiltered = OUTBOUND_HISTORY_DATA.filter(function (row) {
    if (startDate || endDate) {
      var rowDate = row.datetime.substring(0, 10).replace(/\//g, '-');
      if (startDate && rowDate < startDate) return false;
      if (endDate   && rowDate > endDate)   return false;
    }
    if (keyword) {
      var target = [row.slipNo, row.itemCode, row.itemName, row.lot, row.destination]
        .join('\t').toLowerCase();
      if (target.indexOf(keyword) === -1) return false;
    }
    return true;
  });

  renderOutboundHistoryPage(1);
}

function renderOutboundHistoryPage(page) {
  outboundHistoryCurrentPage = page;
  var start    = (page - 1) * HISTORY_PAGE_SIZE;
  var pageData = outboundHistoryFiltered.slice(start, start + HISTORY_PAGE_SIZE);

  var tbody = document.getElementById('historyTableBody');
  tbody.innerHTML = '';

  pageData.forEach(function (row) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + row.datetime     + '</td>' +
      '<td>' + row.slipNo       + '</td>' +
      '<td>' + row.itemCode     + '</td>' +
      '<td>' + row.itemName     + '</td>' +
      '<td>' + row.lot          + '</td>' +
      '<td>' + row.shelf        + '</td>' +
      '<td>' + row.destination  + '</td>' +
      '<td style="text-align:right">' + row.qty + '</td>' +
      '<td>' + row.unit         + '</td>' +
      '<td>' + row.expiry       + '</td>' +
      '<td>' + row.note         + '</td>';
    tbody.appendChild(tr);
  });

  updateOutboundHistoryTotalCount(outboundHistoryFiltered.length);
  renderOutboundHistoryPagination(outboundHistoryFiltered.length, page);
}

function updateOutboundHistoryTotalCount(count) {
  var el = document.getElementById('historyTotalCount');
  if (el) el.textContent = '全 ' + count + ' 件';
}

function renderOutboundHistoryPagination(totalCount, page) {
  var totalPages = Math.ceil(totalCount / HISTORY_PAGE_SIZE);
  var container  = document.getElementById('historyPagination');
  if (!container) return;
  container.innerHTML = '';

  var prevBtn = document.createElement('button');
  prevBtn.className = 'history-pagination-btn';
  prevBtn.textContent = '< 前へ';
  prevBtn.disabled = (page === 1);
  prevBtn.setAttribute('aria-label', '前のページ');
  prevBtn.addEventListener('click', function () { renderOutboundHistoryPage(page - 1); });
  container.appendChild(prevBtn);

  for (var i = 1; i <= totalPages; i++) {
    (function (p) {
      var btn = document.createElement('button');
      btn.className = 'history-pagination-btn' + (p === page ? ' is-active' : '');
      btn.textContent = p;
      btn.setAttribute('aria-label', p + 'ページ');
      if (p === page) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', function () { renderOutboundHistoryPage(p); });
      container.appendChild(btn);
    })(i);
  }

  var nextBtn = document.createElement('button');
  nextBtn.className = 'history-pagination-btn';
  nextBtn.textContent = '次へ >';
  nextBtn.disabled = (page >= totalPages || totalPages === 0);
  nextBtn.setAttribute('aria-label', '次のページ');
  nextBtn.addEventListener('click', function () { renderOutboundHistoryPage(page + 1); });
  container.appendChild(nextBtn);
}

// === SCR-014 在庫明細（棚ロケ単位） ===

var INVENTORY_DETAIL_DATA = [
  { shelf: 'A-01-01', itemCode: 'P-001', itemName: '商品A', lot: 'LOT-001', qty: 100, unit: 'パレット', note: '' },
  { shelf: 'A-01-01', itemCode: 'P-001', itemName: '商品A', lot: 'LOT-002', qty: 80,  unit: 'パレット', note: '' },
  { shelf: 'A-01-02', itemCode: 'P-002', itemName: '商品B', lot: 'LOT-003', qty: 60,  unit: 'ケース',   note: '' },
  { shelf: 'A-02-01', itemCode: 'P-001', itemName: '商品A', lot: 'LOT-004', qty: 120, unit: 'パレット', note: '' },
  { shelf: 'A-02-02', itemCode: 'P-002', itemName: '商品B', lot: 'LOT-005', qty: 45,  unit: 'ケース',   note: '' },
  { shelf: 'B-01-01', itemCode: 'P-003', itemName: '商品C', lot: 'LOT-006', qty: 300, unit: 'ピース',   note: '' },
  { shelf: 'B-01-02', itemCode: 'P-004', itemName: '商品D', lot: 'LOT-007', qty: 50,  unit: 'ボール',   note: '' },
  { shelf: 'B-02-01', itemCode: 'P-003', itemName: '商品C', lot: 'LOT-008', qty: 150, unit: 'ピース',   note: '' },
  { shelf: 'B-02-02', itemCode: 'P-004', itemName: '商品D', lot: 'LOT-009', qty: 30,  unit: 'ボール',   note: '' },
  { shelf: 'C-01-01', itemCode: 'P-005', itemName: '商品E', lot: 'LOT-010', qty: 80,  unit: 'ケース',   note: '' },
  { shelf: 'C-01-02', itemCode: 'P-006', itemName: '商品F', lot: 'LOT-011', qty: 200, unit: 'パレット', note: '' },
  { shelf: 'C-02-01', itemCode: 'P-005', itemName: '商品E', lot: 'LOT-012', qty: 60,  unit: 'ケース',   note: '' },
  { shelf: 'C-02-02', itemCode: 'P-006', itemName: '商品F', lot: 'LOT-013', qty: 180, unit: 'パレット', note: '' },
  { shelf: 'C-03-01', itemCode: 'P-005', itemName: '商品E', lot: 'LOT-014', qty: 100, unit: 'ケース',   note: '' },
  { shelf: 'C-03-02', itemCode: 'P-006', itemName: '商品F', lot: 'LOT-015', qty: 120, unit: 'パレット', note: '' },
  { shelf: 'D-01-01', itemCode: 'P-009', itemName: '商品I', lot: 'LOT-016', qty: 90,  unit: 'ボール',   note: '' },
  { shelf: 'D-01-02', itemCode: 'P-010', itemName: '商品J', lot: 'LOT-017', qty: 110, unit: 'ピース',   note: '要冷蔵' },
  { shelf: 'D-02-01', itemCode: 'P-007', itemName: '商品G', lot: 'LOT-018', qty: 250, unit: 'ピース',   note: '' },
  { shelf: 'D-02-02', itemCode: 'P-008', itemName: '商品H', lot: 'LOT-019', qty: 70,  unit: '‐',        note: '' },
  { shelf: 'D-03-01', itemCode: 'P-009', itemName: '商品I', lot: 'LOT-020', qty: 50,  unit: 'ボール',   note: '' },
  { shelf: 'D-03-02', itemCode: 'P-010', itemName: '商品J', lot: 'LOT-021', qty: 75,  unit: 'ピース',   note: '要冷蔵' },
  { shelf: 'D-04-01', itemCode: 'P-007', itemName: '商品G', lot: 'LOT-022', qty: 150, unit: 'ピース',   note: '' },
  { shelf: 'D-04-01', itemCode: 'P-007', itemName: '商品G', lot: 'LOT-023', qty: 80,  unit: 'ピース',   note: '' },
  { shelf: 'D-04-02', itemCode: 'P-008', itemName: '商品H', lot: 'LOT-024', qty: 55,  unit: '‐',        note: '' },
  { shelf: 'D-04-03', itemCode: 'P-010', itemName: '商品J', lot: 'LOT-025', qty: 130, unit: 'ピース',   note: '要冷蔵' },
];

var inventoryDetailFiltered   = INVENTORY_DETAIL_DATA.slice();
var inventoryDetailCurrentPage = 1;

function initInventoryDetailTable() {
  if (!document.getElementById('inventoryDetailTableBody')) return;
  inventoryDetailFiltered = INVENTORY_DETAIL_DATA.slice();
  renderInventoryDetailPage(1);
}

function filterInventoryDetail() {
  var keyword = document.getElementById('inventorySearch').value.toLowerCase();

  inventoryDetailFiltered = INVENTORY_DETAIL_DATA.filter(function (row) {
    if (keyword) {
      var target = [row.shelf, row.itemCode, row.itemName, row.lot]
        .join('\t').toLowerCase();
      if (target.indexOf(keyword) === -1) return false;
    }
    return true;
  });

  renderInventoryDetailPage(1);
}

function renderInventoryDetailPage(page) {
  inventoryDetailCurrentPage = page;
  var start    = (page - 1) * HISTORY_PAGE_SIZE;
  var pageData = inventoryDetailFiltered.slice(start, start + HISTORY_PAGE_SIZE);

  var tbody = document.getElementById('inventoryDetailTableBody');
  tbody.innerHTML = '';

  pageData.forEach(function (row) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + row.shelf    + '</td>' +
      '<td>' + row.itemCode + '</td>' +
      '<td>' + row.itemName  + '</td>' +
      '<td>' + row.lot       + '</td>' +
      '<td style="text-align:right">' + row.qty + '</td>' +
      '<td>' + row.unit      + '</td>' +
      '<td>' + row.note      + '</td>' +
      '<td><a href="#" class="btn-detail">移動履歴</a></td>';
    tbody.appendChild(tr);
  });

  updateInventoryDetailTotalCount(inventoryDetailFiltered.length);
  renderInventoryDetailPagination(inventoryDetailFiltered.length, page);
}

function updateInventoryDetailTotalCount(count) {
  var el = document.getElementById('inventoryDetailTotalCount');
  if (el) el.textContent = '全 ' + count + ' 件';
}

function renderInventoryDetailPagination(totalCount, page) {
  var totalPages = Math.ceil(totalCount / HISTORY_PAGE_SIZE);
  var container  = document.getElementById('inventoryDetailPagination');
  if (!container) return;
  container.innerHTML = '';

  var prevBtn = document.createElement('button');
  prevBtn.className = 'history-pagination-btn';
  prevBtn.textContent = '< 前へ';
  prevBtn.disabled = (page === 1);
  prevBtn.setAttribute('aria-label', '前のページ');
  prevBtn.addEventListener('click', function () { renderInventoryDetailPage(page - 1); });
  container.appendChild(prevBtn);

  for (var i = 1; i <= totalPages; i++) {
    (function (p) {
      var btn = document.createElement('button');
      btn.className = 'history-pagination-btn' + (p === page ? ' is-active' : '');
      btn.textContent = p;
      btn.setAttribute('aria-label', p + 'ページ');
      if (p === page) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', function () { renderInventoryDetailPage(p); });
      container.appendChild(btn);
    })(i);
  }

  var nextBtn = document.createElement('button');
  nextBtn.className = 'history-pagination-btn';
  nextBtn.textContent = '次へ >';
  nextBtn.disabled = (page >= totalPages || totalPages === 0);
  nextBtn.setAttribute('aria-label', '次のページ');
  nextBtn.addEventListener('click', function () { renderInventoryDetailPage(page + 1); });
  container.appendChild(nextBtn);
}

// ─── SCR-013: 在庫一覧（ロット単位） ───────────────────────────────────────

var INVENTORY_LIST_DATA = [
  { itemCode: 'P-001', itemName: '商品A',  qty: 300, unit: 'パレット' },
  { itemCode: 'P-002', itemName: '商品B',  qty: 105, unit: 'ケース'   },
  { itemCode: 'P-003', itemName: '商品C',  qty: 450, unit: 'ピース'   },
  { itemCode: 'P-004', itemName: '商品D',  qty: 80,  unit: 'ボール'   },
  { itemCode: 'P-005', itemName: '商品E',  qty: 240, unit: 'ケース'   },
  { itemCode: 'P-006', itemName: '商品F',  qty: 500, unit: 'パレット' },
  { itemCode: 'P-007', itemName: '商品G',  qty: 480, unit: 'ピース'   },
  { itemCode: 'P-008', itemName: '商品H',  qty: 125, unit: '‐'        },
  { itemCode: 'P-009', itemName: '商品I',  qty: 140, unit: 'ボール'   },
  { itemCode: 'P-010', itemName: '商品J',  qty: 315, unit: 'ピース'   },
  { itemCode: 'P-011', itemName: '商品K',  qty: 200, unit: 'ケース'   },
  { itemCode: 'P-012', itemName: '商品L',  qty: 150, unit: 'パレット' },
  { itemCode: 'P-013', itemName: '商品M',  qty: 320, unit: 'ピース'   },
  { itemCode: 'P-014', itemName: '商品N',  qty: 95,  unit: 'ボール'   },
  { itemCode: 'P-015', itemName: '商品O',  qty: 410, unit: 'ケース'   },
  { itemCode: 'P-016', itemName: '商品P',  qty: 180, unit: 'パレット' },
  { itemCode: 'P-017', itemName: '商品Q',  qty: 60,  unit: '‐'        },
  { itemCode: 'P-018', itemName: '商品R',  qty: 275, unit: 'ピース'   },
  { itemCode: 'P-019', itemName: '商品S',  qty: 130, unit: 'ケース'   },
  { itemCode: 'P-020', itemName: '商品T',  qty: 220, unit: 'ボール'   },
  { itemCode: 'P-021', itemName: '商品U',  qty: 85,  unit: 'パレット' },
  { itemCode: 'P-022', itemName: '商品V',  qty: 340, unit: 'ピース'   },
  { itemCode: 'P-023', itemName: '商品W',  qty: 165, unit: 'ケース'   },
  { itemCode: 'P-024', itemName: '商品X',  qty: 290, unit: '‐'        },
  { itemCode: 'P-025', itemName: '商品Y',  qty: 110, unit: 'ボール'   },
];

var inventoryListFiltered    = INVENTORY_LIST_DATA.slice();
var inventoryListCurrentPage = 1;

function initInventoryListTable() {
  if (!document.getElementById('inventoryListTableBody')) return;
  inventoryListFiltered = INVENTORY_LIST_DATA.slice();
  renderInventoryListPage(1);
}

function filterInventoryList() {
  var keyword = document.getElementById('inventoryListSearch').value.toLowerCase();

  inventoryListFiltered = INVENTORY_LIST_DATA.filter(function (row) {
    if (keyword) {
      var target = [row.itemCode, row.itemName].join('\t').toLowerCase();
      if (target.indexOf(keyword) === -1) return false;
    }
    return true;
  });

  renderInventoryListPage(1);
}

function renderInventoryListPage(page) {
  inventoryListCurrentPage = page;
  var start    = (page - 1) * HISTORY_PAGE_SIZE;
  var pageData = inventoryListFiltered.slice(start, start + HISTORY_PAGE_SIZE);

  var tbody = document.getElementById('inventoryListTableBody');
  tbody.innerHTML = '';

  pageData.forEach(function (row) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + row.itemCode + '</td>' +
      '<td>' + row.itemName + '</td>' +
      '<td style="text-align:right">' + row.qty + '</td>' +
      '<td>' + row.unit + '</td>' +
      '<td><a href="014_inventory_detail.html" class="btn-detail">在庫詳細</a></td>';
    tbody.appendChild(tr);
  });

  updateInventoryListTotalCount(inventoryListFiltered.length);
  renderInventoryListPagination(inventoryListFiltered.length, page);
}

function updateInventoryListTotalCount(count) {
  var el = document.getElementById('inventoryListTotalCount');
  if (el) el.textContent = '全 ' + count + ' 件';
}

function renderInventoryListPagination(totalCount, page) {
  var totalPages = Math.ceil(totalCount / HISTORY_PAGE_SIZE);
  var container  = document.getElementById('inventoryListPagination');
  if (!container) return;
  container.innerHTML = '';

  var prevBtn = document.createElement('button');
  prevBtn.className = 'history-pagination-btn';
  prevBtn.textContent = '< 前へ';
  prevBtn.disabled = (page === 1);
  prevBtn.setAttribute('aria-label', '前のページ');
  prevBtn.addEventListener('click', function () { renderInventoryListPage(page - 1); });
  container.appendChild(prevBtn);

  for (var i = 1; i <= totalPages; i++) {
    (function (p) {
      var btn = document.createElement('button');
      btn.className = 'history-pagination-btn' + (p === page ? ' is-active' : '');
      btn.textContent = p;
      btn.setAttribute('aria-label', p + 'ページ');
      if (p === page) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', function () { renderInventoryListPage(p); });
      container.appendChild(btn);
    })(i);
  }

  var nextBtn = document.createElement('button');
  nextBtn.className = 'history-pagination-btn';
  nextBtn.textContent = '次へ >';
  nextBtn.disabled = (page >= totalPages || totalPages === 0);
  nextBtn.setAttribute('aria-label', '次のページ');
  nextBtn.addEventListener('click', function () { renderInventoryListPage(page + 1); });
  container.appendChild(nextBtn);
}

// === 引き当てチェック (SCR-010) ===

function initAllocationDateRange() {
  var today = new Date();
  var y = today.getFullYear();
  var m = String(today.getMonth() + 1).padStart(2, '0');
  var d = String(today.getDate()).padStart(2, '0');
  var val = y + '-' + m + '-' + d;
  var from = document.getElementById('scheduleDateFrom');
  var to   = document.getElementById('scheduleDateTo');
  if (from) from.value = val;
  if (to)   to.value   = val;
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function runAllocationCheck() {
  var section = document.getElementById('allocationTableSection');
  if (section) section.style.display = '';
  initScheduleUpdatedAt();
}

function filterAllocationTable(query) {
  var q = query.toLowerCase().trim();
  var summaryRows = document.querySelectorAll('#allocationTable .allocation-summary-row');
  summaryRows.forEach(function (row) {
    var cells = row.querySelectorAll('td');
    var text = [3, 4, 5].map(function (i) {
      return cells[i] ? cells[i].textContent.toLowerCase() : '';
    }).join(' ');
    var hit = text.includes(q);
    row.style.display = hit ? '' : 'none';
    var groupId = row.dataset.groupId;
    if (groupId) {
      var detailRow = document.getElementById('detail-' + groupId);
      if (detailRow) detailRow.style.display = 'none';
      var icon = row.querySelector('.allocation-expand-icon');
      if (icon) icon.classList.remove('allocation-expand-icon--open');
    }
  });
}

function toggleAllocationDetail(groupId, summaryEl) {
  var detailRow = document.getElementById('detail-' + groupId);
  if (!detailRow) return;
  var isOpen = detailRow.style.display !== 'none';
  detailRow.style.display = isOpen ? 'none' : 'table-row';
  var icon = summaryEl.querySelector('.allocation-expand-icon');
  if (icon) icon.classList.toggle('allocation-expand-icon--open', !isOpen);
}

// === SCR-015: 棚ロケ移動登録 ===

var TRANSFER_DUMMY_DATA = [
  { location: 'A-01-01', itemCode: 'P-001', itemName: '商品A', lotNo: 'LOT-001', qty: 100, unit: 'パレット', note: '' },
  { location: 'A-01-01', itemCode: 'P-001', itemName: '商品A', lotNo: 'LOT-002', qty: 80,  unit: 'パレット', note: '' },
  { location: 'A-01-02', itemCode: 'P-002', itemName: '商品B', lotNo: 'LOT-003', qty: 60,  unit: 'ケース',   note: '' },
  { location: 'A-02-01', itemCode: 'P-001', itemName: '商品A', lotNo: 'LOT-004', qty: 120, unit: 'パレット', note: '' },
  { location: 'A-02-02', itemCode: 'P-002', itemName: '商品B', lotNo: 'LOT-005', qty: 45,  unit: 'ケース',   note: '' },
  { location: 'B-01-01', itemCode: 'P-003', itemName: '商品C', lotNo: 'LOT-006', qty: 300, unit: 'ピース',   note: '' },
  { location: 'B-01-02', itemCode: 'P-004', itemName: '商品D', lotNo: 'LOT-007', qty: 50,  unit: 'ボール',   note: '' },
  { location: 'B-02-01', itemCode: 'P-003', itemName: '商品C', lotNo: 'LOT-008', qty: 150, unit: 'ピース',   note: '' },
  { location: 'B-02-02', itemCode: 'P-004', itemName: '商品D', lotNo: 'LOT-009', qty: 30,  unit: 'ボール',   note: '' },
  { location: 'C-01-01', itemCode: 'P-005', itemName: '商品E', lotNo: 'LOT-010', qty: 80,  unit: 'ケース',   note: '' },
  { location: 'C-01-02', itemCode: 'P-006', itemName: '商品F', lotNo: 'LOT-011', qty: 200, unit: 'パレット', note: '' },
  { location: 'C-02-01', itemCode: 'P-005', itemName: '商品E', lotNo: 'LOT-012', qty: 60,  unit: 'ケース',   note: '' },
  { location: 'C-02-02', itemCode: 'P-006', itemName: '商品F', lotNo: 'LOT-013', qty: 180, unit: 'パレット', note: '' },
  { location: 'C-03-01', itemCode: 'P-005', itemName: '商品E', lotNo: 'LOT-014', qty: 100, unit: 'ケース',   note: '' },
  { location: 'C-03-02', itemCode: 'P-006', itemName: '商品F', lotNo: 'LOT-015', qty: 120, unit: 'パレット', note: '' },
  { location: 'D-01-01', itemCode: 'P-009', itemName: '商品I', lotNo: 'LOT-016', qty: 90,  unit: 'ボール',   note: '' },
  { location: 'D-01-02', itemCode: 'P-010', itemName: '商品J', lotNo: 'LOT-017', qty: 110, unit: 'ピース',   note: '要冷蔵' },
  { location: 'D-02-01', itemCode: 'P-007', itemName: '商品G', lotNo: 'LOT-018', qty: 250, unit: 'ピース',   note: '' },
  { location: 'D-02-02', itemCode: 'P-008', itemName: '商品H', lotNo: 'LOT-019', qty: 70,  unit: '‐',        note: '' },
  { location: 'D-03-01', itemCode: 'P-009', itemName: '商品I', lotNo: 'LOT-020', qty: 50,  unit: 'ボール',   note: '' },
  { location: 'D-03-02', itemCode: 'P-010', itemName: '商品J', lotNo: 'LOT-021', qty: 75,  unit: 'ピース',   note: '要冷蔵' },
  { location: 'D-04-01', itemCode: 'P-007', itemName: '商品G', lotNo: 'LOT-022', qty: 150, unit: 'ピース',   note: '' },
  { location: 'D-04-01', itemCode: 'P-007', itemName: '商品G', lotNo: 'LOT-023', qty: 80,  unit: 'ピース',   note: '' },
  { location: 'D-04-02', itemCode: 'P-008', itemName: '商品H', lotNo: 'LOT-024', qty: 55,  unit: '‐',        note: '' },
  { location: 'D-04-03', itemCode: 'P-010', itemName: '商品J', lotNo: 'LOT-025', qty: 130, unit: 'ピース',   note: '要冷蔵' }
];

var transferFilteredRows = TRANSFER_DUMMY_DATA.slice();
var transferSelectedRow  = null;
var transferSelectedTr   = null;

function initTransferTable() {
  transferFilteredRows = TRANSFER_DUMMY_DATA.slice();
  renderTransferTable(transferFilteredRows);
}

function filterTransferTable(keyword) {
  var kw = keyword.trim().toLowerCase();
  if (kw) {
    transferFilteredRows = TRANSFER_DUMMY_DATA.filter(function (row) {
      return row.location.toLowerCase().indexOf(kw) === 0;
    });
  } else {
    transferFilteredRows = TRANSFER_DUMMY_DATA.slice();
  }
  deselectTransferRow();
  renderTransferTable(transferFilteredRows);
}

function renderTransferTable(rows) {
  var tbody = document.getElementById('transferTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  rows.forEach(function (row) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + row.location + '</td>' +
      '<td>' + row.itemCode + '</td>' +
      '<td>' + row.itemName + '</td>' +
      '<td>' + row.lotNo + '</td>' +
      '<td class="col-right">' + row.qty + '</td>' +
      '<td>' + row.unit + '</td>' +
      '<td>' + row.note + '</td>';
    tr.addEventListener('click', function () {
      if (transferSelectedTr === tr) {
        deselectTransferRow();
      } else {
        selectTransferRow(row, tr);
      }
    });
    tbody.appendChild(tr);
  });
  var countEl = document.getElementById('transferTotalCount');
  if (countEl) countEl.textContent = '全 ' + rows.length + ' 件';
}

function selectTransferRow(rowData, tr) {
  if (transferSelectedTr) transferSelectedTr.classList.remove('is-selected');
  transferSelectedRow = rowData;
  transferSelectedTr  = tr;
  tr.classList.add('is-selected');
  document.getElementById('transferSrcLocation').value = rowData.location;
  document.getElementById('transferItemCode').value    = rowData.itemCode;
  document.getElementById('transferItemName').value    = rowData.itemName;
  document.getElementById('transferLotNo').value       = rowData.lotNo;
  document.getElementById('transferStockQty').value    = rowData.qty;
  document.getElementById('transferForm').disabled     = false;
  validateTransferForm();
}

function deselectTransferRow() {
  if (transferSelectedTr) transferSelectedTr.classList.remove('is-selected');
  transferSelectedRow = null;
  transferSelectedTr  = null;
  var form = document.getElementById('transferForm');
  if (!form) return;
  ['transferSrcLocation', 'transferItemCode', 'transferItemName', 'transferLotNo', 'transferStockQty', 'transferQty', 'transferDestLocation'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  form.disabled = true;
  var btn = document.getElementById('transferRegisterBtn');
  if (btn) btn.disabled = true;
}

function validateTransferForm() {
  var btn = document.getElementById('transferRegisterBtn');
  if (!btn) return;
  if (!transferSelectedRow) { btn.disabled = true; return; }
  var qty  = parseInt(document.getElementById('transferQty').value, 10);
  var dest = (document.getElementById('transferDestLocation').value || '').trim();
  var src  = transferSelectedRow.location.toLowerCase();
  var valid = !isNaN(qty) && qty >= 1 && qty <= transferSelectedRow.qty &&
              dest !== '' && dest.toLowerCase() !== src;
  btn.disabled = !valid;
}

function showTransferConfirmDialog() {
  if (!transferSelectedRow) return;
  var qty  = document.getElementById('transferQty').value;
  var dest = document.getElementById('transferDestLocation').value.trim();
  var rows = [
    ['棚ロケ（元）', transferSelectedRow.location],
    ['商品コード',   transferSelectedRow.itemCode],
    ['商品名',       transferSelectedRow.itemName],
    ['ロット番号',   transferSelectedRow.lotNo],
    ['移動数量',     qty + ' ' + transferSelectedRow.unit],
    ['棚ロケ（先）', dest]
  ];
  var html = '<dl class="transfer-confirm-dl">';
  rows.forEach(function (pair) {
    html += '<dt>' + pair[0] + '</dt><dd>' + pair[1] + '</dd>';
  });
  html += '</dl>';
  document.getElementById('transferConfirmBody').innerHTML = html;
  document.getElementById('transferConfirmModal').style.display = 'flex';
}

function executeTransfer() {
  document.getElementById('transferConfirmModal').style.display = 'none';
  showTransferFlash('移動登録が完了しました');
  deselectTransferRow();
}

function showTransferFlash(message) {
  var el = document.getElementById('transferFlash');
  if (!el) return;
  el.textContent = message;
  el.style.display = 'flex';
  setTimeout(function () { el.style.display = 'none'; }, 3000);
}

// === SCR-016 棚ロケ移動履歴 ===

var TRANSFER_HISTORY_DATA = [
  { datetime: '2026/05/19 15:42', srcLocation: 'A-01-01', destLocation: 'C-01-01', itemCode: 'P-001', itemName: '商品A', lotNo: 'LOT-001', qty: 50,  unit: 'パレット', note: '' },
  { datetime: '2026/05/19 14:10', srcLocation: 'B-01-01', destLocation: 'D-02-01', itemCode: 'P-003', itemName: '商品C', lotNo: 'LOT-006', qty: 100, unit: 'ピース',   note: '' },
  { datetime: '2026/05/19 11:30', srcLocation: 'D-04-01', destLocation: 'A-02-01', itemCode: 'P-007', itemName: '商品G', lotNo: 'LOT-022', qty: 30,  unit: 'ピース',   note: '' },
  { datetime: '2026/05/18 16:55', srcLocation: 'C-02-01', destLocation: 'B-02-01', itemCode: 'P-005', itemName: '商品E', lotNo: 'LOT-012', qty: 20,  unit: 'ケース',   note: '' },
  { datetime: '2026/05/18 14:00', srcLocation: 'A-01-02', destLocation: 'C-03-02', itemCode: 'P-002', itemName: '商品B', lotNo: 'LOT-003', qty: 40,  unit: 'ケース',   note: '' },
  { datetime: '2026/05/17 17:20', srcLocation: 'D-01-02', destLocation: 'B-01-02', itemCode: 'P-010', itemName: '商品J', lotNo: 'LOT-017', qty: 60,  unit: 'ピース',   note: '要冷蔵' },
  { datetime: '2026/05/17 10:45', srcLocation: 'B-02-01', destLocation: 'A-01-01', itemCode: 'P-003', itemName: '商品C', lotNo: 'LOT-008', qty: 80,  unit: 'ピース',   note: '' },
  { datetime: '2026/05/16 15:30', srcLocation: 'C-01-02', destLocation: 'D-04-02', itemCode: 'P-006', itemName: '商品F', lotNo: 'LOT-011', qty: 50,  unit: 'パレット', note: '' },
  { datetime: '2026/05/16 09:15', srcLocation: 'A-02-02', destLocation: 'C-02-02', itemCode: 'P-002', itemName: '商品B', lotNo: 'LOT-005', qty: 25,  unit: 'ケース',   note: '' },
  { datetime: '2026/05/15 16:40', srcLocation: 'D-03-01', destLocation: 'B-01-01', itemCode: 'P-009', itemName: '商品I', lotNo: 'LOT-020', qty: 30,  unit: 'ボール',   note: '' },
  { datetime: '2026/05/15 13:00', srcLocation: 'C-03-01', destLocation: 'A-01-02', itemCode: 'P-005', itemName: '商品E', lotNo: 'LOT-014', qty: 40,  unit: 'ケース',   note: '' },
  { datetime: '2026/05/14 17:50', srcLocation: 'D-02-02', destLocation: 'C-03-01', itemCode: 'P-008', itemName: '商品H', lotNo: 'LOT-019', qty: 35,  unit: '‐',        note: '' },
  { datetime: '2026/05/14 11:20', srcLocation: 'B-01-02', destLocation: 'D-03-02', itemCode: 'P-004', itemName: '商品D', lotNo: 'LOT-007', qty: 20,  unit: 'ボール',   note: '' },
  { datetime: '2026/05/13 15:10', srcLocation: 'A-02-01', destLocation: 'D-04-03', itemCode: 'P-001', itemName: '商品A', lotNo: 'LOT-004', qty: 60,  unit: 'パレット', note: '' },
  { datetime: '2026/05/13 10:30', srcLocation: 'C-02-02', destLocation: 'A-02-02', itemCode: 'P-006', itemName: '商品F', lotNo: 'LOT-013', qty: 90,  unit: 'パレット', note: '' },
  { datetime: '2026/05/12 16:00', srcLocation: 'D-04-02', destLocation: 'B-02-02', itemCode: 'P-008', itemName: '商品H', lotNo: 'LOT-024', qty: 15,  unit: '‐',        note: '' },
  { datetime: '2026/05/12 09:45', srcLocation: 'B-02-02', destLocation: 'C-01-01', itemCode: 'P-004', itemName: '商品D', lotNo: 'LOT-009', qty: 10,  unit: 'ボール',   note: '' },
  { datetime: '2026/05/11 14:30', srcLocation: 'D-01-01', destLocation: 'A-01-01', itemCode: 'P-009', itemName: '商品I', lotNo: 'LOT-016', qty: 40,  unit: 'ボール',   note: '' },
  { datetime: '2026/05/11 10:00', srcLocation: 'C-01-01', destLocation: 'D-01-02', itemCode: 'P-005', itemName: '商品E', lotNo: 'LOT-010', qty: 30,  unit: 'ケース',   note: '' },
  { datetime: '2026/05/10 17:15', srcLocation: 'D-04-03', destLocation: 'C-02-01', itemCode: 'P-010', itemName: '商品J', lotNo: 'LOT-025', qty: 70,  unit: 'ピース',   note: '要冷蔵' },
  { datetime: '2026/05/09 15:40', srcLocation: 'A-01-01', destLocation: 'B-01-01', itemCode: 'P-001', itemName: '商品A', lotNo: 'LOT-002', qty: 30,  unit: 'パレット', note: '' },
  { datetime: '2026/05/09 11:10', srcLocation: 'C-03-02', destLocation: 'D-02-01', itemCode: 'P-006', itemName: '商品F', lotNo: 'LOT-015', qty: 60,  unit: 'パレット', note: '' },
  { datetime: '2026/05/08 16:20', srcLocation: 'B-01-01', destLocation: 'A-02-01', itemCode: 'P-003', itemName: '商品C', lotNo: 'LOT-006', qty: 50,  unit: 'ピース',   note: '' },
  { datetime: '2026/05/08 09:30', srcLocation: 'D-03-02', destLocation: 'C-03-01', itemCode: 'P-010', itemName: '商品J', lotNo: 'LOT-021', qty: 25,  unit: 'ピース',   note: '要冷蔵' },
  { datetime: '2026/05/07 14:00', srcLocation: 'C-03-01', destLocation: 'B-02-01', itemCode: 'P-005', itemName: '商品E', lotNo: 'LOT-014', qty: 20,  unit: 'ケース',   note: '' },
];

var transferHistoryFiltered    = TRANSFER_HISTORY_DATA.slice();
var transferHistoryCurrentPage = 1;
var TRANSFER_HISTORY_PAGE_SIZE = 20;

function initTransferHistoryTable() {
  if (!document.getElementById('transferHistoryTableBody')) return;
  transferHistoryFiltered = TRANSFER_HISTORY_DATA.slice();
  renderTransferHistoryPage(1);
}

function filterTransferHistory() {
  var startDate = document.getElementById('transferHistoryDateFrom').value;
  var endDate   = document.getElementById('transferHistoryDateTo').value;
  var keyword   = document.getElementById('transferHistoryKeyword').value.toLowerCase();

  transferHistoryFiltered = TRANSFER_HISTORY_DATA.filter(function (row) {
    if (startDate || endDate) {
      var rowDate = row.datetime.substring(0, 10).replace(/\//g, '-');
      if (startDate && rowDate < startDate) return false;
      if (endDate   && rowDate > endDate)   return false;
    }
    if (keyword) {
      var target = [row.srcLocation, row.destLocation, row.itemCode, row.itemName, row.lotNo]
        .join('\t').toLowerCase();
      if (target.indexOf(keyword) === -1) return false;
    }
    return true;
  });

  renderTransferHistoryPage(1);
}

function renderTransferHistoryPage(page) {
  transferHistoryCurrentPage = page;
  var start    = (page - 1) * TRANSFER_HISTORY_PAGE_SIZE;
  var pageData = transferHistoryFiltered.slice(start, start + TRANSFER_HISTORY_PAGE_SIZE);

  var tbody = document.getElementById('transferHistoryTableBody');
  tbody.innerHTML = '';

  if (pageData.length === 0) {
    var emptyRow = document.createElement('tr');
    var emptyCell = document.createElement('td');
    emptyCell.colSpan = 9;
    emptyCell.style.textAlign = 'center';
    emptyCell.style.padding = 'var(--ds-space-300)';
    emptyCell.textContent = 'データがありません';
    emptyRow.appendChild(emptyCell);
    tbody.appendChild(emptyRow);
  } else {
    pageData.forEach(function (row) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + row.datetime     + '</td>' +
        '<td>' + row.srcLocation  + '</td>' +
        '<td>' + row.destLocation + '</td>' +
        '<td>' + row.itemCode     + '</td>' +
        '<td>' + row.itemName     + '</td>' +
        '<td>' + row.lotNo        + '</td>' +
        '<td style="text-align:right">' + row.qty + '</td>' +
        '<td>' + row.unit         + '</td>' +
        '<td>' + row.note         + '</td>';
      tbody.appendChild(tr);
    });
  }

  updateTransferHistoryTotalCount(transferHistoryFiltered.length);
  renderTransferHistoryPagination(transferHistoryFiltered.length, page);
}

function updateTransferHistoryTotalCount(count) {
  var el = document.getElementById('transferHistoryTotalCount');
  if (el) el.textContent = '全 ' + count + ' 件';
}

function renderTransferHistoryPagination(totalCount, page) {
  var totalPages = Math.ceil(totalCount / TRANSFER_HISTORY_PAGE_SIZE);
  var container  = document.getElementById('transferHistoryPagination');
  if (!container) return;
  container.innerHTML = '';

  var prevBtn = document.createElement('button');
  prevBtn.className = 'history-pagination-btn';
  prevBtn.textContent = '< 前へ';
  prevBtn.disabled = (page === 1);
  prevBtn.setAttribute('aria-label', '前のページ');
  prevBtn.addEventListener('click', function () { renderTransferHistoryPage(page - 1); });
  container.appendChild(prevBtn);

  for (var i = 1; i <= totalPages; i++) {
    (function (p) {
      var btn = document.createElement('button');
      btn.className = 'history-pagination-btn' + (p === page ? ' is-active' : '');
      btn.textContent = p;
      btn.setAttribute('aria-label', p + 'ページ');
      if (p === page) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', function () { renderTransferHistoryPage(p); });
      container.appendChild(btn);
    })(i);
  }

  var nextBtn = document.createElement('button');
  nextBtn.className = 'history-pagination-btn';
  nextBtn.textContent = '次へ >';
  nextBtn.disabled = (page >= totalPages || totalPages === 0);
  nextBtn.setAttribute('aria-label', '次のページ');
  nextBtn.addEventListener('click', function () { renderTransferHistoryPage(page + 1); });
  container.appendChild(nextBtn);
}

// === SCR-015 在庫調整 ===

var ADJUSTMENT_ITEMS = [
  { code: 'ITM-001', name: '商品A', unit: 'ケース' },
  { code: 'ITM-002', name: '商品B', unit: 'ピース' },
  { code: 'ITM-003', name: '商品C', unit: 'パレット' },
  { code: 'ITM-004', name: '商品D', unit: 'ボール' },
  { code: 'ITM-005', name: '商品E', unit: 'ケース' },
];

function populateAdjItemSelects() {
  var codeEl = document.getElementById('adjItemCode');
  var nameEl = document.getElementById('adjItemName');
  if (!codeEl || !nameEl) return;
  codeEl.innerHTML = '<option value="">選択してください</option>';
  nameEl.innerHTML = '<option value="">選択してください</option>';
  ADJUSTMENT_ITEMS.forEach(function(item) {
    var optCode = document.createElement('option');
    optCode.value = item.code;
    optCode.textContent = item.code;
    codeEl.appendChild(optCode);
    var optName = document.createElement('option');
    optName.value = item.code;
    optName.textContent = item.name;
    nameEl.appendChild(optName);
  });
}

function setAdjUnitType(unit) {
  var unitEl = document.getElementById('adjUnitType');
  if (!unitEl) return;
  unitEl.innerHTML = unit
    ? '<option value="' + unit + '">' + unit + '</option>'
    : '<option value="">-</option>';
}

function onAdjItemCodeChange() {
  var codeEl = document.getElementById('adjItemCode');
  var nameEl = document.getElementById('adjItemName');
  var code = codeEl ? codeEl.value : '';
  var item = ADJUSTMENT_ITEMS.filter(function(i) { return i.code === code; })[0];
  if (item) {
    if (nameEl) nameEl.value = item.code;
    setAdjUnitType(item.unit);
  } else {
    if (nameEl) nameEl.value = '';
    setAdjUnitType('');
  }
}

function onAdjItemNameChange() {
  var codeEl = document.getElementById('adjItemCode');
  var nameEl = document.getElementById('adjItemName');
  var code = nameEl ? nameEl.value : '';
  var item = ADJUSTMENT_ITEMS.filter(function(i) { return i.code === code; })[0];
  if (item) {
    if (codeEl) codeEl.value = item.code;
    setAdjUnitType(item.unit);
  } else {
    if (codeEl) codeEl.value = '';
    setAdjUnitType('');
  }
}

function populateAdjShelfSelect() {
  var sel = document.getElementById('adjShelfLocation');
  if (!sel) return;
  sel.innerHTML = '<option value="">棚ロケを選択</option>';
  shelfLocations.forEach(function(s) {
    var opt = document.createElement('option');
    opt.value = s.code;
    opt.textContent = s.code;
    sel.appendChild(opt);
  });
}

function initAdjustmentForm() {
  populateAdjItemSelects();
  populateAdjShelfSelect();
}

function openAdjustmentModal() {
  var codeEl = document.getElementById('adjItemCode');
  var unitEl = document.getElementById('adjUnitType');
  var lotEl = document.getElementById('adjLotNo');
  var expiryEl = document.getElementById('adjExpiryDate');
  var shelfEl = document.getElementById('adjShelfLocation');
  var qtyEl = document.getElementById('adjQuantity');

  if (!codeEl.value || !shelfEl.value || !qtyEl.value) return;
  var qty = parseInt(qtyEl.value, 10);
  if (isNaN(qty) || qty === 0) return;

  var item = ADJUSTMENT_ITEMS.filter(function(i) { return i.code === codeEl.value; })[0];

  document.getElementById('modalItemCode').textContent = codeEl.value;
  document.getElementById('modalItemName').textContent = item ? item.name : '—';
  document.getElementById('modalUnitType').textContent = (unitEl && unitEl.value) ? unitEl.value : '—';
  document.getElementById('modalLotNo').textContent = (lotEl && lotEl.value) ? lotEl.value : '—';
  document.getElementById('modalExpiryDate').textContent = (expiryEl && expiryEl.value) ? expiryEl.value : '—';
  document.getElementById('modalShelfLocation').textContent = shelfEl.value;
  document.getElementById('modalQuantity').textContent = qty > 0 ? '+' + qty : String(qty);

  openModal('adjustmentModal');
}

function confirmAdjustment() {
  closeModal('adjustmentModal');
}

if (document.getElementById('adjustmentForm')) {
  initAdjustmentForm();
}

// === 棚卸管理 (SCR-018) ===

var INVENTORY_DUMMY_DATA = [
  {
    location: 'A-01-01',
    items: [
      { itemCode: 'P-001', itemName: '商品A', lotNo: 'LOT-001', countQty: 98,  stockQty: 100, unit: 'パレット' },
      { itemCode: 'P-001', itemName: '商品A', lotNo: 'LOT-002', countQty: 80,  stockQty: 80,  unit: 'パレット' }
    ]
  },
  {
    location: 'A-01-02',
    items: [
      { itemCode: 'P-002', itemName: '商品B', lotNo: 'LOT-003', countQty: 60,  stockQty: 60,  unit: 'ケース' }
    ]
  },
  {
    location: 'A-02-01',
    items: [
      { itemCode: 'P-001', itemName: '商品A', lotNo: 'LOT-004', countQty: 125, stockQty: 120, unit: 'パレット' }
    ]
  },
  {
    location: 'A-02-02',
    items: [
      { itemCode: 'P-002', itemName: '商品B', lotNo: 'LOT-005', countQty: 45,  stockQty: 45,  unit: 'ケース' }
    ]
  },
  {
    location: 'B-01-01',
    items: [
      { itemCode: 'P-003', itemName: '商品C', lotNo: 'LOT-006', countQty: 290, stockQty: 300, unit: 'ピース' }
    ]
  },
  {
    location: 'B-01-02',
    items: [
      { itemCode: 'P-004', itemName: '商品D', lotNo: 'LOT-007', countQty: 50,  stockQty: 50,  unit: 'ボール' }
    ]
  },
  {
    location: 'B-02-01',
    items: [
      { itemCode: 'P-003', itemName: '商品C', lotNo: 'LOT-008', countQty: 153, stockQty: 150, unit: 'ピース' }
    ]
  },
  {
    location: 'B-02-02',
    items: [
      { itemCode: 'P-004', itemName: '商品D', lotNo: 'LOT-009', countQty: 30,  stockQty: 30,  unit: 'ボール' },
      { itemCode: 'P-005', itemName: '商品E', lotNo: 'LOT-010', countQty: 80,  stockQty: 80,  unit: 'ケース' }
    ]
  },
  {
    location: 'C-01-01',
    items: [
      { itemCode: 'P-006', itemName: '商品F', lotNo: 'LOT-011', countQty: 200, stockQty: 200, unit: 'パレット' }
    ]
  },
  {
    location: 'C-01-02',
    items: [
      { itemCode: 'P-005', itemName: '商品E', lotNo: 'LOT-012', countQty: 55,  stockQty: 60,  unit: 'ケース' }
    ]
  },
  {
    location: 'C-02-01',
    items: [
      { itemCode: 'P-006', itemName: '商品F', lotNo: 'LOT-013', countQty: 180, stockQty: 180, unit: 'パレット' }
    ]
  },
  {
    location: 'C-02-02',
    items: [
      { itemCode: 'P-005', itemName: '商品E', lotNo: 'LOT-014', countQty: 100, stockQty: 100, unit: 'ケース' }
    ]
  },
  {
    location: 'D-01-01',
    items: [
      { itemCode: 'P-009', itemName: '商品I', lotNo: 'LOT-016', countQty: 88,  stockQty: 90,  unit: 'ボール' }
    ]
  },
  {
    location: 'D-02-01',
    items: [
      { itemCode: 'P-007', itemName: '商品G', lotNo: 'LOT-018', countQty: 250, stockQty: 250, unit: 'ピース' }
    ]
  },
  {
    location: 'D-02-02',
    items: [
      { itemCode: 'P-008', itemName: '商品H', lotNo: 'LOT-019', countQty: 70,  stockQty: 70,  unit: String.fromCharCode(8212) }
    ]
  }
];

var inventoryLocations = [];
var inventoryExpanded = new Set();
var inventoryRefreshCount = 0;

function initInventory() {
  inventoryLocations = INVENTORY_DUMMY_DATA.map(function(d) {
    return { location: d.location, status: 'pending', checked: false, items: d.items };
  });
  inventoryExpanded = new Set();
  inventoryRefreshCount = 0;
}

function startInventory() {
  document.getElementById('inventoryGuide').style.display = 'none';
  document.getElementById('inventoryTableArea').style.display = '';
  document.getElementById('inventoryStartBtn').disabled = true;
  document.getElementById('inventoryRefreshBtn').disabled = false;
  document.getElementById('inventoryLastUpdated').textContent = inventoryFormatDatetime(new Date());
  renderInventoryTable();
}

function renderInventoryTable() {
  var tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;

  var html = '';
  inventoryLocations.forEach(function(loc) {
    var isExpanded   = inventoryExpanded.has(loc.location);
    var canCheck     = loc.status === 'done';
    var rowClass     = 'is-location-row' + (isExpanded ? ' is-expanded' : '');
    var cursor       = 'cursor: pointer;';

    html += '<tr class="' + rowClass + '" data-location="' + loc.location + '" style="' + cursor + '">';
    html += '<td style="text-align: center;" onclick="event.stopPropagation()">';
    html += '<input type="checkbox" class="inventory-checkbox"';
    html += (canCheck ? '' : ' disabled');
    html += (loc.checked ? ' checked' : '');
    html += ' data-location="' + loc.location + '">';
    html += '</td>';
    html += '<td>' + loc.location + '</td>';
    html += '<td>' + inventoryStatusBadge(loc.status) + '</td>';
    html += '<td>' + inventoryDiffBadge(loc) + '</td>';
    html += '</tr>';

    {
      var isPending = loc.status === 'pending';
      html += '<tr class="inventory-detail-row" data-detail-for="' + loc.location + '"';
      html += (isExpanded ? '' : ' style="display: none;"') + '>';
      html += '<td colspan="4"><div class="inventory-detail-inner">';
      html += '<table class="inventory-detail-table">';
      html += '<thead><tr>';
      html += '<th>商品コード</th><th>商品名</th><th>ロット番号</th>';
      html += '<th style="text-align: right;">棚卸数量</th>';
      html += '<th style="text-align: right;">現在在庫数</th>';
      html += '<th style="text-align: right;">差異</th>';
      html += '<th>単位区分</th>';
      html += '</tr></thead><tbody>';
      loc.items.forEach(function(item) {
        var dash = String.fromCharCode(8212);
        var countQtyCell, diffCell;
        if (isPending) {
          countQtyCell = dash;
          diffCell     = '<td style="text-align: right;">' + dash + '</td>';
        } else {
          var diff    = item.countQty - item.stockQty;
          var diffStr = diff > 0 ? '+' + diff : String(diff);
          var diffClass = diff !== 0 ? ' class="inventory-diff--warning"' : '';
          countQtyCell = item.countQty;
          diffCell     = '<td style="text-align: right;"' + diffClass + '>' + diffStr + '</td>';
        }
        html += '<tr>';
        html += '<td>' + item.itemCode + '</td>';
        html += '<td>' + item.itemName + '</td>';
        html += '<td>' + item.lotNo + '</td>';
        html += '<td style="text-align: right;">' + countQtyCell + '</td>';
        html += '<td style="text-align: right;">' + item.stockQty + '</td>';
        html += diffCell;
        html += '<td>' + item.unit + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div></td></tr>';
    }
  });

  tbody.innerHTML = html;

  tbody.querySelectorAll('tr.is-location-row').forEach(function(tr) {
    tr.addEventListener('click', function(e) {
      if (e.target.type === 'checkbox') return;
      toggleInventoryDetail(tr.dataset.location);
    });
  });

  tbody.querySelectorAll('.inventory-checkbox').forEach(function(cb) {
    cb.addEventListener('change', function() {
      var loc = inventoryLocations.find(function(l) { return l.location === cb.dataset.location; });
      if (loc) loc.checked = cb.checked;
      validateInventoryApproveBtn();
    });
  });
}

function inventoryStatusBadge(status) {
  var map = {
    pending:     ['status-badge--subtle',      '未着手'],
    in_progress: ['status-badge--information', '進行中'],
    done:        ['status-badge--warning',     '完了'],
    approved:    ['status-badge--success',     '承認済み']
  };
  var entry = map[status] || map.pending;
  return '<span class="status-badge ' + entry[0] + '">' + entry[1] + '</span>';
}

function inventoryDiffBadge(loc) {
  if (loc.status !== 'done' && loc.status !== 'approved') return String.fromCharCode(8212);
  var hasDiff = loc.items.some(function(item) { return item.countQty !== item.stockQty; });
  if (hasDiff) return '<span class="status-badge status-badge--warning">⚠ 差異あり</span>';
  return '<span class="status-badge status-badge--subtle">差異なし</span>';
}

function toggleInventoryDetail(location) {
  var loc = inventoryLocations.find(function(l) { return l.location === location; });
  if (!loc) return;
  if (inventoryExpanded.has(location)) {
    inventoryExpanded.delete(location);
  } else {
    inventoryExpanded.add(location);
  }
  renderInventoryTable();
}

function refreshInventory() {
  inventoryRefreshCount++;
  inventoryAdvanceStatus();
  renderInventoryTable();
  validateInventoryApproveBtn();
  validateInventoryCompleteBtn();
  document.getElementById('inventoryLastUpdated').textContent = inventoryFormatDatetime(new Date());
}

function inventoryAdvanceStatus() {
  var groups = [
    { step: 1, locs: ['A-01-01', 'A-01-02', 'A-02-01', 'A-02-02'] },
    { step: 2, locs: ['B-01-01', 'B-01-02', 'B-02-01', 'B-02-02'] },
    { step: 3, locs: ['C-01-01', 'C-01-02', 'C-02-01', 'C-02-02'] },
    { step: 4, locs: ['D-01-01', 'D-02-01', 'D-02-02'] }
  ];
  groups.forEach(function(g) {
    g.locs.forEach(function(code) {
      var loc = inventoryLocations.find(function(l) { return l.location === code; });
      if (!loc || loc.status === 'approved') return;
      if (inventoryRefreshCount === g.step && loc.status === 'pending') {
        loc.status = 'in_progress';
      } else if (inventoryRefreshCount === g.step + 1 && loc.status === 'in_progress') {
        loc.status = 'done';
      } else if (inventoryRefreshCount > g.step + 1 && loc.status === 'pending') {
        loc.status = 'done';
      }
    });
  });
}

function approveSelected() {
  inventoryLocations.forEach(function(loc) {
    if (loc.checked) { loc.status = 'approved'; loc.checked = false; }
  });
  renderInventoryTable();
  validateInventoryApproveBtn();
  validateInventoryCompleteBtn();
}

function validateInventoryApproveBtn() {
  var has = inventoryLocations.some(function(loc) { return loc.checked; });
  document.getElementById('inventoryApproveBtn').disabled = !has;
}

function validateInventoryCompleteBtn() {
  var all = inventoryLocations.every(function(loc) { return loc.status === 'approved'; });
  document.getElementById('inventoryCompleteBtn').disabled = !all;
}

function completeInventory() {
  closeModal('inventoryCompleteModal');
  var flash = document.getElementById('inventoryFlash');
  flash.textContent = '棚卸が完了しました';
  flash.style.display = 'flex';
  setTimeout(function() { flash.style.display = 'none'; }, 3000);
  initInventory();
  document.getElementById('inventoryTableArea').style.display = 'none';
  document.getElementById('inventoryGuide').style.display = '';
  document.getElementById('inventoryStartBtn').disabled = false;
  document.getElementById('inventoryRefreshBtn').disabled = true;
  document.getElementById('inventoryApproveBtn').disabled = true;
  document.getElementById('inventoryCompleteBtn').disabled = true;
  document.getElementById('inventoryLastUpdated').textContent = String.fromCharCode(8212);
}

function inventoryFormatDatetime(date) {
  var pad = function(n) { return String(n).padStart(2, '0'); };
  return date.getFullYear() + '/' + pad(date.getMonth() + 1) + '/' + pad(date.getDate()) +
    ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
}

if (document.getElementById('inventoryTableBody')) {
  initInventory();
}

/* ============================================================
   SCR-003: 取引先定義
   ============================================================ */

var supplierData = [
  { company: '株式会社山田商事',   kana: 'やまだしょうじ',        zip: '100-0001', address: '東京都千代田区千代田1-1-1',       tel: '03-1234-5678',  contact: '山田 太郎', hasConversion: true  },
  { company: '田中物産株式会社',   kana: 'たなかぶっさん',        zip: '530-0001', address: '大阪府大阪市北区梅田2-2-2',       tel: '06-2345-6789',  contact: '田中 花子', hasConversion: false },
  { company: '合同会社鈴木倉庫',   kana: 'すずきそうこ',          zip: '460-0001', address: '愛知県名古屋市中村区3-3-3',       tel: '052-345-6789',  contact: '',          hasConversion: false },
  { company: '佐藤運輸株式会社',   kana: 'さとううんゆ',          zip: '810-0001', address: '福岡県福岡市博多区4-4-4',         tel: '092-456-7890',  contact: '佐藤 次郎', hasConversion: false },
  { company: '高橋商店',           kana: 'たかはししょうてん',     zip: '060-0001', address: '北海道札幌市中央区5-5-5',         tel: '011-567-8901',  contact: '',          hasConversion: false },
  { company: '株式会社伊藤製作所', kana: 'いとうせいさくしょ',     zip: '980-0001', address: '宮城県仙台市青葉区6-6-6',         tel: '022-678-9012',  contact: '伊藤 美穂', hasConversion: false },
  { company: '渡辺食品株式会社',   kana: 'わたなべしょくひん',     zip: '220-0001', address: '神奈川県横浜市西区7-7-7',         tel: '045-789-0123',  contact: '渡辺 誠',   hasConversion: false },
  { company: '中村流通合同会社',   kana: 'なかむらりゅうつう',     zip: '380-0001', address: '長野県長野市8-8-8',               tel: '026-890-1234',  contact: '',          hasConversion: false },
  { company: '小林産業株式会社',   kana: 'こばやしさんぎょう',     zip: '600-0001', address: '京都府京都市下京区9-9-9',         tel: '075-901-2345',  contact: '小林 隆',   hasConversion: true  },
  { company: '加藤物流株式会社',   kana: 'かとうぶつりゅう',       zip: '380-0002', address: '長野県松本市1-1-2',               tel: '0263-12-3456',  contact: '加藤 律子', hasConversion: false },
  { company: '吉田商事株式会社',   kana: 'よしだしょうじ',         zip: '100-0002', address: '東京都千代田区丸の内1-2-3',       tel: '03-2345-6789',  contact: '',          hasConversion: false },
  { company: '山本運輸株式会社',   kana: 'やまもとうんゆ',         zip: '530-0002', address: '大阪府大阪市中央区2-3-4',         tel: '06-3456-7890',  contact: '山本 健一', hasConversion: false },
  { company: '松本倉庫株式会社',   kana: 'まつもとそうこ',         zip: '460-0002', address: '愛知県名古屋市東区3-4-5',         tel: '052-456-7890',  contact: '',          hasConversion: false },
  { company: '井上商店',           kana: 'いのうえしょうてん',     zip: '810-0002', address: '福岡県福岡市中央区4-5-6',         tel: '092-567-8901',  contact: '井上 涼子', hasConversion: false },
  { company: '木村製作所',         kana: 'きむらせいさくしょ',     zip: '060-0002', address: '北海道札幌市北区5-6-7',           tel: '011-678-9012',  contact: '',          hasConversion: false },
  { company: '林物産株式会社',     kana: 'はやしぶっさん',         zip: '980-0002', address: '宮城県仙台市宮城野区6-7-8',       tel: '022-789-0123',  contact: '林 正樹',   hasConversion: false },
  { company: '清水食品株式会社',   kana: 'しみずしょくひん',       zip: '220-0002', address: '神奈川県横浜市港北区7-8-9',       tel: '045-890-1234',  contact: '',          hasConversion: false },
  { company: '斎藤流通株式会社',   kana: 'さいとうりゅうつう',     zip: '380-0003', address: '長野県上田市8-9-10',              tel: '0268-23-4567',  contact: '斎藤 博',   hasConversion: false },
  { company: '山口産業株式会社',   kana: 'やまぐちさんぎょう',     zip: '750-0001', address: '山口県山口市1-2-3',               tel: '083-123-4567',  contact: '',          hasConversion: false },
  { company: '前田物流株式会社',   kana: 'まえだぶつりゅう',       zip: '690-0001', address: '島根県松江市2-3-4',               tel: '0852-23-4567',  contact: '前田 由美', hasConversion: true  },
  { company: '後藤商事株式会社',   kana: 'ごとうしょうじ',         zip: '450-0001', address: '愛知県名古屋市西区3-4-5',         tel: '052-567-8901',  contact: '',          hasConversion: false },
  { company: '長谷川運輸株式会社', kana: 'はせがわうんゆ',          zip: '330-0001', address: '埼玉県さいたま市大宮区4-5-6',     tel: '048-678-9012',  contact: '長谷川 徹', hasConversion: false },
  { company: '石川倉庫株式会社',   kana: 'いしかわそうこ',          zip: '920-0001', address: '石川県金沢市5-6-7',               tel: '076-789-0123',  contact: '',          hasConversion: false },
  { company: '橋本商店',           kana: 'はしもとしょうてん',     zip: '630-0001', address: '奈良県奈良市6-7-8',               tel: '0742-12-3456',  contact: '橋本 典子', hasConversion: false },
  { company: '村上製作所',         kana: 'むらかみせいさくしょ',   zip: '950-0001', address: '新潟県新潟市中央区7-8-9',         tel: '025-890-1234',  contact: '',          hasConversion: false }
];

var supplierCurrentPage = 1;
var supplierPageSize = 20;
var supplierFilteredData = supplierData.slice();

function renderSupplierPage(page) {
  var tbody = document.getElementById('supplierTableBody');
  if (!tbody) return;
  supplierCurrentPage = page;
  var start = (page - 1) * supplierPageSize;
  var rows = supplierFilteredData.slice(start, start + supplierPageSize);
  tbody.innerHTML = rows.map(function(s) {
    var convCell = s.hasConversion
      ? '<span class="body-s" style="margin-right:var(--ds-space-100);">あり</span><button type="button" class="btn-edit" onclick="openConversionModal(\'' + s.company.replace(/'/g, "\\'") + '\')" aria-label="' + s.company + 'の変換定義を編集">編集</button>'
      : '<span class="body-s text-subtle" style="margin-right:var(--ds-space-100);">なし</span><button type="button" class="btn btn-primary" style="height:1.5rem;font-size:0.75rem;padding:0 var(--ds-space-100);" onclick="openConversionModal(\'' + s.company.replace(/'/g, "\\'") + '\')" aria-label="' + s.company + 'の変換定義を登録">登録</button>';
    return '<tr>' +
      '<td>' + s.company + '</td>' +
      '<td>' + s.kana + '</td>' +
      '<td>〒' + s.zip + '</td>' +
      '<td>' + s.address + '</td>' +
      '<td>' + s.tel + '</td>' +
      '<td>' + (s.contact || '<span class="text-subtle">—</span>') + '</td>' +
      '<td style="white-space:nowrap;">' + convCell + '</td>' +
      '</tr>';
  }).join('');
  renderSupplierPagination();
}

function renderSupplierPagination() {
  var container = document.getElementById('paginationRow');
  if (!container) return;
  var totalPages = Math.ceil(supplierFilteredData.length / supplierPageSize);
  container.innerHTML = '';
  if (totalPages <= 1) return;

  var prevBtn = document.createElement('button');
  prevBtn.className = 'history-pagination-btn';
  prevBtn.textContent = '< 前へ';
  prevBtn.disabled = (supplierCurrentPage === 1);
  prevBtn.setAttribute('aria-label', '前のページ');
  prevBtn.addEventListener('click', function() { renderSupplierPage(supplierCurrentPage - 1); });
  container.appendChild(prevBtn);

  for (var i = 1; i <= totalPages; i++) {
    (function(p) {
      var btn = document.createElement('button');
      btn.className = 'history-pagination-btn' + (p === supplierCurrentPage ? ' is-active' : '');
      btn.textContent = p;
      btn.setAttribute('aria-label', p + 'ページ');
      if (p === supplierCurrentPage) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', function() { renderSupplierPage(p); });
      container.appendChild(btn);
    })(i);
  }

  var nextBtn = document.createElement('button');
  nextBtn.className = 'history-pagination-btn';
  nextBtn.textContent = '次へ >';
  nextBtn.disabled = (supplierCurrentPage >= totalPages);
  nextBtn.setAttribute('aria-label', '次のページ');
  nextBtn.addEventListener('click', function() { renderSupplierPage(supplierCurrentPage + 1); });
  container.appendChild(nextBtn);
}

function searchSuppliers() {
  var keyword = (document.getElementById('supplierSearchInput').value || '').trim().toLowerCase();
  supplierFilteredData = keyword
    ? supplierData.filter(function(s) {
        return s.company.toLowerCase().indexOf(keyword) !== -1 ||
               s.kana.indexOf(keyword) !== -1 ||
               s.contact.toLowerCase().indexOf(keyword) !== -1;
      })
    : supplierData.slice();
  renderSupplierPage(1);
}

function uploadSupplierCsv() {
  var fileInput = document.getElementById('csvFileInput');
  var errorDiv  = document.getElementById('csvErrorMessage');
  var successDiv = document.getElementById('csvSuccessMessage');
  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';
  if (!fileInput || !fileInput.files || !fileInput.files.length) {
    errorDiv.textContent = 'ファイルを選択してください。';
    errorDiv.style.display = '';
    return;
  }
  successDiv.textContent = '25件登録しました。';
  successDiv.style.display = '';
  setTimeout(function() { successDiv.style.display = 'none'; }, 4000);
}

function openConversionModal(companyName) {
  var title = document.getElementById('conversionModalTitle');
  if (title) title.textContent = '変換定義 — ' + companyName;
  var nameSpan = document.getElementById('convCsvSelectedName');
  if (nameSpan) nameSpan.textContent = 'ファイルを選択してください (.csv)';
  var fileInput = document.getElementById('convCsvFileInput');
  if (fileInput) fileInput.value = '';
  var errDiv = document.getElementById('convCsvErrorMessage');
  if (errDiv) { errDiv.style.display = 'none'; errDiv.textContent = ''; }
  document.getElementById('conversionModalOverlay').style.display = 'flex';
  document.getElementById('conversionModalOverlay').dataset.company = companyName;
}

function closeConversionModal() {
  document.getElementById('conversionModalOverlay').style.display = 'none';
}

function uploadConversionCsv() {
  var fileInput = document.getElementById('convCsvFileInput');
  var errDiv = document.getElementById('convCsvErrorMessage');
  errDiv.style.display = 'none';
  if (!fileInput || !fileInput.files || !fileInput.files.length) {
    errDiv.textContent = 'ファイルを選択してください。';
    errDiv.style.display = '';
    return;
  }
  var companyName = document.getElementById('conversionModalOverlay').dataset.company;
  var item = supplierData.find(function(s) { return s.company === companyName; });
  if (item) item.hasConversion = true;
  supplierFilteredData = supplierData.slice();
  renderSupplierPage(supplierCurrentPage);
  closeConversionModal();
}

if (document.getElementById('supplierTableBody')) {
  renderSupplierPage(1);
}
