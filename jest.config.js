module.exports = {
    "verbose": true,
    "transformIgnorePatterns": [
      "<rootDir>/node_modules/(?!(react|react-dom|react-scripts|react-redux|node-sass|@mdi/js|@mdi/react|mdi/js|mdi/react))/"
    ],
    "moduleNameMapper": {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js"
    },
    "presets": ["@babel/preset-env"]
  };