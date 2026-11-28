# psy-kit

Le kit de travail de Psyklub pour Claude Code : sessions, état du projet, journal et règles de base.

## What it does

- **À l'ouverture d'une session**, un hook donne à Claude les règles de base, les règles du profil du
  projet (Cloudflare, Notion), `STATE.md`, la dernière entrée de `JOURNAL.md`, une éventuelle session restée
  ouverte et un écart d'identité git. Il ne dit rien hors d'un projet psy-kit (un projet sans
  `STATE.md` à la racine).
- **Skills** :

| Skill | Quand |
|---|---|
| `/psy-kit:start-session` | « on reprend » : repart de STATE.md, note le commit de départ, ouvre l'entrée du journal |
| `/psy-kit:end-session` | « on s'arrête » : bilan, journal, STATE.md réécrit, savoir rangé, commit après oui |
| `/psy-kit:new-project` | crée un projet psy-kit ou l'adopte dans un projet existant |
| `/psy-kit:remember` | « retiens que… » : range un fait au bon endroit |

## Project files

| Fichier | Rôle |
|---|---|
| `CLAUDE.md` | ce qu'est le projet, la stack, la carte des dossiers |
| `STATE.md` | où on en est ; réécrit à chaque fin de session |
| `JOURNAL.md` | une entrée par session, la plus récente en bas |
| `docs/decisions/` | les choix faits, avec les options écartées |
| `.session.json` | la session ouverte (ignoré par git) |

## Notion

Un projet dont le CLAUDE.md a une section `## Notion` reçoit le profil Notion : design validé, idées
et tâches dans Notion (📝 Notes → 💡 Ideas → page officielle, base Tasks), état technique dans le
dépôt. La méthode complète est dans `plugins/psy-kit/rules/notion.md`. Il faut le connecteur Notion
branché dans Claude.

## Install

Depuis GitHub :

```
claude plugin marketplace add Psyklub/psy-kit
claude plugin install psy-kit@psy
```

Pour développer le kit, ajouter plutôt le dossier cloné comme marketplace locale, lue sur place :
`claude plugin marketplace add <chemin du clone>`.

L'identité git attendue se déclare dans `~/.claude/psy-kit/config.json` :

```json
{ "gitEmail": "<adresse>" }
```

## Update

Le plugin est lu sur place : après une modification, `/reload-plugins` ou une nouvelle session.
Monter quand même `version` dans `plugins/psy-kit/.claude-plugin/plugin.json` à chaque changement
livré, pour que le journal et la version disent la même chose.

## Develop

```
node --test "plugins/psy-kit/scripts/test/*.test.js"
claude plugin validate ./plugins/psy-kit
claude plugin validate .
```
