<template>
    <button
        :type="type"
        :disabled="disabled"
        class="btn flex flex-row items-center"
        :class="classExtension"
    >
        <slot />
    </button>
</template>
<script>
export default {
    props: {
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
