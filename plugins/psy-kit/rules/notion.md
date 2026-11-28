---
title: Notion profile
applies: projects whose CLAUDE.md has a "## Notion" section (where the project lives in Notion, its subjects)
---

# Notion profile

Règles en plus des Core rules pour un projet dont le design, les idées et les tâches vivent dans
Notion. Notion porte ce qui est décidé et ce qui reste à faire ; le dépôt garde l'état technique
(STATE.md, JOURNAL.md, `docs/decisions/`). La section `## Notion` du CLAUDE.md dit où est la page
racine du projet et quels sont ses sujets. Claude lit et écrit Notion par le connecteur Notion ; s'il
n'est pas branché, le dire en une ligne au premier besoin.

Trois niveaux, et le chemin d'une entrée : **📝 Notes → 💡 Ideas → page officielle**.

| Niveau | Où | Ce que c'est |
|---|---|---|
| 📝 Notes | Sujet / Ideas / Notes | Entrée brute, pas encore validée. |
| 💡 Ideas | Sujet / Ideas | Validé, pas encore réécrit dans la page officielle. |
| Page officielle | La page du sujet | Ce qui est décidé ; on peut construire dessus. |

Structure d'un projet :
- **Page racine** : « In short », puis 📝 Notes et 💡 Ideas, la liste des sujets, la base Tasks, le lien vers le brouillon.
- **Une page officielle par grand sujet** : « In short », puis le contenu validé. Une seule sous-page, 💡 Ideas, qui contient la sous-page 📝 Notes.
- **Racine / 📝 Notes** : une zone « Inbox » pour écrire vite sans sujet, puis les Notes de chaque sujet. **Racine / 💡 Ideas** : les Ideas de chaque sujet. Ce sont des blocs synchronisés : écrire à la racine ou dans le sujet revient au même.
- **Base Tasks** : sujet, statut (Backlog, This week, In progress, Done), taille (S, M, L), type.
- **Page « (brouillon) »** : l'ancien contenu gardé tel quel, vidé au fil du rangement.

## Read the subject before coding
- **Trigger** : on va coder, régler ou dessiner quelque chose qui touche un sujet du projet.
- **Action** : lire la page officielle du sujet et ses 💡 Ideas. Construire sur la page officielle ; une idée de Ideas se signale, elle ne s'applique pas sans oui. Une contradiction entre Notion et le code se tranche avec l'auteur, puis s'écrit dans la page officielle.
- **Check** : chaque fonctionnalité commencée suit une lecture de sa page.
- **Anti-pattern** : coder de mémoire une règle que la page a changée depuis.

## Tasks follow the work
- **Trigger** : une tâche de la base Tasks est commencée, livrée, ou un travail nouveau apparaît.
- **Action** : passer la tâche en In progress au départ et en Done une fois commitée et testée. Un travail découvert en route devient une tâche (sujet, taille, statut Backlog) plutôt qu'une ligne dans le dépôt. Ne pas toucher aux tâches qu'une autre session a en cours.
- **Check** : la base Tasks et le dépôt disent la même chose à la fin de la session.
- **Anti-pattern** : un BACKLOG.md ou une liste TODO dans le dépôt à côté de la base Tasks.

## Notes in, pages out
- **Trigger** : l'auteur donne une idée, un retour ou une décision à garder pour le design.
- **Action** : une idée brute va dans 📝 Notes (Inbox si le sujet n'est pas clair) ; une idée validée par l'auteur va dans 💡 Ideas ; ce qui est décidé et rangé est réécrit dans la page officielle. Une page officielle dit ce qui est vrai maintenant : la réécrire, ne pas l'allonger par le bas. Un choix technique avec options écartées va dans `docs/decisions/`, pas dans Notion.
- **Check** : chaque entrée écrite dans Notion est au niveau qui correspond à son statut.
- **Anti-pattern** : écrire directement dans la page officielle une idée que l'auteur n'a pas validée ; créer une base de données pour des notes.

## Filing routine
- **Trigger** : l'auteur demande de ranger les notes, ou l'Inbox déborde.
- **Action** : avec l'auteur, dans l'ordre : répartir l'Inbox dans les Notes des sujets ; pour chaque note, la valider (vers Ideas), l'écarter ou la laisser ; réécrire chaque idée dans la page officielle puis la retirer de Ideas ; ce qui demande du travail devient une tâche. Rien n'est supprimé du brouillon tant que ce n'est pas rangé. Présenter les notes en liste numérotée pour que l'auteur réponde par numéros.
- **Check** : rien n'a été validé, écarté ou supprimé sans l'auteur.
- **Anti-pattern** : trancher en silence entre une note et une page.

## New subject
- **Trigger** : un nouveau grand sujet apparaît.
- **Action** : créer la page du sujet avec « In short », sa sous-page 💡 Ideas et, dedans, 📝 Notes, puis l'ajouter à la section `## Notion` du CLAUDE.md. Les blocs synchronisés se relient à la main dans Notion (copier le bloc, « Paste and sync » dans Racine / Notes et Racine / Ideas sous un titre au nom du sujet) : si le connecteur ne sait pas le faire, le demander à l'auteur en une ligne.
- **Check** : chaque sujet a ses deux sous-pages et figure à la racine.
- **Anti-pattern** : un sujet sans Ideas ni Notes, dont les idées finissent dans la page officielle.

Écriture dans Notion : titres, noms de pages, propriétés et étiquettes en anglais ; texte en français.
Une carte, une règle ou un objet se décrit d'abord par son effet, le nom vient après.
