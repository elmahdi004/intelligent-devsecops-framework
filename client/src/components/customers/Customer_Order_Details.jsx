import {
    DialogContent , DialogTitle, DialogDescription
} from "../../components/ui/dialog";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { MapPin, Calendar, CreditCard, Package, Phone, Hash } from "lucide-react";

function orderColorMapper(status) {
    let colorCode = "";
    switch (status) {
        case "Confirmed": colorCode = "bg-[#5A82B4]"; break;
        case "Processing": colorCode = "bg-[#728AB7]"; break;
        case "Shipping": colorCode = "bg-[#4C9A76]"; break;
        case "Out for Delivery": colorCode = "bg-[#D39F5D]"; break;
        case "Delivered": colorCode = "bg-[#76A365]"; break;
        case "Cancelled": colorCode = "bg-[#B46969]"; break;
        default: break;
    }
    return colorCode;
}

function Customer_Order_Details({order}) {

  return (
    <DialogContent className="max-h-[90vh] sm:max-w-[600px] overflow-y-auto bg-white">
      <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">Order Details</DialogTitle>
      <DialogDescription className="text-gray-600 mb-6">
        Complete information about your order
      </DialogDescription>
      
      {/* Order Info Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase">Order ID</span>
          </div>
          <p className="font-mono text-sm font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase">Date</span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {new Date(order?.OrderCreationDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[140px]">
          <span className="text-xs font-semibold text-gray-500 uppercase block mb-2">Order Status</span>
          <Badge className={`px-4 py-2 text-sm font-semibold ${orderColorMapper(order.OrderStatus)} text-white w-full justify-center`}>
            {order.OrderStatus}
          </Badge>
        </div>
        <div className="flex-1 min-w-[140px]">
          <span className="text-xs font-semibold text-gray-500 uppercase block mb-2">Payment</span>
          <Badge className={`px-4 py-2 text-sm font-semibold ${
            order.PaymentStatus === 'Paid' ? 'bg-green-500' : 'bg-yellow-500'
          } text-white w-full justify-center`}>
            {order.PaymentStatus}
          </Badge>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Order Items */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-red-500" />
          Order Items
        </h3>
        <div className="space-y-4">
          {order.OrderItems && order.OrderItems.length > 0 &&
            order.OrderItems.map((item,index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  <img className="w-full h-full object-cover" src={item.Image[0]} alt={item.Title} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.Title}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                    <span className="px-2 py-0.5 bg-white rounded text-xs font-medium">Size: {item.Size}</span>
                    <span className="px-2 py-0.5 bg-white rounded text-xs font-medium">Qty: {item.Quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.SalePrice > 0 ? (
                      <>
                        <span className="text-lg font-bold text-red-600">{item.SalePrice.toFixed(2)} MAD</span>
                        <span className="text-sm text-gray-400 line-through">{item.Price.toFixed(2)} MAD</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">{item.Price.toFixed(2)} MAD</span>
                    )}
                    <span className="text-sm text-gray-500">× {item.Quantity}</span>
                    <span className="ml-auto font-bold text-gray-900">
                      = {(item.SalePrice > 0 ? item.SalePrice : item.Price) * item.Quantity} MAD
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Price Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Price Summary</h3>
        <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">
              {(parseFloat(order?.OrderTotal) - 10).toFixed(2)} MAD
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Shipping Fee</span>
            <span className="font-semibold text-gray-900">10.00 MAD</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-red-600">{order?.OrderTotal.toFixed(2)} MAD</span>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Shipping Address */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          Delivery Address
        </h3>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200">
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">{order?.OrderAddress.Address}</p>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{order?.OrderAddress.City} - {order?.OrderAddress.Pincode}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{order?.OrderAddress.Contact}</span>
            </div>
            {order?.OrderAddress.Landmark && (
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium">Landmark:</span> {order?.OrderAddress.Landmark}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-900">Payment Method</span>
        </div>
        <p className="text-sm text-blue-700">{order.PaymentMethod}</p>
      </div>
    </DialogContent>
  )
}

export default Customer_Order_Details