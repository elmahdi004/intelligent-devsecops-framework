import { 
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle } from '@/components/ui/card';
  import { Analytic_LineChart, Analytic_PieChart } from '../Analytics_Charts';
  import { fetchOrder } from '@/store/admin-slice/analytics';
  import React, { useEffect } from 'react'
  import { useDispatch, useSelector } from 'react-redux'
import { OrderStatusColor } from '@/config/config';
import { Container } from 'lucide-react';

function Orders({analyticFilter}) {

    const dispatch = useDispatch();
    const {order} = useSelector((state) => state.analytics);
    const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";
  
    useEffect(() => {
      dispatch(fetchOrder({token,analyticFilter}));
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
                  Total Orders
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  The total number of orders placed 
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
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M8 8h8M8 12h8M8 16h4" />

                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{order?.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
                <div className='max-w-[80%]'>
                  <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                  <p className="text-xs text-muted-foreground">
                  The total number of orders successfully delivered.
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
                  <path d="M9 11l3 3L22 4M21 11v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6M8 21h8" />

                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{order?.completedOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
                <div className='max-w-[80%]'>
                <CardTitle className="text-sm font-medium">
                  Active Orders
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  The total number of orders in pipeline
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
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{order?.pendingOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
              <div className='max-w-[80%]'>
                  <CardTitle className="text-sm font-medium">Average Items per Order</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    The average number of items included in each order
                  </p>
                </div>
                <Container className='w-4 h-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{order.averageItemsPerOrder}</div>
              </CardContent>
            </Card>
        </div>

        <div className='mt-5 w-full flex flex-col gap-4 justify-center md:flex-row'>
          <Card className='w-full md:w-[50%]'>
          <CardHeader className='p-3 space-y-0 mb-2'>
              <CardTitle className="text-lg">
                Order Trend
              </CardTitle>
              <CardDescription>
              Visualize the number of orders placed over a specific period. Highlights trends and patterns in customer purchasing behavior
              </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
              {
                order?.orderTrend && order?.orderTrend.length > 1
                ?
                <Analytic_LineChart
                  chartData={order.orderTrend}
                  XDataKey="Month"
                  YDataKey="Orders"
                  strokeColor="#7F8C8D"
                />
                :
                <div className="relative m-2 min-h-96 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gray-100 blur"></div>

                  <div className="relative z-10 flex flex-col items-center text-gray-600 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 3v18h18"></path>
                      <path d="m19 9-5 5-4-4-3 3"></path>
                    </svg>
                    <p className="mt-4 text-lg font-medium">
                      Not enough data to display the chart.
                    </p>
                    <p className="text-sm text-gray-500">
                      Please check back later when more data becomes available.
                    </p>
                  </div>
              </div>


              }
              
            </CardContent>
          </Card>

          <Card className='w-full md:w-[50%]'>
            <CardHeader className='px-5 py-3 space-y-0 mb-2'>
              <CardTitle className="text-lg">
                Order Status Distribution
              </CardTitle>
              <CardDescription>
              Take a look at the proportion of orders across various statuses. Highlights order fulfillment and processing efficiency.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-5 justify-center'>
              <Analytic_PieChart 
                  chartData={order?.orderStatusDistribution}
                  dataKey="statusCount"
                  nameKey="status"
                  color={OrderStatusColor}
              />
            </CardContent>
          </Card>

        </div>
    </div>
  )
}

export default Orders