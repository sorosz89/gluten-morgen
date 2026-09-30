import { useParams } from 'react-router-dom'

function RecipeDetailPage() {
  const { id } = useParams()
  return <p>Recept részletei: {id}</p>
}

export default RecipeDetailPage
