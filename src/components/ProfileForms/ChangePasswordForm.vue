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
      user_data: {
        old_password: "",
        new_password: "",
        confirm_new_password: ""
      }
    }
  },

  computed: {
    errorMessages() {
      const error_messages = {}
      for (let key in this.user_data) {
        error_messages[key] = this.v$.user_data[key]?.$errors?.[0]?.$message || this.backendErrors[key];
      }
      return error_messages;
    },
  },

  methods: {
    changePassword() {
      if (!this.formIsValid()) return;
      const {old_password, new_password} = this.user_data
      this.$emit("changePassword", old_password, new_password);
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
      user_data: {
        old_password: {
          required: helpers.withMessage(() => this.$t("error__field_is_required"), required)
        },
        new_password: {
          required: helpers.withMessage(() => this.$t("error__field_is_required"), required),
          minLength: helpers.withMessage(({$params}) => {
            return this.$t("error__passwords_min_length").replace("__var__min_length__var__", 8);
          }, minLength(8))
        },
        confirm_new_password: {
          required: helpers.withMessage(() => this.$t("error__field_is_required"), required),
          sameAs: helpers.withMessage(() => this.$t("error__passwords_same_as"), sameAs(this.user_data.new_password))
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
    <BaseInput v-model="user_data.old_password"
               type="password"
               :label="$t('old_password')"
               :error="errorMessages.old_password"
               @input="removeBackendError('old_password')"
               name="password"/>
    <BaseInput v-model="user_data.new_password"
               type="password"
               :label="$t('new_password')"
               :error="errorMessages.new_password"
               @input="removeBackendError('new_password')"
               name="new_password"/>
    <BaseInput v-model="user_data.confirm_new_password"
               type="password"
               :label="$t('confirm_new_password')"
               :error="errorMessages.confirm_new_password"
               @input="removeBackendError('confirm_new_password')"
               name="confirm_new_password"/>


    <BaseButton :label="$t('submit')" type="submit" variant="app-button" :loading="loading"/>
  </form>
</template>

<style scoped lang="scss">

</style>