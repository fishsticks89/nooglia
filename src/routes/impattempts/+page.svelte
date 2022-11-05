<script lang="ts">
	import { dev } from '$app/environment';
	import { db } from '$lib/firebase';
	import { collection, getDocs, query, where } from 'firebase/firestore';

	let contents: string[] = [];

	if (!dev) {
		window.location.replace('/');
	}

	getDocs(query(collection(db, 'importAttempts'), where('contents', '!=', 'bullshit'))).then(
		(e) => {
			e.forEach((f) => {
				contents.push(f.get('contents'));
			});
			console.log(JSON.stringify(contents));
		}
	);
</script>
