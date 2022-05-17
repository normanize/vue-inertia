<template>
  <Head title="Sign Up" />
  <div>Signup page</div>
</template>
<script>
import { Link } from "@inertiajs/inertia-vue3";
import Head from '@/Components/Head'
export default {
  mounted() {
    console.log("signup page mounted.");
  },
  components: {
    Head,
    Link
  },
};
</script>
