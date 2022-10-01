<template>
    <div>
        <label
            :for="id"
            class="block mb-1 text-sm font-medium text-gray-900 capitalize"
            v-if="label"
            v-text="label"
        />
        <input
            :id="id"
            :type="type"
            :placeholder="placeholder"
            :required="required"
            :value="value"
            class="block bg-gray-50 border text-gray-900 text-sm rounded-md outline-none p-2.5 w-full"
        />
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
            type: String,
            required: true,
        },
        placeholder: String,
        required: {
            default: false,
            type: Boolean,
        },
    },
};
</script>
