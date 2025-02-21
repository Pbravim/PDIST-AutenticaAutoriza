export default {
    preset: "ts-jest/presets/default-esm", // Usa o preset ESM
    transform: {
      "^.+\\.ts?$": [
        "ts-jest",
        {
          useESM: true
        }
      ]
    },
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1"
    }
  };
  