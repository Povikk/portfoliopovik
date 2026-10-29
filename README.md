# Portfolio Povik

Portfolio interactif de **Jonathan Ragot**, également connu sous le pseudonyme **Povikk**.

Le site présente son profil, ses projets et son intérêt pour la qualité logicielle à travers une interface inspirée du développement et du test. Il sert à la fois de carte de visite en ligne et de terrain d'expérimentation : certaines parties se consultent comme un portfolio classique, tandis que d'autres proposent de rechercher des anomalies ou d'interagir avec les éléments de la page.

## Consulter le site

Le portfolio est accessible en ligne à cette adresse :

**[povikk.github.io/portfoliopovik](https://povikk.github.io/portfoliopovik/)**

## Fonctionnalités

### Navigation et présentation

- page unique organisée en sections : présentation, projets, parcours et contact ;
- navigation adaptée aux écrans d'ordinateur et aux appareils mobiles ;
- barre de progression liée au défilement ;
- animations, effets de survol et éléments réagissant au curseur ;
- fiches de projets ouvrant des fenêtres inspirées d'un navigateur, qui peuvent être déplacées à l'écran ;
- bouton de contact par e-mail et copie de l'adresse dans le presse-papiers.

### Laboratoire créatif

Le portfolio comprend un espace d'expérimentation présenté dans une fenêtre de navigateur fictive.

L'expérience disponible, **Bug Hunt Playground**, propose trois pages de démonstration :

1. une boutique en ligne ;
2. une page de connexion ;
3. un tableau de bord.

Ces pages restent utilisables comme de petites interfaces. Un mode d'inspection permet ensuite de signaler les anomalies volontairement intégrées. Le laboratoire comprend :

- 16 anomalies réparties entre les trois démonstrations ;
- un compteur de progression propre à chaque page ;
- des indices limités aux anomalies qui n'ont pas encore été trouvées ;
- une explication pour chaque anomalie détectée ;
- des conseils pour reproduire, identifier et corriger le problème ;
- plusieurs niveaux de gravité, notamment mineur, majeur, critique et accessibilité.

Les autres expériences affichées dans le laboratoire sont clairement signalées comme étant en cours de construction.

### Pixel, le bug interactif

Un petit bug nommé **Pixel** se déplace sur la page et réagit à son environnement. Son comportement tient compte du curseur, du défilement et des différents éléments de l'interface.

Un mini-jeu discret permet notamment de :

- trouver des miettes cachées dans les différentes sections ;
- les déplacer jusqu'à Pixel ;
- gagner progressivement sa confiance ;
- suivre les zones visitées et les miettes données ;
- débloquer de nouvelles interactions, dont les caresses ;
- réinitialiser la progression après confirmation.

La progression de ce mini-jeu est enregistrée dans le stockage local du navigateur. Elle reste donc disponible lors d'une prochaine visite sur le même appareil, sans compte utilisateur ni envoi de données vers un serveur.

## Technologies utilisées

Seules les technologies effectivement présentes dans le projet sont listées ici.

- **TypeScript** pour le code de l'application ;
- **React 19** pour les composants et les interactions ;
- **Vinext** pour exécuter l'application avec les conventions de Next.js sur Vite ;
- **Vite** pour le développement et la génération du site ;
- **Tailwind CSS 4** et une feuille de styles CSS personnalisée pour la mise en forme ;
- **Lucide React** pour les icônes ;
- **pnpm** pour la gestion des dépendances ;
- **Oxlint** et **Oxfmt** pour le contrôle et le formatage du code ;
- **GitHub Actions** et **GitHub Pages** pour la publication automatique.

Le dépôt contient également une configuration Cloudflare utilisée par l'environnement de développement, mais la version publique actuelle est générée sous forme de site statique et publiée sur GitHub Pages.

## Fonctionnement

L'application est principalement regroupée dans un composant React côté navigateur.

Les actions de la personne qui visite le site modifient directement l'état de l'interface : ouverture d'une fenêtre, sélection d'un projet, activation du mode d'inspection, découverte d'une anomalie ou interaction avec Pixel. Aucun compte ni base de données distante n'est nécessaire pour utiliser le portfolio.

Lors de la génération destinée à GitHub Pages, l'application est transformée en fichiers statiques. Le workflow GitHub Actions installe les dépendances, construit le site, prépare les chemins des ressources puis publie le résultat.

## Installation et utilisation locale

### Prérequis

- **Node.js 22.13 ou une version plus récente** ;
- **pnpm**.

### Étapes

```bash
git clone https://github.com/Povikk/portfoliopovik.git
cd portfoliopovik
pnpm install
pnpm dev
```

Une adresse locale est ensuite affichée dans le terminal. Il suffit de l'ouvrir dans un navigateur.

### Commandes disponibles

| Commande | Utilité |
| --- | --- |
| `pnpm dev` | démarre le site en mode développement |
| `pnpm build` | génère une version prête à être publiée |
| `pnpm start` | lance localement la version générée avec Wrangler |
| `pnpm lint` | analyse le code avec Oxlint |
| `pnpm format` | formate le code avec Oxfmt |

## Publication

Toute modification envoyée sur la branche `main` déclenche le workflow **Deploy GitHub Pages**. Celui-ci construit le projet et met automatiquement à jour le site public.

## Auteur

**Jonathan Ragot**  
Pseudonyme GitHub : **Povikk**  
Profil : [github.com/Povikk](https://github.com/Povikk)
