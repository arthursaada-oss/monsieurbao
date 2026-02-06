# Monsieur Bao — Site vitrine

Site statique one-page, pour [Monsieur Bao](https://www.monsieurbao.com).

## Structure

- `index.html` — Page d’accueil (toutes les sections en one-page avec ancres)
- `css/style.css` — Styles (variables CSS, composants, responsive)
- `js/main.js` — Header sticky, menu burger, smooth scroll
- `images/` — Dossier pour logo et visuels (optionnel : le site utilise actuellement les URLs Wix pour les images)

## Déploiement

Aucun build : le site est prêt à être hébergé en statique.

1. **Option 1 — Upload FTP / hébergeur classique**  
   Envoyer le contenu du dossier (y compris `css/`, `js/`, `images/`) à la racine du site ou dans un sous-dossier.

2. **Option 2 — Netlify**  
   Glisser-déposer le dossier sur [app.netlify.com](https://app.netlify.com) ou connecter un dépôt Git.

3. **Option 3 — Vercel**  
   Importer le projet et choisir “Static HTML”.

4. **Option 4 — GitHub Pages**  
   Pousser le repo et activer GitHub Pages sur la branche `main` (dossier racine ou `/docs`).

## Personnalisation

- **Images** : Remplacer les URLs Wix dans `index.html` par des chemins locaux (ex. `images/logo.png`) si vous hébergez vos propres fichiers dans `images/`.
- **Newsletter (recevoir les inscriptions par email)** : Le formulaire est branché sur [Formspree](https://formspree.io). 1) Créez un compte gratuit sur formspree.io. 2) Créez un nouveau formulaire : vous recevrez une URL du type `https://formspree.io/f/abc123xyz`. 3) Dans `index.html`, remplacez `VOTRE_ID_FORMSPREE` dans l’`action` du formulaire newsletter par l’id de votre formulaire (ex. `abc123xyz`). Chaque soumission vous sera envoyée par email.
- **Couleurs** : Modifier les variables dans `css/style.css` (`:root` : `--color-accent`, `--color-newsletter`, etc.).

## Navigation

- Accueil, Nos recettes, Nos engagements, Trouver nos produits, FAQ, Nous contacter (ancres vers les sections correspondantes).
