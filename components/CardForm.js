export default function CardForm() {
  const handleSubmit = async e => {
    e.preventDefault();

    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());
    console.log('🚀 ~ formData', formData);
		formData.amount = Number(formData.amount)
    const res = await fetch('/api/cards', {
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const result = await res.json();
    console.log('🚀 ~  result', result);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type='text' name='number' />
      <input type='text' name='expiration_date' />
      <input type='text' name='cvv' />
      <input type='number' name='amount' />

      <button type='submit' >Submit</button>
    </form>
  );
}
