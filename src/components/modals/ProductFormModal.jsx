import { useEffect, useState } from 'react';
import { productsApi } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { CATEGORIES } from '@/data/products';
import { required, useForm } from '@/hooks/useForm';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Overlay';

const EMPTY = { name: '', category: CATEGORIES[0], price: '', stock: '', description: '' };
const RULES = {
  name: required('Product name'),
  price: (v) => (Number(v) > 0 ? undefined : 'Enter a price greater than 0'),
  stock: (v) =>
    v !== '' && Number.isInteger(Number(v)) && Number(v) >= 0
      ? undefined
      : 'Enter a whole number, 0 or more',
};
const FORM_ID = 'product-form';

export function ProductFormModal({ open, product, onClose }) {
  const toast = useToast();
  const { values, errors, set, validate, reset } = useForm(EMPTY, RULES);
  const [saving, setSaving] = useState(false);
  const editing = !!product;

  useEffect(() => {
    if (!open) return;
    reset(
      product
        ? {
            name: product.name,
            category: product.category,
            price: String(product.price),
            stock: String(product.stock),
            description: product.description ?? '',
          }
        : EMPTY,
    );
  }, [open, product, reset]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      name: values.name.trim(),
      category: values.category,
      price: Number(values.price),
      stock: Number(values.stock),
      description: values.description.trim(),
    };
    try {
      if (editing) {
        await productsApi.update(product.id, payload);
        toast.success('Product updated', { description: payload.name });
      } else {
        await productsApi.create(payload);
        toast.success('Product added', { description: `${payload.name} is now in your catalog.` });
      }
      onClose();
    } catch (err) {
      toast.error('Could not save product', { description: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit product' : 'Add product'}
      description={editing ? `Update ${product.name}.` : 'Add a product to your catalog.'}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form={FORM_ID} loading={saving}>
            {editing ? 'Save changes' : 'Add product'}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} noValidate className="grid gap-4 p-6 sm:grid-cols-2">
        <Field label="Product name" required error={errors.name} className="sm:col-span-2">
          <Input
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Aurora Studio Headphones"
            data-autofocus
            autoComplete="off"
          />
        </Field>
        <Field label="Category">
          <Select value={values.category} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label="Price (USD)" required error={errors.price}>
          <Input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={values.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="99.00"
          />
        </Field>
        <Field
          label="Units in stock"
          required
          error={errors.stock}
          hint="Products at 20 units or fewer show as low stock."
        >
          <Input
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={values.stock}
            onChange={(e) => set('stock', e.target.value)}
            placeholder="120"
          />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <Textarea
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="A short description for your team"
          />
        </Field>
      </form>
    </Modal>
  );
}
