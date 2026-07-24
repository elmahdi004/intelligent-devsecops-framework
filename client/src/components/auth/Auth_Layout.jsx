import { Outlet } from "react-router-dom";
import { Sparkles, ShoppingBag, Star } from "lucide-react";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-white">

    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-red-500 via-red-600 to-orange-500 w-1/2 px-12 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>
      
      <div className="max-w-md space-y-8 text-center text-white relative z-10">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to
        </h1>

        <span className='font-stick-no-bills text-6xl font-bold block'>FLINT
            <span className='text-white text-7xl'>.</span>
        </span>
        
        <p className="text-lg font-medium leading-relaxed text-white/90">
          Elevate your shopping experience with new-age fashion and exclusive deals.
        </p>

        <div className="flex justify-center gap-2 pt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-300 text-yellow-300" />
          ))}
        </div>
      </div>
    </div>

    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-white to-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  </div>
  );
}

export default AuthLayout;