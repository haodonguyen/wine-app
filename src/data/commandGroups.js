import { GlassWater, Search, Wine } from 'lucide-react';

export function createCommandGroups(wines, { selectWine, openRecipe, focusCatalog }) {
  return [
    {
      id: 'quick-actions',
      heading: 'Quick Actions',
      items: [
        {
          id: 'focus-catalog',
          label: 'Browse bottle catalog',
          description: 'Return to the wine selection cards',
          icon: Search,
          shortcut: ['G', 'B'],
          keywords: ['browse', 'catalog', 'bottle', 'wine'],
          onSelect: focusCatalog,
        },
      ],
    },
    {
      id: 'wines',
      heading: 'Wines',
      items: wines.map((wine) => ({
        id: `wine-${wine.id}`,
        label: wine.name,
        description: `${wine.family} bottle / ${wine.recipes.length} formulas`,
        icon: Wine,
        keywords: [wine.family, wine.profile],
        onSelect: () => selectWine(wine.id),
      })),
    },
    {
      id: 'formulas',
      heading: 'Drink Formulas',
      items: wines.flatMap((wine) =>
        wine.recipes.map((recipe) => ({
          id: `recipe-${recipe.id}`,
          label: recipe.name,
          description: `${recipe.baseWine} / ${recipe.difficulty} / ${recipe.glassware}`,
          icon: GlassWater,
          keywords: [
            recipe.baseWine,
            recipe.difficulty,
            recipe.glassware,
            ...recipe.tasteNotes,
            ...recipe.ingredients,
            ...recipe.steps,
          ],
          onSelect: () => openRecipe(wine.id, recipe),
        })),
      ),
    },
  ];
}
