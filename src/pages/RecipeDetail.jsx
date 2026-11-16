import { useParams } from 'react-router-dom';

function RecipeDetail() {
  // Reads :id from the URL, e.g. /recipe/5 -> id = "5"
  const { id } = useParams();
  return <h1>Receptas #{id}</h1>;
}

export default RecipeDetail;