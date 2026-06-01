import { describe, expect, it } from 'vitest';
import { wines } from './wines.js';

const expectedWineNames = [
  'Pinot Noir',
  'Merlot',
  'Cabernet Sauvignon',
  'Chardonnay',
  'Sauvignon Blanc',
  'Riesling',
];

describe('curated wine catalog', () => {
  it('contains the six starter wine categories', () => {
    expect(wines.map((wine) => wine.name)).toEqual(expectedWineNames);
  });

  it('links every wine to at least three complete beginner formulas', () => {
    for (const wine of wines) {
      expect(wine.recipes.length).toBeGreaterThanOrEqual(3);

      for (const recipe of wine.recipes) {
        expect(recipe.name).toBeTruthy();
        expect(recipe.baseWine).toBe(wine.name);
        expect(recipe.ingredients.length).toBeGreaterThanOrEqual(3);
        expect(recipe.steps.length).toBeGreaterThanOrEqual(2);
        expect(recipe.tasteNotes.length).toBeGreaterThanOrEqual(2);
        expect(recipe.difficulty).toMatch(/Easy|Medium/);
        expect(recipe.glassware).toBeTruthy();
      }
    }
  });
});
