import { 
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle } from '@/components/ui/card';
  import { Analytic_BarChart } from '../Analytics_Charts';
  import { fetchProduct } from '@/store/admin-slice/analytics';
  import React, { useEffect } from 'react'
  import { useDispatch, useSelector } from 'react-redux'
import { AlignHorizontalDistributeCenter, Boxes } from 'lucide-react';

function Products({analyticFilter}) {

    const dispatch = useDispatch();
    const {product} = useSelector((state) => state.analytics);
    const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";

    useEffect(() => {
      dispatch(fetchProduct({token,analyticFilter}));
      window.scroll({
        top  :0,
        left : 0,
        behavior : "smooth"
      });
    },[analyticFilter,dispatch])

  return (
    <div className='w-full'>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row  justify-between space-y-0 pb-2">
                <div className='max-w-[80%]'>
                <CardTitle className="text-sm font-medium">
                  Total Products Sold
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Total number of products sold across all orders
                </p>
                </div>
                <Boxes className='w-4 h-4 text-muted-foreground'/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{product?.totalProductsSold}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
                <div className='max-w-[80%]'>
                  <CardTitle className="text-sm font-medium">Average Product Price</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    The average price of products sold
                  </p>
                </div>
                <AlignHorizontalDistributeCenter className='w-4 h-4 text-muted-foreground'/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{product?.averageProductPrice} MAD</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
                <div className='max-w-[80%]'>
                <CardTitle className="text-sm font-medium">
                  Popular Size
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  The most frequently purchased product size
                </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                 <rect x="6" y="4" width="14" height="16" rx="2" />
                <path d="M9 10h8M10 6v4M16 6v4" />
                <circle cx="13" cy="14" r="2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{product.popularSize && (`${product?.popularSize.Size} (${product.popularSize.Quantity}) `)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
              <div className='max-w-[80%]'>
                  <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Total number of products currently unavailable
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M8 8l8 8M8 16l8-8" />
                  <path d="M12 12l4-4M12 12l-4 4" />

                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-red-600 font-bold">{product.outOfStockProducts}</div>
              </CardContent>
            </Card>
        </div>

        <div className='mt-5 w-full flex flex-col gap-4 justify-center md:flex-row'>
          <Card className='w-full md:w-[50%]'>
          <CardHeader className='p-3 space-y-0 mb-2'>
              <CardTitle className="text-lg">
                Size Popularity
              </CardTitle>
              <CardDescription>
              Here’s how different product sizes are performing. Provides insights into customer preferences for specific sizes.
              </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
              <Analytic_BarChart
                  chartData={product.sizeTrend}
                  XDataKey="size"
                  YDataKey="Quantity"
                  fillColor="#7F8C8D"
              />
            </CardContent>
          </Card>

          <Card className='w-full md:w-[50%]'>
            <CardHeader className='px-5 py-3 space-y-0 mb-2'>
              <CardTitle className="text-lg">
                Top Performing Products
              </CardTitle>
              <CardDescription>
              Identify the best-selling products in terms of quantity, providing a clear view of high-demand items in the store.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-5 justify-center'>
              {
                product.performingProducts && product.performingProducts.length > 0 && product.performingProducts.map((item,index) => 
                  <div className='flex gap-3'>
                    <img className="border border-gray-200 rounded" width={50} src={item.image[0]} />
                    <div className='flex flex-col'>
                        <span className='font-semibold'>{item.title}</span>
                        <span className='text-sm text-gray-500'>Total Quantity Purchased • {item.totalQuantity} </span>
                    </div>
                  </div>
                )
              }
            </CardContent>
          </Card>

        </div>
    </div>
  )
}

export default Products