import { createLiveHandler } from "../../../features/live/server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const handle = createLiveHandler();
export const GET = handle;
export const POST = handle;
