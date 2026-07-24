import React from 'react'
import { 
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious, } from '../ui/pagination'

function Paginator({currentPage , setCurrentPage , pageCount}) {
  return (
    <Pagination>
          <PaginationContent>

            <PaginationItem disabled={currentPage === 1}>
              <PaginationPrevious onClick={() => setCurrentPage((prevPage) => prevPage-1)} />
            </PaginationItem>
            
            {
              Array.from({length : pageCount},(_,i) => i+1).map((page,index) => 
                <PaginationItem className={`hidden ${index+1 === currentPage ? "block" : ""} sm:block`} key={index} onClick={() => {setCurrentPage(page)}} >
                  <PaginationLink isActive={currentPage === page} className="border-gray-500">{page}</PaginationLink>
                </PaginationItem>
              )
            }

            <PaginationItem disabled={currentPage === pageCount}>
              <PaginationNext onClick={() => setCurrentPage((prevPage) => prevPage+1)}/>
            </PaginationItem>

          </PaginationContent>
      </Pagination>
  )
}

export default Paginator