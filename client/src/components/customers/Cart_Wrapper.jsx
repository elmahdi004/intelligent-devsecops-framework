import { Button } from "../ui/button";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import Cart_Tiles from "./Cart_Tiles";
import { useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";
import { useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";

function Cart_Wrapper({ cartProducts, setOpenCartSheet }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Calculate the total cart amount
  const totalCartAmount =
    cartProducts && cartProducts.length > 0
      ? cartProducts
          .reduce((sum, item) => {
            const price = item.SalePrice > 0 ? item.SalePrice : item.Price;
            return sum + (isNaN(price) ? 0 : price * item.Quantity);
          }, 0)
          .toFixed(2)
      : 0;

  // Calculate the final checkout total (including delivery fee)
  const deliveryFee = 10.0; // Fixed delivery fee
  const FinalCheckoutTotal = (parseFloat(totalCartAmount) + deliveryFee).toFixed(2);

  // Handle unauthenticated users
  if (!user) {
    return (
      <SheetContent className="w-full sm:w-[400px] md:w-[450px] overflow-y-auto bg-white">
        <SheetHeader className="pb-4 border-b border-gray-200">
          <SheetTitle className="text-2xl font-bold text-gray-900">Your Cart</SheetTitle>
          <SheetDescription className="text-gray-600">Please log in to view your cart</SheetDescription>
        </SheetHeader>
        <div className="mt-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 mb-2">Login Required</p>
            <p className="text-sm text-gray-600">You need to log in to view your cart</p>
          </div>
          <Button
            onClick={() => {
              navigate("/auth/login");
              setOpenCartSheet(false);
            }}
            className="mt-4 px-8 bg-red-500 hover:bg-red-600"
          >
            Log In
          </Button>
        </div>
      </SheetContent>
    );
  }

  return (
    <SheetContent className="w-full sm:w-[400px] md:w-[450px] overflow-y-auto bg-white">
      <SheetHeader className="pb-4 border-b border-gray-200">
        <SheetTitle className="text-2xl font-bold text-gray-900">Your Cart</SheetTitle>
        <SheetDescription className="text-gray-600">Review your items and proceed to checkout</SheetDescription>
      </SheetHeader>
      <div className="mt-6 space-y-4 max-h-[50vh] overflow-y-auto">
        {cartProducts && cartProducts.length > 0 ? (
          cartProducts.map((item, index) => <Cart_Tiles key={index} cartItem={item} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <img src="/empty-cart.png" alt="Empty Cart" className="w-48 h-48 object-contain mb-4" />
            <p className="text-gray-600 font-medium">Your cart is empty</p>
            <p className="text-sm text-gray-500 mt-1">Start shopping to add items</p>
          </div>
        )}
      </div>
      {cartProducts && cartProducts.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-medium">{totalCartAmount} MAD</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-gray-900 font-medium">{deliveryFee.toFixed(2)} MAD</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-red-600">{FinalCheckoutTotal} MAD</span>
            </div>
          </div>
        </div>
      )}
      <Button
        disabled={cartProducts.length <= 0}
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="mt-6 w-full h-12 text-base font-semibold bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </Button>
    </SheetContent>
  );
}

export default Cart_Wrapper;