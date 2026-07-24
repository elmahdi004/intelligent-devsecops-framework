import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import Customer_Orders from '../../components/customers/Customer_Orders'
import Address from '../../components/customers/Address'

function Account() {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50'>
      <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-orange-500">
        <img
          src="/accountBanner.jpg"
          className="h-full w-full object-cover object-center opacity-30"
          alt="Account Banner"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">My Account</h1>
        </div>
      </div>
      <div className='container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8'>
            <Tabs defaultValue="orders" className='w-full'>
              <div className='flex justify-center items-center mb-6'>
                <TabsList className="bg-gray-100 p-1 rounded-xl w-full max-w-md">
                  <TabsTrigger 
                    className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600 font-semibold" 
                    value="orders"
                  >
                    Orders
                  </TabsTrigger>
                  <TabsTrigger 
                    className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600 font-semibold" 
                    value="address"
                  >
                    Address
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="orders" className="mt-6">
                <Customer_Orders />
              </TabsContent>
              <TabsContent value="address" className="mt-6">
                <Address />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account