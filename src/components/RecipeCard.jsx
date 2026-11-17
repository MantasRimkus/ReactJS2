import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';
import FavoriteButton from './FavoriteButton';

function RecipeCard({ recipe }) {
  const { isFavorite } = useContext(FavoritesContext);

  return (
    <article className="recipe-card">
      <div className="recipe-card-image">
        <img src={recipe.image} alt={recipe.name} loading="lazy" />
        {isFavorite(recipe.id) && <span className="favorite-badge">★ Mėgstamas</span>}
      </div>
      <div className="recipe-card-body">
        <h3>{recipe.name}</h3>
        <p className="muted">Virtuvė: {recipe.cuisine}</p>
        <div className="recipe-card-actions">
          <Link to={`/recipe/${recipe.id}`} className="btn btn-primary">
            Plačiau
          </Link>
          <FavoriteButton recipe={recipe} />
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;