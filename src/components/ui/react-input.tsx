import {
  ComponentPropsWithRef,
  forwardRef,
  useEffect,
  useState,
  Fragment
} from 'react';

type InputProps = ComponentPropsWithRef<'select'> & {
  value?: string | number;
  type: string | 'text';
  defaultValue?: string | number;
  onChange: (val: any) => void;
};

// eslint-disable-next-line react/display-name
export const ReactInput = forwardRef<HTMLButtonElement, InputProps>(
  (
    {
      className,
      value,
      type,
      defaultValue,
      onChange,
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <div className=''>
        <input
          className='relative w-full cursor-default rounded-lg border border-inherit bg-white py-2 pl-3 pr-2 text-left shadow-md focus:outline-none sm:text-sm'
          defaultValue={defaultValue}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          value={value}
        />
      </div>
    );
  }
);
