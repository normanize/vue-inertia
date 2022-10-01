<template>
    <Titlebar title="Sign Up" />
    <div>Signup page</div>
</template>
<script>
import Titlebar from "@/Components/Common/Titlebar/Index";
export default {
    mounted() {
        console.log("signup page mounted.");
    },
    components: { Titlebar },
};
</script>
