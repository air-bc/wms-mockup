# WMS モックアップ 画面説明書

## GitHub Pages 公開手順

モックアップを更新して GitHub Pages に反映する手順です。

### 1. docs/ にコピー

```powershell
Copy-Item -Recurse -Force "static\*" "docs\static\"
Copy-Item -Recurse -Force "renew_templates\*" "docs\renew_templates\"
```

### 2. push

```powershell
git add docs/
git commit -m "update docs"
git push
```

### 公開URL

```text
https://air-bc.github.io/wms-mockup/renew_templates/001_shelf_location.html
```
