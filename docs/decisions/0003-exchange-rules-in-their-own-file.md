# 0003 — La forme des échanges a son propre fichier de règles

- Date: 2026-11-14
- Status: accepted

## Context

La forme des messages à l'auteur (longueur, ordre, questions) vaut dans tous les projets et à chaque message.
Elle tenait en une phrase en tête de `core.md`, sans déclencheur ni vérification, et se perdait dans les longs
comptes rendus.

## Decision

Les règles d'échange vivent dans `rules/exchange.md`, au format des autres règles (Trigger, Action, Check,
Anti-pattern). Le hook d'ouverture les injecte dans une sortie à part (`exchange`), à côté de `rules`,
`profiles` et `state` (décision 0001). But : le moins de texte possible, le plus d'information utile ; le
résultat d'abord, en français normal, 5 à 10 lignes sauf demande de détail.

## Rejected

- Les mettre en tête de `core.md` : moins de code, mais la forme des échanges s'y noie parmi les règles de travail.
- Un style télégraphique (réponses sans articles) : il économise peu (seule la sortie est raccourcie, pas la
  lecture du contexte) [estimate] et se lit moins bien quand il faut décider.

## Consequences

- Une quatrième sortie de hook, plafonnée comme les autres à 9 000 caractères.
- Le CLAUDE.md global de l'auteur porte la même règle pour les projets hors psy-kit.
