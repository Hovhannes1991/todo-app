<script>
import {mapGetters, mapMutations} from "vuex";
import {emailVerify, resendToken} from "@/api/verification.service.js"
import BaseButton from "@/ui/BaseButton.vue";
import BaseInput from "@/ui/BaseInput.vue";
import {toastError} from "@/services/toast.service.js";
import {secondsToHMS} from "@/helpers/seconds-to-hms.js";

export default {
  name: "EmailVerify",
  components: {BaseInput, BaseButton},

  data() {
    return {
      token: "",
      loading: false,
      sendAgainDisabled: false,
      sendAgainIntervalId: null,
      sendAgainCountDown: null,
      userEmail: "",
      errors: {
        token: null
      }
    }
  },

  computed: {
    ...mapGetters({user: "auth/user", emailVerificationTokenIsSent: "helpers/emailVerificationTokenIsSent"}),

    formattedSendAgainCountdown() {
      if (!this.sendAgainCountDown) return 0;
      return secondsToHMS(this.sendAgainCountDown).mm_ss;
    }
  },

  created() {
    if (this.user?.emailIsVerified) {
      this.$router.push({name: "home"});
    }

    this.userEmail = this.user?.email || "";
    if (this.emailVerificationTokenIsSent) {
      this.startSendAgainCountdownInterval();
    }
  },

  beforeUnmount() {
    this.clearSendAgainCountdownInterval();
  },

  methods: {
    ...mapMutations({
      updateUserProperty: "auth/UPDATE_USER_PROPERTY",
      setEmailVerificationTokenIsSent: "helpers/SET_EMAIL_VERIFICATION_IS_SENT"
    }),

    async onSubmit() {
      const token = this.token.trim();
      if (!token) {
        this.errors.token = "Token is required";
        return;
      }

      try {
        this.loading = true;
        await emailVerify(this.token);
        this.updateUserProperty({emailIsVerified: true});
        this.$router.push({name: "home"});
      } catch (err) {
        const tokenError = err.response?.data?.errors?.token;
        if (tokenError) {
          this.errors.token = tokenError;
        } else {
          toastError(this.$t('default_error_message'));
        }
      }
      this.loading = false;
    },

    async sendAgain() {
      this.sendAgainDisabled = true;
      try {
        await resendToken(this.userEmail);
        this.startSendAgainCountdownInterval();
        this.errors.token = null;
      } catch (err) {
        this.sendAgainDisabled = false;
        const tokenError = err.response?.data?.token;
        if (tokenError) {
          this.errors.token = tokenError;
        } else {
          toastError(this.$t('default_error_message'));
        }
      }
    },

    startSendAgainCountdownInterval() {
      this.sendAgainDisabled = true;
      this.sendAgainCountDown = 150;

      this.sendAgainIntervalId = setInterval(() => {
        this.sendAgainCountDown--;
        if (this.sendAgainCountDown === 0) {
          this.clearSendAgainCountdownInterval();
          this.sendAgainDisabled = false;
        }
      }, 1000)
    },

    clearSendAgainCountdownInterval() {
      if (this.sendAgainIntervalId) clearInterval(this.sendAgainIntervalId);
    },

    removeTokenError() {
      this.errors.token = null;
    }
  }
}
</script>

<template>
  <div class="email-verification">
    <h1 class="email-verification__title">{{ $t('please_verify_your_email')}}</h1>
    <p class="email-verification__message">{{ $t('verification_token_is_send_to_your_email') }}
      <span class="user-email">{{ userEmail }}</span>
    </p>
    <p class="email-verification__span-warning">{{ $t('check_spam_info') }}</p>
    <form @submit.prevent="onSubmit">
      <BaseInput
          v-model="userEmail"
          :disabled="true"
          label="E-mail"
          type="text"/>
      <BaseInput
          v-model="token"
          @input="removeTokenError"
          label="Token"
          placeholder="Token from E-mail"
          type="text"
          :error="errors.token"
          tab-index="0"/>

      <div class="buttons">
        <BaseButton :label="$t('verify')" variant="app-button" type="submit" :loading="loading"/>

        <div class="send-again-btn">
          <BaseButton @click="sendAgain"
                      :disabled="sendAgainDisabled"
                      :label="$t('send_again')"
                      variant="link"
                      type="button"/>
          <p v-if="sendAgainCountDown">
            {{ $t('you_can_request_new_token_only_after') }} {{ formattedSendAgainCountdown }}
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.email-verification {
  width: 80vw;
  max-width: 45rem;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;


  .email-verification__title,
  .email-verification__message,
  .email-verification__span-warning {
    text-align: center;
  }

  .email-verification__message {
    font-size: 2rem;

    .user-email {
      font-weight: bold;
    }
  }

  .email-verification__span-warning {
    font-style: italic;
  }

  form {
    width: 100%;
    margin-top: 2rem;

    .buttons {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 2rem;
      margin: 2rem 0 0 auto;
    }
  }
}
</style>