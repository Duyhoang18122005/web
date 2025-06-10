import React, { useState, useEffect } from 'react';
import { getAllGames } from '../data/call_api/CallApiGame';
import { Link } from 'react-router-dom';

const GameCategories = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const gamesData = await getAllGames();
        setGames(gamesData);
      } catch (err) {
        setError('Failed to load games');
        console.error('Error fetching games:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {games.map((game) => (
        <Link
          key={game.id}
          to={`/game/${game.id}`}
          className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
        >
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={game.imageUrl}
              alt={game.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-2">{game.name}</h3>
            <p className="text-gray-400 text-sm mb-2">{game.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{game.category}</span>
              <span className="text-sm text-gray-500">{game.platform}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GameCategories;
