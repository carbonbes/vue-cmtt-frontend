import { useStore } from "vuex";

const mapActions = () => {
  const store = useStore();

  return Object.fromEntries(
    Object.keys(store._actions).map((action) => [
      action,
      (value) => store.dispatch(action, value),
    ])
  );
};

export { mapActions };
