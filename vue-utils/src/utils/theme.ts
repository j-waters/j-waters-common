import chroma, { Color } from "chroma-js";

function getCol(name: string) {
    const body = getComputedStyle(document.body);
    const value = body.getPropertyValue(`--${name}`);
    return chroma(`hsl(${value.trim().replace(/ /g, ", ")})`);
}

const THEME_MAP = {
    primary: "p",
    primaryFocus: "pf",
    primaryContent: "pc",
    secondary: "s",
    secondaryFocus: "sf",
    secondaryContent: "sc",
    success: "su",
    error: "er",
    info: "in",
};

type ThemeRGB = { [K in `${keyof typeof THEME_MAP}`]: string }
type ThemeColour = {
    [K in `${keyof typeof THEME_MAP}Col`]: Color;
}
type Theme = ThemeRGB & ThemeColour;

export function useTheme(): Theme {
    const out: Partial<Theme> = {};
    let name: keyof typeof THEME_MAP;
    for (name in THEME_MAP) {
        const colour = getCol(THEME_MAP[name]);
        out[name] = colour.css();
        out[`${name}Col` as keyof ThemeColour] = colour;
    }
    return out as Theme;
}
