# Vercel デプロイ手順（フロントエンド）

バックエンドは自社サーバー（例: `103.179.45.111:4000`）のまま、**フロントエンドのみ Vercel** に公開する手順です。

---

## 1. Vercel プロジェクト作成

1. [Vercel](https://vercel.com/) にログイン
2. **Add New → Project** で Git リポジトリをインポート（または CLI でデプロイ）
3. **Root Directory** を `frontend` に設定（モノレポのため必須）
4. Framework Preset: **Next.js**（自動検出）

---

## 2. Vercel 環境変数

Vercel Dashboard → **Settings → Environment Variables** に以下を設定:

| 変数名 | 例 | 説明 |
|--------|-----|------|
| `BACKEND_URL` | `http://103.179.45.111:4000` | バックエンド URL（**Server のみ**・Rewrite 用） |
| `NEXT_PUBLIC_API_URL` | `/api` | ブラウザからは Vercel 経由で API にプロキシ |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://your-app.vercel.app` | OAuth 戻り先など |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | （Maps API キー） | 地図表示用 |

テンプレート: `frontend/.env.production.example`

### API プロキシについて

Vercel は HTTPS、バックエンドが HTTP の場合、ブラウザの **Mixed Content** で直接 API 呼び出しがブロックされます。  
`BACKEND_URL` + `NEXT_PUBLIC_API_URL=/api` により、Vercel が `/api/*` と `/uploads/*` をバックエンドへ転送します。

---

## 3. バックエンド側の設定（`.env`）

Vercel デプロイ後、バックエンドの `backend/.env` を更新:

```env
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
ALLOW_VERCEL_ORIGINS=true
```

- `ALLOW_VERCEL_ORIGINS=true` … `*.vercel.app` プレビュー URL も CORS 許可（デフォルト有効）
- OAuth（Gmail / GBP）のコールバック URI は **バックエンド** のまま（例: `http://103.179.45.111:4000/api/gmail/callback`）  
  GCP の「承認済みリダイレクト URI」に登録済みであること

バックエンドを再起動してください。

---

## 4. Google Maps API キー

Google Cloud Console → API キー → **HTTP リファラー** に追加:

```
https://your-app.vercel.app/*
https://*.vercel.app/*
```

---

## 5. デプロイ

### Git 連携
main ブランチへ push すると自動デプロイされます。

### CLI
```bash
cd frontend
npx vercel
npx vercel --prod
```

---

## 6. 動作確認

1. `https://your-app.vercel.app/login` でログイン
2. ダッシュボード・投稿一覧が表示されること
3. 設定 → Gmail / GBP 連携（OAuth 後、Vercel の URL に戻ること）

---

## トラブルシューティング

| 症状 | 対処 |
|------|------|
| ログイン失敗 | `BACKEND_URL`・バックエンド起動・ファイアウォール 4000 番を確認 |
| CORS エラー | `FRONTEND_URL` / `ALLOWED_ORIGINS` を Vercel URL に更新 |
| 地図が表示されない | Maps API キーのリファラー制限に Vercel ドメインを追加 |
| OAuth 失敗 | GCP リダイレクト URI がバックエンド URL と一致しているか確認 |

---

## ファイル一覧

| ファイル | 役割 |
|----------|------|
| `frontend/vercel.json` | Vercel 設定 |
| `frontend/next.config.ts` | `/api`・`/uploads` Rewrite |
| `frontend/.env.production.example` | 本番環境変数テンプレート |
| `frontend/src/lib/api-url.ts` | 本番では `/api` プロキシを使用 |
