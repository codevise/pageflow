import {act} from '@testing-library/react-hooks';
import {tick} from "support";

export async function asyncHandlingOf(callback) {
  await act(async () => {
    callback();
    // Ensure React update triggered by async handling of message is
    // wrapped in act
    await tick();
  });
}