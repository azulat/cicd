import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import React from 'react';

describe('App', () => {
  it('should start with an uppercase letter', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    const text = heading.textContent;

    expect(text.charAt(0)).toMatch(/^[A-Z]/);
  });
});
