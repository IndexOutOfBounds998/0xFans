import { ComponentPropsWithRef, forwardRef, useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';

type SwitchProps = ComponentPropsWithRef<'switch'> & {
  checked?: boolean;
  onChange: (val: boolean) => void;
};

// eslint-disable-next-line react/display-name
export const ReactSwitch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onChange, disabled, children, ...rest }, ref) => {
    useEffect(() => {
      console.log(checked);
    }, [checked]);

    return (
      <div className='flex items-center'>
        <Switch
          checked={checked}
          onChange={(val) => onChange(val)}
          {...rest}
          disabled={disabled}
          ref={ref}
          className={`${className} ${checked ? 'bg-teal-900' : 'bg-teal-700'}
                    relative inline-flex h-[20px] w-[40px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span
            aria-hidden='true'
            className={`${checked ? 'translate-x-5' : 'translate-x-0'}
                        pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
        {children}
      </div>
    );
  }
);
