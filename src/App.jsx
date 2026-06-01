import { BookOpen, ChevronRight, CircleX, Command, GlassWater, Search, Sparkles } from 'lucide-react';
import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import heroImage from './assets/de-vin-cinematic-hero.png';
import { CommandPalette } from './components/ui/CommandPalette.jsx';
import { createCommandGroups } from './data/commandGroups.js';
import { wines } from './data/wines.js';

const filters = ['All', 'Red', 'White'];

function App() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedWineId, setSelectedWineId] = useState(wines[0].id);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const catalogRef = useRef(null);

  const filteredWines = useMemo(() => {
    if (activeFilter === 'All') {
      return wines;
    }

    return wines.filter((wine) => wine.family === activeFilter);
  }, [activeFilter]);

  const selectedWine = wines.find((wine) => wine.id === selectedWineId) ?? filteredWines[0] ?? wines[0];

  const commandGroups = useMemo(
    () =>
      createCommandGroups(wines, {
        selectWine: (wineId) => {
          const nextWine = wines.find((wine) => wine.id === wineId);
          if (nextWine) {
            setActiveFilter('All');
            setSelectedWineId(wineId);
            setActiveRecipe(null);
            window.requestAnimationFrame(() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' }));
          }
        },
        openRecipe: (wineId, recipe) => {
          setActiveFilter('All');
          setSelectedWineId(wineId);
          setActiveRecipe(recipe);
        },
        focusCatalog: () => {
          setActiveRecipe(null);
          catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
        },
      }),
    [],
  );

  useEffect(() => {
    if (!filteredWines.some((wine) => wine.id === selectedWineId)) {
      setSelectedWineId(filteredWines[0]?.id ?? wines[0].id);
    }
  }, [activeFilter, filteredWines, selectedWineId]);

  useEffect(() => {
    if (!activeRecipe) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveRecipe(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeRecipe]);

  return (
    <main className="app-shell">
      <section className="catalog-hero" aria-labelledby="page-title">
        <img src={heroImage} alt="" className="hero-image" />
        <div className="hero-vignette" />
        <header className="hero-content">
          <p className="eyebrow">Bottle-first wine formulas</p>
          <h1 id="page-title">De vin</h1>
          <p className="hero-copy">
            Choose a familiar bottle, then learn simple ways to turn it into a balanced glass.
          </p>
          <button className="hero-command" type="button" onClick={() => setCommandOpen(true)}>
            <Command aria-hidden="true" size={17} />
            Search formulas
            <kbd>⌘K</kbd>
          </button>
        </header>
      </section>

      <section className="catalog-panel" aria-label="Wine formula catalog" ref={catalogRef}>
        <div className="catalog-toolbar">
          <div>
            <p className="section-kicker">Start with the bottle</p>
            <h2>Choose your wine</h2>
          </div>

          <div className="toolbar-actions">
            <button className="find-button" type="button" onClick={() => setCommandOpen(true)}>
              <Search aria-hidden="true" size={17} />
              Find formula
              <kbd>⌘K</kbd>
            </button>

            <div className="filter-group" aria-label="Filter wine families">
              <span className={`filter-thumb ${activeFilter.toLowerCase()}`} aria-hidden="true" />
              {filters.map((filter) => (
                <button
                  className={activeFilter === filter ? 'filter-button active' : 'filter-button'}
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="wine-grid">
          {filteredWines.map((wine) => (
            <button
              className={selectedWine.id === wine.id ? 'wine-card selected' : 'wine-card'}
              key={wine.id}
              style={{ '--accent': wine.accent }}
              type="button"
              onClick={() => setSelectedWineId(wine.id)}
            >
              <span className="bottle-wrap" aria-hidden="true">
                <span className="bottle-neck" />
                <span className="bottle-body" />
              </span>
              <span className="wine-card-copy">
                <span className="wine-family">{wine.family}</span>
                <strong>{wine.name}</strong>
                <span>{wine.profile}</span>
              </span>
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          ))}
        </div>

        <section className="results-section" aria-labelledby="results-heading">
          <div className="selected-wine">
            <div>
              <p className="section-kicker">Selected bottle</p>
              <h2 id="results-heading">{selectedWine.name}</h2>
              <p>{selectedWine.profile}</p>
            </div>
            <div className="formula-count">
              <BookOpen aria-hidden="true" size={18} />
              {selectedWine.recipes.length} formulas
            </div>
          </div>

          <div className="recipe-grid">
            {selectedWine.recipes.map((recipe) => (
              <article className="recipe-card" key={recipe.id}>
                <div className="recipe-card-top">
                  <span className="difficulty">{recipe.difficulty}</span>
                  <GlassWater aria-hidden="true" size={20} />
                </div>
                <h3>{recipe.name}</h3>
                <p>{recipe.tasteNotes.join(' / ')}</p>
                <div className="recipe-meta">
                  <span>{recipe.glassware}</span>
                  <span>{recipe.ingredients.length} ingredients</span>
                </div>
                <button type="button" className="recipe-button" onClick={() => setActiveRecipe(recipe)}>
                  <Search aria-hidden="true" size={17} />
                  View formula
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>

      <footer className="site-footer">
        <Sparkles aria-hidden="true" size={16} />
        For people of legal drinking age. Enjoy slowly, measure honestly, and drink responsibly.
      </footer>

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        groups={commandGroups}
        placeholder="Search Pinot, spritz, citrus, glassware..."
        emptyMessage="No matching wine formula. Try a bottle, ingredient, or taste note."
      />

      {activeRecipe ? <RecipeModal recipe={activeRecipe} onClose={() => setActiveRecipe(null)} /> : null}
    </main>
  );
}

function RecipeModal({ recipe, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="recipe-title"
        aria-modal="true"
        className="recipe-modal"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="Close recipe" onClick={onClose}>
          <CircleX aria-hidden="true" size={24} />
        </button>

        <p className="section-kicker">{recipe.baseWine}</p>
        <h2 id="recipe-title">{recipe.name}</h2>

        <div className="modal-facts">
          <span>{recipe.difficulty}</span>
          <span>{recipe.glassware}</span>
        </div>

        <div className="modal-columns">
          <div>
            <h3>Ingredients</h3>
            <ul>
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Steps</h3>
            <ol>
              {recipe.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="taste-row" aria-label="Taste notes">
          {recipe.tasteNotes.map((note) => (
            <span key={note}>{note}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
