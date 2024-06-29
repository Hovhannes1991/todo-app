<script>
import {mapGetters, mapMutations} from "vuex";
import Dropdown from 'primevue/dropdown';
import BaseInput from "@/ui/BaseInput.vue";
import BaseButton from "@/ui/BaseButton.vue";
import {updateProfile, changeEmail, changeEmailConfirm, changePassword, deleteProfile} from "@/api/profile.service.js";
import {toastError, toastSuccess} from "@/services/toast.service.js";
import BaseSelect from "@/ui/BaseSelect.vue";
import UpdatePersonalInfoForm from "@/components/ProfileForms/UpdatePersonalInfoForm.vue";
import ChangeEmailForm from "@/components/ProfileForms/ChangeEmailForm.vue";
import ChangePasswordForm from "@/components/ProfileForms/ChangePasswordForm.vue";
import DeleteProfileForm from "@/components/ProfileForms/DeleteProfileForm.vue";

export default {
  name: "ProfilePage",
  components: {
    DeleteProfileForm,
    ChangePasswordForm,
    UpdatePersonalInfoForm,
    ChangeEmailForm,
    BaseSelect,
    Dropdown,
    BaseButton,
    BaseInput
  },

  data() {
    return {
      tabs: [
        {name: "personal_information", label: "personal_information"},
        {name: "change_email", label: "change_email"},
        {name: "change_password", label: "change_password"},
        {name: "delete_account", label: "delete_account"}
      ],
      active_tab: "personal_information",

      email_verify_token_sent: false,

      loading: false,

      backend_errors: {}
    }
  },

  computed: {
    ...mapGetters({user: "auth/user"}),
  },

  methods: {
    ...mapMutations({updateUserProperty: "auth/UPDATE_USER_PROPERTY"}),

    changeTab(name) {
      if (this.active_tab === name) return;
      this.backend_errors = {};
      this.active_tab = name;
    },

    removeBackendError(name) {
      this.backend_errors[name] = null;
    },

    handleBackendErrors(err) {
      const backend_errors = err?.response?.data?.errors;
      if (!backend_errors) {
        toastError(this.$t('default_error_message'));
        return;
      }
      backend_errors.forEach(({msg, path}) => {
        this.backend_errors[path] = msg;
      })
    },

    async onSubmitPersonalData(updating_data) {
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

    async onChangeEmail({new_email, password}) {
      try {
        this.loading = true;
        await changeEmail(new_email, password);
        toastSuccess(`Verification token send to ${new_email}  email.`);
        this.email_verify_token_sent = true;
      } catch (err) {
        this.handleBackendErrors(err);
        console.log(err);
      }
      this.loading = false;
    },

    async confirmChangeEmail(token) {
      try {
        this.loading = true;
        const {data} = await changeEmailConfirm(token);
        toastSuccess(data.message);
        this.updateUserProperty({email: data.user.email});
        this.email_verify_token_sent = false;
      } catch (err) {
        console.log(err);
        const token_error = err?.response?.data?.errors?.token;
        if (token_error) {
          this.backend_errors.confirmation_token = token_error;
        } else {
          toastError(this.$t('default_error_message'));
        }
      }
      this.loading = false;
    },

    async onChangePassword(old_password, new_password) {
      try {
        this.loading = true;
        const {data} = await changePassword(old_password, new_password);
        toastSuccess(data.message);
      } catch (err) {
        console.log(err);
        const password_error = err?.response?.data?.errors?.old_password;
        if (password_error) {
          this.backend_errors.old_password = password_error;
        } else {
          toastError(this.$t('default_error_message'));
        }
      }
      this.loading = false;
    },

    async onDeleteProfile() {
      try {
        this.loading = true;
        const {data} = await deleteProfile();
        const updated_data = {
          is_deleted: data.is_deleted,
          deletedAt: data.deletedAt,
          activeUntil: data.activeUntil
        }
        this.updateUserProperty(updated_data);
      } catch (err) {
        console.log(err);
        toastError(this.$t('default_error_message'));
      }
      this.loading = false;
    }
  }
}
</script>

<template>
  <div class="profile-page">
    <div class="tabs">
      <div v-for="tab in tabs"
           @click="changeTab(tab.name)"
           :class="{tab: true, 'active-tab': tab.name === active_tab}"
           :key="tab">{{ $t(tab.label) }}
      </div>
    </div>

    <div class="profile-page-content">


      <template v-if="user">
        <div v-show="active_tab === 'personal_information'" class="content">
          <UpdatePersonalInfoForm
              @submit-personal-data="onSubmitPersonalData"
              @remove-backend-error="removeBackendError"
              :backend-errors="backend_errors"
              :loading="loading"/>
        </div>

        <div v-show="active_tab === 'change_email'" class="content">
          <ChangeEmailForm
              @change-email="onChangeEmail"
              @confirm-change-email="confirmChangeEmail"
              @cancel-change-email="email_verify_token_sent = false"
              @remove-backend-error="removeBackendError"
              :loading="loading"
              :backend-errors="backend_errors"
              :token-sent="email_verify_token_sent"/>
        </div>

        <div v-show="active_tab === 'change_password'" class="content">
          <ChangePasswordForm
              @change-password="onChangePassword"
              @remove-backend-error="removeBackendError"
              :backend-errors="backend_errors"
              :loading="loading"/>
        </div>

        <div v-show="active_tab === 'delete_account'">
          <DeleteProfileForm @delete-profile="onDeleteProfile" :loading="loading"/>
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