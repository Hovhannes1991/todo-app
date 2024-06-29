<script>
import {mapGetters, mapMutations} from "vuex";
import BaseButton from "@/ui/BaseButton.vue";
import {dateParse} from "@/helpers/date-parse.js";
import {restoreProfile} from "@/api/profile.service.js";
import {toastError} from "@/services/toast.service.js";
import {setGetPageFlushMessage} from "@/helpers/storage.js";

export default {
  name: "restoreProfile",
  components: {BaseButton},

  data() {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({user: "auth/user"}),

    activeUntil() {
      if (!this.user.activeUntil) return "";

      return dateParse(this.user.activeUntil);
    }
  },

  methods: {
    ...mapMutations({updateUserProperty: "auth/UPDATE_USER_PROPERTY"}),

    async restoreProfile() {
      try {
        this.loading = true;
        await restoreProfile();
        const updated_data = {
          is_deleted: false,
          deletedAt: null,
          activeUntil: null
        }
        this.updateUserProperty(updated_data);
        setGetPageFlushMessage(this.$t("your_profile_successfully_restored"));
        this.$router.push({name: "home"});
      } catch (err) {
        toastError(this.$t('default_error_message'));
      }
      this.loading = false;
    }
  }
}
</script>

<template>
  <div class="restore-profile">
    <h1>{{ $t("welcome_back") + " " + user.firstname }}</h1>
    <h2>{{ $t("you_can_restore_your_profile_until").replace("__var__date__var__", activeUntil) }}</h2>

    <div class="restore-btn">
      <BaseButton @click="restoreProfile" :label="$t('restore')" :loading="loading"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.restore-profile {
  color: white;
  text-align: center;
  padding: 2rem;

  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 2rem;
  }

  .restore-btn {
    margin-top: 2rem;

    button {
      margin: 0 auto;
    }
  }
}
</style>