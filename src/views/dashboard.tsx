'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { OrderController } from '@/controllers/orderController';
import { UserController } from '@/controllers/userController';
import { Order, User } from '@/models';

export default function DashboardView() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderController = new OrderController();
  const userController = new UserController();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you'd get the user ID from authentication
        const userId = 'current-user-id'; // Placeholder
        
        const [userData, userOrders] = await Promise.all([
          userController.getUserById(userId),
          orderController.getOrdersByCustomer(userId)
        ]);

        setUser(userData);
        setOrders(userOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [orderController, userController]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await orderController.updateOrderStatus(orderId, 'cancelled');
      const updatedOrders = await orderController.getOrdersByCustomer(user?.id || '');
      setOrders(updatedOrders);
    } catch (err) {
      console.error('Error cancelling order:', err);
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
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600 mt-2">Manage your orders and account settings</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{user?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium text-gray-900 capitalize">{user?.role}</p>
                </div>
              </div>
              <button className="mt-6 w-full bg-coffee-600 text-white py-2 px-4 rounded-md hover:bg-coffee-700">
                Edit Profile
              </button>
            </div>

            {/* Order Statistics */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold text-gray-900">{orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Orders</span>
                  <span className="font-semibold text-gray-900">
                    {orders.filter(order => order.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Orders</span>
                  <span className="font-semibold text-gray-900">
                    {orders.filter(order => order.status === 'pending' || order.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-semibold text-gray-900">
                    ${orders
                      .filter(order => order.status === 'completed')
                      .reduce((total, order) => total + order.total_amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              </div>
              <div className="p-6">
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p>You haven&apos;t placed any orders yet</p>
                    <Link href="/" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-coffee-600 hover:bg-coffee-700">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Order #{order.id.slice(0, 8)}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                              ${order.total_amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-600">
                          <p>Delivery: {order.delivery_address}</p>
                          <p>Payment: {order.payment_method} - {order.payment_status}</p>
                        </div>

                        {(order.status === 'pending' || order.status === 'confirmed') && (
                          <div className="mt-4 flex space-x-2">
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50"
                            >
                              Cancel Order
                            </button>
                            <button className="px-3 py-1 text-sm border border-coffee-300 text-coffee-700 rounded hover:bg-coffee-50">
                              View Details
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
