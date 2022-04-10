import {
    Component,
    DefineComponent,
    inject,
    markRaw,
    reactive,
    Ref,
    ref,
    shallowReactive,
    ShallowRef,
    shallowRef,
} from "vue";

declare type PropsType<C extends DefineComponent<any, any, any>> =
    InstanceType<C>["$props"];

interface ModalDefinition {
    component: DefineComponent<any, any, any, any, any>;
    props: Record<string, any>;
    id: number;
}

const activeModals = reactive<ModalDefinition[]>([]);

export function useModalRoot() {
    return {
        activeModals,
        removeModal: (index: number) => {
            activeModals.splice(index, 1);
        },
    };
}

export function useModal<
    C extends DefineComponent<any, any, any, any, any>,
    Props extends PropsType<C>
    >(component: C) {
    return (props: Props) => {
        activeModals.push({
            component: markRaw(component),
            props,
            id: Date.now() + Math.random(),
        });
    };
}
