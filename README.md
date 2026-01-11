# Renderrito License Server

這是 Renderrito AE 插件的許可證驗證伺服器。

## 部署到 Vercel

### 步驟 1: Fork 或 Clone 此倉庫

```bash
git clone https://github.com/stu8072832-debug/renderrito-license-server-v2.git
cd renderrito-license-server-v2
```

### 步驟 2: 在 Vercel 中部署

1. 進入 [Vercel.com](https://vercel.com)
2. 使用 GitHub 帳戶登錄
3. 點擊 **"Add New"** → **"Project"**
4. 選擇此倉庫並點擊 **"Import"**
5. 在 **Environment Variables** 中添加：
   - **Key**: `LICENSE_KEYS`
   - **Value**: 逗號分隔的許可證序號列表

### 步驟 3: 部署

點擊 **"Deploy"** 按鈕

## 環境變量

### LICENSE_KEYS

有效的許可證序號列表，用逗號分隔。

**格式**: `key1,key2,key3`

**範例**:
```
RR-4H9N-CTPK-3657-RVU4-6217,RR-ZC82-0GNH-9F87-Z949-9150,RR-SSVQ-KHX6-WD15-DGIF-4803
```

## API 端點

### POST /api/verify

驗證許可證序號。

**請求**:
```json
{
  "license_key": "RR-XXXX-XXXX-XXXX-XXXX-YYYY"
}
```

**成功響應** (200):
```json
{
  "status": "success",
  "message": "License key is valid.",
  "token": "sha256_hash_token",
  "expires": 1234567890
}
```

**失敗響應** (401):
```json
{
  "status": "error",
  "message": "License key is invalid"
}
```

## 許可證序號格式

許可證序號格式為: `RR-XXXX-XXXX-XXXX-XXXX-YYYY`

其中:
- `RR` 是前綴
- `XXXX` 是隨機的字母和數字
- `YYYY` 是校驗碼（年份）

## 本地開發

```bash
npm install
npm start
```

伺服器將在 `http://localhost:3000` 上運行。

### 測試 API

```bash
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"license_key": "RR-4H9N-CTPK-3657-RVU4-6217"}'
```
