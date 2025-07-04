# FSDArtisanClient

Ce projet est le **frontend** d'une application de gestion d'atelier d'artisanat/design de meubles, développé avec **React**, **TypeScript** et **Vite**.

Il fonctionne de pair avec le backend disponible ici :  
👉 [https://github.com/ton-org/FSDArtisanServer](https://github.com/ton-org/FSDArtisanServer)

---

## Architecture du projet

- **src/**
  - **components/** : Composants réutilisables (modales, tableaux, sidebar, etc.)
  - **hooks/** : Hooks personnalisés pour la logique métier (auth, validation, navigation...)
  - **pages/** : Pages principales de l'application (auth, dashboard, meubles, ressources, fournisseurs...)
  - **router/** : Définition des routes de l'application
  - **schemas/** : Schémas de validation (Zod) pour les formulaires
  - **services/** : Constantes, helpers, etc.
  - **store/** : State management avec Redux Toolkit et RTK Query
  - **types/** : Types TypeScript partagés

---

## Installation & Lancement

1. **Cloner le dépôt**
   ```bash
   git clone <url-de-ce-repo>
   cd FSDArtisanClient
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
- Créez un fichier .env à la racine du projet (voir .env.example si disponible).
- Ajoutez la variable suivante :
  ```bash
  VITE_API_URL=http://localhost:8000
  ```
- **Remarque** : Le fichier .env n'est pas présent dans le repo pour des raisons de sécurité.
Demandez-le au propriétaire du projet ou créez-le vous-même avec l'URL de votre backend.

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

L'application sera accessible sur *http://localhost:5173* par défaut.

## Fonctionnement
- Ce frontend communique avec l'API du backend (FSDArtisanServer) pour toutes les opérations (auth, gestion des meubles, ressources, fournisseurs, etc.).
- Pour un fonctionnement optimal, assurez-vous que le backend est lancé et accessible à l'URL définie dans VITE_API_URL.

## Fonctionnement
- Ce frontend communique avec l'API du backend (FSDArtisanServer) pour toutes les opérations (auth, gestion des meubles, ressources, fournisseurs, etc.).
- Pour un fonctionnement optimal, assurez-vous que le backend est lancé et accessible à l'URL définie dans VITE_API_URL.

## Sécurité
- Le fichier .env n'est pas versionné pour protéger les informations sensibles (URL API, etc.).
- Ne partagez jamais vos credentials ou secrets dans un dépôt public.

## Contact
Pour toute question ou pour obtenir un exemple de fichier .env, contactez le propriétaire du dépôt.