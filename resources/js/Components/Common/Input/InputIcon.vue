<template>
    <div class="relative w-full">
        <div
            class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
            :class="{ 'display: none': hasLeftIcon }"
        >
            <slot name="leftIcon" />
        </div>
        <input
            :id="id"
            :type="type"
            :placeholder="placeholder"
            :required="required"
            :model="value"
            class="block bg-gray-50 border text-gray-900 text-sm rounded-md outline-none p-2.5 w-full"
            :class="{ 'pl-10': hasLeftIcon, 'pr-10': hasRightIcon }"
        />
        <div
            class="flex absolute inset-y-0 right-0 items-center pr-3"
            :class="{ 'display: none': hasRightIcon }"
        >
            <slot name="rightIcon" />
        </div>
    </div>
</template>
<script>
export default {
    props: {
        id: String,
        label: String,
        type: {
            default: "text",
            type: String,
        },
        value: {
            default: "",
            type: String,
            required: true,
        },
        placeholder: String,
        required: {
            default: false,
            type: Boolean,
        },
    },
    computed: {
        hasLeftIcon() {
            return !!this.$slots["leftIcon"];
        },
        hasRightIcon() {
            return !!this.$slots["rightIcon"];
        },
    },
};
</script>
