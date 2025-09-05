module.exports = function (api) {
  api.cache(true); // Cache the configuration for performance

  return {
    presets: [
      [
        "babel-preset-expo",
        {
          tsxImportSource: "nativewind", // Support NativeWind for TSX/JSX
          lazyImports: true, // Optimize imports for better tree-shaking
        },
      ],
      "nativewind/babel", // NativeWind preset for Tailwind CSS
    ],
    plugins: [
      // Optional: Add plugins for specific needs
      ["@babel/plugin-transform-runtime", { regenerator: true }], // Optimize async/await and generators
      ["module-resolver", { // Simplify import paths (optional)
        root: ["./"],
        alias: {
          "@components": "./src/components",
          "@utils": "./src/utils",
        },
      }],
    ],
    env: {
      production: {
        plugins: [
          "transform-remove-console", // Remove console.logs in production
        ],
      },
    },
  };
};