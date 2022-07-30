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
  onClose(data: any): void;
}

const activeModals = reactive<ModalDefinition[]>([]);

export function useModalRoot() {
  return {
    activeModals,
    removeModal: (index: number, data: any = null) => {
      const [def] = activeModals.splice(index, 1);
      def.onClose(data);
    },
  };
}

export function useModal<
  C extends DefineComponent<any, any, any, any, any>,
  Props extends PropsType<C>,
  Out
>(component: C) {
  return (props: Props) => {
    return new Promise<Out>((resolve) => {
      activeModals.push({
        component: markRaw(component),
        props,
        id: Date.now() + Math.random(),
        onClose: (data) => resolve(data),
      });
    });
  };
}
