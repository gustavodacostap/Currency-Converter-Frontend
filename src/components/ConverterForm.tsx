"use client";

import Select from "react-select";
import { useState } from "react";
import { convertCurrency } from "../lib/api";
import { useEffect } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { GroupBase, StylesConfig } from "react-select";

const currencies = [
  { code: "BRL", name: "Real Brasileiro" },
  { code: "USD", name: "Dólar Americano" },
  { code: "EUR", name: "Euro" },
  { code: "JPY", name: "Iene Japonês" },
  { code: "BGN", name: "Lev Búlgaro" },
  { code: "CZK", name: "Coroa Tcheca" },
  { code: "DKK", name: "Coroa Dinamarquesa" },
  { code: "GBP", name: "Libra Esterlina" },
  { code: "HUF", name: "Florim Húngaro" },
  { code: "PLN", name: "Zloti Polonês" },
  { code: "RON", name: "Leu Romeno" },
  { code: "SEK", name: "Coroa Sueca" },
  { code: "CHF", name: "Franco Suíço" },
  { code: "ISK", name: "Coroa Islandesa" },
  { code: "NOK", name: "Coroa Norueguesa" },
  { code: "HRK", name: "Kuna Croata" },
  { code: "RUB", name: "Rublo Russo" },
  { code: "TRY", name: "Lira Turca" },
  { code: "AUD", name: "Dólar Australiano" },
  { code: "CAD", name: "Dólar Canadense" },
  { code: "CNY", name: "Yuan Chinês" },
  { code: "HKD", name: "Dólar de Hong Kong" },
  { code: "IDR", name: "Rupia Indonésia" },
  { code: "ILS", name: "Shekel Novo Israelense" },
  { code: "INR", name: "Rúpia Indiana" },
  { code: "KRW", name: "Won Sul-Coreano" },
  { code: "MXN", name: "Peso Mexicano" },
  { code: "MYR", name: "Ringgit Malaio" },
  { code: "NZD", name: "Dólar Neozelandês" },
  { code: "PHP", name: "Peso Filipino" },
  { code: "SGD", name: "Dólar de Singapura" },
  { code: "THB", name: "Baht Tailandês" },
  { code: "ZAR", name: "Rand Sul-Africano" },
];

export default function ConverterForm() {
  const [inputAmount, setInputAmount] = useState<number>(0);
  const [fromCurrency, setFromCurrency] = useState("BRL");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState<number>(0); // Armazena o valor usado na última conversão
  const [displayAmount, setDisplayAmount] = useState(fromCurrency); // valor exibido no input
  const [rate, setRate] = useState<number>(0);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [convertedFromCurrency, setConvertedFromCurrency] =
    useState(fromCurrency);
  const [convertedToCurrency, setConvertedToCurrency] = useState(toCurrency);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const formatted = inputAmount.toLocaleString("pt-BR", {
      style: "currency",
      currency: fromCurrency,
    });
    setDisplayAmount(formatted);

    // Limpa resultados anteriores
    setResult(null);
    setRate(0);
    setConvertedFromCurrency(fromCurrency);
    setConvertedToCurrency(toCurrency);
  }, [fromCurrency]);

  async function handleConvert() {
    if (inputAmount <= 0) {
      setError("Digite um valor válido");
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await convertCurrency(fromCurrency, toCurrency, inputAmount);
      setResult(data.result);
      setRate(data.rate);
      setConvertedFromCurrency(fromCurrency);
      setConvertedToCurrency(toCurrency);
      setAmount(inputAmount); // Só atualiza `amount` depois da conversão
    } catch {
      setError("Falha ao obter conversão");
    } finally {
      setLoading(false);
    }
  }

  function formatAndStyleAmountBR(value: number) {
    const formatted = value.toFixed(6).replace(".", ","); // Ex: 3,141593
    const [int, decimal] = formatted.split(",");

    const firstTwo = decimal.slice(0, 2); // Ex: "14"
    const rest = decimal.slice(2); // Ex: "1593"

    return (
      <>
        {parseInt(int).toLocaleString("pt-BR")},{firstTwo}
        <span className="text-gray-500">{rest}</span>
      </>
    );
  }

  function formatAmountOnlyTwo(value: number) {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatResultWithStyledDecimals(value: number) {
    const fixed = value.toFixed(6).replace(".", ","); // Ex: "18,044382"
    const [intPartStr, decimalPart] = fixed.split(",");

    const intPart = parseInt(intPartStr.replace(/\./g, ""));
    const formattedInt = parseInt(intPartStr).toLocaleString("pt-BR");

    // Regra para definir quantas casas cinzas
    let grayDigits = 4;
    if (intPart >= 10000) grayDigits = 0;
    else if (intPart >= 1000) grayDigits = 1;
    else if (intPart >= 100) grayDigits = 2;
    else if (intPart >= 10) grayDigits = 3;
    else grayDigits = 4;

    const visibleDecimals = decimalPart.slice(0, 2);
    const grayDecimals = decimalPart.slice(2, 2 + grayDigits);

    return (
      <>
        {formattedInt},{visibleDecimals}
        {grayDecimals && <span className="text-gray-500">{grayDecimals}</span>}
      </>
    );
  }

  const currencyOptions = currencies.map((c) => ({
    value: c.code,
    label: `${c.code} - ${c.name}`,
  }));

  type CurrencyOption = {
    value: string;
    label: string;
  };

  const customStyles: StylesConfig<
    CurrencyOption,
    false,
    GroupBase<CurrencyOption>
  > = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#155DFC" : "#D1D5DB",
      boxShadow: state.isFocused ? "0 0 0 1px #155DFC" : "none",
      cursor: "pointer",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#E0ECFF" : "white",
      color: "black",
      "&:active": {
        backgroundColor: "#E0ECFF",
      },
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#111827",
    }),
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleConvert();
      }}
      className="bg-white p-6 rounded shadow space-y-4 w-full max-w-[450px] md:w-auto md:max-w-none"
    >
      <div className="flex flex-col flex-wrap gap-4 items-stretch">
        <div className="flex flex-col flex-1">
          <label htmlFor="amount">Valor</label>
          <input
            type="text"
            id="amount"
            className="h-10 border border-gray-300 rounded px-3 py-2 w-full focus:border-blue-600 focus:border-2 focus:outline-none"
            value={displayAmount}
            onChange={(e) => {
              const raw = e.target.value
                .replace(/[^\d.,]/g, "")
                .replace(",", ".");
              const parsed = parseFloat(raw);

              // Verifica se o número é grande demais
              const digitsOnly = raw.replace(".", "").replace(/^0+/, ""); // remove ponto e zeros à esquerda
              const maxDigits = 15;

              setDisplayAmount(e.target.value);

              if (digitsOnly.length > maxDigits) {
                setInputAmount(0);
                setResult(null);
                setError("Muitos dígitos! Tente com um número menor.");
                return;
              }

              if (!isNaN(parsed)) {
                setInputAmount(parsed);
                setError(null);

                if (rate > 0) {
                  setResult(parsed * rate);
                  setAmount(parsed);
                  setConvertedFromCurrency(fromCurrency);
                  setConvertedToCurrency(toCurrency);
                }
              } else {
                setInputAmount(0);
                setResult(null);
                setError("Digite um valor válido");
              }
            }}
            onBlur={() => {
              const formatted = inputAmount.toLocaleString("pt-BR", {
                style: "currency",
                currency: fromCurrency,
              });
              setDisplayAmount(formatted);
            }}
            onFocus={() => {
              if (inputAmount === 0) {
                setDisplayAmount("");
              } else {
                setDisplayAmount(inputAmount.toString());
              }
            }}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col">
            <label htmlFor="amount">De</label>
            {hasMounted && (
              <Select
                id="fromCurrency"
                className="w-full"
                options={currencyOptions}
                value={currencyOptions.find(
                  (option) => option.value === fromCurrency
                )}
                onChange={(option) => setFromCurrency(option?.value || "")}
                styles={customStyles}
              />
            )}
          </div>

          <div className="flex items-end md:self-end">
            <button
              aria-label="Inverter moedas"
              title="Inverter moedas"
              className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 text-white w-10 h-10 flex items-center justify-center cursor-pointer"
              onClick={() => {
                setFromCurrency(toCurrency);
                setToCurrency(fromCurrency);
              }}
            >
              <FaExchangeAlt />
            </button>
          </div>

          <div className="flex flex-col">
            <label htmlFor="amount">Para</label>
            {hasMounted && (
              <Select
                id="toCurrency"
                className="w-full"
                options={currencyOptions}
                value={currencyOptions.find(
                  (option) => option.value === toCurrency
                )}
                onChange={(option) => setToCurrency(option?.value || "")}
                styles={customStyles}
              />
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleConvert}
        disabled={loading}
        className="w-40 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Convertendo..." : "Converter"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 space-y-2">
          <p className="text-lg font-semibold">
            {formatAmountOnlyTwo(amount)} {convertedFromCurrency} =
          </p>
          <p className="text-xl font-bold">
            {formatResultWithStyledDecimals(result)} {convertedToCurrency}
          </p>
          <p>
            1 {convertedFromCurrency} = {formatAndStyleAmountBR(rate)}{" "}
            {convertedToCurrency}
          </p>
          <p>
            1 {convertedToCurrency} = {formatAndStyleAmountBR(1 / rate)}{" "}
            {convertedFromCurrency}
          </p>
        </div>
      )}
    </form>
  );
}
