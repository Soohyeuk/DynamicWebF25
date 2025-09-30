import { useState } from 'react'
import './user_rating.css'

const MIN_RATING = 0
const MAX_RATING = 5

const UserRating = () => {
  const [rating, setRating] = useState(0)

  const handlePlusClick = () => {
    if (rating < MAX_RATING) {
      setRating(rating + 1)
    }
  }

  const handleMinusClick = () => {
    if (rating > MIN_RATING) {
      setRating(rating - 1)
    }
  }

  const atMin = rating <= MIN_RATING
  const atMax = rating >= MAX_RATING

  return (
    <div className="user_rating" aria-label="User rating">
      <button
        className={`user_rating_button ${atMin ? 'is-hidden' : ''}`}
        onClick={handleMinusClick}
        aria-label="Decrease rating"
        disabled={atMin}
      >
        -
      </button>
      <div className="user_rating_hearts">
        {rating > 0 && (
          Array.from({ length: rating }).map((_, index) => (
            <span key={index} className="material-symbols-outlined heart">
              favorite
            </span>
          ))
        )}
      </div>
      <button
        className={`user_rating_button ${atMax ? 'is-hidden' : ''}`}
        onClick={handlePlusClick}
        aria-label="Increase rating"
        disabled={atMax}
      >
        +
      </button>

    </div>
  )
}

export default UserRating
