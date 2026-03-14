'use client';

import { useState, useEffect } from 'react';
import { OrderController } from '@/controllers/orderController';
import { ProductController } from '@/controllers/productController';
import { Order, OrderItem, Product } from '@/models';

export default function OrderView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderController = new OrderController();
  const productController = new ProductController();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const allOrders = await orderController.getAllOrders();
        setOrders(allOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [orderController]);

  const handleSelectOrder = async (order: Order) => {
    try {
      setSelectedOrder(order);
      const orderWithItems = await orderController.getOrderWithItems(order.id);
      if (orderWithItems) {
        setOrderItems(orderWithItems.items);
      }
    } catch (err) {
      console.error('Error loading order items:', err);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await orderController.updateOrderStatus(orderId, status);
      const updatedOrders = await orderController.getAllOrders();
      setOrders(updatedOrders);
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'ready': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-coffee-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-2">View and manage customer orders</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => handleSelectOrder(order)}
                    className={`px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      selectedOrder?.id === order.id ? 'bg-coffee-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-500">{order.customer_name}</p>
                        <p className="text-sm text-gray-500">
                          ${order.total_amount.toFixed(2)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Order #{selectedOrder.id.slice(0, 8)}
                    </h2>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as Order['status'])}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="p-6">
                  {/* Customer Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">{selectedOrder.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{selectedOrder.customer_email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">{selectedOrder.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Delivery Address</p>
                        <p className="font-medium text-gray-900">{selectedOrder.delivery_address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {orderItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b">
                          <div>
                            <p className="font-medium text-gray-900">{item.product_name}</p>
                            {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                            {item.addons.length > 0 && (
                              <p className="text-sm text-gray-500">
                                Addons: {item.addons.map((addon: any) => addon.name).join(', ')}
                              </p>
                            )}
                            {item.notes && <p className="text-sm text-gray-500">Notes: {item.notes}</p>}
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              ${item.line_total.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${item.unit_price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${selectedOrder.total_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax (10%)</span>
                        <span>${(selectedOrder.total_amount * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg text-gray-900 pt-2 border-t">
                        <span>Total</span>
                        <span>${(selectedOrder.total_amount * 1.1).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="border-t pt-4 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-medium text-gray-900 capitalize">{selectedOrder.payment_method}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <p className="font-medium text-gray-900 capitalize">{selectedOrder.payment_status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="border-t pt-4 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Order Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Order Placed</p>
                          <p className="text-sm text-gray-500">
                            {new Date(selectedOrder.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {selectedOrder.actual_time && (
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-900">Order Completed</p>
                            <p className="text-sm text-gray-500">
                              {new Date(selectedOrder.actual_time).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">Select an order from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
