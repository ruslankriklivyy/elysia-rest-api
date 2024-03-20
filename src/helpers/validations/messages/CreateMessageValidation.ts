import { t } from "elysia";

export default t.Object({
  body: t.String(),
  chat_id: t.Number(),
  files: t.Array(t.Number()),
});
