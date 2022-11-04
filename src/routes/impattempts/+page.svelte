<script lang="ts">
	import { db } from '$lib/firebase';
	import { collection, getDocs, query, where } from 'firebase/firestore';

	let contents: string[] = [];

	getDocs(query(collection(db, 'importAttempts'), where('contents', '!=', 'bullshit'))).then(
		(e) => {
			e.forEach((f) => {
				contents.push(f.get('contents'));
			});
			console.log(JSON.stringify(contents));
		}
	);
</script>
