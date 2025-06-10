import { Injectable } from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import * as fs from 'fs';
import * as path from 'path';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { ToolNode } from '@langchain/langgraph/prebuilt';

@Injectable()
export class CartFunctionsService {
  private readonly cartFilePath = path.join(process.cwd(), 'data', 'cart.json');

  constructor() {
    this.initializeCartFile();
  }

  private initializeCartFile() {
    const dir = path.dirname(this.cartFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.cartFilePath)) {
      fs.writeFileSync(this.cartFilePath, JSON.stringify([]));
    }
  }

  private readCart(): Product[] {
    const data = fs.readFileSync(this.cartFilePath, 'utf8');
    return JSON.parse(data);
  }

  private updateCart(products: Product[]) {
    fs.writeFileSync(this.cartFilePath, JSON.stringify(products, null, 2));
  }

  getTools(): ToolNode {
    return new ToolNode([
      tool(this.addProduct.bind(this), {
        name: 'addProduct',
        description: 'Ajouter un produit au panier',
        schema: z.object({
          name: z.string().describe('Nom du produit'),
          url: z.string().describe('URL du produit'),
        }),
      }),
      tool(this.removeProduct.bind(this), {
        name: 'removeProduct',
        description: `Retirer un produit du panier. IMPORTANT: Utilise d'abord listProducts pour voir les produits disponibles et leur UUID. Ensuite, utilise l'UUID (et non pas l'index) du produit que tu souhaites retirer.`,
        schema: z.object({
          uuid: z.string().describe('Uuid du produit à retirer'),
        }),
      }),
      tool(this.listProducts.bind(this), {
        name: 'listProducts',
        description: 'Lister les produits dans le panier',
        schema: z.array(
          z.object({
            uuid: z.string().describe('Uuid du produit'),
            name: z.string().describe('Nom du produit'),
            url: z.string().describe('URL du produit'),
          }),
        ),
      }),
    ]);
  }

  async addProduct(product: Product): Promise<string> {
    const cart = this.readCart();
    cart.push({ uuid: uuidv4(), ...product });
    this.updateCart(cart);
    return `Le produit "${product.name}" a été ajouté au panier.`;
  }

  async removeProduct(productUuid: string): Promise<string> {
    const cart = this.readCart();
    const productIndex = cart.findIndex((p) => p.uuid === productUuid);

    if (productIndex === -1) {
      return `Le produit n'a pas été trouvé dans le panier. (id: ${productUuid})`;
    }

    const removedProduct = cart[productIndex];
    cart.splice(productIndex, 1);
    this.updateCart(cart);

    return `Le produit "${removedProduct.name}" a été retiré du panier.`;
  }

  async listProducts(): Promise<string> {
    const cart = this.readCart();
    if (cart.length === 0) {
      return 'Le panier est vide.';
    }

    const productList = cart.map((p) => `- ${p.name} (${p.url})`).join('\n');
    return `Le panier contient les articles suivants :\n${productList}`;
  }
}
