<script>
import {mapActions} from "vuex";
import {toast} from 'vue3-toastify';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "TheHeader",
  components: {FontAwesomeIcon},


  data() {
    return {
      show_mobile_menu: false,
      user_menu_items: [
        {
          label: 'Profile',
          icon: 'pi pi-home',
          handler: "gotoProfilePage"
        },
        {
          label: 'Settings',
          icon: 'pi pi-star',
          handler: "gotoSettingsPage"
        },
        {
          label: 'Logout',
          icon: 'pi pi-search',
          handler: "logoutHandler"
        }
      ]
    }
  },

  methods: {
    ...mapActions({logout: "auth/logout"}),

    toggleMenu() {
      this.show_mobile_menu = !this.show_mobile_menu;
    },

    gotoProfilePage() {
      toast.warn("This section is not ready yet!!!");
    },

    gotoSettingsPage() {
      toast.warn("This section is not ready yet!!!");
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
      <img src="@/assets/logo.png" alt="Logo">
      <div class="title">Todo App</div>
    </div>
    <div class="user-menu">
      <button class="user-menu__btn">User Menu &#9662;</button>
      <div class="dropdown">
        <ul>
          <li v-for="item in user_menu_items">
            <button @click="menuItemClickHandler(item.handler)" type="button">{{ item.label }}</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="burger-menu"
         @click="toggleMenu">
      <FontAwesomeIcon icon="bars"/>
    </div>
    <ul :class="{'user-menu__mobile': true, 'opened': show_mobile_menu}">
      <li v-for="item in user_menu_items">
        <button @click="menuItemClickHandler(item.handler)" type="button">{{ item.label }}</button>
      </li>
    </ul>
  </header>
</template>

<style scoped lang="scss">
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
  background-color: #333;
  padding: 10px 20px;
  color: white;

  .logo {
    display: flex;
    align-items: center;

    img {
      height: 50px;
      margin-right: 10px;
    }
  }

  .title {
    font-size: 24px;
  }

  .user-menu {
    position: relative;

    button.user-menu__btn {
      background-color: #333;
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
        background-color: #333333;

        &:hover {
          background-color: #575757;
        }
      }
    }
  }
}
</style>