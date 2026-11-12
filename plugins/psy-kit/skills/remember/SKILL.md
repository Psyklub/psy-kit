---
name: remember
description: Range un fait, une règle ou une préférence au bon endroit d'un projet psy-kit, après accord de l'auteur. À utiliser quand l'auteur dit « retiens que… », « note que… », « souviens-toi que… », « à partir de maintenant… », « désormais… », ou tape /psy-kit:remember <fait>.
---

# Remember

Fait atterrir une connaissance là où la prochaine session la trouvera. Rien n'est écrit sans oui.

## Steps

### 1. Work in flight
Si l'auteur interrompt un travail en cours pour donner ce fait, c'est souvent une correction.
Dire en une ligne si le travail en cours respecte le fait ; s'il le contredit, le corriger avant de
reprendre.

### 2. Find the home

| Le fait est… | Destination |
|---|---|
| Où en est un sujet, une prochaine étape, une question ouverte | `STATE.md` |
| Comment marche une partie du projet, un piège | `docs/<topic>.md` |
| Un choix avec les options écartées | `docs/decisions/NNNN-<slug>.md` |
| Une contrainte permanente pour ce projet | `.claude/rules/<name>.md` (Trigger / Action / Check / Anti-pattern) |
| Une commande non devinable, la carte du projet | `CLAUDE.md` |
| Une préférence valable pour tous les projets de l'auteur | sa mémoire utilisateur |

Chercher d'abord un endroit existant qui en parle déjà (grep) : compléter plutôt que créer.

### 3. Show, then write
Présenter :
```
Fact: <le fait, en une ligne>
Home: <fichier> (existant ou nouveau)
Text: <le texte exact qui sera écrit>
```
Attendre le oui, puis écrire. Marquer `[source]` un fait vérifié, avec sa source, et `[estimate]`
une estimation. Pas de commit séparé : le changement part avec le prochain commit d'étape ou à
`end-session`.
