import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { NumberInput, TextInput, Button, Box, Group, Modal } from '@mantine/core';
import { useState } from 'react';

const schema = Yup.object().shape({
  number: Yup.string()
    .test('format', 'Card number should have 16 digits', val => val.match(/^\d{16}/))
    .required('Card number is required'),
  expiration_date: Yup.string()
    .test('date', 'Invalid date', val => {
      const month = val.slice(0, 2);
      const year = val.slice(3);
      const thisYear = new Date().getFullYear();
      return month <= 12 && month > 0 && year > thisYear - 1 && year < thisYear + 50;
    })
    .test('format', 'Expiration date should have this format 01/2022', val =>
      val.match(/^\d{2}[/]\d{4}/),
    )
    .required('Expiration date is required'),
  cvv: Yup.string()
    .test('format', 'CVV should have 3 digits', val => val.match(/^\d{3}/))
    .required('CVV is required'),
  amount: Yup.number()
    .test('len', "Amount shouldn't be zero", val => val > 0)
    .required('Amount is required'),
});

const initialModalState = {
  opened: false,
  title: '',
  id: '',
  amount: 0,
}

export default function CardForm() {
  const [modal, setModal] = useState(initialModalState);
  const form = useForm({
    schema: yupResolver(schema),
    initialValues: {
      number: '',
      expiration_date: '',
      cvv: '',
      amount: 0,
    },
  });
  const handleSubmit = async values => {
    const res = await fetch('/api/cards', {
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const { id, amount} = await res.json();
    setModal({
      opened: true,
      title: `The data was successfully stored in redis cloud!`,
      id,
      amount,
    });
    form.reset();
  };

  return (
    <form className='form' onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label='Card Number'
        name='number'
        placeholder='4242 4242 4242 4242'
        {...form.getInputProps('number')}
      />
      <TextInput
        label='Expiration date'
        name='expiration_date'
        placeholder='01/2022'
        {...form.getInputProps('expiration_date')}
      />
      <TextInput label='CVV' name='cvv' placeholder='777' {...form.getInputProps('cvv')} />
      <NumberInput
        label='Amount'
        name='amount'
        placeholder='100'
        {...form.getInputProps('amount')}
      />
      <Group position='right' mt='xl'>
        <Button className='submit' type='submit'>Submit</Button>
      </Group>

      <Modal
        opened={modal.opened}
        onClose={() => setModal(initialModalState)}
        title="Grats!"
      >
        <p>{modal.title}</p>
        <p>ID: {modal.id}</p>
        <p>Amount: {modal.amount}</p>

      </Modal>
    </form>
  );
}
