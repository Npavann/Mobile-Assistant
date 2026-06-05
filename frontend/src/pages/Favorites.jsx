import { useEffect, useState } from "react"

function Favorites() {

  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || []
    setFavorites(saved)
  }, [])

  const removeFavorite = (id) => {

    const updated = favorites.filter(phone => phone._id !== id)

    setFavorites(updated)

    localStorage.setItem("favorites", JSON.stringify(updated))
  }

  return (
    <div>

      <h2>⭐ Favorite Phones</h2>

      {favorites.length === 0 && <p>No favorite phones yet</p>}

      {favorites.map(phone => (

        <div key={phone._id} style={{border:"1px solid gray",padding:"10px",margin:"10px"}}>

          <h3>{phone.model_name}</h3>
          <p>Price: ₹{phone.price}</p>
          <p>Processor: {phone.processor}</p>
          <p>Battery: {phone.battery}</p>

          <button onClick={() => removeFavorite(phone._id)}>
            Remove
          </button>

        </div>

      ))}

    </div>
  )

}

export default Favorites