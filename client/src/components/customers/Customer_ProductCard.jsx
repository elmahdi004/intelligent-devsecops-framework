import { useNavigate } from "react-router-dom";
import { Tag, Sparkles } from "lucide-react";

function Customer_ProductCard({ product }) {
  const navigate = useNavigate();
  const isOnSale = product.SalePrice && product.Price > product.SalePrice;
  const discountPercentage = isOnSale 
    ? Math.round(((product.Price - product.SalePrice) / product.Price) * 100)
    : 0;

  return (
    <div
      onClick={() => navigate(`/shop/product/${product._id}`)}
      className="group relative w-full cursor-pointer flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      {/* Sale Badge */}
      {isOnSale && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
          <Tag size={12} />
          <span>-{discountPercentage}%</span>
        </div>
      )}

      {/* Featured Badge */}
      {product.Featured && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
          <Sparkles size={12} />
          <span>FEATURED</span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative overflow-hidden flex-shrink-0 h-[180px] sm:h-[220px] md:h-[240px] bg-gray-100">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          src={product?.Image[0]}
          alt={product?.Title}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Info */}
      <div className="flex flex-col p-4 flex-grow">
        {/* Product Title */}
        <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-red-600 transition-colors">
          {product?.Title}
        </h3>

        {/* Product Price */}
        <div className="mt-auto">
          {isOnSale ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg md:text-xl font-bold text-red-600">
                {product?.SalePrice} MAD
              </span>
              <span className="text-sm line-through text-gray-400">
                {product?.Price} MAD
              </span>
            </div>
          ) : (
            <span className="text-lg md:text-xl font-bold text-gray-900">
              {product?.Price} MAD
            </span>
          )}
        </div>
      </div>

      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 border-2 border-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

export default Customer_ProductCard;