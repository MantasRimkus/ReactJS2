import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getRecipes } from '../api/recipesApi';
import { RECIPES_PER_PAGE } from '../api/config';
import RecipeCard from '../components/RecipeCard';
import StatusMessage from '../components/StatusMessage';

// Reads ?page=N from the URL; anything invalid becomes page 1
function parsePage(value) {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

function RecipeList() {
  // Page is kept in the URL, so "back" from a recipe returns to the same page
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePage(searchParams.get('page'));

  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError('');

    getRecipes(page, controller.signal)
      .then((data) => {
        setRecipes(data.recipes);
        setTotal(data.total);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setRecipes([]);
          setError('Nepavyko gauti receptų. ' + err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    // If the page changes quickly, the old request is cancelled
    return () => controller.abort();
  }, [page, reloadKey]);

  const totalPages = Math.max(1, Math.ceil(total / RECIPES_PER_PAGE));
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  const goToPage = (newPage) => {
    setSearchParams({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section>
      <h1>Receptai</h1>

      {isLoading && <StatusMessage type="loading">Kraunami receptai...</StatusMessage>}

      {!isLoading && error && (
        <StatusMessage type="error" onRetry={() => setReloadKey((prev) => prev + 1)}>
          {error}
        </StatusMessage>
      )}

      {!isLoading && !error && recipes.length === 0 && (
        <StatusMessage>Šiame puslapyje receptų nėra.</StatusMessage>
      )}

      {!isLoading && !error && recipes.length > 0 && (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => goToPage(page - 1)}
          disabled={isFirstPage || isLoading}
        >
          ← Atgal
        </button>
        <span>
          Puslapis {page} iš {total > 0 ? totalPages : '–'}
        </span>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => goToPage(page + 1)}
          disabled={isLastPage || isLoading || Boolean(error)}
        >
          Kitas →
        </button>
      </div>
    </section>
  );
}

export default RecipeList;