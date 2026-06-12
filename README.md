# word-of-mouth-marketing-easier.AI

GBP（Google Business Profile）投稿管理システムのフロントエンド（Next.js）。

## 技術スタック

- Next.js 16 / React 19
- TypeScript / Tailwind CSS

## ローカル開発

```bash
npm install
cp .env.local.example .env.local
# .env.local を編集
npm run dev
```

http://localhost:3000

## Vercel デプロイ

手順は [VERCEL.md](./VERCEL.md) を参照してください。

## 環境変数

| 変数 | 説明 |
|------|------|
| `NEXT_PUBLIC_API_URL` | バックエンド API（開発: `http://localhost:4000/api`、Vercel: `/api`） |
| `NEXT_PUBLIC_FRONTEND_URL` | フロントエンド URL（OAuth 戻り先） |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API キー |
| `BACKEND_URL` | Vercel のみ。Rewrite 先バックエンド URL |

テンプレート: `.env.local.example` / `.env.production.example`
