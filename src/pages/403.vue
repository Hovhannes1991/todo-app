<script>
export default {
  name: "403"
}
</script>

<template>
  <div class="access-denied">
    <h1 class="error-403">403</h1>
    <div class="message">{{ $t("access_denied") }}</div>
    <RouterLink :to="{name: 'home'}">{{ $t("go_to_home_page") }}</RouterLink>
  </div>
</template>

<style scoped lang="scss">
$text-shadow: #e57373;

.access-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;

  .error-403 {
    font-size: 15rem;
    color: #ef4444;
    text-shadow:
        1px 1px 1px $text-shadow,
        2px 2px 1px $text-shadow,
        3px 3px 1px $text-shadow,
        4px 4px 1px $text-shadow,
        5px 5px 1px $text-shadow,
        6px 6px 1px $text-shadow,
        7px 7px 1px $text-shadow,
        8px 8px 1px $text-shadow,
        25px 25px 8px rgba(0,0,0, 0.2);
  }

  h1.error-403,
  a {
    margin: 0;
    padding: 0;
    text-decoration: none;
  }

  h1.error-403 {
    line-height: 20rem;
  }

  .message {
    font-size: 2.5rem;
    margin: 2rem 0;
    font-weight: 600;
    color: #fff;
  }

  a {
    display: inline-block;
    border: 2px solid #222;
    color: #fff;
    text-transform: uppercase;
    font-weight: 600;
    padding: 0.75rem 1rem 0.6rem;
    transition: all 0.2s linear;
    box-shadow: 0 15px 15px -11px rgba(0,0,0, 0.4);
    background: #222;
    border-radius: 6px;

    &:hover{
      background: #222;
      color: #ddd;
    }
  }

  @media only screen and (max-width: 370px) {
    .error-403 {
      font-size: 10rem;
    }

    .message {
      font-size: 1.8rem;
    }
  }
}
</style>