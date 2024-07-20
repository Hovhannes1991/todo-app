<script>
import useVuelidate from "@vuelidate/core";
import {helpers, minLength, required, sameAs} from "@vuelidate/validators";
import BaseButton from "@/ui/BaseButton.vue";
import BaseInput from "@/ui/BaseInput.vue";
import BaseSelect from "@/ui/BaseSelect.vue";

export default {
  name: "ChangePasswordForm",
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

  emits: ["changePassword", "removeBackendError"],

  data() {
    return {
      userData: {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      }
    }
  },

  computed: {
    errorMessages() {
      const errorMessages = {}
      for (let key in this.userData) {
        errorMessages[key] = this.v$.userData[key]?.$errors?.[0]?.$message || this.backendErrors[key];
      }
      return errorMessages;
    },
  },

  methods: {
    changePassword() {
      if (!this.formIsValid()) return;
      const {oldPassword, newPassword} = this.userData
      this.$emit("changePassword", oldPassword, newPassword);
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
    return {
      userData: {
        oldPassword: {
          required: helpers.withMessage(() => this.$t("error__field_is_required"), required)
        },
        newPassword: {
          required: helpers.withMessage(() => this.$t("error__field_is_required"), required),
          minLength: helpers.withMessage(({$params}) => {
            return this.$t("error__passwords_min_length").replace("__var__min_length__var__", $params.min);
          }, minLength(8))
        },
        confirmNewPassword: {
          required: helpers.withMessage(() => this.$t("error__field_is_required"), required),
          sameAs: helpers.withMessage(() => this.$t("error__passwords_same_as"), sameAs(this.userData.newPassword))
        }
      }
    }
  },

  setup() {
    return {v$: useVuelidate()}
  },
}
</script>

<template>
  <form @submit.prevent="changePassword" autocomplete="on">
    <BaseInput v-model="userData.oldPassword"
               type="password"
               :label="$t('old_password')"
               :error="errorMessages.oldPassword"
               @input="removeBackendError('oldPassword')"
               name="password"/>
    <BaseInput v-model="userData.newPassword"
               type="password"
               :label="$t('new_password')"
               :error="errorMessages.newPassword"
               @input="removeBackendError('newPassword')"
               name="new_password"/>
    <BaseInput v-model="userData.confirmNewPassword"
               type="password"
               :label="$t('confirm_new_password')"
               :error="errorMessages.confirmNewPassword"
               @input="removeBackendError('confirmNewPassword')"
               name="confirm_new_password"/>


    <BaseButton :label="$t('submit')" type="submit" variant="app-button" :loading="loading"/>
  </form>
</template>

<style scoped lang="scss">

</style>