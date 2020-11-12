import React from "react"
import {render as testingLibraryRenderer} from '@testing-library/react'

import {Tooltip} from "frontend/Tooltip";

describe("Tooltip", () => {
  const render = props =>
    testingLibraryRenderer(
      <Tooltip fixed={props.fixed} content={props.content} closeOther={props.closeOther} classWhenOpen={props.classWhenOpen}>
        <button data-testid={props.triggerId || 'tooltip_trigger'} >Tooltip trigger</button>
      </Tooltip>
    )

  it("should render the content", () => {
    const wrapper = render({
      content: <p data-testid='tooltip_content'>tooltip content</p>
    })
    expect(wrapper.getByTestId('tooltip_content')).toBeDefined();
  });
});
