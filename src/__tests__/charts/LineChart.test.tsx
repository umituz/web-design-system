import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { LineChart } from "../../presentation/organisms/charts/LineChart";

const labels = ["1", "2", "3", "4"];

describe("LineChart", () => {
  it("renders nothing without points", () => {
    const { container } = render(<LineChart labels={[]} series={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a flat area by default", () => {
    const { container } = render(
      <LineChart labels={labels} series={[{ label: "A", values: [1, 2, 3, 4] }]} />,
    );
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(2);
    expect(paths[0]!.getAttribute("opacity")).toBe("0.07");
    expect(container.querySelector("linearGradient")).toBeNull();
  });

  it("paints the area with a per-series gradient when requested", () => {
    const { container } = render(
      <LineChart
        labels={labels}
        series={[{ label: "A", values: [1, 2, 3, 4], areaFill: "gradient" }]}
      />,
    );
    const gradient = container.querySelector("linearGradient");
    expect(gradient).not.toBeNull();
    expect(gradient!.querySelectorAll("stop")).toHaveLength(2);
    const areaPath = [...container.querySelectorAll("path")].find((p) =>
      p.getAttribute("fill")?.startsWith("url(#"),
    );
    expect(areaPath).toBeDefined();
    expect(areaPath!.getAttribute("opacity")).toBeNull();
  });

  it("drops the area for dashed series", () => {
    const { container } = render(
      <LineChart labels={labels} series={[{ label: "A", values: [1, 2, 3, 4], dashed: true }]} />,
    );
    expect(container.querySelectorAll("path")).toHaveLength(1);
    expect(container.querySelector("linearGradient")).toBeNull();
  });

  it("renders the band and a crosshair with tooltip on hover", () => {
    const { container } = render(
      <LineChart
        labels={labels}
        band={{ from: 1, to: 2 }}
        series={[{ label: "A", values: [1, 2, 3, 4] }]}
      />,
    );
    expect(container.querySelector(".udb-linechart__band")).not.toBeNull();

    const svg = container.querySelector("svg")!;
    fireEvent.mouseMove(svg, { clientX: 700, clientY: 50 });
    expect(container.querySelector(".udb-linechart__crosshair")).not.toBeNull();
    const tip = container.querySelector(".udb-linechart__tip");
    expect(tip).not.toBeNull();
    expect(tip!.textContent).toContain("A");
  });

  it("renders xSpans as labeled washes over the plot", () => {
    const { container } = render(
      <LineChart
        labels={labels}
        xSpans={[
          { from: 0, to: 1, label: "Hook" },
          { from: 1, to: 3, tone: "#8b7cff" },
        ]}
        series={[{ label: "A", values: [1, 2, 3, 4] }]}
      />,
    );
    const spans = container.querySelectorAll(".udb-linechart__xspan");
    expect(spans).toHaveLength(2);
    expect(spans[0]!.textContent).toContain("Hook");
    expect((spans[1] as HTMLElement).style.fill).toBe("#8b7cff");
    expect((spans[0] as HTMLElement).getAttribute("width")).not.toBe("0");
  });

  it("renders the built-in legend from the series", () => {
    const { container } = render(
      <LineChart
        labels={labels}
        series={[
          { label: "A", values: [1, 2, 3, 4] },
          { label: "B", values: [4, 3, 2, 1], axis: "right" },
        ]}
      />,
    );
    const items = container.querySelectorAll(".udb-chartlegend__item");
    expect(items).toHaveLength(2);
    expect(items[0]!.textContent).toContain("A");
    expect(items[1]!.textContent).toContain("B");
  });
});
