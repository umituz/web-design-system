import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router';
import { NotFoundPage } from '../presentation/templates/NotFoundPage';
import { RouteErrorPage, describeRouteError } from '../presentation/templates/RouteErrorPage';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('NotFoundPage', () => {
  it('renders kicker, code, title, description and mixed link/button actions', () => {
    render(
      <MemoryRouter>
        <NotFoundPage
          kicker="404 · TEST"
          title="Off the flight plan"
          description="This page doesn't exist."
          actions={[
            { label: 'Back to dashboard', to: '/dashboard' },
            { label: 'View campaigns', to: '/campaigns' },
            { label: 'Report', onClick: () => {} },
          ]}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('404 · TEST')).toBeTruthy();
    expect(screen.getByText('Off the flight plan')).toBeTruthy();
    expect(screen.getByText("This page doesn't exist.")).toBeTruthy();
    // `to` actions render as links, onClick stays a button.
    expect(screen.getByRole('link', { name: 'Back to dashboard' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'View campaigns' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Report' })).toBeTruthy();
  });

  it('derives a single primary action from homeTo when actions are absent', () => {
    render(
      <MemoryRouter>
        <NotFoundPage homeTo="/overview" homeLabel="Back to Overview" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Back to Overview' }).getAttribute('href')).toBe('/overview');
  });

  it('hides the status code for an empty code and renders no actions without any', () => {
    render(
      <MemoryRouter>
        <NotFoundPage code="" title="Nothing here" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Nothing here')).toBeTruthy();
    expect(screen.queryByText('404')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('describeRouteError', () => {
  it('uses the message of thrown Errors', () => {
    expect(describeRouteError(new Error('boom'))).toEqual({
      title: 'Something went wrong',
      detail: 'boom',
    });
  });

  it('stringifies non-error throws', () => {
    expect(describeRouteError('nope')).toEqual({ title: 'Something went wrong', detail: 'nope' });
  });
});

describe('RouteErrorPage', () => {
  it('describes a thrown route error and offers reload + home actions', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Boom(): never {
      throw new Error('kaboom');
    }
    const router = createMemoryRouter(
      [{ path: '/boom', element: <Boom />, errorElement: <RouteErrorPage app="test" homeTo="/home" /> }],
      { initialEntries: ['/boom'] },
    );
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('kaboom')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reload' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Back to app' }).getAttribute('href')).toBe('/home');
    expect(errorSpy).toHaveBeenCalledWith('[test] Unhandled route error:', expect.anything());
  });

  it('maps loader Response throws to status title and router-rejected detail', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const router = createMemoryRouter(
      [
        {
          path: '/gone',
          loader: () => {
            throw new Response(null, { status: 404, statusText: 'Not Found' });
          },
          element: null,
          errorElement: <RouteErrorPage app="test" note="Your session data is untouched." />,
        },
      ],
      { initialEntries: ['/gone'] },
    );
    render(<RouterProvider router={router} />);
    expect(await screen.findByText('404 — Not Found')).toBeTruthy();
    expect(screen.getByText('The router rejected this navigation.')).toBeTruthy();
    expect(screen.getByText('Your session data is untouched.')).toBeTruthy();
  });
});
