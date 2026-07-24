import { Avatar, AvatarFallback } from "../ui/avatar"
import StarRating from "../utility/StarRating"


function Review_Tile({review}) {
  return (
    <div className="flex gap-4">
        <Avatar className="w-10 h-10">
            <AvatarFallback>{review?.Username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1 pt-1">
            <div className="flex items-center gap-2">
                <h3 className="font-semibold">{review?.Username}</h3>
            </div>
            <div className="flex items-center">
                <StarRating rating={review?.Rating} isEditable={false}/>
            </div>
            <p>{review?.Comment}</p>
        </div>
    </div>
  )
}

export default Review_Tile