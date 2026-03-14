import { ProductModel, Product, ProductVariant, ProductAddon } from '@/models';

export class ProductController {
  private productModel: ProductModel;

  constructor(productModel?: ProductModel) {
    this.productModel = productModel || new ProductModel();
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.productModel.getAllProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const product = await this.productModel.getProductById(id);
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      return await this.productModel.getProductsByCategory(category);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw new Error('Failed to fetch products by category');
    }
  }

  async getProductWithVariants(id: string): Promise<{
    product: Product;
    variants: ProductVariant[];
    addons: ProductAddon[];
  } | null> {
    try {
      const product = await this.productModel.getProductById(id);
      if (!product) {
        return null;
      }

      const [variants, addons] = await Promise.all([
        this.productModel.getProductVariants(id),
        this.productModel.getAllAddons()
      ]);

      return {
        product,
        variants,
        addons
      };
    } catch (error) {
      console.error('Error fetching product with variants:', error);
      throw new Error('Failed to fetch product details');
    }
  }

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    try {
      if (!productData.name || !productData.price || productData.price < 0) {
        throw new Error('Invalid product data');
      }

      return await this.productModel.createProduct(productData);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const existingProduct = await this.productModel.getProductById(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      if (updates.price !== undefined && updates.price < 0) {
        throw new Error('Price cannot be negative');
      }

      return await this.productModel.updateProduct(id, updates);
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const existingProduct = await this.productModel.getProductById(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      await this.productModel.deleteProduct(id);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  async getAvailableAddons(): Promise<ProductAddon[]> {
    try {
      return await this.productModel.getAllAddons();
    } catch (error) {
      console.error('Error fetching addons:', error);
      throw new Error('Failed to fetch addons');
    }
  }

  validateProductData(productData: Partial<Product>): string[] {
    const errors: string[] = [];

    if (!productData.name || productData.name.trim() === '') {
      errors.push('Product name is required');
    }

    if (productData.price !== undefined && (productData.price < 0 || isNaN(productData.price))) {
      errors.push('Valid price is required');
    }

    // Note: category_id is optional in the new schema, so we don't validate it here

    return errors;
  }
}
