import {sizeOptions} from "../../config/config"
import { Label } from "../ui/label";

function Product_Size_Selector({FormData,setFormData}) {

    const handleSizeClick = (size) => {
        setFormData((prevData) => {
            const existingIndex = prevData.sizes.findIndex((item) => item.size === size);

            if (existingIndex > -1) {
                return {
                    ...prevData,
                    sizes : prevData.sizes.filter((item) => item.size !== size)
                }
            } else {

                return {
                    ...prevData,
                    sizes : [...prevData.sizes, { size: size, quantity: 0 }]
                }
            }
        });
    };

    const handleQuantityChange = (size, quantity) => {
        setFormData((prevData) => {
            return {
                ...prevData,
                sizes : prevData.sizes.map((item) =>
                    item.size === size ? { ...item, quantity: parseInt(quantity) } : item
                )
            };
        } )
    };

  return (
    <div className="mt-3 grid w-full gap-1.5">
            <Label className="mb-1">Product Sizes</Label>
            <div className="grid grid-cols-3 gap-4">
                {sizeOptions.map((size) => {

                    const isSelected = FormData.sizes.some((item) => item.size === size);
                    const selectedSize = FormData.sizes.find((item) => item.size === size);

                    return (
                        <div
                            key={size}
                            onClick={() => handleSizeClick(size)}
                            className={`h-[84px] flex flex-col justify-center items-center gap-2  rounded-lg cursor-pointer
                                ${
                                    isSelected
                                        ? 'bg-blue-50 border border-blue-400'
                                        : 'bg-slate-100 border border-slate-200'
                                } hover:bg-blue-100 transition-all`}
                        >
                            <p className={`text-sm font-medium ${
                                isSelected ? 'text-blue-600' : 'text-gray-600'
                            }`}>{size}</p>

                            {
                                isSelected 
                                && (
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Qty"
                                    value={selectedSize.quantity}
                                    onChange={(e) => handleQuantityChange(size, e.target.value)}
                                    onClick={(e) => e.stopPropagation()} 
                                    className="w-16 p-1 text-center text-sm border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
  )
}

export default Product_Size_Selector