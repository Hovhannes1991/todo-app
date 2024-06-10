<template>
  <div class="login-register-page">
    <div class="form-container">
      <SectionSwitcher
          :sections="sections"
          :selected_section="selected_section"
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
              :tab-index="input.tab_index"
              :key="input.name"/>
        </div>

        <BaseButton :label="submitButtonLabel" type="submit" :loading="loading"/>
      </form>
    </div>
  </div>
</template>

<script>
import {mapMutations} from "vuex";
import useVuelidate from "@vuelidate/core";
import {required, email, minLength, sameAs, helpers} from "@vuelidate/validators";
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
      selected_section: "login",

      show_password: false,

      user: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirm_password: ""
      },

      backend_errors: {}
    }
  },

  created() {
    this.setInitialSection();
  },

  //vuelidate
  validations() {
    const rules = {
      user: {
        email: {required, email},
        password: {required, minLength: minLength(8)}
      },
    }

    if (!this.isLoginSection) {
      rules.user.firstname = {required}
      rules.user.lastname = {required}
      rules.user.confirm_password = {required, sameAs: sameAs(this.user.password)}
    }

    for (let key in rules.user) {
      const message = () => this.backend_errors[key];
      const backend = helpers.withMessage(message, () => !this.backend_errors[key]);
      rules.user[key] = {...rules.user[key], backend}
    }
    return rules;
  },

  setup() {
    return {v$: useVuelidate()}
  },

  computed: {
    isLoginSection() {
      return this.selected_section === "login";
    },

    formInputs() {
      const password_icon = this.show_password ? "eye" : "eye-slash";
      const password_type = this.show_password ? "text" : "password";

      const items = [
        {
          placeholder: "First name",
          name: "firstname",
          type: "text",
          login_item: false,
          tab_index: !this.isLoginSection ? "0" : "-1"
        },
        {
          placeholder: "Last name",
          name: "lastname",
          type: "text",
          login_item: false,
          tab_index: !this.isLoginSection ? "0" : "-1"
        },
        {placeholder: "E-mail", name: "email", type: "email", login_item: true, tab_index: "0"},
        {
          placeholder: "Password",
          name: "password",
          type: password_type,
          login_item: true,
          icon: password_icon,
          onIconClick: this.showHidePassword,
          tab_index: "0"
        },
        {
          placeholder: "Confirm Password",
          name: "confirm_password",
          type: password_type,
          login_item: false,
          tab_index: !this.isLoginSection ? "0" : "-1"
        }
      ]

      return items;
    },

    submitButtonLabel() {
      return this.isLoginSection ? "Log in" : "Sign up";
    },

    errorMessages() {
      const error_messages = {}
      for (let key in this.user) {
        error_messages[key] = this.v$.user[key]?.$errors?.[0]?.$message;
      }
      return error_messages;
    }
  },

  methods: {
    ...mapMutations({
      updateUser: "auth/UPDATE_USER",
      setEmailVerificationTokenIsSent: "helpers/SET_EMAIL_VERIFICATION_IS_SENT"
    }),

    setInitialSection() {
      const section = setGetAuthPageSection() || "login";
      if (section !== "login") this.selected_section = section;
    },

    changeSection(section) {
      this.selected_section = section;
      this.backend_errors = {}
      setGetAuthPageSection(section);
    },

    onSubmit() {
      this.v$.$touch();
      if (this.v$.$error) return;

      if (this.isLoginSection) this.login();
      else this.register();
    },

    showHidePassword() {
      this.show_password = !this.show_password;
    },

    handleIconClick(fn) {
      if (fn) fn();
    },

    removeBackendError(name) {
      this.backend_errors[name] = null;
      if (name === "password") this.backend_errors.email = null;
    },

    handleBackendErrors(err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const obj = {}
        errors.forEach(({path, msg}) => obj[path] = msg);
        this.backend_errors = obj;
      }
    },

    onAuthSuccess(data) {
      this.updateUser({user: data.user});
      saveTokens(data);
      const redirect_route_name = data.user.email_is_verified ? "home" : "email-verify";
      this.$router.push({name: redirect_route_name});
    },

    async login() {
      try {
        this.loading = true;
        const {data} = await login(this.user);
        setGetPageFlushMessage(`Welcome ${data.user.firstname.toUpperCase()}`);
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

<style lang="scss" scoped>
$primary: #1ab188;

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
    box-shadow: 0 0 20px 5px $primary;

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