const Product = require("../../models/Products")

const handleSearchProducts = async(req,res) => {
    try
    {
        const {searchQuery} = req.params;

        if(typeof searchQuery !== "string")
        {
            res.status(400).json({
                status : false,
                message : "Invalid search query"
            })
        }

        const pattern = new RegExp(searchQuery , 'i');

        const MongoSearchQuery = {
            $or : [
                {Title : pattern},
                {Description : pattern},
                {Category : pattern},
                {Brand : pattern}
            ]
        }

        const result = await Product.find(MongoSearchQuery);

        res.status(200).json({
            success : true,
            result
        })

    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            status : false,
            message : "Search Products | Internal Server Error"
        })
    }
}

module.exports = {
    handleSearchProducts
}