---
name: start-session
description: Ouvre une session de travail dans un projet psy-kit (un projet avec un STATE.md à la racine) : reprend là où STATE.md le dit, note le commit de départ, ouvre l'entrée du jour dans JOURNAL.md. À utiliser quand l'auteur dit « on commence », « on reprend », « on continue », « nouvelle session », « on bosse sur… », ou tape /psy-kit:start-session [sujet].
---

# Start session

Ouvre une session sans rien faire retaper à l'auteur. La session se ferme avec `end-session`.

## Steps

### 1. Context
Le hook d'ouverture a déjà fourni les règles, STATE.md et la dernière entrée de JOURNAL.md. S'ils
manquent (hook inactif), lire soi-même `CLAUDE.md`, `STATE.md`, puis la dernière entrée de `JOURNAL.md`.
Trois lectures, pas plus.

Pas de `STATE.md` à la racine : ce n'est pas un projet psy-kit. Le dire en une ligne et proposer
`/psy-kit:new-project`.

### 2. Session already open?
Si `.session.json` existe à la racine, une session précédente n'a pas été fermée. Le dire en une ligne
(sujet, date) et demander : la continuer, ou la fermer d'abord avec `end-session`.

### 3. Subject
- Sujet donné en argument ou dans le message : le prendre.
- Sinon, s'appuyer sur STATE.md : une seule suite évidente, la proposer ; plusieurs sujets, poser une
  question (AskUserQuestion) avec une option par sujet, sa première étape en description, plus
  « Autre chose ».
- Ne jamais demander à l'auteur de redécrire ce que STATE.md dit déjà.

### 4. Where we are
En cinq lignes au plus : où en est le sujet, et la première étape. Signaler les « Open questions »
qui la bloquent.

### 5. Tool first
Appliquer la règle Tool first : si la tâche touche un domaine spécialisé, regarder les skills
installés, puis find-skills. Proposer en une ligne, ou ne rien dire.

### 6. Record the session
Écrire `.session.json` à la racine :

```json
{ "subject": "<sujet>", "started": "<ISO 8601>", "baseline": "<git rev-parse HEAD, ou null sans commit>" }
```

Vérifier que `.gitignore` contient `.session.json` ; sinon, l'ajouter et le signaler.

### 7. Journal entry
Si aucune entrée du jour n'existe pour ce sujet, ajouter à la fin de `JOURNAL.md` :
`## YYYY-MM-DD — <sujet>`. Pendant la session, y noter au fil de l'eau les décisions et leur raison,
les mesures, les surprises.

### 8. Work
Suivre les Core rules : valider avant de construire, petites étapes, un commit par étape validée.
