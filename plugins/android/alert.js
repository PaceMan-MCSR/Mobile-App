const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

// interface AlertDialogPluginProps {
//   textColor: { light: string; dark: string };
// }

const withAlertDialogFix = (config, options) => {
  const lightTextColor = options.textColor.light;
  const darkTextColor = options.textColor.dark;

  // Step 1: Create values/colors.xml (light mode) and values-night/colors.xml (dark mode)
  let modifiedConfig = withDangerousMod(config, [
    "android",
    async (config) => {
      const androidDir = path.join(config.modRequest.platformProjectRoot, "app", "src", "main");
      const resDir = path.join(androidDir, "res");
      const valuesDir = path.join(resDir, "values");
      const valuesNightDir = path.join(resDir, "values-night");

      if (!fs.existsSync(valuesDir)) {
        fs.mkdirSync(valuesDir, { recursive: true });
      }

      if (!fs.existsSync(valuesNightDir)) {
        fs.mkdirSync(valuesNightDir, { recursive: true });
      }

      const lightColorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="textColor">${lightTextColor}</color>
    <color name="colorPrimary">${lightTextColor}</color>
</resources>`;

      const darkColorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="textColor">${darkTextColor}</color>
    <color name="colorPrimary">${darkTextColor}</color>
</resources>`;

      fs.writeFileSync(path.join(valuesDir, "colors.xml"), lightColorsXml);
      fs.writeFileSync(path.join(valuesNightDir, "colors.xml"), darkColorsXml);

      return config;
    },
  ]);

  // Step 2: Update styles.xml to reference the color resources
  modifiedConfig = withDangerousMod(modifiedConfig, [
    "android",
    async (config) => {
      const androidDir = path.join(config.modRequest.platformProjectRoot, "app", "src", "main");
      const resDir = path.join(androidDir, "res");
      const valuesDir = path.join(resDir, "values");
      const stylesPath = path.join(valuesDir, "styles.xml");

      if (fs.existsSync(stylesPath)) {
        let stylesContent = fs.readFileSync(stylesPath, "utf-8");

        // Check if android:textColor is already in AppTheme
        if (!stylesContent.includes('name="android:textColor"')) {
          // Add android:textColor to AppTheme style
          stylesContent = stylesContent.replace(
            /(<style name="AppTheme"[^>]*>)/,
            '$1\n        <item name="android:textColor">@color/textColor</item>\n        <item name="colorPrimary">@color/colorPrimary</item>'
          );
          fs.writeFileSync(stylesPath, stylesContent);
        }
      }

      return config;
    },
  ]);

  return modifiedConfig;
};

module.exports = withAlertDialogFix;
