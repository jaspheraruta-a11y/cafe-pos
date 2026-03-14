import { createClient } from '@/lib/supabase/client';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  size: string | null;
  quantity: number;
  unit_price: number;
  addons: { name: string; price: number }[];
  notes: string | null;
  line_total: number;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total_amount: number;
  payment_method: 'cash' | 'card' | 'online';
  payment_status: 'pending' | 'paid' | 'refunded';
  delivery_address: string;
  delivery_notes: string | null;
  rider_id: string | null;
  estimated_time: string | null;
  actual_time: string | null;
  created_at: string;
  updated_at: string;
}

export class OrderModel {
  private supabase = createClient();

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>, items: Omit<OrderItem, 'id' | 'order_id'>[]): Promise<Order> {
    const { data: orderData, error: orderError } = await this.supabase
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map(item => ({
      ...item,
      order_id: orderData.id
    }));

    const { error: itemsError } = await this.supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return orderData;
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async assignRider(orderId: string, riderId: string): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ rider_id: riderId, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await this.supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) throw error;
    return data || [];
  }
}
