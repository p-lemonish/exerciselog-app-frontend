import * as React from 'react';
import { Box, styled } from '@mui/system';
import { Unstable_NumberInput as BaseNumberInput } from '@mui/base/Unstable_NumberInput';

// https://mui.com/base-ui/react-number-input/

const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
  return (
    <BaseNumberInput
      slots={{
        root: InputRoot,
        input: InputElement,
        incrementButton: IncrementButton,
        decrementButton: DecrementButton,
      }}
      slotProps={{
        incrementButton: {
          children: <span className="arrow">+</span>,
          type: 'button',
        },
        decrementButton: {
          children: <span className="arrow">−</span>,
          type: 'button',
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

export default NumberInput;

const InputRoot = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    border: 1px solid ${theme.palette.grey[400]};
    border-radius: 4px;
    background-color: ${theme.palette.background.paper};
    padding: 0 8px;
    max-width: 180px;
    min-width: 80px;
  `
);

const InputElement = styled('input')(
  ({ theme }) => `
    flex: 1 1 auto;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    text-align: center;
    font-size: 1rem;
    padding: 8px 0;
  `
);

const Button = styled('button')(
  ({ theme }) => `
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 4px;
    color: ${theme.palette.text.primary};
  `
);

const IncrementButton = styled(Button)(
  ({ theme }) => `
    order: 2;
  `
);

const DecrementButton = styled(Button)(
  ({ theme }) => `
    order: 0;
  `
);
