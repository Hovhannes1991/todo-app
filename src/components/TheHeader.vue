<script>
import {defineAsyncComponent} from "vue";
import {mapGetters, mapActions} from "vuex";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const SelectLocale = defineAsyncComponent(() => import("@/components/SelectLocale.vue"));
export default {
  name: "TheHeader",
  components: {SelectLocale, FontAwesomeIcon},

  props: {
    isGuest: {
      type: Boolean,
      default: false
    }
  },


  data() {
    return {
      showMobileMenu: false
    }
  },

  computed: {
    ...mapGetters({user: "auth/user"}),

    emailIsVerified() {
      return this.user?.emailIsVerified;
    },

    isDeleted() {
      return this.user?.isDeleted;
    },

    availableUserMenuItems() {
      if (this.emailIsVerified && !this.isDeleted) return [
        {
          label: "home",
          to: "home",
          icon: 'pi pi-home',
        },
        {
          label: "profile",
          to: "profile",
          icon: 'pi pi-home',
        },
        {
          label: "settings",
          to: "settings",
          icon: 'pi pi-star',
        },
        {
          label: "logout",
          to: null,
          icon: 'pi pi-search',
          handler: "logoutHandler",
          is_button: true,
        }
      ];

      return [
        {
          label: "logout",
          to: null,
          icon: 'pi pi-search',
          handler: "logoutHandler",
          is_button: true,
        }
      ]
    }
  },

  methods: {
    ...mapActions({logout: "auth/logout"}),

    toggleMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },

    async logoutHandler() {
      try {
        await this.logout();
        this.$router.push({name: "auth"});
      } catch (err) {
        console.log(err);
      }
    },

    menuItemClickHandler(handler) {
      if (this[handler]) this[handler]();
    }
  }
}
</script>

<template>
  <header class="the-header">
    <div class="logo">
      <RouterLink to="home">
        <img src="@/assets/logo.svg" alt="Logo">
        <div class="title">Todo App</div>
      </RouterLink>
    </div>
    <div class="hk__flex-center header__right-section">
      <SelectLocale/>
      <template v-if="!isGuest">
        <div class="user-menu">
          <button class="user-menu__btn">{{ $t('user_menu') }} &#9662;</button>
          <div class="dropdown">
            <ul>
              <li v-for="item in availableUserMenuItems">
                <button v-if="item.is_button" @click="menuItemClickHandler(item.handler)" type="button">
                  {{ $t(item.label) }}
                </button>
                <RouterLink v-else :to="item.to">{{ $t(item.label) }}</RouterLink>
              </li>
            </ul>
          </div>
        </div>
        <div class="burger-menu"
             @click="toggleMenu">
          <FontAwesomeIcon icon="bars"/>
        </div>
        <ul :class="{'user-menu__mobile': true, 'opened': showMobileMenu}">
          <li @click="toggleMenu" v-for="item in availableUserMenuItems">
            <button v-if="item.is_button" @click="menuItemClickHandler(item.handler)" type="button">
              {{ $t(item.label) }}
            </button>
            <RouterLink v-else :to="item.to">{{ $t(item.label) }}</RouterLink>
          </li>
        </ul>
      </template>
    </div>
  </header>
</template>

<style scoped lang="scss">
$header-bg: #333333;
@mixin user-menu-item {
  width: 100%;
  text-align: left;
  outline: none;
  border: none;
  border-radius: 0;
  padding: 1.2rem 1.6rem;
  text-decoration: none;
  display: block;
  font-size: 2rem;
  cursor: pointer;
}

.the-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $header-bg;
  padding: 10px 20px;
  color: white;

  .logo {
    display: flex;
    align-items: center;

    a {
      display: flex;
      align-items: center;
      color: white;
      text-decoration: none;
    }

    img {
      width: 50px;
      height: 50px;
      margin-right: 1rem;
    }
  }

  .title {
    font-size: 2.4rem;
  }

  .header__right-section {
    gap: 1rem;
  }

  .user-menu {
    position: relative;

    button.user-menu__btn {
      background-color: $header-bg;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 2rem;
    }

    .dropdown {
      display: none;
      position: absolute;
      padding-top: 1rem;
      right: 0;
      z-index: 10;

      ul {
        background-color: #f9f9f9;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1;
        min-width: 160px;
        border-radius: 0.5rem;
        overflow: hidden;

        li {
          list-style: none;
        }

        a, button {
          @include user-menu-item;
          color: black;
          background-color: white;

          &:hover {
            background-color: #f1f1f1;
          }
        }
      }
    }

    &:hover {
      .dropdown {
        display: block;
      }
    }
  }

  .burger-menu {
    display: none;
    cursor: pointer;
    font-size: 3rem;
  }

  .user-menu__mobile {
    display: none;
  }
}


@media only screen and (max-width: 756px) {
  .the-header {
    .user-menu {
      display: none;
    }

    .burger-menu {
      display: flex;
    }

    .user-menu__mobile {
      display: block;
      z-index: 100;
      max-height: 0;
      overflow: hidden;
      position: absolute;
      right: 0;
      top: 7rem;
      width: 100%;
      background-color: $header-bg;
      list-style: none;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      font-size: 2rem;
      transition: max-height 0.3s ease-in-out;

      &.opened {
        max-height: 100vh;
      }

      a, button {
        @include user-menu-item;
        color: white;
        background-color: $header-bg;

        &:hover {
          background-color: #575757;
        }
      }
    }
  }
}
</style>