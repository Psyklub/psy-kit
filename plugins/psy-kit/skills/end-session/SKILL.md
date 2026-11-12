---
name: end-session
description: Ferme la session en cours d'un projet psy-kit : bilan des changements depuis le départ, entrée de JOURNAL.md close, STATE.md réécrit, savoir appris rangé au bon endroit, commit après validation. À utiliser quand l'auteur dit « on s'arrête », « on ferme », « c'est bon pour aujourd'hui », « fin de session », « on clôt », ou tape /psy-kit:end-session.
---

# End session

Ferme la session avec un seul récapitulatif et une seule validation. Rien n'est écrit ni commité
avant le oui de l'auteur.

## Steps

### 1. Load the session
Lire `.session.json` (sujet, départ, baseline). S'il manque, aucune session n'a été enregistrée :
partir de l'entrée du jour de `JOURNAL.md` et de `git status`, et le dire en une ligne.

### 2. What changed
- `git diff --stat <baseline>` : tout ce qui a changé depuis le départ, commité ou non.
- `git status --short` : les fichiers nouveaux.
- `git log --oneline <baseline>..HEAD` : les commits d'étape de la session.

### 3. Against the plan
Pour chaque étape annoncée à l'ouverture : faite, partielle ou pas faite, avec sa preuve (commit,
fichier, commande lancée et son résultat). En cas de doute, demander plutôt que supposer.

Si du code non trivial a changé, proposer en une ligne une revue avec `/code-review`. Ne pas la
lancer sans oui.

### 4. Draft, don't write yet
- **Journal** : clore l'entrée du jour : ce qui a été fait, les décisions et leur raison, les mesures,
  ce qui a échoué et ce qu'on en retient.
- **STATE.md** : le réécrire entièrement, jamais compléter par le bas. Le paragraphe de tête dit où en
  est le projet ; chaque sujet dit où il en est, ses « Next steps » (la première permet de reprendre
  proprement) et ses « Open questions ». Retirer ce qui est fait. Ajouter les sujets évoqués pendant la
  session mais pas traités, dans le sujet qui les concerne plutôt que dans un nouveau.
- **Knowledge** : pour chaque chose durable apprise, une ligne avec sa destination :

| Ce qu'on a appris | Destination |
|---|---|
| Comment marche une partie du projet, un piège | `docs/<topic>.md` (un doc existant d'abord) |
| Un choix, avec les options écartées | `docs/decisions/NNNN-<slug>.md` (modèle `${CLAUDE_PLUGIN_ROOT}/templates/decision.md`) |
| Une contrainte permanente pour ce projet | `.claude/rules/<name>.md`, au format Trigger / Action / Check / Anti-pattern |
| Une commande non devinable, la carte du projet | `CLAUDE.md` |
| Une préférence de l'auteur valable pour tous ses projets | sa mémoire utilisateur |

Passer aussi en revue les corrections que l'auteur a faites pendant la session sur la façon de
travailler : celles qui doivent changer les sessions suivantes deviennent des candidates.

### 5. One recap, one question
Présenter brièvement le bilan (étape 3) et les brouillons (étape 4), puis une seule question :
tout écrire, choisir, ou ajuster.

### 6. Write and commit
Écrire ce qui est validé. Vérifier l'identité git (si le hook a signalé un écart, le régler d'abord).
Commiter ce qui reste : journal, STATE.md, docs, code non encore commité. Un commit, message en
anglais qui décrit la session. Ne pousser que sur demande explicite ; s'il existe un dépôt distant,
poser la question.

### 7. Close
Supprimer `.session.json`.
