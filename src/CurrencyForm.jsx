import React, { useState, useEffect } from "react";
import CurrencyInput from "./CurencyInput";
import valueDisplayConvert from "./currencyFormatter";

const CurrencyForm = () => {
  const [value, setValue] = useState(0);
  const [currencies, setCurrencies] = useState({});
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [convertToCurrency, setConvertToCurrency] = useState("GBP");
  const [rates, setRates] = useState({});
  const [result, setResult] = useState(0);
  const [decimals, setDecimals] = useState(2);

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json"
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setCurrencies(res);
      });

    callAPI(baseCurrency);
  }, []);

  const changeBaseCurrency = (e) => {
    setBaseCurrency(e.target.value);
    callAPI(e.target.value);
  };

  const callAPI = (base) => {
    const api = `https://api.exchangeratesapi.io/latest?base=${base}`;
    fetch(api)
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        setRates(data["rates"]);
      });
  };

  const changeConvertToCurrency = (e) => {
    setConvertToCurrency(e.target.value);
  };

  const getConvertedCurrency = (baseAmount, convertToCurrency, rates) => {
    if (rates[convertToCurrency]) {
      return Number.parseFloat(baseAmount * rates[convertToCurrency]).toFixed(
        2
      );
    }
  };

  const handleValueChange = (val) => {
    setValue(val);
  };

  const currencyChoice = Object.keys(currencies).length
    ? Object.keys(currencies).map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))
    : [];

  useEffect(() => {
    if (Object.keys(rates).length) {
      updateResult();
    }
  }, [value, rates, baseCurrency, convertToCurrency]);

  const updateResult = () => {
    const val = value / Math.pow(10, decimals);
    setResult(getConvertedCurrency(val, convertToCurrency, rates));
  };

  return (
    <div className="form-container">
      <form>
        <h3>Convert from: {baseCurrency}</h3>
        <select value={baseCurrency} onChange={changeBaseCurrency}>
          {currencyChoice}
          <option>{baseCurrency}</option>
        </select>

        <h3>Convert to: {convertToCurrency}</h3>
        <select value={convertToCurrency} onChange={changeConvertToCurrency}>
          {currencyChoice}
        </select>

        <h3>Amount:</h3>

        {Object.keys(currencies).length && (
          <CurrencyInput
            max={100000000}
            currency={baseCurrency}
            decimals={decimals}
            onValueChange={handleValueChange}
            style={{ textAlign: "right" }}
            value={value}
          />
        )}
      </form>
      <h2 id="result-text">
        {valueDisplayConvert(value, decimals, baseCurrency)} {baseCurrency} is
        equal to {result} {convertToCurrency}
      </h2>
    </div>
  );
};

export default CurrencyForm;
