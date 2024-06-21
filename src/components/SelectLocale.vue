<script>
import Dropdown from "primevue/dropdown";
import {getSelectedLocale, setSelectedLocale} from "@/helpers/storage.js";
import {setI18nLanguage, DEFAULT_LOCALE} from "@/i18n/index.js";

export default {
  name: "SelectLocale",
  components: {Dropdown},

  created() {
    const locale_code = getSelectedLocale() || "en";
    const locale = this.locales.find(item => item.code === locale_code);
    if (locale) {
      this.selected_locale = locale;
      this.selected_locale_code = locale_code;
      if (locale_code !== DEFAULT_LOCALE) setI18nLanguage(locale_code);
    }
  },

  data() {
    return {
      selected_locale: "",
      selected_locale_code: "",
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
      const locale_code = e?.value?.code;
      if (!locale_code || this.selected_locale_code === locale_code) return;

      this.selected_locale_code = locale_code;
      setI18nLanguage(locale_code);
      setSelectedLocale(locale_code);
    }
  }
}
</script>

<template>
  <Dropdown v-model="selected_locale"
            :options="locales"
            @change="onLocaleChange"
            optionLabel="name"
            placeholder=""
            class="w-auto h-3rem bg-transparent border-none outline-none appearance-none">
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex align-items-center">
        <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
             :class="`mr-2 flag flag-${this.flags[slotProps.value.code]}`" style="width: 30px"/>
      </div>
      <span v-else>
            {{ slotProps.placeholder }}
        </span>
    </template>
    <template #option="slotProps">
      <div class="flex align-items-center mr-5">
        <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
             :class="`mr-2 flag flag-${this.flags[slotProps.option.code]}`" style="width: 18px"/>
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
  </Dropdown>
</template>

<style scoped lang="scss">

</style>