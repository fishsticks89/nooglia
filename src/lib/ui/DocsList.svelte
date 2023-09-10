<script lang="ts">
    import { flyin } from "$lib/transitions/flyin";
    import CSRprovider from "$lib/util/domStuff/CSRprovider.svelte";
    import { fade } from "svelte/transition";
    import { authState } from "$lib/auth/authState";
    import { setsCollection } from "$lib/firebase";
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
    import { createSet } from "$lib/core/doc";

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
                setsCollection,
                where("user", "==", get(authState)?.uid),
                where("contents", "!=", "")
            ),
            async (e) => {
                const newDocs = e.docs.filter(
                    (doc) =>
                        getStringArr(doc, "contents")
                            .join("")
                            .split(/[ \n]/)
                            .join("") != ""
                );
                if (newDocs.length === 0) {
                    const uid = $authState?.uid;
                    if (!uid) throw "no user?";
                    const set = e.docs.at(0)?.id ?? (await createSet());
                    href = "/set/" + set;
                    console.log(href);
                }
                docs = e.docs;
            }
        );
    }}
/>
<div class="holder" id="create">
    <button
        on:click={async () => {
            const uid = $authState?.uid;
            if (uid) href = "/set/" + (await createSet());
        }}
        class="newset"
        in:fade={{ duration: 300 }}>New Set</button
    >
    {#each docs as doc}
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
                    class="open trash"
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
    {/each}
</div>

<style>
    .newset {
        margin-block: 1rem;
        padding: 0.7rem;
        padding-inline: 1.2rem;
        background-color: var(--emp);
        color: var(--lighter);

        border: 0px solid transparent;
        border-radius: var(--round);

        font-family: 'PoppinsSemi', sans-serif;
    }
    .open {
        display: inline;
        position: relative;

        height: 2.9rem;
        padding-inline: 1.2rem;

        background-color: var(--light);
        color: var(--emp);

        border: 0px solid transparent;
        border-radius: var(--round);

        font-family: 'PoppinsSemi', sans-serif;

        margin-left: 0.6rem;
    }
    .trash {
        color: var(--lighter);
        background-color: var(--glasser);
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

        color: var(--light);
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
