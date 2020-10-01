import React, {useState, useRef} from 'react';
import './App.css';
import BUTTONS from './buttonMap';

const BUTTON_LIST = BUTTONS;
const DEFAULT_STATE = {
  firstValue: null,
  currentOperator: null,
  lastClickedOperator: false
}

function App() {

  const [displayValue, setDisplayValue] = useState('0');
  const [state, setState] = useState(DEFAULT_STATE);

  const displayInput = useRef();

  function handleNumberClick(button) {
    if (button.value === '.') {
      if (displayValue.includes('.')) {
        return;
      }
    }

    if (displayValue === '0' || state.lastClickedOperator) {
      setDisplayValue(button.value);
      setState({...state, lastClickedOperator: false});
    } else {
      setDisplayValue(displayValue + button.value);
    }
  }

  function handleOperatorClick(button) {
    if (button.value === 'AC') {
      setState(DEFAULT_STATE);
      setDisplayValue('0');
      return;
    }

    if (button.value === 'C') {
      if (displayValue.length > 1 && displayValue !== '0') {
        setDisplayValue(displayValue.substr(0, displayValue.length - 1));
      } else {
        setDisplayValue('0');
      }
      return;
    }

    if (state.lastClickedOperator) {
      setState({...state, currentOperator: button.value});
      return;
    }

    if (state.currentOperator != null) {
      const newValue = calculate(state.firstValue, Number.parseFloat(displayValue) || 0, state.currentOperator);
      setState({
        ...state,
        firstValue: button.value !== '=' ? newValue : null,
        currentOperator: button.value !== '=' ? button.value :  null,
        lastClickedOperator: button.value !== '='
      })
      setDisplayValue(newValue.toString());
    } else {
      setState({
        ...state,
        firstValue: button.value !== '=' ? Number.parseFloat(displayValue) || 0 : null,
        currentOperator: button.value !== '=' ? button.value : null,
        lastClickedOperator: button.value !== '='
      })
    }
    
  }

  function calculate(value1, value2, operator) {
    showCalculateEffect();
    if (operator === '+') {
      return value1 + value2;
    } else if (operator === '-') {
      return value1 - value2;
    } else if (operator === 'x') {
      return value1 * value2;
    } else if (operator === '/') {
      return value1 / value2;
    }
  }

  function showCalculateEffect() {
    displayInput.current.style.backgroundColor = '#007bff33';
    setTimeout(() => displayInput.current.style.backgroundColor = '', 300);
  }

  function getButtonClasses(button) {
    let classes = 'btn';
    if (button.value === '=') {
      classes += ' btn-primary';
    } else if (button.type === 'OPERATOR') {
      classes += ' btn-secondary';
    } else if (button.type === 'PLACEHOLDER') {
      classes += ' btn-placeholder';
    } else {
      classes += ' btn-default';
    }
    return classes;
  }

  return (
    <div className="calculator-container">
    <input className="form-control calculator-display" type="text" ref={displayInput} value={displayValue} readOnly />
    <div className="button-container">
      {BUTTON_LIST.map(button => (
        <button key={button.value} disabled={button.type === 'PLACEHOLDER'} className={getButtonClasses(button)} onClick={() => (button.type === 'NUMBER' ? handleNumberClick(button) : handleOperatorClick(button))}>{button.value}</button>
      ))}
    </div>
    </div>
  );
}

export default App;
