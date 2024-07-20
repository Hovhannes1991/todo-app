<script>
import {mapGetters} from "vuex";
import useVuelidate from "@vuelidate/core";
import {required, email, helpers} from "@vuelidate/validators";
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
    this.userData.newEmail = this.user.email;
  },

  data() {
    return {
      userData: {
        newEmail: "",

        password: "",

        confirmationToken: ""
      }
    }
  },

  computed: {
    ...mapGetters({user: "auth/user"}),

    errorMessages() {
      const errorMessages = {}
      for (let key in this.userData) {
        errorMessages[key] = this.v$.userData[key]?.$errors?.[0]?.$message || this.backendErrors[key];
      }
      return errorMessages;
    },
  },

  methods: {
    onChangeEmail() {
      if (!this.formIsValid()) return;

      this.$emit("changeEmail", {newEmail: this.userData.newEmail, password: this.userData.password});
    },

    confirmChangeEmail() {
      if (!this.formIsValid()) return;

      this.$emit("confirmChangeEmail", this.userData.confirmationToken);
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
        userData: {
          confirmationToken: {
            required: helpers.withMessage(() => this.$t("error__field_is_required"), required)
          },
        }
      }
    } else {
      return {
        userData: {
          newEmail: {
            required: helpers.withMessage(() => this.$t("error__field_is_required"), required),
            email: helpers.withMessage(() => this.$t("error__invalid_email_format"), email)
          },
          password: {
            required: helpers.withMessage(() => this.$t("error__field_is_required"), required)
          },
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
    <BaseInput v-model="user.email" :label="$t('old_email')" disabled/>

    <BaseInput v-model="userData.newEmail"
               @input="removeBackendError('newEmail')"
               :label="$t('new_email')"
               :error="errorMessages.newEmail"
               name="email"/>
    <BaseInput v-model="userData.password"
               @input="removeBackendError('password')"
               type="password"
               :label="$t('current_password')"
               :error="errorMessages.password"
               name="current_password"/>

    <BaseButton :label="$t('change_email')"
                :disabled="user.email === userData.newEmail"
                type="submit"
                variant="app-button"
                :loading="loading"/>
  </form>

  <form v-show="tokenSent" @submit.prevent="confirmChangeEmail">
    <p class="verification-token-info">Verification token is sent to mail {{ userData.newEmail }}</p>
    <BaseInput v-model="userData.confirmationToken"
               @input="removeBackendError('confirmationToken')"
               :label="$t('token')"
               :error="errorMessages.confirmationToken"
               name="email"/>

    <div class="buttons-wrapper">
      <BaseButton @click="confirmChangeEmail"
                  :label="$t('confirm')"
                  variant="app-button"
                  :loading="loading"/>
      <BaseButton @click="cancelChangeEmail"
                  :label="$t('cancel')"
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