import React from "react"
import {render as testingLibraryRenderer} from '@testing-library/react'

import {PageflowTooltip} from "frontend/PageflowTooltip";

describe("PageflowTooltip", () => {
  const render = props =>
    testingLibraryRenderer(
      <PageflowTooltip fixed={props.fixed} content={props.content} closeOther={props.closeOther} classWhenOpen={props.classWhenOpen}>
        <button data-testid={props.triggerId || 'tooltip_trigger'} >Tooltip trigger</button>
      </PageflowTooltip>
    )

  it("should render the content", () => {
    const wrapper = render({
      content: <p data-testid='tooltip_content'>tooltip content</p>
    })
    expect(wrapper.getByTestId('tooltip_content')).toBeDefined();
  });
});
