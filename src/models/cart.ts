export interface CartAddon {
  name: string;
  price: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  size: string | null;
  quantity: number;
  unitPrice: number;
  addons: CartAddon[];
  notes: string | null;
  lineTotal: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "lineTotal">) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  subtotal: () => number;
}

export class CartModel {
  static calculateLineTotal(item: Omit<CartItem, "lineTotal">): number {
    const addonsTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0);
    return (item.unitPrice + addonsTotal) * item.quantity;
  }

  static calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.lineTotal, 0);
  }

  static calculateTax(subtotal: number, taxRate: number = 0.1): number {
    return subtotal * taxRate;
  }

  static calculateTotal(subtotal: number, tax: number, deliveryFee: number = 0): number {
    return subtotal + tax + deliveryFee;
  }

  static validateCartItem(item: Omit<CartItem, "lineTotal">): boolean {
    return (
      item.productId.trim() !== "" &&
      item.productName.trim() !== "" &&
      item.quantity > 0 &&
      item.unitPrice >= 0 &&
      item.addons.every(addon => addon.name.trim() !== "" && addon.price >= 0)
    );
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
