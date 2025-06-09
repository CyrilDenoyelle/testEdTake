# Test Technique Développeur Fullstack

## Objectif

Ce test technique a pour but d’évaluer votre capacité à :

- Prendre rapidement en main une technologie que vous ne connaissez pas (**Langgraph**).
- Structurer une application backend (**NestJS**) avec réflexion et méthode.
- Créer un workflow entre des agents communicants dans un contexte défini.

---

## Contexte

Vous devez développer une application backend permettant de gérer un panier d’achat avec des produits et des recommandations basées sur des recherches en ligne. Cette application s’articule autour de trois agents :

1. **Agent de Gestion de Panier** :  
   Gère les actions liées à un panier d'achat (ajout, suppression et affichage des produits).

2. **Agent Tavily** :  
   Effectue des recherches sur Internet pour trouver des informations ou des suggestions pouvant enrichir le panier.

3. **Agent Coordinateur** :  
   Coordonne les actions entre les agents, orchestre les appels et synthétise une réponse pour l’utilisateur.

L’utilisateur interagit uniquement avec l’agent Coordinateur via un endpoint unique.

---

## Détails Techniques

### 1. Endpoint Unique

- L’application expose un seul endpoint :
  ```
  GET /invoke?query={user_query}
  ```
- **Paramètre attendu** :
  - `query` (chaîne de caractères) : La requête de l’utilisateur (exemple : "Je souhaite acheter un sapin pour Noël, cherche chez Ikea si un sapin est disponible et ajoute-le au panier").
- **Retour attendu** :
  - Une chaîne de caractères correspondant au message final généré par l’agent Coordinateur.

### 2. Agent de Gestion de Panier

- Actions prises en charge :
  - Ajouter un produit au panier.
  - Supprimer un produit du panier.
  - Lister les produits.
- Schéma des produits dans le panier :
  ```json
  {
    "id": "string",
    "name": "string",
    "url": "string"
  }
  ```
- Les données peuvent être stockées dans un simple fichier JSON.
- Toutes les actions passent par les outils de l’agent, pas besoin d'API directe pour le panier.

### 3. Agent Tavily

- Effectue des recherches sur Internet.
- Aucun type de recherche spécifique n’est imposé.
- Les résultats de recherche sont utilisés uniquement par l'agent de gestion de panier (par exemple, pour ajouter un produit recommandé).

### 4. Agent Coordinateur

- Décide de l’ordre et de la nécessité d’appeler les autres agents pour répondre à une requête utilisateur.
- Génère une réponse finale sous forme de chaîne de caractères, renvoyée par le endpoint `/invoke`.
- Aucune gestion d’erreur n’est requise.

---

## Exemples de Requêtes et Réponses

### Requête utilisateur

```
GET /invoke?query=Je souhaite acheter un sapin pour Noël, chercher chez Ikea si un sapin est disponible et ajoute-le au panier
```

### Réponse attendue (exemple)

```
Le produit "Sapin de Noël artificiel" a été ajouté au panier depuis Ikea : https://www.ikea.com/sapin.
```

### Requête utilisateur

```
GET /invoke?query=Affiche mon panier
```

### Réponse attendue (exemple)

```
Votre panier contient les articles suivants : "Sapin de Noël artificiel - [Lien IKEA](https://www.ikea.com/fr/fr/campaigns/sapin-pub4f579e51/)
```

---

## Consignes

- **Librairie Langgraph** : Si vous n'avez jamais utilisé la librairie, pas de panique c'est normal ! Quelques liens utiles pour vous aider:
  [Tutorials](https://langchain-ai.github.io/langgraphjs/)
  | [Basic Multi-agent Collaboration](https://langchain-ai.github.io/langgraphjs/tutorials/multi_agent/multi_agent_collaboration/)
- **Langsmith**: N'hésitez pas à configurer Langsmith pour observer les échanges entre vos agents. Il existe une version gratuite et c'est un outil très facile à mettre en place.
- **Tests** : Les tests unitaires ne sont pas requis.
- **Structure** : Vous êtes libre de structurer le projet **NestJS** comme vous le souhaitez.
- **Livrables** :
  - Un dépôt Git contenant votre code.
  - Un fichier `README.md` expliquant :
    - Comment lancer l’application.
    - Une description de votre approche, ainsi que quelques pistes d'améloration pour l'application.
