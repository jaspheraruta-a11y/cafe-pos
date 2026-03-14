'use client';

import { useState, useEffect } from 'react';
import { RiderController } from '@/controllers/riderController';
import { OrderController } from '@/controllers/orderController';
import { Rider, Order, DeliveryStats } from '@/models';

export default function RiderView() {
  const [rider, setRider] = useState<Rider | null>(null);
  const [stats, setStats] = useState<DeliveryStats | null>(null);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const riderController = new RiderController();
  const orderController = new OrderController();

  useEffect(() => {
    const loadRiderData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you'd get the rider ID from authentication
        const riderId = 'current-rider-id'; // Placeholder
        
        const [riderData, riderStats, pendingOrders] = await Promise.all([
          riderController.getRiderById(riderId),
          riderController.getRiderStats(riderId),
          orderController.getPendingOrders()
        ]);

        setRider(riderData);
        setStats(riderStats);
        setAvailableOrders(pendingOrders);

        if (riderData?.current_order_id) {
          const orderData = await orderController.getOrderById(riderData.current_order_id);
          setCurrentOrder(orderData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load rider data');
      } finally {
        setLoading(false);
      }
    };

    loadRiderData();
  }, [orderController, riderController]);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      if (!rider) return;
      
      await riderController.assignOrder(rider.id, orderId);
      await orderController.updateOrderStatus(orderId, 'confirmed');
      
      const updatedRider = await riderController.getRiderById(rider.id);
      setRider(updatedRider);
      
      const orderData = await orderController.getOrderById(orderId);
      setCurrentOrder(orderData);
      
      const updatedOrders = availableOrders.filter(order => order.id !== orderId);
      setAvailableOrders(updatedOrders);
    } catch (err) {
      console.error('Error accepting order:', err);
    }
  };

  const handleCompleteOrder = async () => {
    try {
      if (!rider || !currentOrder) return;
      
      await orderController.updateOrderStatus(currentOrder.id, 'completed');
      await riderController.completeOrder(rider.id);
      
      const updatedRider = await riderController.getRiderById(rider.id);
      setRider(updatedRider);
      setCurrentOrder(null);
      
      const updatedStats = await riderController.getRiderStats(rider.id);
      setStats(updatedStats);
    } catch (err) {
      console.error('Error completing order:', err);
    }
  };

  const handleUpdateStatus = async (status: Rider['status']) => {
    try {
      if (!rider) return;
      
      await riderController.updateRiderStatus(rider.id, status);
      const updatedRider = await riderController.getRiderById(rider.id);
      setRider(updatedRider);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getStatusColor = (status: Rider['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Rider Dashboard
                </h1>
                <p className="text-gray-600 mt-2">Manage your deliveries and earnings</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(rider?.status || 'offline')}`}>
                  {rider?.status || 'Offline'}
                </span>
                {rider?.status === 'offline' ? (
                  <button
                    onClick={() => handleUpdateStatus('available')}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Go Online
                  </button>
                ) : rider?.status === 'available' ? (
                  <button
                    onClick={() => handleUpdateStatus('offline')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Go Offline
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Deliveries</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalDeliveries}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">{stats.completedDeliveries}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Average Time</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {Math.round(stats.averageDeliveryTime)} min
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Rating</h3>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {rider?.rating.toFixed(1)} ⭐
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Order */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentOrder ? 'Current Delivery' : 'No Active Delivery'}
              </h2>
            </div>
            <div className="p-6">
              {currentOrder ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Order #{currentOrder.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-500">Customer: {currentOrder.customer_name}</p>
                    <p className="text-sm text-gray-500">Phone: {currentOrder.customer_phone}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                    <p className="text-gray-600">{currentOrder.delivery_address}</p>
                    {currentOrder.delivery_notes && (
                      <p className="text-sm text-gray-500 mt-1">Notes: {currentOrder.delivery_notes}</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                    <p className="text-gray-600">Total: ${currentOrder.total_amount.toFixed(2)}</p>
                    <p className="text-gray-600">Payment: {currentOrder.payment_method}</p>
                  </div>

                  <button
                    onClick={handleCompleteOrder}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    Mark as Delivered
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>You don&apos;t have any active deliveries</p>
                  {rider?.status === 'available' && availableOrders.length > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      Check available orders on the right
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Available Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Available Orders ({availableOrders.length})
              </h2>
            </div>
            <div className="p-6">
              {availableOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No available orders at the moment</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {availableOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Order #{order.id.slice(0, 8)}
                          </h3>
                          <p className="text-sm text-gray-500">{order.customer_name}</p>
                          <p className="text-sm text-gray-500">{order.customer_phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${order.total_amount.toFixed(2)}
                          </p>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <p>Delivery: {order.delivery_address}</p>
                        <p>Payment: {order.payment_method}</p>
                      </div>

                      <button
                        onClick={() => handleAcceptOrder(order.id)}
                        disabled={rider?.status !== 'available'}
                        className="w-full bg-coffee-600 text-white py-2 px-4 rounded-md hover:bg-coffee-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {rider?.status === 'available' ? 'Accept Order' : 'Go Online to Accept'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
