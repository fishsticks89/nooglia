import { error } from '@sveltejs/kit';
 
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  if (params.path) {
    return {
      id: params.path
    };
  }
 
  throw error(404, 'Not found');
}