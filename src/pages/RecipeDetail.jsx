import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRecipeById } from '../api/recipesApi';
import StatusMessage from '../components/StatusMessage';

function RecipeDetail() {
  // id comes from the route /recipe/:id - works on direct open and page reload too
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setRecipe(null);
    setError('');
    setNotFound(false);

    // Non-numeric id cannot exist, no need to ask the API
    if (!/^\d+$/.test(id)) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    getRecipeById(id, controller.signal)
      .then((data) => setRecipe(data))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        if (err.status === 404) {
          setNotFound(true);
        } else {
          setError('Nepavyko gauti recepto. ' + err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [id, reloadKey]);

  return (
    <section>
      <Link to="/dashboard" className="back-link">
        ← Grįžti į receptų sąrašą
      </Link>

      {isLoading && <StatusMessage type="loading">Kraunamas receptas...</StatusMessage>}

      {!isLoading && notFound && (
        <StatusMessage type="error">Receptas nerastas. Patikrinkite nuorodą.</StatusMessage>
      )}

      {!isLoading && error && (
        <StatusMessage type="error" onRetry={() => setReloadKey((prev) => prev + 1)}>
          {error}
        </StatusMessage>
      )}

      {!isLoading && recipe && (
        <article className="recipe-detail">
          <img src={recipe.image} alt={recipe.name} className="recipe-detail-image" />

          <div className="recipe-detail-info">
            <h1>{recipe.name}</h1>
            <p className="muted">Virtuvė: {recipe.cuisine}</p>

            <ul className="recipe-facts">
              <li>
                <strong>{recipe.prepTimeMinutes} min.</strong>
                <span>Paruošimas</span>
              </li>
              <li>
                <strong>{recipe.cookTimeMinutes} min.</strong>
                <span>Gaminimas</span>
              </li>
              <li>
                <strong>{recipe.servings}</strong>
                <span>Porcijos</span>
              </li>
            </ul>
          </div>

          <div className="recipe-detail-section">
            <h2>Ingredientai</h2>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="recipe-detail-section">
            <h2>Gaminimo žingsniai</h2>
            <ol>
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </article>
      )}
    </section>
  );
}

export default RecipeDetail;