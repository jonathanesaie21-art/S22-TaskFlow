# TaskFlow

Application de gestion personnelle des tâches : chaque utilisateur crée un compte, se connecte (e-mail et mot de passe, ou Google) et gère ses propres tâches depuis un tableau de bord.

## Fonctionnalités

- Page d'accueil statique (SSG) avec modales de connexion et d'inscription.
- Authentification Auth.js : e-mail et mot de passe (hachage scrypt, limitation des tentatives) et connexion Google.
- Sessions JWT, déconnexion et protection des routes `/dashboard` (proxy + vérification côté serveur).
- Tableau de bord rendu côté serveur :
  - vue d'ensemble : statistiques, tâches récentes, progression globale ;
  - « Mes tâches » : recherche par nom, filtres de statut et de priorité, pagination (10 par page) ;
  - création, modification, changement de statut et suppression (avec confirmation) ;
  - notifications de succès et d'erreur.
- Page Guide d'utilisation (ISR, régénérée toutes les heures).
- Interface responsive : barre de navigation en bas sur mobile, modales en « bottom sheet », respect de `prefers-reduced-motion`.

## Stack

Next.js (App Router), React, JavaScript, Auth.js, PostgreSQL (`pg`), CSS (fichiers dédiés par fonctionnalité).

## Démarrage

```bash
npm install
cp .env.example .env     # puis renseigner les variables (voir ci-dessous)
node database/migrate.js # applique les migrations SQL
npm run dev
```

L'application est disponible sur http://localhost:3000.

### Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Chaîne de connexion PostgreSQL |
| `AUTH_SECRET` | Secret de signature des sessions (`npx auth secret` pour en générer un) |
| `AUTH_GOOGLE_ID` | Identifiant client OAuth Google |
| `AUTH_GOOGLE_SECRET` | Secret client OAuth Google |

Ne jamais enregistrer le fichier `.env` dans Git.

## Structure

```
database/migrations/   migrations SQL versionnées (001 à 004)
docs/                  architecture, conventions, base de données, déploiement, audit
src/app/               pages et routes (accueil, dashboard, guide, api)
src/components/        auth, dashboard, guide, landing, ui
src/lib/               validation, constantes, utilitaires
src/models/            accès aux données (SQL)
src/services/          logique métier
```

## API

Toutes les routes `/api/tasks` exigent une session ; l'identifiant de l'utilisateur vient toujours de la session, jamais de la requête, et chaque requête SQL filtre sur le propriétaire.

| Méthode | Route | Rôle |
| --- | --- | --- |
| `GET` | `/api/tasks` | Liste des tâches de l'utilisateur |
| `POST` | `/api/tasks` | Crée une tâche |
| `PATCH` | `/api/tasks/:id` | Modifie une tâche (ou son statut seul avec `{ "status": "..." }`) |
| `DELETE` | `/api/tasks/:id` | Supprime une tâche |

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Lance le build de production |
| `npm run lint` | Vérification ESLint |

## Documentation

- [Architecture](docs/architecture.md)
- [Conventions](docs/conventions.md)
- [Base de données](docs/database.md)
- [Déploiement sur Vercel](docs/deploiement-vercel.md)
- [Audit Lighthouse](docs/audit-lighthouse.md)

## Contribuer

Branches `feature/...`, `fix/...`, `chore/...`, `docs/...` ; pas de push direct sur `main` ; intégration par Pull Request relue par un autre membre. Voir [docs/conventions.md](docs/conventions.md).
