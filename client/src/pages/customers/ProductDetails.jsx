import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { sizeOptions } from "../../config/config";
import { BadgeCheck, IndianRupeeIcon, DollarSign, Plus, RefreshCcw, SendHorizonal } from "lucide-react";
import { handleAddtoCart } from "@/store/customer-slice/cart";
import { useToast } from "@/hooks/use-toast";
import { fetchProductDetails, fetchSimilarProducts } from "@/store/customer-slice/products";
import StarRating from "../../components/utility/StarRating";
import { Input } from "@/components/ui/input";
import { addReview, fetchProductReviews } from "@/store/customer-slice/review";
import Review_Tile from "@/components/customers/Review_Tile";
import Customer_ProductCard from "@/components/customers/Customer_ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

function sortedTiles(data) {
  return [...data].sort((a, b) => {
    return sizeOptions.indexOf(a.size) - sizeOptions.indexOf(b.size);
  });
}

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products, productDetail, similarProducts } = useSelector((state) => state.customerProduct);
  const { cartProducts } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const { reviewList } = useSelector((state) => state.review);
  const [displayImage, setDisplayImage] = useState(null);
  const [displaySizes, setDisplaySizes] = useState([]);
  const [size, setSize] = useState("");
  const { toast } = useToast();
  const [displayProduct, setDisplayProduct] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";

  function generateSizeTiles(data) {
    const sizes = sortedTiles(data);
    const filteredSizes = sizes.filter((item) => item.quantity !== 0);

    setDisplaySizes(filteredSizes);
  }

  function AddToCart() {
    if (!user) {
      // Handle unauthenticated users: Store cart items in local storage
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const newItem = { productId: displayProduct._id, size, quantity: 1 };
      cartItems.push(newItem);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      toast({
        title: "Item added to local cart. Please log in to sync with your account.",
      });
      return;
    }

    if (user.role === "ADMIN") {
      toast({
        title: "Admins can only view the product",
        variant: "destructive",
      });
      return;
    }

    if (size !== "") {
      const productToBeAdded = cartProducts.find((item) => item.ProductId === displayProduct._id);
      if (productToBeAdded) {
        const qty = displayProduct.Size.find((item) => item.size === size).quantity;
        if (productToBeAdded.Quantity + 1 > qty) {
          toast({
            title: `Only ${qty} items are currently available in stock. You've reached your limit with this product.`,
            variant: "destructive",
          });
          setSize("");
          return;
        }
      }

      dispatch(
        handleAddtoCart({
          token: token,
          userId: user.id,
          productId: displayProduct?._id,
          size,
          quantity: 1,
        })
      ).then((data) => {
        if (data.payload.success) {
          setSize("");
          toast({
            title: "Product added to cart successfully",
          });
        }
      });
    } else {
      toast({
        title: "Select a size of your choice",
        variant: "destructive",
      });
    }
  }

  function handleSetRating(data) {
    setRating(data);
  }

  function handleCreateReview() {
    if (!user) {
      toast({
        title: "Please log in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (user.role === "ADMIN") {
      setComment("");
      setRating(0);
      toast({
        title: "Admins cannot publish a review",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addReview({
        token: token,
        reviewData: {
          userId: user?.id,
          productId: id,
          username: user?.username,
          rating,
          comment,
        },
      })
    ).then((data) => {
      if (data.payload.success) {
        setComment("");
        setRating(0);
        toast({
          title: "Review added successfully",
        });
      } else {
        setComment("");
        setRating(0);
        toast({
          title: data.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  const selectedProduct = products.find((item) => item._id === id);

  useEffect(() => {
    if (!selectedProduct) {
      dispatch(fetchProductDetails({ token, id }));
    } else {
      window.scroll(0, 0);
      dispatch(fetchProductReviews({ token, productId: selectedProduct?._id }));
      dispatch(fetchSimilarProducts({ token, id: selectedProduct?._id }));
      setDisplayProduct(selectedProduct);
      setDisplayImage(selectedProduct?.Image?.[0]);
      generateSizeTiles(selectedProduct?.Size || []);
      setComment("");
      setRating(0);
      setSize("");
    }
  }, [id, dispatch]);

  useEffect(() => {
    const loadedProduct = productDetail[0] && productDetail[0]._id === id && productDetail[0];
    if (loadedProduct) {
      window.scroll(0, 0);
      dispatch(fetchProductReviews({ token, productId: loadedProduct?._id }));
      dispatch(fetchSimilarProducts({ token, id: loadedProduct?._id }));
      setDisplayProduct(loadedProduct);
      setDisplayImage(loadedProduct?.Image?.[0]);
      generateSizeTiles(loadedProduct?.Size || []);
    }
  }, [productDetail]);

  const productRating =
    reviewList && reviewList.length > 0 && reviewList.reduce((sum, item) => sum + item.Rating, 0) / reviewList.length;

  if (!displayProduct) {
    return (
      <div className="pt-5 flex justify-center">
        <div className="w-[80%] flex justify-center gap-5 flex-col sm:flex-row">
          <div className="flex-1 flex flex-col-reverse gap-4 sm:flex-row">
            <div className="flex sm:flex-col overflow-x-auto justify-evenly sm:justify-normal sm:w-[18.7%] w-full">
              <Skeleton className="w-[24%] h-[100px] sm:w-full sm:mb-3 flex-shrink-0" />
            </div>
            <div className="w-full sm:w-[80%]">
              <Skeleton className="w-full h-[calc(100vh-100px)]" />
            </div>
          </div>
          <div className="flex-1">
            <Skeleton className="h-5 w-[80%]" />
            <div className="flex my-3 gap-2">
              <Skeleton className="h-6 w-[70px]" />
              <Skeleton className="h-6 w-[70px]" />
            </div>
            <Skeleton className="h-28 w-[80%]" />
            <Skeleton className="mt-3 h-4 w-[250px]" />
            <Skeleton className="mt-3 h-4 w-[250px]" />
            <Skeleton className="mt-3 h-4 w-[250px]" />
            <Skeleton className="mt-3 h-10 w-[100px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row lg:flex-col-reverse">
            {/* Thumbnail Images */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-x-visible sm:w-20 lg:w-full lg:flex-row">
              {displayProduct?.Image.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setDisplayImage(item)}
                  className={`${item === displayImage ? "ring-2 ring-red-500 ring-offset-2" : "opacity-60 hover:opacity-100"} 
                    flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-gray-200 transition-all duration-200`}
                >
                  <img
                    src={item}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <img 
                className="w-full h-auto object-contain" 
                src={displayImage} 
                alt={displayProduct.Title}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{displayProduct.Title}</h1>
              
              {/* Category & Brand Tags */}
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 border border-blue-300 rounded-full text-sm font-semibold">
                  {displayProduct?.Category}
                </span>
                <span className="px-4 py-1.5 bg-green-100 text-green-700 border border-green-300 rounded-full text-sm font-semibold">
                  {displayProduct?.Brand}
                </span>
              </div>

              {/* Rating */}
              {productRating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <StarRating rating={productRating} isEditable={false} />
                  </div>
                  <span className="text-gray-600 font-medium">{productRating.toFixed(2)}</span>
                  <span className="text-gray-400">({reviewList?.length || 0} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                {displayProduct.SalePrice ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-red-600">{displayProduct.SalePrice} MAD</span>
                    <span className="text-xl line-through text-gray-400">{displayProduct.Price} MAD</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                      {Math.round(((displayProduct.Price - displayProduct.SalePrice) / displayProduct.Price) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-gray-900">{displayProduct.Price} MAD</span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-6 text-base">{displayProduct.Description}</p>

              {/* Size Selection */}
              {displaySizes.length > 0 ? (
                <div className="flex flex-col gap-3 mb-6">
                  <p className="font-semibold text-gray-900 text-lg">Select Size</p>
                  <div className="flex flex-wrap gap-3">
                    {displaySizes.map((item, index) => (
                      <button
                        onClick={() => setSize(item.size)}
                        key={index}
                        className={`${size === item.size 
                          ? "bg-red-500 text-white border-red-600 shadow-lg scale-105" 
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"} 
                          border-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 min-w-[60px]`}
                      >
                        {item.size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-red-700 font-semibold">Product currently out of stock</p>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button 
                onClick={() => AddToCart()} 
                disabled={displaySizes.length <= 0} 
                className="w-full mb-6 h-12 text-lg font-bold bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                ADD TO CART
              </Button>

              <Separator className="my-6" />

              {/* Features */}
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <BadgeCheck size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">100% Authentic</p>
                    <p className="text-sm text-gray-600">Verified quality & genuine brands</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <RefreshCcw size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Fast & Secure Shipping</p>
                    <p className="text-sm text-gray-600">Safe and reliable delivery</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">No Hidden Charges</p>
                    <p className="text-sm text-gray-600">Transparent pricing guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
              SIMILAR <span className="text-red-500">PRODUCTS</span>
            </h2>
            <p className="text-gray-600 text-lg">You might also like</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {similarProducts.map((item, index) => (
              <Customer_ProductCard key={index} product={item} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
            PRODUCT <span className="text-red-500">REVIEWS</span>
          </h2>
          <p className="text-gray-600 text-lg">Share your experience with others</p>
        </div>

        {/* Write Review Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Write your Review</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Rating:</span>
              <StarRating rating={rating} handleSetRating={handleSetRating} isEditable={true} />
            </div>
            <div className="flex gap-3">
              <Input
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200"
                placeholder="Share your thoughts about this product..."
              />
              <Button
                disabled={rating === 0 || comment.trim() === ""}
                className="rounded-xl px-6 bg-red-500 hover:bg-red-600 disabled:bg-gray-300"
                onClick={() => handleCreateReview()}
              >
                <SendHorizonal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex flex-col gap-4">
          {reviewList && reviewList.length > 0 ? (
            reviewList.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200">
                <Review_Tile review={item} />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <Plus className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Be the first to review</h3>
                <p className="text-gray-600 max-w-md">
                  Your feedback helps others make informed decisions. Share your experience with this product!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;