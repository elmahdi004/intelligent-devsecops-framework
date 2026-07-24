import { handleOrderValidation } from '@/store/customer-slice/orders';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'

function Payment_Validator() {

    const [ searchParams ] = useSearchParams();
    const status = searchParams.get("status");
    const order_Id = searchParams.get("order_Id");
    const session_Id = searchParams.get("session_Id");
    const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(!status || !order_Id || !session_Id)
        {
            navigate('/shop/home')
            return;
        }
        dispatch(handleOrderValidation({
            token,
            status,
            order_Id,
            session_Id
        })).then((data) => {
            if(data.payload?.success)
            {
                navigate('/shop/payment/success');
            }
            else
            {
                navigate("/shop/payment/rejected");
            }
        })
    },[])

    return (
        <div className='flex justify-center items-center h-[calc(100vh-105px)]'>
          <div className='flex flex-col gap-3 w-[90%] sm:w-[40%] justify-center items-center text-center shadow-2xl rounded py-5 px-2 border border-gray-200'>
            <img
            src="/process.gif"
            width="120px"
            />
             <span className="text-3xl font-bold text-gray-800 mb-2">Processing Your Payment...</span>
            <span className="text-sm md:text-lg text-gray-700">
            Your payment is currently being processed. This may take a few seconds. Once confirmed, you’ll receive an update on your order status.
            </span>
          </div>
        </div>
      )
}

export default Payment_Validator