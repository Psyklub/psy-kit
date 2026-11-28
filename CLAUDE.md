# psy-kit

Le kit Claude Code de Psyklub. Ce dépôt est lui-même un projet psy-kit : il se tient avec sa propre
méthode (STATE.md, JOURNAL.md, docs/decisions/).

## How we work

- Ouvrir une session : `/psy-kit:start-session`, ou dire « on reprend ». La fermer : `/psy-kit:end-session`, ou dire « on s'arrête ».
- `STATE.md` : où on en est. Réécrit à chaque fin de session, jamais complété par le bas.
- `JOURNAL.md` : une entrée par session, la plus récente en bas.
- `docs/decisions/` : les choix faits, avec les options écartées. Ne pas re-trancher un choix écrit là.

## Rules for this repository

- **Own words only.** Tout le contenu du kit est écrit ici, avec nos mots et notre code. Ne recopier
  aucun texte ni code d'un autre kit, et ne nommer aucun autre kit ni aucune autre organisation dans
  un fichier suivi par git.
- **Lexicon in English.** Noms de fichiers, dossiers, skills, règles, titres, étiquettes, code et
  commits en anglais. Le texte des docs, des skills et des règles est en français.
- **Stay small.** Ajouter une pièce seulement quand un vrai projet en a besoin. Chaque règle de plus
  dilue les autres : garder `rules/core.md` court.
- **Every hook output under 9,000 characters.** Claude Code coupe chaque sortie de hook à 10 000
  caractères [source: code.claude.com/docs/en/hooks.md]. Le script découpe ses sorties en parties
  (`rules`, `exchange`, `profiles`, `state`) ; un test le vérifie.
- **Hooks never break a session.** Toute erreur est avalée, le code de sortie est toujours 0, et rien
  ne sort hors d'un projet psy-kit.

## Stack

Node (sans dépendance) pour les scripts, Markdown pour les skills, règles et modèles.

```
node --test "plugins/psy-kit/scripts/test/*.test.js"
claude plugin validate ./plugins/psy-kit
claude plugin validate .
```

Le plugin est lu sur place depuis ce dossier : après une modification, `/reload-plugins`. Monter
`version` dans `plugins/psy-kit/.claude-plugin/plugin.json` à chaque changement livré.

## Map

| Chemin | Rôle |
|---|---|
| `.claude-plugin/marketplace.json` | la marketplace locale `psy` |
| `plugins/psy-kit/hooks/hooks.json` | les quatre sorties du hook d'ouverture |
| `plugins/psy-kit/scripts/session-start.js` | le hook d'ouverture ; tests dans `scripts/test/` |
| `plugins/psy-kit/rules/` | `core.md` et `exchange.md` (toujours), un fichier par profil : `cloudflare.md` (fichier wrangler), `notion.md` (section `## Notion` du CLAUDE.md du projet) |
| `plugins/psy-kit/skills/` | start-session, end-session, new-project, remember |
| `plugins/psy-kit/templates/` | modèles de CLAUDE.md, STATE.md, JOURNAL.md, décision |
