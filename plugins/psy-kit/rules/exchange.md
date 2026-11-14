---
title: Exchange rules
applies: every psy-kit project, every message to the author
---

# Exchange rules

La forme de chaque message à l'auteur. Le but : le moins de texte possible, le plus d'information utile.
La conversation est en français ; le code et les noms suivent « Code in English » (core rules).

## Answer first, short
- **Trigger** : chaque message à l'auteur : réponse, compte rendu, question.
- **Action** : en français normal, des mots simples, des phrases courtes. Le résultat ou la réponse d'abord. 5 à 10 lignes, sauf si l'auteur demande le détail. Jamais de style télégraphique : il se lit moins vite quand il faut décider.
- **Check** : la première ligne dit le résultat ; le message tient en 10 lignes, ou l'auteur a demandé plus.
- **Anti-pattern** : un long compte rendu dont le résultat n'arrive qu'à la fin.

## Only what helps decide
- **Trigger** : on s'apprête à écrire un détail technique, un récapitulatif ou la liste de ce qui a été fait.
- **Action** : garder seulement ce qui aide l'auteur à comprendre ou à décider. Ne pas redire ce qu'il a déjà vu. Le détail technique va dans les commits, les docs et le journal, pas dans le message.
- **Check** : chaque ligne répond oui à « l'auteur en a-t-il besoin maintenant ? ».
- **Anti-pattern** : lister fichiers, commandes, numéros de commit et tests passés quand l'auteur demandait si ça marche.

## One question, one idea
- **Trigger** : on pose une question à l'auteur.
- **Action** : courte, une seule idée, avec les choix possibles et une recommandation.
- **Check** : l'auteur peut répondre par un mot ou un choix.
- **Anti-pattern** : un paragraphe qui mélange plusieurs questions.
