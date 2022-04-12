import { useStore } from "vuex";

const mapMutations = () => {
  const store = useStore();

  return Object.fromEntries(
    Object.keys(store._mutations).map((mutation) => [
      mutation,
      (value) => store.commit(mutation, value),
    ])
  );
};
export { mapMutations };
