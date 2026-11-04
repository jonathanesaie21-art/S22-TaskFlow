# Conventions de développement — TaskFlow

## 1. Langage et technologies

- Utiliser JavaScript.
- Ne pas utiliser TypeScript.
- Utiliser Next.js avec App Router.
- Utiliser React.
- Utiliser Tailwind CSS pour le style.
- Utiliser PostgreSQL pour la base de données.
- Utiliser Auth.js pour l'authentification.

## 2. Conventions de nommage

### Fichiers et dossiers

- Utiliser des noms en minuscules.
- Utiliser le kebab-case pour les fichiers et dossiers lorsque c'est adapté.
- Donner aux composants des noms explicites.
- Éviter les abréviations difficiles à comprendre.

Exemples :

- task-form.jsx
- task-list.jsx
- dashboard-layout.jsx
- auth.config.js

### Variables et fonctions

Utiliser le camelCase.

Exemples :

- userId
- taskList
- createTask()
- getUserTasks()

### Composants React

Utiliser le PascalCase.

Exemples :

- TaskCard
- TaskForm
- DashboardStats

### Constantes

Utiliser le SCREAMING_SNAKE_CASE pour les constantes
qui représentent des valeurs fixes globales.

Exemple :

- TASK_STATUSES
- TASK_PRIORITIES

## 3. Conventions React et Next.js

- Utiliser les composants serveur par défaut.
- Ajouter "use client" uniquement lorsqu'il est nécessaire.
- Ne pas transformer inutilement une page entière en composant client.
- Utiliser les Server Components pour les lectures de données
  lorsque cela est adapté.
- Réserver les composants clients aux interactions qui en ont besoin.
- Utiliser les fonctionnalités natives de Next.js lorsqu'elles
  répondent au besoin.
- Éviter les effets React lorsqu'une solution plus simple existe.

## 4. Organisation du code

Respecter la structure de dossiers définie dans
docs/architecture.md.

Les responsabilités doivent être séparées :

- Les pages organisent les écrans.
- Les composants affichent l'interface.
- Les services portent la logique métier.
- La couche d'accès aux données communique avec la base.
- Les utilitaires regroupent les fonctions réutilisables.

Ne pas placer toute la logique dans les composants d'interface.

## 5. Conventions de base de données

- Utiliser des identifiants UUID.
- Utiliser des clés étrangères pour les relations.
- Définir les contraintes nécessaires.
- Utiliser des noms de colonnes cohérents.
- Éviter les données dupliquées inutilement.
- Utiliser des valeurs contrôlées pour les statuts et priorités.
- Toute tâche doit être associée à un utilisateur.

Les changements de schéma doivent être versionnés
avec des migrations.

## 6. Validation et erreurs

- Valider les données côté serveur.
- Ne jamais considérer la validation du navigateur comme suffisante.
- Retourner des erreurs compréhensibles.
- Ne pas exposer les détails internes ou secrets dans les messages
  destinés à l'utilisateur.
- Gérer les états de chargement, d'erreur et de succès.

## 7. Sécurité

- Ne jamais enregistrer un mot de passe en clair.
- Ne jamais exposer les secrets dans le dépôt Git.
- Utiliser les variables d'environnement.
- Vérifier la session pour les opérations privées.
- Vérifier la propriété des tâches côté serveur.
- Ne pas faire confiance aux identifiants transmis par le client.

## 8. CSS et interface

- Utiliser Tailwind CSS.
- Favoriser les composants réutilisables.
- Éviter les styles dupliqués.
- Concevoir les interfaces en mobile-first.
- Vérifier les affichages sur mobile et ordinateur.
- Prévoir les états vides et les états de chargement.
- Respecter les contrastes et l'accessibilité.

## 9. Git et branches

Branches principales :

- main : version stable.
- develop : intégration du travail de l'équipe.

Branches de travail :

- feature/nom-fonctionnalite
- fix/nom-correction
- chore/nom-tache
- docs/nom-documentation

Exemples :

- feature/auth
- feature/tasks-crud
- feature/dashboard-ui
- chore/project-setup
- docs/readme

Ne pas pousser directement sur main.

Les modifications doivent être intégrées par Pull Request.

## 10. Conventions de commits

Utiliser des messages de commit explicites.

Préfixes recommandés :

- feat: nouvelle fonctionnalité
- fix: correction de bug
- chore: configuration ou maintenance
- docs: documentation
- refactor: réorganisation du code sans changement fonctionnel
- test: ajout ou modification de tests
- style: modification de formatage ou de présentation

Exemples :

- feat: add task creation
- fix: correct task ownership check
- chore: initialize Next.js project
- docs: add project architecture

## 11. Pull Requests

Chaque Pull Request doit :

- Avoir un titre explicite.
- Décrire les changements réalisés.
- Mentionner les issues concernées.
- Indiquer les tests effectués.
- Être relue par un autre membre.
- Éviter de mélanger plusieurs fonctionnalités sans rapport.

## 12. Règle générale

La priorité est de produire un code cohérent, simple,
sécurisé, maintenable et compréhensible par toute l'équipe.

En cas de doute sur une convention, consulter l'équipe
avant d'introduire une nouvelle règle.