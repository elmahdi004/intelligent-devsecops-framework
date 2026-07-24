import React from 'react'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import Product_Size_Selector from '../admin/Product_Size_Selector';
  
import { Input } from '../ui/input';
import { Button } from '../ui/button';
function Form({FormTemplate,FormData,setFormData,onSubmit,EventName,isSubmitDisabled,formType}) {

  function generateFormComponent(ele)
  {
        let component = null ;

        const value =  FormData[ele.name] || "";

        if(ele.component === "input")
        {
            if(ele.type === "number")
            {
                component = (<Input
                    type = {ele.type}
                    placeholder={ele.placeholder}
                    onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                    id={ele.name}
                    value={value}
                    onChange={(e) => setFormData(
                        {...FormData, 
                        [ele.name] : e.target.value}
                    )}
                />)
            }
            else
            {
                component = (<Input
                    type = {ele.type}
                    placeholder={ele.placeholder}
                    id={ele.name}
                    value={value}
                    onChange={(e) => setFormData(
                        {...FormData, 
                        [ele.name] : e.target.value}
                    )}
                />)
            }
        }
        else if(ele.component === "select")
        {
            component = (
            <Select onValueChange={(value) => setFormData({
                ...FormData,
                [ele.name] : value
            })} value={value}>
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder={ele.label}/>
                </SelectTrigger>
                <SelectContent>
                    {
                        ele.options?.map(opt => 
                        <SelectItem key={opt.id} value={opt.label}>
                                {opt.label}
                        </SelectItem>)
                    }
                </SelectContent>
            </Select>)
        }
        else if(ele.component === "textarea")
        {
            component = (<Textarea
                placeholder={ele.placeholder}
                id={ele.name}
                value={value}
                onChange={(e) => setFormData(
                    {...FormData, 
                    [ele.name] : e.target.value}
                )}
            />)
        }

        return component;
  }

  return (
    <form onSubmit={onSubmit}>
        <div className='flex flex-col gap-4'>
            {
                FormTemplate.map((it) => 
                    (
                    <div key={it.name} className='grid w-full gap-1.5'>
                        <Label className='mb-1'>{it.label}</Label>
                        {
                            generateFormComponent(it)
                        }
                    </div>
                    )
                )
            }
        </div>
        {formType === "SizeForm"
        ?
        <Product_Size_Selector FormData={FormData} setFormData={setFormData} />
        :
        null
        }
        <Button type='submit' disabled={isSubmitDisabled} className='mt-5 mb-3 w-full'>{EventName ? EventName : "Submit"}</Button>
    </form>
  )
}

export default Form