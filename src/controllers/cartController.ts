import { CartModel, CartItem, CartAddon } from '@/models';
import { useCart } from '@/store/cart';

export class CartController {
  private cart = useCart.getState();
  private unsubscribe: (() => void) | null = null;

  constructor() {
    this.unsubscribe = useCart.subscribe((state) => {
      this.cart = state;
    });
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  addItem(item: Omit<CartItem, "lineTotal">): void {
    try {
      const isValid = CartModel.validateCartItem(item);
      if (!isValid) {
        throw new Error('Invalid cart item data');
      }

      useCart.getState().addItem(item);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw new Error('Failed to add item to cart');
    }
  }

  updateQuantity(index: number, quantity: number): void {
    try {
      if (index < 0 || index >= this.cart.items.length) {
        throw new Error('Invalid item index');
      }

      if (quantity < 1 || isNaN(quantity)) {
        throw new Error('Invalid quantity');
      }

      useCart.getState().updateQuantity(index, quantity);
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  }

  removeItem(index: number): void {
    try {
      if (index < 0 || index >= this.cart.items.length) {
        throw new Error('Invalid item index');
      }

      useCart.getState().removeItem(index);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw new Error('Failed to remove item from cart');
    }
  }

  clearCart(): void {
    try {
      useCart.getState().clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error('Failed to clear cart');
    }
  }

  getItems(): CartItem[] {
    return this.cart.items;
  }

  getSubtotal(): number {
    return this.cart.subtotal();
  }

  getTax(taxRate: number = 0.1): number {
    const subtotal = this.getSubtotal();
    return CartModel.calculateTax(subtotal, taxRate);
  }

  getTotal(taxRate: number = 0.1, deliveryFee: number = 0): number {
    const subtotal = this.getSubtotal();
    const tax = this.getTax(taxRate);
    return CartModel.calculateTotal(subtotal, tax, deliveryFee);
  }

  getItemCount(): number {
    return this.cart.items.length;
  }

  getTotalQuantity(): number {
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  isEmpty(): boolean {
    return this.cart.items.length === 0;
  }

  formatCurrency(amount: number): string {
    return CartModel.formatCurrency(amount);
  }

  getCartSummary(): {
    items: CartItem[];
    itemCount: number;
    totalQuantity: number;
    subtotal: number;
    tax: number;
    total: number;
    isEmpty: boolean;
  } {
    const subtotal = this.getSubtotal();
    const tax = this.getTax();
    const total = this.getTotal();

    return {
      items: this.getItems(),
      itemCount: this.getItemCount(),
      totalQuantity: this.getTotalQuantity(),
      subtotal,
      tax,
      total,
      isEmpty: this.isEmpty()
    };
  }

  validateCart(): string[] {
    const errors: string[] = [];

    if (this.isEmpty()) {
      errors.push('Cart is empty');
      return errors;
    }

    this.cart.items.forEach((item, index) => {
      const isValid = CartModel.validateCartItem(item);
      if (!isValid) {
        errors.push(`Item ${index + 1}: Invalid item data`);
      }
    });

    return errors;
  }

  addItemWithValidation(item: Omit<CartItem, "lineTotal">): {
    success: boolean;
    error?: string;
  } {
    try {
      const isValid = CartModel.validateCartItem(item);
      if (!isValid) {
        return {
          success: false,
          error: 'Invalid cart item data'
        };
      }

      this.addItem(item);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add item'
      };
    }
  }

  hasProduct(productId: string): boolean {
    return this.cart.items.some(item => item.productId === productId);
  }

  getItemIndex(productId: string, size?: string): number {
    return this.cart.items.findIndex(item => 
      item.productId === productId && 
      (size === undefined || item.size === size)
    );
  }

  updateItemQuantity(productId: string, quantity: number, size?: string): void {
    if (quantity < 1 || isNaN(quantity)) {
      throw new Error('Invalid quantity');
    }
    
    const index = this.getItemIndex(productId, size);
    if (index === -1) {
      throw new Error('Item not found in cart');
    }
    this.updateQuantity(index, quantity);
  }

  removeItemById(productId: string, size?: string): void {
    const index = this.getItemIndex(productId, size);
    if (index === -1) {
      throw new Error('Item not found in cart');
    }
    this.removeItem(index);
  }
}
