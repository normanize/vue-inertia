<template>
    <button
        :type="type"
        :disabled="disabled"
        class="btn flex flex-row items-center"
        :class="classExtension"
    >
        <div class="mr-4" :class="{ 'display: none': hasLeftIcon }">
            <slot name="leftIcon" />
        </div>
        <slot name="label" />
        <div class="ml-4" :class="{ 'display: none': hasRightIcon }">
            <slot name="rightIcon" />
        </div>
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
        hasLeftIcon() {
            return !!this.$slots["leftIcon"];
        },
        hasRightIcon() {
            return !!this.$slots["rightIcon"];
        },
    },
};
</script>
