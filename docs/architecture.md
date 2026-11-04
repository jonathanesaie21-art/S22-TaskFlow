# Architecture technique — TaskFlow

## 1. Stack technique

Le projet utilise :

- Next.js avec App Router.
- JavaScript.
- React.
- Tailwind CSS.
- PostgreSQL.
- Auth.js.
- Vercel.

## 2. Architecture générale

TaskFlow est une application Next.js organisée autour de
trois responsabilités principales :

1. Présentation : pages et composants React.
2. Logique métier : traitements liés aux utilisateurs et aux tâches.
3. Accès aux données : communication avec PostgreSQL.

Les opérations sensibles doivent être exécutées côté serveur.

## 3. Pages principales

### Page d'accueil

Route : `/`

- Page publique.
- Présente l'application.
- Contient les actions de connexion et d'inscription.
- Les formulaires d'authentification s'affichent dans des modals.
- Stratégie de rendu : SSG.

### Guide

Route : `/guide`

- Page publique.
- Présente le fonctionnement de TaskFlow.
- Accessible depuis l'accueil et le dashboard.
- Stratégie de rendu : ISR.

### Dashboard

Route : `/dashboard`

- Page privée.
- Accessible uniquement aux utilisateurs authentifiés.
- Dépend de la session de l'utilisateur.
- Stratégie de rendu : SSR ou rendu dynamique côté serveur.

Le dashboard comporte deux espaces :

#### Statistiques

Affiche les indicateurs concernant les tâches de l'utilisateur :

- Nombre total de tâches.
- Nombre de tâches à faire.
- Nombre de tâches en cours.
- Nombre de tâches terminées.
- Nombre de tâches en retard, si pertinent.

#### Gestion des tâches

Contient :

- La liste des tâches.
- Les filtres.
- Le bouton de création.
- Les actions de modification et de suppression.

La création et la modification utilisent des modals.
La suppression utilise une confirmation.

## 4. Authentification

Auth.js est utilisé pour gérer l'authentification.

Les fonctionnalités attendues :

- Inscription.
- Connexion.
- Gestion de session.
- Déconnexion.
- Protection des pages privées.

Après une inscription réussie, l'utilisateur doit être
automatiquement authentifié et redirigé vers `/dashboard`.

Après une connexion réussie, l'utilisateur est également
redirigé vers `/dashboard`.

La connexion avec Google peut être ajoutée si le temps
et le périmètre du projet le permettent.

Les mots de passe doivent être stockés sous forme de hash
et jamais en clair.

## 5. Gestion des tâches

Les opérations liées aux tâches doivent être effectuées
côté serveur.

Les opérations principales sont :

- Récupérer les tâches de l'utilisateur connecté.
- Créer une tâche.
- Modifier une tâche.
- Changer son statut.
- Supprimer une tâche.

Chaque opération doit vérifier que la tâche appartient
à l'utilisateur connecté.

Les statistiques doivent être calculées à partir des tâches
de l'utilisateur authentifié.

## 6. Stratégies de rendu

Les stratégies de rendu sont une exigence du livrable.

| Page | Stratégie | Justification |
|---|---|---|
| `/` | SSG | Le contenu de présentation est relativement stable. |
| `/guide` | ISR | Le guide est public et peut être régénéré périodiquement. |
| `/dashboard` | SSR / rendu dynamique | Les données dépendent de la session et de l'utilisateur. |

Les données privées du dashboard ne doivent pas être mises
en cache de manière partagée entre utilisateurs.

La configuration réelle doit être vérifiée dans le code
et expliquée dans le README.

## 7. Structure indicative des dossiers

La structure exacte pourra évoluer, mais les responsabilités
doivent rester séparées.

src/
  app/
    page.js
    layout.js
    guide/
      page.js
    dashboard/
      page.js
    api/
  components/
    ui/
    auth/
    dashboard/
    tasks/
  services/
    auth.service.js
    task.service.js
  lib/
    db.js
    utils.js
  config/
  styles/

Cette structure est indicative.

Ne crée pas tous ces dossiers ou fichiers artificiellement.
Ajoute-les lorsque les fonctionnalités correspondantes
sont réellement développées.

## 8. Communication avec la base de données

PostgreSQL est utilisé pour stocker les utilisateurs et les tâches.

Les accès à la base doivent être centralisés dans une couche
d'accès aux données.

Les composants d'interface ne doivent pas contenir directement
les requêtes SQL.

Le choix définitif de la bibliothèque ou de l'outil d'accès
à PostgreSQL doit être cohérent avec les dépendances du projet
et validé par l'équipe.

## 9. Gestion des données privées

Toutes les opérations privées doivent utiliser l'identité
issue de la session Auth.js.

Le serveur doit vérifier :

- Que l'utilisateur est authentifié.
- Que la tâche existe.
- Que la tâche appartient à cet utilisateur.

Un utilisateur ne doit jamais pouvoir accéder aux tâches
d'un autre utilisateur en modifiant un identifiant dans
une requête.

## 10. Déploiement

L'application est déployée sur Vercel.

Les variables d'environnement nécessaires doivent être
configurées dans l'environnement de déploiement.

Aucun secret ne doit être présent dans le dépôt Git.

La base PostgreSQL de production doit être accessible
depuis l'application déployée.