import Razorpay from "razorpay";

export async function GET() {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    // Fetch the latest 100 payments
    const payments = await razorpay.payments.all({ count: 100 });

    // Calculate totals
    let totalIncome = 0;
    let totalOutcome = 0; // (if needed for refunds or manual payouts)
    payments.items.forEach((p) => {
      if (p.status === "captured") totalIncome += p.amount / 100; // Razorpay amount is in paise
    });

    const totalBalance = totalIncome - totalOutcome;

    // Format transactions
    const transactions = payments.items.map((t) => ({
      id: t.id,
      email: t.email,
      contact: t.contact,
      amount: `₹${(t.amount / 100).toFixed(2)}`,
      status: t.status,
      method: t.method || "N/A",
      created_at: new Date(t.created_at * 1000).toLocaleString(),
    }));

    return Response.json({
      success: true,
      totalBalance,
      totalIncome,
      totalOutcome,
      transactions,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
