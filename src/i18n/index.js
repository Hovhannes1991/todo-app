import {nextTick} from 'vue'
import {createI18n} from 'vue-i18n'

import en from "./locales/en.json";

export const SUPPORT_LOCALES = ["en", "ru", "hy"];

export const DEFAULT_LOCALE = "en";
const FALLBACK_LOCALE = "en";

export const i18n = createI18n({
    locale: DEFAULT_LOCALE,
    fallbackLocale: FALLBACK_LOCALE,
    legacy: true,
    messages: {en}
})

export async function setI18nLanguage(locale) {
    if (!SUPPORT_LOCALES.includes(locale)) return;

    await loadLocaleMessages(locale);

    if (i18n.mode === 'legacy') {
        i18n.global.locale = locale
    } else {
        i18n.global.locale.value = locale
    }
    document.querySelector('html').setAttribute('lang', locale)
}

async function loadLocaleMessages(locale) {
    // load locale messages with dynamic import
    const messages = await import(`./locales/${locale}.json`);

    // set locale and locale message
    i18n.global.setLocaleMessage(locale, messages.default)

    return nextTick()
}

if (DEFAULT_LOCALE !== "en") {
    await setI18nLanguage(DEFAULT_LOCALE);
}