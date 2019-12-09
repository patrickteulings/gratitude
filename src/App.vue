<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <router-link to="/detail">Detail</router-link>
    </div>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" src="@/styles/style.scss">

body, html {
  padding: 0;
  margin: 0;
  font-size: 18px;
  box-sizing: border-box;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #1f1f1c;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

/* ----------------------------------------
  BUTTON RESET
---------------------------------------- */

button {
  display: inline-block;
  border: none;
  border-radius: 2px;
  padding: 1rem 2rem;
  margin: 0;
  text-decoration: none;
  background: #1f1f1c;
  color: #ffffff;
  font-family: sans-serif;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  text-align: center;
  transition: background 250ms ease-in-out, transform 150ms ease;
  -webkit-appearance: none;
  -moz-appearance: none;
}

button:hover,
button:focus {
  background: darken(#1f1f1c, 10%);
}

button:focus {
  outline: 0px;
  background: darken(#1f1f1c, 20%);
}

button:active {
    transform: scale(0.99);
}

</style>
