<script>
import {mapActions, mapGetters} from "vuex";
import useVuelidate from "@vuelidate/core";
import {helpers, required} from "@vuelidate/validators";
import BaseButton from "@/ui/BaseButton.vue";
import BaseInput from "@/ui/BaseInput.vue";
import BaseSelect from "@/ui/BaseSelect.vue";

export default {
  name: "UpdatePersonalInfoForm",
  components: {BaseSelect, BaseInput, BaseButton},

  props: {
    backendErrors: {
      type: Object,
      required: true
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  emits: ["submitPersonalData", "removeBackendError"],

  created() {
    for (let key in this.user) {
      const value = this.user[key] && typeof this.user[key] === "object" ? {...this.user[key]} : this.user[key];
      this.userData[key] = value || "";
    }

    if (!this.countries?.length) {
      this.fetchCountries();
    }
  },

  data() {
    return {
      userData: {
        firstname: "",
        lastname: "",
        country: "",
        city: "",
        address: "",
        postalCode: "",
      }
    }
  },

  computed: {
    ...mapGetters({user: "auth/user", countries: "countries/countries"}),

    cities() {
      if (!this.countries?.length || !this.userData.country) return [];
      const country = this.countries.find(country => country.iso3 === this.userData.country);
      return country?.cities || []
    },

    errorMessages() {
      const errorMessages = {}
      for (let key in this.userData) {
        errorMessages[key] = this.v$.userData[key]?.$errors?.[0]?.$message || this.backendErrors[key];
      }
      return errorMessages;
    },

    hasChanges() {
      const props = ["firstname", "lastname", "country", "city", "address", "postalCode"];
      return props.some(prop => this.user[prop] !== this.userData[prop]);
    }
  },

  methods: {
    ...mapActions({fetchCountries: "countries/fetchCountries"}),
    onSubmitPersonalData() {
      if (!this.formIsValid()) return;

      this.$emit("submitPersonalData", this.userData);
    },

    removeBackendError(name) {
      this.$emit("removeBackendError", name);
    },

    formIsValid() {
      this.v$.$touch();
      return !this.v$.$error;
    },

    onDropdownChange(value, property) {
      this.userData[property] = value;
      this.$emit("removeBackendError", property);
    },
  },

  //vuelidate
  validations() {
    return {
      userData: {
        firstname: {
          required: helpers.withMessage(() => this.$t("error__field_is_required"), required)
        },
        lastname: {
          required: helpers.withMessage(() => this.$t("error__field_is_required"), required)
        }
      },
    }
  },

  setup() {
    return {v$: useVuelidate()}
  },
}
</script>

<template>
  <form @submit.prevent="onSubmitPersonalData" autocomplete="on">
    <BaseInput v-model="userData.firstname"
               :error="errorMessages.firstname"
               @input="removeBackendError('firstname')"
               name="firstname"
               :placeholder="$t('first_name')"/>
    <BaseInput v-model="userData.lastname"
               :error="errorMessages.lastname"
               @input="removeBackendError('lastname')"
               name="lastname"
               :placeholder="$t('last_name')"/>
    <BaseSelect :options="countries"
                @on-change="onDropdownChange($event, 'country')"
                :value="userData.country"
                :error-message="errorMessages.country"
                option-label="country"
                option-value="iso3"
                name="country"
                :placeholder="$t('country')"
                :loading="!countries?.length"
                :disabled="!countries?.length"/>

    <BaseSelect :options="cities"
                @on-change="onDropdownChange($event, 'city')"
                :value="userData.city"
                :error-message="errorMessages.city"
                name="city"
                :placeholder="$t('city')"
                :disabled="!cities?.length || !this.userData.country"/>

    <BaseInput v-model="userData.address"
               :error="errorMessages.address"
               @input="removeBackendError('address')"
               name="address"
               :placeholder="$t('address')"/>
    <BaseInput v-model="userData.postalCode"
               :error="errorMessages.postalCode"
               @input="removeBackendError('postalCode')"
               name="postalCode"
               :placeholder="$t('postal_code')"/>


    <BaseButton :label="$t('submit')" type="submit" variant="app-button" :loading="loading" :disabled="!hasChanges"/>
  </form>
</template>

<style scoped lang="scss">

</style>