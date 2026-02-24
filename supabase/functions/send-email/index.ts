import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
    to: string;
    subject: string;
    html: string;
    fromName?: string;
    fromEmail?: string;
}

serve(async (req) => {
    // Handle CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        if (!RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is not set in Edge Function secrets.");
        }

        const { to, subject, html, fromName = "Gym Admin", fromEmail = "admin@smartgym.com" }: EmailRequest = await req.json();

        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: `${fromName} <${fromEmail}>`,
                to: [to],
                subject: subject,
                html: html,
            }),
        });

        if (res.ok) {
            const data = await res.json();
            return new Response(JSON.stringify({ success: true, data }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        } else {
            const errorData = await res.text();
            console.error("Resend API Error:", errorData);
            return new Response(JSON.stringify({ success: false, error: errorData }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
            });
        }
    } catch (error: any) {
        console.error("Edge Function Error:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
