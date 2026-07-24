import React, { useEffect, useState } from 'react';
import SearchFilter from "../../components/customers/SearchFilter";
import { SortOptions } from "../../config/config.js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, RadarIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilteredProducts } from '@/store/customer-slice/products';
import Customer_ProductCard from '../../components/customers/Customer_ProductCard';
import { useSearchParams } from 'react-router-dom';
import Paginator from '@/components/utility/Paginator';
import Loader from '@/components/utility/Loader';

function generateSearchQuery(filter) {
  const searchResult = [];
  for (const [key, value] of Object.entries(filter)) {
    if (Array.isArray(value) && value.length > 0) {
      searchResult.push(`${key}=${encodeURIComponent(value.join(","))}`);
    }
  }
  return searchResult.join("&");
}

function Catalog() {
  const dispatch = useDispatch();
  const { isLoading, products, pageCount } = useSelector((state) => state.customerProduct);
  const token = localStorage.getItem("flint_token") || "Invalid";
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState("latest");
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const searchCategory = searchParams.get("Category");

  function handleFilter(filterType, filterOption) {
    let filterChoice = { ...filter };

    if (!filterChoice[filterType]) {
      filterChoice[filterType] = [filterOption];
    } else {
      const index = filterChoice[filterType].indexOf(filterOption);
      if (index === -1) {
        filterChoice[filterType].push(filterOption);
      } else {
        filterChoice[filterType].splice(index, 1);
      }
    }

    setCurrentPage(1);
    setFilter(filterChoice);
    sessionStorage.setItem("filter", JSON.stringify(filterChoice));
  }

  function handleSort(value) {
    setCurrentPage(1);
    setSort(value);
  }

  useEffect(() => {
    if (filter !== null && sort !== null) {
      dispatch(fetchFilteredProducts({ token, filter, sort, currentPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [dispatch, filter, sort, currentPage]);

  useEffect(() => {
    if (filter && Object.keys(filter).length > 0) {
      setSearchParams(new URLSearchParams(generateSearchQuery(filter)));
    }
  }, [filter]);

  useEffect(() => {
    setFilter(JSON.parse(sessionStorage.getItem("filter")) || {});
  }, [searchCategory]);

  if (isLoading) {
    return <Loader message="Loading products, just a moment..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filter Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Filters</h3>
              <SearchFilter filter={filter} handleFilter={handleFilter} />
            </div>
          </aside>

          {/* Products Section */}
          <div className="w-full">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">All Products</h1>
                  <p className="text-gray-600 text-sm">
                    {products?.length || 0} {products?.length === 1 ? 'product' : 'products'} found
                  </p>
                </div>
                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 border-2 hover:bg-gray-50">
                      <ArrowUpDown className="h-4 w-4" />
                      <span className="font-medium">Sort by</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[220px] bg-white shadow-xl border border-gray-200">
                    <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                      {SortOptions.map((item) => (
                        <DropdownMenuRadioItem 
                          key={item.id} 
                          value={item.id}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          {item.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Products Grid */}
            {products && products.length > 0 ? (
              <>
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {products.map((product, index) => (
                    <Customer_ProductCard key={index} product={product} />
                  ))}
                </div>
                {/* Pagination */}
                {pageCount !== 0 && (
                  <div className="mt-8 flex justify-center">
                    <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} pageCount={pageCount} />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                    <RadarIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Available</h2>
                    <p className="text-gray-600 max-w-md">
                      It looks like there are no products matching your filters. Try adjusting your search criteria or explore other categories.
                    </p>
                  </div>
                  <Button 
                    variant="default" 
                    className="mt-4 bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      setFilter({});
                      sessionStorage.removeItem("filter");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Catalog;