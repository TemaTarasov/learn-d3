import { set, get } from 'lodash';

import { Component, Props as ComponentProps } from './component.d';

export type Props = ComponentProps;

export default class extends Component<Props> {
  readonly set = <_, Data>(path: string, data: Data): Data => {
    set(this, path, data);

    return this.get(path);
  };

  readonly get = (path: string): any => get(this, path);
}
