import React, { useRef } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { UploadCloudIcon } from 'lucide-react';
import { Button } from '../ui/button';

function Image_Uploader({
    image1,setImage1,
    image2,setImage2,
    image3,setImage3,
    image4,setImage4,
    toBeEdited}) {
  
    const inputRef = useRef(null);

    function handleImageDrag(e)
    {
        e.preventDefault();
    }

    function handleImageDrop(e)
    {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        const imageID = e.currentTarget.id;

        switch (imageID) {
            case "img1":
                if(image1 === null) setImage1(file);
                break;
            case "img2":
                if(image2 === null) setImage2(file);
                break;
            case "img3":
                if(image3 === null) setImage3(file);
                break;
            case "img4":
                if(image4 === null) setImage4(file);
                break;
            default:
                break;
        }
    }

    function handleImageUpload(e)
    {
        const file = e.target.files?.[0];
        const imageID = e.target.id;

        switch (imageID) {
            case "image1":
                if(image1 === null) setImage1(file);
                break;
            case "image2":
                if(image2 === null) setImage2(file);
                break;
            case "image3":
                if(image3 === null) setImage3(file);
                break;
            case "image4":
                if(image4 === null) setImage4(file);
                break;
            default:
                break;
        }

    }

    function handleRemoveImage()
    {
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);

        if(inputRef.current)
        {
            inputRef.current.value = "";
        }
    }

    return (
    <div className={`${toBeEdited ? 'hidden' : ''} w-full max-w-md mx-auto`}>
        <Label className={"mt-5 mb-2 font-semibold flex justify-between items-center"}>Upload Images<Button onClick={() => handleRemoveImage()} className="h-[20px]">Reset</Button></Label>
        <div className='grid grid-cols-2 gap-2'>
            <div onDragOver={handleImageDrag} onDrop={handleImageDrop} id='img1' className={"relative w-[140px] h-[140px] flex justify-center items-center border-dashed border-2 rounded-lg"}>
                {
                image1 !== null 
                ?
                <img className='w-[80%] h-auto object-cover' src={URL.createObjectURL(image1)} />
                :
                <div>
                    <div className='absolute top-1 left-1 rounded-full border-2 px-1 text-xs border-gray-500'>1</div>
                    <Input disabled={toBeEdited} id='image1' type='file' className="hidden" ref={inputRef} onChange={handleImageUpload}/>
                    <Label htmlFor='image1' className='flex flex-col items-center justify-center cursor-pointer'>
                        <UploadCloudIcon className='w-10 h-10 text-muted-foreground mb-2'/>
                        <span className='text-xs text-center'>Drag & Drop / Click to Upload</span>
                    </Label>
                </div>
                }
            </div>
            <div onDragOver={handleImageDrag} onDrop={handleImageDrop} id='img2' className={`${image1 === null ? "bg-gray-100 opacity-40 pointer-events-none" : ""} relative w-[140px] h-[140px] flex justify-center items-center border-dashed border-2 rounded-lg`}>
                {
                image2 !== null 
                ?
                <img className='w-[80%] h-auto object-cover' src={URL.createObjectURL(image2)} />
                :
                <div>
                    <div className='absolute top-1 left-1 rounded-full border-2 px-1 text-xs border-gray-500'>2</div>
                    <Input disabled={image1 === null} id='image2' type='file' className="hidden" ref={inputRef} onChange={handleImageUpload}/>
                    <Label htmlFor='image2' className='flex flex-col items-center justify-center cursor-pointer'>
                        <UploadCloudIcon className='w-10 h-10 text-muted-foreground mb-2'/>
                        <span className='text-xs text-center'>Drag & Drop / Click to Upload</span>
                    </Label>
                </div>
                }
            </div>
            <div onDragOver={handleImageDrag} onDrop={handleImageDrop} id='img3' className={`${image2 === null ? "bg-gray-100 opacity-40 pointer-events-none" : ""} relative w-[140px] h-[140px] flex justify-center items-center border-dashed border-2 rounded-lg`}>
                {
                image3 !== null 
                ?
                <img className='w-[80%] h-auto object-cover' src={URL.createObjectURL(image3)} />
                :
                <div>
                    <div className='absolute top-1 left-1 rounded-full border-2 px-1 text-xs border-gray-500'>3</div>
                    <Input disabled={toBeEdited} id='image3' type='file' className="hidden" ref={inputRef} onChange={handleImageUpload}/>
                    <Label htmlFor='image3' className='flex flex-col items-center justify-center cursor-pointer'>
                        <UploadCloudIcon className='w-10 h-10 text-muted-foreground mb-2'/>
                        <span className='text-xs text-center'>Drag & Drop / Click to Upload</span>
                    </Label>
                </div>
                }
            </div>
            <div onDragOver={handleImageDrag} onDrop={handleImageDrop} id='img4' className={`${image3 === null ? "bg-gray-100 opacity-40 pointer-events-none" : ""} relative w-[140px] h-[140px] flex justify-center items-center border-dashed border-2 rounded-lg`}>
                {
                image4 !== null 
                ?
                <img className='w-[80%] h-auto object-cover' src={URL.createObjectURL(image4)} />
                :
                <div>
                    <div className='absolute top-1 left-1 rounded-full border-2 px-1 text-xs border-gray-500'>4</div>
                    <Input disabled={toBeEdited} id='image4' type='file' className="hidden" ref={inputRef} onChange={handleImageUpload}/>
                    <Label htmlFor='image4' className='flex flex-col items-center justify-center cursor-pointer'>
                        <UploadCloudIcon className='w-10 h-10 text-muted-foreground mb-2'/>
                        <span className='text-xs text-center'>Drag & Drop / Click to Upload</span>
                    </Label>
                </div>
                }
            </div>
        </div>
    </div>
  )
}

export default Image_Uploader