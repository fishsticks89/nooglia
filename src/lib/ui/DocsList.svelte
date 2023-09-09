<script lang="ts">
	import { flyin } from '$lib/transitions/flyin';
    import CSRprovider from "$lib/util/CSRprovider.svelte";
    import { fade } from "svelte/transition";
    import { authState } from "$lib/auth/authState";
    import { createSet } from "$lib/createset/createSet";
    import { sets } from "$lib/firebase";
    import Runner from "$lib/util/Runner.svelte";
    import {
        DocumentSnapshot,
        deleteDoc,
        onSnapshot,
        query,
        where,
        type DocumentData,
    } from "firebase/firestore";
    import { get } from "svelte/store";

    let href: null | string = null;
    const getStringArr = (
        doc: DocumentSnapshot<DocumentData>,
        property: string
    ) => {
        return doc.get(property) as string[];
    };

    let docs: DocumentSnapshot[] = [];
</script>

<CSRprovider link={href} />

<Runner
    enter={() => {
        onSnapshot(
            query(
                sets,
                where("user", "==", get(authState)?.uid),
                where("contents", "!=", "")
            ),
            (e) => {
                if (e.docs.length === 0) {
                    const uid = $authState?.uid;
                    if (uid)
                        createSet(uid, (setref) => {
                            href = setref;
                        });
                }
                docs = e.docs;
            }
        );
    }}
/>
<div class="holder" id="create">
    <button
        on:click={() => {
            const uid = $authState?.uid;
            if (uid)
                createSet(uid, (setref) => {
                    href = setref;
                });
        }}
        class="newset"
        in:fade={{ duration: 300 }}>New Set</button
    >
    {#each docs as doc}
        {#if getStringArr(doc, "contents")
            .join("")
            .split(/[ \n]/)
            .join("") != ""}
            <a
                in:flyin={{ isin: true, additionalTransforms: "" }}
                class="setholder"
                on:focus
                href={"/set/" + doc.id}
            >
                <p style:margin-top="0px">
                    {doc.get("name") != "" ? doc.get("name") : "Untitled"}
                </p>
                <div class="butts">
                    <button class="open">Open</button>
                    <button
                        class="open"
                        on:click={(e) => {
                            e.preventDefault();
                            const shouldDelete = confirm(
                                "Are you sure you want to delete this set?"
                            );
                            if (shouldDelete) deleteDoc(doc.ref);
                        }}
                    >
                        <span class="material-icons-round">delete</span></button
                    >
                </div>
            </a>
        {/if}
    {/each}
</div>

<style>
    .newset {
        margin-block: 1rem;
        padding: 0.7rem;
        padding-inline: 1.2rem;
        background-color: var(--glass);

        border: 0px solid transparent;
        border-radius: var(--round);

        font-family: "GilroyBold", sans-serif;
    }
    .open {
        display: inline;
        position: relative;

        height: 2.9rem;
        padding-inline: 1.2rem;

        background-color: var(--glass);

        border: 0px solid transparent;
        border-radius: var(--round);

        font-family: "GilroyBold", sans-serif;

        margin-left: 0.6rem;
    }
    .butts {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .setholder {
        position: relative;
        text-align: left;
        display: flex;

        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        width: calc(100% - 1.4rem);
        padding: 0.7rem;
        margin-bottom: 1rem;

        color: white;
        text-decoration: none;

        border-radius: var(--round);
        background-color: var(--emp);
    }
    .holder {
        width: calc(70vw + 8vh);
        max-width: 50rem;
        height: fit-content;
        margin: 0px;
        margin-left: 50vw;
        transform: translateX(-50%);
        padding-top: 4rem;

        overflow: visible;
    }
</style>
