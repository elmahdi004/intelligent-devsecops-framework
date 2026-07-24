import { useEffect, useState } from "react"
import { AddressFormTemplate } from "../../config/config"
import Address_Tile from "./Address_Tile"
import Form from "../utility/Form"
import { useDispatch, useSelector } from "react-redux"
import { handleAddAddress, handleDeleteAddress, handleFetchAddress, handleUpdateAddress } from "@/store/customer-slice/address"
import { useToast } from "@/hooks/use-toast"
import { Button } from "../ui/button"

const AddressInitialFormData = {
    address : "",
    city : "",
    pincode : "",
    contact : "",
    landmark : ""
}

function Address({setSelectedAddress,selectedId}) {

    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth);
    const {addressList} = useSelector((state) => state.address);
    const {toast} = useToast();
    const [currentEditedAddressId,setCurrentEditedAddressId] = useState(null);
    const [formData,setFormData] = useState(AddressInitialFormData);
    const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";
    
    function isFormValid()
    {
        if(formData.pincode && ( formData.pincode.length != 6 || isNaN(formData.pincode) ))
        {
            return false;
        }

        if(formData.contact && ( formData.contact.length != 10 || isNaN(formData.contact) ))
        {
            return false;
        }
        
        return Object.keys(formData)
        .filter((key) => key !== "landmark") 
        .map((key) => formData[key].trim() !== "")   
        .every((isValid) => isValid);
    }

    async function onSubmit(e)
    {
        e.preventDefault();

        if(currentEditedAddressId === null && addressList.length >= 4)
        {
            toast({
                title : "Customers can add upto 4 addresses only",
                variant : "destructive"
            });
            setFormData(AddressInitialFormData);
            setCurrentEditedAddressId(null);
            return;
        }

        if(currentEditedAddressId !== null)
        {
            dispatch(handleUpdateAddress({
                token : token,
                userId : user?.id,
                addressId : currentEditedAddressId,
                formData
            })).then((data) => {
                if(data.payload?.success)
                {
                    setCurrentEditedAddressId(null);
                    setFormData(AddressInitialFormData);
                    toast({
                        title : "Address edited successfully"
                    });
                }
            })
        }
        else
        {
            dispatch(handleAddAddress({
                formData,
                token:token,
                userId : user?.id
            })).then((data) => {
                if(data.payload?.success)
                {
                    setFormData(AddressInitialFormData);
                    toast({
                        title : "Address added successfully"
                    })
                }
            })
        }
    }

    function handleAddressEdit(addressToBeEdited)
    {
        
        setFormData({
            ...formData,
            address : addressToBeEdited?.Address,
            city : addressToBeEdited?.City,
            pincode : addressToBeEdited?.Pincode,
            contact : addressToBeEdited?.Contact,
            landmark : addressToBeEdited?.Landmark
        })
        setCurrentEditedAddressId(addressToBeEdited?._id);
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
    }

    function handleAddressDelete(addressToBeDeleted)
    {
        dispatch(handleDeleteAddress({
            token:token,
            userId : user?.id,
            addressId : addressToBeDeleted?._id
        })).then((data) => 
        {
            if(data.payload?.success)
            {
                toast({
                    title : "Address deleted successfully"
                })
            }
        })
    }

    useEffect(() => {
        dispatch(handleFetchAddress({token,userId : user?.id}));
    },[])

  return (
    <div className="space-y-6">
      {/* Existing Addresses */}
      {addressList && addressList.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Delivery Address</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {addressList.map((item,index) => (
              <Address_Tile 
                key={index} 
                handleAddressDelete={handleAddressDelete} 
                handleAddressEdit={handleAddressEdit}
                setSelectedAddress={setSelectedAddress} 
                address={item}
                selectedId={selectedId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Address Form */}
      <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {currentEditedAddressId === null ? "Add New Address" : "Edit Address"}
            </h3>
            {currentEditedAddressId !== null && (
              <Button 
                variant="outline"
                onClick={() => {
                  setCurrentEditedAddressId(null);
                  setFormData(AddressInitialFormData);
                }}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {currentEditedAddressId === null 
              ? "Add a new delivery address to your account"
              : "Update your address information"
            }
          </p>
        </div>
        <div>
          <Form 
            FormTemplate={AddressFormTemplate}
            FormData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            isSubmitDisabled={!isFormValid()}
            EventName={currentEditedAddressId === null ? "Add Address" : "Update Address"}
          />
        </div>
      </div>
    </div>
  )
}

export default Address