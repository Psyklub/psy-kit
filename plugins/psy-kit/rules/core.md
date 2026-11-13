---
title: Core rules
applies: every psy-kit project
---

# Core rules

Ces règles valent dans tout projet psy-kit. Chacune dit quand elle s'applique (Trigger), quoi faire
(Action), comment vérifier qu'elle a été suivie (Check) et l'erreur qu'elle évite (Anti-pattern).

Parler à l'auteur en français, directement : la réponse d'abord, des mots simples, des phrases
courtes. Seule la conversation est en français : les noms (fichiers, dossiers, titres, étiquettes),
le code et les commits sont en anglais (voir « Code in English »).

## Code in English
- **Trigger** : on écrit ou on renomme quoi que ce soit dans le code ou les données : variable, fonction, type, paramètre, entrée de formulaire, champ, clé de config ou de JSON, table et colonne de base, valeur d'enum, route, nom de fichier, commentaire, message de log, commit.
- **Action** : l'écrire en anglais, même quand la conversation, la spec ou le vocabulaire du métier sont en français : traduire le terme (`member`, pas `adherent`). Seul le texte affiché aux utilisateurs suit la langue du projet, et il vit dans des chaînes ou des fichiers de traduction, jamais dans un identifiant. Du français trouvé dans du code existant : le signaler et proposer de le renommer, sans renommer en silence.
- **Check** : aucun identifiant, aucune clé, aucun commentaire en français dans le diff.
- **Anti-pattern** : `dateInscription`, un champ `prenom`, un commentaire `// on vérifie que…`, parce que la discussion se faisait en français.

## Validate before building
- **Trigger** : avant d'écrire du code, de créer un fichier ou de changer une structure, sauf pour une correction triviale demandée explicitement.
- **Action** : présenter l'approche en quelques lignes (ce qui change, pourquoi, ce qui reste à trancher) et attendre un oui.
- **Check** : chaque changement non trivial suit un oui explicite de l'auteur.
- **Anti-pattern** : livrer un travail entier que l'auteur découvre après coup.

## Small steps, one commit each
- **Trigger** : un travail validé comporte plusieurs étapes.
- **Action** : découper en étapes testables. À la fin de chaque étape, dire comment la vérifier ; une fois l'étape validée, la commiter seule. Ne jamais pousser sans demande explicite.
- **Check** : chaque commit correspond à une étape que l'auteur a vue fonctionner.
- **Anti-pattern** : un gros commit qui mélange plusieurs sujets ; commiter avant la validation.

## Open questions belong to the author
- **Trigger** : une question ouverte (section « Open questions » de STATE.md, point « à trancher » d'un doc) bloque ou oriente le travail.
- **Action** : la poser, avec une recommandation. Ne pas la trancher seul, même quand la réponse paraît évidente.
- **Check** : aucune question ouverte n'a disparu sans réponse de l'auteur.
- **Anti-pattern** : trancher en silence en codant une des options.

## Read before changing
- **Trigger** : avant de modifier ou de supprimer du code, et dès qu'une première correction échoue.
- **Action** : lire le vrai code concerné, trouver tous ses appelants et lecteurs, vérifier que chaque fonction, champ ou option d'API citée existe vraiment, dans le code ou dans la doc officielle de la version utilisée.
- **Check** : on peut nommer chaque lecteur touché et la source de chaque API citée.
- **Anti-pattern** : deviner une API de mémoire, puis empiler des rustines quand ça casse.

## A reported bug is real
- **Trigger** : l'auteur signale un bug, par message, capture ou vidéo.
- **Action** : le tenir pour vrai et chercher sa cause. Si le code « a l'air juste », c'est la compréhension du code qui est fausse.
- **Check** : chaque bug signalé reçoit une tentative de correction sur sa cause réelle.
- **Anti-pattern** : répondre « le code semble correct », ou transformer « corrige X » en « ajoute un test sur X ».

## Tests follow the spec
- **Trigger** : un test échoue et on s'apprête à changer sa valeur attendue.
- **Action** : retrouver ce que la spec (brief, décision, règles du jeu) dit de ce comportement. Si le code la contredit, corriger le code. Ne changer le test que s'il contredit lui-même la spec. Sans spec, demander.
- **Check** : toute valeur attendue modifiée renvoie à une ligne de spec.
- **Anti-pattern** : aligner le test sur ce que fait le code pour obtenir du vert.

## Fix at the source
- **Trigger** : un composant partagé (fonction utilitaire, service, store) fait mal son travail à un endroit.
- **Action** : corriger le composant partagé, pas compenser là où le symptôme se voit.
- **Check** : tous les appelants profitent de la correction.
- **Anti-pattern** : une rustine locale qui laisse le défaut en place partout ailleurs.

## Released stays released
- **Trigger** : on veut changer quelque chose de déjà livré ou appliqué : version publiée, migration de base appliquée, règle de jeu imprimée, build envoyé.
- **Action** : créer une nouvelle version, sous un nouveau nom ou numéro. Ne jamais réécrire l'ancienne.
- **Check** : rien de livré n'a changé de contenu sous le même nom.
- **Anti-pattern** : modifier en place une migration appliquée ou une version déjà partagée.

## Tool first
- **Trigger** : au démarrage d'une tâche qui touche un domaine spécialisé (une fois par tâche, pas à chaque message, pas pour le travail courant dans le code du projet).
- **Action** : regarder d'abord les skills installés. Si rien ne convient, chercher avec find-skills en termes génériques, sans jamais mettre un nom de projet dans la requête, puis proposer en une ligne : nom, source, nombre d'installations. Lire un skill avant de l'installer, l'installer au niveau du projet, et seulement après un oui. À la création d'un projet ou quand sa stack change, proposer l'analyse de claude-code-setup. Si rien ne convient, ne rien dire.
- **Check** : une tâche spécialisée a été précédée d'un coup d'œil aux outils ; aucune installation sans oui.
- **Anti-pattern** : refaire à la main ce qu'un skill fait déjà ; un paragraphe pour annoncer qu'on n'a rien trouvé.

## Write for a cold reader
- **Trigger** : on écrit ou modifie un fichier qui sera relu : STATE.md, JOURNAL.md, doc, décision, règle, skill.
- **Action** : écrire ce que le code ne montre pas : le pourquoi, les pièges, comment s'en servir. Aucun reste de conversation (« l'auteur a demandé… », débats de conception). Marquer `[source]` un fait vérifié, avec sa source, et `[estimate]` une estimation ou un souvenir.
- **Check** : un lecteur qui n'a pas vu la conversation comprend chaque ligne.
- **Anti-pattern** : paraphraser le code ; un chiffre sans étiquette ; un doc qui raconte comment il a été écrit.
