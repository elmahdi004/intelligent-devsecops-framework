const Address = require("../../models/Address")

const handleAddAddress = async(req,res) => {
    try
    {
        const {
            userId,
            address,
            city,
            pincode,
            contact,
            landmark
        } = req.body;

        if(!userId || !address || !city || !pincode || !contact)
        {
            return res.status(400).json({
                success : false,
                message : "Enter valid details"
            })
        }

        const newAddress = new Address({
            UserId : userId,
            Address : address,
            City : city,
            Pincode : pincode,
            Contact : contact,
            Landmark : landmark === "" ? "" : landmark
        })

        await newAddress.save();

        return res.status(200).json({
            success : true,
            address : newAddress
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Add Address | Internal Server Error"
        })
    }
}

const handleEditAddress = async(req,res) => {
    try
    {
        const { userId , addressId } = req.params;
        const updatedData = req.body;

        if(!userId || !addressId)
        {
            return res.status(400).json({
                success : false,
                message : "UserId and AddressId is required"
            })
        }

        const updatedAddress = await Address.findOneAndUpdate(
            {
                _id : addressId,
                UserId : userId
            },
            {
                Address : updatedData.address ? updatedData.address : "",
                City : updatedData.city ? updatedData.city : "",
                Pincode :updatedData.pincode ? updatedData.pincode : "",
                Contact : updatedData.contact ? updatedData.contact : "",
                Landmark : updatedData.landmark ? updatedData.landmark : ""
            },
            {
                new : true
            }
        );

        if(!updatedAddress)
        {
            return res.status(404).json({
                success : false,
                message : "Address not found"
            })
        }

        res.status(200).json({
            success : true,
            address : updatedAddress
        })

    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Edit Address | Internal Server Error"
        })
    }
}

const handleDeleteAddress = async(req,res) => {
    try
    {
        const { userId , addressId } = req.params;

        if(!userId || !addressId)
        {
            return res.status(400).json({
                success : false,
                message : "UserId and AddressId is required"
            })
        }

        const deletedAddress = await Address.findOneAndDelete(
            {
                _id : addressId,
                UserId : userId
            }
        );

        if(!deletedAddress)
        {
            return res.status(404).json({
                success : false,
                message : "Address not found"
            })
        }

        res.status(200).json({
            success : true,
            address : deletedAddress
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Delete Address | Internal Server Error"
        })
    }
}

const handleFetchAddress = async(req,res) => {
    try
    {
        const {userId} = req.params;

        if(!userId)
        {
            return res.status(400).json({
                success : false,
                message : "UserId is required"
            })
        }

        const userAddress = await Address.find({UserId : userId});

        return res.status(200).json({
            success : true,
            address : userAddress
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Fetch Address | Internal Server Error"
        })
    }
}

module.exports = {
    handleAddAddress,
    handleEditAddress,
    handleDeleteAddress,
    handleFetchAddress
}