export async function POST(request) {
    try {
        const { amount, orderId } = await request.json();

        // Create a payment using Rupay.js
        const paymentResponse = await createPayment({
            amount, // Amount in cents (e.g., 1000 for $10)
            orderId, // Your unique order ID
            // Add other relevant parameters (e.g., currency, description, etc.)
        });
        return NextResponse.json(
            paymentResponse,
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
