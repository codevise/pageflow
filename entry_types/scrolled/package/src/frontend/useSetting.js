import {useState, useEffect, useCallback} from 'react';

import {settings} from 'pageflow/frontend';

export function useSetting(name) {
  const [value, setValue] = useState(settings.get(name));

  useEffect(() => {
    function update() {
      setValue(settings.get(name));
    }

    settings.on(`change:${name}`, update)

    return () => settings.off(undefined, update);
  }, [setValue, name]);

  const setter = useCallback(value => settings.set(name, value), [name]);

  return [value, setter];
}
