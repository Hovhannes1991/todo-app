<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

export default {
  name: "TheFooter",
  components: {FontAwesomeIcon},

  data() {
    return {
      current_year: new Date().getFullYear(),

      social: [
        {
          name: "Linkedin",
          icon: "linkedin-in",
          href: "https://www.linkedin.com/in/hovhannes-keshishyan"
        },
        {
          name: "Github",
          icon: "github",
          href: "https://github.com/Hovhannes1991"
        },
        {
          name: "Facebook",
          icon: "facebook",
          href: "https://www.facebook.com/HovoKeshishyan"
        },
        {
          name: "X",
          icon: "twitter",
          href: "https://x.com/hovo1991"
        }
      ]
    }
  }
}
</script>

<template>
  <footer class="the-footer">
    <div class="footer-row footer-row-1">
      <p>{{ $t('contacts') }}</p>
      <ul class="social">
        <li v-for="item in social" :key="item.name">
          <a :href="item.href" target="_blank" :aria-label="`${item.name} link`">
            <FontAwesomeIcon :icon="['fab', item.icon]"/>
          </a>
        </li>
      </ul>
    </div>

    <div class="footer-row footer-row-2">
      <span>&copy; {{ current_year }}</span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
footer,
.the-footer {
  width: 100%;
  display: flex;
  flex-direction: column;

  .footer-row {
    width: 100%;
    color: var(--main-fg-color);
    display: flex;
    align-items: center;
    font-size: 3rem;
    flex-wrap: wrap;
  }

  .footer-row-1 {
    background-color: var(--main-bg-color);
    justify-content: space-between;
    padding: 1.5rem 4rem 1.5rem 1.5rem;
    gap: 1rem 3rem;

    ul.social {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.5rem 1.5rem;

      li {
        list-style: none;
      }

      a {
        text-decoration: none;
        color: var(--main-fg-color);
        transition: color 0.2s ease-in-out;

        &:hover {
          color: gold;
        }
      }
    }

    @media only screen and (max-width: 400px) {
      justify-content: center;
      padding: 1.5rem;
    }
  }

  .footer-row-2 {
    background-color: var(--app-black);
    color: var(--app-white);
    padding: 1.5rem;
    justify-content: center;
    font-size: 1.8rem;
  }
}
</style>