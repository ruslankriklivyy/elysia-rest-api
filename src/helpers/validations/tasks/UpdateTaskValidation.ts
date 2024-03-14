import { t } from "elysia";

export default t.Object({
  name: t.Optional(t.String()),
  description: t.Optional(t.String()),
  end_date: t.Optional(t.String()),
});
