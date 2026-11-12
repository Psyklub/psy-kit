---
name: new-project
description: Crée un projet psy-kit ou adopte psy-kit dans un projet existant : CLAUDE.md, STATE.md, JOURNAL.md, docs/decisions/, .gitignore, dépôt git avec la bonne identité, isolation des autres kits de session, puis proposition d'automatisations. À utiliser quand l'auteur dit « nouveau projet », « on crée le dépôt de… », « adopte psy-kit ici », ou tape /psy-kit:new-project [nom].
---

# New project

Rien n'est créé avant que l'auteur ait vu la liste des fichiers et dit oui.

## Steps

### 1. Where, and new or existing
Dossier cible : en argument, sinon le demander. S'il contient déjà des fichiers, c'est une adoption :
lire d'abord l'existant (CLAUDE.md, README, docs, structure) et proposer ce que chaque fichier psy-kit
reprendra. On ne déplace ni ne supprime rien sans oui.

### 2. Ask what is missing
Nom, description en une phrase, stack (TypeScript / Cloudflare, Unity, jeu de société, autre).
Ne pas redemander ce qui est déjà connu.

### 3. Show the plan
La liste exacte des fichiers à créer ou modifier, puis attendre le oui.

### 4. Create the files
À partir des modèles de `${CLAUDE_PLUGIN_ROOT}/templates/`, remplis avec ce qu'on sait déjà :
- `CLAUDE.md` : description, stack et commandes, carte des dossiers.
- `STATE.md` : un premier sujet et sa première étape.
- `JOURNAL.md` : première entrée datée d'aujourd'hui, la création du projet.
- `docs/decisions/` : avec un `.gitkeep` ; une première décision seulement si un choix de fond a été fait.

### 5. .gitignore
Ce que la stack demande, plus toujours :
```
.session.json
.claude/settings.local.json
```
Pour Cloudflare, aussi : `.dev.vars`, `.wrangler/`, `node_modules/`.

### 6. Git and identity
`git init` si besoin. Lire l'identité attendue dans `~/.claude/psy-kit/config.json` (`gitEmail`).
Si `git config user.email` du dépôt diffère, proposer de la poser localement
(`git config user.email …`, `git config user.name …`). Premier commit après oui.

### 7. Keep other session kits out
Lire `enabledPlugins` dans `~/.claude/settings.json`. Si un autre plugin activé fournit lui aussi des
skills de session (start-session, end-session…), proposer de le désactiver dans ce projet seulement,
via `.claude/settings.local.json` :
```json
{ "enabledPlugins": { "<plugin>@<marketplace>": false } }
```
Ce fichier n'est jamais commité : le nom d'un autre kit ne doit apparaître dans aucun fichier suivi
par git.

### 8. Automations
Proposer en une ligne l'analyse en lecture seule de claude-code-setup (claude-automation-recommender)
pour suggérer hooks, agents et serveurs MCP adaptés à la stack.

### 9. Next
Proposer d'ouvrir la première session avec `/psy-kit:start-session`.
