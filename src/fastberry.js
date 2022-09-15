/* Core */
const ErrorMessage = {
  field: true,
  text: true,
  type: true,
};
const Error = {
  error: true,
  meta: true,
  messages: ErrorMessage,
};

/* ON-ERROR */
export const onError = Error;

/* Edges (aka: "Pages")
  { Connections & PageInfo }
*/
export const PageInfo = {
  extra: true,
  length: true,
  pages: true,
};
export const Edges = ({
  manager = null,
  model = null,
  maxDepth = -1,
} = {}) => ({
  edges: {
    node: manager.get(model, maxDepth),
    cursor: true,
  },
  pageInfo: PageInfo,
});
