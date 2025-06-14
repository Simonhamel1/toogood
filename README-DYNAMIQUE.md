# Site TooGood - Système Dynamique

## 🎯 Fonctionnalités

Ce site dispose maintenant d'un système de configuration dynamique qui permet de modifier facilement :

- **Nom de l'entreprise**
- **Adresse** 
- **Date de l'événement**
- **Heure de collecte**
- **Prix**
- **Logo** (choix parmi les logos disponibles)
- **Informations de collecte** (optionnel)

## 📁 Structure des fichiers

- `index.html` - Page d'administration pour modifier la configuration
- `reservation.html` - Page de réservation qui affiche les données dynamiques
- `config.js` - Gestionnaire de configuration (localStorage)
- `reservation.css` - Styles CSS
- `logo/` - Dossier contenant les logos disponibles
  - `starbucks-logo.png`
  - `les-halles-du-lavandiers.jpeg`

## 🚀 Utilisation

### 1. Configuration (Administration)
1. Ouvrez `index.html` dans votre navigateur
2. Remplissez les informations de votre événement
3. Choisissez un logo en cliquant dessus
4. Activez/désactivez les informations de collecte si nécessaire
5. Cliquez sur "Sauvegarder la configuration"

### 2. Visualisation (Page publique)
1. Cliquez sur "Voir la page de réservation" depuis l'administration
2. Ou ouvrez directement `reservation.html`
3. Toutes les données configurées s'affichent automatiquement

## 🔧 Fonctionnement technique

### Stockage des données
- Les configurations sont sauvegardées dans le **localStorage** du navigateur
- Les données persistent entre les sessions
- Aucune base de données externe requise

### Logos disponibles
- Le système détecte automatiquement les logos dans le dossier `logo/`
- Formats supportés : PNG, JPEG, JPG
- Les logos sont affichés dans l'interface de sélection

### Mise à jour en temps réel
- Les modifications dans `index.html` sont immédiatement visibles dans `reservation.html`
- Rechargez `reservation.html` après avoir modifié la configuration

## 🎨 Personnalisation

### Ajouter de nouveaux logos
1. Placez vos fichiers d'image dans le dossier `logo/`
2. Modifiez la fonction `getAvailableLogos()` dans `config.js`
3. Ajoutez vos nouveaux logos à la liste

### Modifier les champs
- Editez `index.html` pour ajouter de nouveaux champs de configuration
- Mettez à jour `config.js` pour gérer les nouvelles données
- Modifiez `reservation.html` pour afficher les nouvelles informations

## 🛠️ Dépannage

### La configuration ne se sauvegarde pas
- Vérifiez que JavaScript est activé
- Assurez-vous que le localStorage est disponible
- Ouvrez la console pour voir les erreurs éventuelles

### Les logos ne s'affichent pas
- Vérifiez que les fichiers existent dans le dossier `logo/`
- Vérifiez les chemins dans `config.js`
- Assurez-vous que les formats d'image sont supportés

### Les données ne s'affichent pas dans reservation.html
- Vérifiez que `config.js` est bien chargé
- Rechargez la page après avoir modifié la configuration
- Ouvrez la console pour voir les erreurs JavaScript

## 📱 Compatibilité

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Appareils mobiles et tablettes
- ✅ Fonctionne hors ligne une fois chargé
- ✅ PWA (Progressive Web App) compatible

## 🔐 Sécurité

- Les données sont stockées localement (pas de transmission réseau)
- Aucune donnée sensible n'est collectée
- Fonctionne entièrement côté client

---

💡 **Astuce** : Bookmarkez la page `index.html` pour un accès rapide à l'administration !
