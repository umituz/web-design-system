import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { TrendCard } from "../../presentation/organisms/charts/TrendCard";
import { BarsCard } from "../../presentation/organisms/charts/BarsCard";
import { DonutCard } from "../../presentation/organisms/charts/DonutCard";

const trend = [
  { label: "Jan", value: 10 },
  { label: "Feb", value: 24 },
  { label: "Mar", value: 18 },
];

describe("TrendCard", () => {
  it("renders nothing without data", () => {
    const { container } = render(
      <TrendCard title="T" data={[]} formatValue={(v) => String(v)} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("draws area and line paths with the given color", () => {
    const { container } = render(
      <TrendCard title="Trend" data={trend} formatValue={(v) => String(v)} color="#123456" />,
    );
    expect(container.querySelector(".udb-chartcard__title")!.textContent).toBe("Trend");
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(2);
    expect(paths[0]!.getAttribute("fill")).toBe("#123456");
    expect(paths[0]!.getAttribute("opacity")).toBe("0.08");
  });

  it("formats axis ticks with the value formatter", () => {
    const { container } = render(
      <TrendCard title="T" data={trend} formatValue={(v) => `${v} kg`} />,
    );
    const ticks = [...container.querySelectorAll(".udb-linechart__axis")].map((n) => n.textContent);
    expect(ticks).toContain("0 kg");
  });

  it("shows a tooltip row on point hover", () => {
    const { container } = render(
      <TrendCard title="T" data={trend} formatValue={(v) => String(v)} />,
    );
    const hit = container.querySelectorAll("circle[fill='transparent']");
    expect(hit.length).toBe(3);
    fireEvent.mouseMove(hit[1]!, { clientX: 200, clientY: 40 });
    const tip = container.querySelector(".udb-charttip");
    expect(tip).not.toBeNull();
    expect(tip!.textContent).toContain("Feb");
    expect(tip!.textContent).toContain("24");
  });
});

describe("BarsCard", () => {
  it("renders one bar per category with the series palette in single mode", () => {
    const { container } = render(
      <BarsCard
        title="Bars"
        data={[
          { label: "Wheat", values: [5] },
          { label: "Corn", values: [9] },
        ]}
        formatValue={(v) => String(v)}
      />,
    );
    const bars = [...container.querySelectorAll("rect")].filter(
      (r) => r.getAttribute("fill") !== "transparent",
    );
    expect(bars.length).toBe(2);
    expect(bars[0]!.getAttribute("fill")).not.toBe(bars[1]!.getAttribute("fill"));
    const legend = container.querySelectorAll(".udb-chartlegend__item");
    expect(legend.length).toBe(2);
  });

  it("renders grouped bars and a legend per series", () => {
    const { container } = render(
      <BarsCard
        title="Compare"
        series={[
          { name: "Plan", color: "#3e5f80" },
          { name: "Actual", color: "#357344" },
        ]}
        data={[{ label: "F1", values: [10, 14] }]}
        formatValue={(v) => String(v)}
      />,
    );
    const bars = [...container.querySelectorAll("rect")].filter(
      (r) => r.getAttribute("fill") !== "transparent",
    );
    expect(bars.length).toBe(2);
    expect(bars[0]!.getAttribute("fill")).toBe("#3e5f80");
    const legend = [...container.querySelectorAll(".udb-chartlegend__item")].map((n) => n.textContent);
    expect(legend).toEqual(["Plan", "Actual"]);
  });

  it("adds a delta row to the grouped tooltip for two series", () => {
    const { container } = render(
      <BarsCard
        title="C"
        series={[
          { name: "A", color: "#111111" },
          { name: "B", color: "#222222" },
        ]}
        data={[{ label: "X", values: [10, 4] }]}
        formatValue={(v) => String(v)}
      />,
    );
    const hit = container.querySelector("rect[fill='transparent']")!;
    fireEvent.mouseMove(hit, { clientX: 300, clientY: 50 });
    const rows = [...container.querySelectorAll(".udb-charttip__row")].map((n) => n.textContent);
    expect(rows).toEqual(["A10", "B4", "Δ6"]);
  });

  it("adds a share row in single-series tooltips", () => {
    const { container } = render(
      <BarsCard
        title="S"
        data={[
          { label: "A", values: [3] },
          { label: "B", values: [1] },
        ]}
        formatValue={(v) => String(v)}
      />,
    );
    const hit = container.querySelector("rect[fill='transparent']")!;
    fireEvent.mouseMove(hit, { clientX: 300, clientY: 50 });
    const rows = [...container.querySelectorAll(".udb-charttip__row")].map((n) => n.textContent);
    expect(rows).toEqual(["A3", "Σ75%"]);
  });

  it("truncates long category labels", () => {
    const { container } = render(
      <BarsCard
        title="S"
        data={[{ label: "North Field Riverside", values: [2] }]}
        formatValue={(v) => String(v)}
      />,
    );
    const labels = [...container.querySelectorAll("text.udb-linechart__axis")]
      .map((n) => n.textContent)
      .filter((t) => !/^[0-9.]+$/.test(t ?? ""));
    expect(labels).toEqual(["North Fie…"]);
  });
});

describe("DonutCard", () => {
  it("shows the formatted total in the center and drops empty segments", () => {
    const { container } = render(
      <DonutCard
        title="Mix"
        data={[
          { label: "A", value: 60 },
          { label: "B", value: 40 },
          { label: "C", value: 0 },
        ]}
        formatValue={(v) => `${v} usd`}
        centerLabel="Total"
      />,
    );
    expect(container.querySelector(".udb-chartcard__title")!.textContent).toBe("Mix");
    expect(container.querySelector(".udb-donut__value")!.textContent).toBe("100 usd");
    expect(container.querySelector(".udb-donut__label")!.textContent).toBe("Total");
    const segments = container.querySelectorAll("circle.udb-donut__seg");
    expect(segments.length).toBe(2);
  });

  it("lists each segment with its formatted value", () => {
    const { container } = render(
      <DonutCard
        title="Mix"
        data={[
          { label: "A", value: 1 },
          { label: "B", value: 3 },
        ]}
        formatValue={(v) => String(v)}
      />,
    );
    const items = [...container.querySelectorAll(".udb-donut__item")].map((n) => n.textContent);
    expect(items).toEqual(["A125%", "B375%"]);
  });
});
