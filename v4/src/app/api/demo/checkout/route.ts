type DemoCartItem = {
  id?: unknown;
  name?: unknown;
  quantity?: unknown;
  unitPrice?: unknown;
};

const formatter = new Intl.NumberFormat("de-CH", {
  style: "currency",
  currency: "CHF",
});

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { items?: DemoCartItem[] } | null;
  const items = Array.isArray(body?.items) ? body.items.slice(0, 20) : [];

  const normalized = items.flatMap((item) => {
    const id = typeof item.id === "string" ? item.id.slice(0, 80) : "";
    const name = typeof item.name === "string" ? item.name.slice(0, 120) : "";
    const quantity = Math.min(20, Math.max(1, Number(item.quantity) || 1));
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
    return id && name ? [{ id, name, quantity, unitPrice }] : [];
  });

  if (!normalized.length) {
    return Response.json({ message: "Add at least one demo item before checkout." }, { status: 400 });
  }

  const subtotal = normalized.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = subtotal >= 60 ? 0 : 6.9;
  const total = subtotal + shipping;
  const reference = `DEMO-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return Response.json({
    demo: true,
    paymentCollected: false,
    order: {
      reference,
      itemCount: normalized.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      shipping,
      total,
      totalFormatted: formatter.format(total),
      status: "simulated",
    },
  });
}
