import type { FunctionComponent, SVGProps } from 'react';
import type { AnyFunction, MaybeString } from 'types';

export interface StatusBarProps {
  helpKey?: MaybeString;
  help?: {
    helpKey: string;
    handleHelp: (key: string) => void;
  };
  inProgress: boolean;
  text: string;
  StatusBarIcon: FunctionComponent<SVGProps<SVGSVGElement>>;
  handleCancel?: () => void;
  handleDone?: () => void;
  t: {
    tDone: string;
    tCancel: string;
  };
}

export interface HeadingProps {
  connectTo?: string;
  disabled?: boolean;
  handleReset?: () => void;
  Icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  title: string;
}

export interface AddressProps {
  address: string;
  index: number;
  initial: string;
  badgePrefix: string;
  disableEditIfImported?: boolean;
  renameHandler: AnyFunction;
  existsHandler: AnyFunction;
  addHandler: AnyFunction;
  removeHandler: AnyFunction;
  getHandler: AnyFunction;
}

export interface ConfirmProps {
  address: string;
  index: number;
  addHandler: AnyFunction;
}

export interface RemoveProps {
  address: string;
  getHandler: AnyFunction;
  removeHandler: AnyFunction;
}
