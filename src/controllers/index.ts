// Controller exports with proper organization
export { ProductController } from './productController';
export { OrderController } from './orderController';
export { UserController } from './userController';
export { CartController } from './cartController';
export { RiderController } from './riderController';

// Type exports for better IntelliSense and tree-shaking
export type { Product, ProductVariant, ProductAddon } from '@/models/product';
export type { Order, OrderItem } from '@/models/order';
export type { User, UserProfile } from '@/models/user';
export type { CartItem, CartAddon } from '@/models/cart';
export type { Rider, DeliveryStats } from '@/models/rider';

// Model exports for controller instantiation
export { ProductModel } from '@/models/product';
export { OrderModel } from '@/models/order';
export { UserModel } from '@/models/user';
export { CartModel } from '@/models/cart';
export { RiderModel } from '@/models/rider';
