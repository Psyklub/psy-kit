---
title: Cloudflare profile
applies: projects with a wrangler.toml, wrangler.json or wrangler.jsonc at the root or one level down
---

# Cloudflare profile

Règles en plus des Core rules pour un projet Cloudflare Workers en TypeScript.

## Secrets never in the repo
- **Trigger** : une clé, un jeton, un mot de passe ou un identifiant de compte apparaît.
- **Action** : en local, le mettre dans `.dev.vars` (ignoré par git) ; en production, passer par `wrangler secret put`. Jamais dans les `vars` de la config wrangler, ni dans le code, ni dans un commit.
- **Check** : `.dev.vars` est dans `.gitignore` ; le diff ne contient aucun secret.
- **Anti-pattern** : une clé « temporaire » commitée.

## D1 migrations are append-only
- **Trigger** : le schéma de la base change.
- **Action** : créer une nouvelle migration (`wrangler d1 migrations create <db> <name>`) et l'appliquer d'abord en local (`wrangler d1 migrations apply <db> --local`). Une migration déjà appliquée ne se modifie jamais.
- **Check** : aucun fichier de migration existant ne change dans le diff.
- **Anti-pattern** : éditer une ancienne migration pour « corriger » le schéma.

## Prove it locally
- **Trigger** : avant d'annoncer qu'une fonctionnalité marche.
- **Action** : la faire tourner (`wrangler dev`, les tests) et regarder la vraie réponse. Régénérer les types des bindings (`wrangler types`) quand la config wrangler change.
- **Check** : chaque « ça marche » s'appuie sur une commande lancée pendant la session et sur son résultat.
- **Anti-pattern** : conclure à la seule lecture du code.

## Production needs a yes
- **Trigger** : toute commande qui touche la production : `wrangler deploy`, `wrangler secret put`, une commande d1 avec `--remote`, un changement de DNS ou de routes.
- **Action** : dire précisément ce qui va changer, puis attendre un oui explicite pour cette commande-là. Un oui précédent ne vaut pas pour la suivante.
- **Check** : chaque action sur la production suit un oui donné pour elle.
- **Anti-pattern** : déployer « pour tester ».

## Watch the bill
- **Trigger** : on ajoute une tâche planifiée (cron), une boucle sur des données, un appel à l'API Claude ou un stockage qui grossit.
- **Action** : estimer le volume (appels par jour, taille stockée) et donner en une ligne l'ordre de grandeur du coût, marqué `[estimate]`. Prévoir une limite : plafond, pagination ou quota.
- **Check** : chaque traitement récurrent a une limite écrite.
- **Anti-pattern** : un cron sans plafond qui appelle une API payante.
