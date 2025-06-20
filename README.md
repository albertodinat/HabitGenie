# Béga+ – Mobile Orthophonie Companion

Béga+ est une application mobile construite avec **React Native (Expo)** pour faciliter le suivi orthophonique entre les séances. L'accès est sécurisé via Firebase Auth et chaque utilisateur choisit son rôle lors de l'inscription.

## Fonctionnalités principales

### Authentification
- Création de compte par e‑mail/mot de passe
- Choix du rôle `orthophonist` ou `patient`

### Espace Orthophoniste
- **Gestion des patients** : liste de ses patients issue de Firestore
- **Programmes hebdomadaires** : création des exercices pour chaque jour de la semaine
- **Suivi** : consultation du taux d'accomplissement quotidien des patients
- **Rendez‑vous** : création, modification et suppression. Les patients reçoivent automatiquement des notifications lors de la création puis la veille à 18 h et le jour J trois heures avant.

### Espace Patient
- **Programme personnalisé** avec marquage quotidien des exercices réalisés
- **Rendez‑vous** : affichage des rendez‑vous à venir
- **Notifications push** : rappel automatisé grâce au token enregistré dans Firestore

## Notifications push
Les notifications sont gérées par des **Cloud Functions Firebase** (voir `functions/index.js`). Pour activer l'envoi dans l'environnement de développement, ajoutez la variable suivante dans `.env` :

```bash
ENABLE_NOTIFICATIONS=true
```

## Tests
Des tests unitaires sont disponibles via **Jest** :

```bash
npm install
npm test
```

