/* @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
});

describe('De vin interactions', () => {
  it('opens the command palette with Ctrl+K and searches recipes into a modal', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard('{Control>}k{/Control}');
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Search wine formulas'), 'ginger');
    await user.keyboard('{Enter}');

    expect(await screen.findByRole('dialog', { name: 'Pinot Spiced Cooler' })).toBeInTheDocument();
    expect(screen.getByText('1.5 oz ginger beer')).toBeInTheDocument();
  });

  it('closes an existing recipe modal before opening the command palette', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('button', { name: 'View formula' })[0]);
    expect(await screen.findByRole('dialog', { name: 'Pinot Berry Spritz' })).toBeInTheDocument();

    await user.keyboard('{Control>}k{/Control}');

    expect(screen.queryByRole('dialog', { name: 'Pinot Berry Spritz' })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
  });

  it('exposes selected filter state to assistive technology', async () => {
    const user = userEvent.setup();
    render(<App />);

    const redFilter = screen.getByRole('button', { name: 'Red' });
    await user.click(redFilter);

    expect(redFilter).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
  });
});
