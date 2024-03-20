import { t } from "elysia";

export default t.Object({
  name: t.Optional(t.String()),
  members_ids: t.Optional(t.Array(t.Number())),
});
