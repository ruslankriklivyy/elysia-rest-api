import { t } from "elysia";

export default t.Object({
  name: t.String(),
  description: t.Optional(t.String()),
  end_date: t.String(),
});
