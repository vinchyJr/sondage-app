# Sondage-App

Bienvenue dans **Sondage-App**, une application interactive de sondages permettant aux utilisateurs de **créer, modifier, répondre et analyser des sondages** en toute simplicité. Ce projet est construit avec **Next.js 15**, **NextAuth.js** pour l'authentification, **MongoDB** pour la gestion des données et **React Hook Form** pour la gestion des formulaires.

## Fonctionnalités

✅ **Authentification avec NextAuth** (connexion, inscription, sécurité JWT).\
✅ **Création de sondages dynamiques** avec plusieurs types de questions (ouverte, QCM).\
✅ **Filtrage et recherche de sondages** par **titre, catégorie et date**.\
✅ **Affichage et participation aux sondages** (1 seule réponse par utilisateur).\
✅ **Gestion des sondages par l'auteur** (modification, suppression, visualisation des réponses).\
✅ **Affichage des réponses collectées** avec le nom des participants.

---

## Installation et Exécution du Projet

### Prérequis

- **Node.js** (version 16 ou supérieure)
- **MongoDB** (localement ou via MongoDB Atlas)
- \*\*Un fichier \*\***`.env.local`** (voir configuration ci-dessous)

### Installation

1. **Clonez le dépôt :**
   ```sh
   git clone https://github.com/votre-utilisateur/sondage-app.git
   cd sondage-app
   ```
2. **Installez les dépendances :**
   ```sh
   npm install
   ```
3. **Configurez votre environnement dans ************************`.env.local`************************ :**
   ```sh
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=VOTRE_SECRET
   MONGODB_URI=mongodb+srv://VOTRE_NOM_UTILISATEUR:VOTRE_MOT_DE_PASSE@cluster.mongodb.net/sondages
   ```
4. **Démarrez le serveur de développement :**
   ```sh
   npm run dev
   ```

L'application est maintenant accessible à `http://localhost:3000`

---

## Initialisation de la Base de Donné

###  Problèmes avec le script d'initialisation

Nous avons rencontré **de multiples problèmes** pour exécuter un script d'initialisation automatique de la base de données (incompatibilités TypeScript, erreurs liées aux modules ESM, gestion des imports, etc.).

-  **En conséquence**, bien que le script soit toujours présent dans le projet (`scripts/initDB.ts`) pour **référence**, nous recommandons une **méthode alternative** plus fiable pour initialiser la base de données manuellement.

###  **Méthode alternative : Initialisation manuelle**

#### **1. Se connecter à MongoDB**

- **MongoDB Compass** : `mongodb://localhost:27017` (pour une base locale)
- **MongoDB Atlas** : Connectez-vous sur [MongoDB Atlas](https://cloud.mongodb.com/) et récupérez votre URI de connexion.

#### **2.  Créer la base de données et les collections**

Dans MongoDB Compass ou Atlas :

1. **Créez une base de données** : `sondage-app`
2. **Ajoutez trois collections** :
   - `users`
   - `surveys`
   - `responses`

#### **3. Ajouter des données de test**

🔹 **Utilisateurs (********`users`********\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*)**

```json
[
  { "name": "Alice Dupont", "email": "alice@example.com", "password": "$2a$10$HASHED_PASSWORD" },
  { "name": "Bob Martin", "email": "bob@example.com", "password": "$2a$10$HASHED_PASSWORD" }
]
```

> Remplace `$2a$10$HASHED_PASSWORD` par un mot de passe hashé avec bcrypt.

🔹 **Sondages (********`surveys`********\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*)**

```json
[
  {
    "title": "Préférences alimentaires",
    "category": "Alimentation",
    "createdBy": "ID_ALICE",
    "date": "2024-03-10T12:00:00Z",
    "questions": [
      { "question": "Quel est votre plat préféré ?", "type": "ouverte", "options": [] },
      { "question": "Quel type de cuisine aimez-vous ?", "type": "qcm", "options": ["Italienne", "Mexicaine", "Chinoise"] }
    ]
  }
]
```

> Remplace `"ID_ALICE"` par l'ID réel de l'utilisateur.

🔹 **Réponses (********`responses`********\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*)**

```json
[
  {
    "surveyId": "ID_SONDAGE_ALIMENTAIRE",
    "userId": "ID_BOB",
    "responses": [
      { "questionId": "ID_QUESTION_1", "answer": "Pizza" },
      { "questionId": "ID_QUESTION_2", "answer": "Italienne" }
    ]
  }
]
```

> Remplace `"ID_SONDAGE_ALIMENTAIRE"`, `"ID_BOB"`, `"ID_QUESTION_1"` et `"ID_QUESTION_2"` par les ID correspondants.

✅ **Avantages de cette méthode :**

- Pas de problèmes avec TypeScript, ESM ou modules.
- Compatible MongoDB Compass et Atlas.
- Facile à modifier et adapter.

---

## Développement & Contributions

### Technologies utilisées

- **Framework :** Next.js 15 (avec App Router et Server Actions)
- **Base de données :** MongoDB (avec Mongoose)
- **UI :** Tailwind CSS & ShadCN
- **Authentification :** NextAuth.js (JWT, Credentials Provider)
- **Gestion des formulaires :** React Hook Form + useFieldArray
- **Icons :** Lucide React

### Commandes utiles

- **Lancer le projet en mode développement** : `npm run dev`
- **Build le projet pour la production** : `npm run build`
- **Exécuter le serveur de production** : `npm start`
- **Lint du code** : `npm run lint`

---

## Évaluation du projet

L'objectif de ce projet est de **démontrer la capacité à créer une application complète avec Next.js**, comprenant l'authentification, la gestion dynamique de formulaires et la manipulation de données MongoDB.

### Points à tester

✅ **Connexion / Inscription**\
✅ **Création et modification de sondages**\
✅ **Réponse unique aux sondages (1 par utilisateur)**\
✅ **Affichage des réponses collectées pour l’auteur**\
✅ **Suppression et mise à jour des sondages**\
✅ **Filtres et recherche fonctionnels**

---

Bon test et merci pour votre évaluation !

