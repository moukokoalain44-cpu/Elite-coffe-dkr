# TODO — Back-office Super Admin Elite Coffee

## Tableau de bord KPI

- [ ] Ajouter une route `/admin` avec une navigation latérale dédiée au super administrateur.
  - Afficher les sections Vue d’ensemble, Analytics, Inscriptions, Commandes, Catalogue, Contenu du site et Paramètres.
  - Conserver le site public et ses routes existantes inchangés.
  - Prévoir un état responsive utilisable sur mobile et tablette.

- [ ] Afficher les indicateurs opérationnels du restaurant.
  - Chiffre d’affaires de la période.
  - Nombre de commandes reçues.
  - Nombre de réservations en attente.
  - Nombre de nouveaux clients/inscriptions.
  - Panier moyen.
  - Nombre de produits visibles au catalogue.
  - Inclure période, variation précédente et état sans donnée lorsque nécessaire.

- [ ] Ajouter les visualisations utiles au pilotage.
  - Évolution du chiffre d’affaires et des commandes dans le temps.
  - Répartition des statuts de commande.
  - Activité des réservations par jour.
  - Liste des dernières inscriptions avec actions rapides.

## Gestion des inscriptions et réservations

- [ ] Ajouter une route `/admin/registrations` pour consulter les inscriptions/réservations.
  - Afficher nom, téléphone, date, créneau, nombre de personnes, occasion, statut et date de création.
  - Permettre recherche, filtrage par statut et tri.
  - Permettre ouverture d’une fiche détail.

- [ ] Permettre au super administrateur de modifier une inscription.
  - Modifier les informations de contact, la date, l’heure, le nombre de personnes, l’occasion, le message et le statut.
  - Afficher un feedback de sauvegarde réussi ou en erreur.

- [ ] Permettre au super administrateur de supprimer une inscription.
  - Afficher une confirmation avant suppression.
  - Actualiser la table après suppression.
  - Afficher un état vide si aucun enregistrement ne correspond au filtre.

## Gestion des commandes et du catalogue

- [ ] Ajouter une route `/admin/orders`.
  - Consulter les commandes, leurs lignes, le client, le mode de réception, le paiement, le total et le statut.
  - Modifier le statut d’une commande avec feedback visuel.
  - Rechercher, filtrer et trier les commandes.

- [ ] Ajouter une route `/admin/catalog`.
  - Consulter les produits du catalogue.
  - Modifier nom, description, catégorie, prix, image, ingrédients, méthode de préparation et visibilité.
  - Afficher un aperçu de la fiche produit.
  - Empêcher une suppression silencieuse et gérer les états de sauvegarde.

## Gestion du contenu du site

- [ ] Ajouter une route `/admin/content` avec un éditeur de contenu par sections.
  - Modifier identité, coordonnées, horaires, hero, offres mises en avant, texte À propos et liens sociaux.
  - Afficher une prévisualisation de la valeur publique.
  - Sauvegarder explicitement et signaler les changements non enregistrés.

## Intégration technique

- [ ] Créer `AdminShell` et les composants de dashboard réutilisables.
- [ ] Isoler les adaptateurs de données Supabase des composants de présentation.
- [ ] Réutiliser Radix UI, les tokens Elite Coffee et Recharts déjà présents.
- [ ] Ajouter `public/manus-routes.json` pour les routes publiques et administrateur.
- [ ] Ne pas modifier les corrections de l’audit déjà identifiées dans cette phase.

## Connexion administrateur et gestion des médias

- [x] Ajouter les nouveaux médias depuis un panneau latéral dans l’administration de la galerie.
  - Le formulaire d’ajout s’ouvre sur le côté de la page et ne remplace plus le contenu par une fenêtre modale centrée.
  - Conserver la clé stable, le nom, le texte alternatif et les choix d’import depuis un fichier ou par URL.
  - Enregistrer le média dans le stockage et les données déjà utilisés par la galerie publique, puis refermer le panneau et afficher un retour de réussite ou d’erreur.

- [x] Moderniser et embellir le formulaire de connexion à l’administration avec un média administrable depuis la galerie.
  - Présenter une connexion responsive, lisible et cohérente avec l’identité café d’Elite Coffee.
  - Préserver l’authentification Supabase existante, les messages d’erreur, les champs accessibles et l’affichage/masquage du mot de passe.
  - Permettre de définir depuis la galerie une image de celle-ci comme visuel de la page de connexion, avec un visuel de repli si aucun choix n’a été enregistré.
  - Afficher l’image choisie en aperçu avant de l’enregistrer ; l’aperçu ne remplace pas le visuel enregistré avant confirmation explicite.
  - Indiquer dans l’administration la clé stable `admin-login-cover` utilisée par la page de connexion.
