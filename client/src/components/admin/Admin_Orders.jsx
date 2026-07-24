import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../ui/table"
  import { 
    Select ,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { OrderStatusColor } from '@/config/config';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Dialog } from '../ui/dialog'
import Admin_Order_Detail from './Admin_Order_Detail'
import { useDispatch , useSelector } from 'react-redux'
import { handleFetchAllAdminOrders ,handleDeleteOrder } from '@/store/admin-slice/admin_orders'
import Paginator from '../utility/Paginator'
import { Label } from '../ui/label'
import { PackageOpen , Trash2  } from 'lucide-react';

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

function Orders() {

const [openDetailDialog,setOpenDetailDialog] = useState(false);
const [adminSelectedOrder,setAdminSelectedOrder] = useState(null);
const dispatch = useDispatch();
const {orderList , pageCount} = useSelector((state) => state.adminOrder)
const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";
const [currentOrderPage,setCurrentOrderPage] = useState(1);
const [filterStatus,setFilterStatus] = useState("All");

useEffect(() => {
    if(openDetailDialog)return;
    dispatch(handleFetchAllAdminOrders({token,currentOrderPage,filterStatus}));
},[currentOrderPage,dispatch,openDetailDialog])

useEffect(() => {
    setCurrentOrderPage(1);
    dispatch(handleFetchAllAdminOrders({token,currentOrderPage,filterStatus}));
    window.scroll({
        top  :0,
        left : 0,
        behavior : "smooth"
    });
},[filterStatus])

const handleRemoveOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
        await dispatch(handleDeleteOrder(orderId)); // Dispatch the delete action
        dispatch(handleFetchAllAdminOrders({ token, currentOrderPage, filterStatus })); // Refresh the order list
    }
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Order Management</h1>
          <p className="text-gray-600">View and manage all customer orders</p>
        </div>
        <div className="w-full sm:w-auto">
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">Filter by Status</Label>
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
            <SelectTrigger className='w-full sm:w-[200px] border-2'>
              <SelectValue placeholder="All Orders"/>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="All">All Orders</SelectItem>
              {Object.keys(OrderStatusColor).map((item) => 
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        {orderList && orderList.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-center font-semibold text-gray-700">Items</TableHead>
                  <TableHead className="font-semibold text-gray-700">Order ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Amount</TableHead>
                  <TableHead className="text-center font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList.map((order,index) => (
                  <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="p-4">
                      <div className='relative flex justify-center items-center'>
                        {order.OrderItems.slice(0,3).map((orderitem,idx) => (
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
                            {idx === 2 && order.OrderItems.length > 3 && (
                              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                +{order.OrderItems.length - 3}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-gray-600 font-medium">
                        {order?._id.slice(-8).toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-700">
                        {new Date(order?.OrderCreationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`px-3 py-1.5 text-sm font-semibold ${orderColorMapper(order.OrderStatus)} text-white`}>
                        {order.OrderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">{order.OrderTotal} MAD</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center items-center">
                        <Button 
                          variant="outline"
                          className="hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => {
                            setAdminSelectedOrder(order);
                            setOpenDetailDialog(true);
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-red-50 hover:border-red-300"
                          onClick={() => handleRemoveOrder(order._id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className='w-full mt-6 flex justify-center'>
              <Paginator
                currentPage={currentOrderPage}
                setCurrentPage={setCurrentOrderPage}
                pageCount={pageCount}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <PackageOpen className='w-12 h-12 text-gray-400'/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h2>
            <p className="max-w-md text-gray-600">
              {filterStatus === "All" 
                ? "You don't have any orders yet. Orders will appear here once customers start placing them."
                : `No orders found with status "${filterStatus}". Try selecting a different status.`
              }
            </p>
          </div>
        )}

        {adminSelectedOrder !== null && 
          <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
            <Admin_Order_Detail order={adminSelectedOrder} setOpenDetailDialog={setOpenDetailDialog} />
          </Dialog>
        }
      </div>
    </div>
  )
}

export default Orders