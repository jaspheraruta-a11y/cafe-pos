import { createClient } from '@/lib/supabase/client';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin' | 'rider';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  default_address: string;
  preferences: {
    dietary_restrictions: string[];
    favorite_items: string[];
  };
}

export class UserModel {
  private supabase = createClient();

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUsersByRole(role: User['role']): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async createUserProfile(profile: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
