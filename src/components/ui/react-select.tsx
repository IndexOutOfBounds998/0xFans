import {
  ComponentPropsWithRef,
  forwardRef,
  useEffect,
  useState,
  Fragment
} from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';

type SelectProps = ComponentPropsWithRef<'select'> & {
  value?: { name: string };
  list: any[];
  onChange: (val: any) => void;
};

// eslint-disable-next-line react/display-name
export const ReactSelect = forwardRef<HTMLButtonElement, SelectProps>(
  ({ className, value, onChange, list, disabled, children, ...rest }, ref) => {
    return (
      <div className=''>
        <Listbox value={value} onChange={(val) => onChange(val)}>
          <div className='relative mt-1'>
            <Listbox.Button className='relative w-full cursor-default rounded-lg border border-inherit bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none sm:text-sm'>
              <span className='block truncate'>{value?.name}</span>
              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                <ChevronUpDownIcon
                  className='h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                {list.map((item, personIdx) => (
                  <Listbox.Option
                    key={personIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? 'bg-main-accent/10 text-main-accent/90'
                          : 'text-gray-900'
                      }`
                    }
                    value={item}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {item.name}
                        </span>
                        {selected ? (
                          <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                            <CheckIcon
                              className='h-5 w-5 text-main-accent'
                              aria-hidden='true'
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    );
  }
);
