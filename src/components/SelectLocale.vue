<script>
import Dropdown from "primevue/dropdown";
import {getSelectedLocale, setSelectedLocale} from "@/helpers/storage.js";
import {setI18nLanguage, DEFAULT_LOCALE} from "@/i18n/index.js";

export default {
  name: "SelectLocale",
  components: {Dropdown},

  created() {
    const localeCode = getSelectedLocale() || "en";
    const locale = this.locales.find(item => item.code === localeCode);
    if (locale) {
      this.selectedLocale = locale;
      this.selectedLocaleCode = localeCode;
      if (localeCode !== DEFAULT_LOCALE) setI18nLanguage(localeCode);
    }
  },

  data() {
    return {
      selectedLocale: "",
      selectedLocaleCode: "",
      locales: [
        {
          name: "English",
          code: "en"
        },
        {
          name: "Русский",
          code: "ru"
        },
        {
          name: "Հայերեն",
          code: "hy"
        }
      ],

      flags: {
        en: "uk",
        ru: "ru",
        hy: "am"
      }
    }
  },

  methods: {
    onLocaleChange(e) {
      const localeCode = e?.value?.code;
      if (!localeCode || this.selectedLocaleCode === localeCode) return;

      this.selectedLocaleCode = localeCode;
      setI18nLanguage(localeCode);
      setSelectedLocale(localeCode);
    }
  }
}
</script>

<template>
  <Dropdown v-model="selectedLocale"
            :options="locales"
            @change="onLocaleChange"
            optionLabel="name"
            placeholder=""
            class="w-auto h-3rem bg-transparent border-none outline-none appearance-none">
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex align-items-center">
        <div :class="`country-flag flag-${this.flags[slotProps.value.code]}`"/>
      </div>
      <span v-else>
            {{ slotProps.placeholder }}
        </span>
    </template>
    <template #option="slotProps">
      <div class="dropdown-country-flag__wrapper">
        <div :class="`dropdown-country-flag flag-${this.flags[slotProps.option.code]}`"/>
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
  </Dropdown>
</template>

<style scoped lang="scss">
.country-flag,
.dropdown-country-flag__wrapper .dropdown-country-flag {
  width: 30px;
  height: 20px;
  background-image: url("/images/flags_responsive.png");
  background-size: 100%;
  vertical-align: middle;
  margin-right: 0.5rem;
}

.dropdown-country-flag__wrapper {
  display: flex;
  align-items: center;
  margin-right: 2rem;

  .dropdown-country-flag {
    width: 18px;
    height: 12px;
  }
}
</style>