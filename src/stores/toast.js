// src/stores/toastStore.js
import { defineStore } from 'pinia';
import { useToast } from "vue-toastification";

export const useToastStore = defineStore('toast', () => {
  const toast = useToast();

  function success(message, options = {}) {
    toast.success(message, options);
  }

  function error(message, options = {}) {
    toast.error(message, options);
  }

  function info(message, options = {}) {
    toast.info(message, options);
  }

  return { success, error, info };
});