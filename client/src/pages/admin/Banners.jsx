import React, { useEffect, useState } from 'react'
import Banner_Image_Uploader from '../../components/admin/Banner_Image_Uploader'
import { Separator } from '@/components/ui/separator';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddBanner, handleDeleteBanner, handleFetchBanners } from '@/store/banner-slice';
import { useToast } from '@/hooks/use-toast';
import { Trash2, GalleryHorizontalEnd } from 'lucide-react';

function Banners() {

  const [bannerImage , setBannerImage] = useState(null);
  const dispatch = useDispatch();
  const {isLoading,bannerList} = useSelector((state) => state.banner)
  const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";
  const {toast} = useToast();

  function onSubmit()
  {
    const MultipartData = new FormData();
    bannerImage && MultipartData.append("image",bannerImage);
    dispatch(handleAddBanner({token,formData : MultipartData})).then((data) => {
      if(data.payload.success)
      {
        setBannerImage(null);
        toast({
          title  :"Image uploaded successfully"
        })
      }
    })
  }

  function handleDelete(bannerId)
  { 
    if(bannerList.length <= 1)
    {
      toast({
        title : "There must be atleast 1 banner",
        variant : "destructive"
      })
      return;
    }
    
    dispatch(handleDeleteBanner({token,bannerId})).then((data) => {
      if(data.payload?.success)
      {
        toast({
          title : "Banner deleted successfully"
        })
      }
    })
  }

  useEffect(() => {
    dispatch(handleFetchBanners(token));
    window.scroll({
      top  :0,
      left : 0,
      behavior : "smooth"
    });
  },[])


  return (
    <div className='w-full flex flex-col gap-8'>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Banner Management</h1>
        <p className="text-gray-600">Upload and manage your store banners</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <Banner_Image_Uploader 
          bannerLength={bannerList.length} 
          bannerImage={bannerImage} 
          setBannerImage={setBannerImage} 
          onSubmit={onSubmit} 
          isLoading={isLoading}
        />
      </div>

      {/* Banners Grid */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
        <div className='flex justify-between items-center mb-6 pb-4 border-b border-gray-200'>
          <h3 className='text-xl font-bold text-gray-900'>Your Banners</h3>
          <span className='px-4 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-semibold'>
            {bannerList.length} {bannerList.length === 1 ? 'Banner' : 'Banners'}
          </span>
        </div>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {
            bannerList.length > 0 ? (
              bannerList.map((item,index) => 
                <div key={index} className='group relative rounded-xl overflow-hidden border-2 border-gray-200 hover:border-red-500 transition-all duration-300 hover:shadow-xl'>
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      src={item.BannerImage} 
                      alt={`Banner ${index + 1}`}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="absolute top-3 right-3 p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg hover:scale-110 transition-all duration-200"
                    >
                      <Trash2 className='w-5 h-5' />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">Banner #{index + 1}</p>
                  </div>
                </div>
              )
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <GalleryHorizontalEnd className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No banners yet</p>
                <p className="text-sm text-gray-500 mt-1">Upload your first banner above</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Banners