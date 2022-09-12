import Forms from "./src/forms";
import Types from "./src/types";
import { onError, Edges, PageInfo } from "./src/fastberry";

export default function Controller({
  chain = null,
  types = {},
  forms = [],
  max_depth = 3,
}) {
  const all_types = Types({
    types: types,
    max_depth: max_depth,
  });
  all_types.onError = onError;
  all_types.edges = (model, max_depth) =>
    Edges({
      manager: all_types,
      model: model,
      max_depth: max_depth,
    });
  all_types.pageInfo = PageInfo;
  return {
    chain: chain,
    form: Forms(forms),
    type: all_types,
  };
}
