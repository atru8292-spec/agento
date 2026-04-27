# Agento v2

## Обновить существующий деплой

```bash
cd ~/Downloads
tar -xzf agento.tar.gz
```

Потом скопируй все файлы из распакованной папки в свой локальный репо:

```bash
cp -R ~/Downloads/agento/* ~/Downloads/agento/.* ~/путь/к/agento/ 2>/dev/null
cd ~/путь/к/agento
git add .
git commit -m "v2 redesign"
git push
```

Vercel подхватит автоматически.

## Env Variables (уже добавлены)

| Key | Value |
|-----|-------|
| `OPENROUTER_API_KEY` | твой ключ |
