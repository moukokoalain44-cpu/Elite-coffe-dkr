# Informations publiques vérifiées — Elite Coffee Dakar

Dernière vérification : 24 octobre 2026.

## Positionnement

Elite Coffee se présente comme un **restaurant, brunch et glacier**, et non uniquement comme un coffee shop. Le site officiel met en avant une cuisine généreuse et diversifiée avec brunchs, plats du jour, grillades, fruits de mer, pizzas et desserts. [1]

## Localisation

L’établissement est situé à Dakar, à l’entrée de la Cité Keur Gorgui, sur la route du Collège Sacré-Cœur. Instagram mentionne aussi la route du BRT. [1] [2]

## Horaires et contact

Instagram affiche les horaires suivants : lundi–jeudi de 08h00 à 23h00, vendredi–dimanche de 08h00 à 00h00. Le numéro public est le 33 824 96 93 et l’adresse e-mail affichée est elitecoffee2021@gmail.com. [2]

Le site officiel affiche également les liens Instagram et Facebook, ainsi qu’une fiche d’adresse Google Maps. Une ancienne adresse administrative affichée sur ce site contient des informations incohérentes (« France », numéro français) ; elle n’est pas reprise dans le site Elite Coffee. [1]

## Offres et services confirmés

Le site officiel signale : livraison, service traiteur, terrasse, climatisation, parking en libre-service, accessibilité PMR, événements privés, vente à emporter et réceptions de mariage. Ces éléments sont intégrés comme services proposés, sans présenter de tarifs ou de disponibilités non vérifiés. [1]

Instagram met en avant des stories à la une « Brunch/Lattés », « Menu », « Vos passages », « Breakfast » et « Infos pratiques ». Les publications récentes montrent notamment brunchs, cafés/lattés, cappuccinos, smoothies, jus et desserts. [2]

## Direction éditoriale et visuelle retenue

Le site doit passer d’un angle principalement « café en ligne » à un angle « adresse conviviale à Dakar » : brunch, repas, pause sucrée, café et événements. La hiérarchie recommandée est :

1. Restaurant · Brunch · Glacier.
2. Adresse et horaires immédiatement visibles.
3. Brunch et carte comme appels à l’action principaux.
4. Terrasse, livraison, événements privés et traiteur comme preuves de polyvalence.
5. Photos de plats et boissons avec une palette crème, espresso, caramel et une touche terracotta inspirée des supports sociaux.

## Sources

[1]: https://elite-coffee.eatbu.com/?lang=fr "Site officiel Elite Coffee Dakar"
[2]: https://www.instagram.com/elitecoffee_dkr/?hl=fr "Profil Instagram officiel Elite Coffee Dakar"
[3]: https://www.google.com/maps/search/?api=1&query=Elite+Coffee+Cité+Keur+Gorgui+Dakar "Recherche Google Maps Elite Coffee Cité Keur Gorgui Dakar"


## Mise à jour éditoriale — octobre 2026

- Sources publiques consultées : [profil Instagram Elite Coffee](https://www.instagram.com/elitecoffee_dkr/?hl=en), [reel « comment nous trouver »](https://www.instagram.com/elitecoffee_dkr/reel/DX45KTqsgVj/), [reel de présentation brunch](https://www.instagram.com/elitecoffee_dkr/reel/DXAbjMaDSun/), [publication nouvelle carte brunch](https://www.instagram.com/elitecoffee_dkr/p/Dbn08xcDcl4/), [publication du 12 septembre](https://www.instagram.com/elitecoffee_dkr/p/DdL1xfmjaDN/), [publication desserts/toasts](https://www.instagram.com/elitecoffee_dkr/p/Dbfla7-ty29/).
- Les visuels locaux utilisés par la page publique sont des copies des aperçus Open Graph des publications publiques, conservées dans `public/assets/instagram/` : `hero-brunch.jpg`, `brunch-table.jpg`, `coffee-dessert.jpg`, `smoothie-video.jpg`, `dessert-toast.jpg`.
- Les légendes reprises dans l’interface indiquent notamment : brunch disponible tous les jours de 09h à 17h ; Elite Coffee se présente comme un lieu chaleureux de brunch à Dakar ; les reels mettent en avant les muffins, croissants, cafés frappés et l’expérience du restaurant.
- Les reels sont conservés comme liens directs vers Instagram dans `src/data/site.ts` car Instagram n’expose pas systématiquement le fichier vidéo original sans session connectée. Aucun fichier vidéo généré n’est utilisé dans la page publique.
- La carte complète validée dans `src/data/menu-data.ts` a été synchronisée dans `public.menu_products` du projet Supabase `Elite-coffe-dkr` : 150 lignes visibles, avec RLS en lecture publique et gestion réservée aux utilisateurs authentifiés.
