<script>
export default {
  name: "404"
}
</script>

<template>
  <div class="page-not-found">
    <h1 class="error-404">404</h1>
    <div class="message">Oops!!! Page is not found</div>
    <RouterLink :to="{name: 'home'}">Go to Home page</RouterLink>
  </div>
</template>

<style scoped lang="scss">
$text-shadow: #4db7ac;

.page-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;

  .error-404{
    font-size: 15rem;
    color: #009888;
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

  h1.error-404,
  a {
    margin: 0;
    padding: 0;
    text-decoration: none;
  }

  h1.error-404 {
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
    .error-404 {
      font-size: 10rem;
    }

    .message {
      font-size: 1.8rem;
    }
  }
}
</style>