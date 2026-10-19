# Plan d’intégration — Back-office Super Admin Elite Coffee

## Périmètre

Ajouter un espace administrateur séparé du site public, accessible via `/admin`, avec une navigation latérale de type SaaS inspirée de la capture fournie, mais adaptée à la marque Elite Coffee.

Le back-office couvrira :

- un tableau de bord KPI pour les commandes, réservations, chiffre d’affaires et contenu ;
- la consultation, modification et suppression des inscriptions/réservations ;
- la consultation et gestion des commandes avec changement de statut ;
- une vue catalogue pour modifier les produits, prix, catégories et visibilité ;
- un éditeur de contenu pour les textes clés du site et les coordonnées ;
- des états loading, empty, error, confirmation de suppression et feedback toast.

La première intégration privilégie une expérience complète et exploitable dans l’interface existante. Les actions serveur réutiliseront les tables Supabase déjà présentes lorsque possible ; l’authentification et le durcissement RLS restent des sujets séparés, conformément à la demande de laisser les correctifs de l’audit de côté pour l’instant.

## Design Read

```yaml
artifact: back-office web responsive
au­­dience: super administrateur / gérant Elite Coffee
visual-language: dashboard SaaS éditorial, chaleureux, dense mais respiré, inspiré de la capture Finexy sans la copier
mode: extension structurée de l’application existante
visual-variance: 4/10
motion-intensity: 3/10
information-density: 7/10
asset-dependence: 1/10
brand-fidelity: 9/10
```

## Mode de redesign

**Extension + preserve ciblé.** Le site public conserve ses routes, son identité café, ses couleurs brunes et son ton éditorial. Le back-office ajoute une interface métier plus dense avec une navigation dédiée, sans modifier les parcours publics existants.

### Préserver

- la palette café existante : brun profond, crème, caramel doré ;
- les polices déjà chargées : Inter pour les données et Playfair Display pour les titres de marque ;
- les données du catalogue et des coordonnées regroupées dans leurs fichiers actuels ;
- les routes publiques, le panier et les formulaires existants ;
- la forme de feedback existante via Sonner.

### Améliorer

- la hiérarchie de navigation pour les tâches de gestion ;
- la lisibilité des KPI et des comparaisons temporelles ;
- la gestion des états et des confirmations destructives ;
- la capacité à rechercher, filtrer et trier les inscriptions ;
- l’édition centralisée des contenus stratégiques.

### Retirer

- aucun élément public existant ;
- les graphiques purement décoratifs : chaque visualisation devra répondre à une question métier.

## Design Decisions

- **Mouvement de design :** « editorial operations desk » — une console de gestion chaleureuse, précise et premium, où le brun espresso joue le rôle de couleur propriétaire et le caramel signale l’action.
- **Principes :** clarté opérationnelle, densité maîtrisée, statut immédiatement lisible, actions réversibles ou confirmées, continuité de marque.
- **Palette :** fond `#F7F5F1` crème très clair ; surface blanche ; texte `#201A17` espresso ; primaire `#5B3826` brun café ; accent `#D8894A` caramel ; positif `#2E8B68` ; alerte `#C66A37` ; bordure `#E8E0D7`.
- **Typographie :** Inter pour l’interface, les tableaux et les chiffres ; Playfair Display uniquement pour les titres de section et le wordmark.
- **Espacement :** grille de base 4 px, espacements principaux 12 / 16 / 24 / 32 px ; conteneurs avec padding généreux.
- **Rayons :** 14 px pour les cartes et champs, 18 px pour les panneaux, 999 px pour les badges et boutons principaux.
- **Ombres :** très légères, utilisées pour détacher les surfaces blanches du fond ; aucune ombre lourde sur les tableaux.
- **Motion :** transitions de 160–220 ms, apparition discrète des panneaux, aucun mouvement permanent dans la console.

## Structure fonctionnelle

### Navigation

- Vue d’ensemble
- Analytics
- Inscriptions / réservations
- Commandes
- Catalogue
- Contenu du site
- Paramètres / accès super admin

### Dashboard

Six KPI maximum pour préserver la lecture :

1. chiffre d’affaires de la période ;
2. commandes reçues ;
3. réservations en attente ;
4. nouveaux clients/inscriptions ;
5. panier moyen ;
6. produits visibles au catalogue.

Visualisations :

- série temporelle du chiffre d’affaires / commandes ;
- répartition des statuts de commande ;
- activité des réservations par jour ;
- table des dernières inscriptions avec actions rapides.

Chaque KPI affichera la période, une comparaison précédente et, lorsque la donnée est disponible, une cible ou une variation.

### Gestion des inscriptions

Table responsive avec : nom, téléphone, date, créneau, nombre de personnes, occasion, statut, date de création. Fonctions : recherche, filtre par statut, tri, ouverture du détail, modification des champs, changement de statut et suppression avec confirmation.

### Gestion du contenu

Éditeur par sections : identité/coordonnées, horaires, hero, offres mises en avant, texte À propos et liens sociaux. Les champs auront un aperçu de la valeur publique et une sauvegarde explicite.

## Approche technique

- créer un layout `AdminShell` indépendant de `SiteHeader` ;
- créer des composants réutilisables `AdminSidebar`, `AdminTopbar`, `KpiCard`, `DataTable`, `StatusBadge`, `AdminModal`, `ContentEditor` ;
- ajouter les routes `/admin`, `/admin/registrations`, `/admin/orders`, `/admin/catalog`, `/admin/content` ;
- utiliser des données d’interface structurées et des adaptateurs isolés pour Supabase afin de pouvoir brancher les opérations réelles sans mélanger les requêtes et la présentation ;
- réutiliser les composants UI Radix déjà présents et `recharts` déjà installé pour les graphiques ;
- ajouter une déclaration `public/manus-routes.json` synchronisée avec les nouvelles routes ;
- ne pas modifier le catalogue public ni les corrections techniques identifiées dans l’audit.

## Contrats protégés

- aucune modification des slugs publics existants ;
- aucune modification des noms de champs des formulaires publics ;
- aucun changement de prix public sans action explicite dans l’éditeur de catalogue ;
- aucune suppression silencieuse : confirmation obligatoire ;
- aucune donnée réelle inventée dans l’interface lorsque Supabase ne renvoie pas de valeur.

## Risque principal et fallback

Le risque principal est l’absence d’un flux d’authentification super-admin déjà implémenté. La première version séparera visuellement l’espace `/admin` et isolera ses adaptateurs de données. Le branchement sécurisé sur Supabase Auth/RLS pourra ensuite être ajouté sans refaire l’interface.
