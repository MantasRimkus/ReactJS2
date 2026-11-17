import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';
import FavoriteButton from '../components/FavoriteButton';
import StatusMessage from '../components/StatusMessage';

function Favorites() {
  // The context already contains only the logged-in user's records (?userId=...)
  const { favorites, isLoading, loadError, reloadFavorites } = useContext(FavoritesContext);

  return (
    <section>
      <h1>Mėgstamiausi receptai</h1>

      {isLoading && <StatusMessage type="loading">Kraunami mėgstamiausi receptai...</StatusMessage>}

      {!isLoading && loadError && (
        <StatusMessage type="error" onRetry={reloadFavorites}>
          Nepavyko gauti mėgstamiausių receptų. {loadError}
        </StatusMessage>
      )}

      {!isLoading && !loadError && favorites.length === 0 && (
        <StatusMessage>Mėgstamiausių receptų dar nėra.</StatusMessage>
      )}

      {!isLoading && !loadError && favorites.length > 0 && (
        <ul className="favorites-list">
          {favorites.map((favorite) => (
            <li key={favorite.id} className="favorite-item">
              {favorite.image && <img src={favorite.image} alt={favorite.name} />}
              <div className="favorite-item-body">
                <h3>{favorite.name ?? `Receptas #${favorite.recipeId}`}</h3>
                <Link to={`/recipe/${favorite.recipeId}`}>Peržiūrėti receptą</Link>
              </div>
              {/* FavoriteButton expects a recipe-like object, so it is built from the record */}
              <FavoriteButton
                recipe={{ id: favorite.recipeId, name: favorite.name, image: favorite.image }}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Favorites;