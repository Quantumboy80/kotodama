import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

const token =
  process.env.UPLOADTHING_TOKEN ||
  "eyJhcGlLZXkiOiJza19saXZlX2FkOWE4ZmIyOTI5YTNjYjM2Y2Y3MjRjMzA0YmFhMmE2M2U5ZGZjNWUwYzE4M2M2OGU3OTdhNTU3NmEyMDlkMTIiLCJhcHBJZCI6Ijd3eWRzMWQxdHUiLCJyZWdpb25zIjpbInNlYTEiXX0=";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token,
  },
});
