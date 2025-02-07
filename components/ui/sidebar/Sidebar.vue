<script setup>
import { ref } from "vue";
import { Menu, Home, History, Folder, Settings, User } from "lucide-vue-next";

const isOpen = ref(false);

const menuItems = [
  { name: "Dashboard", icon: Home, link: "/" },
  { name: "History", icon: History, link: "/history" },
  { name: "Projects", icon: Folder, link: "/projects" },
  { name: "Settings", icon: Settings, link: "/settings" },
  { name: "Profile", icon: User, link: "/profile" },
];

const toggleSidebar = () => {
  isOpen.value = !isOpen;
};
</script>

<template>
  <div class="flex">
    <!-- Bouton externe pour ouvrir/fermer la sidebar -->
    <button
      @click="toggleSidebar"
      class="fixed top-4 left-4 p-2 bg-gray-800 text-white rounded-md z-50 hover:bg-gray-700"
    >
      <Menu v-if="!isOpen" class="w-6 h-6" />
      <Menu v-else class="w-6 h-6 transform rotate-90" />
    </button>

    <!-- Sidebar -->
    <div
      :class="isOpen ? 'w-64' : 'w-16'"
      class="h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col items-center"
    >
      <!-- Menu Items -->
      <ul class="flex-1 space-y-4 mt-16 place-content-center">
        <li v-for="item in menuItems" :key="item.name">
          <NuxtLink
            :to="item.link"
            class="flex items-center space-x-4 px-4 py-2 hover:bg-gray-700 rounded-md"
          >
            <component :is="item.icon" class="w-6 h-6" />
            <span v-if="isOpen" class="text-base font-medium">
              {{ item.name }}
            </span>
          </NuxtLink>
        </li>
      </ul>

      <!-- Profile -->
      <div class="mb-4">
        <div
          class="flex items-center space-x-4 px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer"
        >
          <div
            class="bg-gray-700 w-8 h-8 flex items-center justify-center rounded-full"
          >
            CN
          </div>
          <span v-if="isOpen" class="text-sm">m@example.com</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 bg-gray-100">
      <NuxtPage />
    </div>
  </div>
</template>
