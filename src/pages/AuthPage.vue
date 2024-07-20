<script>
import {mapMutations} from "vuex";
import useVuelidate from "@vuelidate/core";
import {required, email, sameAs, helpers} from "@vuelidate/validators";
import BaseButton from "@/ui/BaseButton.vue";
import BaseInput from "@/ui/BaseInput.vue";
import SectionSwitcher from "@/components/SectionSwitcher.vue";
import {register, login} from "@/api/auth.service.js";
import {saveTokens, setGetAuthPageSection, setGetPageFlushMessage} from "@/helpers/storage.js";

export default {
  name: "AuthPage",
  components: {SectionSwitcher, BaseInput, BaseButton},

  data() {
    return {
      loading: false,
      sections: ["login", "registration"],
      selectedSection: "login",

      showPassword: false,

      user: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: ""
      },

      backendErrors: {}
    }
  },

  created() {
    this.setInitialSection();
  },

  //vuelidate
  validations() {
    const rules = {
      user: {
        email: {
          required: helpers.withMessage(() => this.$t("error__field_is_required"), required),
          email: helpers.withMessage(() => this.$t("error__invalid_email_format"), email)
        },
        password: {
          required: helpers.withMessage(() => this.$t("error__field_is_required"), required)
        },
      },
    }

    if (!this.isLoginSection) {
      rules.user.firstname = {
        required: helpers.withMessage(() => this.$t("error__field_is_required"), required)
      }
      rules.user.lastname = {
        required: helpers.withMessage(() => this.$t("error__field_is_required"), required)
      }
      rules.user.confirmPassword = {
        required: helpers.withMessage(() => this.$t("error__field_is_required"), required),
        sameAs: helpers.withMessage(() => this.$t("error__passwords_same_as"), sameAs(this.user.password))
      }
    }

    for (let key in rules.user) {
      const message = () => this.backendErrors[key];
      const backend = helpers.withMessage(message, () => !this.backendErrors[key]);
      rules.user[key] = {...rules.user[key], backend}
    }
    return rules;
  },

  setup() {
    return {v$: useVuelidate()}
  },

  computed: {
    isLoginSection() {
      return this.selectedSection === "login";
    },

    formInputs() {
      const passwordIcon = this.showPassword ? "eye" : "eye-slash";
      const passwordType = this.showPassword ? "text" : "password";

      return [
        {
          placeholder: this.$t("first_name"),
          name: "firstname",
          type: "text",
          login_item: false,
          tabIndex: !this.isLoginSection ? "0" : "-1"
        },
        {
          placeholder: this.$t("last_name"),
          name: "lastname",
          type: "text",
          login_item: false,
          tabIndex: !this.isLoginSection ? "0" : "-1"
        },
        {
          placeholder: this.$t("email"),
          name: "email",
          type: "email",
          login_item: true,
          tabIndex: "0"},
        {
          placeholder: this.$t("password"),
          name: "password",
          type: passwordType,
          login_item: true,
          icon: passwordIcon,
          onIconClick: this.showHidePassword,
          tabIndex: "0"
        },
        {
          placeholder: this.$t("confirm_password"),
          name: "confirmPassword",
          type: passwordType,
          login_item: false,
          tabIndex: !this.isLoginSection ? "0" : "-1"
        }
      ]
    },

    submitButtonLabel() {
      return this.isLoginSection ? this.$t("login") : this.$t("sign_up");
    },

    errorMessages() {
      const errorMessages = {}
      for (let key in this.user) {
        errorMessages[key] = this.v$.user[key]?.$errors?.[0]?.$message;
      }
      return errorMessages;
    }
  },

  methods: {
    ...mapMutations({
      updateUser: "auth/UPDATE_USER",
      setEmailVerificationTokenIsSent: "helpers/SET_EMAIL_VERIFICATION_IS_SENT"
    }),

    setInitialSection() {
      const section = setGetAuthPageSection() || "login";
      if (section !== "login") this.selectedSection = section;
    },

    changeSection(section) {
      this.selectedSection = section;
      this.backendErrors = {}
      setGetAuthPageSection(section);
    },

    onSubmit() {
      this.v$.$touch();
      if (this.v$.$error) return;

      if (this.isLoginSection) this.login();
      else this.register();
    },

    showHidePassword() {
      this.showPassword = !this.showPassword;
    },

    handleIconClick(fn) {
      if (fn) fn();
    },

    removeBackendError(name) {
      this.backendErrors[name] = null;
      if (name === "password") this.backendErrors.email = null;
    },

    handleBackendErrors(err) {
      this.v$.$touch();
      const errors = err.response?.data?.errors;
      if (errors) {
        const obj = {}
        errors.forEach(({path, msg}) => obj[path] = msg);
        this.backendErrors = obj;
      }
    },

    onAuthSuccess(data) {
      this.updateUser({user: data.user});
      saveTokens(data);
      const redirectRouteName = data.user.emailIsVerified ? "home" : "email-verify";
      this.$router.push({name: redirectRouteName});
    },

    async login() {
      try {
        this.loading = true;
        const {data} = await login(this.user);
        setGetPageFlushMessage(`${this.$t('welcome')} ${data.user.firstname.toUpperCase()}`);
        this.onAuthSuccess(data);
      } catch (err) {
        console.log(err)
        this.handleBackendErrors(err);
      }
      this.loading = false;
    },

    async register() {
      try {
        this.loading = true;
        const {data} = await register(this.user);
        this.setEmailVerificationTokenIsSent(true);
        setGetPageFlushMessage("Congratulation, registration completed successfully!!!");
        this.onAuthSuccess(data);
      } catch (err) {
        this.handleBackendErrors(err);
      }
      this.loading = false;
    }
  }
}
</script>

<template>
  <div class="login-register-page">
    <div class="form-container">
      <SectionSwitcher
          :sections="sections"
          :selected-section="selectedSection"
          @select-section="changeSection"/>

      <form @submit.prevent="onSubmit" autocomplete="on">
        <div v-for="input in formInputs"
             :class="{'form-item': true, 'form-item-hidden': !input.login_item && isLoginSection}">
          <BaseInput
              v-model="user[input.name]"
              @input="removeBackendError(input.name)"
              @on-icon-click="handleIconClick(input.onIconClick)"
              :placeholder="input.placeholder"
              :name="input.name"
              :type="input.type"
              :icon="input.icon"
              :error="errorMessages[input.name]"
              :tab-index="input.tabIndex"
              :key="input.name"/>
        </div>

        <BaseButton :label="submitButtonLabel" variant="app-button" type="submit" :loading="loading"/>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-register-page {
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
    max-width: 500px;
    width: 80vw;
    margin: 5rem auto;
    padding: 5rem;
    background-color: #13232f;
    border-radius: 1.5rem;
    box-shadow: 0 0 20px 4px var(--main-bg-color);

    @media screen and (max-width: 756px) {
      padding: 3.5rem 2rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;

      .form-item {
        overflow: hidden;
        max-height: 100px;
        transition: max-height 0.4s ease-in-out;

        &.form-item-hidden {
          max-height: 0;
        }
      }
    }
  }
}
</style>