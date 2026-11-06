# Déploiement sur Vercel

## Prérequis

- Un dépôt GitHub à jour (branche `main`).
- Une base PostgreSQL accessible depuis Internet (Neon, Supabase, Vercel Postgres, etc.).
- Un client OAuth Google (Google Cloud Console).

## 1. Base de données

1. Créer la base et récupérer l'URL de connexion (avec `sslmode=require` si le fournisseur l'impose).
2. Appliquer les migrations depuis votre poste, en pointant `DATABASE_URL` vers cette base :
   ```bash
   DATABASE_URL="postgres://..." node database/migrate.js
   ```
3. Vérifier que les tables `users`, `tasks` et `auth_attempts` existent, et que `tasks` possède la colonne `categorie` (migration 004).

## 2. Projet Vercel

1. Vercel → *Add New… → Project* → importer `S22-TaskFlow`.
2. Framework : Next.js (détecté automatiquement). Commande de build : `npm run build`.
3. Ajouter les variables d'environnement (Production et Preview) :

| Variable | Valeur |
| --- | --- |
| `DATABASE_URL` | URL PostgreSQL de production |
| `AUTH_SECRET` | secret généré avec `npx auth secret` |
| `AUTH_GOOGLE_ID` | identifiant client Google |
| `AUTH_GOOGLE_SECRET` | secret client Google |

`AUTH_URL` n'est pas nécessaire sur Vercel : Auth.js détecte l'hôte via les en-têtes de la plateforme.

## 3. Connexion Google

Dans Google Cloud Console → *Identifiants* → client OAuth, ajouter :

- Origine JavaScript autorisée : `https://<votre-domaine>.vercel.app`
- URI de redirection autorisée : `https://<votre-domaine>.vercel.app/api/auth/callback/google`

Pour les déploiements de prévisualisation, utiliser un client OAuth distinct ou tester la connexion Google uniquement en production.

## 4. Vérifications après déploiement

- [ ] La page d'accueil s'affiche.
- [ ] Inscription puis connexion par e-mail et mot de passe.
- [ ] Connexion Google.
- [ ] `/dashboard` redirige vers l'accueil avec la modale de connexion lorsque l'on n'est pas connecté.
- [ ] Création, modification, changement de statut et suppression d'une tâche.
- [ ] Un deuxième compte ne voit pas les tâches du premier.
- [ ] `/guide` s'affiche sans être connecté.

## Dépannage

| Symptôme | Piste |
| --- | --- |
| `redirect_uri_mismatch` à la connexion Google | L'URI de redirection ne correspond pas exactement à celle déclarée chez Google |
| Erreur `Configuration` d'Auth.js | `AUTH_SECRET` absent dans l'environnement Vercel |
| Erreur de connexion à la base | `DATABASE_URL` incorrecte ou `sslmode` manquant |
| Trop de tentatives immédiatement | Vérifier que l'en-tête `x-forwarded-for` est bien transmis (voir `src/lib/client-ip.js`) |
