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
      send_again_disabled: false,
      send_again_interval_id: null,
      send_again_countdown: null,
      user_email: "",
      errors: {
        token: null
      }
    }
  },

  computed: {
    ...mapGetters({user: "auth/user", emailVerificationTokenIsSent: "helpers/emailVerificationTokenIsSent"}),

    formattedSendAgainCountdown() {
      if (!this.send_again_countdown) return 0;
      return secondsToHMS(this.send_again_countdown).mm_ss;
    }
  },

  created() {
    if (this.user?.email_is_verified) {
      this.$router.push({name: "home"});
    }

    this.user_email = this.user?.email || "";
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
        this.updateUserProperty({email_is_verified: true});
        this.$router.push({name: "home"});
      } catch (err) {
        const token_error = err.response?.data?.errors?.token;
        if (token_error) {
          this.errors.token = token_error;
        } else {
          toastError("Something went wrong");
        }
      }
      this.loading = false;
    },

    async sendAgain() {
      this.send_again_disabled = true;
      try {
        await resendToken(this.user_email);
        this.startSendAgainCountdownInterval();
        this.errors.token = null;
      } catch (err) {
        this.send_again_disabled = false;
        const token_error = err.response?.data?.token;
        if(token_error) {
          this.errors.token = token_error;
        } else {
          toastError("Something went wrong");
        }
      }
    },

    startSendAgainCountdownInterval() {
      this.send_again_disabled = true;
      this.send_again_countdown = 150;

      this.send_again_interval_id = setInterval(() => {
        this.send_again_countdown--;
        if (this.send_again_countdown === 0) {
          this.clearSendAgainCountdownInterval();
          this.send_again_disabled = false;
        }
      }, 1000)
    },

    clearSendAgainCountdownInterval() {
      if (this.send_again_interval_id) clearInterval(this.send_again_interval_id);
    },

    removeTokenError() {
      this.errors.token = null;
    }
  }
}
</script>

<template>
  <div class="email-verification">
    <h1 class="email-verification__title">Please verify your E-mail</h1>
    <p class="email-verification__message">Verification token is send to your E-mail <span
        class="user-email">{{ user_email }}</span></p>
    <p class="email-verification__span-warning">If you don't see E-mail in your inbox please check spams</p>
    <form @submit.prevent="onSubmit">
      <BaseInput
          v-model="user_email"
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
        <BaseButton label="Verify" variant="app-button" type="submit" :loading="loading"/>

        <div class="send-again-btn">
          <BaseButton @click="sendAgain"
                      :disabled="send_again_disabled"
                      label="Send again"
                      variant="link"
                      type="button"/>
          <p v-if="send_again_countdown">
            You can request new token only after {{ formattedSendAgainCountdown }}
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