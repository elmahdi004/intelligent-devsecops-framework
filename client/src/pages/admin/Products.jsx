import React, { useEffect, useState } from 'react'
import { LoaderIcon } from 'lucide-react'
import {NewProductFormTemplate} from '../../config/config'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import Form from '@/components/utility/Form'
import Image_Uploader from '@/components/admin/Image_Uploader'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct , editProduct, fetchProducts, removeProduct } from '@/store/admin-slice/products'
import { useToast } from '@/hooks/use-toast'
import Admin_Product_List from '@/components/admin/Admin_Product_List'

function Products() {

  const [openProductDrawer,setProductOpeningDrawer] = useState(false);
  const [formData,setFormData] = useState({
    title : "",
    description : "",
    category : "",
    brand : "",
    price : "",
    salePrice : "",
    featured : "",
    sizes : [],
  });
  const [image1,setImage1] = useState(null);
  const [image2,setImage2] = useState(null);
  const [image3,setImage3] = useState(null);
  const [image4,setImage4] = useState(null);

  const [productUploading,setProductUploading] = useState(false);
  const [currentEditedID,setCurrentEditedID] = useState(null);
  const [openDeleteDialogDialog,setOpenDeleteDialog] = useState(false);
  const [orderToBeDeleted,setOrderToBeDeleted] = useState(null);

  const [currentProductPage,setCurrentProductPage] = useState(1);
  const [productCategory,setProductCategory] = useState("");
  const [productBrand,setProductBrand] = useState("");
  const [productStock,setProductStock] = useState("");

  const dispatch = useDispatch();
  const {products,pageCount} = useSelector((state) => state.adminProduct);
  const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";
  const {toast} = useToast();

  async function onSubmit(e)
  {
    e.preventDefault();

    if(currentEditedID !== null)
    {
      setProductUploading(true);    
      const MultipartData = new FormData();
      MultipartData.append("title",formData.title);
      MultipartData.append("description",formData.description);
      MultipartData.append("category",formData.category);
      MultipartData.append("brand",formData.brand);
      MultipartData.append("price",formData.price);
      MultipartData.append("featured",formData.featured);
      MultipartData.append("salePrice",formData.salePrice);
      MultipartData.append("sizes",JSON.stringify(formData.sizes)); 
      
      dispatch(editProduct({token,id : currentEditedID , MultipartData})).then((data) => {
        if(data?.payload?.success)
        { 
          setProductOpeningDrawer(false);
          setCurrentEditedID(null);
          setProductUploading(false); 
          toast({
            title : "Product updated successfully"
          });
        }
      })
    }
    else
    {
          setProductUploading(true);    
          const MultipartData = new FormData();
          MultipartData.append("title",formData.title);
          MultipartData.append("description",formData.description);
          MultipartData.append("category",formData.category);
          MultipartData.append("brand",formData.brand);
          MultipartData.append("price",formData.price);
          MultipartData.append("featured",formData.featured);
          MultipartData.append("salePrice",formData.salePrice);
          MultipartData.append("sizes",JSON.stringify(formData.sizes));

          image1 && MultipartData.append("image1",image1);
          image2 && MultipartData.append("image2",image2);
          image3 && MultipartData.append("image3",image3);
          image4 && MultipartData.append("image4",image4);

          

          dispatch(addProduct({token,formData : MultipartData})).then((data) => {
            if(data?.payload?.success)
            {
              setImage1(null);
              setImage2(null);
              setImage3(null);
              setImage4(null);
              setFormData({
                title : "",
                description : "",
                category : "",
                brand : "",
                price : "",
                salePrice : "",
                sizes : [],
              });
              setProductUploading(false); 
              setProductOpeningDrawer(false);
              toast({
                title : "Product added successfully"
              });
            }
          })
      
    }
  }

  function isFormValid() {
    
    if (currentEditedID === null && (image1 === null && image2 === null && image3 === null && image4 === null)) {
      return false; 
    }

    if(formData.sizes.length === 0)
    {
      return false;
    }

    if(formData.price === "")
    {
      return false;
    }

    if(formData.price && formData.salePrice && formData.salePrice >= formData.price)
    {
      return false;
    }

    return Object.keys(formData)
      .filter((key) => key !== "salePrice" && key !== "sizes" &&key !== "price" && key !== "salePrice") 
      .map((key) => formData[key].trim() !== "")   
      .every((isValid) => isValid);         
  }
  
  function handleProductDelete(id)
  {
    dispatch(removeProduct({token,id})).then((data) => {
      if(data?.payload?.success)
      {
        setOpenDeleteDialog(false);
        setOrderToBeDeleted(null);
        toast({
          title : "Product deleted successfully"
        });
      }
    })
  }

  function handleFetchProductList(filterData)
  {
    setCurrentProductPage(1);
    dispatch(fetchProducts({
      token,
      productBrand : filterData.Brand,
      productCategory : filterData.Category,
      productStock : filterData.Stock,
      currentProductPage
    }));
    setProductCategory(filterData.Category);
    setProductBrand(filterData.Brand);
    setProductStock(filterData.Stock);
  }

  useEffect(() => {
    dispatch(fetchProducts({
      token,
      productBrand,
      productCategory,
      productStock,
      currentProductPage
    }));
    window.scroll({
      top  :0,
      left : 0,
      behavior : "smooth"
    });
  },[currentProductPage,dispatch]);

  return (
    <div className="space-y-6">
      <Admin_Product_List 
          products={products} 
          setFormData={setFormData}
          setCurrentEditedID={setCurrentEditedID}
          setProductOpeningDrawer={setProductOpeningDrawer} 
          handleProductDelete={handleProductDelete}
          orderToBeDeleted={orderToBeDeleted}
          setOrderToBeDeleted={setOrderToBeDeleted}
          openDeleteDialogDialog={openDeleteDialogDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          currentProductPage={currentProductPage}
          setCurrentProductPage={setCurrentProductPage}
          pageCount={pageCount}
          productCategory={productCategory}
          productBrand={productBrand}
          productStock={productStock}
          handleFetchProductList={handleFetchProductList}
          />
      <Sheet open={openProductDrawer} onOpenChange={() => {
        setProductOpeningDrawer(false);
        setCurrentEditedID(null);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setFormData({
          title : "",
          description : "",
          category : "",
          brand : "",
          price : "",
          salePrice : "",
          featured : "",
          sizes : [],
          })
          }
        }>
          <SheetContent side='right' className='w-full sm:w-[600px] lg:w-[700px] overflow-y-auto bg-gradient-to-b from-white to-gray-50'>
          {
            productUploading 
            ?
              <div className='h-[calc(100vh-120px)] w-full flex justify-center items-center flex-col gap-4' >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                  <LoaderIcon className='w-8 h-8 text-white animate-spin' />
                </div>
                <div className="text-center">
                  <p className='text-lg font-semibold text-gray-900'>
                    {currentEditedID === null ? "Adding Product..." : "Updating Product..."}
                  </p>
                  <p className='text-sm text-gray-500 mt-1'>
                    {currentEditedID === null ? "Please wait while we add your product to the store" : "Please wait while we update your product details"}
                  </p>
                </div>
              </div>
            :
            <>
            <SheetHeader className="pb-6 border-b border-gray-200">
              <SheetTitle className="text-2xl font-bold text-gray-900">
                {currentEditedID !== null ? "Update Product" : "Add New Product"}
              </SheetTitle>
              <SheetDescription className="text-gray-600 mt-2">
                {currentEditedID !== null 
                  ? "Update your product details and keep your inventory fresh!" 
                  : "Add new items to your inventory with ease. Fill in all the required fields below."}
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <Image_Uploader 
                image1={image1} 
                setImage1={setImage1}
                image2={image2}
                setImage2={setImage2}
                image3={image3}
                setImage3={setImage3}
                image4={image4}
                setImage4={setImage4}
                toBeEdited={currentEditedID !== null}
              />
              <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
                <Form
                  FormTemplate={NewProductFormTemplate}
                  FormData={formData}
                  setFormData={setFormData}
                  onSubmit={onSubmit}
                  EventName={currentEditedID !== null ? "Update Product" : "Add Product"}
                  isSubmitDisabled={!isFormValid()}
                  formType="SizeForm"
                />
              </div>
            </div>
            </>
        }
          </SheetContent>

      </Sheet>
    </div>
  )
}

export default Products