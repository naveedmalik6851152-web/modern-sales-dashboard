import { useEffect, useState } from 'react';
import { customersApi } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { COUNTRIES } from '@/data/customers';
import { email, required, useForm } from '@/hooks/useForm';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Overlay';

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  company: '',
  country: 'United States',
  city: '',
  status: 'Active',
  tier: 'Regular',
  notes: '',
};
const RULES = { name: required('Name'), email, country: required('Country') };
const ALL_COUNTRIES = [
  ...new Set([
    ...COUNTRIES,
    'Argentina',
    'Colombia',
    'Indonesia',
    'Kenya',
    'Netherlands',
    'New Zealand',
    'Saudi Arabia',
    'South Africa',
    'Turkey',
  ]),
].sort();

const FORM_ID = 'customer-form';

export function CustomerFormModal({ open, customer, onClose }) {
  const toast = useToast();
  const { values, errors, set, validate, reset } = useForm(EMPTY, RULES);
  const [saving, setSaving] = useState(false);
  const editing = !!customer;

  useEffect(() => {
    if (!open) return;
    reset(
      customer
        ? Object.fromEntries(Object.keys(EMPTY).map((k) => [k, customer[k] ?? EMPTY[k]]))
        : EMPTY,
    );
  }, [open, customer, reset]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]),
    );
    try {
      if (editing) {
        await customersApi.update(customer.id, payload);
        toast.success('Customer updated', { description: payload.name });
      } else {
        await customersApi.create(payload);
        toast.success('Customer added', {
          description: `${payload.name} is now in your customer list.`,
        });
      }
      onClose();
    } catch (err) {
      toast.error('Could not save customer', { description: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit customer' : 'Add customer'}
      description={
        editing
          ? `Update details for ${customer.name}.`
          : 'Create a customer record you can attach orders to.'
      }
      size="lg"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form={FORM_ID} loading={saving}>
            {editing ? 'Save changes' : 'Add customer'}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} noValidate className="grid gap-4 p-6 sm:grid-cols-2">
        <Field label="Full name" required error={errors.name}>
          <Input
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Jane Cooper"
            data-autofocus
            autoComplete="off"
          />
        </Field>
        <Field label="Email" required error={errors.email}>
          <Input
            type="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="jane@company.com"
            autoComplete="off"
          />
        </Field>
        <Field label="Company">
          <Input
            value={values.company}
            onChange={(e) => set('company', e.target.value)}
            placeholder="Acme Inc."
          />
        </Field>
        <Field label="Phone">
          <Input
            type="tel"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="+1 555 010 1234"
          />
        </Field>
        <Field label="Country" required error={errors.country}>
          <Select value={values.country} onChange={(e) => set('country', e.target.value)}>
            {ALL_COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label="City">
          <Input
            value={values.city}
            onChange={(e) => set('city', e.target.value)}
            placeholder="Austin"
          />
        </Field>
        <Field label="Status">
          <Select value={values.status} onChange={(e) => set('status', e.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
          </Select>
        </Field>
        <Field label="Segment">
          <Select value={values.tier} onChange={(e) => set('tier', e.target.value)}>
            <option>Regular</option>
            <option>VIP</option>
            <option>New</option>
          </Select>
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <Textarea
            value={values.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Anything worth remembering about this customer"
          />
        </Field>
      </form>
    </Modal>
  );
}
