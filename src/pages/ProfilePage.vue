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
      activeTab: "personal_information",

      emailVerifyTokenSent: false,

      loading: false,

      backendErrors: {}
    }
  },

  computed: {
    ...mapGetters({user: "auth/user"}),
  },

  methods: {
    ...mapMutations({updateUserProperty: "auth/UPDATE_USER_PROPERTY"}),

    changeTab(name) {
      if (this.activeTab === name) return;
      this.backendErrors = {};
      this.activeTab = name;
    },

    removeBackendError(name) {
      this.backendErrors[name] = null;
    },

    handleBackendErrors(err) {
      const errorsFromBackend = err?.response?.data?.errors;
      if (!errorsFromBackend) {
        toastError(this.$t('default_error_message'));
        return;
      }
      errorsFromBackend.forEach(({msg, path}) => {
        this.backendErrors[path] = msg;
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

    async onChangeEmail({newEmail, password}) {
      try {
        this.loading = true;
        await changeEmail(newEmail, password);
        toastSuccess(`Verification token send to ${newEmail}  email.`);
        this.emailVerifyTokenSent = true;
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
        this.emailVerifyTokenSent = false;
      } catch (err) {
        console.log(err);
        const tokenError = err?.response?.data?.errors?.token;
        if (tokenError) {
          this.backendErrors.confirmationToken = tokenError;
        } else {
          toastError(this.$t('default_error_message'));
        }
      }
      this.loading = false;
    },

    async onChangePassword(oldPassword, newPassword) {
      try {
        this.loading = true;
        const {data} = await changePassword(oldPassword, newPassword);
        toastSuccess(data.message);
      } catch (err) {
        console.log(err);
        const passwordError = err?.response?.data?.errors?.oldPassword;
        if (passwordError) {
          this.backendErrors.oldPassword = passwordError;
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
        const updatedData = {
          isDeleted: data.isDeleted,
          deletedAt: data.deletedAt,
          activeUntil: data.activeUntil
        }
        this.updateUserProperty(updatedData);
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
           :class="{tab: true, 'active-tab': tab.name === activeTab}"
           :key="tab">{{ $t(tab.label) }}
      </div>
    </div>

    <div class="profile-page-content">


      <template v-if="user">
        <div v-show="activeTab === 'personal_information'" class="content">
          <UpdatePersonalInfoForm
              @submit-personal-data="onSubmitPersonalData"
              @remove-backend-error="removeBackendError"
              :backend-errors="backendErrors"
              :loading="loading"/>
        </div>

        <div v-show="activeTab === 'change_email'" class="content">
          <ChangeEmailForm
              @change-email="onChangeEmail"
              @confirm-change-email="confirmChangeEmail"
              @cancel-change-email="emailVerifyTokenSent = false"
              @remove-backend-error="removeBackendError"
              :loading="loading"
              :backend-errors="backendErrors"
              :token-sent="emailVerifyTokenSent"/>
        </div>

        <div v-show="activeTab === 'change_password'" class="content">
          <ChangePasswordForm
              @change-password="onChangePassword"
              @remove-backend-error="removeBackendError"
              :backend-errors="backendErrors"
              :loading="loading"/>
        </div>

        <div v-show="activeTab === 'delete_account'">
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