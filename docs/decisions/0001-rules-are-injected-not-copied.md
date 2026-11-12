# 0001 — Les règles du kit sont injectées à l'ouverture, pas copiées dans les projets

- Date: 2026-11-12
- Status: accepted

## Context

Les règles de base doivent s'appliquer dans chaque projet psy-kit, et une amélioration d'une règle
doit atteindre tous les projets sans manipulation.

## Decision

Le hook d'ouverture lit `rules/core.md` et les règles des profils détectés (par exemple
`wrangler.toml` → `cloudflare.md`) directement dans le plugin, et les donne à Claude à chaque session,
y compris après une compaction. Les règles propres à un projet restent dans son `.claude/rules/`.

## Rejected

- Copier les règles dans `.claude/rules/` de chaque projet : les copies divergent, et il faut un
  mécanisme de mise à jour par projet.
- Les mettre dans `~/.claude/rules/` : elles s'appliqueraient aussi aux projets qui ne sont pas des
  projets psy-kit.

## Consequences

- Chaque sortie de hook est plafonnée à 10 000 caractères : le script sort trois parties séparées, et
  `core.md` doit rester court.
- Un projet ne voit pas les règles du kit dans ses fichiers : elles se lisent dans ce dépôt.
