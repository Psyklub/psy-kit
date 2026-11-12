# Journal — psy-kit

Une entrée par session, la plus récente en bas.

## 2026-11-12 — création de la v0.1.0

- Cadrage : un kit à soi, simple, à partir de la méthode déjà pratiquée dans les projets DSP
  (CLAUDE.md, puis l'état, puis la dernière entrée du journal ; l'état réécrit à chaque fin de
  session) et de la méthode « petites étapes testables, un commit par étape ».
- Choix de langue : tout le lexique en anglais (fichiers, titres, étiquettes, code, commits), le
  texte en français, la conversation en français.
- Contenu : un hook d'ouverture, quatre skills (start-session, end-session, new-project, remember),
  les règles de base, le profil Cloudflare, des modèles.
- Décisions : règles injectées par le hook plutôt que copiées (0001) ; un commit par étape validée
  (0002).
- Mesure : Claude Code coupe chaque sortie de hook à 10 000 caractères, chaque sortie comptée à part
  [source: code.claude.com/docs/en/hooks.md]. D'où les trois parties du hook (`rules`, `profiles`,
  `state`), chacune plafonnée à 9 000.
- Mesure : une marketplace locale avec une source relative est lue sur place, sans copie dans le
  cache ; `/reload-plugins` suffit après une modification [source: code.claude.com/docs/en/plugins/loading.md].
- Piège : `node --test <dossier>` échoue sous Node 24 ; passer un motif `"…/test/*.test.js"`.
- Réflexe « Tool first » ajouté aux règles : regarder les skills installés, puis find-skills, avant
  une tâche spécialisée ; proposer en une ligne ou se taire.
