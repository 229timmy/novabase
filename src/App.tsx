import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { TVShows } from './pages/TVShows';
import { Favorites } from './pages/Favorites';
import { Search } from './pages/Search';
import { Categories } from './pages/Categories';
import { Profile } from './pages/Profile';
import { Landing } from './pages/Landing';
import { FavoritesProvider } from './context/FavoritesContext';
import { SourceProvider } from './context/SourceContext';
import { SupabaseProvider } from './context/SupabaseContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <SupabaseProvider>
        <FavoritesProvider>
          <SourceProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-[#1a1a1a]">
                      <Sidebar />
                      <main className="pl-8 pr-8 pt-12">
                        <Routes>
                          <Route path="/home" element={<Home />} />
                          <Route path="/search" element={<Search />} />
                          <Route path="/movies" element={<Movies />} />
                          <Route path="/tv-shows" element={<TVShows />} />
                          <Route path="/favorites" element={<Favorites />} />
                          <Route path="/categories" element={<Categories />} />
                          <Route path="/profile" element={<Profile />} />
                        </Routes>
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </SourceProvider>
        </FavoritesProvider>
      </SupabaseProvider>
    </BrowserRouter>
  );
}

export default App