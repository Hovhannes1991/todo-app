<script>
import {mapGetters} from "vuex";
import useVuelidate from "@vuelidate/core";
import {required, email} from "@vuelidate/validators";
import BaseButton from "@/ui/BaseButton.vue";
import BaseInput from "@/ui/BaseInput.vue";

export default {
  name: "ChangeEmailForm",
  components: {BaseInput, BaseButton},

  props: {
    tokenSent: {
      type: Boolean,
      default: false
    },

    backendErrors: {
      type: Object,
      required: true
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  emits: ["changeEmail", "confirmChangeEmail", "cancelChangeEmail", "removeBackendError"],

  created() {
    this.user_data.new_email = this.user.email;
  },

  data() {
    return {
      user_data: {
        new_email: "",

        password: "",

        confirmation_token: ""
      }
    }
  },

  computed: {
    ...mapGetters({user: "auth/user"}),

    errorMessages() {
      const error_messages = {}
      for (let key in this.user_data) {
        error_messages[key] = this.v$.user_data[key]?.$errors?.[0]?.$message || this.backendErrors[key];
      }
      return error_messages;
    },
  },

  methods: {
    onChangeEmail() {
      if (!this.formIsValid()) return;

      this.$emit("changeEmail", {new_email: this.user_data.new_email, password: this.user_data.password});
    },

    confirmChangeEmail() {
      if (!this.formIsValid()) return;

      this.$emit("confirmChangeEmail", this.user_data.confirmation_token);
    },

    cancelChangeEmail() {
      this.$emit("cancelChangeEmail");
    },

    removeBackendError(name) {
      this.$emit("removeBackendError", name);
    },

    formIsValid() {
      this.v$.$touch();
      return !this.v$.$error;
    },
  },

  //vuelidate
  validations() {
    if (this.tokenSent) {
      return {
        user_data: {
          confirmation_token: {required},
        }
      }
    } else {
      return {
        user_data: {
          new_email: {required, email},
          password: {required},
        },
      }
    }
  },

  setup() {
    return {v$: useVuelidate()}
  },
}
</script>

<template>
  <form v-show="!tokenSent" @submit.prevent="onChangeEmail" autocomplete="on">
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

    <BaseButton label="Change E-mail"
                :disabled="user.email === user_data.new_email"
                type="submit"
                variant="app-button"
                :loading="loading"/>
  </form>

  <form v-show="tokenSent" @submit.prevent="confirmChangeEmail">
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
      <BaseButton @click="cancelChangeEmail"
                  label="Cancel"
                  variant="secondary"
                  :disabled="loading"/>
    </div>
  </form>
</template>

<style scoped lang="scss">
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
</style>