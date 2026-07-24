import { MinusCircleIcon, PlusCircleIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { handleDeleteCartItems, handleUpdateCartItems } from "@/store/customer-slice/cart";
import { useToast } from "@/hooks/use-toast";

function Cart_Tiles({ cartItem }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.customerProduct);
  const { toast } = useToast();
  const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";

  // Ensure cartItem and cartItem.Image are defined
  if (!cartItem || !cartItem.Image || cartItem.Image.length === 0) {
    return null; // or return a placeholder/fallback UI
  }

  function updateCartItem(actionType) {
    const updatedQuantity = actionType === "Increase" ? cartItem.Quantity + 1 : cartItem.Quantity - 1;

    const productToBeUpdated = products.find((item) => item._id === cartItem.ProductId);
    if (productToBeUpdated) {
      const qty = productToBeUpdated.Size.find((item) => item.size === cartItem.Size).quantity;

      if (updatedQuantity > qty) {
        toast({
          title: `Only ${cartItem.Quantity} items are currently available in stock.`,
          variant: "destructive",
        });
        return;
      }
    }

    if (!user) {
      // Handle unauthenticated users: Update cart items in local storage
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const updatedCartItems = cartItems.map((item) =>
        item.productId === cartItem.ProductId && item.size === cartItem.Size
          ? { ...item, quantity: updatedQuantity }
          : item
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      return;
    }

    // Handle authenticated users: Update cart items in the backend
    dispatch(
      handleUpdateCartItems({
        token: token,
        userId: user?.id,
        productId: cartItem.ProductId,
        size: cartItem.Size,
        quantity: updatedQuantity,
      })
    ).then((data) => {
      if (!data.payload.success) {
        toast({
          title: data.payload.message,
          variant: "destructive",
        });
      }
    });
  }

  function deleteCartItem() {
    if (!user) {
      // Handle unauthenticated users: Remove cart items from local storage
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const updatedCartItems = cartItems.filter(
        (item) => item.productId !== cartItem.ProductId || item.size !== cartItem.Size
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      toast({
        title: "Product removed from cart successfully",
      });
      return;
    }

    // Handle authenticated users: Remove cart items from the backend
    dispatch(
      handleDeleteCartItems({
        token: token,
        userId: user?.id,
        productId: cartItem.ProductId,
        size: cartItem.Size,
      })
    ).then((data) => {
      if (data.payload?.success) {
        toast({
          title: "Product removed from cart successfully",
        });
      }
    });
  }

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
      {/* Product Image */}
      <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0">
        <img
          className="w-full h-full object-cover"
          src={cartItem.Image[0]}
          alt={cartItem.Title || "Product Image"}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">{cartItem.Title}</h3>
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
            Size: {cartItem.Size}
          </span>
        </div>
        
        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium">Quantity:</span>
          <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg">
            <Button
              disabled={cartItem.Quantity <= 1}
              onClick={() => updateCartItem("Decrease")}
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100 disabled:opacity-50"
            >
              <MinusCircleIcon className="w-4 h-4 text-gray-600" />
            </Button>
            <span className="font-bold text-gray-900 min-w-[2rem] text-center">{cartItem.Quantity}</span>
            <Button
              onClick={() => updateCartItem("Increase")}
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100"
            >
              <PlusCircleIcon className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Price and Delete */}
      <div className="flex flex-col items-end justify-between gap-4">
        <div className="text-right">
          {cartItem.SalePrice > 0 ? (
            <div>
              <p className="text-lg font-bold text-red-600">
                {(cartItem.SalePrice * cartItem.Quantity).toFixed(2)} MAD
              </p>
              <p className="text-xs text-gray-400 line-through">
                {(cartItem.Price * cartItem.Quantity).toFixed(2)} MAD
              </p>
            </div>
          ) : (
            <p className="text-lg font-bold text-gray-900">
              {(cartItem.Price * cartItem.Quantity).toFixed(2)} MAD
            </p>
          )}
        </div>
        <Button
          onClick={() => deleteCartItem()}
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-red-50 hover:text-red-600 rounded-lg"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

export default Cart_Tiles;