export type UserRole = "admin" | "client" | "rider";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";
export type PaymentMethod = "cash" | "gcash" | "card" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  stock_quantity: number;
  has_sizes: boolean;
  has_addons: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  sizes?: ProductSize[];
  addons?: ProductAddon[];
}

export interface ProductSize {
  id: string;
  product_id: string;
  name: string;
  price_modifier: number;
  sort_order: number;
}

export interface ProductAddon {
  id: string;
  product_id: string;
  name: string;
  price: number;
  sort_order: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  rider_id: string | null;
  status: OrderStatus;
  order_type: "walkin" | "online" | "qr";
  subtotal: number;
  discount_amount: number;
  promo_code: string | null;
  delivery_fee: number;
  total: number;
  delivery_address: string | null;
  delivery_notes: string | null;
  customer_notes: string | null;
  table_number: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  payment?: Payment;
  rider?: Rider;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  size: string | null;
  quantity: number;
  unit_price: number;
  addons: { name: string; price: number }[];
  notes: string | null;
  line_total: number;
}

export interface Payment {
  id: string;
  order_id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  reference_number: string | null;
  paid_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Rider {
  id: string;
  user_id: string | null;
  vehicle_type: string | null;
  plate_number: string | null;
  photo_url: string | null;
  is_available: boolean;
  current_lat: number | null;
  current_lng: number | null;
  rating: number;
  total_deliveries: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Promo {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order: number;
  max_uses: number | null;
  used_count: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}
