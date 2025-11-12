import { normalizePriority } from "../src/routes/requestTypes.js";

describe("normalizePriority", () => {
  test("mappe correctement les priorités connues", () => {
    expect(normalizePriority("LOW")).toBe("low");
    expect(normalizePriority("medium")).toBe("medium");
    expect(normalizePriority("High")).toBe("high");
    expect(normalizePriority("critical")).toBe("critical");
  });

  test("retourne 'medium' par défaut pour valeurs inconnues", () => {
    expect(normalizePriority("urgent")).toBe("medium");
    expect(normalizePriority("")).toBe("medium");
    expect(normalizePriority(null)).toBe("medium");
    expect(normalizePriority(undefined)).toBe("medium");
  });
});
