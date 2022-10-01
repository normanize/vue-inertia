<template>
    <Titlebar title="Login" />
</template>
<script>
import Titlebar from "@/Components/Common/Titlebar/Index";
export default {
    mounted() {
        console.log("login page mounted.");
    },
    components: { Titlebar },
};
</script>
