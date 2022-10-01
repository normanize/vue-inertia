<template>
    <button
        :type="type"
        :disabled="disabled"
        class="btn flex flex-row items-center"
        :class="classExtension"
    >
        <span v-show="loading">
            <svg-vue icon="loading/submit"></svg-vue>
        </span>
        <slot />
    </button>
</template>
<script>
export default {
    props: {
        loading: {
            default: false,
            type: Boolean,
        },
        type: {
            default: "button",
            type: String,
        },
        disabled: {
            default: false,
            type: Boolean,
        },
        style: String,
    },
    computed: {
        classExtension() {
            if (this.style && this.style.length > 0) {
                return style;
            }
            return "btn-default";
        },
    },
};
</script>
