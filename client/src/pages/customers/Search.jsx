import Customer_ProductCard from '@/components/customers/Customer_ProductCard';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label';
import { clearSearchResults, fetchSearchResults } from '@/store/customer-slice/search';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function Search() {

    const [searchQuery,setSearchQuery] = useState("");

    const dispatch = useDispatch();
    const {searchResults} = useSelector((state) => state.search);
    const token = localStorage.getItem("flint_token") ? localStorage.getItem("flint_token") : "Invalid";

    useEffect(() => {
        if(searchQuery.trim() === "" || searchQuery.trim().length < 3)
        {
            dispatch(clearSearchResults());
            return;
        }

        setTimeout(() => {
            dispatch(fetchSearchResults({token,searchQuery}));
        },2000)
    },[searchQuery])
    
  return (
    <div className='w-full flex flex-col items-center'>
        <div className='my-4 w-[70%]'>
            <Label>Search Products</Label>
            <Input
                className="px-3 py-5 mt-1 border border-gray-400"
                placeholder="Search by Title, Description, Category, Brand"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        {
            searchQuery.trim() !== "" && searchResults.length === 0 &&
            <span className='text-gray-600 font-semibold text-xl'>
                No results found
            </span>
        }
        <div className='w-[70%] grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {
                searchResults.map((item,index) => 
                    <Customer_ProductCard key={index} product={item} />
                )
            }
        </div>
    </div>
  )
}

export default Search