import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Hash, Map, MapPin, Phone, Building2, CheckCircle2, Edit2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

function Address_Tile({address,handleAddressDelete,setSelectedAddress,handleAddressEdit,selectedId}) {
  const isSelected = selectedId === address?._id;

  return (
    <Card 
      onClick={() => setSelectedAddress(address)} 
      className={`relative cursor-pointer transition-all duration-300 ${
        isSelected 
          ? "border-2 border-red-500 bg-red-50 shadow-lg scale-[1.02]" 
          : "border-2 border-gray-200 hover:border-red-300 hover:shadow-md"
      }`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <CardContent className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isSelected ? "bg-red-500" : "bg-gray-100"
          }`}>
            <Map className={`w-5 h-5 ${isSelected ? "text-white" : "text-gray-600"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm mb-1 ${isSelected ? "text-red-700" : "text-gray-700"}`}>
              {address?.Address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-gray-600">{address?.City}, {address?.Pincode}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-gray-600">{address?.Contact}</span>
        </div>

        {address?.Landmark && (
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-gray-600">{address?.Landmark}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleAddressEdit(address);
            }}
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-blue-50 hover:border-blue-300"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleAddressDelete(address);
            }}
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Address_Tile