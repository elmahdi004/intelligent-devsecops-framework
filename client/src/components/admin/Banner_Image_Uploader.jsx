import React, { useRef } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { CheckCircle, CloudUpload, Info, Loader, UploadCloudIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

function Banner_Image_Uploader({bannerLength,bannerImage,setBannerImage,onSubmit,isLoading}) {
  
    const inputRef = useRef(null);
    const {toast} = useToast();

    function handleImageDrag(e)
    {
        e.preventDefault();
    }

    function handleImageDrop(e)
    {
        e.preventDefault();

        if(bannerLength > 6)
        {
          toast({
            title : "You have reached the maxium limit of 6 banners.",
            variant : "destructive"
          });
          return;
        } 

        const file = e.dataTransfer.files?.[0];
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => 
        {
            if(img.width >= 1400 && img.height >= 800)
            {
                setBannerImage(file);
            }
            else
            {
                toast({
                    title : "Invalid Image Resolution",
                    variant : "destructive"
                })
            }
            URL.revokeObjectURL(imageUrl);
        };
    }

    function handleImageUpload(e)
    {
      if(bannerLength > 6)
      {
        toast({
          title : "You have reached the maxium limit of 6 banners.",
          variant : "destructive"
        });
        return;
      }  
      
        const file = e.target.files?.[0];

        if(file.size >= 10000000)
        {
          toast({
            title : "Image size must be less than 10MB",
            variant : "destructive"
          });
          return;
        }

        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => 
        {
          if(img.width >= 1400 && img.height >= 800)
            {
                setBannerImage(file);
            }
            else
            {
                toast({
                    title : "Invalid Image Resolution",
                    variant : "destructive"
                })
            }
            URL.revokeObjectURL(imageUrl);
        };

    }

    function handleRemoveImage()
    {
        setBannerImage(null);

        if(inputRef.current)
        {
            inputRef.current.value = "";
        }
    }

    return (
    <div className="w-full flex flex-col-reverse md:flex-row gap-10 p-4 md:p-6 lg:p-8">

      <div className="w-full md:max-w-[350px] flex flex-col mt-2">
        
        <h3 className="text-lg font-semibold text-gray-800">Upload Banner Image</h3>
        
        <span className="text-gray-700 mt-2 text-sm md:text-base">
          Add high-quality, eye-catching banners to showcase products and promotions.
        </span>

        <div className="flex items-start mt-4">
          <Info className="w-5 h-5 text-orange-400 mt-1" />
          <p className="ml-2 text-gray-700 text-sm leading-snug md:max-w-72">
            Each image must have a minimum resolution of <span className="font-semibold">1400x800 pixels</span> for optimal quality.
          </p>
        </div>

        <div className="flex items-start mt-2">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <p className="ml-2 text-gray-700 text-sm leading-snug md:max-w-72">
            You can have up to <span className="font-semibold">6 banners</span> at any given time. 
          </p>
        </div>

        <Button 
          disabled={!bannerImage} 
          onClick={onSubmit} 
          className="mt-4 w-full md:w-auto"
        >
          {
            isLoading && bannerImage ? 
            (
                <span className="flex gap-1 items-center">
                <Loader className="w-5 h-5 animate-spin" />
                Uploading Image
                </span>
            ) 
            :
            (
                <span className="flex gap-1 items-center">
                <CloudUpload className="w-5 h-5" />
                Upload
                </span>
            )
          }
        </Button>
      </div>

      <div className="flex justify-center items-center w-full md:max-w-[500px]">
        <div
          onDragOver={handleImageDrag}
          onDrop={handleImageDrop}
          className="relative w-full h-[250px] flex justify-center items-center border-dashed border-2 border-gray-400 rounded-lg p-4"
        >
          {
            bannerImage 
            ? 
            (
                <div className="w-full h-full">
                <img className="w-full h-full object-contain rounded-md" src={URL.createObjectURL(bannerImage)} alt="Banner Preview" />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                    <XIcon className="w-5 h-5 text-gray-600" />
                </Button>
                </div>
            )
            :
            (
                <div className="flex flex-col items-center justify-center">
                <Input id="bannerImage" type="file" className="hidden" ref={inputRef} onChange={handleImageUpload} />
                <Label htmlFor="bannerImage" className="flex flex-col items-center justify-center cursor-pointer">
                    <UploadCloudIcon className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-xs text-center text-gray-500">Drag & Drop / Click to Upload</span>
                </Label>
                </div>
            )
          }
        </div>
      </div>

    </div>
  )
}

export default Banner_Image_Uploader