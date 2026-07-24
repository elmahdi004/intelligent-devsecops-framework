import Address from '@/components/customers/Address';
import Cart_Tiles from '../../components/customers/Cart_Tiles';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { handleCreateOrder, handleFetchAllOrders } from '@/store/customer-slice/orders';
import { clearCart } from '@/store/customer-slice/cart';
import { useToast } from '@/hooks/use-toast';

function Payment() {
  const { cartProducts, cartId } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const token = localStorage.getItem('flint_token') ? localStorage.getItem('flint_token') : 'Invalid';

  const totalCartAmount =
    cartProducts && cartProducts.length > 0
      ? cartProducts
          .reduce((sum, item) => sum + (item?.SalePrice > 0 ? item.SalePrice : item.Price) * item.Quantity, 0)
          .toFixed(2)
      : 0;

  const FinalCheckoutTotal = (parseInt(totalCartAmount) + 10).toFixed(2);

  async function paymentRedirector() {
    if (selectedAddress === null) {
      toast({
        title: 'Select an address before proceeding to checkout',
        variant: 'destructive',
      });
      return;
    }

    setIsPlacingOrder(true);

    const orderData = {
      userId: user?.id,
      cartId,
      cartProducts,
      addressInfo: {
        AddressId: selectedAddress?._id,
        Address: selectedAddress?.Address,
        City: selectedAddress?.City,
        Pincode: selectedAddress?.Pincode,
        Contact: selectedAddress?.Contact,
        Landmark: selectedAddress?.Landmark !== null ? selectedAddress.Landmark : '',
      },
      orderStatus: 'Pending',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      totalAmount: FinalCheckoutTotal,
      orderCreationDate: new Date(),
      orderUpdationDate: new Date(),
    };

    try {
      const result = await dispatch(handleCreateOrder({ token, orderData })).unwrap();
      
      if (result?.success) {
        // Clear the cart
        dispatch(clearCart());
        localStorage.removeItem('cartItems'); // Clear local storage if any
        
        // Refresh orders list
        await dispatch(handleFetchAllOrders({ token, userId: user?.id }));
        
        toast({
          title: 'Order placed successfully!',
          description: `Order ID: ${result.orderId?.slice(-8).toUpperCase()}`,
          variant: 'default',
        });

        // Redirect to account page with orders tab
        setTimeout(() => {
          navigate('/shop/account');
        }, 1500);
      } else {
        setIsPlacingOrder(false);
        toast({
          title: 'Failed to place order. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setIsPlacingOrder(false);
      toast({
        title: error?.message || 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    }
  }

  if (cartProducts.length === 0) {
    return (
      <div className="flex h-[calc(100vh-200px)] flex-col justify-center items-center text-center px-4">
        <div className="w-48 h-48 mb-6">
          <img src="/empty-cart.png" alt="Empty Cart" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6 max-w-md">Browse our products and add items to your cart to proceed with checkout</p>
        <Button 
          onClick={() => window.location.href = '/shop/catalog'}
          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
        >
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Review your order and delivery information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Delivery Information & Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Delivery Information</h2>
              </div>
              <Address selectedId={selectedAddress?._id} setSelectedAddress={setSelectedAddress} />
            </div>

            {/* Cart Items Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
              </div>
              <div className="space-y-4">
                {cartProducts &&
                  cartProducts.length > 0 &&
                  cartProducts.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <Cart_Tiles cartItem={item} />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Total</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-semibold">{totalCartAmount} MAD</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900 font-semibold">10.00 MAD</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-red-600">{FinalCheckoutTotal} MAD</span>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-700">Payment Method</span>
                </div>
                <p className="text-sm text-gray-600">Cash on Delivery</p>
                <p className="text-xs text-gray-500 mt-1">Pay when you receive your order</p>
              </div>

              {/* Place Order Button */}
              <Button 
                onClick={paymentRedirector}
                disabled={!selectedAddress || isPlacingOrder}
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
              >
                {isPlacingOrder ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Placing Order...
                  </span>
                ) : (
                  'Place Order'
                )}
              </Button>

              {!selectedAddress && (
                <p className="text-sm text-red-500 mt-3 text-center">
                  Please select a delivery address
                </p>
              )}

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-2 text-sm text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;