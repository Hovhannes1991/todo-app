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
      this.user_data[key] = value || "";
    }

    if (!this.countries?.length) {
      this.fetchCountries();
    }
  },

  data() {
    return {
      user_data: {
        firstname: "",
        lastname: "",
        country: "",
        city: "",
        address: "",
        postal_code: "",
      }
    }
  },

  computed: {
    ...mapGetters({user: "auth/user", countries: "countries/countries"}),

    cities() {
      if (!this.countries?.length || !this.user_data.country) return [];
      const country = this.countries.find(country => country.iso3 === this.user_data.country);
      return country?.cities || []
    },

    errorMessages() {
      const error_messages = {}
      for (let key in this.user_data) {
        error_messages[key] = this.v$.user_data[key]?.$errors?.[0]?.$message || this.backendErrors[key];
      }
      return error_messages;
    },

    hasChanges() {
      const props = ["firstname", "lastname", "country", "city", "address", "postal_code"];
      return props.some(prop => this.user[prop] !== this.user_data[prop]);
    }
  },

  methods: {
    ...mapActions({fetchCountries: "countries/fetchCountries"}),
    onSubmitPersonalData() {
      if (!this.formIsValid()) return;

      this.$emit("submitPersonalData", this.user_data);
    },

    removeBackendError(name) {
      this.$emit("removeBackendError", name);
    },

    formIsValid() {
      this.v$.$touch();
      return !this.v$.$error;
    },

    onDropdownChange(value, property_name) {
      this.user_data[property_name] = value;
      this.$emit("removeBackendError", property_name);
    },
  },

  //vuelidate
  validations() {
    return {
      user_data: {
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
    <BaseInput v-model="user_data.firstname"
               :error="errorMessages.firstname"
               @input="removeBackendError('firstname')"
               name="firstname"
               :placeholder="$t('first_name')"/>
    <BaseInput v-model="user_data.lastname"
               :error="errorMessages.lastname"
               @input="removeBackendError('lastname')"
               name="lastname"
               :placeholder="$t('last_name')"/>
    <BaseSelect :options="countries"
                @on-change="onDropdownChange($event, 'country')"
                :value="user_data.country"
                :error-message="errorMessages.country"
                option-label="country"
                option-value="iso3"
                name="country"
                :placeholder="$t('country')"
                :loading="!countries?.length"
                :disabled="!countries?.length"/>

    <BaseSelect :options="cities"
                @on-change="onDropdownChange($event, 'city')"
                :value="user_data.city"
                :error-message="errorMessages.city"
                name="city"
                :placeholder="$t('city')"
                :disabled="!cities?.length || !this.user_data.country"/>

    <BaseInput v-model="user_data.address"
               :error="errorMessages.address"
               @input="removeBackendError('address')"
               name="address"
               :placeholder="$t('address')"/>
    <BaseInput v-model="user_data.postal_code"
               :error="errorMessages.postal_code"
               @input="removeBackendError('postal_code')"
               name="postal_code"
               :placeholder="$t('postal_code')"/>


    <BaseButton :label="$t('submit')" type="submit" variant="app-button" :loading="loading" :disabled="!hasChanges"/>
  </form>
</template>

<style scoped lang="scss">

</style>