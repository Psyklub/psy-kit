# 0002 — Un commit par étape validée, plus un commit de clôture

- Date: 2026-11-12
- Status: accepted

## Context

Il faut choisir quand le travail d'une session est commité.

## Decision

Chaque étape testable est commitée seule, une fois que l'auteur l'a validée. `end-session` commite
ce qui reste : journal, STATE.md, docs rangées, code pas encore commité. On ne pousse que sur demande
explicite.

## Rejected

- Un seul commit en fin de session : une session longue donne un commit énorme et mélangé, et un
  arrêt brutal laisse tout le travail hors de git.

## Consequences

- `end-session` mesure la session avec `git diff <baseline>`, qui couvre à la fois les commits d'étape
  et ce qui n'est pas encore commité.
