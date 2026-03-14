'use client';

import { useState, useEffect } from 'react';
import { ProductController } from '@/controllers/productController';
import { OrderController } from '@/controllers/orderController';
import { UserController } from '@/controllers/userController';
import { RiderController } from '@/controllers/riderController';
import { Product, Order, User, Rider } from '@/models';

export default function AdminView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productController = new ProductController();
  const orderController = new OrderController();
  const userController = new UserController();
  const riderController = new RiderController();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, ordersData, usersData, ridersData] = await Promise.all([
          productController.getAllProducts(),
          orderController.getAllOrders(),
          userController.getAllUsers(),
          riderController.getAllRiders()
        ]);

        setProducts(productsData);
        setOrders(ordersData);
        setUsers(usersData);
        setRiders(ridersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productController, orderController, riderController, userController]);

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await orderController.updateOrderStatus(orderId, status);
      const updatedOrders = await orderController.getAllOrders();
      setOrders(updatedOrders);
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleAssignRider = async (orderId: string, riderId: string) => {
    try {
      await orderController.assignRider(orderId, riderId);
      const updatedOrders = await orderController.getAllOrders();
      setOrders(updatedOrders);
    } catch (err) {
      console.error('Error assigning rider:', err);
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
            <p className="text-3xl font-bold text-coffee-600 mt-2">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
            <p className="text-3xl font-bold text-coffee-600 mt-2">{orders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
            <p className="text-3xl font-bold text-coffee-600 mt-2">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Riders</h3>
            <p className="text-3xl font-bold text-coffee-600 mt-2">{riders.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-500">{order.customer_name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
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
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Available Riders</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {riders.filter(rider => rider.status === 'available').map((rider) => (
                  <div key={rider.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{rider.name}</p>
                      <p className="text-sm text-gray-500">{rider.phone}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Rating: {rider.rating.toFixed(1)}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800`}>
                        Available
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
