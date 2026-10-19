import { createFileRoute } from "@tanstack/react-router";
import { AdminOutlet } from "@/components/AdminChrome";

export const Route = createFileRoute("/admin")({ component: AdminOutlet });
