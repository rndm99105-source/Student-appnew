// Follow this setup guide to deploy: https://supabase.com/docs/guides/functions/deploy
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

declare const Deno: any;

const clients = new Map<string, WebSocket>();

serve((req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");

  if (!userId) {
     console.error("Connection rejected: No user_id provided");
     return new Response("User ID required", { status: 400 });
  }

  // Cast Deno to any to resolve TypeScript error in some environments
  const { socket, response } = (Deno as any).upgradeWebSocket(req);

  socket.onopen = () => {
    clients.set(userId, socket);
    console.log(`User connected: ${userId}`);
  };

  socket.onmessage = (e) => {
    try {
        const data = JSON.parse(e.data);
        const { type, payload, receiver_id } = data;

        // Routing logic
        if (receiver_id) {
            const receiverSocket = clients.get(receiver_id);
            if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
                receiverSocket.send(JSON.stringify(data));
                console.log(`Message routed from ${userId} to ${receiver_id}`);
            } else {
                console.log(`User ${receiver_id} is offline or not connected.`);
            }
        }
    } catch (err) {
        console.error("Error processing message:", err);
    }
  };

  socket.onclose = () => {
    if (clients.get(userId) === socket) {
        clients.delete(userId);
        console.log(`User disconnected: ${userId}`);
    }
  };

  socket.onerror = (e) => {
    console.error(`WebSocket error for ${userId}:`, e);
  };

  return response;
});