<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

create a .env file

```
OPENAI_API_KEY="<openai-api-key>"
TAVILY_API_KEY="<tavily-api-key>
```
## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Approche

Ce projet utilise une architecture basée sur des agents autonomes pour gérer un système de panier d'achat:

- Un agent coordinateur qui orchestre les interactions entre les agents d'actions.
- Un agent de recherche qui gère la recherche de produits.
- Un agent de gestion du panier qui s'occupe des opérations "CRUD" sur le panier.

Chaque agent est spécialisé dans une tâche spécifique et peut fonctionner de manière indépendante.
(j'ai mis des endpoints pour pouvoir tester chaque agent séparément)

Pour avoir la main sur la conf de base de tout les agents au même endroit: le code de création d'agent est centralisé dans un seul service `AgentService` qui est réutilisé par tous les agents.

## Problèmes

- l'agent coordinateur ne donne pas le résultat de la recherche a l'agent de gestion du panier
- c'est très lent
- la suppression d'un produit ne fonctionne pas, l'agent essai d'utiliser l'index au lieu du uuid, alors qu'il a accés aux résultats de la lecture du panier

## Améliorations possibles

- Utiliser StateGraph et Edges plutôt qu'un agent coordinateur
- Gerer plusieurs produits du même type
- Gerer plusieurs utilisateurs, un thread id par utilisateur ?
