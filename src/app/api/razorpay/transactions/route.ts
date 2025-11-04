import Razorpay from "razorpay";

// 🔹 Define proper types for Razorpay responses
type RazorpayPayment = {
  id: string;
  amount: number;
  amount_refunded: number;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  email?: string;
  contact?: string;
  method?: string;
  created_at: number;
};

type RazorpayPaymentsResponse = {
  entity: string;
  count: number;
  items: RazorpayPayment[];
};

export async function GET() {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_SECRET!,
    });

    // 🔹 Fetch the latest 100 payments
    const payments = (await razorpay.payments.all({
      count: 100,
    })) as RazorpayPaymentsResponse;

    // 🔹 Calculate totals
    let totalIncome = 0;
    const totalOutcome = 0;

    payments.items.forEach((p) => {
      if (p.status === "captured") totalIncome += p.amount / 100; // paise → rupees
    });

    const totalBalance = totalIncome - totalOutcome;

    // 🔹 Format transactions
    const transactions = payments.items.map((t) => ({
      id: t.id,
      email: t.email || "N/A",
      contact: t.contact || "N/A",
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
  } catch (err: unknown) {
    console.error("Error fetching transactions:", err);
    return Response.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
