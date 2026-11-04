# AGENTS.md — Instructions pour les agents IA

## 1. Rôle de l'agent

Tu interviens en tant qu'assistant de développement sur le projet TaskFlow.

Tu dois aider l'équipe à concevoir, développer, corriger, tester et améliorer
l'application tout en respectant les décisions techniques et fonctionnelles
définies dans la documentation.

Tu ne dois pas prendre de décisions importantes concernant l'architecture
ou le périmètre fonctionnel sans justification et validation de l'équipe.

## 2. Contexte du projet

TaskFlow est une application web de gestion personnelle des tâches.

Elle permet aux utilisateurs de :
- Créer un compte et se connecter.
- Consulter leurs tâches.
- Créer de nouvelles tâches.
- Modifier et supprimer leurs tâches.
- Suivre l'avancement de leurs tâches.
- Définir une priorité et une échéance.
- Consulter des statistiques sur leurs tâches.

Chaque utilisateur possède un espace personnel et ne peut accéder
qu'à ses propres données.

Pour comprendre le projet, consulter :
- docs/vision.md
- docs/architecture.md
- docs/database.md
- docs/conventions.md

## 3. Technologies imposées

Les technologies retenues pour le projet sont :

- Next.js avec App Router
- JavaScript (pas TypeScript)
- React
- Tailwind CSS
- PostgreSQL
- Auth.js pour l'authentification
- Vercel pour le déploiement

Ne remplace pas une technologie par une autre sans validation de l'équipe.

N'ajoute pas de dépendance inutile.

## 4. Fonctionnalités principales

L'application comporte les pages principales suivantes :

- `/` : page d'accueil publique.
- `/guide` : guide d'utilisation public.
- `/dashboard` : espace privé de l'utilisateur.

Le dashboard comporte deux espaces distincts :

1. Statistiques
2. Gestion des tâches

### Gestion des tâches

Un utilisateur authentifié doit pouvoir :

- Consulter ses tâches.
- Créer une tâche.
- Modifier une tâche.
- Supprimer une tâche.
- Changer le statut d'une tâche.
- Filtrer ses tâches.

La création et la modification utilisent des modals.

Cliquer sur une tâche permet d'ouvrir le modal de modification
avec les informations déjà renseignées.

La suppression doit demander une confirmation.

### Statuts des tâches

Les statuts autorisés sont :

- TODO : À faire
- IN_PROGRESS : En cours
- DONE : Terminé

### Priorités

Les priorités autorisées sont :

- LOW : Basse
- MEDIUM : Moyenne
- HIGH : Haute

## 5. Règles d'architecture

- Utiliser les fonctionnalités de Next.js App Router.
- Utiliser les composants serveur par défaut.
- Utiliser "use client" uniquement lorsqu'une interaction côté
  navigateur le nécessite.
- Éviter de mélanger la logique métier et la présentation.
- Centraliser les accès aux données.
- Réutiliser les composants lorsqu'ils ont une responsabilité commune.
- Respecter la structure de dossiers déjà mise en place.
- Ne pas créer plusieurs implémentations d'une même fonctionnalité.

Ne déplace pas ou ne renomme pas des fichiers existants sans raison valable.

## 6. Sécurité

La sécurité des données est une priorité.

- Ne jamais exposer les secrets ou les variables d'environnement.
- Ne jamais écrire de mot de passe en clair dans la base de données.
- Utiliser Auth.js pour récupérer et vérifier la session utilisateur.
- Protéger les pages et opérations privées.
- Vérifier côté serveur que chaque tâche appartient à l'utilisateur connecté.
- Ne jamais faire confiance à un userId fourni uniquement par le client.
- Valider les données reçues côté serveur.
- Ne jamais retourner les informations sensibles d'un utilisateur.

## 7. Règles de développement

Avant de modifier le code :

1. Examiner la structure du projet.
2. Lire les fichiers de documentation pertinents.
3. Comprendre le fonctionnement actuel.
4. Identifier les fichiers concernés.
5. Expliquer brièvement l'approche proposée si la modification est importante.

Pendant le développement :

- Écrire du code simple, lisible et maintenable.
- Éviter la duplication.
- Respecter les conventions du projet.
- Ne pas modifier des fonctionnalités sans rapport avec la demande.
- Ne pas supprimer du code existant sans justification.
- Ne pas ajouter de fonctionnalités non demandées.
- Ne pas inventer de fichiers, fonctions ou dépendances déjà supposés exister.

## 8. Gestion des erreurs et validation

- Prévoir des validations cohérentes côté client et côté serveur.
- Afficher des messages d'erreur compréhensibles.
- Gérer les états de chargement.
- Gérer les listes vides.
- Gérer les erreurs de connexion à la base de données.
- Ne pas masquer silencieusement les erreurs importantes.

## 9. Stratégies de rendu

Les stratégies de rendu font partie des exigences du projet :

- Accueil `/` : SSG.
- Guide `/guide` : ISR.
- Dashboard `/dashboard` : SSR ou rendu dynamique côté serveur.

Le dashboard contient des données personnelles.
Ne jamais mettre en cache ces données d'une manière qui pourrait
les exposer à un autre utilisateur.

Toute modification de ces choix doit être justifiée et documentée.

## 10. Tests et vérifications

Après une modification :

- Vérifier que le code ne contient pas d'erreur évidente.
- Exécuter les commandes de vérification disponibles.
- Exécuter les tests concernés lorsqu'ils existent.
- Vérifier les parcours fonctionnels affectés.
- Signaler les vérifications qui n'ont pas pu être effectuées.

Ne prétends jamais qu'un test a réussi s'il n'a pas été exécuté.

## 11. Méthode de collaboration

Le projet est développé par une équipe de cinq personnes.

- Respecter le travail des autres membres.
- Ne pas modifier arbitrairement le travail d'une autre branche.
- Limiter les modifications aux fichiers nécessaires.
- Préserver la compatibilité avec le code existant.
- Signaler les conflits potentiels avant de modifier une partie partagée.

Les fonctionnalités sont développées sur des branches dédiées
et intégrées par Pull Request.

## 12. Communication avec l'équipe

Lorsque tu proposes une modification importante :

1. Expliquer le problème.
2. Présenter la solution proposée.
3. Identifier les fichiers concernés.
4. Signaler les éventuelles conséquences.
5. Attendre une validation si la décision modifie l'architecture
   ou le périmètre fonctionnel.

Privilégier des explications pédagogiques et progressives.

L'objectif est de produire une application fonctionnelle,
sécurisée, cohérente et facile à maintenir.