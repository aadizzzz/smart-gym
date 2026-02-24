import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.13";

const GMAIL_EMAIL = Deno.env.get("GMAIL_EMAIL");
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");

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
        if (!GMAIL_EMAIL || !GMAIL_APP_PASSWORD) {
            throw new Error("GMAIL_EMAIL or GMAIL_APP_PASSWORD is not set in Edge Function secrets.");
        }

        const { to, subject, html, fromName = "Gym Admin" }: EmailRequest = await req.json();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: GMAIL_EMAIL,
                pass: GMAIL_APP_PASSWORD,
            },
            // Important for some environments to prevent TLS issues
            tls: {
                rejectUnauthorized: false
            }
        });

        const info = await transporter.sendMail({
            from: `"${fromName}" <${GMAIL_EMAIL}>`, // Must send from the authenticated Gmail
            to: to,
            subject: subject,
            html: html,
        });

        console.log("Message sent: %s", info.messageId);

        return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error: any) {
        console.error("Edge Function Error:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
