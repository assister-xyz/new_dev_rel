// we set up our hard custom typography here, these typography style will be utilized by MUI theme provider in root layout.tsx, which will apply to all <typography> components in any pages

export const customTypography = {
  fontFamily: ["Inter", "Roboto Mono"].join(","),
  // MUI <typography> default variant as "body1"
  body1: {
    // fontFamily here will always take first option if available, if not, it will take the second option
    fontFamily: ["Inter", "Roboto Mono"].join(","),
    fontSize: 14,
  },
  body2: {
    fontFamily: ["Inter", "Roboto Mono"].join(","),
    fontSize: 12,
  },
  // -----------------------------------------------------------------------
  h1: {
    fontFamily: ["Inter", "Roboto Mono"].join(","),
    fontSize: 24,
    fontWeight: "bold",
  },
  h2: {
    fontFamily: ["Inter", "Roboto Mono"].join(","),
    fontSize: 22,
    fontWeight: "bold",
  },
  h3: {
    fontFamily: ["Inter", "Roboto Mono"].join(","),
    fontSize: 20,
    fontWeight: "bold",
  },
  h4: {
    fontFamily: ["Inter", "Roboto Mono"].join(","),
    fontSize: 18,
    fontWeight: "bold",
  },
  h5: {
    fontFamily: ["Inter", "Roboto Mono"].join(","),
    fontSize: 16,
    fontWeight: "bold",
  },
  h6: {
    fontFamily: ["Inter", "Roboto Mono"].join(","),
    fontSize: 14,
    fontWeight: "bold",
  },
};
