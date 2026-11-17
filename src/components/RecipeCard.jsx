import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      <div className="recipe-card-image">
        <img src={recipe.image} alt={recipe.name} loading="lazy" />
      </div>
      <div className="recipe-card-body">
        <h3>{recipe.name}</h3>
        <p className="muted">Virtuvė: {recipe.cuisine}</p>
        <div className="recipe-card-actions">
          <Link to={`/recipe/${recipe.id}`} className="btn btn-primary">
            Plačiau
          </Link>
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;