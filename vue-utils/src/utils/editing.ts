import { reactive, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { TypedDocumentNode } from "@apollo/client";
import { assert, pick } from "@j-waters/ts-utils";
import { merge } from "merge-anything";


function removeRecursive<T extends any[] | Record<any, any> | null>(
    value: T,
    key: string
): T {
    if (value == null) {
        return null as T;
    }
    if (Array.isArray(value)) {
        return value.map((v) => removeRecursive(v, key)) as T;
    }
    if (typeof value === "object") {
        const obj: Record<any, any> = { ...value };
        for (const prop in obj) {
            if (prop === key) {
                delete obj[prop];
            } else {
                obj[prop] = removeRecursive(obj[prop], key);
            }
        }
        value = obj;
    }
    return value;
}

export function useEditing<
    T extends { id: string },
    K extends _K[number],
    _K extends (keyof T)[],
    Create extends TypedDocumentNode<
        { [key: string]: T | string },
        { data: Pick<T, K> }
        >,
    Update extends TypedDocumentNode<
        { [key: string]: T | string },
        { data: Pick<T, K> & { id: string } }
        >
    >(options: {
    object?: T;
    default: Pick<T, K>;
    editableFields: _K;
    creationMutation: Create;
    updateMutation: Update;
    postSubmit?: (value: T | null) => void;
    remove: (value: T) => Promise<boolean>;
    postRemove?: (success: boolean) => void;
    postAnySuccessful?: () => void;
}) {
    const isNew = options.object == undefined;
    const editingValue = reactive<Pick<T, K>>(
        isNew
            ? options.default
            : (merge(
                options.default,
                removeRecursive(
                    pick(options.object!, options.editableFields),
                    "__typename"
                )
            ) as Pick<T, K>)
    );

    const { mutate: create } = useMutation(options.creationMutation);
    const { mutate: update } = useMutation(options.updateMutation);

    const isSubmitting = ref(false);
    const isRemoving = ref(false);

    function _tryPostAnySuccessful(truthy: any) {
        if (options.postAnySuccessful && truthy) {
            options.postAnySuccessful();
        }
    }

    async function submit(): Promise<T | null> {
        isSubmitting.value = true;
        let res;
        if (isNew) {
            res = await create({ data: editingValue });
        } else {
            assert(typeof editingValue == "object");
            res = await update({
                data: { ...editingValue, id: options.object!.id },
            });
        }
        isSubmitting.value = false;
        if (res && res.data) {
            for (const entry of Object.values(res.data)) {
                if (entry != null && typeof entry == "object" && "__typename" in entry!) {
                    if (options.postSubmit) {
                        options.postSubmit(entry);
                    }
                    _tryPostAnySuccessful(entry);
                    return entry;
                }
            }
        }
        if (options.postSubmit) {
            options.postSubmit(null);
        }
        _tryPostAnySuccessful(null);
        return null;
    }

    async function remove() {
        isRemoving.value = true;
        const success = await options.remove(options.object!);
        isRemoving.value = false;
        if (options.postRemove) {
            options.postRemove(success);
        }
        _tryPostAnySuccessful(success);
    }

    return {
        editingValue,
        isNew,
        submit,
        isSubmitting,
        remove,
        isRemoving,
    };
}
