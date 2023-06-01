'use client';

import { ChangeEventHandler } from 'react';

interface Props {
  onChangeHandler: ChangeEventHandler;
  currency: string;
  currencyOptions: string[];
}

export default function CurrencySelector({
  onChangeHandler,
  currency,
  currencyOptions,
}: Props) {
  return (
    <select onChange={onChangeHandler} value={currency}>
      {currencyOptions.map((op, index) => (
        <option key={index} value={op}>
          {op}
        </option>
      ))}
    </select>
  );
}
