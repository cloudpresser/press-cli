import i18n from "i18n-js";
import { TranslateableStrings } from "./translataboleType";

/**
 * Translates text.
 *
 * @param key The i18n key.
 */
export function translate(
  key: TranslateableStrings,
  options?: I18n.TranslateOptions
) {
  return key ? i18n.t(key, options) : null;
}
