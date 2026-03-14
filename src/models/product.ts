import { createClient } from '@/lib/supabase/client';

export interface Product {
  id: string;
  category_id?: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  stock_quantity?: number;
  has_sizes?: boolean;
  has_addons?: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price_modifier: number;
  sort_order?: number;
}

export interface ProductAddon {
  id: string;
  product_id: string;
  name: string;
  price: number;
  sort_order?: number;
}

export class ProductModel {
  private supabase = createClient();

  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('sort_order', { ascending: true })
      .order('name');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    return data || [];
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('sort_order', { ascending: true })
      .order('name');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    // Filter by category name after fetching (since we only have category_id in products)
    const { data: categories } = await this.supabase
      .from('categories')
      .select('id, name')
      .eq('name', category)
      .single();
      
    if (!categories) return [];
    
    return data?.filter(product => product.category_id === categories.id) || [];
  }

  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    const { data, error } = await this.supabase
      .from('product_sizes')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    return data || [];
  }

  async getAllAddons(): Promise<ProductAddon[]> {
    const { data, error } = await this.supabase
      .from('product_addons')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    return data || [];
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await this.supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    return data;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await this.supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    return data;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .update({ is_available: false })
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }
}
