import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { TVShows } from './pages/TVShows';
import { Favorites } from './pages/Favorites';
import { FavoritesProvider } from './context/FavoritesContext';
import { SourceProvider } from './context/SourceContext';

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <SourceProvider>
          <div className="min-h-screen bg-[#1a1a1a]">
            <Sidebar />
            
            <main className="pl-8 pr-8 pt-12">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tv-shows" element={<TVShows />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </main>
          </div>
        </SourceProvider>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App