import { StarIcon } from "lucide-react"
import { Button } from "../ui/button"

function  StarRating({rating,handleSetRating,isEditable}) {

if(!isEditable)
{
  return [1,2,3,4,5].map((item,index) => 
    <StarIcon key={index} className={`w-4 h-4 ${item <= rating ? "fill-yellow-300 text-yellow-300" : "fill-none"}`}/>
  )
}

  return (
        [1,2,3,4,5].map((item,index) => 
            <Button key={index} variant="ghost" size="icon" onClick={() => handleSetRating(item)}
            className={`rounded-full h-6 w-6 transition-colors 
            ${item <= rating ? "text-yellow-300 hover:bg-black" 
            : "text-black hover:bg-primary hover:text-primary-foreground"}`}>
                <StarIcon className={`w-4 h-4 ${item <= rating ? "fill-yellow-300" : "fill-none"}`}/>
            </Button>
        )
  )
}

export default StarRating