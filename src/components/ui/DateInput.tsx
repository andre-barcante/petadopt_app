import React, { useState } from 'react';
import { Input } from './Input';

type Props = {
  label: string;
  value: string;
  onChangeDate: (isoDate: string) => void;
  error?: string;
};

const isoToDisplay = (iso: string): string => {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
};

export function DateInput({ label, value, onChangeDate, error }: Props) {
  const [text, setText] = useState(isoToDisplay(value));

  const handleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    setText(formatted);
    if (digits.length === 8) {
      onChangeDate(`${digits.slice(4)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`);
    } else {
      onChangeDate('');
    }
  };

  return (
    <Input
      label={label}
      value={text}
      onChangeText={handleChange}
      placeholder="DD/MM/AAAA"
      keyboardType="numeric"
      error={error}
    />
  );
}
