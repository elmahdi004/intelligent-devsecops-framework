import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../ui/table"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "../ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Dialog ,    DialogContent,
    DialogTitle} from '../ui/dialog'
import { ArrowUpDown, Ellipsis , Plus, RadarIcon, Trash2 } from 'lucide-react'
import { useState } from "react"
import Paginator from "../utility/Paginator"
import { 
    Select ,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { FilterOptions } from "@/config/config";
import { Label } from "../ui/label";

function Admin_Product_List({
    products,
    setFormData,
    setCurrentEditedID,
    setProductOpeningDrawer,
    handleProductDelete,
    orderToBeDeleted,
    setOrderToBeDeleted,
    openDeleteDialogDialog,
    setOpenDeleteDialog,
    currentProductPage,
    setCurrentProductPage,
    pageCount,
    productCategory,
    productBrand,
    productStock,
    handleFetchProductList
    }) {

    
  const initialState = {
    Category : "",
    Brand : "",
    Stock : ""
  }

  const [filterData,setFilterData] = useState(initialState);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Product Management</h1>
          <p className="text-gray-600">Manage your product inventory efficiently</p>
        </div>
        <Button 
          onClick={() => setProductOpeningDrawer(true)} 
          className='flex gap-2 items-center bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg'
        >
          <Plus className="w-5 h-5"/>
          <span className="font-semibold">Add Product</span>
        </Button>
      </div>

      {/* Filters and Stats */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-3">
            {productCategory && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                <span className="text-xs font-semibold">Category:</span>
                <span className="text-sm font-medium">{productCategory}</span>
              </div>
            )}
            {productBrand && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full border border-green-200">
                <span className="text-xs font-semibold">Brand:</span>
                <span className="text-sm font-medium">{productBrand}</span>
              </div>
            )}
            {productStock && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200">
                <span className="text-xs font-semibold">Stock:</span>
                <span className="text-sm font-medium">{productStock}</span>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-2 hover:bg-gray-50">
                <ArrowUpDown className="w-4 h-4" />
                <span className="font-medium">Filters</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px] bg-white shadow-xl border border-gray-200 p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Category</Label>
                  <Select value={filterData.Category} onValueChange={(value) => setFilterData((prevData) => ({
                    ...prevData,
                    Category : value
                  }))}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select Category"/>
                    </SelectTrigger>
                    <SelectContent>
                      {FilterOptions.Category.map(opt => 
                        <SelectItem key={opt.id} value={opt.label}>
                          {opt.label}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Brand</Label>
                  <Select value={filterData.Brand} onValueChange={(value) => setFilterData((prevData) => ({
                    ...prevData,
                    Brand : value
                  }))}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select Brand"/>
                    </SelectTrigger>
                    <SelectContent>
                      {FilterOptions.Brand.map(opt => 
                        <SelectItem key={opt.id} value={opt.label}>
                          {opt.label}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Stock Status</Label>
                  <Select value={filterData.Stock} onValueChange={(value) => setFilterData((prevData) => ({
                    ...prevData,
                    Stock : value
                  }))}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select Stock"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => handleFetchProductList(filterData)} 
                    className="flex-1 bg-red-500 hover:bg-red-600"
                  >
                    Apply
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {setFilterData(initialState);handleFetchProductList(initialState)}} 
                    className="flex-1"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Products Table */}
        {
          products && products.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="w-[100px] font-semibold text-gray-700">Image</TableHead>
                    <TableHead className="font-semibold text-gray-700">Product</TableHead>
                    <TableHead className="font-semibold text-gray-700">Category</TableHead>
                    <TableHead className="font-semibold text-gray-700">Brand</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Price</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product,index) => (
                    <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            className="w-full h-full object-cover"
                            src={product?.Image[0]}
                            alt={product?.Title}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-gray-900">{product?.Title}</div>
                        {product?.Featured === "Yes" && (
                          <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full mt-1 inline-block">
                            Featured
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {product?.Category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {product?.Brand}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex h-full items-center justify-end">
                          {product.SalePrice > 0 ? (
                            <div className='flex flex-col items-end'>
                              <span className="text-lg font-bold text-red-600">{product.SalePrice} MAD</span>
                              <span className='text-xs text-gray-400 line-through'>{product.Price} MAD</span>
                            </div>
                          ) : (
                            <span className="text-lg font-semibold text-gray-900">{product.Price} MAD</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex gap-2 justify-center items-center'>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="hover:bg-green-50 hover:border-green-300"
                            onClick={() => {
                              setProductOpeningDrawer(true);
                              setCurrentEditedID(product?._id);
                              setFormData({
                                title : product.Title,
                                description : product.Description,
                                category : product.Category,
                                brand : product.Brand,
                                price : product.Price,
                                salePrice : product?.SalePrice,
                                featured : product?.Featured,
                                sizes : product?.Size,
                              });
                            }}
                          >
                            <Ellipsis className='w-4 h-4 text-green-600'/>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="hover:bg-red-50 hover:border-red-300"
                            onClick={() => {setOrderToBeDeleted(product);setOpenDeleteDialog(true);}}
                          >
                            <Trash2 className='w-4 h-4 text-red-500'/>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 flex w-full justify-center">
                <Paginator
                  currentPage={currentProductPage}
                  setCurrentPage={setCurrentProductPage}
                  pageCount={pageCount}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <RadarIcon className='w-12 h-12 text-gray-400'/>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
              <p className="max-w-md text-gray-600 mb-6">
                It looks like there are no products matching your filters. Try adjusting your filters or add a new product.
              </p>
              <Button 
                onClick={() => setProductOpeningDrawer(true)}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                <Plus className="w-4 h-4 mr-2"/>
                Add Your First Product
              </Button>
            </div>
          )
        }

        {orderToBeDeleted !== null && 
          <Dialog open={openDeleteDialogDialog} onOpenChange={setOpenDeleteDialog}>
            <DialogContent className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">Delete Product?</DialogTitle>
              <p className='text-gray-600 mb-6'>Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className='flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6'>
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300 flex-shrink-0">
                  <img className='w-full h-full object-cover' src={orderToBeDeleted?.Image[0]} alt={orderToBeDeleted?.Title} />
                </div>
                <div className='flex flex-col gap-2 flex-1'>
                  <span className='font-bold text-gray-900 text-lg'>{orderToBeDeleted?.Title}</span>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500">Category:</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">{orderToBeDeleted?.Category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500">Brand:</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">{orderToBeDeleted?.Brand}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-2" 
                  onClick={() => setOpenDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold" 
                  onClick={() => handleProductDelete(orderToBeDeleted?._id)}
                >
                  Delete Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      </div>
    </div>
  )
}

export default Admin_Product_List