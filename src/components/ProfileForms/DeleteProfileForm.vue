<script>
import {mapGetters, mapActions} from "vuex";
import BaseButton from "@/ui/BaseButton.vue";
import {dateParse} from "@/helpers/date-parse.js";

export default {
  name: "DeleteProfileForm",
  components: {BaseButton},

  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },

  emits: ["deleteProfile"],

  computed: {
    ...mapGetters({user: "auth/user"}),

    restoreDate() {
      if (!this.user.activeUntil) return "";
      return dateParse(this.user.activeUntil);
    }
  },

  methods: {
    ...mapActions({logout: "auth/logout"}),

    deleteProfile() {
      this.$emit("deleteProfile");
    },

    async logoutHandler() {
      try {
        await this.logout();
        this.$router.push({name: "auth"});
      } catch (err) {
        console.log(err);
      }
    },
  }
}
</script>

<template>
  <div class="delete-profile-section">
    <div v-if="user.is_deleted" class="restore-profile-info">
      <div @click="logoutHandler" class="shape"></div>
      <p>{{ $t("after_delete_profile_info").replace("__var__date__var__", restoreDate) }}</p>
      <form @submit.prevent="logoutHandler">
        <BaseButton :label="$t('logout')" type="submit" variant="app-button"/>
      </form>
    </div>
    <div v-else class="delete-profile-info">
      <h2>{{ $t("delete_profile") }}</h2>
      <p>{{ $t("before_delete_profile_info") }}</p>
      <form @submit.prevent="deleteProfile">
        <BaseButton :label="$t('delete_my_profile')" type="submit" variant="app-button" :loading="loading"/>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.delete-profile-section {
  color: white;
  text-align: center;

  h2 {
    font-size: 3rem;
  }

  .delete-profile-info,
  .restore-profile-info {
    font-size: 1.8rem;
  }

  form {
    button {
      margin: 2rem auto;
    }
  }

  .restore-profile-info {
    p, form {
      position: relative;
    }

    .shape {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(206, 206, 206, 0.2);
    }
  }
}
</style>