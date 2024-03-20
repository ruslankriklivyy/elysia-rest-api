import { t } from "elysia";

export default t.Object({
  name: t.String(),
  members_ids: t.Array(t.Number()),
});
