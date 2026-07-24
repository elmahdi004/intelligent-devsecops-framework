import { 
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle } from '@/components/ui/card';
    import { CategoryColor } from '@/config/config';
  import { Analytic_BarChart, Analytic_PieChart } from '../Analytics_Charts';
  import { fetchSales } from '@/store/admin-slice/analytics';
  import React, { useEffect } from 'react'
  import { useDispatch, useSelector } from 'react-redux'
import { Percent } from 'lucide-react';

function Sales({analyticFilter}) {

    const dispatch = useDispatch();
    const {sales} = useSelector((state) => state.analytics);
    const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";

    useEffect(() => {
      dispatch(fetchSales({token,analyticFilter}));
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
                  Total Revenue
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Total income from all orders
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
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-green-600 font-bold">{sales?.totalRevenue} MAD</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
                <div className='max-w-[80%]'>
                  <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                  <p className="text-xs text-muted-foreground">
                  Average revenue per order
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
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sales?.averageOrderValue} MAD</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
                <div className='max-w-[80%]'>
                <CardTitle className="text-sm font-medium">
                  Total Discount
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Total discount value utilized by customers
                </p>
                </div>
                <Percent className='w-4 h-4 text-muted-foreground'/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sales?.discountTotal} MAD</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
              <div className='max-w-[80%]'>
                  <CardTitle className="text-sm font-medium">Revenue per Item</CardTitle>
                  <p className="text-xs text-muted-foreground">
                  Average revenue generated per item sold
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
                  <path d="M8 12h8M10 10v4M14 10v4" />

                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sales.revenuePerItem} MAD</div>
              </CardContent>
            </Card>
        </div>

        <div className='mt-5 w-full flex flex-col gap-4 justify-center md:flex-row'>
          <Card className='w-full md:w-[50%]'>
          <CardHeader className='p-3 space-y-0 mb-2'>
              <CardTitle className="text-lg">
                Revenue Trend
              </CardTitle>
              <CardDescription>
              Monthly revenue generated over the past six months, highlighting sales trends and performance patterns
              </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
              <Analytic_BarChart
                  chartData={sales.RevenueTrendData}
                  XDataKey="Month"
                  YDataKey="Revenue"
                  fillColor="#7F8C8D"
              />
            </CardContent>
          </Card>

          <Card className='w-full md:w-[50%]'>
            <CardHeader className='px-5 py-3 space-y-0 mb-2'>
              <CardTitle className="text-lg">
                Revenue by Product Category
              </CardTitle>
              <CardDescription>
              Visualize the proportion of revenue contributed by different product categories
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-5 justify-center'>
              <Analytic_PieChart 
                  chartData={sales.revenuePerCategory}
                  dataKey="totalRevenue"
                  nameKey="category"
                  color={CategoryColor}
              />
            </CardContent>
          </Card>

        </div>
    </div>
  )
}

export default Sales