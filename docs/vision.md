# Vision du produit — TaskFlow

## 1. Présentation

TaskFlow est une application web de gestion personnelle des tâches.

Elle permet à chaque utilisateur d'organiser son travail, de suivre
l'avancement de ses activités et de consulter une vue synthétique
de ses tâches.

L'application doit être simple à comprendre, agréable à utiliser
et adaptée aux ordinateurs comme aux appareils mobiles.

## 2. Problématique

Les utilisateurs ont souvent plusieurs tâches à réaliser et peuvent
avoir des difficultés à organiser leurs priorités, à suivre leur
avancement et à respecter leurs échéances.

TaskFlow apporte une solution centralisée pour organiser ces tâches
et visualiser leur état d'avancement.

## 3. Objectifs

Les objectifs de TaskFlow sont :

- Permettre à un utilisateur de disposer d'un compte personnel.
- Centraliser ses tâches dans un espace privé.
- Faciliter la création et la modification des tâches.
- Permettre le suivi de l'état d'avancement.
- Définir une priorité pour chaque tâche.
- Ajouter une échéance lorsque cela est nécessaire.
- Fournir des statistiques simples sur l'activité de l'utilisateur.

## 4. Utilisateurs cibles

TaskFlow s'adresse aux personnes qui souhaitent mieux organiser
leurs activités personnelles, scolaires ou professionnelles.

Chaque utilisateur dispose de son propre espace de travail.

La version actuelle est destinée à un usage individuel.
Elle ne constitue pas une plateforme collaborative.

## 5. Fonctionnalités

### 5.1 Authentification

L'utilisateur doit pouvoir :

- Créer un compte.
- Se connecter.
- Conserver une session authentifiée.
- Se déconnecter.

L'authentification est gérée avec Auth.js.

Après une inscription réussie, l'utilisateur est automatiquement
connecté et redirigé vers son dashboard.

### 5.2 Gestion des tâches

L'utilisateur doit pouvoir :

- Consulter la liste de ses tâches.
- Ajouter une nouvelle tâche.
- Modifier une tâche existante.
- Supprimer une tâche.
- Changer le statut d'une tâche.
- Filtrer les tâches selon leur statut et leur priorité.

Les formulaires de création et de modification sont présentés
dans des modals.

Cliquer sur une tâche ouvre son formulaire de modification.

La suppression nécessite une confirmation.

### 5.3 Informations d'une tâche

Une tâche contient les informations suivantes :

- Un titre obligatoire.
- Une description facultative.
- Un statut.
- Une priorité.
- Une date limite facultative.
- Une date de création.
- Une date de dernière modification.

### 5.4 Statuts

Une tâche peut avoir l'un des statuts suivants :

- À faire
- En cours
- Terminé

### 5.5 Priorités

Une tâche peut avoir l'une des priorités suivantes :

- Basse
- Moyenne
- Haute

### 5.6 Statistiques

Le dashboard possède un espace dédié aux statistiques.

Il permet notamment de consulter :

- Le nombre total de tâches.
- Le nombre de tâches à faire.
- Le nombre de tâches en cours.
- Le nombre de tâches terminées.
- Le nombre de tâches en retard, lorsque cela est pertinent.

Les statistiques doivent refléter les données réelles de l'utilisateur.

## 6. Organisation de l'application

L'application comporte trois pages principales :

### Accueil — `/`

Page publique qui présente TaskFlow.

Elle propose les actions :
- Se connecter.
- Créer un compte.
- Consulter le guide.

Les formulaires de connexion et d'inscription s'ouvrent dans des modals.

### Guide — `/guide`

Page publique qui explique comment utiliser TaskFlow.

Elle est accessible depuis la page d'accueil et depuis le dashboard.

### Dashboard — `/dashboard`

Espace privé accessible uniquement après authentification.

Il comporte deux espaces :

- Statistiques.
- Gestion des tâches.

L'espace Gestion des tâches contient les actions de création,
modification et suppression.

## 7. Expérience utilisateur

TaskFlow doit proposer une interface :

- Simple et intuitive.
- Responsive.
- Cohérente entre les différentes pages.
- Facile à utiliser sur mobile et ordinateur.

Sur ordinateur, les modals sont centrés.

Sur mobile, ils peuvent être présentés sous forme de bottom sheets.

Les actions importantes doivent fournir un retour visuel
à l'utilisateur.

## 8. Hors périmètre

Les fonctionnalités suivantes ne sont pas prévues dans le MVP :

- Gestion collaborative des tâches.
- Partage de tâches entre utilisateurs.
- Chat ou messagerie.
- Paiements.
- Application mobile native.
- Automatisations complexes.
- Gestion avancée de projets.
- Calendrier avancé.

Toute nouvelle fonctionnalité doit être validée par l'équipe
avant d'être ajoutée au périmètre.