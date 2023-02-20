function InvoiceItems({ item }) {
  return (
    <tr>
      <td>{item.item}</td>
      <td>{item.quantity}</td>
      <td>{item.price}</td>
      <td>{item.price * item.quantity}</td>
    </tr>
  );
}

export default InvoiceItems;
