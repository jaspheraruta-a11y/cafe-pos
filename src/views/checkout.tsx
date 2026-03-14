'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CartController } from '@/controllers/cartController';
import { OrderController } from '@/controllers/orderController';
import { CartItem } from '@/models/cart';

export default function CheckoutView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const cartController = new CartController();
  const orderController = new OrderController();

  const cartSummary = cartController.getCartSummary();

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const validationErrors = cartController.validateCart();
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
        throw new Error('Please fill in all required fields');
      }

      const orderData = {
        customer_id: '', // Will be set after user authentication
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        status: 'pending' as const,
        total_amount: cartSummary.total,
        payment_method: 'cash' as const,
        payment_status: 'pending' as const,
        delivery_address: customerInfo.address,
        delivery_notes: customerInfo.notes || null,
        rider_id: null,
        estimated_time: null,
        actual_time: null
      };

      const orderItems = cartSummary.items.map(item => ({
        product_id: item.productId,
        product_name: item.productName,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        addons: item.addons,
        notes: item.notes,
        line_total: item.lineTotal
      }));

      await orderController.createOrder(orderData, orderItems);
      cartController.clearCart();

      alert('Order placed successfully!');
      // Redirect to order confirmation page
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartSummary.isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-coffee-600 hover:bg-coffee-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  required
                  rows={3}
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={customerInfo.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                  placeholder="Special instructions for delivery..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-coffee-600 text-white py-3 px-4 rounded-md hover:bg-coffee-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartSummary.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                    {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                    {item.addons.length > 0 && (
                      <p className="text-sm text-gray-500">
                        Addons: {item.addons.map((addon: any) => addon.name).join(', ')}
                      </p>
                    )}
                    {item.notes && <p className="text-sm text-gray-500">Notes: {item.notes}</p>}
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {cartController.formatCurrency(item.lineTotal)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {cartController.formatCurrency(item.unitPrice)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{cartController.formatCurrency(cartSummary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>{cartController.formatCurrency(cartSummary.tax)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>{cartController.formatCurrency(cartSummary.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
