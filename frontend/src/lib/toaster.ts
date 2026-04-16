import { createToaster } from '@skeletonlabs/skeleton-svelte';

export const toaster = createToaster({ placement: 'bottom' });

export function showToast(message: string, type: 'success' | 'error' | 'warning') {
    toaster[type]({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: message,
      duration: 5000,
      closable: true
    })
  }
