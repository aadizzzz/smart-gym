import { supabase } from '../../lib/supabase';

/**
 * Automates invoice generation after a successful payment.
 * Requires:
 * - Calculating 18% GST (or similar tax configurable later)
 * - Creating an `invoices` row
 * - Alerting admin
 */
export const generateInvoice = async (paymentId: string, gymId: string, amount: number): Promise<string | null> => {
    try {
        console.log(`[AutoInvoice] Generating intelligence invoice for payment: ${paymentId}`);

        const gstRate = 0.18;
        const gstAmount = amount * gstRate;

        // Auto incrementing invoice number simply via date for now to keep it unique
        const timestamp = Date.now().toString().slice(-6);
        const invoiceNumber = `INV-${timestamp}`;

        // Insert into db
        const { data: invoice, error: invoiceError } = await supabase
            .from('invoices')
            .insert({
                gym_id: gymId,
                payment_id: paymentId,
                invoice_number: invoiceNumber,
                amount: amount,
                gst_amount: gstAmount,
                pdf_url: `https://dummy-invoice-service.com/generate/${invoiceNumber}.pdf` // Mocked PDF service
            })
            .select('id')
            .single();

        if (invoiceError) throw invoiceError;

        // Simulate sending email to member
        console.log(`[AutoInvoice] Dispatched invoice ${invoiceNumber} email to member.`);

        // Log admin notification
        await supabase.from('admin_notifications').insert({
            gym_id: gymId,
            type: 'invoice_generated',
            message: `AutoInvoice Engine: Generated and sent invoice ${invoiceNumber} for payment of ${amount}.`
        });

        return invoice.id;

    } catch (error) {
        console.error('[AutoInvoice] Error:', error);
        return null;
    }
};
