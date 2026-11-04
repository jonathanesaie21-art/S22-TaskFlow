# Base de données — TaskFlow

## 1. Système de gestion

La base de données du projet utilise PostgreSQL.

Elle contient deux tables principales :

- users
- tasks

La relation entre ces deux tables permet à chaque utilisateur
de posséder plusieurs tâches.

## 2. Table users

Cette table contient les informations des utilisateurs.

| Colonne | Type PostgreSQL | Contraintes |
|---|---|---|
| id | UUID | PRIMARY KEY |
| nom | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | TEXT | NULL |
| google_id | VARCHAR(255) | UNIQUE, NULL |
| image | TEXT | NULL |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

### Explications

- id : identifiant unique de l'utilisateur.
- nom : nom de l'utilisateur.
- email : adresse email unique.
- password_hash : hash du mot de passe lorsque l'utilisateur
  utilise une authentification par email et mot de passe.
- google_id : identifiant Google lorsque l'utilisateur utilise
  la connexion Google.
- image : URL facultative de la photo de profil.
- created_at : date de création du compte.

Le mot de passe n'est jamais stocké en clair.

Le champ password_hash est nullable afin de permettre
les comptes créés uniquement avec Google.

Le champ google_id est nullable pour les comptes utilisant
uniquement une authentification classique.

La connexion Google reste une fonctionnalité facultative
du MVP.

## 3. Table tasks

Cette table contient les tâches créées par les utilisateurs.

| Colonne | Type PostgreSQL | Contraintes |
|---|---|---|
| id | UUID | PRIMARY KEY |
| user_id | UUID | NOT NULL, FOREIGN KEY |
| titre | VARCHAR(255) | NOT NULL |
| description | TEXT | NULL |
| status | VARCHAR(20) | NOT NULL |
| priority | VARCHAR(20) | NOT NULL |
| date_limite | DATE | NULL |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | NOT NULL |

### Explications

- id : identifiant unique de la tâche.
- user_id : identifiant de l'utilisateur propriétaire.
- titre : titre de la tâche.
- description : description facultative.
- status : état d'avancement.
- priority : niveau de priorité.
- date_limite : date limite facultative.
- created_at : date de création.
- updated_at : date de dernière modification.

## 4. Relation entre les tables

La relation est de type :

users (1) ---- (N) tasks

Un utilisateur peut posséder plusieurs tâches.

Une tâche appartient obligatoirement à un seul utilisateur.

La colonne tasks.user_id référence users.id.

La suppression d'un utilisateur doit supprimer ses tâches
associées, selon la règle ON DELETE CASCADE.

## 5. Valeurs autorisées

### Statut

Le champ status accepte uniquement les valeurs suivantes :

| Valeur en base | Libellé affiché |
|---|---|
| TODO | À faire |
| IN_PROGRESS | En cours |
| DONE | Terminé |

### Priorité

Le champ priority accepte uniquement les valeurs suivantes :

| Valeur en base | Libellé affiché |
|---|---|
| LOW | Basse |
| MEDIUM | Moyenne |
| HIGH | Haute |

Ces valeurs doivent être contrôlées côté serveur
et protégées par des contraintes adaptées dans la base.

## 6. Règles d'intégrité

- Chaque utilisateur possède un identifiant UUID unique.
- Chaque tâche possède un identifiant UUID unique.
- Chaque tâche doit avoir un utilisateur propriétaire.
- Un email ne peut pas être utilisé par plusieurs comptes.
- Une tâche ne peut pas exister sans son utilisateur.
- Le titre d'une tâche est obligatoire.
- La description et la date limite sont facultatives.
- Le statut et la priorité doivent respecter les valeurs autorisées.

## 7. Sécurité et propriété des données

Toutes les opérations sur les tâches doivent être limitées
à l'utilisateur authentifié.

Lorsqu'un utilisateur consulte, modifie ou supprime une tâche,
le serveur doit vérifier que son user_id correspond à
l'identifiant de l'utilisateur issu de la session.

Ne jamais se fier uniquement à un user_id transmis
par le navigateur.

## 8. Index

Prévoir au minimum :

- Un index sur tasks.user_id pour retrouver rapidement
  les tâches d'un utilisateur.
- Un index sur tasks.user_id et tasks.status si les requêtes
  filtrent fréquemment les tâches par statut.

Les index supplémentaires doivent être ajoutés selon
les besoins réels des requêtes.

## 9. Migrations

Les changements de structure de la base doivent être
versionnés avec des migrations.

Ne pas modifier directement la base de production
sans migration correspondante.

Toute modification du modèle doit être répercutée
dans cette documentation.

## 10. Règle pour les agents IA

Avant de créer ou modifier une table :

1. Consulter ce fichier.
2. Examiner le schéma et les migrations existantes.
3. Vérifier que la modification est nécessaire.
4. Proposer une migration cohérente.
5. Mettre à jour cette documentation si le modèle change.

Ne pas inventer de nouvelles tables ou colonnes
sans besoin fonctionnel validé.