// @ts-ignore: Deno import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore: Deno NPM import
import nodemailer from "npm:nodemailer@6.9.13";
// @ts-ignore: Deno NPM import
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

// @ts-ignore: Deno global
const GMAIL_EMAIL = Deno.env.get("GMAIL_EMAIL");
// @ts-ignore: Deno global
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");
// @ts-ignore: Deno global
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
// @ts-ignore: Deno global
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
    to?: string;
    subject?: string;
    html?: string;
    fromName?: string;

    // Webhook Payload properties
    type?: string;
    table?: string;
    record?: any;
    old_record?: any;
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

        const payload: EmailRequest = await req.json();

        let to = payload.to;
        let subject = payload.subject;
        let html = payload.html;
        const fromName = payload.fromName || "Gym Admin";

        // ==========================================
        // 1. HANDLE DATABASE WEBHOOKS (AUTOMATION)
        // ==========================================
        if (payload.type && payload.table) {
            console.log(`[Webhook Details] Processing ${payload.type} for table ${payload.table}`);

            // Initialize Supabase Admin Client to fetch user email
            if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
                throw new Error("Missing Supabase configuration to fetch user email.");
            }
            const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

            // A) Members Table Webhooks
            if (payload.table === 'members') {
                const member = payload.record;
                const oldMember = payload.old_record || {};

                // Fetch the user's email profile
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('email, full_name')
                    .eq('id', member.user_id)
                    .single();

                if (error || !profile?.email) {
                    throw new Error(`Could not find email for user_id: ${member.user_id}`);
                }

                to = profile.email;
                const name = profile.full_name || 'Valued Member';

                // INSERT: New Member Welcome Email
                if (payload.type === 'INSERT') {
                    subject = "Welcome to the Gym! Let's hit your goals.";
                    html = `
                        <h2>Welcome to the Gym, ${name}!</h2>
                        <p>We are thrilled to have you join us. Your <strong>${member.membership_plan}</strong> membership is now active.</p>
                        <p>Please log in to your portal to start booking classes and tracking your progress.</p>
                        <br/><p>Best,<br/>Your Gym Team</p>
                    `;
                }
                // UPDATE: Expired or Churn Risk Emails
                else if (payload.type === 'UPDATE') {
                    if (member.status === 'expired' && oldMember.status !== 'expired') {
                        subject = "Action Required: Your Gym Membership Expired";
                        html = `
                            <h2>Hey ${name},</h2>
                            <p>Your gym membership has officially expired as of today.</p>
                            <p>To avoid losing access to our facilities, please log in to your account and renew your plan.</p>
                            <br/><p>Best,<br/>Your Gym Team</p>
                        `;
                    } else if (member.churn_risk === true && oldMember.churn_risk === false) {
                        subject = "We miss you at the Gym! Here is 10% off.";
                        html = `
                            <h2>Hey ${name},</h2>
                            <p>We noticed you haven't been checking in lately! Staying consistent is the hardest part of fitness, but you've already taken the first step by joining.</p>
                            <p>To help you get back into the rhythm, we've added a <strong>10% discount</strong> to your next billing cycle.</p>
                            <br/><p>Best,<br/>Your Gym Admin Team</p>
                        `;
                    } else {
                        // Not an update we care about sending an email for
                        console.log("Update did not trigger any email logic.");
                        return new Response(JSON.stringify({ success: true, message: "Ignored update." }), {
                            headers: { ...corsHeaders, "Content-Type": "application/json" }
                        });
                    }
                }
            }
            // B) Invoices Table Webhooks
            else if (payload.table === 'invoices') {
                if (payload.type === 'INSERT') {
                    const invoice = payload.record;
                    // We need to trace invoice -> payment -> member -> profile to get email
                    const { data: payData } = await supabase.from('payments').select('member_id').eq('id', invoice.payment_id).single();
                    if (payData?.member_id) {
                        const { data: memData } = await supabase.from('members').select('user_id').eq('id', payData.member_id).single();
                        if (memData?.user_id) {
                            const { data: profData } = await supabase.from('profiles').select('email, full_name').eq('id', memData.user_id).single();

                            if (profData?.email) {
                                to = profData.email;
                                subject = `Gym Invoice Generated: ${invoice.invoice_number}`;
                                html = `
                                    <h2>Hello ${profData.full_name || 'Member'},</h2>
                                    <p>Your invoice <strong>${invoice.invoice_number}</strong> has been generated for a total of <strong>$${invoice.amount}</strong>.</p>
                                    <p>Thank you for your payment!</p>
                                    <br/><p>Best,<br/>Your Gym Admin Team</p>
                                `;
                            }
                        }
                    }
                    if (!to) throw new Error("Could not trace email for invoice.");
                }
            }
        }

        // ==========================================
        // 2. DISPATCH EMAIL
        // ==========================================
        if (!to || !subject || !html) {
            throw new Error("Missing 'to', 'subject', or 'html' in payload logic.");
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: GMAIL_EMAIL,
                pass: GMAIL_APP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const info = await transporter.sendMail({
            from: `"${fromName}" <${GMAIL_EMAIL}>`,
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
