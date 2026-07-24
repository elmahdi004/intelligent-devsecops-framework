import React , {useEffect, useState} from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../ui/table"
import Customer_Order_Details from './Customer_Order_Details'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { handleFetchAllOrders } from '@/store/customer-slice/orders'
import { Badge } from '../ui/badge'
import { PackageOpen } from 'lucide-react'

function orderColorMapper(status)
{
    let colorCode = "";
    
    switch (status) {
        case "Confirmed":
            colorCode = "bg-[#5A82B4]"; break;
        case "Processing":
            colorCode = "bg-[#728AB7]"; break;
        case "Shipping":
            colorCode = "bg-[#4C9A76]"; break;
        case "Out for Delivery":
            colorCode = "bg-[#D39F5D]"; break;
        case "Delivered":
            colorCode = "bg-[#76A365]"; break;
        case "Cancelled":
            colorCode = "bg-[#B46969]"; break;
        default:
            break;
    }

    return colorCode;
}

function Customer_Orders() {

  const [openCustomerOrderDialog,setOpenCustomerOrderDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.auth)
  const {orderList} = useSelector((state) => state.order)
  const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";
  const [selectedOrder,setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(handleFetchAllOrders({token , userId : user?.id}))
    }
  },[dispatch, user?.id])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Order History</h2>
        <p className="text-gray-600">View and track all your orders</p>
      </div>

      {orderList && orderList.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-center font-semibold text-gray-700">Items</TableHead>
                  <TableHead className="font-semibold text-gray-700">Order ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Amount</TableHead>
                  <TableHead className="text-center font-semibold text-gray-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList.map((item,index) => (
                  <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="p-4">
                      <div className='relative flex justify-center items-center'>
                        {item.OrderItems.slice(0,3).map((orderitem,idx) => (
                          <div
                            key={idx}
                            style={{zIndex : 3 - idx, marginLeft: idx !== 0 ? '-12px' : '0'}}
                            className="relative"
                          >
                            <img 
                              src={orderitem.Image[0]} 
                              className="bg-white w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" 
                              alt={`Item ${idx + 1}`}
                            />
                            {idx === 2 && item.OrderItems.length > 3 && (
                              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                +{item.OrderItems.length - 3}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-gray-600 font-medium">
                        #{item?._id.slice(-8).toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-700">
                        {new Date(item?.OrderCreationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`px-3 py-1.5 text-sm font-semibold ${orderColorMapper(item.OrderStatus)} text-white`}>
                        {item.OrderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">{item.OrderTotal} MAD</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline"
                        className="hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => {
                          setOpenCustomerOrderDialog(true);
                          setSelectedOrder(item);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <PackageOpen className='w-12 h-12 text-gray-400'/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 max-w-md mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Button 
              onClick={() => navigate('/shop/catalog')}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            >
              Browse Products
            </Button>
          </div>
        </div>
      )}

      {selectedOrder !== null && (
        <Dialog
          open={openCustomerOrderDialog}
          onOpenChange={setOpenCustomerOrderDialog}
        >
          <Customer_Order_Details order={selectedOrder}/>
        </Dialog>
      )}
    </div>
  )
}

export default Customer_Orders