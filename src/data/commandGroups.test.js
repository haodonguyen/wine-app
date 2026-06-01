import { describe, expect, it, vi } from 'vitest';
import { createCommandGroups } from './commandGroups.js';
import { wines } from './wines.js';

describe('command palette groups', () => {
  it('exposes every wine and recipe as a selectable command', () => {
    const groups = createCommandGroups(wines, {
      selectWine: vi.fn(),
      openRecipe: vi.fn(),
      focusCatalog: vi.fn(),
    });

    const labels = groups.flatMap((group) => group.items.map((item) => item.label));
    const recipeCount = wines.reduce((total, wine) => total + wine.recipes.length, 0);

    expect(labels).toContain('Browse bottle catalog');
    expect(wines.every((wine) => labels.includes(wine.name))).toBe(true);
    expect(wines.every((wine) => wine.recipes.every((recipe) => labels.includes(recipe.name)))).toBe(true);
    expect(labels.length).toBe(1 + wines.length + recipeCount);
  });

  it('includes ingredients and steps in recipe search keywords', () => {
    const groups = createCommandGroups(wines, {
      selectWine: vi.fn(),
      openRecipe: vi.fn(),
      focusCatalog: vi.fn(),
    });

    const recipeItems = groups.find((group) => group.id === 'formulas').items;
    const rieslingGinger = recipeItems.find((item) => item.label === 'Riesling Ginger Lime');

    expect(rieslingGinger.keywords.join(' ').toLowerCase()).toContain('ginger ale');
    expect(rieslingGinger.keywords.join(' ').toLowerCase()).toContain('top with ginger ale');
  });
});
