#!/usr/bin/env bash
# Crea un git worktree dedicato per una nuova sessione/task su questo repo.
# Uso: scripts/new-worktree.sh <slug-task>
# Esempio: scripts/new-worktree.sh fix-navbar-mobile

set -euo pipefail

SLUG="${1:-}"
if [ -z "$SLUG" ]; then
  echo "Uso: scripts/new-worktree.sh <slug-task>" >&2
  echo "Esempio: scripts/new-worktree.sh fix-navbar-mobile" >&2
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
WORKTREE_BASE="$(dirname "$REPO_ROOT")/2promo-worktrees"
WORKTREE_PATH="$WORKTREE_BASE/$SLUG"

if [ -e "$WORKTREE_PATH" ]; then
  echo "Esiste già un worktree in $WORKTREE_PATH — scegli un altro slug o rimuovilo prima con:" >&2
  echo "  git worktree remove $WORKTREE_PATH" >&2
  exit 1
fi

mkdir -p "$WORKTREE_BASE"

echo "→ Aggiorno origin/main..."
git -C "$REPO_ROOT" fetch origin

echo "→ Creo worktree in $WORKTREE_PATH sul branch '$SLUG'..."
git -C "$REPO_ROOT" worktree add "$WORKTREE_PATH" -b "$SLUG" origin/main

if [ -f "$REPO_ROOT/.env" ]; then
  echo "→ Copio .env dal repo principale..."
  cp "$REPO_ROOT/.env" "$WORKTREE_PATH/.env"
fi

echo "→ Installo le dipendenze (npm install)..."
(cd "$WORKTREE_PATH" && npm install --silent)

echo ""
echo "Worktree pronto: $WORKTREE_PATH (branch: $SLUG)"
echo "Prossimi passi:"
echo "  cd $WORKTREE_PATH"
echo "  npm run dev -- --port <una-porta-libera>   # o lascia scegliere autoPort"
echo ""
echo "A lavoro finito, da $REPO_ROOT:"
echo "  git push origin $SLUG"
echo "  git checkout main && git pull && git merge $SLUG && git push origin main"
echo "  git worktree remove $WORKTREE_PATH && git branch -d $SLUG"
echo ""
echo "ATTENZIONE deploy da un worktree: 'wrangler pages deploy' rileva il branch git locale"
echo "e lo usa per decidere Production vs Preview. Il branch di questo worktree si chiama"
echo "'$SLUG', non 'main', quindi un deploy lanciato da qui verrebbe taggato Preview e NON"
echo "aggiornerebbe il sito live. Per pubblicare in produzione da un worktree, specifica"
echo "sempre il branch esplicitamente:"
echo "  npx wrangler pages deploy dist --project-name 2promo-landing --branch main"
