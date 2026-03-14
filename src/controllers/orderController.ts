import { OrderModel, Order, OrderItem } from '@/models';

export class OrderController {
  private orderModel: OrderModel;

  constructor(orderModel?: OrderModel) {
    this.orderModel = orderModel || new OrderModel();
  }

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>, items: Omit<OrderItem, 'id' | 'order_id'>[]): Promise<Order> {
    try {
      if (!orderData.customer_id || !orderData.customer_name || !orderData.customer_email) {
        throw new Error('Customer information is required');
      }

      if (!items || items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      const totalAmount = items.reduce((sum, item) => sum + item.line_total, 0);
      if (totalAmount !== orderData.total_amount) {
        throw new Error('Order total amount does not match items total');
      }

      return await this.orderModel.createOrder(orderData, items);
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const order = await this.orderModel.getOrderById(id);
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order');
    }
  }

  async getOrderWithItems(id: string): Promise<{
    order: Order;
    items: OrderItem[];
  } | null> {
    try {
      const order = await this.orderModel.getOrderById(id);
      if (!order) {
        return null;
      }

      const items = await this.orderModel.getOrderItems(id);

      return {
        order,
        items
      };
    } catch (error) {
      console.error('Error fetching order with items:', error);
      throw new Error('Failed to fetch order details');
    }
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    try {
      if (!customerId) {
        throw new Error('Customer ID is required');
      }
      return await this.orderModel.getOrdersByCustomer(customerId);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw new Error('Failed to fetch customer orders');
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      return await this.orderModel.getAllOrders();
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    try {
      return await this.orderModel.getOrdersByStatus(status);
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      throw new Error('Failed to fetch orders by status');
    }
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    try {
      const order = await this.orderModel.getOrderById(id);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status === 'completed' && status !== 'completed') {
        throw new Error('Cannot change status of completed order');
      }

      if (order.status === 'cancelled' && status !== 'cancelled') {
        throw new Error('Cannot change status of cancelled order');
      }

      return await this.orderModel.updateOrderStatus(id, status);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  async assignRider(orderId: string, riderId: string): Promise<Order> {
    try {
      const order = await this.orderModel.getOrderById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'confirmed' && order.status !== 'preparing') {
        throw new Error('Can only assign rider to confirmed or preparing orders');
      }

      return await this.orderModel.assignRider(orderId, riderId);
    } catch (error) {
      console.error('Error assigning rider:', error);
      throw new Error('Failed to assign rider');
    }
  }

  async getPendingOrders(): Promise<Order[]> {
    try {
      return await this.orderModel.getOrdersByStatus('pending');
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      throw new Error('Failed to fetch pending orders');
    }
  }

  async getActiveOrders(): Promise<Order[]> {
    try {
      const statuses: Order['status'][] = ['confirmed', 'preparing', 'ready'];
      const orders = await Promise.all(
        statuses.map(status => this.orderModel.getOrdersByStatus(status))
      );
      return orders.flat();
    } catch (error) {
      console.error('Error fetching active orders:', error);
      throw new Error('Failed to fetch active orders');
    }
  }

  validateOrderData(orderData: Partial<Order>): string[] {
    const errors: string[] = [];

    if (!orderData.customer_name || orderData.customer_name.trim() === '') {
      errors.push('Customer name is required');
    }

    if (!orderData.customer_email || orderData.customer_email.trim() === '') {
      errors.push('Customer email is required');
    }

    if (!orderData.customer_phone || orderData.customer_phone.trim() === '') {
      errors.push('Customer phone is required');
    }

    if (!orderData.delivery_address || orderData.delivery_address.trim() === '') {
      errors.push('Delivery address is required');
    }

    if (orderData.total_amount !== undefined && (orderData.total_amount < 0 || isNaN(orderData.total_amount))) {
      errors.push('Valid total amount is required');
    }

    return errors;
  }

  validateOrderItems(items: Omit<OrderItem, 'id' | 'order_id'>[]): string[] {
    const errors: string[] = [];

    if (!items || items.length === 0) {
      errors.push('Order must contain at least one item');
      return errors;
    }

    items.forEach((item, index) => {
      if (!item.product_name || item.product_name.trim() === '') {
        errors.push(`Item ${index + 1}: Product name is required`);
      }

      if (!item.quantity || item.quantity < 1) {
        errors.push(`Item ${index + 1}: Quantity must be at least 1`);
      }

      if (item.unit_price < 0 || isNaN(item.unit_price)) {
        errors.push(`Item ${index + 1}: Valid unit price is required`);
      }

      if (item.line_total < 0 || isNaN(item.line_total)) {
        errors.push(`Item ${index + 1}: Valid line total is required`);
      }
    });

    return errors;
  }
}
