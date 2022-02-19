import * as Localization from "expo-localization";
import i18n from "i18n-js";

const en = require("./en");
const pt = require("./pt");
const es = require("./es");

i18n.fallbacks = true;
i18n.translations = { en, pt, es };

i18n.locale = Localization.locale || "en";
