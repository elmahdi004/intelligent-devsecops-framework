import React from 'react'
import {FilterOptions} from "../../config/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"

function SearchFilter({filter,handleFilter}) {
    return (
        <div className="bg-background rounded-lg shadow-sm">
          <Accordion type="single" collapsible className='block sm:hidden'>
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-4 py-2">
                <h2 className="text-xl font-bold">Filters</h2>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                      {Object.keys(FilterOptions).map((type,index) => (
                        <Fragment key={index}>
                          <div>
                            <h3 className="text-base font-bold">{type}</h3>
                            <div className="grid gap-3 mt-3">
                              {FilterOptions[type].map((item,index) => (
                                <Label key={index} className="flex font-normal items-center gap-2 ">
                                  <Checkbox 
                                    checked={
                                      filter && 
                                      Object.keys(filter).length > 0 &&
                                      filter[type] &&
                                      filter[type].indexOf(item.label) !== -1
                                    }
                                    onCheckedChange={() => handleFilter(type,item.label)}
                                  />
                                  {item.label}
                                </Label>
                              ))}
                            </div>
                          </div>
                          <Separator />
                        </Fragment>
                      ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="hidden sm:block p-2 border-b">
            <h2 className="text-xl font-bold">Filters</h2>
          </div>
          <div className="hidden sm:block p-4 space-y-4">
            {Object.keys(FilterOptions).map((type,index) => (
              <Fragment key={index}>
                <div>
                  <h3 className="text-base font-bold">{type}</h3>
                  <div className="grid gap-3 mt-3">
                    {FilterOptions[type].map((item,index) => (
                      <Label key={index} className="flex font-normal items-center gap-2 ">
                        <Checkbox 
                          checked={
                            filter && 
                            Object.keys(filter).length > 0 &&
                            filter[type] &&
                            filter[type].indexOf(item.label) !== -1
                          }
                          onCheckedChange={() => handleFilter(type,item.label)}
                        />
                        {item.label}
                      </Label>
                    ))}
                  </div>
                </div>
                <Separator />
              </Fragment>
            ))}
          </div>
        </div>
      );
}

export default SearchFilter