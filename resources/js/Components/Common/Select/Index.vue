<template>
    <div>
        <label
            :for="id"
            class="block mb-1 text-sm font-medium text-gray-900 capitalize"
            v-if="label"
            v-text="label"
        />
        <select
            :id="id"
            class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded-md transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-2 focus:border-blue-500 focus:outline-none"
            aria-label="Default select example"
            :class="style"
        >
            <slot />
        </select>
    </div>
</template>
<script>
export default {
    props: {
        id: String,
        label: String,
        style: String,
    },
};
</script>
