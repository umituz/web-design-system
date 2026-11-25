import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Eyebrow } from '../presentation/atoms/Eyebrow';
import { Card } from '../presentation/organisms/Card';
import { InsightItem } from '../presentation/molecules/InsightItem';
import { InsightList } from '../presentation/molecules/InsightList';
import { ActivityItem } from '../presentation/molecules/ActivityItem';
import { ActivityList } from '../presentation/molecules/ActivityList';

afterEach(cleanup);

describe('Eyebrow atom', () => {
  it('renders default paragraph with uppercase tracking and muted tone', () => {
    render(<Eyebrow data-testid="eyebrow">Weekly Overview</Eyebrow>);
    const el = screen.getByTestId('eyebrow');
    expect(el.tagName).toBe('P');
    expect(el.className).toContain('text-[11px]');
    expect(el.className).toContain('uppercase');
    expect(el.className).toContain('tracking-[0.14em]');
    expect(el.className).toContain('text-muted-foreground');
  });

  it('renders as custom element with specified tone', () => {
    render(
      <Eyebrow as="span" tone="primary" data-testid="eyebrow-span">
        Category
      </Eyebrow>
    );
    const el = screen.getByTestId('eyebrow-span');
    expect(el.tagName).toBe('SPAN');
    expect(el.className).toContain('text-primary');
  });
});

describe('Card accent side and tone', () => {
  it('renders no accent border by default', () => {
    render(<Card data-testid="card">Content</Card>);
    const el = screen.getByTestId('card');
    expect(el.className).not.toContain('border-l-2');
  });

  it('renders left accent border with primary tone', () => {
    render(
      <Card accentSide="left" accentTone="primary" data-testid="card-accent-left">
        Content
      </Card>
    );
    const el = screen.getByTestId('card-accent-left');
    expect(el.className).toContain('border-l-2');
    expect(el.className).toContain('!border-l-primary');
  });

  it('renders top accent border with destructive tone', () => {
    render(
      <Card accentSide="top" accentTone="destructive" data-testid="card-accent-top">
        Content
      </Card>
    );
    const el = screen.getByTestId('card-accent-top');
    expect(el.className).toContain('border-t-2');
    expect(el.className).toContain('!border-t-destructive');
  });
});

describe('InsightItem and InsightList molecules', () => {
  it('renders minimal variant with tone dot and text', () => {
    render(
      <InsightItem
        title="Study Habit"
        description="Completed 3 days in a row"
        tone="positive"
        data-testid="insight-item"
      />
    );
    expect(screen.getByText('Study Habit')).toBeDefined();
    expect(screen.getByText('Completed 3 days in a row')).toBeDefined();
    const el = screen.getByTestId('insight-item');
    expect(el.className).toContain('flex');
  });

  it('renders callout variant with icon and tone background', () => {
    render(
      <InsightItem
        title="Warning"
        description="Exam is in 2 days"
        tone="attention"
        variant="callout"
        icon={<span data-testid="warning-icon">!</span>}
        data-testid="insight-callout"
      />
    );
    const el = screen.getByTestId('insight-callout');
    expect(el.className).toContain('border-amber-500/30');
    expect(screen.getByTestId('warning-icon')).toBeDefined();
  });

  it('renders empty message in InsightList when items are empty', () => {
    render(<InsightList items={[]} emptyMessage="No insights yet." />);
    expect(screen.getByText('No insights yet.')).toBeDefined();
  });

  it('renders items list correctly in InsightList', () => {
    render(
      <InsightList
        items={[
          { id: '1', title: 'Tip 1', tone: 'primary' },
          { id: '2', title: 'Tip 2', tone: 'danger' },
        ]}
      />
    );
    expect(screen.getByText('Tip 1')).toBeDefined();
    expect(screen.getByText('Tip 2')).toBeDefined();
  });
});

describe('ActivityItem and ActivityList molecules', () => {
  it('renders activity item with title, subtitle, and trailing', () => {
    render(
      <ActivityItem
        title="Vocabulary Quiz"
        subtitle="2 hours ago"
        trailing="15 mins"
      />
    );
    expect(screen.getByText('Vocabulary Quiz')).toBeDefined();
    expect(screen.getByText('2 hours ago')).toBeDefined();
    expect(screen.getByText('15 mins')).toBeDefined();
  });

  it('renders empty message in ActivityList when empty', () => {
    render(<ActivityList items={[]} emptyMessage="No recent activities" />);
    expect(screen.getByText('No recent activities')).toBeDefined();
  });

  it('renders activity items in ActivityList', () => {
    render(
      <ActivityList
        items={[
          { id: 'act-1', title: 'Grammar Drill', subtitle: 'Yesterday' },
          { id: 'act-2', title: 'Reading Test', subtitle: '3 days ago' },
        ]}
      />
    );
    expect(screen.getByText('Grammar Drill')).toBeDefined();
    expect(screen.getByText('Reading Test')).toBeDefined();
  });
});
