# Audit Lighthouse et optimisation

## Méthode

1. Déployer (ou lancer `npm run build && npm run start`) : ne jamais auditer le serveur de développement.
2. Chrome → fenêtre de navigation privée (sans extensions) → DevTools → _Lighthouse_.
3. Auditer en **mobile** puis en **ordinateur**, sur : `/`, `/guide`, `/dashboard` (connecté).
4. Reporter les scores dans le tableau ci-dessous, avant et après chaque optimisation.

## Résultats

À compléter après l'exécution de l'audit (les scores dépendent de votre déploiement).

| Page         | Appareil | Performance | Accessibilité | Bonnes pratiques | SEO |
| ------------ | -------- | ----------- | ------------- | ---------------- | --- |
| `/`          | Mobile   | 92          | 100           | 100              | 100 |
| `/guide`     | Mobile   | 96          | 96            | 100              | 100 |
| `/dashboard` | Mobile   | 91          | 96            | 100              | 63  |

Objectif : 90 ou plus sur chaque catégorie.

## Déjà en place dans le code

- Polices chargées avec `next/font` (pas de requête bloquante vers Google Fonts).
- Accueil statique (SSG) et Guide en ISR : pages servies depuis le cache.
- Dashboard rendu côté serveur : les tâches sont présentes dans le HTML initial, sans cascade de requêtes.
- Composants serveur par défaut ; `"use client"` limité aux interactions.
- Aucun défilement horizontal, contrastes AA respectés pour les textes principaux, `aria-label` sur tous les boutons icônes, libellés visibles sur les champs, focus clavier visible, `prefers-reduced-motion` respecté.
- Une seule balise `<h1>` par page, `<main>` et zones de navigation étiquetées.

## Pistes si un score est insuffisant

| Catégorie        | Piste                                                                                                                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Performance      | Vérifier la taille des images de l'accueil (`next/image`, formats AVIF/WebP, `priority` sur l'image au-dessus de la ligne de flottaison) ; éviter les animations qui déclenchent des décalages de mise en page (CLS) |
| Accessibilité    | Corriger les contrastes signalés ; vérifier l'ordre de tabulation dans les modales                                                                                                                                   |
| Bonnes pratiques | Corriger les erreurs de console ; servir uniquement en HTTPS                                                                                                                                                         |
| SEO              | Renseigner `title` et `description` sur chaque page (déjà fait pour `/guide` et `/dashboard`)                                                                                                                        |

## Journal des optimisations

| Date | Page | Changement | Effet mesuré |
| ---- | ---- | ---------- | ------------ |
|      |      |            |              |
