<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
import Dropdown from 'primevue/dropdown';
import useVuelidate from "@vuelidate/core";
import {required, email, sameAs} from "@vuelidate/validators";
import BaseInput from "@/ui/BaseInput.vue";
import BaseButton from "@/ui/BaseButton.vue";
import {updateProfile} from "@/api/profile.service.js";
import {toastError, toastSuccess} from "@/services/toast.service.js";
import BaseSelect from "@/ui/BaseSelect.vue";

export default {
  name: "ProfilePage",
  components: {BaseSelect, Dropdown, BaseButton, BaseInput},

  data() {
    return {
      tabs: [
        {name: "personal_information", label: "Personal Information"},
        {name: "change_email", label: "Change E-mail"},
        {name: "change_password", label: "Change Password"}
      ],
      active_tab: "personal_information",

      user_data: {
        firstname: "",
        lastname: "",
        country: "",
        city: "",
        address: "",
        postal_code: "",

        email: "",

        old_password: "",
        new_password: "",
        confirm_new_password: ""
      },

      loading: false,

      backend_errors: {}
    }
  },

  computed: {
    ...mapGetters({user: "auth/user", countries: "countries/countries"}),

    errorMessages() {
      const error_messages = {}
      for (let key in this.user_data) {
        error_messages[key] = this.v$.user_data[key]?.$errors?.[0]?.$message || this.backend_errors[key];
      }
      return error_messages;
    },

    cities() {
      if (!this.countries?.length || !this.user_data.country) return [];
      const country = this.countries.find(country => country.iso3 === this.user_data.country);
      return country?.cities || []
    },

    hasChanges() {
      if (this.active_tab === "personal_information") {
        const props = ["firstname", "lastname", "country", "city", "address", "postal_code"];
        return props.some(prop => this.user[prop] !== this.user_data[prop]);
      }
      return true; //todo
    }
  },

  methods: {
    ...mapMutations({updateUserProperty: "auth/UPDATE_USER_PROPERTY"}),
    ...mapActions({fetchCountries: "countries/fetchCountries"}),

    changeTab(name) {
      if (this.active_tab === name) return;
      this.backend_errors = {};
      this.active_tab = name;
    },

    onDropdownChange(value, property_name) {
      this.user_data[property_name] = value;
      this.backend_errors[property_name] = null;
    },

    removeBackendError(name) {
      this.backend_errors[name] = null;
    },

    handleBackendErrors(err) {
      const backend_errors = err?.response?.data?.errors;
      if (!backend_errors) {
        toastError("Something went wrong");
        return;
      }
      backend_errors.forEach(({msg, path}) => {
        this.backend_errors[path] = msg;
      })
    },

    formIsValid() {
      this.v$.$touch();
      return !this.v$.$error;
    },

    async onSubmitPersonalData() {
      if (!this.formIsValid()) return;

      const updating_data = {
        firstname: this.user_data.firstname,
        lastname: this.user_data.lastname,
        country: this.user_data.country,
        city: this.user_data.city,
        postal_code: this.user_data.postal_code,
        address: this.user_data.address,
      }
      try {
        this.loading = true;
        const {data} = await updateProfile(updating_data);
        this.updateUserProperty(updating_data);
        toastSuccess(data?.message);
      } catch (err) {
        this.handleBackendErrors(err);
        console.log(err);
      }
      this.loading = false;
    },

    onChangeEmail() {
      if (!this.formIsValid()) return;
      console.log(2)
    },

    onChangePassword() {
      if (!this.formIsValid()) return;
      console.log(3)
    },
  },

  created() {
    for (let key in this.user) {
      this.user_data[key] = typeof this.user[key] === "object" ? {...this.user[key]} : this.user[key];
    }

    if (!this.countries?.length) {
      this.fetchCountries();
    }
  },

  //vuelidate
  validations() {
    const personal_info_rules = {
      user_data: {
        firstname: {required},
        lastname: {required}
      },
    }

    const change_email_rules = {
      user_data: {
        email: {required, email}
      },
    }

    const change_password_rules = {
      user_data: {
        old_password: {required},
        new_password: {required},
        confirm_new_password: {required, sameAs: sameAs(this.user_data.new_password)}
      }
    }

    const rules = {
      personal_information: personal_info_rules,
      change_email: change_email_rules,
      change_password: change_password_rules
    }

    return rules[this.active_tab];
  },

  setup() {
    return {v$: useVuelidate()}
  },
}
</script>

<template>
  <div class="profile-page">
    <div class="profile-page-content">
      <div class="tabs">
        <div v-for="tab in tabs"
             @click="changeTab(tab.name)"
             :class="{tab: true, 'active-tab': tab.name === active_tab}"
             :key="tab">{{ tab.label }}
        </div>
      </div>

      <template v-if="user">
        <div v-show="active_tab === 'personal_information'" class="content">
          <form @submit.prevent="onSubmitPersonalData" autocomplete="on">
            <BaseInput v-model="user_data.firstname"
                       :error="errorMessages.firstname"
                       @input="removeBackendError('firstname')"
                       placeholder="Firstname"/>
            <BaseInput v-model="user_data.lastname"
                       :error="errorMessages.lastname"
                       @input="removeBackendError('lastname')"
                       placeholder="Lastname"/>
            <BaseSelect :options="countries"
                        @on-change="onDropdownChange($event, 'country')"
                        :value="user_data.country"
                        :error-message="errorMessages.country"
                        option-label="country"
                        option-value="iso3"
                        placeholder="Country"
                        :disabled="!countries?.length"/>

            <BaseSelect :options="cities"
                        @on-change="onDropdownChange($event, 'city')"
                        :value="user_data.city"
                        :error-message="errorMessages.city"
                        placeholder="City"
                        :disabled="!cities?.length || !this.user_data.country"/>

            <BaseInput v-model="user_data.address"
                       :error="errorMessages.address"
                       @input="removeBackendError('address')"
                       placeholder="Address"/>
            <BaseInput v-model="user_data.postal_code"
                       :error="errorMessages.postal_code"
                       @input="removeBackendError('postal_code')"
                       placeholder="Postal code"/>


            <BaseButton label="Submit" type="submit" variant="app-button" :loading="loading" :disabled="!hasChanges"/>
          </form>
        </div>

        <div v-show="active_tab === 'change_email'" class="content">
          <form @submit.prevent="onChangeEmail" autocomplete="on">
            <BaseInput v-model="user.email" disabled/>
            <BaseInput v-model="user_data.email" :error="errorMessages.email"/>

            <BaseButton label="Change E-mail" type="submit" variant="app-button" :loading="loading"/>
          </form>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-page {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background: white;

  .profile-page-content {
    width: 80vw;
    max-width: 70rem;
    margin: 0 auto;
    padding: 2rem;
  }

  .tabs {
    display: flex;
    //justify-content: center;
    margin-bottom: 1rem;
    background-color: #cecece;
    border-radius: 5px 5px 0 0;
    overflow: hidden;

    @media screen and (max-width: 470px) {
      flex-direction: column;
    }

    .tab {
      display: flex;
      flex-grow: 1;
      align-items: center;
      justify-content: center;
      height: 5rem;
      font-size: 1.5rem;
      padding: 1.5rem 3rem;
      cursor: pointer;
      text-align: center;

      &.active-tab {
        background: var(--main-bg-color);
        color: var( --main-fg-color);
        cursor: default;
      }
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>