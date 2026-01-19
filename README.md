# LE PARQUET PARISIEN - Rénovation de Luxe 🪵✨

Application web haut de gamme pour la rénovation de parquet à Paris, intégrant des fonctionnalités d'Intelligence Artificielle pour l'estimation et la visualisation.

![Bannière](https://i.postimg.cc/52hvcVf0/Generated-Image-January-19-2026-12-39AM.jpg)

## 🚀 Fonctionnalités Clés

### 1. Simulateur de Prix Intelligent 💰
- Calcul instantané basé sur les tarifs officiels des artisans parisiens.
- Logique stricte : 35€/m² (Bon/Moyen) vs 40€/m² (Abîmé).
- Génération de devis avec fourchette de prix et durée estimée.

### 2. Visualisateur IA (Avant/Après) 🎨
- **Technologie** : Google Gemini 2.5 Flash Image.
- Permet aux utilisateurs de télécharger une photo de leur sol abîmé.
- Génère une rénovation photoréaliste (Vitrification Mate, Brillante, Huilée...).
- Slider interactif "Avant/Après".

### 3. Assistant Virtuel & Chatbot 🤖
- Chatbot contextuel alimenté par Gemini 3 Pro.
- Répond aux questions techniques et aide à la réservation.
- Déclencheurs de conversion (Lead Magnet).

### 4. UX/UI Haute Conversion ⚡
- Design mobile-first.
- Badges d'urgence et preuve sociale (Notifications en temps réel).
- Intégration WhatsApp et Appels directs.

## 🛠 Stack Technique

- **Framework** : React 19
- **Styling** : Tailwind CSS
- **AI/ML** : Google GenAI SDK (`@google/genai`)
- **Icons** : Lucide React

## 📦 Installation & Déploiement

### Configuration de l'environnement
Pour que les fonctionnalités IA fonctionnent (Visualisateur, Chatbot), vous devez configurer la variable d'environnement :
`API_KEY` = `votre_clé_google_ai`

### Déploiement (Netlify)
1. Pousser ce code sur GitHub.
2. Connecter le repo à Netlify.
3. Dans **Site Settings > Environment Variables**, ajouter `API_KEY`.
4. Déployer.

## 📝 Auteur
Le Parquet Parisien - Expert Rénovation Paris & Île-de-France.
