import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("chat", "routes/chat._index.tsx"),
  route("chat/:conversationId", "routes/chat.$conversationId.tsx"),
] satisfies RouteConfig;
