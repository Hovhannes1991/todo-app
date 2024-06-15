<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
import Dropdown from 'primevue/dropdown';
import useVuelidate from "@vuelidate/core";
import {required, email, sameAs} from "@vuelidate/validators";
import BaseInput from "@/ui/BaseInput.vue";
import BaseButton from "@/ui/BaseButton.vue";
import {updateProfile, changeEmail, changeEmailConfirm} from "@/api/profile.service.js";
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
        new_email: "",
        confirmation_token: "",

        password: "",
        new_password: "",
        confirm_new_password: ""
      },

      email_verify_token_sent: false,

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

    async onChangeEmail() {
      if (!this.formIsValid()) return;

      try {
        this.loading = true;
        await changeEmail(this.user_data.new_email, this.user_data.password);
        toastSuccess(`Verification token send to ${this.user_data.new_email}  email.`);
        this.email_verify_token_sent = true;
      } catch (err) {
        this.handleBackendErrors(err);
        console.log(err);
      }
      this.loading = false;
    },

    async confirmChangeEmail() {
      if (!this.formIsValid()) return;

      try {
        this.loading = true;
        const {data} = await changeEmailConfirm(this.user_data.confirmation_token);
        toastSuccess(data.message);
        this.updateUserProperty({email: data.user.email});
        this.email_verify_token_sent = false;
      } catch (err) {
        console.log(err);
        const token_error = err?.response?.data?.errors?.token;
        if (token_error) {
          this.backend_errors.confirmation_token = token_error;
        } else {
          toastError("Something went wrong");
        }
      }
      this.loading = false;
    },

    onChangePassword() {
      if (!this.formIsValid()) return;
      console.log(3)
    },
  },

  created() {
    for (let key in this.user) {
      const value = this.user[key] && typeof this.user[key] === "object" ? {...this.user[key]} : this.user[key];
      this.user_data[key] = value || "";
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

    const change_email_rules = this.email_verify_token_sent ?
        {
          user_data: {
            confirmation_token: {required},
          }
        }
        : {
          user_data: {
            new_email: {required, email},
            password: {required},
          },
        }

    const change_password_rules = {
      user_data: {
        password: {required},
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
                       name="firstname"
                       placeholder="Firstname"/>
            <BaseInput v-model="user_data.lastname"
                       :error="errorMessages.lastname"
                       @input="removeBackendError('lastname')"
                       name="lastname"
                       placeholder="Lastname"/>
            <BaseSelect :options="countries"
                        @on-change="onDropdownChange($event, 'country')"
                        :value="user_data.country"
                        :error-message="errorMessages.country"
                        option-label="country"
                        option-value="iso3"
                        name="country"
                        placeholder="Country"
                        :loading="!countries?.length"
                        :disabled="!countries?.length"/>

            <BaseSelect :options="cities"
                        @on-change="onDropdownChange($event, 'city')"
                        :value="user_data.city"
                        :error-message="errorMessages.city"
                        name="city"
                        placeholder="City"
                        :loading="!cities?.length || !this.user_data.country"
                        :disabled="!cities?.length || !this.user_data.country"/>

            <BaseInput v-model="user_data.address"
                       :error="errorMessages.address"
                       @input="removeBackendError('address')"
                       name="address"
                       placeholder="Address"/>
            <BaseInput v-model="user_data.postal_code"
                       :error="errorMessages.postal_code"
                       @input="removeBackendError('postal_code')"
                       name="postal_code"
                       placeholder="Postal code"/>


            <BaseButton label="Submit" type="submit" variant="app-button" :loading="loading" :disabled="!hasChanges"/>
          </form>
        </div>

        <div v-show="active_tab === 'change_email'" class="content">
          <form v-show="!email_verify_token_sent" @submit.prevent="onChangeEmail" autocomplete="on">
            <BaseInput v-model="user.email" label="Old E-mail" disabled/>
            <BaseInput v-model="user_data.new_email"
                       @input="removeBackendError('new_email')"
                       label="New E-mail" :error="errorMessages.new_email"
                       name="email"/>
            <BaseInput v-model="user_data.password"
                       @input="removeBackendError('password')"
                       type="password"
                       label="Current Password"
                       :error="errorMessages.password"
                       name="current_password"/>

            <BaseButton label="Change E-mail" type="submit" variant="app-button" :loading="loading"/>
          </form>

          <form v-show="email_verify_token_sent" @submit.prevent="confirmChangeEmail">
            <p class="verification-token-info">Verification token is sent to mail {{ user_data.new_email }}</p>
            <BaseInput v-model="user_data.confirmation_token"
                       @input="removeBackendError('confirmation_token')"
                       label="Token" :error="errorMessages.confirmation_token"
                       name="email"/>

            <div class="buttons-wrapper">
              <BaseButton @click="confirmChangeEmail"
                          label="Confirm"
                          variant="app-button"
                          :loading="loading"/>
              <BaseButton @click="email_verify_token_sent = false"
                          label="Cancel"
                          variant="secondary"
                          :disabled="loading"/>
            </div>
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
        color: var(--main-fg-color);
        cursor: default;
      }
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .verification-token-info {
    margin-top: 2rem;
    font-size: 2rem;
    color: white;
    text-align: center;
  }

  .buttons-wrapper {
    display: flex;
    gap: 1rem;
  }
}
</style>