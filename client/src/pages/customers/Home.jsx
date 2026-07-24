import { ChevronLeft, ChevronRight } from 'lucide-react';
import {Button} from "../../components/ui/button"
import { useEffect, useState } from 'react';
import {BrandTemplate} from "../../config/config"
import { useSelector,useDispatch } from 'react-redux';
import { fetchFeaturedandLatest } from '@/store/customer-slice/products';
import Customer_ProductCard from '../../components/customers/Customer_ProductCard';
import { useNavigate } from 'react-router-dom';
import { handleFetchBanners } from '@/store/banner-slice';
import { BadgeCheck, DollarSign , RefreshCcw } from "lucide-react";


function Home() {

  const dispatch = useDispatch();

  const { featuredProducts , latestProducts } = useSelector((state) => state.customerProduct)

  const [currentSlide,setCurrentSlide] = useState(1);
  const navigate = useNavigate();
  const { bannerList} = useSelector((state) => state.banner)
  const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";
  
  function handleFilteredNavigation(item,filterType)
  {
    sessionStorage.removeItem("filter");
    const filter = {
      [filterType] : [item]
    };
    sessionStorage.setItem("filter",JSON.stringify(filter));
    navigate("/shop/catalog");
  }

  useEffect(() => {
    
    dispatch(fetchFeaturedandLatest(token));
    dispatch(handleFetchBanners(token));
    window.scroll({
      top  :0,
      left : 0,
      behavior : "smooth"
    });
    const carouselTimer = setInterval(() => {
      bannerList.length > 0 && setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerList.length);
    }, 5000);
    
    return () => clearInterval(carouselTimer);
    
  },[dispatch])

  return (
<div className='flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50'>
  {/* Hero Banner Section */}
  <div className="relative w-full h-[300px] sm:h-[450px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
    {bannerList.length > 0 ? (
      <>
        {bannerList.map((item, index) => (
          <img
            key={index}
            src={item.BannerImage}
            className={`${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"} absolute top-0 left-0 w-full 
              h-full object-cover transition-all duration-1000 ease-in-out`}
            alt={`Banner ${index + 1}`}
          />
        ))}
        {bannerList.length > 1 && (
          <>
            <Button
              onClick={() => setCurrentSlide((prevSlide) => ((prevSlide - 1) + bannerList.length) % bannerList.length)}
              className="absolute rounded-full top-[50%] left-4 md:left-8 transform -translate-y-[50%] bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm border-0"
              variant="outline"
              size="icon"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </Button>
            <Button
              onClick={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerList.length)}
              className="absolute rounded-full top-[50%] right-4 md:right-8 transform -translate-y-[50%] bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm border-0"
              variant="outline"
              size="icon"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </Button>
            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {bannerList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </>
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">Welcome to FLINT</h1>
          <p className="text-lg md:text-xl text-gray-600">Discover your perfect style</p>
        </div>
      </div>
    )}
  </div>

  {/* Brand Showcase Section */}
  <section className='py-16 bg-white'>
    <div className='container mx-auto px-4 md:px-6 lg:px-8'>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
          BRAND <span className="text-red-500">SHOWCASE</span>
        </h2>
        <p className="text-gray-600 text-lg">Explore our premium brand collection</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {BrandTemplate && BrandTemplate.map((brand, index) => (
          <div 
            key={index} 
            onClick={() => handleFilteredNavigation(brand.label,"Brand")} 
            className="group flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl cursor-pointer bg-white
            transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:border-red-300 hover:bg-gradient-to-br hover:from-red-50 hover:to-orange-50"
          >
            <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
              <img src={brand.logo} alt={brand.label} className="w-16 h-16 object-contain" />
            </div>
            <p className="text-base font-semibold text-gray-800 group-hover:text-red-600 transition-colors">{brand.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Features Section */}
  <section className='py-16 bg-gradient-to-b from-gray-50 to-white'>
    <div className='container mx-auto px-4 md:px-6 lg:px-8'>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12'>
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <BadgeCheck size={32} className="text-red-600"/>
          </div>
          <h3 className='text-xl font-bold text-gray-900 mb-2'>100% Authentic</h3>
          <p className='text-gray-600 text-sm md:text-base'>Verified quality & genuine brands</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <RefreshCcw size={32} className="text-orange-600"/>
          </div>
          <h3 className='text-xl font-bold text-gray-900 mb-2'>Fast Shipping</h3>
          <p className='text-gray-600 text-sm md:text-base'>Safe and reliable delivery</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <DollarSign size={32} className="text-green-600"/>
          </div>
          <h3 className='text-xl font-bold text-gray-900 mb-2'>No Hidden Fees</h3>
          <p className='text-gray-600 text-sm md:text-base'>Transparent pricing guaranteed</p>
        </div>
      </div>
    </div>
  </section>

  {/* Latest Drops Section */}
  {latestProducts && latestProducts.length > 0 && (
    <section className='py-16 bg-white'>
      <div className='container mx-auto px-4 md:px-6 lg:px-8'>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
            LATEST <span className="text-red-500">DROPS</span>
          </h2>
          <p className="text-gray-600 text-lg">Fresh arrivals just for you</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {latestProducts.map((item,index) => (
            <Customer_ProductCard key={index} product={item} />
          ))}
        </div>
      </div>
    </section>
  )}

  {/* Featured Products Section */}
  {featuredProducts && featuredProducts.length > 0 && (
    <section className='py-16 bg-gradient-to-b from-gray-50 to-white'>
      <div className='container mx-auto px-4 md:px-6 lg:px-8'>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
            FEATURED <span className="text-red-500">PRODUCTS</span>
          </h2>
          <p className="text-gray-600 text-lg">Handpicked favorites</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {featuredProducts.map((item,index) => (
            <Customer_ProductCard key={index} product={item} />
          ))}
        </div>
      </div>
    </section>
  )}
</div>
  )
}

export default Home