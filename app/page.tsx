'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import CurrencySelector from './currency-selector.component';
import styles from './page.module.css';

const BASE_URL =
  'http://api.exchangeratesapi.io/v1/latest?access_key=d908d4ea225c2abbea8770ee52b52aa2&format=1';

export default function Home() {
  const [currencyOptions, setCurrencyOptions] = useState<string[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [amount, setAmount] = useState<number>(1);
  const [exchangeRate, setExchangeRate] = useState<number>();
  const [totalExchangeAmount, setTotalExchangeAmount] = useState<number>(0);

  useEffect(() => {
    fetch(`${BASE_URL}`)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => {
          setExchangeRate(data.rates[toCurrency]);
        });
    }
  }, [fromCurrency, toCurrency]);

  function onFromChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setFromCurrency(event.target.value);
  }

  function onToChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setToCurrency(event.target.value);
  }
  /* don't type like this, be specific */
  function onAmountChangeHandler(event: any) {
    setAmount(event.target.value);
  }

  function getTotalExchangeAmount() {
    if (amount && exchangeRate) {
      return setTotalExchangeAmount(amount * exchangeRate);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h2>Exchange Rate Calculator App</h2>
        <Image
          src="/favicon.svg"
          alt="App Logo"
          width={100}
          height={100}
          priority
        />
      </div>

      <div className={styles.center}>
        <h4>Put quantity:</h4>
        <input type="number" value={amount} onChange={onAmountChangeHandler} />
      </div>

      <div className={styles.selection}>
        <CurrencySelector
          onChangeHandler={onFromChangeHandler}
          currency={fromCurrency}
          currencyOptions={currencyOptions}
        />
        <span>to</span>
        <CurrencySelector
          onChangeHandler={onToChangeHandler}
          currency={toCurrency}
          currencyOptions={currencyOptions}
        />
        <button onClick={getTotalExchangeAmount}>Convert</button>
      </div>

      <div className={styles.result}>
        <span style={{ marginRight: '2rem' }}>
          Amount: {totalExchangeAmount} - Exchange Rate: {exchangeRate}
        </span>
      </div>
    </main>
  );
}
