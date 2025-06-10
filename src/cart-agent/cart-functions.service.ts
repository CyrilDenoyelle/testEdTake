import { Injectable } from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import * as fs from 'fs';
import * as path from 'path';

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

  async addProduct(product: Product): Promise<string> {
    const cart = this.readCart();
    cart.push({ ...product });
    this.updateCart(cart);
    return `Le produit "${product.name}" a été ajouté au panier.`;
  }

  async removeProduct(productId: string): Promise<string> {
    const cart = this.readCart();
    const productIndex = cart.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return `Le produit n'a pas été trouvé dans le panier. (id: ${productId})`;
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
