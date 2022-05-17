<template>
  <Head title="Login" />
  <div>login page</div>
</template>
<script>
import { Link } from "@inertiajs/inertia-vue3";
import Head from "@/Components/Head";
export default {
  mounted() {
    console.log("login page mounted.");
  },
  components: { Head, Link },
};
</script>
