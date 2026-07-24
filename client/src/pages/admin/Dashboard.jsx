import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sales from "../../components/admin/Analytics/Sales"
import Orders from "../../components/admin/Analytics/Orders"
import { Calendar, TrendingUp, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import Products from "@/components/admin/Analytics/Products";

function Dashboard() {

  const [analyticFilter,setAnalyticFilter] = useState("All-Time")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-sm text-gray-500 font-medium">{analyticFilter}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 border-2 hover:bg-gray-50">
                <Calendar className='h-4 w-4 text-gray-600'/>
                <span className="font-medium">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px] bg-white shadow-xl border border-gray-200">
                <DropdownMenuRadioGroup value={analyticFilter} onValueChange={(value) => setAnalyticFilter(value)} >
                    <DropdownMenuRadioItem className='cursor-pointer hover:bg-gray-50 py-2' value="All-Time">
                      All Time
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem className='cursor-pointer hover:bg-gray-50 py-2' value="Past-3-months">
                      Past 3 months
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem className='cursor-pointer hover:bg-gray-50 py-2' value="Past-6-months">
                      Past 6 months
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl mb-6">
            <TabsTrigger 
              value="sales" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600 font-semibold rounded-lg"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Sales
            </TabsTrigger>
            <TabsTrigger 
              value="order"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600 font-semibold rounded-lg"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="product"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600 font-semibold rounded-lg"
            >
              Products
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="mt-0">
            <Sales analyticFilter={analyticFilter}/>
          </TabsContent>
          <TabsContent value="order" className="mt-0">
            <Orders analyticFilter={analyticFilter} />
          </TabsContent>
          <TabsContent value="product" className="mt-0">
            <Products analyticFilter={analyticFilter} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Dashboard