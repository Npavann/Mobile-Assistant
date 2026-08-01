import { useEffect, useState } from "react"

const COLORS = {
  pageBg: "radial-gradient(ellipse at 30% 20%, #45437F 0%, #2A2856 38%, #16152E 72%, #0B0A1A 100%)",
  headerText: "#FFFFFF",
  star: "#F5C542",
  emptyText: "#B0ADD1",
  cardBg: "rgba(255, 255, 255, 0.06)",
  cardBorder: "rgba(255, 255, 255, 0.14)",
  modelText: "#FFFFFF",
  specText: "#B0ADD1",
  removeBg: "rgba(239,68,68,0.12)",
  removeBorder: "rgba(239,68,68,0.4)",
  removeText: "#FCA5A5",
}

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
    <div style={{ background: COLORS.pageBg, minHeight: "100vh", padding: "1.5rem", fontFamily: "'Inter', sans-serif" }}>

      <h2 style={{ color: COLORS.headerText, fontSize: "1.4rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ color: COLORS.star }}>⭐</span> Favorite Phones
      </h2>

      {favorites.length === 0 && <p style={{ color: COLORS.emptyText, fontSize: "0.95rem" }}>No favorite phones yet</p>}

      {favorites.map(phone => (

        <div key={phone._id} style={{
          background: COLORS.cardBg,
          border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: "10px",
          padding: "1rem 1.25rem",
          margin: "10px 0"
        }}>

          <h3 style={{ color: COLORS.modelText, margin: "0 0 0.5rem", fontSize: "1.1rem", fontWeight: 700 }}>{phone.model_name}</h3>
          <p style={{ color: COLORS.specText, margin: "0.2rem 0" }}>Price: ₹{phone.price}</p>
          <p style={{ color: COLORS.specText, margin: "0.2rem 0" }}>Processor: {phone.processor}</p>
          <p style={{ color: COLORS.specText, margin: "0.2rem 0 0.75rem" }}>Battery: {phone.battery}</p>

          <button onClick={() => removeFavorite(phone._id)} style={{
            background: COLORS.removeBg,
            border: `1.5px solid ${COLORS.removeBorder}`,
            color: COLORS.removeText,
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer"
          }}>
            Remove
          </button>

        </div>

      ))}

    </div>
  )

}

export default Favorites
