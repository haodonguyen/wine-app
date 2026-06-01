import { ChevronRight, CornerDownLeft, Search, X } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

function scoreCommand(item, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return 1;
  }

  const haystack = [item.label, item.description, ...(item.keywords ?? [])].join(' ').toLowerCase();
  if (haystack.includes(normalizedQuery)) {
    return 3;
  }

  let cursor = 0;
  for (const character of normalizedQuery) {
    cursor = haystack.indexOf(character, cursor);
    if (cursor === -1) {
      return 0;
    }
    cursor += 1;
  }

  return 2;
}

export function CommandPalette({
  open,
  onOpenChange,
  groups,
  placeholder = 'Search wines, formulas, notes...',
  emptyMessage = 'No matching formula found.',
  shortcut = ['Meta', 'Control', 'k'],
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filteredGroups = useMemo(() => {
  return groups
      .map((group) => ({
        ...group,
        items: group.items
          .map((item) => ({ ...item, score: scoreCommand(item, query) }))
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label)),
      }))
      .filter((group) => group.items.length > 0)
      .sort((a, b) => {
        if (!query.trim()) {
          return 0;
        }

        const maxA = Math.max(...a.items.map((item) => item.score));
        const maxB = Math.max(...b.items.map((item) => item.score));
        return maxB - maxA;
      });
  }, [groups, query]);

  const flatItems = filteredGroups.flatMap((group) => group.items);
  const selectedItem = flatItems[selectedIndex];

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      const wantsPalette =
        (shortcut.includes('Meta') && event.metaKey && event.key.toLowerCase() === 'k') ||
        (shortcut.includes('Control') && event.ctrlKey && event.key.toLowerCase() === 'k');

      if (wantsPalette) {
        event.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onOpenChange, open, shortcut]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
      return undefined;
    }

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (selectedIndex > flatItems.length - 1) {
      setSelectedIndex(Math.max(flatItems.length - 1, 0));
    }
  }, [flatItems.length, selectedIndex]);

  if (!open) {
    return null;
  }

  const selectItem = (item) => {
    if (!item || item.disabled) {
      return;
    }

    item.onSelect?.();
    onOpenChange(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onOpenChange(false);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((current) => (flatItems.length ? (current + 1) % flatItems.length : 0));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((current) => (flatItems.length ? (current - 1 + flatItems.length) % flatItems.length : 0));
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      selectItem(selectedItem);
    }
  };

  let runningIndex = -1;

  return (
    <div className="command-backdrop" role="presentation" onMouseDown={() => onOpenChange(false)}>
      <section
        aria-label="Command palette"
        aria-modal="true"
        className="command-palette"
        role="dialog"
        onKeyDown={handleKeyDown}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="command-search-row">
          <Search aria-hidden="true" size={20} />
          <input
            ref={inputRef}
            aria-label="Search wine formulas"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <button type="button" aria-label="Close command palette" onClick={() => onOpenChange(false)}>
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <div className="command-list" role="listbox" aria-label="Wine formula commands">
          {filteredGroups.length === 0 ? <p className="command-empty">{emptyMessage}</p> : null}

          {filteredGroups.map((group) => (
            <div className="command-group" key={group.id}>
              <p>{group.heading}</p>
              {group.items.map((item) => {
                runningIndex += 1;
                const itemIndex = runningIndex;
                const Icon = item.icon;
                const isSelected = itemIndex === selectedIndex;

                return (
                  <button
                    className={isSelected ? 'command-item selected' : 'command-item'}
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    onClick={() => selectItem(item)}
                  >
                    <span className="command-icon">{Icon ? <Icon aria-hidden="true" size={18} /> : null}</span>
                    <span className="command-copy">
                      <strong>{item.label}</strong>
                      {item.description ? <span>{item.description}</span> : null}
                    </span>
                    {item.shortcut ? (
                      <span className="command-shortcut">
                        {item.shortcut.map((key) => (
                          <kbd key={key}>{key}</kbd>
                        ))}
                      </span>
                    ) : (
                      <ChevronRight aria-hidden="true" size={17} />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="command-footer">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            Navigate
          </span>
          <span>
            <CornerDownLeft aria-hidden="true" size={14} />
            Open
          </span>
          <span>
            <kbd>Esc</kbd>
            Close
          </span>
        </div>
      </section>
    </div>
  );
}
