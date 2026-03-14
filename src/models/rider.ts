import { createClient } from '@/lib/supabase/client';

export interface Rider {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  status: 'available' | 'busy' | 'offline';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  current_order_id: string | null;
  rating: number;
  total_deliveries: number;
  vehicle_type: 'motorcycle' | 'bicycle' | 'car';
  license_plate: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeliveryStats {
  totalDeliveries: number;
  completedDeliveries: number;
  averageDeliveryTime: number;
  earnings: number;
  rating: number;
}

export class RiderModel {
  private supabase = createClient();

  async createRider(rider: Omit<Rider, 'id' | 'created_at' | 'updated_at'>): Promise<Rider> {
    const { data, error } = await this.supabase
      .from('riders')
      .insert(rider)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getRiderById(id: string): Promise<Rider | null> {
    const { data, error } = await this.supabase
      .from('riders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getRiderByUserId(userId: string): Promise<Rider | null> {
    const { data, error } = await this.supabase
      .from('riders')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async getAllRiders(): Promise<Rider[]> {
    const { data, error } = await this.supabase
      .from('riders')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getAvailableRiders(): Promise<Rider[]> {
    const { data, error } = await this.supabase
      .from('riders')
      .select('*')
      .eq('status', 'available')
      .order('rating', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateRiderStatus(id: string, status: Rider['status']): Promise<Rider> {
    const { data, error } = await this.supabase
      .from('riders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateRiderLocation(id: string, location: Rider['location']): Promise<Rider> {
    const { data, error } = await this.supabase
      .from('riders')
      .update({ location, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async assignOrder(riderId: string, orderId: string): Promise<Rider> {
    const { data, error } = await this.supabase
      .from('riders')
      .update({ 
        current_order_id: orderId, 
        status: 'busy',
        updated_at: new Date().toISOString() 
      })
      .eq('id', riderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async completeOrder(riderId: string): Promise<Rider> {
    const { data, error } = await this.supabase
      .from('riders')
      .update({ 
        current_order_id: null, 
        status: 'available',
        updated_at: new Date().toISOString() 
      })
      .eq('id', riderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getRiderStats(riderId: string): Promise<DeliveryStats> {
    const { data: orders } = await this.supabase
      .from('orders')
      .select('*')
      .eq('rider_id', riderId)
      .eq('status', 'completed');

    const completedDeliveries = orders?.length || 0;
    const totalDeliveries = completedDeliveries;
    
    const averageDeliveryTime = orders && orders.length > 0
      ? orders.reduce((sum, order) => {
          if (order.actual_time && order.created_at) {
            const actual = new Date(order.actual_time).getTime();
            const created = new Date(order.created_at).getTime();
            return sum + (actual - created) / (1000 * 60); // minutes
          }
          return sum;
        }, 0) / orders.length
      : 0;

    const rider = await this.getRiderById(riderId);
    const rating = rider?.rating || 0;

    return {
      totalDeliveries,
      completedDeliveries,
      averageDeliveryTime,
      earnings: 0, // Calculate based on completed orders
      rating
    };
  }
}
